"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { HomeContent } from "@/types/content";
import { Button } from "@/components/ui/Button";
import { Monogram } from "@/components/ui/Monogram";
import { StarOfDavid } from "@/components/ui/StarOfDavid";
import { useIsPreview } from "@/components/providers/PreviewModeProvider";
import { useSite } from "@/components/providers/SiteProvider";
import { CtaSloth } from "@/components/sections/CtaSloth";
import { cn } from "@/lib/utils";

export function InvitationHero({ hero }: { hero: HomeContent["hero"] }) {
  const site = useSite();
  const reduceMotion = useReducedMotion();
  const isPreview = useIsPreview();
  const glow = !reduceMotion && !isPreview;
  const [fontsReady, setFontsReady] = useState(false);
  const cue = glow && fontsReady;

  useEffect(() => {
    let active = true;
    document.fonts.ready.then(() => {
      if (active) setFontsReady(true);
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-wine-black">
      {hero.image ? (
        <Image
          src={hero.image}
          alt={hero.imageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      ) : null}
      <div className="absolute inset-0 bg-gradient-to-b from-peacock/75 via-wine-black/55 to-wine-black/80" />
      <div className="candlelight pointer-events-none absolute inset-0" />
      <div className="editorial-frame pointer-events-none absolute inset-4 sm:inset-8" />
      <Link
        href="/"
        aria-label={`${site.brandName} home`}
        className="absolute left-6 top-6 z-20 sm:left-11 sm:top-11"
      >
        <Monogram priority />
      </Link>

      <div className="relative z-10 flex min-h-[100svh] items-center justify-center px-6 py-28 sm:px-8">
        <div className="mx-auto max-w-4xl text-center text-ivory">
          <div className="flex w-full flex-col items-center">
            <StarOfDavid
              animated
              cue={cue}
              className="mb-4 h-12 w-12 text-champagne sm:mb-5 sm:h-16 sm:w-16"
            />

            <p
              className={cn(
                "relative font-script text-4xl text-champagne sm:text-5xl",
                cue && "gold-glow-load hero-word-load",
                glow && !fontsReady && "opacity-0",
              )}
            >
              {hero.scriptIntro}
            </p>
          </div>

          <motion.h1
            className="mt-4 font-serif text-5xl tracking-[0.12em] sm:text-6xl md:text-7xl lg:text-8xl"
            initial={reduceMotion ? false : { y: 14 }}
            animate={{ y: 0 }}
            transition={{ duration: 1, delay: 0.1, ease: "easeOut" }}
          >
            {hero.heading}
          </motion.h1>

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
            className="mt-10"
            initial={reduceMotion ? false : { y: 10 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <CtaSloth>
              <Button href={hero.primaryCta.href} variant="primary" size="lg">
                {hero.primaryCta.label}
              </Button>
              <Button href={hero.secondaryCta.href} variant="ghost" size="lg">
                {hero.secondaryCta.label}
              </Button>
            </CtaSloth>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
