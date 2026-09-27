"use client";

import { useEffect, useId, useRef } from "react";
import { ChevronLeft, ChevronRight, Play, X } from "lucide-react";
import { SaveUploadLink } from "@/components/gallery/SaveUpload";
import type { PublicMemoryMedia } from "@/lib/guest-gallery/types";

export type GuestSlide = PublicMemoryMedia & {
  guestName: string;
  message: string | null;
};

type GuestMemoryLightboxProps = {
  slides: GuestSlide[];
  index: number | null;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
};

export function GuestMemoryLightbox({
  slides,
  index,
  onClose,
  onPrev,
  onNext,
}: GuestMemoryLightboxProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const touchStartX = useRef<number | null>(null);
  const titleId = useId();
  const open = index !== null;
  const slide = index !== null ? slides[index] : null;

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") onPrev();
      if (event.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose, onPrev, onNext]);

  if (!open || !slide) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-wine-black/95 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      onTouchStart={(event) => {
        touchStartX.current = event.changedTouches[0]?.clientX ?? null;
      }}
      onTouchEnd={(event) => {
        if (touchStartX.current === null) return;
        const delta = (event.changedTouches[0]?.clientX ?? 0) - touchStartX.current;
        if (Math.abs(delta) > 50) {
          if (delta > 0) onPrev();
          else onNext();
        }
        touchStartX.current = null;
      }}
    >
      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-sm border border-ivory/30 text-ivory hover:border-brass hover:text-champagne"
        aria-label="Close guest memory"
      >
        <X className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={onPrev}
        className="absolute left-3 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-sm border border-ivory/30 text-ivory hover:border-brass sm:left-6"
        aria-label="Previous memory"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={onNext}
        className="absolute right-3 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-sm border border-ivory/30 text-ivory hover:border-brass sm:right-6"
        aria-label="Next memory"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <div className="w-full max-w-5xl">
        {slide.mediaType === "image" ? (
          // Signed storage URLs expire and should not pass through the image optimizer.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={slide.url}
            alt={memoryAlt(slide)}
            className="mx-auto max-h-[70vh] w-auto max-w-full object-contain"
          />
        ) : (
          <video
            key={slide.id}
            src={slide.url}
            className="mx-auto max-h-[70vh] w-full bg-black"
            controls
            playsInline
            preload="metadata"
          />
        )}
        <p id={titleId} className="mt-4 text-center font-serif text-xl text-ivory">
          {slide.guestName}
        </p>
        {slide.message ? (
          <p className="mx-auto mt-2 max-w-2xl text-center text-base leading-relaxed text-ivory/80">
            {slide.message}
          </p>
        ) : null}
        <p className="mt-2 text-center text-xs uppercase tracking-[0.18em] text-ivory/55">
          {(index ?? 0) + 1} / {slides.length}
        </p>
        <div className="mt-4 flex justify-center">
          <SaveUploadLink id={slide.id} mediaType={slide.mediaType} />
        </div>
      </div>
    </div>
  );
}

export function memoryAlt(slide: { guestName: string; message: string | null; mediaType: string }): string {
  const kind = slide.mediaType === "video" ? "video" : "photo";
  return slide.message
    ? `${slide.guestName} shared a ${kind}: ${slide.message}`
    : `${slide.guestName} shared a ${kind}`;
}

export function PlayBadge() {
  return (
    <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <span className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-ivory/70 bg-wine-black/55 text-ivory">
        <Play className="h-6 w-6" aria-hidden="true" />
        <span className="sr-only">Play video</span>
      </span>
    </span>
  );
}
