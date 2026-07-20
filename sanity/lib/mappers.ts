import type {
  Activity,
  ActivityCategory,
  Airport,
  FaqItem,
  GalleryImage,
  Hotel,
  RegistryItem,
  ScheduleEvent,
  SiteConfig,
  WeddingPartyMember,
} from "@/types/content";
import type { HomeContent } from "@/types/content";
import { resolveImageUrl } from "@/sanity/lib/image";
import { siteConfig as fallbackSite } from "@/content/site";
import { homeContent as fallbackHome } from "@/content/home";

type SanityImage = {
  asset?: unknown;
  alt?: string;
  hotspot?: unknown;
  crop?: unknown;
} | null;

export function mapWeddingDetails(doc: Record<string, unknown> | null): SiteConfig {
  if (!doc) return fallbackSite;

  const initials = Array.isArray(doc.initials)
    ? (doc.initials as string[])
    : fallbackSite.coupleNames.initials;

  return {
    brandName: "mazel.rose",
    coupleNames: {
      partnerOne: String(doc.partnerOneName || fallbackSite.coupleNames.partnerOne),
      partnerTwo: String(doc.partnerTwoName || fallbackSite.coupleNames.partnerTwo),
      display: String(doc.coupleDisplayName || fallbackSite.coupleNames.display),
      initials: [initials[0] || "M", initials[1] || "R"],
    },
    weddingDate: String(doc.weddingDate || fallbackSite.weddingDate).slice(0, 10),
    weddingDateDisplay: String(
      doc.weddingDateDisplay || fallbackSite.weddingDateDisplay,
    ),
    weddingDateIso: String(doc.weddingDate || fallbackSite.weddingDateIso),
    location: {
      city: String(doc.locationCity || fallbackSite.location.city),
      state: String(doc.locationState || fallbackSite.location.state),
      display: String(doc.locationDisplay || fallbackSite.location.display),
    },
    venue: {
      name: String(doc.ceremonyVenueName || fallbackSite.venue.name),
      address: String(doc.ceremonyVenueAddress || fallbackSite.venue.address),
      mapUrl: String(doc.mapUrl || fallbackSite.venue.mapUrl),
    },
    rsvpDeadline: String(doc.rsvpDeadline || fallbackSite.rsvpDeadline).slice(0, 10),
    rsvpDeadlineDisplay: String(
      doc.rsvpDeadlineDisplay || fallbackSite.rsvpDeadlineDisplay,
    ),
    contactEmail: String(doc.contactEmail || fallbackSite.contactEmail),
    tagline: String(doc.tagline || fallbackSite.tagline),
    closingStatement: String(doc.footerMessage || fallbackSite.closingStatement),
    navigation: fallbackSite.navigation,
    social: {
      title: `mazel.rose — ${String(doc.coupleDisplayName || "Wedding Celebration")}`,
      description: String(
        doc.socialDescription || fallbackSite.social.description,
      ),
    },
  };
}

