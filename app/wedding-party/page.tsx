import { PageHero } from "@/components/ui/PageHero";
import { PartyProfile } from "@/components/wedding-party/PartyProfile";
import { FadeIn } from "@/components/motion/FadeIn";
import { createPageMetadata } from "@/lib/metadata";
import {
  getWeddingDetails,
  getWeddingPartyPage,
} from "@/sanity/lib/getContent";

export async function generateMetadata() {
  const site = await getWeddingDetails({ stega: false });
  return createPageMetadata({
    title: "Wedding Party",
    description: `Meet the wedding party standing with ${site.coupleNames.display}.`,
    path: "/wedding-party",
    site,
  });
}

// Content is edited in Sanity Studio; revalidate on a short interval so
// published changes reliably appear on the live site (all domains) within
// ~30s. SanityLive still updates already-open pages in real time.
export const revalidate = 30;

export default async function WeddingPartyPage() {
  const party = await getWeddingPartyPage();

  return (
    <>
      <PageHero
        script={party.intro.scriptIntro}
        title={party.intro.title}
        description={party.intro.body}
        tone="burgundy"
      />
      <section className="bg-sterling/20 px-6 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto flex max-w-5xl flex-col gap-10">
          {party.members.map((member, index) => (
            <FadeIn key={member.id} delay={index * 0.04}>
              <PartyProfile member={member} index={index} />
            </FadeIn>
          ))}
        </div>
      </section>
    </>
  );
}
