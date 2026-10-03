"use client";

import { useReducedMotion } from "framer-motion";
import { useIsPreview } from "@/components/providers/PreviewModeProvider";
import { cn } from "@/lib/utils";

type StarOfDavidProps = {
  className?: string;
  /** Draw the strokes in time with the hero script line. */
  animated?: boolean;
};

const up = "M32 7.5L53.2 44.2H10.8L32 7.5Z";
const down = "M32 56.5L10.8 19.8H53.2L32 56.5Z";

export function StarOfDavid({ className, animated = false }: StarOfDavidProps) {
  const reduceMotion = useReducedMotion();
  const isPreview = useIsPreview();
  const play = animated && !reduceMotion && !isPreview;

  const svg = (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={play ? "h-full w-full" : cn("h-10 w-10", className)}
      aria-hidden="true"
    >
      {[up, down].map((d) => (
        <path
          key={d}
          d={d}
          pathLength={play ? 1 : undefined}
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinejoin="round"
          strokeLinecap="round"
          className={play ? "star-draw" : undefined}
        />
      ))}
    </svg>
  );

  if (!play) return svg;

  return (
    <span
      className={cn(
        "gold-glow-load relative inline-flex text-champagne",
        className,
      )}
    >
      {svg}
    </span>
  );
}
