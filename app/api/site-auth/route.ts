import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const enabled = process.env.ENABLE_SITE_PASSWORD === "true";
  const password = process.env.SITE_PASSWORD;

  if (!enabled || !password) {
    return NextResponse.json(
      { success: false, error: "Password protection is not enabled." },
      { status: 400 },
    );
  }

  const body = (await request.json()) as { password?: string; next?: string };
  if (!body.password || body.password !== password) {
    return NextResponse.json(
      { success: false, error: "Incorrect password." },
      { status: 401 },
    );
  }

  const response = NextResponse.json({
    success: true,
    next: body.next || "/",
  });

  response.cookies.set("site_access", password, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  });

  return response;
}
