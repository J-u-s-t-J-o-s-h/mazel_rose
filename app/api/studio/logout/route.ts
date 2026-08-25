import { NextResponse } from "next/server";
import { STUDIO_SESSION_COOKIE } from "@/lib/studio/session";

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(STUDIO_SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  return response;
}
