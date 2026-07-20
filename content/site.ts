import type { SiteConfig } from "@/types/content";

/**
 * Fallback / seed source only.
 * After `npm run sanity:seed`, edit Wedding Details in Sanity Studio (`/admin`).
 * PLACEHOLDER: Replace couple names, dates, venue, and contact details before launch.
 */
export const siteConfig: SiteConfig = {
  brandName: "mazel.rose",
  isPlaceholder: true,
  coupleNames: {
    partnerOne: "Mazel",
    partnerTwo: "Rose",
    display: "Mazel & Rose",
    initials: ["M", "R"],
    isPlaceholder: true,
  },
  weddingDate: "2027-10-18",
  weddingDateDisplay: "October 18, 2027",
  weddingDateIso: "2027-10-18T16:00:00-04:00",
  location: {
    city: "Aiken",
    state: "South Carolina",
    display: "Aiken, South Carolina",
    isPlaceholder: true,
  },
  venue: {
    name: "The Willow Estate",
    address: "123 Magnolia Lane, Aiken, SC 29801",
    mapUrl: "https://maps.google.com/?q=Aiken,+South+Carolina",
    isPlaceholder: true,
  },
  rsvpDeadline: "2027-09-01",
  rsvpDeadlineDisplay: "September 1, 2027",
  contactEmail: "hello@mazel.rose",
  tagline: "Romantic. Rich. Timeless.",
  closingStatement: "With love, we look forward to celebrating with you.",
  navigation: [
    { label: "Home", href: "/" },
    { label: "Schedule", href: "/schedule" },
    { label: "Travel", href: "/travel" },
    { label: "Registry", href: "/registry" },
    { label: "Wedding Party", href: "/wedding-party" },
    { label: "Gallery", href: "/gallery" },
    { label: "Things To Do", href: "/things-to-do" },
    { label: "FAQs", href: "/faqs" },
    { label: "RSVP", href: "/rsvp" },
  ],
  social: {
    title: "mazel.rose — Wedding Celebration",
    description:
      "You are warmly invited to celebrate the wedding of Mazel & Rose. Explore the schedule, travel details, gallery, and RSVP.",
  },
};
