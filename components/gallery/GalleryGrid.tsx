"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import type { GalleryImage } from "@/types/content";
import { GalleryLightbox } from "@/components/gallery/GalleryLightbox";
import { cn } from "@/lib/utils";

export function GalleryGrid({
  images,
  showCaptions = true,
}: {
  images: GalleryImage[];
  showCaptions?: boolean;
}) {
  const [index, setIndex] = useState<number | null>(null);
  const reduceMotion = useReducedMotion();

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

  return (
    <>
      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
        {images.map((image, imageIndex) => (
          <motion.button
            key={image.id}
            type="button"
            onClick={() => setIndex(imageIndex)}
            className={cn(
              "group mb-4 block w-full break-inside-avoid overflow-hidden border border-ivory/10 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-champagne",
            )}
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, delay: imageIndex * 0.03 }}
          >
            <div className="relative">
              <Image
                src={image.src}
                alt={image.alt}
                width={image.width}
                height={image.height}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="h-auto w-full object-cover transition duration-500 group-hover:scale-[1.02]"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-wine-black/50 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
              {showCaptions && image.caption ? (
                <p className="absolute bottom-3 left-3 right-3 font-serif text-sm text-ivory opacity-0 transition group-hover:opacity-100">
                  {image.caption}
                </p>
              ) : null}
            </div>
          </motion.button>
        ))}
      </div>

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
