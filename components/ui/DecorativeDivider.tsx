"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type DecorativeDividerProps = {
  className?: string;
  tone?: "brass" | "burgundy" | "ivory" | "sage";
};

const tones = {
  brass: "bg-brass",
  burgundy: "bg-burgundy",
  ivory: "bg-ivory/70",
  sage: "bg-sage",
};

export function DecorativeDivider({
  className,
  tone = "brass",
}: DecorativeDividerProps) {
  const reduceMotion = useReducedMotion();

  return (
    <div
      className={cn("flex items-center justify-center gap-3", className)}
      aria-hidden="true"
    >
      <motion.span
        className={cn("h-px w-16 sm:w-24", tones[tone])}
        initial={reduceMotion ? false : { scaleX: 0 }}
        whileInView={reduceMotion ? undefined : { scaleX: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        style={{ originX: 1 }}
      />
      <span className={cn("h-1.5 w-1.5 rotate-45", tones[tone])} />
      <motion.span
        className={cn("h-px w-16 sm:w-24", tones[tone])}
        initial={reduceMotion ? false : { scaleX: 0 }}
        whileInView={reduceMotion ? undefined : { scaleX: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        style={{ originX: 0 }}
      />
    </div>
  );
}
