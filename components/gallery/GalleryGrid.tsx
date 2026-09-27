"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import type { GalleryImage } from "@/types/content";
import { GalleryLightbox } from "@/components/gallery/GalleryLightbox";
import { ThreeDCarousel } from "@/components/gallery/ThreeDCarousel";

export function GalleryGrid({
  images,
  showCaptions = true,
}: {
  images: GalleryImage[];
  showCaptions?: boolean;
}) {
  const [index, setIndex] = useState<number | null>(null);

  const onPrev = useCallback(() => {
    setIndex((current) => {
      if (current === null) return current;
      return (current - 1 + images.length) % images.length;
    });
  }, [images.length]);

  const onNext = useCallback(() => {
    setIndex((current) => {
      if (current === null) return current;
      return (current + 1) % images.length;
    });
  }, [images.length]);

  if (!images.length) {
    return (
      <p className="border border-ivory/15 bg-wine-black/40 px-6 py-16 text-center font-serif text-lg text-ivory/70">
        Photographs from the wedding will be added here. To share your own, add a photo or a short video above.
      </p>
    );
  }

  return (
    <>
      <ThreeDCarousel
        items={images}
        label="Wedding photos"
        onActivate={setIndex}
        renderItem={(image) => (
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(max-width: 639px) 46vw, (max-width: 1023px) 200px, 250px"
            className="object-cover"
          />
        )}
        renderCaption={
          showCaptions
            ? (image) =>
                image.caption ? (
                  <p className="font-serif text-lg text-ivory">{image.caption}</p>
                ) : null
            : undefined
        }
      />

      <GalleryLightbox
        images={images}
        index={index}
        onClose={() => setIndex(null)}
        onPrev={onPrev}
        onNext={onNext}
      />
    </>
  );
}