export function mapHomePage(doc: Record<string, unknown> | null): HomeContent & {
  visibility: Record<string, boolean>;
} {
  if (!doc) {
    return {
      ...fallbackHome,
      visibility: {
        showWelcome: true,
        showStory: true,
        showCountdown: true,
        showSchedulePreview: true,
        showFeature: true,
        showTravelPreview: true,
        showGalleryPreview: true,
        showRsvpFinale: true,
      },
    };
  }

  const heroImage = doc.heroImage as SanityImage;
  const welcomeImage = doc.welcomeImage as SanityImage;
  const storyImage = doc.storyImage as SanityImage;
  const featureImage = doc.featureImage as SanityImage;

  return {
    hero: {
      scriptIntro: String(doc.heroScript || fallbackHome.hero.scriptIntro),
      heading: String(doc.heroHeading || fallbackHome.hero.heading),
      invitationLine: String(doc.heroSubheading || fallbackHome.hero.invitationLine),
      primaryCta: {
        label: String(
          (doc.primaryCta as { label?: string })?.label ||
            fallbackHome.hero.primaryCta.label,
        ),
        href: String(
          (doc.primaryCta as { href?: string })?.href ||
            fallbackHome.hero.primaryCta.href,
        ),
      },
      secondaryCta: {
        label: String(
          (doc.secondaryCta as { label?: string })?.label ||
            fallbackHome.hero.secondaryCta.label,
        ),
        href: String(
          (doc.secondaryCta as { href?: string })?.href ||
            fallbackHome.hero.secondaryCta.href,
        ),
      },
      image:
        resolveImageUrl(heroImage, 2400) || fallbackHome.hero.image,
      imageAlt:
        heroImage?.alt ||
        fallbackHome.hero.imageAlt,
    },
    welcome: {
      scriptIntro: String(doc.welcomeScript || fallbackHome.welcome.scriptIntro),
      title: String(doc.welcomeHeading || fallbackHome.welcome.title),
      body: String(doc.welcomeMessage || fallbackHome.welcome.body),
      image:
        resolveImageUrl(welcomeImage, 1400) || fallbackHome.welcome.image,
      imageAlt: welcomeImage?.alt || fallbackHome.welcome.imageAlt,
    },
    story: {
      title: String(doc.storyHeading || fallbackHome.story.title),
      body: String(doc.storyBody || fallbackHome.story.body),
      image: resolveImageUrl(storyImage, 1600) || fallbackHome.story.image,
      imageAlt: storyImage?.alt || fallbackHome.story.imageAlt,
      accentNote: String(doc.storyAccentNote || fallbackHome.story.accentNote),
    },
    schedulePreview: {
      title: String(
        doc.schedulePreviewTitle || fallbackHome.schedulePreview.title,
      ),
      body: String(doc.schedulePreviewBody || fallbackHome.schedulePreview.body),
      ctaLabel: String(
        doc.schedulePreviewCtaLabel || fallbackHome.schedulePreview.ctaLabel,
      ),
      eventIds: fallbackHome.schedulePreview.eventIds,
    },
    feature: {
      quote: String(doc.featureQuote || fallbackHome.feature.quote),
      attribution: String(
        doc.featureAttribution || fallbackHome.feature.attribution,
      ),
      image: resolveImageUrl(featureImage, 2400) || fallbackHome.feature.image,
      imageAlt: featureImage?.alt || fallbackHome.feature.imageAlt,
    },
    travelPreview: {
      title: String(
        doc.travelPreviewTitle || fallbackHome.travelPreview.title,
      ),
      body: String(doc.travelPreviewBody || fallbackHome.travelPreview.body),
      ctaLabel: String(
        doc.travelPreviewCtaLabel || fallbackHome.travelPreview.ctaLabel,
      ),
      highlights: Array.isArray(doc.travelPreviewHighlights)
        ? (doc.travelPreviewHighlights as string[])
        : fallbackHome.travelPreview.highlights,
    },
    galleryPreview: {
      title: String(
        doc.galleryPreviewTitle || fallbackHome.galleryPreview.title,
      ),
      body: String(
        doc.galleryPreviewBody || fallbackHome.galleryPreview.body,
      ),
      ctaLabel: String(
        doc.galleryPreviewCtaLabel || fallbackHome.galleryPreview.ctaLabel,
      ),
      imageIds: fallbackHome.galleryPreview.imageIds,
    },
    rsvpFinale: {
      title: String(doc.rsvpFinaleTitle || fallbackHome.rsvpFinale.title),
      body: String(doc.rsvpFinaleBody || fallbackHome.rsvpFinale.body),
      ctaLabel: String(
        doc.rsvpFinaleCtaLabel || fallbackHome.rsvpFinale.ctaLabel,
      ),
    },
    visibility: {
      showWelcome: doc.showWelcome !== false,
      showStory: doc.showStory !== false,
      showCountdown: doc.showCountdown !== false,
      showSchedulePreview: doc.showSchedulePreview !== false,
      showFeature: doc.showFeature !== false,
      showTravelPreview: doc.showTravelPreview !== false,
      showGalleryPreview: doc.showGalleryPreview !== false,
      showRsvpFinale: doc.showRsvpFinale !== false,
    },
  };
}

export function mapScheduleEvents(
  docs: Array<Record<string, unknown>> | null,
  fallback: ScheduleEvent[],
): ScheduleEvent[] {
  if (!docs?.length) return fallback;
  return docs.map((doc) => ({
    id: String(doc._id),
    title: String(doc.title || ""),
    date: String(doc.date || ""),
    startTime: String(doc.startTime || ""),
    endTime: doc.endTime ? String(doc.endTime) : undefined,
    venue: String(doc.venue || ""),
    address: String(doc.address || ""),
    description: String(doc.description || ""),
    dressCode: doc.dressCode ? String(doc.dressCode) : undefined,
    mapUrl: doc.mapUrl ? String(doc.mapUrl) : undefined,
    transportation: doc.transportation ? String(doc.transportation) : undefined,
    parking: doc.parking ? String(doc.parking) : undefined,
    invitationOnly: Boolean(doc.invitationOnly),
    isPrivate: Boolean(doc.isPrivate),
  }));
}

export function mapAirports(
  docs: Array<Record<string, unknown>> | null,
  fallback: Airport[],
): Airport[] {
  if (!docs?.length) return fallback;
  return docs.map((doc) => ({
    name: String(doc.name || ""),
    code: String(doc.code || ""),
    distance: String(doc.driveTime || doc.distance || ""),
    notes: String(doc.description || ""),
  }));
}

