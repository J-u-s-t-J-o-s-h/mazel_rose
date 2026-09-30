import { PageHero } from "@/components/ui/PageHero";
import { RegistryCard } from "@/components/registry/RegistryCard";
import { HangingSloth } from "@/components/registry/HangingSloth";
import { PayItForwardNote } from "@/components/registry/PayItForwardNote";
import { FadeIn } from "@/components/motion/FadeIn";
import { createPageMetadata } from "@/lib/metadata";
import { getRegistryPage, getWeddingDetails } from "@/sanity/lib/getContent";

export async function generateMetadata() {
  const site = await getWeddingDetails({ stega: false });
  return createPageMetadata({
    title: "Pay It Forward",
    description: `In lieu of a traditional registry, ${site.coupleNames.display} invite you to pay it forward.`,
    path: "/registry",
    site,
  });
}

// Content is edited in Sanity Studio; revalidate on a short interval so
// published changes reliably appear on the live site (all domains) within
// ~30s. SanityLive still updates already-open pages in real time.
export const revalidate = 30;

export default async function RegistryPage() {
  const registry = await getRegistryPage();

  return (
    <>
      <PageHero
        script={registry.intro.scriptIntro}
        title={registry.intro.title}
        tone="parchment"
      >
        <p
          lang="he"
          dir="rtl"
          className="mt-6 font-serif tracking-wide text-peacock"
          style={{ fontSize: "2.0625rem", lineHeight: "2.475rem" }}
        >
          הכרת הטוב
        </p>
        <p
          className="mt-2 font-serif italic text-peacock"
          style={{ fontSize: "1.2375rem", lineHeight: "1.925rem" }}
        >
          Hakarat HaTov — Recognizing the Good
        </p>
      </PageHero>
      <section className="bg-ivory px-6 pb-16 paper-texture sm:px-8 sm:pb-20">
        <FadeIn className="mx-auto -mt-6 w-full max-w-3xl sm:-mt-10">
          <HangingSloth />
        </FadeIn>
        <FadeIn className="mx-auto -mt-4 w-full max-w-3xl sm:-mt-8">
          <PayItForwardNote />
        </FadeIn>
        <div className="mx-auto mt-20 grid max-w-5xl gap-6 md:grid-cols-2">
          {registry.items.map((item, index) => (
            <FadeIn key={item.id} delay={0.08 + index * 0.06}>
              <RegistryCard item={item} />
            </FadeIn>
          ))}
        </div>
      </section>
    </>
  );
}
