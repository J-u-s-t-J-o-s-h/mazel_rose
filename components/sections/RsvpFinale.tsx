"use client";

import type { HomeContent } from "@/types/content";
import { FadeIn } from "@/components/motion/FadeIn";
import { Button } from "@/components/ui/Button";
import { DecorativeDivider } from "@/components/ui/DecorativeDivider";
import { useSite } from "@/components/providers/SiteProvider";

export function RsvpFinale({
  rsvpFinale,
}: {
  rsvpFinale: HomeContent["rsvpFinale"];
}) {
  const site = useSite();

  return (
    <section className="relative overflow-hidden bg-burgundy px-6 py-20 text-ivory candlelight sm:px-8 sm:py-28">
      <div className="editorial-frame pointer-events-none absolute inset-4 sm:inset-8" />
      <FadeIn className="relative mx-auto max-w-3xl text-center">
        <p className="font-script text-4xl text-champagne">Kindly</p>
        <h2 className="mt-3 font-serif text-5xl tracking-[0.06em] sm:text-6xl">
          {rsvpFinale.title}
        </h2>
        <DecorativeDivider className="mt-6" tone="ivory" />
        <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-ivory/85 sm:text-lg">
          {rsvpFinale.body}
        </p>
        <p className="mt-5 text-xs uppercase tracking-[0.22em] text-champagne">
          Please reply by {site.rsvpDeadlineDisplay}
        </p>
        <div className="mt-10">
          <Button href="/rsvp" variant="dark" size="lg">
            {rsvpFinale.ctaLabel}
          </Button>
        </div>
      </FadeIn>
    </section>
  );
}
