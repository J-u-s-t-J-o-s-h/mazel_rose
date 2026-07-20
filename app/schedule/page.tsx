import { PageHero } from "@/components/ui/PageHero";
import { EventTimeline } from "@/components/schedule/EventTimeline";
import { FadeIn } from "@/components/motion/FadeIn";
import { scheduleIntro } from "@/content/schedule";
import { createPageMetadata } from "@/lib/metadata";
import { getScheduleEvents, getWeddingDetails } from "@/sanity/lib/getContent";

export async function generateMetadata() {
  const site = await getWeddingDetails({ stega: false });
  return createPageMetadata({
    title: "Schedule",
    description: `Ceremony, reception, and celebration details for ${site.coupleNames.display}.`,
    path: "/schedule",
    site,
  });
}

export default async function SchedulePage() {
  const events = await getScheduleEvents();

  return (
    <>
      <PageHero
        script={scheduleIntro.scriptIntro}
        title={scheduleIntro.title}
        description={scheduleIntro.body}
        tone="parchment"
      />
      <section className="bg-parchment px-6 py-16 sm:px-8 sm:py-20">
        <FadeIn>
          <EventTimeline events={events} />
        </FadeIn>
      </section>
    </>
  );
}
