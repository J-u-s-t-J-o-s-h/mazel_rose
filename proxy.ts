import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Optional site-wide password protection.
 * Enable with ENABLE_SITE_PASSWORD=true and SITE_PASSWORD=<value>.
 * Guests authenticate via /api/site-auth or the gate form cookie.
 */
export function proxy(request: NextRequest) {
  const enabled = process.env.ENABLE_SITE_PASSWORD === "true";
  const password = process.env.SITE_PASSWORD;

  if (!enabled || !password) {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/icons") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/admin") ||
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
