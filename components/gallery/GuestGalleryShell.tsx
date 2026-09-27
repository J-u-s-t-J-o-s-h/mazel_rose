"use client";

import { createContext, useContext, useState } from "react";
import { Button } from "@/components/ui/Button";
import { ShareMemoryDialog } from "@/components/gallery/ShareMemoryDialog";

const ShareMemoryContext = createContext<{ openShare: () => void } | null>(null);

export function useShareMemory() {
  const value = useContext(ShareMemoryContext);
  if (!value) {
    throw new Error("Share a Memory is unavailable outside the gallery.");
  }
  return value;
}

export function GuestGalleryShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <ShareMemoryContext.Provider value={{ openShare: () => setOpen(true) }}>
      {children}
      <ShareMemoryDialog open={open} onClose={() => setOpen(false)} />
    </ShareMemoryContext.Provider>
  );
}

export function ShareMemoryBanner() {
  const { openShare } = useShareMemory();

  return (
    <div className="mx-auto max-w-2xl text-center">
      <h2 className="font-serif text-3xl text-ivory sm:text-4xl">Share a Memory</h2>
      <p className="mt-4 text-base leading-relaxed text-ivory/80 sm:text-lg">
        Help us capture the day through your eyes. Share a favorite photo, short video, or note for Tiffany &amp; Cary.
      </p>
      <div className="mt-6">
        <Button type="button" variant="dark" onClick={openShare}>
          Share a Memory
        </Button>
      </div>
    </div>
  );
}
