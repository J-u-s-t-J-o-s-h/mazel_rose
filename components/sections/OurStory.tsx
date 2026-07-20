import Link from "next/link";
import type { HomeContent } from "@/types/content";
import { FadeIn } from "@/components/motion/FadeIn";
import { ImageReveal } from "@/components/motion/ImageReveal";
import { BotanicalAccent } from "@/components/ui/BotanicalAccent";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function OurStory({ story }: { story: HomeContent["story"] }) {
  return (
    <section className="bg-parchment px-6 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <FadeIn className="relative order-2 lg:order-1">
          <div className="absolute -left-3 -top-3 h-24 w-24 bg-sterling/40" />
          <ImageReveal
            src={story.image}
            alt={story.imageAlt}
            width={1000}
            height={1200}
            className="relative aspect-[5/6] border border-burgundy/20 shadow-[var(--shadow-soft)]"
            sizes="(max-width: 1024px) 100vw, 42vw"
          />
          <BotanicalAccent
            tone="burgundy"
            className="absolute -bottom-4 -right-2 h-20 w-20"
          />
        </FadeIn>

        <FadeIn delay={0.08} className="order-1 lg:order-2">
          <SectionHeading
            title={story.title}
            description={story.body}
            align="left"
            dividerTone="burgundy"
          />
          <p className="mt-6 max-w-md border-l-2 border-sage pl-4 text-sm italic text-charcoal/70">
            {story.accentNote}
          </p>
          <Link
            href="/gallery"
            className="mt-8 inline-flex text-xs uppercase tracking-[0.2em] text-burgundy transition hover:text-cinnamon"
          >
            View more moments →
          </Link>
        </FadeIn>
      </div>
    </section>
  );
}
