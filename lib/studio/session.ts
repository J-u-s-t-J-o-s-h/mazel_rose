import type { StudioRole, StudioSession } from "./types";
import { STUDIO_ROLES } from "./types";

export const STUDIO_SESSION_COOKIE = "studio_session";
export const STUDIO_SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

function getSecret(): string | null {
  const secret = process.env.STUDIO_SESSION_SECRET;
  return secret && secret.length >= 16 ? secret : null;
}

function bytesToBase64Url(bytes: ArrayBuffer | Uint8Array): string {
  const array = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let binary = "";
  for (const byte of array) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlToBytes(value: string): Uint8Array {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  const withPad = padded + "=".repeat((4 - (padded.length % 4)) % 4);
  const binary = atob(withPad);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function timingSafeEqualBytes(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a[i] ^ b[i];
  return diff === 0;
}

async function importHmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
}

async function sign(payload: string, secret: string): Promise<string> {
  const key = await importHmacKey(secret);
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(payload),
  );
  return bytesToBase64Url(signature);
}

function isRole(value: unknown): value is StudioRole {
  return typeof value === "string" && STUDIO_ROLES.includes(value as StudioRole);
}

export async function createSessionToken(
  session: Omit<StudioSession, "exp">,
): Promise<string> {
  const secret = getSecret();
  if (!secret) {
    throw new Error("STUDIO_SESSION_SECRET is not configured.");
  }

  const payload: StudioSession = {
    ...session,
    exp: Math.floor(Date.now() / 1000) + STUDIO_SESSION_MAX_AGE_SECONDS,
  };
  const encoded = bytesToBase64Url(new TextEncoder().encode(JSON.stringify(payload)));
  const signature = await sign(encoded, secret);
  return `${encoded}.${signature}`;
}

export async function verifySessionToken(
  token: string | undefined | null,
): Promise<StudioSession | null> {
  if (!token) return null;
  const secret = getSecret();
  if (!secret) return null;

  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) return null;

  const expected = await sign(encoded, secret);
  const actualBytes = base64UrlToBytes(signature);
  const expectedBytes = base64UrlToBytes(expected);
  if (!timingSafeEqualBytes(actualBytes, expectedBytes)) return null;

  try {
    const json = new TextDecoder().decode(base64UrlToBytes(encoded));
    const parsed = JSON.parse(json) as Partial<StudioSession>;
    if (
      typeof parsed.userId !== "string" ||
      typeof parsed.email !== "string" ||
      typeof parsed.name !== "string" ||
      !isRole(parsed.role) ||
      typeof parsed.exp !== "number"
    ) {
      return null;
    }
    if (parsed.exp < Math.floor(Date.now() / 1000)) return null;
    return {
      userId: parsed.userId,
      email: parsed.email,
      name: parsed.name,
      role: parsed.role,
      exp: parsed.exp,
    };
  } catch {
    return null;
  }
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: STUDIO_SESSION_MAX_AGE_SECONDS,
  };
}
