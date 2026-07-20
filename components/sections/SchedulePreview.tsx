import type { HomeContent, ScheduleEvent } from "@/types/content";
import { FadeIn } from "@/components/motion/FadeIn";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function SchedulePreview({
  schedulePreview,
  events,
}: {
  schedulePreview: HomeContent["schedulePreview"];
  events: ScheduleEvent[];
}) {
  const previewEvents =
    events.filter((event) =>
      schedulePreview.eventIds.some(
        (id) =>
          event.id.includes(id) ||
          event.title.toLowerCase().includes(id.replace("-", " ")),
      ),
    ).slice(0, 3) || events.slice(0, 3);

  const displayEvents =
    previewEvents.length > 0 ? previewEvents : events.slice(0, 3);

  return (
    <section className="bg-ivory px-6 py-20 paper-texture sm:px-8 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <FadeIn>
          <SectionHeading
            title={schedulePreview.title}
            description={schedulePreview.body}
            dividerTone="burgundy"
          />
        </FadeIn>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {displayEvents.map((event, index) => (
            <FadeIn key={event.id} delay={index * 0.08}>
              <article className="h-full border border-sterling/60 bg-parchment/60 p-6 shadow-[var(--shadow-soft)]">
                <p className="text-xs uppercase tracking-[0.2em] text-cinnamon">
                  {event.date}
                </p>
                <h3 className="mt-3 font-serif text-2xl text-wine-black">
                  {event.title}
                </h3>
                <p className="mt-2 text-sm tracking-[0.08em] text-peacock">
                  {event.startTime}
                  {event.endTime ? ` – ${event.endTime}` : ""}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-charcoal/75">
                  {event.venue}
                </p>
                {event.dressCode ? (
                  <p className="mt-4 border-t border-sterling/50 pt-4 text-xs uppercase tracking-[0.16em] text-charcoal/60">
                    Dress · {event.dressCode}
                  </p>
                ) : null}
              </article>
            </FadeIn>
          ))}
        </div>

        <FadeIn className="mt-12 text-center">
          <Button href="/schedule" variant="secondary">
            {schedulePreview.ctaLabel}
          </Button>
        </FadeIn>
      </div>
    </section>
  );
}
