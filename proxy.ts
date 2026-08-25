import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySessionToken } from "@/lib/studio/session";

function isPublicStudioPath(pathname: string): boolean {
  return pathname === "/studio/login" || pathname === "/api/studio/login";
}

function isStudioPath(pathname: string): boolean {
  return pathname.startsWith("/studio") || pathname.startsWith("/api/studio");
}

/**
 * Optional site-wide password protection.
 * Enable with ENABLE_SITE_PASSWORD=true and SITE_PASSWORD=<value>.
 * Guests authenticate via /api/site-auth or the gate form cookie.
 *
 * /studio is gated by signed studio sessions, not the guest password.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    const studio = request.nextUrl.clone();
    studio.pathname = "/studio";
    studio.search = "";
    return NextResponse.redirect(studio);
  }

  if (isStudioPath(pathname) && !isPublicStudioPath(pathname)) {
    const token = request.cookies.get("studio_session")?.value;
    const session = await verifySessionToken(token);
    if (!session) {
      if (pathname.startsWith("/api/studio")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      const login = request.nextUrl.clone();
      login.pathname = "/studio/login";
      login.search = `?next=${encodeURIComponent(pathname)}`;
      return NextResponse.redirect(login);
    }
  }

  const enabled = process.env.ENABLE_SITE_PASSWORD === "true";
  const password = process.env.SITE_PASSWORD;

  if (!enabled || !password) {
    return NextResponse.next();
  }

  const studioToken = request.cookies.get("studio_session")?.value;
  if (await verifySessionToken(studioToken)) {
    return NextResponse.next();
  }

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/icons") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/studio") ||
    pathname.startsWith("/api/studio") ||
    pathname.startsWith("/api/draft-mode") ||
    pathname.startsWith("/api/revalidate") ||
    pathname === "/api/site-auth" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml"
  ) {
    return NextResponse.next();
  }

  const cookie = request.cookies.get("site_access")?.value;
  if (cookie === password) {
    return NextResponse.next();
  }

  if (pathname === "/gate" || pathname.startsWith("/api/rsvp")) {
    return NextResponse.next();
  }

  const gateUrl = request.nextUrl.clone();
  gateUrl.pathname = "/gate";
  gateUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(gateUrl);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
