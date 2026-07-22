import { isSanityConfigured } from "@/sanity/env";
import {
  ACTIVITIES_QUERY,
  AIRPORTS_QUERY,
  FAQ_ITEMS_QUERY,
  FAQ_PAGE_QUERY,
  GALLERY_PHOTOS_QUERY,
  GALLERY_SETTINGS_QUERY,
  HOME_PAGE_QUERY,
  HOTELS_QUERY,
  LOCAL_GUIDE_INTRO_QUERY,
  REGISTRY_INTRO_QUERY,
  REGISTRY_LINKS_QUERY,
  RSVP_FORM_SETTINGS_QUERY,
  SCHEDULE_EVENTS_QUERY,
  TRAVEL_OVERVIEW_QUERY,
  WEDDING_DETAILS_QUERY,
  WEDDING_PARTY_QUERY,
} from "@/sanity/lib/queries";
import {
  mapActivities,
  mapAirports,
  mapFaqItems,
  mapGalleryPhotos,
  mapHomePage,
  mapHotels,
  mapRegistryLinks,
  mapScheduleEvents,
  mapWeddingDetails,
  mapWeddingParty,
} from "@/sanity/lib/mappers";
import { siteConfig as fallbackSite } from "@/content/site";
import { homeContent as fallbackHome } from "@/content/home";
import { scheduleEvents as fallbackSchedule } from "@/content/schedule";
import {
  airports as fallbackAirports,
  hotels as fallbackHotels,
  travelDetails as fallbackTravelDetails,
  travelIntro as fallbackTravelIntro,
} from "@/content/travel";
import {
  registryIntro as fallbackRegistryIntro,
  registryItems as fallbackRegistry,
} from "@/content/registry";
import {
  weddingParty as fallbackParty,
  weddingPartyIntro as fallbackPartyIntro,
} from "@/content/wedding-party";
import {
  galleryImages as fallbackGallery,
  galleryIntro as fallbackGalleryIntro,
} from "@/content/gallery";
import {
  activities as fallbackActivities,
  activitiesIntro as fallbackActivitiesIntro,
} from "@/content/activities";
import { faqs as fallbackFaqs, faqsIntro as fallbackFaqsIntro } from "@/content/faqs";
import { resolveImageUrl } from "@/sanity/lib/image";

async function safeFetch<T>(
  query: Parameters<typeof import("@/sanity/lib/live").sanityFetch>[0]["query"],
  stega = true,
): Promise<T | null> {
  if (!isSanityConfigured()) return null;

  try {
    const { sanityFetch } = await import("@/sanity/lib/live");
    const { data } = await sanityFetch({
      query,
      stega,
      // tags inferred by next-sanity live when available
    });
    return (data as T) ?? null;
  } catch (error) {
    console.error("[sanity] fetch failed, using fallback content", error);
    return null;
  }
}

export async function getWeddingDetails(options?: { stega?: boolean }) {
  const data = await safeFetch<Record<string, unknown>>(
    WEDDING_DETAILS_QUERY,
    options?.stega ?? true,
  );
  return mapWeddingDetails(data);
}

export async function getHomePage() {
  const data = await safeFetch<Record<string, unknown>>(HOME_PAGE_QUERY);
  return mapHomePage(data);
}

export async function getScheduleEvents() {
  const data = await safeFetch<Array<Record<string, unknown>>>(
    SCHEDULE_EVENTS_QUERY,
  );
  return mapScheduleEvents(data, fallbackSchedule);
}

export async function getTravelPage() {
  const [overview, airports, hotels] = await Promise.all([
    safeFetch<Record<string, unknown>>(TRAVEL_OVERVIEW_QUERY),
    safeFetch<Array<Record<string, unknown>>>(AIRPORTS_QUERY),
    safeFetch<Array<Record<string, unknown>>>(HOTELS_QUERY),
  ]);

  return {
    intro: {
      title: String(overview?.heading || fallbackTravelIntro.title),
      scriptIntro: String(
        overview?.scriptIntro || fallbackTravelIntro.scriptIntro,
      ),
      body: String(overview?.intro || fallbackTravelIntro.body),
    },
    airports: mapAirports(airports, fallbackAirports),
    hotels: mapHotels(hotels, fallbackHotels),
    details: {
      driving: String(overview?.drivingInfo || fallbackTravelDetails.driving),
      shuttle: String(overview?.shuttleInfo || fallbackTravelDetails.shuttle),
      parking: String(overview?.parkingInfo || fallbackTravelDetails.parking),
      localContact: {
        label: "Local travel questions",
        email: String(
          overview?.contactEmail || fallbackTravelDetails.localContact.email,
        ),
        note: String(
          overview?.contactNote || fallbackTravelDetails.localContact.note,
        ),
      },
    },
  };
}

export async function getRegistryPage() {
  const [intro, links] = await Promise.all([
    safeFetch<Record<string, unknown>>(REGISTRY_INTRO_QUERY),
    safeFetch<Array<Record<string, unknown>>>(REGISTRY_LINKS_QUERY),
  ]);

  return {
    intro: {
      title: String(intro?.heading || fallbackRegistryIntro.title),
      scriptIntro: String(
        intro?.scriptIntro || fallbackRegistryIntro.scriptIntro,
      ),
      body: String(intro?.message || fallbackRegistryIntro.body),
    },
    items: mapRegistryLinks(links, fallbackRegistry),
  };
}

