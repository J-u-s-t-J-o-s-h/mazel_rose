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
      <h2 className="font-serif text-3xl text-ivory sm:text-4xl">Share a photo</h2>
      <p className="mt-4 text-lg leading-relaxed text-ivory/85">
        Tap the button, choose a photo from your phone, and add your name. It will appear on this page for Tiffany and Cary.
      </p>
      <div className="mt-6">
        <Button
          type="button"
          variant="dark"
          size="lg"
          className="normal-case tracking-normal text-base"
          onClick={openShare}
        >
          Add a photo
        </Button>
      </div>
    </div>
  );
}
