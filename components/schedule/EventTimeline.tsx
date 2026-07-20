import { ExternalLink } from "lucide-react";
import type { ScheduleEvent } from "@/types/content";
import { FadeIn } from "@/components/motion/FadeIn";

export function EventTimeline({ events }: { events: ScheduleEvent[] }) {
  return (
    <ol className="relative mx-auto max-w-4xl space-y-0">
      {events.map((event, index) => (
        <FadeIn key={event.id} delay={index * 0.04}>
          <li className="relative grid gap-4 border-l border-brass/50 py-8 pl-8 sm:grid-cols-[180px_1fr] sm:gap-8 sm:pl-12">
            <span className="absolute -left-[5px] top-10 h-2.5 w-2.5 rounded-full bg-burgundy ring-4 ring-parchment" />
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-cinnamon">
                {event.date}
              </p>
              <p className="mt-2 font-serif text-xl text-peacock">
                {event.startTime}
                {event.endTime ? ` – ${event.endTime}` : ""}
              </p>
            </div>
            <article className="border border-sterling/50 bg-ivory/70 p-5 sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <h2 className="font-serif text-2xl text-wine-black sm:text-3xl">
                  {event.title}
                </h2>
                <div className="flex flex-wrap gap-2">
                  {event.isPrivate ? (
                    <span className="border border-burgundy/30 px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-burgundy">
                      Private
                    </span>
                  ) : null}
                  {event.invitationOnly ? (
                    <span className="border border-cinnamon/40 px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-cinnamon">
                      Invitation only
                    </span>
                  ) : null}
                </div>
              </div>
              <p className="mt-3 text-sm font-medium text-peacock">{event.venue}</p>
              <p className="mt-1 text-sm text-charcoal/70">{event.address}</p>
              <p className="mt-4 text-sm leading-relaxed text-charcoal/80">
                {event.description}
              </p>
              <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
                {event.dressCode ? (
                  <div>
                    <dt className="text-xs uppercase tracking-[0.16em] text-charcoal/50">
                      Dress code
                    </dt>
                    <dd className="mt-1 text-charcoal/80">{event.dressCode}</dd>
                  </div>
                ) : null}
                {event.transportation ? (
                  <div>
                    <dt className="text-xs uppercase tracking-[0.16em] text-charcoal/50">
                      Transportation
                    </dt>
                    <dd className="mt-1 text-charcoal/80">{event.transportation}</dd>
                  </div>
                ) : null}
                {event.parking ? (
                  <div>
                    <dt className="text-xs uppercase tracking-[0.16em] text-charcoal/50">
                      Parking
                    </dt>
                    <dd className="mt-1 text-charcoal/80">{event.parking}</dd>
                  </div>
                ) : null}
              </dl>
              {event.mapUrl ? (
                <a
                  href={event.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-burgundy transition hover:text-cinnamon"
                >
                  View map <ExternalLink className="h-3.5 w-3.5" />
                </a>
              ) : null}
            </article>
          </li>
        </FadeIn>
      ))}
    </ol>
  );
}