export async function getWeddingPartyPage() {
  const members = await safeFetch<Array<Record<string, unknown>>>(
    WEDDING_PARTY_QUERY,
  );
  return {
    intro: fallbackPartyIntro,
    members: mapWeddingParty(members, fallbackParty),
  };
}

export async function getGalleryPage() {
  const [settings, photos] = await Promise.all([
    safeFetch<Record<string, unknown>>(GALLERY_SETTINGS_QUERY),
    safeFetch<Array<Record<string, unknown>>>(GALLERY_PHOTOS_QUERY),
  ]);

  return {
    intro: {
      title: String(settings?.heading || fallbackGalleryIntro.title),
      scriptIntro: String(
        settings?.scriptIntro || fallbackGalleryIntro.scriptIntro,
      ),
      body: String(settings?.introduction || fallbackGalleryIntro.body),
    },
    showCaptions: settings?.showCaptions !== false,
    images: mapGalleryPhotos(photos, fallbackGallery),
  };
}

export async function getThingsToDoPage() {
  const [intro, activities] = await Promise.all([
    safeFetch<Record<string, unknown>>(LOCAL_GUIDE_INTRO_QUERY),
    safeFetch<Array<Record<string, unknown>>>(ACTIVITIES_QUERY),
  ]);

  return {
    intro: {
      title: String(intro?.heading || fallbackActivitiesIntro.title),
      scriptIntro: String(
        intro?.scriptIntro || fallbackActivitiesIntro.scriptIntro,
      ),
      body: String(intro?.introduction || fallbackActivitiesIntro.body),
    },
    activities: mapActivities(activities, fallbackActivities),
  };
}

export async function getFaqsPage() {
  const [page, items] = await Promise.all([
    safeFetch<Record<string, unknown>>(FAQ_PAGE_QUERY),
    safeFetch<Array<Record<string, unknown>>>(FAQ_ITEMS_QUERY),
  ]);

  return {
    intro: {
      title: String(page?.heading || fallbackFaqsIntro.title),
      scriptIntro: String(page?.scriptIntro || fallbackFaqsIntro.scriptIntro),
      body: String(page?.introduction || fallbackFaqsIntro.body),
    },
    contactMessage: page?.contactMessage
      ? String(page.contactMessage)
      : undefined,
    contactEmail: page?.contactEmail ? String(page.contactEmail) : undefined,
    faqs: mapFaqItems(items, fallbackFaqs),
  };
}

export async function getRsvpFormSettings() {
  // stega=false: these values drive form controls (meal/event option values
  // are submitted verbatim), so they must never carry stega watermark
  // characters. Click-to-edit overlays aren't meaningful on form inputs anyway.
  const data = await safeFetch<Record<string, unknown>>(
    RSVP_FORM_SETTINGS_QUERY,
    false,
  );
  return {
    heading: String(data?.heading || "RSVP"),
    scriptIntro: String(data?.scriptIntro || "Répondez"),
    introduction: String(
      data?.introduction ||
        "We hope you will join us. Please reply by the date below.",
    ),
    rsvpDeadlineDisplay: data?.rsvpDeadlineDisplay
      ? String(data.rsvpDeadlineDisplay)
      : undefined,
    formOpen: data?.formOpen !== false,
    closedMessage: String(
      data?.closedMessage ||
        "RSVP is currently closed. Please contact us if you need assistance.",
    ),
    confirmationHeading: String(
      data?.confirmationHeading || "Your reply has been received",
    ),
    confirmationMessage: String(
      data?.confirmationMessage ||
        "We are so grateful. We cannot wait to celebrate with you.",
    ),
    mealOptions: Array.isArray(data?.mealOptions)
      ? (data.mealOptions as Array<{ value: string; label: string }>)
      : undefined,
    eventOptions: Array.isArray(data?.eventOptions)
      ? (data.eventOptions as Array<{ key: string; label: string }>)
      : undefined,
    showDietaryField: data?.showDietaryField !== false,
    showSongRequestField: data?.showSongRequestField !== false,
    showPhoneField: data?.showPhoneField !== false,
    showEmailField: data?.showEmailField !== false,
    helpMessage: data?.helpMessage ? String(data.helpMessage) : undefined,
  };
}

export async function getSocialImageUrl() {
  const data = await safeFetch<Record<string, unknown>>(
    WEDDING_DETAILS_QUERY,
    false,
  );
  return resolveImageUrl(data?.socialImage as never, 1200);
}

export async function getSearchIndexingAllowed() {
  const data = await safeFetch<Record<string, unknown>>(
    WEDDING_DETAILS_QUERY,
    false,
  );
  if (!data) return process.env.NEXT_PUBLIC_NOINDEX !== "true";
  return data.allowSearchIndexing === true;
}

// Keep fallbacks available for seed script / offline builds
export const fallbackContent = {
  site: fallbackSite,
  home: fallbackHome,
};
