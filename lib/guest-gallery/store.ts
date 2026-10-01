import "server-only";

import { createHash, randomUUID, timingSafeEqual } from "node:crypto";
import { GUEST_GALLERY_BUCKET } from "@/lib/guest-gallery/limits";
import { identifyMedia } from "@/lib/guest-gallery/magic";
import { GuestGalleryError, rest, storageFetch } from "@/lib/guest-gallery/supabase";

export type ExpectedMedia = {
  path: string;
  mediaType: "image" | "video";
  mimeType: string;
  fileSize: number;
  sortOrder: number;
};

export type SubmissionRow = {
  id: string;
  guest_name: string;
  message: string | null;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  approved_at: string | null;
  rejected_at: string | null;
  upload_token_hash: string | null;
  expected_media: ExpectedMedia[];
};

export type MediaRow = {
  id: string;
  submission_id: string;
  storage_path: string;
  media_type: "image" | "video";
  mime_type: string;
  file_size: number;
  sort_order: number;
};

const SIGNED_READ_SECONDS = 60 * 60;

export function hashUploadToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function tokensMatch(storedHash: string | null, token: string): boolean {
  if (!storedHash) return false;
  const actual = Buffer.from(hashUploadToken(token));
  const expected = Buffer.from(storedHash);
  if (actual.length !== expected.length) return false;
  return timingSafeEqual(actual, expected);
}

export function submissionPrefix(submissionId: string): string {
  return `submissions/${submissionId}`;
}

export function newObjectPath(submissionId: string, extension: string): string {
  return `${submissionPrefix(submissionId)}/${randomUUID()}.${extension}`;
}

export async function insertApprovedNote(input: {
  guestName: string;
  message: string;
}): Promise<SubmissionRow> {
  const rows = await rest<SubmissionRow[]>("guest_gallery_submissions", {
    method: "POST",
    prefer: "return=representation",
    body: JSON.stringify({
      guest_name: input.guestName,
      message: input.message,
      status: "approved",
      approved_at: new Date().toISOString(),
      expected_media: [],
    }),
  });
  const row = rows[0];
  if (!row) {
    throw new GuestGalleryError(
      "Sharing is temporarily unavailable. Please try again later.",
      503,
    );
  }
  return row;
}

export async function insertSubmission(input: {
  guestName: string;
  message: string | null;
  uploadTokenHash: string;
  expectedMedia: ExpectedMedia[];
}): Promise<SubmissionRow> {
  const rows = await rest<SubmissionRow[]>("guest_gallery_submissions", {
    method: "POST",
    prefer: "return=representation",
    body: JSON.stringify({
      guest_name: input.guestName,
      message: input.message,
      status: "pending",
      upload_token_hash: input.uploadTokenHash,
      expected_media: input.expectedMedia,
    }),
  });
  const row = rows[0];
  if (!row) {
    throw new GuestGalleryError(
      "Sharing is temporarily unavailable. Please try again later.",
      503,
    );
  }
  return row;
}

export async function getSubmission(id: string): Promise<SubmissionRow | null> {
  const rows = await rest<SubmissionRow[]>(
    `guest_gallery_submissions?id=eq.${encodeURIComponent(id)}&select=id,guest_name,message,status,created_at,approved_at,rejected_at,upload_token_hash,expected_media&limit=1`,
  );
  return rows[0] ?? null;
}

export async function deleteSubmission(id: string): Promise<void> {
  await rest(
    `guest_gallery_submissions?id=eq.${encodeURIComponent(id)}`,
    { method: "DELETE", prefer: "return=minimal" },
  );
}

export async function updateExpectedMedia(
  id: string,
  expectedMedia: ExpectedMedia[],
): Promise<void> {
  await rest(`guest_gallery_submissions?id=eq.${encodeURIComponent(id)}`, {
    method: "PATCH",
    prefer: "return=minimal",
    body: JSON.stringify({ expected_media: expectedMedia }),
  });
}

export async function clearUploadSecret(id: string): Promise<void> {
  await rest(`guest_gallery_submissions?id=eq.${encodeURIComponent(id)}`, {
    method: "PATCH",
    prefer: "return=minimal",
    body: JSON.stringify({ upload_token_hash: null, expected_media: [] }),
  });
}

export async function insertMedia(rows: Array<Omit<MediaRow, "id">>): Promise<void> {
  if (!rows.length) return;
  await rest("guest_gallery_media", {
    method: "POST",
    prefer: "return=minimal",
    body: JSON.stringify(
      rows.map((row) => ({
        submission_id: row.submission_id,
        storage_path: row.storage_path,
        media_type: row.media_type,
        mime_type: row.mime_type,
        file_size: row.file_size,
        sort_order: row.sort_order,
      })),
    ),
  });
}

export async function setSubmissionStatus(
  id: string,
  status: "approved" | "rejected",
): Promise<SubmissionRow | null> {
  const now = new Date().toISOString();
  const rows = await rest<SubmissionRow[]>(
    `guest_gallery_submissions?id=eq.${encodeURIComponent(id)}&status=eq.pending`,
    {
      method: "PATCH",
      prefer: "return=representation",
      body: JSON.stringify({
        status,
        approved_at: status === "approved" ? now : null,
        rejected_at: status === "rejected" ? now : null,
        upload_token_hash: null,
        expected_media: [],
      }),
    },
  );
  return rows[0] ?? null;
}

type SubmissionWithMedia = SubmissionRow & { guest_gallery_media: MediaRow[] };

export async function listSubmissions(
  status: "pending" | "approved" | "rejected",
): Promise<SubmissionWithMedia[]> {
  return rest<SubmissionWithMedia[]>(
    `guest_gallery_submissions?status=eq.${status}&select=id,guest_name,message,status,created_at,approved_at,rejected_at,guest_gallery_media(id,submission_id,storage_path,media_type,mime_type,file_size,sort_order)&order=created_at.desc`,
  );
}

