"use client";

import { useEffect, useId, useRef } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { GalleryImage } from "@/types/content";

type GalleryLightboxProps = {
  images: GalleryImage[];
  index: number | null;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
};

export function GalleryLightbox({
  images,
  index,
  onClose,
  onPrev,
  onNext,
}: GalleryLightboxProps) {
  const reduceMotion = useReducedMotion();
  const closeRef = useRef<HTMLButtonElement>(null);
  const touchStartX = useRef<number | null>(null);
  const titleId = useId();
  const open = index !== null;
  const image = index !== null ? images[index] : null;

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

  return (
    <AnimatePresence>
      {open && image ? (
        <motion.div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-wine-black/95 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduceMotion ? undefined : { opacity: 0 }}
          onTouchStart={(event) => {
            touchStartX.current = event.changedTouches[0]?.clientX ?? null;
          }}
          onTouchEnd={(event) => {
            if (touchStartX.current === null) return;
            const delta =
              (event.changedTouches[0]?.clientX ?? 0) - touchStartX.current;
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
            aria-label="Close gallery"
          >
            <X className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={onPrev}
            className="absolute left-3 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-sm border border-ivory/30 text-ivory hover:border-brass sm:left-6"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={onNext}
            className="absolute right-3 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-sm border border-ivory/30 text-ivory hover:border-brass sm:right-6"
            aria-label="Next image"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="relative mx-auto w-full max-w-5xl">
            <div className="relative aspect-[4/3] w-full overflow-hidden sm:aspect-[16/10]">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="100vw"
                className="object-contain"
                priority
              />
            </div>
            <p id={titleId} className="mt-4 text-center font-serif text-xl text-ivory">
              {image.caption || image.alt}
            </p>
            <p className="mt-2 text-center text-xs uppercase tracking-[0.18em] text-ivory/55">
              {(index ?? 0) + 1} / {images.length}
            </p>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
