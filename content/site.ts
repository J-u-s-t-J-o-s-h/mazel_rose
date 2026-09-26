import { formatUsLongDate } from "@/lib/dates";
import type { SiteConfig } from "@/types/content";

/**
 * Production fallback used only when Wedding Details cannot be loaded.
 * Keep this aligned with the real wedding. Do not put placeholder events here.
 */
const rsvpDeadline = "2026-10-12";

export const siteConfig: SiteConfig = {
  brandName: "mazel.rose",
  isPlaceholder: false,
  coupleNames: {
    partnerOne: "Tiffany",
    partnerTwo: "Cary",
    display: "Tiffany & Cary",
    initials: ["T", "C"],
    isPlaceholder: false,
  },
  weddingDate: "2026-11-08",
  weddingDateDisplay: "Sunday, November 8, 2026",
  weddingDateIso: "2026-11-08T16:00:00-04:00",
  location: {
    city: "Orlando",
    state: "Florida",
    display: "Orlando, Florida",
    isPlaceholder: false,
  },
  venue: {
    name: "Paradise Cove",
    address: "13245 Lake Bryan Dr, Orlando, FL 32821",
    mapUrl:
      "https://www.google.com/maps/dir//Paradise+Cove+Orlando,+13245+Lake+Bryan+Dr,+Orlando,+FL+32821/",
    isPlaceholder: false,
  },
  rsvpDeadline,
  rsvpDeadlineDisplay: formatUsLongDate(rsvpDeadline),
  contactEmail: "hello@mazelrose.life",
  tagline: "",
  closingStatement: "With love, we look forward to celebrating with you.",
  theme: "classic",
  navigation: [
    { label: "Home", href: "/" },
    { label: "Schedule", href: "/schedule" },
    { label: "Travel", href: "/travel" },
    { label: "Pay It Forward", href: "/registry" },
    { label: "Gallery", href: "/gallery" },
    { label: "Things To Do", href: "/things-to-do" },
    { label: "FAQs", href: "/faqs" },
    { label: "RSVP", href: "/rsvp" },
  ],
  social: {
    title: "mazel.rose — Wedding Celebration",
    description:
      "You are warmly invited to celebrate the wedding of Tiffany & Cary. Explore the schedule, travel details, gallery, and RSVP.",
  },
};
