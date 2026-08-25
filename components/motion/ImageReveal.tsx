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
  priority,
  className,
  imageClassName,
  sizes,
}: ImageRevealProps) {
  const reduceMotion = useReducedMotion();
  const isPreview = useIsPreview();
  const staticImage = reduceMotion || isPreview;

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <motion.div
        initial={staticImage ? false : { opacity: 0.15 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0"
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className={cn("object-cover", imageClassName)}
        />
      </motion.div>
    </div>
  );
}
