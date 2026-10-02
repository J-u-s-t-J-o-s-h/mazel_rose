"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useIsPreview } from "@/components/providers/PreviewModeProvider";
import { cn } from "@/lib/utils";

type DividerTone = "brass" | "burgundy" | "ivory" | "sage";

type DecorativeDividerProps = {
  className?: string;
  tone?: DividerTone;
  ornament?: ReactNode;
  /** One-time draw-and-glint on load. Used by the hero rules beside the star. */
  flourish?: boolean;
};

const tones = {
  brass: "bg-brass",
  burgundy: "bg-burgundy",
  ivory: "bg-ivory/70",
  sage: "bg-sage",
};

const drawEase = [0.16, 1, 0.3, 1] as const;

function DividerRule({
  tone,
  edge,
  flourish,
  staticState,
}: {
  tone: DividerTone;
  edge: "start" | "end";
  flourish: boolean;
  staticState: boolean;
}) {
  const growsFromCenter = edge === "start";
  const originX = growsFromCenter ? 1 : 0;

  if (!flourish) {
    return (
      <motion.span
        className={cn("h-px w-16 sm:w-24", tones[tone])}
        initial={staticState ? false : { scaleX: 0 }}
        whileInView={staticState ? undefined : { scaleX: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        style={{ originX }}
      />
    );
  }

  return (
    <motion.span
      className={cn("relative h-px w-24 sm:w-36", tones[tone])}
      initial={staticState ? false : { scaleX: 0 }}
      animate={staticState ? undefined : { scaleX: 1 }}
      transition={{ duration: 1.05, delay: 0.48, ease: drawEase }}
      style={{ originX }}
    >
      {staticState ? null : (
        <motion.span
          className="absolute top-1/2 h-[3px] w-8 bg-gradient-to-r from-transparent via-champagne to-transparent shadow-[0_0_10px_2px_rgba(216,195,165,0.85)]"
          initial={{
            left: growsFromCenter ? "68%" : "0%",
            y: "-50%",
            opacity: 0,
          }}
          animate={{
            left: growsFromCenter ? "0%" : "68%",
            y: "-50%",
            opacity: [0, 1, 0],
          }}
          transition={{
            left: { duration: 0.8, delay: 1.22, ease: [0.45, 0, 0.2, 1] },
            y: { duration: 0 },
            opacity: {
              duration: 0.8,
              delay: 1.22,
              times: [0, 0.18, 1],
              ease: "easeOut",
            },
          }}
        />
      )}
    </motion.span>
  );
}

export function DecorativeDivider({
  className,
  tone = "brass",
  ornament,
  flourish = false,
}: DecorativeDividerProps) {
  const reduceMotion = useReducedMotion();
  const isPreview = useIsPreview();
  const staticState = reduceMotion || isPreview;
  const center = ornament ?? (
    <span className={cn("h-1.5 w-1.5 rotate-45", tones[tone])} />
  );

  return (
    <div
      className={cn(
        "flex items-center justify-center",
        ornament ? "gap-4 sm:gap-5" : "gap-3",
        className,
      )}
      aria-hidden="true"
    >
      <DividerRule
        tone={tone}
        edge="start"
        flourish={flourish}
        staticState={staticState}
      />
      {center}
      <DividerRule
        tone={tone}
        edge="end"
        flourish={flourish}
        staticState={staticState}
      />
    </div>
  );
}
