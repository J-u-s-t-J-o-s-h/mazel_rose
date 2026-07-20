import type { StructureResolver } from "sanity/structure";
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

export const structure: StructureResolver = (S) =>
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
      S.listItem()
        .title("Schedule")
        .child(
          S.documentTypeList("scheduleEvent")
            .title("Schedule Events")
            .defaultOrdering([{ field: "displayOrder", direction: "asc" }]),
        ),
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
              S.listItem()
                .title("Airports")
                .child(
                  S.documentTypeList("airport")
                    .title("Airports")
                    .defaultOrdering([
                      { field: "displayOrder", direction: "asc" },
                    ]),
                ),
              S.listItem()
                .title("Hotels")
                .child(
                  S.documentTypeList("hotel")
                    .title("Hotels")
                    .defaultOrdering([
                      { field: "displayOrder", direction: "asc" },
                    ]),
                ),
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
              S.listItem()
                .title("Registry Links")
                .child(
                  S.documentTypeList("registryLink")
                    .title("Registry Links")
                    .defaultOrdering([
                      { field: "displayOrder", direction: "asc" },
                    ]),
                ),
            ]),
        ),
      S.listItem()
        .title("Wedding Party")
        .child(
          S.documentTypeList("weddingPartyMember")
            .title("Wedding Party Members")
            .defaultOrdering([{ field: "displayOrder", direction: "asc" }]),
        ),
      S.listItem()
        .title("Gallery")
        .child(
          S.list()
            .title("Gallery")
            .items([
              singleton(
                S,
                SINGLETON_IDS.gallerySettings,
                "Gallery Settings",
                "gallerySettings",
              ),
              S.listItem()
                .title("Photos")
                .child(
                  S.documentTypeList("galleryPhoto")
                    .title("Photos")
                    .defaultOrdering([
                      { field: "displayOrder", direction: "asc" },
                    ]),
                ),
            ]),
        ),
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
              S.listItem()
                .title("Recommendations")
                .child(
                  S.documentTypeList("activity")
                    .title("Recommendations")
                    .defaultOrdering([
                      { field: "displayOrder", direction: "asc" },
                    ]),
                ),
            ]),
        ),
      S.listItem()
        .title("FAQs")
        .child(
          S.list()
            .title("FAQs")
            .items([
              singleton(S, SINGLETON_IDS.faqPage, "FAQ Page", "faqPage"),
              S.listItem()
                .title("Questions and Answers")
                .child(
                  S.documentTypeList("faqItem")
                    .title("Questions and Answers")
                    .defaultOrdering([
                      { field: "displayOrder", direction: "asc" },
                    ]),
                ),
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
