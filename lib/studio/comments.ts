import type { StudioChange, StudioComment, StudioSession } from "./types";
import { readStudioVault, updateStudioVault } from "./vault";

function matchesFilters(
  comment: StudioComment,
  filters?: { pageKey?: string; sectionKey?: string; itemId?: string },
): boolean {
  if (filters?.pageKey && comment.pageKey !== filters.pageKey) return false;
  if (filters?.sectionKey && comment.sectionKey !== filters.sectionKey) {
    return false;
  }
  if (filters?.itemId && comment.itemId !== filters.itemId) return false;
  return true;
}

export async function listComments(filters?: {
  pageKey?: string;
  sectionKey?: string;
  itemId?: string;
}): Promise<StudioComment[]> {
  const vault = await readStudioVault();
  return vault.comments
    .filter((comment) => matchesFilters(comment, filters))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function countOpenCommentsByPage(): Promise<Record<string, number>> {
  const vault = await readStudioVault();
  const counts: Record<string, number> = {};
  for (const comment of vault.comments) {
    if (comment.resolved) continue;
    counts[comment.pageKey] = (counts[comment.pageKey] || 0) + 1;
  }
  return counts;
}

export async function createComment(input: {
  pageKey: string;
  sectionKey?: string;
  itemId?: string;
  body: string;
  author: StudioSession;
}): Promise<StudioComment> {
  const createdAt = new Date().toISOString();
  const comment: StudioComment = {
    _id: crypto.randomUUID(),
    pageKey: input.pageKey,
    sectionKey: input.sectionKey,
    itemId: input.itemId,
    body: input.body.trim(),
    authorId: input.author.userId,
    authorName: input.author.name,
    authorRole: input.author.role,
    createdAt,
    resolved: false,
  };

  await updateStudioVault((vault) => {
    vault.comments.unshift(comment);
  });

  return comment;
}

export async function setCommentResolved(
  commentId: string,
  resolved: boolean,
): Promise<void> {
  await updateStudioVault((vault) => {
    const comment = vault.comments.find((item) => item._id === commentId);
    if (!comment) throw new Error("Comment not found.");
    comment.resolved = resolved;
  });
}

export async function recordChange(input: {
  documentId: string;
  documentType: string;
  pageKey: string;
  sectionKey?: string;
  itemId?: string;
  action: StudioChange["action"];
  summary: string;
  author: StudioSession;
  revisionId?: string;
}): Promise<void> {
  const change: StudioChange = {
    _id: crypto.randomUUID(),
    documentId: input.documentId,
    documentType: input.documentType,
    pageKey: input.pageKey,
    sectionKey: input.sectionKey,
    itemId: input.itemId,
    action: input.action,
    summary: input.summary,
    authorId: input.author.userId,
    authorName: input.author.name,
    authorRole: input.author.role,
    createdAt: new Date().toISOString(),
    revisionId: input.revisionId,
  };

  await updateStudioVault((vault) => {
    vault.changes.unshift(change);
    vault.changes = vault.changes.slice(0, 400);
  });
}

export async function listChanges(limit = 80): Promise<StudioChange[]> {
  const vault = await readStudioVault();
  return vault.changes
    .slice()
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, limit);
}

export async function listChangesForDocument(
  documentId: string,
): Promise<StudioChange[]> {
  const vault = await readStudioVault();
  return vault.changes
    .filter((change) => change.documentId === documentId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 40);
}
