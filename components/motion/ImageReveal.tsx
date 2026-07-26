"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useIsPreview } from "@/components/providers/PreviewModeProvider";

type ImageRevealProps = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  priority?: boolean;
  className?: string;
  imageClassName?: string;
  sizes?: string;
};

export function ImageReveal({
  src,
  alt,
  width,
  height,
  fill,
  priority,
  className,
  imageClassName,
  sizes,
}: ImageRevealProps) {
  const reduceMotion = useReducedMotion();
  const isPreview = useIsPreview();
  // In the Studio preview iframe the scroll-triggered clip can stay closed,
  // hiding a freshly uploaded image. Render the final state there (and for
  // reduced-motion users); keep the reveal for real visitors.
  const staticImage = reduceMotion || isPreview;

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <motion.div
        initial={staticImage ? false : { clipPath: "inset(0 0 100% 0)" }}
        whileInView={staticImage ? undefined : { clipPath: "inset(0 0 0% 0)" }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="h-full w-full"
      >
        <Image
          src={src}
          alt={alt}
          width={fill ? undefined : width}
          height={fill ? undefined : height}
          fill={fill}
          priority={priority}
          sizes={sizes}
          className={cn("object-cover", imageClassName)}
        />
      </motion.div>
    </div>
  );
}
