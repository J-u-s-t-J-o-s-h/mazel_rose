"use server";

import { revalidatePath } from "next/cache";
import { isStudioConfigured, publishedId } from "./clients";
import {
  createListDraft,
  deleteDocument,
  publishDocument,
  restoreRevision,
  saveDraftDocument,
  uploadProductionImage,
} from "./content";
import { createComment, recordChange, setCommentResolved } from "./comments";
import { assertRole, canManageTeam } from "./permissions";
import { getStudioSection } from "./registry";
import type { StudioField } from "./registry";
import {
  createStudioUser,
  findUserByEmail,
  getStudioSession,
  listStudioUsers,
  setStudioUserPassword,
  updateStudioUser,
} from "./users";
import type { ActionResult, StudioRole } from "./types";
import { STUDIO_ROLES } from "./types";
import { verifyPassword } from "./password";

async function requireUser() {
  const session = await getStudioSession();
  if (!session) {
    throw new Error("Please sign in to continue.");
  }
  if (!isStudioConfigured()) {
    throw new Error("Studio is not fully configured. See docs/studio-setup.md.");
  }
  return session;
}

function fail(error: unknown): ActionResult {
  return {
    ok: false,
    error: error instanceof Error ? error.message : "Something went wrong.",
  };
}

function pickFieldValues(
  values: Record<string, unknown>,
  fields: StudioField[],
): Record<string, unknown> {
  const next: Record<string, unknown> = {};
  for (const field of fields) {
    if (!(field.name in values)) continue;
    const value = values[field.name];
    if (
      (field.type === "url" || field.type === "email" || field.type === "string" || field.type === "text") &&
      value === ""
    ) {
      next[field.name] = undefined;
      continue;
    }
    next[field.name] = value;
  }
  return next;
}

export async function saveDraftAction(input: {
  pageKey: string;
  sectionKey: string;
  documentId: string;
  values: Record<string, unknown>;
  quiet?: boolean;
}): Promise<ActionResult> {
  try {
    const user = await requireUser();
    assertRole(user, ["owner", "editor"]);
    const found = getStudioSection(input.pageKey, input.sectionKey);
    if (!found) throw new Error("Unknown page or section.");
    const values = pickFieldValues(input.values, found.section.fields);
    const result = await saveDraftDocument(
      found.section.documentType,
      input.documentId,
      values,
    );
    if (!input.quiet) {
      await recordChange({
        documentId: result.id,
        documentType: found.section.documentType,
        pageKey: input.pageKey,
        sectionKey: input.sectionKey,
        itemId: found.section.kind === "list" ? result.id : undefined,
        action: "draft",
        summary: `Saved draft of ${found.section.title}`,
        author: user,
        revisionId: result.rev,
      });
    }
    revalidatePath(found.section.previewPath);
    revalidatePath("/studio");
    revalidatePath(`/studio/${input.pageKey}`);
    revalidatePath(`/studio/${input.pageKey}/${input.sectionKey}`);
    return { ok: true, id: result.id, message: "Draft saved." };
  } catch (error) {
    return fail(error);
  }
}

export async function publishAction(input: {
  pageKey: string;
  sectionKey: string;
  documentId: string;
}): Promise<ActionResult> {
  try {
    const user = await requireUser();
    assertRole(user, ["owner", "editor"]);
    const found = getStudioSection(input.pageKey, input.sectionKey);
    if (!found) throw new Error("Unknown page or section.");
    await publishDocument(input.documentId);
    await recordChange({
      documentId: publishedId(input.documentId),
      documentType: found.section.documentType,
      pageKey: input.pageKey,
      sectionKey: input.sectionKey,
      action: "publish",
      summary: `Published ${found.section.title}`,
      author: user,
    });
    revalidatePath(found.section.previewPath);
    revalidatePath("/studio");
    return { ok: true, message: "Published. The live site will update shortly." };
  } catch (error) {
    return fail(error);
  }
}

export async function restoreAction(input: {
  pageKey: string;
  sectionKey: string;
  documentId: string;
  revisionId: string;
}): Promise<ActionResult> {
  try {
    const user = await requireUser();
    assertRole(user, ["owner"]);
    const found = getStudioSection(input.pageKey, input.sectionKey);
    if (!found) throw new Error("Unknown page or section.");
    await restoreRevision(input.documentId, input.revisionId);
    await recordChange({
      documentId: publishedId(input.documentId),
      documentType: found.section.documentType,
      pageKey: input.pageKey,
      sectionKey: input.sectionKey,
      action: "restore",
      summary: `Restored a previous version of ${found.section.title}`,
      author: user,
      revisionId: input.revisionId,
    });
    revalidatePath("/studio");
    return {
      ok: true,
      message: "Version restored as a draft. Preview it, then publish.",
    };
  } catch (error) {
    return fail(error);
  }
}

export async function createItemAction(input: {
  pageKey: string;
  sectionKey: string;
}): Promise<ActionResult> {
  try {
    const user = await requireUser();
    assertRole(user, ["owner", "editor"]);
    const found = getStudioSection(input.pageKey, input.sectionKey);
    if (!found || found.section.kind !== "list") {
      throw new Error("This section does not support new items.");
    }
    const id = await createListDraft(found.section.documentType, {
      [found.section.titleField]: "Untitled",
    });
    await recordChange({
      documentId: id,
      documentType: found.section.documentType,
      pageKey: input.pageKey,
      sectionKey: input.sectionKey,
      itemId: id,
      action: "create",
      summary: `Created a new ${found.section.title} item`,
      author: user,
    });
    return { ok: true, id, message: "Draft item created." };
  } catch (error) {
    return fail(error);
  }
}

