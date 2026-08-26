import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SAVE_THE_DATE_COOKIE } from "@/lib/save-the-date/cookie";
import { SAVE_THE_DATE_PATH } from "@/lib/save-the-date/paths";

/**
 * Optional site-wide password protection, plus Save the Date completion
 * redirects. Completion is checked here so a returning guest never sees the
 * invitation flash before the homepage.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === SAVE_THE_DATE_PATH) {
    const preview = request.nextUrl.searchParams.get("preview") === "1";
    const completed = request.cookies.get(SAVE_THE_DATE_COOKIE)?.value;
    if (completed && !preview) {
      const home = request.nextUrl.clone();
      home.pathname = "/";
      home.search = "";
      return NextResponse.redirect(home);
    }
  }

  const enabled = process.env.ENABLE_SITE_PASSWORD === "true";
  const password = process.env.SITE_PASSWORD;

  if (!enabled || !password) {
    return NextResponse.next();
  }

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/icons") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/tiffany-cary") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/studio") ||
    pathname.startsWith("/api/draft-mode") ||
    pathname.startsWith("/api/revalidate") ||
    pathname === "/api/site-auth" ||
    pathname === "/api/save-the-date" ||
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
