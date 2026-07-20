export type NavItem = {
  label: string;
  href: string;
};

export type PlaceholderFlag = {
  /** Mark content that must be replaced before launch */
  isPlaceholder?: boolean;
};

export type SiteConfig = {
  brandName: string;
  coupleNames: {
    partnerOne: string;
    partnerTwo: string;
    display: string;
    initials: [string, string];
  } & PlaceholderFlag;
  weddingDate: string;
  weddingDateDisplay: string;
  weddingDateIso: string;
  location: {
    city: string;
    state: string;
    display: string;
  } & PlaceholderFlag;
  venue: {
    name: string;
    address: string;
    mapUrl: string;
  } & PlaceholderFlag;
  rsvpDeadline: string;
  rsvpDeadlineDisplay: string;
  contactEmail: string;
  tagline: string;
  closingStatement: string;
  navigation: NavItem[];
  social: {
    title: string;
    description: string;
  };
} & PlaceholderFlag;

export type ScheduleEvent = {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime?: string;
  venue: string;
  address: string;
  description: string;
  dressCode?: string;
  mapUrl?: string;
  transportation?: string;
  parking?: string;
  isPrivate?: boolean;
  invitationOnly?: boolean;
} & PlaceholderFlag;

export type Hotel = {
  id: string;
  name: string;
  image: string;
  imageAlt: string;
  address: string;
  distance: string;
  description: string;
  bookingUrl: string;
  groupCode?: string;
  reservationDeadline?: string;
  phone?: string;
  amenities: string[];
} & PlaceholderFlag;

export type Airport = {
  name: string;
  code: string;
  distance: string;
  notes: string;
} & PlaceholderFlag;

export type RegistryItem = {
  id: string;
  name: string;
  description: string;
  url: string;
  type: "retailer" | "honeymoon" | "cash" | "charity";
} & PlaceholderFlag;

export type WeddingPartyMember = {
  id: string;
  name: string;
  role: string;
  image: string;
  imageAlt: string;
  relationship: string;
  bio: string;
  funFact?: string;
  side: "partnerOne" | "partnerTwo" | "shared";
} & PlaceholderFlag;

export type GalleryImage = {
  id: string;
  src: string;
  alt: string;
  caption?: string;
  width: number;
  height: number;
} & PlaceholderFlag;

export type ActivityCategory =
  | "restaurants"
  | "coffee"
  | "bars"
  | "attractions"
  | "shopping"
  | "outdoor"
  | "family";

export type Activity = {
  id: string;
  name: string;
  category: ActivityCategory;
  image: string;
  imageAlt: string;
  description: string;
  address: string;
  distance?: string;
  websiteUrl?: string;
  mapUrl?: string;
  recommendation?: string;
  priceRange?: string;
} & PlaceholderFlag;

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
} & PlaceholderFlag;

export type HomeContent = {
  hero: {
    scriptIntro: string;
    heading: string;
    invitationLine: string;
    primaryCta: { label: string; href: string };
    secondaryCta: { label: string; href: string };
    image: string;
    imageAlt: string;
  };
  welcome: {
    scriptIntro: string;
    title: string;
    body: string;
    image?: string;
    imageAlt?: string;
  };
  story: {
    title: string;
    body: string;
    image: string;
    imageAlt: string;
    accentNote: string;
  };
  schedulePreview: {
    title: string;
    body: string;
    ctaLabel: string;
    eventIds: string[];
  };
  feature: {
    quote: string;
    attribution: string;
    image: string;
    imageAlt: string;
  };
  travelPreview: {
    title: string;
    body: string;
    ctaLabel: string;
    highlights: string[];
  };
  galleryPreview: {
    title: string;
    body: string;
    ctaLabel: string;
    imageIds: string[];
  };
  rsvpFinale: {
    title: string;
    body: string;
    ctaLabel: string;
  };
};