export async function deleteItemAction(input: {
  pageKey: string;
  sectionKey: string;
  documentId: string;
}): Promise<ActionResult> {
  try {
    const user = await requireUser();
    assertRole(user, ["owner"]);
    const found = getStudioSection(input.pageKey, input.sectionKey);
    if (!found) throw new Error("Unknown page or section.");
    await deleteDocument(input.documentId);
    await recordChange({
      documentId: publishedId(input.documentId),
      documentType: found.section.documentType,
      pageKey: input.pageKey,
      sectionKey: input.sectionKey,
      itemId: publishedId(input.documentId),
      action: "delete",
      summary: `Deleted an item from ${found.section.title}`,
      author: user,
    });
    revalidatePath("/studio");
    revalidatePath(`/studio/${input.pageKey}/${input.sectionKey}`);
    return { ok: true, message: "Item deleted." };
  } catch (error) {
    return fail(error);
  }
}

export async function uploadImageAction(formData: FormData): Promise<
  | { ok: true; image: Awaited<ReturnType<typeof uploadProductionImage>> }
  | { ok: false; error: string }
> {
  try {
    const user = await requireUser();
    assertRole(user, ["owner", "editor"]);
    const file = formData.get("file");
    if (!(file instanceof File) || file.size === 0) {
      throw new Error("Choose an image to upload.");
    }
    if (file.size > 4 * 1024 * 1024) {
      throw new Error("Images must be 4 MB or smaller for this editor.");
    }
    const alt = String(formData.get("alt") || "");
    const image = await uploadProductionImage(file, alt);
    return { ok: true, image };
  } catch (error) {
    return fail(error) as { ok: false; error: string };
  }
}

export async function addCommentAction(input: {
  pageKey: string;
  sectionKey?: string;
  itemId?: string;
  body: string;
}): Promise<ActionResult> {
  try {
    const user = await requireUser();
    if (!input.body.trim()) throw new Error("Write a comment first.");
    await createComment({
      pageKey: input.pageKey,
      sectionKey: input.sectionKey,
      itemId: input.itemId,
      body: input.body,
      author: user,
    });
    revalidatePath("/studio/comments");
    if (input.sectionKey) {
      revalidatePath(`/studio/${input.pageKey}/${input.sectionKey}`);
    }
    return { ok: true, message: "Comment added." };
  } catch (error) {
    return fail(error);
  }
}

export async function resolveCommentAction(
  commentId: string,
  resolved: boolean,
): Promise<ActionResult> {
  try {
    await requireUser();
    await setCommentResolved(commentId, resolved);
    revalidatePath("/studio/comments");
    return { ok: true };
  } catch (error) {
    return fail(error);
  }
}

export async function createTeamUserAction(input: {
  email: string;
  name: string;
  role: StudioRole;
  password: string;
}): Promise<ActionResult> {
  try {
    const user = await requireUser();
    if (!canManageTeam(user.role)) {
      throw new Error("Only the owner can add people.");
    }
    if (!STUDIO_ROLES.includes(input.role)) {
      throw new Error("Choose a valid role.");
    }
    if (input.password.length < 10) {
      throw new Error("Passwords must be at least 10 characters.");
    }
    await createStudioUser(input);
    revalidatePath("/studio/team");
    return { ok: true, message: "Person added. Share the password privately." };
  } catch (error) {
    return fail(error);
  }
}

export async function updateTeamUserAction(input: {
  userId: string;
  role?: StudioRole;
  active?: boolean;
  name?: string;
}): Promise<ActionResult> {
  try {
    const user = await requireUser();
    if (!canManageTeam(user.role)) {
      throw new Error("Only the owner can manage the team.");
    }
    if (input.userId === user.userId && input.active === false) {
      throw new Error("You cannot disable your own account.");
    }
    if (input.userId === user.userId && input.role && input.role !== "owner") {
      const owners = (await listStudioUsers()).filter(
        (member) => member.role === "owner" && member.active !== false,
      );
      if (owners.length < 2) {
        throw new Error("There must be at least one owner.");
      }
    }
    await updateStudioUser(input.userId, {
      role: input.role,
      active: input.active,
      name: input.name,
    });
    revalidatePath("/studio/team");
    return { ok: true, message: "Team member updated." };
  } catch (error) {
    return fail(error);
  }
}

export async function changePasswordAction(input: {
  currentPassword: string;
  nextPassword: string;
}): Promise<ActionResult> {
  try {
    const user = await requireUser();
    if (input.nextPassword.length < 10) {
      throw new Error("New passwords must be at least 10 characters.");
    }
    const stored = await findUserByEmail(user.email);
    if (!stored) throw new Error("Account not found.");
    const matches = await verifyPassword(input.currentPassword, stored.passwordHash);
    if (!matches) throw new Error("Current password is incorrect.");
    await setStudioUserPassword(user.userId, input.nextPassword);
    return { ok: true, message: "Password updated." };
  } catch (error) {
    return fail(error);
  }
}

