"use client";

import { useCallback, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { useShareMemory } from "@/components/gallery/GuestGalleryShell";
import {
  GuestMemoryLightbox,
  PlayBadge,
  memoryAlt,
  type GuestSlide,
} from "@/components/gallery/GuestMemoryLightbox";
import type { GuestGalleryStatus, PublicMemory } from "@/lib/guest-gallery/types";

export function GuestMemories({
  status,
  memories,
}: {
  status: GuestGalleryStatus;
  memories: PublicMemory[];
}) {
  const { openShare } = useShareMemory();
  const slides = useMemo<GuestSlide[]>(
    () =>
      memories.flatMap((memory) =>
        memory.media.map((item) => ({
          ...item,
          guestName: memory.guestName,
          message: memory.message,
        })),
      ),
    [memories],
  );
  const [index, setIndex] = useState<number | null>(null);
  const onPrev = useCallback(() => {
    setIndex((current) => {
      if (current === null || slides.length === 0) return current;
      return (current - 1 + slides.length) % slides.length;
    });
  }, [slides.length]);
  const onNext = useCallback(() => {
    setIndex((current) => {
      if (current === null || slides.length === 0) return current;
      return (current + 1) % slides.length;
    });
  }, [slides.length]);

  return (
    <div className="mt-20">
      <h2 className="text-center font-serif text-3xl text-ivory sm:text-4xl">From Our Guests</h2>
      {status === "unavailable" || status === "unconfigured" ? (
        <p className="mx-auto mt-6 max-w-xl text-center text-base leading-relaxed text-ivory/75" role="status">
          Guest memories can&apos;t be loaded right now. Please try again in a little while.
        </p>
      ) : null}
      {status === "empty" ? (
        <div className="mx-auto mt-8 max-w-xl text-center">
          <p className="text-base leading-relaxed text-ivory/80">
            No guest memories have been shared yet. Be the first to add one.
          </p>
          <div className="mt-6">
            <Button type="button" variant="dark" onClick={openShare}>
              Share a Memory
            </Button>
          </div>
        </div>
      ) : null}
      {status === "ready" ? (
        <div className="mt-10 columns-1 gap-4 sm:columns-2 lg:columns-3">
          {slides.map((slide, slideIndex) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => setIndex(slideIndex)}
              className="group mb-4 block w-full break-inside-avoid overflow-hidden border border-ivory/10 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-champagne"
            >
              <span className="relative block">
                {slide.mediaType === "image" ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={slide.url} alt={memoryAlt(slide)} className="h-auto w-full object-cover" />
                ) : (
                  <span className="relative block bg-wine-black">
                    <video
                      src={slide.url}
                      className="pointer-events-none h-auto w-full"
                      muted
                      playsInline
                      preload="metadata"
                    />
                    <PlayBadge />
                  </span>
                )}
              </span>
              <span className="block px-3 py-3">
                <span className="block font-serif text-lg text-ivory">{slide.guestName}</span>
                {slide.message ? (
                  <span className="mt-1 block text-sm leading-relaxed text-ivory/75">{slide.message}</span>
                ) : null}
              </span>
            </button>
          ))}
        </div>
      ) : null}
      <GuestMemoryLightbox
        slides={slides}
        index={index}
        onClose={() => setIndex(null)}
        onPrev={onPrev}
        onNext={onNext}
      />
    </div>
  );
}
