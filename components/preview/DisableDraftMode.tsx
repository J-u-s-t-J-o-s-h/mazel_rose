"use client";

import { usePathname } from "next/navigation";
import { useIsPresentationTool } from "next-sanity/hooks";
import { useIsEmbeddedFrame } from "./useIsEmbeddedFrame";

export function DisableDraftMode() {
  const pathname = usePathname();
  const isPresentationTool = useIsPresentationTool();
  const embedded = useIsEmbeddedFrame();

  if (
    isPresentationTool === true ||
    embedded ||
    pathname?.startsWith("/studio") ||
    pathname?.startsWith("/admin")
  ) {
    return null;
  }

  return (
    <a
      href="/api/draft-mode/disable"
      className="fixed bottom-4 right-4 z-[80] rounded-sm border border-brass/50 bg-burgundy px-4 py-2 text-xs uppercase tracking-[0.16em] text-ivory shadow-[var(--shadow-lift)] transition hover:bg-peacock"
    >
      Exit Preview
    </a>
  );
}
