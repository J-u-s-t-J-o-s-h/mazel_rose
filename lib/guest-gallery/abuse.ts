import "server-only";

import { createHash } from "node:crypto";
import { GuestGalleryError, rest } from "@/lib/guest-gallery/supabase";

const SHORT_WINDOW_MS = 10 * 60 * 1000;
const SHORT_LIMIT = 10;
const DAY_WINDOW_MS = 24 * 60 * 60 * 1000;
const DAY_LIMIT = 40;

export async function assertGuestGalleryRateLimit(request: Request): Promise<void> {
  const key = await rateKey(request);
  const now = Date.now();
  const dayAgo = new Date(now - DAY_WINDOW_MS).toISOString();
  const shortAgo = new Date(now - SHORT_WINDOW_MS).toISOString();

  await rest(
    `guest_gallery_rate_events?created_at=lt.${encodeURIComponent(new Date(now - DAY_WINDOW_MS * 2).toISOString())}`,
    { method: "DELETE", prefer: "return=minimal" },
  ).catch((error) => {
    console.error("Guest gallery rate cleanup failed", error);
  });

  const [dayCount, shortCount] = await Promise.all([
    countEvents(key, dayAgo),
    countEvents(key, shortAgo),
  ]);

  if (shortCount >= SHORT_LIMIT || dayCount >= DAY_LIMIT) {
    throw new GuestGalleryError(
      "Too many memories were shared from this connection. Please wait a little while and try again.",
      429,
    );
  }
}

export async function recordGuestGalleryAttempt(request: Request): Promise<void> {
  const key = await rateKey(request);
  await rest("guest_gallery_rate_events", {
    method: "POST",
    prefer: "return=minimal",
    body: JSON.stringify({ key_hash: key }),
  });
}

async function countEvents(key: string, since: string): Promise<number> {
  const rows = await rest<Array<{ id: number }>>(
    `guest_gallery_rate_events?key_hash=eq.${encodeURIComponent(key)}&created_at=gte.${encodeURIComponent(since)}&select=id&limit=${DAY_LIMIT + 1}`,
  );
  return rows.length;
}

async function rateKey(request: Request): Promise<string> {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const ip = forwarded || request.headers.get("x-real-ip") || "unknown";
  const salt =
    process.env.STUDIO_SESSION_SECRET ||
    process.env.SUPABASE_SECRET_KEY ||
    "guest-gallery";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex");
}

export async function assertTurnstile(token: string | undefined): Promise<void> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return;
  if (!token) {
    throw new GuestGalleryError("Please confirm you are a guest and try again.");
  }

  const body = new URLSearchParams({ secret, response: token });
  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body,
  });
  if (!response.ok) {
    console.error("Turnstile verification request failed", response.status);
    throw new GuestGalleryError("Please confirm you are a guest and try again.");
  }
  const result = (await response.json()) as { success?: boolean };
  if (!result.success) {
    throw new GuestGalleryError("Please confirm you are a guest and try again.");
  }
}
