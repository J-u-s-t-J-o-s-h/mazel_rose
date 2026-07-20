/**
 * Idempotent Sanity content seed from local fallback content.
 *
 * Usage:
 *   npm run sanity:seed
 *
 * Loads variables from `.env.local` (see package.json). Requires
 * NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_WRITE_TOKEN.
 *
 * Re-running updates the same singleton IDs and keyed documents without duplicates.
 */

import { createClient } from "@sanity/client";
import { siteConfig } from "../content/site";
import { homeContent } from "../content/home";
import { scheduleEvents } from "../content/schedule";
import {
  airports,
  hotels,
  travelDetails,
  travelIntro,
} from "../content/travel";
import { registryIntro, registryItems } from "../content/registry";
import { weddingParty } from "../content/wedding-party";
import { galleryImages, galleryIntro } from "../content/gallery";
import { activities, activitiesIntro } from "../content/activities";
import { faqs, faqsIntro } from "../content/faqs";
import { SINGLETON_IDS } from "../sanity/schemaTypes";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_WRITE_TOKEN;
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-02-01";

if (!projectId || !token) {
  console.error(
    "Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_WRITE_TOKEN",
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion,
  useCdn: false,
});

async function upsert(
  id: string,
  document: { _type: string } & Record<string, unknown>,
) {
  await client.createOrReplace({ _id: id, ...document });
  console.log(`✓ ${id}`);
}

