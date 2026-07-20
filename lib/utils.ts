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

export function getSiteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "http://localhost:3000"
  );
}

export function shouldNoIndex(): boolean {
  return process.env.NEXT_PUBLIC_NOINDEX === "true";
}
