"use client";

import { useCallback, useMemo, useState } from "react";
import {
  GuestMemoryLightbox,
  PlayBadge,
  memoryAlt,
  type GuestSlide,
} from "@/components/gallery/GuestMemoryLightbox";
import { SaveAllUploadsLink, SaveUploadLink } from "@/components/gallery/SaveUpload";
import { ThreeDCarousel } from "@/components/gallery/ThreeDCarousel";
import type { GuestGalleryStatus, PublicMemory } from "@/lib/guest-gallery/types";

export function GuestMemories({
  status,
  memories,
}: {
  status: GuestGalleryStatus;
  memories: PublicMemory[];
}) {
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

  if (status === "empty") return null;

  return (
    <div className="mt-14">
      {status === "unavailable" || status === "unconfigured" ? (
        <p className="mx-auto max-w-xl text-center text-base leading-relaxed text-ivory/75" role="status">
          Guest memories can&apos;t be loaded right now. Please try again in a little while.
        </p>
      ) : null}
      {status === "ready" ? (
        <div>
          <div className="mb-8 flex justify-center">
            <SaveAllUploadsLink
              hasImage={slides.some((slide) => slide.mediaType === "image")}
              hasVideo={slides.some((slide) => slide.mediaType === "video")}
            />
          </div>
          <ThreeDCarousel
            items={slides}
            label="Guest memories"
            onActivate={setIndex}
            renderItem={(slide, active) =>
              slide.mediaType === "image" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={slide.url} alt={memoryAlt(slide)} className="h-full w-full object-cover" />
              ) : (
                <span className="relative block h-full w-full bg-wine-black">
                  <video
                    src={slide.url}
                    className="pointer-events-none h-full w-full object-cover"
                    muted
                    playsInline
                    preload={active ? "metadata" : "none"}
                  />
                  <PlayBadge />
                </span>
              )
            }
            renderCaption={(slide) => (
              <>
                <p className="font-serif text-xl text-ivory">{slide.guestName}</p>
                {slide.message ? (
                  <p className="mt-1 text-sm leading-relaxed text-ivory/75">{slide.message}</p>
                ) : null}
                <SaveUploadLink id={slide.id} mediaType={slide.mediaType} />
              </>
            )}
          />
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
