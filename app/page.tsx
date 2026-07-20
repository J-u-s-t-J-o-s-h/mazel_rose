import { Countdown } from "@/components/sections/Countdown";
import { EditorialFeature } from "@/components/sections/EditorialFeature";
import { GalleryPreview } from "@/components/sections/GalleryPreview";
import { InvitationHero } from "@/components/sections/InvitationHero";
import { OurStory } from "@/components/sections/OurStory";
import { RsvpFinale } from "@/components/sections/RsvpFinale";
import { SchedulePreview } from "@/components/sections/SchedulePreview";
import { TravelPreview } from "@/components/sections/TravelPreview";
import { WelcomeNote } from "@/components/sections/WelcomeNote";
import { createPageMetadata } from "@/lib/metadata";
import {
  getGalleryPage,
  getHomePage,
  getScheduleEvents,
  getWeddingDetails,
} from "@/sanity/lib/getContent";

export async function generateMetadata() {
  const site = await getWeddingDetails({ stega: false });
  return createPageMetadata({
    title: site.social.title,
    description: site.social.description,
    path: "/",
    site,
  });
}

export default async function HomePage() {
  const [home, events, gallery] = await Promise.all([
    getHomePage(),
    getScheduleEvents(),
    getGalleryPage(),
  ]);
  const { visibility } = home;

  return (
    <>
      <InvitationHero hero={home.hero} />
      {visibility.showWelcome ? <WelcomeNote welcome={home.welcome} /> : null}
      {visibility.showStory ? <OurStory story={home.story} /> : null}
      {visibility.showCountdown ? <Countdown /> : null}
      {visibility.showSchedulePreview ? (
        <SchedulePreview
          schedulePreview={home.schedulePreview}
          events={events}
        />
      ) : null}
      {visibility.showFeature ? (
        <EditorialFeature feature={home.feature} />
      ) : null}
      {visibility.showTravelPreview ? (
        <TravelPreview travelPreview={home.travelPreview} />
      ) : null}
      {visibility.showGalleryPreview ? (
        <GalleryPreview
          galleryPreview={home.galleryPreview}
          images={gallery.images}
        />
      ) : null}
      {visibility.showRsvpFinale ? (
        <RsvpFinale rsvpFinale={home.rsvpFinale} />
      ) : null}
    </>
  );
}