export function mapHotels(
  docs: Array<Record<string, unknown>> | null,
  fallback: Hotel[],
): Hotel[] {
  if (!docs?.length) return fallback;
  return docs.map((doc, index) => {
    const image = doc.image as SanityImage;
    const fallbackHotel = fallback[index] || fallback[0];
    return {
      id: String(doc._id),
      name: String(doc.name || ""),
      image: resolveImageUrl(image, 1400) || fallbackHotel?.image || "",
      imageAlt:
        image?.alt || fallbackHotel?.imageAlt || String(doc.name || "Hotel"),
      address: String(doc.address || ""),
      distance: String(doc.distance || ""),
      description: String(doc.description || ""),
      bookingUrl: String(doc.bookingUrl || "#"),
      groupCode: doc.groupCode ? String(doc.groupCode) : undefined,
      reservationDeadline: doc.bookingDeadline
        ? String(doc.bookingDeadline)
        : undefined,
      phone: doc.phone ? String(doc.phone) : undefined,
      amenities: Array.isArray(doc.amenities)
        ? (doc.amenities as string[])
        : [],
    };
  });
}

export function mapRegistryLinks(
  docs: Array<Record<string, unknown>> | null,
  fallback: RegistryItem[],
): RegistryItem[] {
  if (!docs?.length) return fallback;
  return docs.map((doc) => ({
    id: String(doc._id),
    name: String(doc.name || ""),
    description: String(doc.description || ""),
    url: String(doc.url || "#"),
    type: (doc.registryType as RegistryItem["type"]) || "retailer",
  }));
}

export function mapWeddingParty(
  docs: Array<Record<string, unknown>> | null,
  fallback: WeddingPartyMember[],
): WeddingPartyMember[] {
  if (!docs?.length) return fallback;
  return docs.map((doc, index) => {
    const photo = doc.photo as SanityImage;
    const fallbackMember = fallback[index] || fallback[0];
    return {
      id: String(doc._id),
      name: String(doc.name || ""),
      role: String(doc.role || ""),
      image: resolveImageUrl(photo, 1200) || fallbackMember?.image || "",
      imageAlt:
        photo?.alt ||
        fallbackMember?.imageAlt ||
        String(doc.name || "Wedding party member"),
      relationship: String(doc.relationship || ""),
      bio: String(doc.biography || ""),
      funFact: doc.funFact ? String(doc.funFact) : undefined,
      side: (doc.side as WeddingPartyMember["side"]) || "shared",
    };
  });
}

export function mapGalleryPhotos(
  docs: Array<Record<string, unknown>> | null,
  fallback: GalleryImage[],
): GalleryImage[] {
  if (!docs?.length) return fallback;
  const mapped = docs.map((doc, index) => {
    const image = doc.image as SanityImage;
    const fallbackImage = fallback[index] || fallback[0];
    const src = resolveImageUrl(image, 1600) || fallbackImage?.src || "";
    if (!src) return null;
    return {
      id: String(doc._id),
      src,
      alt: image?.alt || fallbackImage?.alt || String(doc.caption || "Gallery photo"),
      caption: doc.caption ? String(doc.caption) : fallbackImage?.caption,
      width: fallbackImage?.width || 1600,
      height: fallbackImage?.height || (index % 2 === 0 ? 1067 : 1600),
    };
  });
  const photos = mapped.filter(Boolean) as GalleryImage[];
  return photos.length ? photos : fallback;
}

export function mapActivities(
  docs: Array<Record<string, unknown>> | null,
  fallback: Activity[],
): Activity[] {
  if (!docs?.length) return fallback;
  return docs.map((doc, index) => {
    const image = doc.image as SanityImage;
    const fallbackActivity = fallback[index] || fallback[0];
    return {
      id: String(doc._id),
      name: String(doc.name || ""),
      category: (doc.category as ActivityCategory) || "attractions",
      image: resolveImageUrl(image, 1200) || fallbackActivity?.image || "",
      imageAlt:
        image?.alt ||
        fallbackActivity?.imageAlt ||
        String(doc.name || "Activity"),
      description: String(doc.description || ""),
      address: String(doc.address || ""),
      distance: doc.distance ? String(doc.distance) : undefined,
      websiteUrl: doc.websiteUrl ? String(doc.websiteUrl) : undefined,
      mapUrl: doc.mapUrl ? String(doc.mapUrl) : undefined,
      recommendation: doc.recommendation
        ? String(doc.recommendation)
        : undefined,
      priceRange: doc.priceRange ? String(doc.priceRange) : undefined,
    };
  });
}

export function mapFaqItems(
  docs: Array<Record<string, unknown>> | null,
  fallback: FaqItem[],
): FaqItem[] {
  if (!docs?.length) return fallback;
  return docs.map((doc) => ({
    id: String(doc._id),
    question: String(doc.question || ""),
    answer: String(doc.answer || ""),
  }));
}
