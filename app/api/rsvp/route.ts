import { NextResponse } from "next/server";
import { getRsvpProvider } from "@/lib/rsvp/provider";
import { rsvpSchema } from "@/lib/rsvp/schema";

const rateMap = new Map<string, { count: number; resetAt: number }>();

function getClientKey(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "anonymous"
  );
}

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const windowMs = 60_000;
  const max = 8;
  const current = rateMap.get(key);

  if (!current || current.resetAt < now) {
    rateMap.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }

  current.count += 1;
  rateMap.set(key, current);
  return current.count > max;
}

export async function POST(request: Request) {
  try {
    const clientKey = getClientKey(request);
    if (isRateLimited(clientKey)) {
      return NextResponse.json(
        { success: false, error: "Too many requests. Please try again shortly." },
        { status: 429 },
      );
    }

    const body = await request.json();
    const parsed = rsvpSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Please check the form and try again.",
          issues: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    // Honeypot — silently accept bots without storing
    if (parsed.data.website) {
      return NextResponse.json({ success: true, id: "ok" });
    }

    const secret = process.env.RSVP_SECRET;
    if (secret) {
      const provided = request.headers.get("x-rsvp-secret");
      if (provided !== secret) {
        return NextResponse.json(
          { success: false, error: "Unauthorized RSVP request." },
          { status: 401 },
        );
      }
    }

    const provider = getRsvpProvider();
    const result = await provider.submit({
      ...parsed.data,
      phone: parsed.data.phone || undefined,
      invitationCode: parsed.data.invitationCode || undefined,
      website: undefined,
    });

    if (!result.success) {
      return NextResponse.json(result, { status: 502 });
    }

    return NextResponse.json(result, { status: 201 });
  } catch {
    return NextResponse.json(
      { success: false, error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
