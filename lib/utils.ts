import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatExternalRel(url: string): string {
  try {
    const hostname = new URL(url).hostname;
    if (hostname.endsWith("mazel.rose")) return "noopener";
  } catch {
    // ignore invalid URLs
  }
  return "noopener noreferrer";
}

/**
 * Canonical public URL for metadata, sitemap, share links, and the Studio URL.
 *
 * A real custom-domain value in NEXT_PUBLIC_SITE_URL always wins. But Vercel's
 * auto-assigned `*.vercel.app` host is deliberately ignored so it can't leak
 * into canonical tags / OG previews once a custom domain is live — that host
 * was the initial value and is easy to leave stale in the dashboard.
 */
export function getSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (configured && !configured.endsWith(".vercel.app")) {
    return configured;
  }
  return process.env.NODE_ENV === "production"
    ? "https://mazelrose.life"
    : "http://localhost:3000";
}

export function shouldNoIndex(): boolean {
  return process.env.NEXT_PUBLIC_NOINDEX === "true";
}
