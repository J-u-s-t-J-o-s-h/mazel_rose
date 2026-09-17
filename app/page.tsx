import { Countdown } from "@/components/sections/Countdown";
import { InvitationHero } from "@/components/sections/InvitationHero";
import { OurStory } from "@/components/sections/OurStory";
import { WelcomeNote } from "@/components/sections/WelcomeNote";
import { createPageMetadata } from "@/lib/metadata";
import { getHomePage, getWeddingDetails } from "@/sanity/lib/getContent";

export async function generateMetadata() {
  const site = await getWeddingDetails({ stega: false });
  return createPageMetadata({
    title: site.social.title,
    description: site.social.description,
    path: "/",
    site,
  });
}

// Content is edited in Sanity Studio; revalidate on a short interval so
// published changes reliably appear on the live site (all domains) within
// ~30s. SanityLive still updates already-open pages in real time.
export const revalidate = 30;

export default async function HomePage() {
  const home = await getHomePage();
  const { visibility } = home;

  return (
    <>
      <InvitationHero hero={home.hero} />
      {visibility.showWelcome ? <WelcomeNote welcome={home.welcome} /> : null}
      {visibility.showStory ? <OurStory story={home.story} /> : null}
      {visibility.showCountdown ? <Countdown /> : null}
    </>
  );
}
