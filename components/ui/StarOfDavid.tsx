"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useIsPreview } from "@/components/providers/PreviewModeProvider";
import { cn } from "@/lib/utils";

type StarOfDavidProps = {
  className?: string;
  /** Draw the strokes, then run the same champagne glint used on the hero rules. */
  animated?: boolean;
};

const up = "M32 7.5L53.2 44.2H10.8L32 7.5Z";
const down = "M32 56.5L10.8 19.8H53.2L32 56.5Z";

const drawEase = [0.16, 1, 0.3, 1] as const;
const glintEase = [0.45, 0, 0.2, 1] as const;

function StarGlint({ direction }: { direction: "left" | "right" }) {
  const toLeft = direction === "left";

  return (
    <motion.span
      className="pointer-events-none absolute top-1/2 h-[3px] w-8 bg-gradient-to-r from-transparent via-champagne to-transparent shadow-[0_0_10px_2px_rgba(216,195,165,0.85)]"
      initial={{ left: "50%", x: "-50%", y: "-50%", opacity: 0 }}
      animate={{
        left: toLeft ? "0%" : "100%",
        x: toLeft ? "0%" : "-100%",
        y: "-50%",
        opacity: [0, 1, 0],
      }}
      transition={{
        left: { duration: 0.8, delay: 1.22, ease: glintEase },
        x: { duration: 0.8, delay: 1.22, ease: glintEase },
        y: { duration: 0 },
        opacity: {
          duration: 0.8,
          delay: 1.22,
          times: [0, 0.18, 1],
          ease: "easeOut",
        },
      }}
    />
  );
}

export function StarOfDavid({ className, animated = false }: StarOfDavidProps) {
  const reduceMotion = useReducedMotion();
  const isPreview = useIsPreview();
  const play = animated && !reduceMotion && !isPreview;
  const Path = play ? motion.path : "path";

  const svg = (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={play ? "h-full w-full" : cn("h-10 w-10", className)}
      aria-hidden="true"
    >
      {[up, down].map((d) => (
        <Path
          key={d}
          d={d}
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinejoin="round"
          strokeLinecap="round"
          initial={play ? { pathLength: 0 } : undefined}
          animate={play ? { pathLength: 1 } : undefined}
          transition={
            play
              ? { duration: 1.05, delay: 0.48, ease: drawEase }
              : undefined
          }
        />
      ))}
    </svg>
  );

  if (!play) return svg;

  return (
    <span className={cn("relative inline-flex text-champagne", className)}>
      {svg}
      <StarGlint direction="left" />
      <StarGlint direction="right" />
    </span>
  );
}
