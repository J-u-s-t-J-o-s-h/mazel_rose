import type { RegistryItem } from "@/types/content";

export const registryIntro = {
  title: "Registry",
  scriptIntro: "With Gratitude",
  body: "Your presence is the greatest gift. Should you wish to honor us further, we have gathered a few thoughtful options below. PLACEHOLDER: Replace retailer links and fund details before launch.",
};

export const registryItems: RegistryItem[] = [
  {
    id: "crate",
    name: "Crate & Barrel",
    description: "Home essentials and tableware for our first home together.",
    url: "https://www.crateandbarrel.com",
    type: "retailer",
    isPlaceholder: true,
  },
  {
    id: "williams",
    name: "Williams Sonoma",
    description: "Kitchen pieces for slow dinners and shared mornings.",
    url: "https://www.williams-sonoma.com",
    type: "retailer",
    isPlaceholder: true,
  },
  {
    id: "honeymoon",
    name: "Honeymoon Fund",
    description:
      "Contribute toward a quiet autumn escape following the celebration.",
    url: "https://example.com/honeymoon-fund",
    type: "honeymoon",
    isPlaceholder: true,
  },
  {
    id: "charity",
    name: "Charitable Gift",
    description:
      "A donation in our honor to a cause close to our hearts. PLACEHOLDER: Confirm organization.",
    url: "https://example.com/charity",
    type: "charity",
    isPlaceholder: true,
  },
];