export async function createSignedUpload(path: string): Promise<{ signedUrl: string; token: string }> {
  const response = await storageFetch(
    `object/upload/sign/${GUEST_GALLERY_BUCKET}/${encodePath(path)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ upsert: false }),
    },
  );
  if (!response.ok) {
    const detail = await response.text();
    console.error("Guest gallery signed upload failed", response.status, detail.slice(0, 400));
    throw new GuestGalleryError(
      "Sharing is temporarily unavailable. Please try again later.",
      503,
    );
  }
  const data = (await response.json()) as { url?: string; signedUrl?: string; token?: string };
  const configUrl = process.env.SUPABASE_URL?.replace(/\/$/, "") ?? "";
  const relative = data.url || data.signedUrl || "";
  const signedUrl = relative.startsWith("http")
    ? relative
    : `${configUrl}/storage/v1${relative.startsWith("/") ? "" : "/"}${relative}`;
  if (!data.token || !signedUrl.startsWith("http")) {
    throw new GuestGalleryError(
      "Sharing is temporarily unavailable. Please try again later.",
      503,
    );
  }
  return { signedUrl, token: data.token };
}

export async function createSignedReadUrl(path: string): Promise<string | null> {
  const response = await storageFetch(
    `object/sign/${GUEST_GALLERY_BUCKET}/${encodePath(path)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ expiresIn: SIGNED_READ_SECONDS }),
    },
  );
  if (!response.ok) {
    console.error("Guest gallery signed read failed", response.status, path);
    return null;
  }
  const data = (await response.json()) as { signedURL?: string; signedUrl?: string };
  const relative = data.signedURL || data.signedUrl || "";
  const configUrl = process.env.SUPABASE_URL?.replace(/\/$/, "") ?? "";
  if (!relative) return null;
  return relative.startsWith("http")
    ? relative
    : `${configUrl}/storage/v1${relative.startsWith("/") ? "" : "/"}${relative}`;
}

const STORED_PATH = /^submissions\/[0-9a-f-]{36}\/[0-9a-f-]{36}\.(jpg|png|webp|mp4|mov)$/i;

export function isStoredGalleryPath(path: string): boolean {
  return STORED_PATH.test(path);
}

export async function openStoredObject(path: string): Promise<Response> {
  if (!isStoredGalleryPath(path)) {
    throw new GuestGalleryError("That upload is no longer in the gallery.", 404);
  }
  const response = await storageFetch(`object/${GUEST_GALLERY_BUCKET}/${encodePath(path)}`);
  if (!response.ok || !response.body) {
    throw new GuestGalleryError("That upload is no longer in the gallery.", 404);
  }
  return response;
}

export async function inspectStoredObject(path: string): Promise<{
  size: number;
  bytes: Uint8Array;
}> {
  const response = await storageFetch(
    `object/${GUEST_GALLERY_BUCKET}/${encodePath(path)}`,
    { headers: { Range: "bytes=0-31" } },
  );
  if (!response.ok && response.status !== 206) {
    throw new GuestGalleryError("One of the files did not finish uploading. Please try again.");
  }
  const size = totalSize(response, path);
  const bytes = new Uint8Array(await response.arrayBuffer());
  return { size, bytes: bytes.slice(0, 32) };
}

export function assertStoredObject(input: {
  expected: ExpectedMedia;
  size: number;
  bytes: Uint8Array;
}): { mimeType: string; fileSize: number } {
  const limit = input.expected.mediaType === "image" ? 15 * 1024 * 1024 : 50 * 1024 * 1024;
  if (!Number.isFinite(input.size) || input.size <= 0 || input.size > limit) {
    throw new GuestGalleryError(
      input.expected.mediaType === "image"
        ? "One photo is larger than 15 MB."
        : "One video is larger than 50 MB.",
    );
  }

  const identified = identifyMedia(input.bytes);
  if ("error" in identified) throw new GuestGalleryError(identified.error);
  if (identified.mediaType !== input.expected.mediaType || identified.mimeType !== input.expected.mimeType) {
    throw new GuestGalleryError("One of the files isn't an allowed photo or short video.");
  }

  return { mimeType: identified.mimeType, fileSize: input.size };
}

export async function deleteStoredPrefix(submissionId: string): Promise<void> {
  const prefix = submissionPrefix(submissionId);
  const list = await storageFetch(`object/list/${GUEST_GALLERY_BUCKET}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prefix, limit: 100, offset: 0 }),
  });
  if (!list.ok) {
    console.error("Guest gallery storage list failed", list.status);
    return;
  }
  const objects = (await list.json()) as Array<{ name?: string }>;
  const paths = objects
    .map((object) => object.name)
    .filter((name): name is string => Boolean(name))
    .map((name) => `${prefix}/${name}`);
  if (!paths.length) return;

  const removed = await storageFetch(`object/${GUEST_GALLERY_BUCKET}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prefixes: paths }),
  });
  if (!removed.ok) {
    console.error("Guest gallery storage delete failed", removed.status);
  }
}

function totalSize(response: Response, path: string): number {
  const range = response.headers.get("content-range");
  const match = range?.match(/\/(\d+)$/);
  if (match) return Number(match[1]);
  const length = Number(response.headers.get("content-length"));
  if (Number.isFinite(length) && length > 32) return length;
  console.error("Guest gallery object size was missing", path);
  throw new GuestGalleryError("One of the files did not finish uploading. Please try again.");
}

function encodePath(path: string): string {
  return path.split("/").map((segment) => encodeURIComponent(segment)).join("/");
}
