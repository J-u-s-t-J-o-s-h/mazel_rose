import type { HomeContent } from "@/types/content";
import { FadeIn } from "@/components/motion/FadeIn";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function TravelPreview({
  travelPreview,
}: {
  travelPreview: HomeContent["travelPreview"];
}) {
  return (
    <section className="bg-sage/25 px-6 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <FadeIn>
          <SectionHeading
            title={travelPreview.title}
            description={travelPreview.body}
            align="left"
            dividerTone="sage"
          />
          <div className="mt-8">
            <Button href="/travel" variant="secondary">
              {travelPreview.ctaLabel}
            </Button>
          </div>
        </FadeIn>
        <FadeIn delay={0.1}>
          <ul className="space-y-4 border border-sage/50 bg-ivory/80 p-6 sm:p-8">
            {travelPreview.highlights.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 border-b border-sterling/40 pb-4 last:border-0 last:pb-0"
              >
                <span className="mt-1 h-2 w-2 shrink-0 rotate-45 bg-brass" />
                <span className="font-serif text-xl text-wine-black">{item}</span>
              </li>
            ))}
          </ul>
        </FadeIn>
      </div>
    </section>
  );
}
