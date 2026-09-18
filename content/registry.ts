import type { RegistryItem } from "@/types/content";

export const registryIntro = {
  title: "Pay It Forward",
  scriptIntro: "With Gratitude",
  body: "Hakarat HaTov — Recognizing the Good. Your presence is truly the greatest gift.",
};

export const registryItems: RegistryItem[] = [
  {
    id: "sentinel",
    name: "Orlando Sentinel",
    description:
      "Reporting on the sloths rescued from Sloth World, including the zoo’s care for Willow and the animals still in rehabilitation.",
    url: "https://www.orlandosentinel.com/2026/06/16/another-rescue-from-sloth-world-dies-during-rehabilitation-central-florida-zoo-says/",
    type: "charity",
    buttonLabel: "Read the article",
  },
  {
    id: "zoo",
    name: "Central Florida Zoo",
    description:
      "Meet the sloths in care, follow their updates, and find ways to donate to the Central Florida Zoo.",
    url: "https://www.centralfloridazoo.org/sloths-at-the-central-florida-zoo/",
    type: "charity",
    buttonLabel: "Visit the zoo",
  },
];
