import { defineField, defineType } from "sanity";
import {
  altTextField,
  displayOrderField,
  featuredField,
  showOnWebsiteField,
} from "./objects";

export const weddingPartyMember = defineType({
  name: "weddingPartyMember",
  title: "Wedding Party Member",
  type: "document",
  fields: [
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
    defineField({
      name: "photo",
      title: "Photograph",
      type: "image",
      options: { hotspot: true },
      description: "Recommended vertical image, at least 1200 × 1600 pixels.",
      fields: [altTextField],
      validation: (rule) =>
        rule.warning("Add a portrait before publishing for best results."),
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
    displayOrderField,
  ],
  orderings: [
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
