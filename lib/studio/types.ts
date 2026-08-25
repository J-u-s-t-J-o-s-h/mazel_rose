export const STUDIO_ROLES = ["owner", "editor", "reviewer"] as const;

export type StudioRole = (typeof STUDIO_ROLES)[number];

export type StudioSession = {
  userId: string;
  email: string;
  name: string;
  role: StudioRole;
  exp: number;
};

export type StudioUser = {
  _id: string;
  email: string;
  name: string;
  role: StudioRole;
  active: boolean;
  createdAt: string;
};

export type StoredUser = StudioUser & { passwordHash: string };

export type StudioComment = {
  _id: string;
  pageKey: string;
  sectionKey?: string;
  itemId?: string;
  body: string;
  authorId: string;
  authorName: string;
  authorRole: StudioRole;
  createdAt: string;
  resolved: boolean;
};

export type StudioChange = {
  _id: string;
  documentId: string;
  documentType: string;
  pageKey: string;
  sectionKey?: string;
  itemId?: string;
  action: "draft" | "publish" | "restore" | "create" | "delete";
  summary: string;
  authorId: string;
  authorName: string;
  authorRole: StudioRole;
  createdAt: string;
  revisionId?: string;
};

export type ActionResult =
  | { ok: true; id?: string; message?: string }
  | { ok: false; error: string };
