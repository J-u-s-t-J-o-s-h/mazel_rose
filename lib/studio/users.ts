import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  STUDIO_SESSION_COOKIE,
  createSessionToken,
  sessionCookieOptions,
  verifySessionToken,
} from "./session";
import type { StudioSession } from "./types";

export {
  authenticateStudioUser,
  bootstrapOwnerFromEnv,
  createStudioUser,
  findUserByEmail,
  listStudioUsers,
  setStudioUserPassword,
  updateStudioUser,
} from "./user-store";

export async function getStudioSession(): Promise<StudioSession | null> {
  const store = await cookies();
  return verifySessionToken(store.get(STUDIO_SESSION_COOKIE)?.value);
}

export async function requireStudioUser(
  nextPath?: string,
): Promise<StudioSession> {
  const session = await getStudioSession();
  if (session) return session;
  const suffix = nextPath ? `?next=${encodeURIComponent(nextPath)}` : "";
  redirect(`/studio/login${suffix}`);
}

export function studioCookieHeader(token: string) {
  return {
    name: STUDIO_SESSION_COOKIE,
    value: token,
    ...sessionCookieOptions(),
  };
}

export async function issueSession(session: Omit<StudioSession, "exp">) {
  return createSessionToken(session);
}
