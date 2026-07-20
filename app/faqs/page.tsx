import { PageHero } from "@/components/ui/PageHero";
import { FaqAccordion } from "@/components/faq/FaqAccordion";
import { FadeIn } from "@/components/motion/FadeIn";
import { createPageMetadata } from "@/lib/metadata";
import { getFaqsPage, getWeddingDetails } from "@/sanity/lib/getContent";

export async function generateMetadata() {
  const site = await getWeddingDetails({ stega: false });
  return createPageMetadata({
    title: "FAQs",
    description: `Dress code, RSVP timing, and other details for ${site.coupleNames.display}'s wedding.`,
    path: "/faqs",
    site,
  });
}

export default async function FaqsPage() {
  const page = await getFaqsPage();

  return (
    <>
      <PageHero
        script={page.intro.scriptIntro}
        title={page.intro.title}
        description={page.intro.body}
        tone="parchment"
      />
      <section className="bg-ivory px-6 py-16 sm:px-8 sm:py-20">
        <FadeIn>
          <FaqAccordion faqs={page.faqs} />
        </FadeIn>
        {page.contactMessage || page.contactEmail ? (
          <FadeIn className="mx-auto mt-10 max-w-3xl text-center text-sm text-charcoal/70">
            {page.contactMessage ? <p>{page.contactMessage}</p> : null}
            {page.contactEmail ? (
              <a
                href={
                  page.contactEmail.includes("@")
                    ? `mailto:${page.contactEmail}`
                    : page.contactEmail
                }
                className="mt-3 inline-block text-burgundy hover:text-cinnamon"
              >
                {page.contactEmail}
              </a>
            ) : null}
          </FadeIn>
        ) : null}
      </section>
    </>
  );
}
