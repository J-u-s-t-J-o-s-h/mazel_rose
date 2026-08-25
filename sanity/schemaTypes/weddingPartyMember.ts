import { defineField, defineType } from "sanity";
import { orderRankOrdering } from "@sanity/orderable-document-list";
import {
  featuredField,
  imageWithAltField,
  listOrderFields,
  showOnWebsiteField,
} from "./objects";

export const weddingPartyMember = defineType({
  name: "weddingPartyMember",
  title: "Wedding Party Member",
  type: "document",
  fields: [
    ...listOrderFields("weddingPartyMember"),
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "role",
      title: "Role",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    imageWithAltField({
      name: "photo",
      title: "Photograph",
      description: "Recommended vertical image, at least 1200 × 1600 pixels. JPEG or PNG works best.",
      warning: "Add a portrait before publishing for best results.",
    }),
    defineField({
      name: "relationship",
      title: "Relationship to the couple",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "biography",
      title: "Biography",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required().max(600),
    }),
    defineField({
      name: "funFact",
      title: "Fun fact (optional)",
      type: "string",
    }),
    defineField({
      name: "side",
      title: "Side / group",
      type: "string",
      options: {
        list: [
          { title: "Partner one", value: "partnerOne" },
          { title: "Partner two", value: "partnerTwo" },
          { title: "Shared", value: "shared" },
        ],
      },
      initialValue: "shared",
    }),
    featuredField,
    showOnWebsiteField,
  ],
  orderings: [
    orderRankOrdering,
    {
      title: "Display order",
      name: "displayOrderAsc",
      by: [{ field: "displayOrder", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "name", subtitle: "role", media: "photo" },
  },
});
