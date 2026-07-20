import type { HomeContent } from "@/types/content";
import { FadeIn } from "@/components/motion/FadeIn";
import { ImageReveal } from "@/components/motion/ImageReveal";
import { BotanicalAccent } from "@/components/ui/BotanicalAccent";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function WelcomeNote({ welcome }: { welcome: HomeContent["welcome"] }) {
  return (
    <section className="relative overflow-hidden bg-ivory px-6 py-20 paper-texture sm:px-8 sm:py-28">
      <BotanicalAccent className="absolute right-6 top-8 opacity-40 sm:right-12" />
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <FadeIn>
          <SectionHeading
            script={welcome.scriptIntro}
            title={welcome.title}
            description={welcome.body}
            align="left"
            dividerTone="brass"
          />
        </FadeIn>
        {welcome.image ? (
          <FadeIn delay={0.1}>
            <ImageReveal
              src={welcome.image}
              alt={welcome.imageAlt || ""}
              width={900}
              height={1100}
              className="aspect-[4/5] border border-sterling/50 shadow-[var(--shadow-soft)]"
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
          </FadeIn>
        ) : null}
      </div>
    </section>
  );
}
