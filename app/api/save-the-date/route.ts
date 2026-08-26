import { NextResponse } from "next/server";
import { saveTheDateCookieOptions, SAVE_THE_DATE_COOKIE } from "@/lib/save-the-date/cookie";
import { getSaveTheDateProvider } from "@/lib/save-the-date/provider";
import { saveTheDateSchema } from "@/lib/save-the-date/schema";

export const runtime = "nodejs";

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

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Please check the form and try again." },
        { status: 400 },
      );
    }
    const parsed = saveTheDateSchema.safeParse(body);

    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0]?.message;
      return NextResponse.json(
        {
          success: false,
          error: firstIssue || "Please check the form and try again.",
        },
        { status: 400 },
      );
    }

    if (parsed.data.website) {
      return NextResponse.json({ success: true, id: "ok" });
    }

    const attendance = parsed.data.attendance;
    const partySize =
      attendance === "attending"
        ? Math.floor(Number(parsed.data.partySize))
        : 0;

    const provider = getSaveTheDateProvider();
    const result = await provider.submit({
      guestName: parsed.data.guestName,
      attendance,
      partySize,
      guestNames: attendance === "attending" ? parsed.data.guestNames?.trim() || "" : "",
      additionalNotes:
        attendance === "attending" ? parsed.data.additionalNotes?.trim() || "" : "",
      streetAddress: parsed.data.streetAddress,
      addressLine2: parsed.data.addressLine2?.trim() || "",
      city: parsed.data.city,
      state: parsed.data.state,
      zipCode: parsed.data.zipCode,
    });

    if (!result.success) {
      return NextResponse.json(result, { status: 502 });
    }

    const response = NextResponse.json(result, { status: 201 });
    response.cookies.set(
      SAVE_THE_DATE_COOKIE,
      "1",
      saveTheDateCookieOptions,
    );
    return response;
  } catch {
    return NextResponse.json(
      { success: false, error: "We couldn’t save your response just now. Please try again." },
      { status: 500 },
    );
  }
}
