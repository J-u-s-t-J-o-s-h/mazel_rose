import Image from "next/image";
import { PageHero } from "@/components/ui/PageHero";
import { Button } from "@/components/ui/Button";
import { RegistryCard } from "@/components/registry/RegistryCard";
import { FadeIn } from "@/components/motion/FadeIn";
import { createPageMetadata } from "@/lib/metadata";
import { formatExternalRel } from "@/lib/utils";
import { getRegistryPage, getWeddingDetails } from "@/sanity/lib/getContent";

const QR_DONATE_URL =
  "https://www.centralfloridazoo.org/sloths-at-the-central-florida-zoo/";

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
        description={registry.intro.body}
        tone="parchment"
      />
      <section className="bg-ivory px-6 py-16 paper-texture sm:px-8 sm:py-20">
        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
          {registry.items.map((item, index) => (
            <FadeIn key={item.id} delay={0.08 + index * 0.06}>
              <RegistryCard item={item} />
            </FadeIn>
          ))}
        </div>
        <FadeIn className="mx-auto mt-20 w-full max-w-3xl text-center">
          <h2 className="mx-auto max-w-xl font-serif text-2xl text-wine-black sm:text-3xl">
            The card you&apos;ll find at your table
          </h2>
          <div className="mt-6">
            <Button
              href={QR_DONATE_URL}
              target="_blank"
              rel={formatExternalRel(QR_DONATE_URL)}
              className="normal-case tracking-normal"
            >
              Donate to the Central Florida Zoo
            </Button>
          </div>
          <figure className="relative mx-auto mt-10 w-full max-w-sm sm:max-w-md lg:max-w-lg">
            <Image
              src="/registry/pay-it-forward.jpg"
              alt="Pay It Forward table card inviting guests to support the Central Florida Zoo. The printed card includes a QR code."
              width={597}
              height={1024}
              unoptimized
              className="block h-auto w-full border border-sterling/60 bg-ivory shadow-[var(--shadow-soft)]"
            />
            <a
              href={QR_DONATE_URL}
              target="_blank"
              rel={formatExternalRel(QR_DONATE_URL)}
              className="absolute left-[31.5%] top-[64.8%] z-10 block h-[19.5%] w-[37%] cursor-pointer rounded-sm hover:ring-2 hover:ring-burgundy/35 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-burgundy"
              aria-label="Donate to the Central Florida Zoo"
            >
              <span className="sr-only">Donate to the Central Florida Zoo</span>
            </a>
          </figure>
        </FadeIn>
      </section>
    </>
  );
}
