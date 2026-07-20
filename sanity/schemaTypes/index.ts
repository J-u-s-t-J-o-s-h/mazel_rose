import { activity } from "./activity";
import { airport } from "./airport";
import { faqItem } from "./faqItem";
import { faqPage } from "./faqPage";
import { galleryPhoto } from "./galleryPhoto";
import { gallerySettings } from "./gallerySettings";
import { homePage } from "./homePage";
import { hotel } from "./hotel";
import { localGuideIntro } from "./localGuideIntro";
import { registryIntro } from "./registryIntro";
import { registryLink } from "./registryLink";
import { rsvpFormSettings } from "./rsvpFormSettings";
import { scheduleEvent } from "./scheduleEvent";
import { travelOverview } from "./travelOverview";
import { weddingDetails } from "./weddingDetails";
import { weddingPartyMember } from "./weddingPartyMember";

export const schemaTypes = [
  weddingDetails,
  homePage,
  scheduleEvent,
  travelOverview,
  airport,
  hotel,
  registryIntro,
  registryLink,
  weddingPartyMember,
  gallerySettings,
  galleryPhoto,
  localGuideIntro,
  activity,
  faqPage,
  faqItem,
  rsvpFormSettings,
];

export const SINGLETON_TYPES = [
  "weddingDetails",
  "homePage",
  "travelOverview",
  "registryIntro",
  "gallerySettings",
  "localGuideIntro",
  "faqPage",
  "rsvpFormSettings",
] as const;

export const SINGLETON_IDS: Record<(typeof SINGLETON_TYPES)[number], string> = {
  weddingDetails: "weddingDetails",
  homePage: "homePage",
  travelOverview: "travelOverview",
  registryIntro: "registryIntro",
  gallerySettings: "gallerySettings",
  localGuideIntro: "localGuideIntro",
  faqPage: "faqPage",
  rsvpFormSettings: "rsvpFormSettings",
};
