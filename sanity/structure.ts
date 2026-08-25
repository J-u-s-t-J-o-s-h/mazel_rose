import type { StructureResolver } from "sanity/structure";
import { orderableDocumentListDeskItem } from "@sanity/orderable-document-list";
import { SINGLETON_IDS } from "./schemaTypes";

const singleton = (
  S: Parameters<StructureResolver>[0],
  id: string,
  title: string,
  type: string,
) =>
  S.listItem()
    .title(title)
    .id(id)
    .child(S.document().schemaType(type).documentId(id).title(title));

export const structure: StructureResolver = (S, context) =>
  S.list()
    .title("Website Content")
    .items([
      singleton(
        S,
        SINGLETON_IDS.weddingDetails,
        "Wedding Details",
        "weddingDetails",
      ),
      singleton(S, SINGLETON_IDS.homePage, "Home Page", "homePage"),
      S.divider(),
      orderableDocumentListDeskItem({
        type: "scheduleEvent",
        title: "Schedule",
        S,
        context,
      }),
      S.listItem()
        .title("Travel")
        .child(
          S.list()
            .title("Travel")
            .items([
              singleton(
                S,
                SINGLETON_IDS.travelOverview,
                "Travel Overview",
                "travelOverview",
              ),
              orderableDocumentListDeskItem({
                type: "airport",
                title: "Airports",
                S,
                context,
              }),
              orderableDocumentListDeskItem({
                type: "hotel",
                title: "Hotels",
                S,
                context,
              }),
            ]),
        ),
      S.listItem()
        .title("Registry")
        .child(
          S.list()
            .title("Registry")
            .items([
              singleton(
                S,
                SINGLETON_IDS.registryIntro,
                "Registry Introduction",
                "registryIntro",
              ),
              orderableDocumentListDeskItem({
                type: "registryLink",
                title: "Registry Links",
                S,
                context,
              }),
            ]),
        ),
      orderableDocumentListDeskItem({
        type: "weddingPartyMember",
        title: "Wedding Party",
        S,
        context,
      }),
      singleton(S, SINGLETON_IDS.gallerySettings, "Gallery", "gallerySettings"),
      S.listItem()
        .title("Things To Do")
        .child(
          S.list()
            .title("Things To Do")
            .items([
              singleton(
                S,
                SINGLETON_IDS.localGuideIntro,
                "Local Guide Introduction",
                "localGuideIntro",
              ),
              orderableDocumentListDeskItem({
                type: "activity",
                title: "Recommendations",
                S,
                context,
              }),
            ]),
        ),
      S.listItem()
        .title("FAQs")
        .child(
          S.list()
            .title("FAQs")
            .items([
              singleton(S, SINGLETON_IDS.faqPage, "FAQ Page", "faqPage"),
              orderableDocumentListDeskItem({
                type: "faqItem",
                title: "Questions and Answers",
                S,
                context,
              }),
            ]),
        ),
      S.listItem()
        .title("RSVP")
        .child(
          S.list()
            .title("RSVP")
            .items([
              singleton(
                S,
                SINGLETON_IDS.rsvpFormSettings,
                "RSVP Form Settings",
                "rsvpFormSettings",
              ),
            ]),
        ),
    ]);
