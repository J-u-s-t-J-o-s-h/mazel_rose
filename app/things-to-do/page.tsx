import { PageHero } from "@/components/ui/PageHero";
import { CategoryFilter } from "@/components/activities/CategoryFilter";
import { FadeIn } from "@/components/motion/FadeIn";
import { createPageMetadata } from "@/lib/metadata";
import { getThingsToDoPage, getWeddingDetails } from "@/sanity/lib/getContent";

export async function generateMetadata() {
  const site = await getWeddingDetails({ stega: false });
  return createPageMetadata({
    title: "Things To Do",
    description: `A curated local guide near ${site.location.display}.`,
    path: "/things-to-do",
    site,
  });
}

// Content is edited in Sanity Studio; revalidate on a short interval so
// published changes reliably appear on the live site (all domains) within
// ~30s. SanityLive still updates already-open pages in real time.
export const revalidate = 30;

export default async function ThingsToDoPage() {
  const page = await getThingsToDoPage();

  return (
    <>
      <PageHero
        script={page.intro.scriptIntro}
        title={page.intro.title}
        description={page.intro.body}
        tone="sage"
      />
      <section className="bg-parchment px-6 py-16 sm:px-8 sm:py-20">
        <FadeIn className="mx-auto max-w-6xl">
          <CategoryFilter activities={page.activities} />
        </FadeIn>
      </section>
    </>
  );
}
