"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import type { HomeContent } from "@/types/content";
import { DecorativeDivider } from "@/components/ui/DecorativeDivider";

export function EditorialFeature({
  feature,
}: {
  feature: HomeContent["feature"];
}) {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <section ref={ref} className="relative min-h-[70vh] overflow-hidden bg-wine-black">
      <motion.div
        style={reduceMotion ? undefined : { y }}
        className="absolute inset-0 scale-110"
      >
        <Image
          src={feature.image}
          alt={feature.imageAlt}
          fill
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>
      <div className="absolute inset-0 bg-burgundy/55 mix-blend-multiply" />
      <div className="absolute inset-0 bg-peacock/40" />
      <div className="relative z-10 flex min-h-[70vh] items-center justify-center px-6 py-24 text-center text-ivory">
        <div className="max-w-3xl">
          <p className="font-serif text-3xl leading-relaxed italic sm:text-4xl md:text-5xl">
            “{feature.quote}”
          </p>
          <DecorativeDivider className="mt-8" tone="ivory" />
          <p className="mt-6 text-xs uppercase tracking-[0.24em] text-champagne">
            {feature.attribution}
          </p>
        </div>
      </div>
    </section>
  );
}
