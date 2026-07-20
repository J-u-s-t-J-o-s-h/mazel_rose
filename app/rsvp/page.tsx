import { PageHero } from "@/components/ui/PageHero";
import { RsvpForm } from "@/components/rsvp/RsvpForm";
import { FadeIn } from "@/components/motion/FadeIn";
import { createPageMetadata } from "@/lib/metadata";
import {
  getRsvpFormSettings,
  getWeddingDetails,
} from "@/sanity/lib/getContent";

export async function generateMetadata() {
  const [site, settings] = await Promise.all([
    getWeddingDetails({ stega: false }),
    getRsvpFormSettings(),
  ]);
  return createPageMetadata({
    title: settings.heading || "RSVP",
    description: `Kindly respond by ${settings.rsvpDeadlineDisplay || site.rsvpDeadlineDisplay}.`,
    path: "/rsvp",
    site,
  });
}

export default async function RsvpPage() {
  const [site, settings] = await Promise.all([
    getWeddingDetails(),
    getRsvpFormSettings(),
  ]);

  return (
    <>
      <PageHero
        script={settings.scriptIntro}
        title={settings.heading}
        description={
          settings.introduction ||
          `We hope you will join us in ${site.location.display}. Please reply by ${settings.rsvpDeadlineDisplay || site.rsvpDeadlineDisplay}.`
        }
        tone="burgundy"
      />
      <section className="bg-parchment px-6 py-16 sm:px-8 sm:py-20">
        <FadeIn className="relative mx-auto max-w-3xl">
          <RsvpForm {...settings} />
        </FadeIn>
      </section>
    </>
  );
}
