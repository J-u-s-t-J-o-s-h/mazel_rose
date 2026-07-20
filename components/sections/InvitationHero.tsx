"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import type { HomeContent } from "@/types/content";
import { Button } from "@/components/ui/Button";
import { DecorativeDivider } from "@/components/ui/DecorativeDivider";
import { useSite } from "@/components/providers/SiteProvider";

export function InvitationHero({ hero }: { hero: HomeContent["hero"] }) {
  const site = useSite();
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-wine-black">
      <Image
        src={hero.image}
        alt={hero.imageAlt}
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-peacock/75 via-wine-black/55 to-wine-black/80" />
      <div className="candlelight pointer-events-none absolute inset-0" />
      <div className="editorial-frame pointer-events-none absolute inset-4 sm:inset-8" />

      <div className="relative z-10 flex min-h-[100svh] items-center justify-center px-6 py-28 sm:px-8">
        <div className="mx-auto max-w-4xl text-center text-ivory">
          <motion.p
            className="font-script text-4xl text-champagne sm:text-5xl"
            initial={reduceMotion ? false : { y: 12 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          >
            {hero.scriptIntro}
          </motion.p>

          <motion.h1
            className="mt-4 font-serif text-5xl tracking-[0.12em] sm:text-6xl md:text-7xl lg:text-8xl"
            initial={reduceMotion ? false : { y: 14 }}
            animate={{ y: 0 }}
            transition={{ duration: 1, delay: 0.1, ease: "easeOut" }}
          >
            {hero.heading}
          </motion.h1>

          <DecorativeDivider className="mt-6" tone="ivory" />

          <motion.p
            className="mt-6 text-xs uppercase tracking-[0.28em] text-ivory/85 sm:text-sm"
            initial={false}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {hero.invitationLine}
          </motion.p>

          <motion.div
            className="mt-8 space-y-2"
            initial={reduceMotion ? false : { y: 10 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <p className="font-serif text-2xl tracking-[0.08em] text-champagne sm:text-3xl">
              {site.weddingDateDisplay}
            </p>
            <p className="text-sm uppercase tracking-[0.22em] text-ivory/75">
              {site.location.display}
            </p>
          </motion.div>

          <motion.div
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
            initial={reduceMotion ? false : { y: 10 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Button href={hero.primaryCta.href} variant="primary" size="lg">
              {hero.primaryCta.label}
            </Button>
            <Button href={hero.secondaryCta.href} variant="ghost" size="lg">
              {hero.secondaryCta.label}
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
