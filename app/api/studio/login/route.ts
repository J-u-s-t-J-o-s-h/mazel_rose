import { NextResponse } from "next/server";
import { consumeLoginAttempt } from "@/lib/studio/rate-limit";
import { isStudioConfigured } from "@/lib/studio/clients";
import { authenticateStudioUser, issueSession, studioCookieHeader } from "@/lib/studio/users";

export const runtime = "nodejs";

const GENERIC_ERROR = "Those details did not match a studio account.";

export async function POST(request: Request) {
  if (!isStudioConfigured()) {
    return NextResponse.json(
      { success: false, error: "Studio is not configured yet. See docs/studio-setup.md." },
      { status: 503 },
    );
  }

  const forwarded = request.headers.get("x-forwarded-for") || "local";
  const ip = forwarded.split(",")[0]?.trim() || "local";

  let email = "";
  let password = "";
  try {
    const body = (await request.json()) as { email?: string; password?: string };
    email = String(body.email || "");
    password = String(body.password || "");
  } catch {
    return NextResponse.json(
      { success: false, error: GENERIC_ERROR },
      { status: 400 },
    );
  }

  if (!consumeLoginAttempt(`${ip}:${email.toLowerCase()}`)) {
    return NextResponse.json(
      { success: false, error: "Too many attempts. Wait a few minutes and try again." },
      { status: 429 },
    );
  }

  try {
    const session = await authenticateStudioUser(email, password);
    if (!session) {
      return NextResponse.json(
        { success: false, error: GENERIC_ERROR },
        { status: 401 },
      );
    }

    const token = await issueSession(session);
    const response = NextResponse.json({ success: true });
    const cookie = studioCookieHeader(token);
    response.cookies.set(cookie.name, cookie.value, {
      httpOnly: cookie.httpOnly,
      sameSite: cookie.sameSite,
      secure: cookie.secure,
      path: cookie.path,
      maxAge: cookie.maxAge,
    });
    return response;
  } catch {
    return NextResponse.json(
      {
        success: false,
        error:
          "Studio could not save or read its account data. Confirm SANITY_API_WRITE_TOKEN can write to the production dataset. See docs/studio-setup.md.",
      },
      { status: 503 },
    );
  }
}
