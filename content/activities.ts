import type { Activity, ActivityCategory } from "@/types/content";

export const activitiesIntro = {
  title: "Things To Do",
  scriptIntro: "Explore",
  body: "A curated guide to Aiken—restaurants, coffee, walks, and quiet corners we love. PLACEHOLDER: Confirm hours, links, and personal recommendations.",
};

export const activityCategories: { id: ActivityCategory | "all"; label: string }[] =
  [
    { id: "all", label: "All" },
    { id: "restaurants", label: "Restaurants" },
    { id: "coffee", label: "Coffee" },
    { id: "bars", label: "Bars" },
    { id: "attractions", label: "Attractions" },
    { id: "shopping", label: "Shopping" },
    { id: "outdoor", label: "Outdoor" },
    { id: "family", label: "Family" },
  ];

export const activities: Activity[] = [
  {
    id: "a1",
    name: "The Copper Kitchen",
    category: "restaurants",
    image:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Elegant restaurant dining room with warm lighting",
    description: "Seasonal Southern plates in a refined, candlelit room.",
    address: "18 Laurens Street, Aiken, SC",
    distance: "10 min from venue",
    websiteUrl: "https://example.com/copper-kitchen",
    mapUrl: "https://maps.google.com/?q=Aiken,+South+Carolina",
    recommendation: "Reserve the corner booth if you can.",
    priceRange: "$$$",
    isPlaceholder: true,
  },
  {
    id: "a2",
    name: "Parchment Coffee",
    category: "coffee",
    image:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Coffee cups on a wooden cafe table",
    description: "Slow mornings, excellent espresso, and soft light.",
    address: "5 Park Avenue, Aiken, SC",
    distance: "12 min from venue",
    websiteUrl: "https://example.com/parchment-coffee",
    recommendation: "Try the oat latte and a warm pastry.",
    priceRange: "$",
    isPlaceholder: true,
  },
  {
    id: "a3",
    name: "Velvet & Vine",
    category: "bars",
    image:
      "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Dimly lit cocktail bar with amber glassware",
    description: "Craft cocktails with a quietly glamorous atmosphere.",
    address: "90 Whiskey Road, Aiken, SC",
    distance: "14 min from venue",
    websiteUrl: "https://example.com/velvet-vine",
    recommendation: "The smoked old fashioned is a favorite.",
    priceRange: "$$",
    isPlaceholder: true,
  },
  {
    id: "a4",
    name: "Aiken Botanical Garden",
    category: "attractions",
    image:
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Garden path lined with soft greenery and flowers",
    description: "A peaceful stroll among seasonal plantings and quiet paths.",
    address: "Botanical Drive, Aiken, SC",
    distance: "15 min from venue",
    mapUrl: "https://maps.google.com/?q=Aiken,+South+Carolina",
    recommendation: "Beautiful in late afternoon light.",
    priceRange: "$",
    isPlaceholder: true,
  },
  {
    id: "a5",
    name: "Ribbon & Press",
    category: "shopping",
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Boutique shop interior with curated goods",
    description: "A small boutique for gifts, linens, and local makers.",
    address: "32 Bee Lane, Aiken, SC",
    distance: "11 min from venue",
    websiteUrl: "https://example.com/ribbon-press",
    recommendation: "Perfect for a quiet afternoon browse.",
    priceRange: "$$",
    isPlaceholder: true,
  },
  {
    id: "a6",
    name: "Hitchcock Woods",
    category: "outdoor",
    image:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Sunlit forest trail with tall trees",
    description: "Expansive trails for a morning walk beneath the pines.",
    address: "Hitchcock Woods, Aiken, SC",
    distance: "18 min from venue",
    mapUrl: "https://maps.google.com/?q=Hitchcock+Woods,+Aiken",
    recommendation: "Bring comfortable shoes and soft light for photos.",
    priceRange: "Free",
    isPlaceholder: true,
  },
  {
    id: "a7",
    name: "City Market Picnic",
    category: "family",
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Outdoor market with fresh food stalls",
    description: "Local flavors and an easy outing for multi-generational guests.",
    address: "Downtown Aiken",
    distance: "12 min from venue",
    recommendation: "Check weekend hours before you go.",
    priceRange: "$",
    isPlaceholder: true,
  },
];
