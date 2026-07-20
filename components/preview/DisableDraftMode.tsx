"use client";

import { useIsPresentationTool } from "next-sanity/hooks";

export function DisableDraftMode() {
  const isPresentationTool = useIsPresentationTool();

  if (isPresentationTool === true) return null;

  return (
    <a
      href="/api/draft-mode/disable"
      className="fixed bottom-4 right-4 z-[80] rounded-sm border border-brass/50 bg-burgundy px-4 py-2 text-xs uppercase tracking-[0.16em] text-ivory shadow-[var(--shadow-lift)] transition hover:bg-peacock"
    >
      Exit Preview
    </a>
  );
}
