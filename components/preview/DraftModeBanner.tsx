"use client";

import { usePathname } from "next/navigation";
import { useIsEmbeddedFrame } from "./useIsEmbeddedFrame";

export function DraftModeBanner() {
  const pathname = usePathname();
  const embedded = useIsEmbeddedFrame();
  if (embedded || pathname?.startsWith("/studio") || pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 top-0 z-[70] bg-burgundy px-4 py-2 text-center text-xs uppercase tracking-[0.18em] text-ivory">
      Preview mode — unpublished changes may be visible.{" "}
      <a href="/api/draft-mode/disable" className="underline hover:text-champagne">
        Exit preview
      </a>
    </div>
  );
}
