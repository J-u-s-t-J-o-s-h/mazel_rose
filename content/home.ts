import type { HomeContent } from "@/types/content";

export const homeContent: HomeContent = {
  hero: {
    scriptIntro: "Together",
    heading: "MAZEL & ROSE",
    invitationLine: "Request the pleasure of your company",
    primaryCta: { label: "Respond to the Invitation", href: "/rsvp" },
    secondaryCta: { label: "View the Schedule", href: "/schedule" },
    image:
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=2400&q=80",
    imageAlt:
      "Candlelit wedding table with burgundy florals and antique brass accents",
  },
  welcome: {
    scriptIntro: "Welcome",
    title: "A note from the couple",
    body: "With full hearts, we invite you to share in a day steeped in autumn light, quiet joy, and enduring love. This gathering is meant to feel intimate and intentional—an evening of warmth, beauty, and celebration with those who matter most.",
    image:
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1400&q=80",
    imageAlt: "Couple walking through soft autumn light among trees",
  },
  story: {
    title: "Our beginning",
    body: "What began as an unexpected conversation became a shared life of laughter, travel, and quiet evenings. Through seasons of change, we found a love that feels both deeply rooted and endlessly new. Now we look forward to beginning the next chapter—surrounded by family and friends.",
    image:
      "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Romantic portrait with soft natural light and warm tones",
    accentNote: "PLACEHOLDER: Replace with your story and photograph.",
  },
  schedulePreview: {
    title: "The celebration",
    body: "A thoughtfully paced afternoon and evening, beginning with ceremony and continuing into dinner, dancing, and candlelit joy.",
    ctaLabel: "Full Schedule",
    eventIds: ["ceremony", "cocktail", "reception"],
  },
  feature: {
    quote:
      "In the soft glow of autumn, we choose each other—again and always.",
    attribution: "Mazel & Rose",
    image:
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=2400&q=80",
    imageAlt: "Editorial wedding florals in burgundy, mauve, and sage",
  },
  travelPreview: {
    title: "Arriving with ease",
    body: "We have gathered hotel recommendations, airport guidance, and transportation notes so your journey feels as considered as the day itself.",
    ctaLabel: "Travel Details",
    highlights: [
      "Recommended airports nearby",
      "Preferred hotel room blocks",
      "Shuttle and parking notes",
    ],
  },
  galleryPreview: {
    title: "Moments collected",
    body: "A glimpse of the textures, light, and atmosphere that inspire our day.",
    ctaLabel: "Browse Gallery",
    imageIds: ["g1", "g2", "g3", "g4"],
  },
  rsvpFinale: {
    title: "Kindly reply",
    body: "We hope you will join us. Please respond by the date below so we may plan a beautiful evening for every guest.",
    ctaLabel: "RSVP Now",
  },
};