async function main() {
  console.log(`Seeding Sanity project ${projectId}/${dataset}…`);

  await upsert(SINGLETON_IDS.weddingDetails, {
    _type: "weddingDetails",
    partnerOneName: siteConfig.coupleNames.partnerOne,
    partnerTwoName: siteConfig.coupleNames.partnerTwo,
    coupleDisplayName: siteConfig.coupleNames.display,
    initials: siteConfig.coupleNames.initials,
    weddingDate: siteConfig.weddingDateIso,
    weddingDateDisplay: siteConfig.weddingDateDisplay,
    rsvpDeadline: `${siteConfig.rsvpDeadline}T23:59:00-04:00`,
    rsvpDeadlineDisplay: siteConfig.rsvpDeadlineDisplay,
    locationCity: siteConfig.location.city,
    locationState: siteConfig.location.state,
    locationDisplay: siteConfig.location.display,
    ceremonyVenueName: siteConfig.venue.name,
    ceremonyVenueAddress: siteConfig.venue.address,
    receptionVenueName: siteConfig.venue.name,
    receptionVenueAddress: siteConfig.venue.address,
    mapUrl: siteConfig.venue.mapUrl,
    contactEmail: siteConfig.contactEmail,
    footerMessage: siteConfig.closingStatement,
    tagline: siteConfig.tagline,
    socialDescription: siteConfig.social.description,
    announcementVisible: false,
    timezone: "America/New_York",
    allowSearchIndexing: false,
  });

  await upsert(SINGLETON_IDS.homePage, {
    _type: "homePage",
    heroEyebrow: "",
    heroScript: homeContent.hero.scriptIntro,
    heroHeading: homeContent.hero.heading,
    heroSubheading: homeContent.hero.invitationLine,
    // Images remain as Unsplash URLs in the frontend fallback until uploaded in Studio.
    // Seed stores text; image assets should be uploaded manually or via a follow-up asset import.
    primaryCta: homeContent.hero.primaryCta,
    secondaryCta: homeContent.hero.secondaryCta,
    welcomeScript: homeContent.welcome.scriptIntro,
    welcomeHeading: homeContent.welcome.title,
    welcomeMessage: homeContent.welcome.body,
    storyHeading: homeContent.story.title,
    storyBody: homeContent.story.body,
    storyAccentNote: homeContent.story.accentNote,
    featureQuote: homeContent.feature.quote,
    featureAttribution: homeContent.feature.attribution,
    schedulePreviewTitle: homeContent.schedulePreview.title,
    schedulePreviewBody: homeContent.schedulePreview.body,
    schedulePreviewCtaLabel: homeContent.schedulePreview.ctaLabel,
    travelPreviewTitle: homeContent.travelPreview.title,
    travelPreviewBody: homeContent.travelPreview.body,
    travelPreviewCtaLabel: homeContent.travelPreview.ctaLabel,
    travelPreviewHighlights: homeContent.travelPreview.highlights,
    galleryPreviewTitle: homeContent.galleryPreview.title,
    galleryPreviewBody: homeContent.galleryPreview.body,
    galleryPreviewCtaLabel: homeContent.galleryPreview.ctaLabel,
    rsvpFinaleTitle: homeContent.rsvpFinale.title,
    rsvpFinaleBody: homeContent.rsvpFinale.body,
    rsvpFinaleCtaLabel: homeContent.rsvpFinale.ctaLabel,
    showWelcome: true,
    showStory: true,
    showCountdown: true,
    showSchedulePreview: true,
    showFeature: true,
    showTravelPreview: true,
    showGalleryPreview: true,
    showRsvpFinale: true,
  });

  await upsert(SINGLETON_IDS.travelOverview, {
    _type: "travelOverview",
    scriptIntro: travelIntro.scriptIntro,
    heading: travelIntro.title,
    intro: travelIntro.body,
    drivingInfo: travelDetails.driving,
    transportationOverview: travelDetails.shuttle,
    shuttleInfo: travelDetails.shuttle,
    parkingInfo: travelDetails.parking,
    generalMapUrl: siteConfig.venue.mapUrl,
    contactNote: travelDetails.localContact.note,
    contactEmail: travelDetails.localContact.email,
  });

  await upsert(SINGLETON_IDS.registryIntro, {
    _type: "registryIntro",
    scriptIntro: registryIntro.scriptIntro,
    heading: registryIntro.title,
    message: registryIntro.body,
  });

  await upsert(SINGLETON_IDS.gallerySettings, {
    _type: "gallerySettings",
    scriptIntro: galleryIntro.scriptIntro,
    heading: galleryIntro.title,
    introduction: galleryIntro.body,
    showCaptions: true,
  });

  await upsert(SINGLETON_IDS.localGuideIntro, {
    _type: "localGuideIntro",
    scriptIntro: activitiesIntro.scriptIntro,
    heading: activitiesIntro.title,
    introduction: activitiesIntro.body,
  });

  await upsert(SINGLETON_IDS.faqPage, {
    _type: "faqPage",
    scriptIntro: faqsIntro.scriptIntro,
    heading: faqsIntro.title,
    introduction: faqsIntro.body,
    contactMessage: "Questions? Reach out anytime.",
    contactEmail: siteConfig.contactEmail,
  });

  await upsert(SINGLETON_IDS.rsvpFormSettings, {
    _type: "rsvpFormSettings",
    heading: "RSVP",
    scriptIntro: "Répondez",
    introduction: `We hope you will join us in ${siteConfig.location.display}. Please reply by ${siteConfig.rsvpDeadlineDisplay}.`,
    rsvpDeadlineDisplay: siteConfig.rsvpDeadlineDisplay,
    formOpen: true,
    closedMessage:
      "RSVP is currently closed. Please contact us if you need assistance.",
    confirmationHeading: "Your reply has been received",
    confirmationMessage:
      "We are so grateful. We cannot wait to celebrate with you.",
    mealOptions: [
      { _key: "beef", value: "beef", label: "Beef" },
      { _key: "chicken", value: "chicken", label: "Chicken" },
      { _key: "fish", value: "fish", label: "Fish" },
      { _key: "vegetarian", value: "vegetarian", label: "Vegetarian" },
      { _key: "vegan", value: "vegan", label: "Vegan" },
      { _key: "kids", value: "kids", label: "Child meal" },
      { _key: "undecided", value: "undecided", label: "Still deciding" },
    ],
    eventOptions: [
      { _key: "ceremony", key: "ceremony", label: "Ceremony" },
      { _key: "reception", key: "reception", label: "Reception" },
      { _key: "welcome", key: "welcome", label: "Welcome gathering" },
      { _key: "brunch", key: "brunch", label: "Farewell brunch" },
    ],
    showDietaryField: true,
    showSongRequestField: true,
    showPhoneField: true,
    showEmailField: true,
    helpMessage: `Email ${siteConfig.contactEmail} with questions.`,
  });

  for (const [index, event] of scheduleEvents.entries()) {
    await upsert(`scheduleEvent.${event.id}`, {
      _type: "scheduleEvent",
      title: event.title,
      date: event.date,
      startTime: event.startTime,
      endTime: event.endTime,
      venue: event.venue,
      address: event.address,
      description: event.description,
      dressCode: event.dressCode,
      mapUrl: event.mapUrl,
      transportation: event.transportation,
      parking: event.parking,
      invitationOnly: event.invitationOnly,
      isPrivate: event.isPrivate,
      featured: ["ceremony", "reception"].includes(event.id),
      showOnWebsite: true,
      displayOrder: index,
    });
  }

  for (const [index, airport] of airports.entries()) {
    await upsert(`airport.${airport.code}`, {
      _type: "airport",
      name: airport.name,
      code: airport.code,
      distance: airport.distance,
      driveTime: airport.distance,
      description: airport.notes,
      showOnWebsite: true,
      displayOrder: index,
    });
  }

  for (const [index, hotel] of hotels.entries()) {
    await upsert(`hotel.${hotel.id}`, {
      _type: "hotel",
      name: hotel.name,
      address: hotel.address,
      distance: hotel.distance,
      description: hotel.description,
      bookingUrl: hotel.bookingUrl,
      groupCode: hotel.groupCode,
      bookingDeadline: hotel.reservationDeadline,
      phone: hotel.phone,
      amenities: hotel.amenities,
      featured: index === 0,
      showOnWebsite: true,
      displayOrder: index,
      // image uploaded separately in Studio
    });
  }

  for (const [index, item] of registryItems.entries()) {
    await upsert(`registryLink.${item.id}`, {
      _type: "registryLink",
      name: item.name,
      registryType: item.type,
      description: item.description,
      url: item.url,
      buttonLabel: "View registry",
      featured: false,
      showOnWebsite: true,
      displayOrder: index,
    });
  }

  for (const [index, member] of weddingParty.entries()) {
    await upsert(`weddingPartyMember.${member.id}`, {
      _type: "weddingPartyMember",
      name: member.name,
      role: member.role,
      relationship: member.relationship,
      biography: member.bio,
      funFact: member.funFact,
      side: member.side,
      featured: index < 2,
      showOnWebsite: true,
      displayOrder: index,
    });
  }

  for (const [index, image] of galleryImages.entries()) {
    await upsert(`galleryPhoto.${image.id}`, {
      _type: "galleryPhoto",
      caption: image.caption,
      featured: index < 4,
      showOnWebsite: true,
      displayOrder: index,
    });
  }

  for (const [index, activity] of activities.entries()) {
    await upsert(`activity.${activity.id}`, {
      _type: "activity",
      name: activity.name,
      category: activity.category,
      description: activity.description,
      address: activity.address,
      distance: activity.distance,
      websiteUrl: activity.websiteUrl,
      mapUrl: activity.mapUrl,
      priceRange: activity.priceRange,
      recommendation: activity.recommendation,
      featured: false,
      showOnWebsite: true,
      displayOrder: index,
    });
  }

  for (const [index, faq] of faqs.entries()) {
    await upsert(`faqItem.${faq.id}`, {
      _type: "faqItem",
      question: faq.question,
      answer: faq.answer,
      showOnWebsite: true,
      displayOrder: index,
    });
  }

  console.log("\nSeed complete.");
  console.log(
    "Note: Image fields were left empty so you can upload high-quality originals in Studio (Replace image).",
  );
  console.log(
    "Until images are uploaded in Sanity, the site continues to use graceful Unsplash fallbacks from local content mappers where needed.",
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
