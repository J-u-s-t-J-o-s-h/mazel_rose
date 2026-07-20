import {
  defineLocations,
  type PresentationPluginOptions,
} from "sanity/presentation";

export const resolve: PresentationPluginOptions["resolve"] = {
  locations: {
    weddingDetails: defineLocations({
      select: { title: "coupleDisplayName" },
      resolve: () => ({
        locations: [
          { title: "Home", href: "/" },
          { title: "RSVP", href: "/rsvp" },
        ],
      }),
    }),
    homePage: defineLocations({
      select: { title: "heroHeading" },
      resolve: () => ({
        locations: [{ title: "Home", href: "/" }],
      }),
    }),
    scheduleEvent: defineLocations({
      select: { title: "title" },
      resolve: (doc) => ({
        locations: [
          { title: doc?.title || "Schedule", href: "/schedule" },
          { title: "Home", href: "/" },
        ],
      }),
    }),
    travelOverview: defineLocations({
      select: { title: "heading" },
      resolve: () => ({
        locations: [{ title: "Travel", href: "/travel" }],
      }),
    }),
    airport: defineLocations({
      select: { title: "name" },
      resolve: () => ({
        locations: [{ title: "Travel", href: "/travel" }],
      }),
    }),
    hotel: defineLocations({
      select: { title: "name" },
      resolve: () => ({
        locations: [{ title: "Travel", href: "/travel" }],
      }),
    }),
    registryIntro: defineLocations({
      select: { title: "heading" },
      resolve: () => ({
        locations: [{ title: "Registry", href: "/registry" }],
      }),
    }),
    registryLink: defineLocations({
      select: { title: "name" },
      resolve: () => ({
        locations: [{ title: "Registry", href: "/registry" }],
      }),
    }),
    weddingPartyMember: defineLocations({
      select: { title: "name" },
      resolve: () => ({
        locations: [{ title: "Wedding Party", href: "/wedding-party" }],
      }),
    }),
    gallerySettings: defineLocations({
      select: { title: "heading" },
      resolve: () => ({
        locations: [{ title: "Gallery", href: "/gallery" }],
      }),
    }),
    galleryPhoto: defineLocations({
      select: { title: "caption" },
      resolve: () => ({
        locations: [
          { title: "Gallery", href: "/gallery" },
          { title: "Home", href: "/" },
        ],
      }),
    }),
    localGuideIntro: defineLocations({
      select: { title: "heading" },
      resolve: () => ({
        locations: [{ title: "Things To Do", href: "/things-to-do" }],
      }),
    }),
    activity: defineLocations({
      select: { title: "name" },
      resolve: () => ({
        locations: [{ title: "Things To Do", href: "/things-to-do" }],
      }),
    }),
    faqPage: defineLocations({
      select: { title: "heading" },
      resolve: () => ({
        locations: [{ title: "FAQs", href: "/faqs" }],
      }),
    }),
    faqItem: defineLocations({
      select: { title: "question" },
      resolve: () => ({
        locations: [{ title: "FAQs", href: "/faqs" }],
      }),
    }),
    rsvpFormSettings: defineLocations({
      select: { title: "heading" },
      resolve: () => ({
        locations: [{ title: "RSVP", href: "/rsvp" }],
      }),
    }),
  },
};
