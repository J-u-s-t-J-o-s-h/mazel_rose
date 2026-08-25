import { isStudioConfigured } from "./clients";
import { hashPassword, verifyPassword } from "./password";
import type { StoredUser, StudioRole, StudioSession, StudioUser } from "./types";
import { STUDIO_ROLES } from "./types";
import { readStudioVault, updateStudioVault } from "./vault";

export type { StoredUser } from "./types";

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function userDocumentId(email: string): string {
  const hex = Buffer.from(normalizeEmail(email), "utf8").toString("hex");
  return `studioUser.${hex}`;
}

function publicUser(user: StoredUser): StudioUser {
  return {
    _id: user._id,
    email: user.email,
    name: user.name,
    role: user.role,
    active: user.active,
    createdAt: user.createdAt,
  };
}

export async function findUserByEmail(
  email: string,
): Promise<StoredUser | null> {
  const vault = await readStudioVault();
  return (
    vault.users.find((user) => user.email === normalizeEmail(email)) || null
  );
}

export async function countStudioUsers(): Promise<number> {
  const vault = await readStudioVault();
  return vault.users.length;
}

export async function listStudioUsers(): Promise<StudioUser[]> {
  const vault = await readStudioVault();
  return vault.users
    .slice()
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
    .map(publicUser);
}

export async function authenticateStudioUser(
  email: string,
  password: string,
): Promise<StudioSession | null> {
  const user = await findUserByEmail(email);
  if (!user || user.active === false) return null;
  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) return null;
  if (!STUDIO_ROLES.includes(user.role)) return null;
  return {
    userId: user._id,
    email: user.email,
    name: user.name,
    role: user.role,
    exp: 0,
  };
}

export async function createStudioUser(input: {
  email: string;
  name: string;
  role: StudioRole;
  password: string;
  active?: boolean;
}): Promise<StudioUser> {
  const email = normalizeEmail(input.email);
  const createdAt = new Date().toISOString();
  const passwordHash = await hashPassword(input.password);

  return updateStudioVault((vault) => {
    if (vault.users.some((user) => user.email === email)) {
      throw new Error("A user with that email already exists.");
    }
    const user: StoredUser = {
      _id: userDocumentId(email),
      email,
      name: input.name.trim(),
      role: input.role,
      passwordHash,
      active: input.active ?? true,
      createdAt,
    };
    vault.users.push(user);
    return publicUser(user);
  });
}

export async function updateStudioUser(
  userId: string,
  patch: Partial<Pick<StudioUser, "name" | "role" | "active">>,
): Promise<void> {
  await updateStudioVault((vault) => {
    const user = vault.users.find((item) => item._id === userId);
    if (!user) throw new Error("That person was not found.");
    if (patch.name !== undefined) user.name = patch.name;
    if (patch.role !== undefined) user.role = patch.role;
    if (patch.active !== undefined) user.active = patch.active;
  });
}

export async function setStudioUserPassword(
  userId: string,
  password: string,
): Promise<void> {
  const passwordHash = await hashPassword(password);
  await updateStudioVault((vault) => {
    const user = vault.users.find((item) => item._id === userId);
    if (!user) throw new Error("Account not found.");
    user.passwordHash = passwordHash;
  });
}

export async function bootstrapOwnerFromEnv(): Promise<{
  created: boolean;
  email?: string;
}> {
  if (!isStudioConfigured()) {
    throw new Error(
      "Studio is not configured. Set STUDIO_SESSION_SECRET (16+ characters).",
    );
  }

  const existing = await countStudioUsers();
  if (existing > 0) {
    return { created: false };
  }

  const email = process.env.STUDIO_OWNER_EMAIL;
  const password = process.env.STUDIO_OWNER_PASSWORD;
  const name = process.env.STUDIO_OWNER_NAME || "Owner";

  if (!email || !password) {
    throw new Error(
      "No studio users exist. Set STUDIO_OWNER_EMAIL and STUDIO_OWNER_PASSWORD to create the first Owner.",
    );
  }

  if (password.length < 10) {
    throw new Error("STUDIO_OWNER_PASSWORD must be at least 10 characters.");
  }

  await createStudioUser({
    email,
    name,
    role: "owner",
    password,
  });

  return { created: true, email: normalizeEmail(email) };
}

export const DEV_STUDIO_USERS = [
  {
    email: "owner@local.test",
    name: "Dev Owner",
    role: "owner" as const,
  },
  {
    email: "editor@local.test",
    name: "Dev Editor",
    role: "editor" as const,
  },
  {
    email: "reviewer@local.test",
    name: "Dev Reviewer",
    role: "reviewer" as const,
  },
];

export async function seedDevStudioUsers(password: string): Promise<string[]> {
  if (password.length < 10) {
    throw new Error("Dev passwords must be at least 10 characters.");
  }
  const created: string[] = [];
  for (const user of DEV_STUDIO_USERS) {
    const existing = await findUserByEmail(user.email);
    if (existing) continue;
    await createStudioUser({
      email: user.email,
      name: user.name,
      role: user.role,
      password,
    });
    created.push(user.email);
  }
  return created;
}
