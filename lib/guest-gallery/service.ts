import "server-only";

import { randomBytes } from "node:crypto";
import { assertGuestGalleryRateLimit, assertTurnstile, recordGuestGalleryAttempt } from "@/lib/guest-gallery/abuse";
import { validateGuestFiles, validateGuestText } from "@/lib/guest-gallery/limits";
import {
  assertStoredObject,
  createSignedReadUrl,
  createSignedUpload,
  deleteStoredPrefix,
  deleteSubmission,
  getSubmission,
  hashUploadToken,
  insertMedia,
  insertSubmission,
  inspectStoredObject,
  listSubmissions,
  newObjectPath,
  setSubmissionStatus,
  tokensMatch,
  updateExpectedMedia,
  type MediaRow,
} from "@/lib/guest-gallery/store";
import { GuestGalleryError } from "@/lib/guest-gallery/supabase";

import type { PublicMemory, PublicMemoryMedia } from "@/lib/guest-gallery/types";

export type PreparedUpload = {
  clientId: string;
  path: string;
  signedUrl: string;
  token: string;
};

type IncomingFile = {
  clientId?: string;
  name?: string;
  mimeType?: string;
  size?: number;
};

export async function prepareGuestSubmission(
  request: Request,
  body: {
    guestName?: string;
    message?: string;
    website?: string;
    turnstileToken?: string;
    files?: IncomingFile[];
  },
): Promise<{ ignored: true } | { submissionId: string; uploadToken: string; uploads: PreparedUpload[] }> {
  if (typeof body.website === "string" && body.website.trim()) {
    return { ignored: true };
  }

  const text = validateGuestText({
    guestName: String(body.guestName ?? ""),
    message: String(body.message ?? ""),
  });
  if (!text.ok) throw new GuestGalleryError(text.error);

  const files = Array.isArray(body.files) ? body.files : [];
  const classified = validateGuestFiles(
    files.map((file) => ({
      name: String(file.name ?? ""),
      mimeType: String(file.mimeType ?? ""),
      size: Number(file.size),
    })),
  );
  if (!classified.ok) throw new GuestGalleryError(classified.error);

  await assertTurnstile(body.turnstileToken);
  await assertGuestGalleryRateLimit(request);

  const uploadToken = randomBytes(32).toString("hex");
  const submission = await insertSubmission({
    guestName: text.guestName,
    message: text.message,
    uploadTokenHash: hashUploadToken(uploadToken),
    expectedMedia: [],
  });

  const expected = classified.files.map((file, index) => ({
    path: newObjectPath(submission.id, file.extension),
    mediaType: file.mediaType,
    mimeType: file.mimeType,
    fileSize: Number(files[index]?.size),
    sortOrder: index,
  }));

  try {
    await updateExpectedMedia(submission.id, expected);
    const uploads: PreparedUpload[] = [];
    for (let index = 0; index < expected.length; index += 1) {
      const item = expected[index];
      const signed = await createSignedUpload(item.path);
      uploads.push({
        clientId: String(files[index]?.clientId ?? index),
        path: item.path,
        signedUrl: signed.signedUrl,
        token: signed.token,
      });
    }
    await recordGuestGalleryAttempt(request);
    return { submissionId: submission.id, uploadToken, uploads };
  } catch (error) {
    await deleteSubmission(submission.id).catch(() => undefined);
    throw error;
  }
}

export async function finalizeGuestSubmission(input: {
  submissionId: string;
  uploadToken: string;
}): Promise<void> {
  const submission = await requireOwnedPending(input.submissionId, input.uploadToken);
  const expected = Array.isArray(submission.expected_media) ? submission.expected_media : [];
  if (!expected.length) {
    throw new GuestGalleryError("Add at least one photo or short video.");
  }

  try {
    const media: Array<Omit<MediaRow, "id">> = [];
    for (const item of expected) {
      const stored = await inspectStoredObject(item.path);
      const checked = assertStoredObject({
        expected: item,
        size: stored.size,
        bytes: stored.bytes,
      });
      media.push({
        submission_id: submission.id,
        storage_path: item.path,
        media_type: item.mediaType,
        mime_type: checked.mimeType,
        file_size: checked.fileSize,
        sort_order: item.sortOrder,
      });
    }
    await insertMedia(media);
    const published = await setSubmissionStatus(submission.id, "approved");
    if (!published) {
      throw new GuestGalleryError("We couldn't finish saving your memory. Please try again.");
    }
  } catch (error) {
    await deleteStoredPrefix(submission.id);
    await deleteSubmission(submission.id);
    throw error;
  }
}

export async function abandonGuestSubmission(input: {
  submissionId: string;
  uploadToken: string;
}): Promise<void> {
  const submission = await getSubmission(input.submissionId);
  if (!submission || submission.status !== "pending") return;
  if (!tokensMatch(submission.upload_token_hash, input.uploadToken)) return;
  await deleteStoredPrefix(submission.id);
  await deleteSubmission(submission.id);
}

export async function listPublicMemories(): Promise<PublicMemory[]> {
  const rows = await listSubmissions("approved");
  return signMemories(rows);
}

export async function listModerationQueue(): Promise<{
  published: PublicMemory[];
  pending: PublicMemory[];
  rejected: PublicMemory[];
}> {
  const [published, pending, rejected] = await Promise.all([
    listSubmissions("approved"),
    listSubmissions("pending"),
    listSubmissions("rejected"),
  ]);
  return {
    published: await signMemories(published),
    pending: await signMemories(pending),
    rejected: await signMemories(rejected),
  };
}

export async function moderateSubmission(
  id: string,
  action: "approve" | "reject" | "delete",
): Promise<void> {
  if (action === "delete") {
    const submission = await getSubmission(id);
    if (!submission) {
      throw new GuestGalleryError("That memory is no longer in the gallery.");
    }
    await deleteStoredPrefix(id);
    await deleteSubmission(id);
    return;
  }
  const updated = await setSubmissionStatus(id, action === "approve" ? "approved" : "rejected");
  if (!updated) {
    throw new GuestGalleryError("That memory has already been reviewed.");
  }
}

async function requireOwnedPending(submissionId: string, uploadToken: string) {
  const submission = await getSubmission(submissionId);
  if (!submission || submission.status !== "pending" || !tokensMatch(submission.upload_token_hash, uploadToken)) {
    throw new GuestGalleryError("We couldn't finish that upload. Please try again.");
  }
  return submission;
}

async function signMemories(
  rows: Array<{
    id: string;
    guest_name: string;
    message: string | null;
    created_at: string;
    guest_gallery_media?: MediaRow[];
  }>,
): Promise<PublicMemory[]> {
  const memories: PublicMemory[] = [];
  for (const row of rows) {
    const media = [...(row.guest_gallery_media ?? [])].sort((a, b) => a.sort_order - b.sort_order);
    const signed: PublicMemoryMedia[] = [];
    for (const item of media) {
      const url = await createSignedReadUrl(item.storage_path);
      if (!url) continue;
      signed.push({
        id: item.id,
        mediaType: item.media_type,
        mimeType: item.mime_type,
        url,
        sortOrder: item.sort_order,
      });
    }
    if (!signed.length) continue;
    memories.push({
      id: row.id,
      guestName: row.guest_name,
      message: row.message,
      createdAt: row.created_at,
      media: signed,
    });
  }
  return memories;
}
