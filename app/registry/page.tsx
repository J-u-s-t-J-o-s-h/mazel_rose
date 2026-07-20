import { PageHero } from "@/components/ui/PageHero";
import { RegistryCard } from "@/components/registry/RegistryCard";
import { FadeIn } from "@/components/motion/FadeIn";
import { createPageMetadata } from "@/lib/metadata";
import { getRegistryPage, getWeddingDetails } from "@/sanity/lib/getContent";

export async function generateMetadata() {
  const site = await getWeddingDetails({ stega: false });
  return createPageMetadata({
    title: "Registry",
    description: `Registry and gift options for ${site.coupleNames.display}.`,
    path: "/registry",
    site,
  });
}

export default async function RegistryPage() {
  const registry = await getRegistryPage();

  return (
    <>
      <PageHero
        script={registry.intro.scriptIntro}
        title={registry.intro.title}
        description={registry.intro.body}
        tone="parchment"
      />
      <section className="bg-ivory px-6 py-16 paper-texture sm:px-8 sm:py-20">
        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
          {registry.items.map((item, index) => (
            <FadeIn key={item.id} delay={index * 0.06}>
              <RegistryCard item={item} />
            </FadeIn>
          ))}
        </div>
      </section>
    </>
  );
}
