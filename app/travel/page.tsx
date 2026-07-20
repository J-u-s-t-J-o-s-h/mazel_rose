import { PageHero } from "@/components/ui/PageHero";
import { HotelCard } from "@/components/travel/HotelCard";
import { FadeIn } from "@/components/motion/FadeIn";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { createPageMetadata } from "@/lib/metadata";
import { getTravelPage, getWeddingDetails } from "@/sanity/lib/getContent";

export async function generateMetadata() {
  const site = await getWeddingDetails({ stega: false });
  return createPageMetadata({
    title: "Travel",
    description: `Airports, hotels, and travel guidance for guests attending ${site.coupleNames.display}'s wedding.`,
    path: "/travel",
    site,
  });
}

export default async function TravelPage() {
  const travel = await getTravelPage();

  return (
    <>
      <PageHero
        script={travel.intro.scriptIntro}
        title={travel.intro.title}
        description={travel.intro.body}
        tone="sage"
      />

      <section className="bg-ivory px-6 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <FadeIn>
            <SectionHeading
              title="Airports"
              description="Recommended arrival airports with approximate drive times."
              align="left"
              dividerTone="sage"
            />
          </FadeIn>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {travel.airports.map((airport, index) => (
              <FadeIn key={airport.code} delay={index * 0.06}>
                <article className="h-full border border-sage/40 bg-parchment/50 p-5">
                  <p className="text-xs uppercase tracking-[0.18em] text-cinnamon">
                    {airport.code}
                  </p>
                  <h3 className="mt-2 font-serif text-2xl text-wine-black">
                    {airport.name}
                  </h3>
                  <p className="mt-3 text-sm text-peacock">{airport.distance}</p>
                  <p className="mt-3 text-sm leading-relaxed text-charcoal/75">
                    {airport.notes}
                  </p>
                </article>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-sage/15 px-6 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <FadeIn>
            <SectionHeading
              title="Where to stay"
              description="Preferred hotels with room-block details where available."
              dividerTone="brass"
            />
          </FadeIn>
          <div className="mt-12 grid gap-8 lg:grid-cols-3">
            {travel.hotels.map((hotel, index) => (
              <FadeIn key={hotel.id} delay={index * 0.06}>
                <HotelCard hotel={hotel} />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ivory px-6 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-3">
          {[
            ["Driving", travel.details.driving],
            ["Shuttle", travel.details.shuttle],
            ["Parking", travel.details.parking],
          ].map(([title, body], index) => (
            <FadeIn key={title} delay={index * 0.05}>
              <article className="h-full border border-sterling/50 p-6">
                <h3 className="font-serif text-2xl text-wine-black">{title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-charcoal/75">
                  {body}
                </p>
              </article>
            </FadeIn>
          ))}
        </div>
        <FadeIn className="mx-auto mt-10 max-w-6xl border border-brass/30 bg-parchment/40 p-6 text-center">
          <p className="text-xs uppercase tracking-[0.18em] text-cinnamon">
            {travel.details.localContact.label}
          </p>
          <a
            href={`mailto:${travel.details.localContact.email}`}
            className="mt-3 inline-block font-serif text-2xl text-peacock hover:text-burgundy"
          >
            {travel.details.localContact.email}
          </a>
          <p className="mt-2 text-xs text-charcoal/50">
            {travel.details.localContact.note}
          </p>
        </FadeIn>
      </section>
    </>
  );
}
