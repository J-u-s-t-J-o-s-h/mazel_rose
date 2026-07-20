import { defineField, defineType } from "sanity";
import {
  altTextField,
  displayOrderField,
  featuredField,
  showOnWebsiteField,
} from "./objects";

export const registryLink = defineType({
  name: "registryLink",
  title: "Registry Link",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Registry name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "registryType",
      title: "Registry type",
      type: "string",
      options: {
        list: [
          { title: "Retailer", value: "retailer" },
          { title: "Honeymoon fund", value: "honeymoon" },
          { title: "Cash fund", value: "cash" },
          { title: "Charity", value: "charity" },
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "image",
      title: "Image or logo",
      type: "image",
      options: { hotspot: true },
      fields: [altTextField],
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required().max(400),
    }),
    defineField({
      name: "url",
      title: "External URL",
      type: "url",
      validation: (rule) =>
        rule.required().uri({ scheme: ["http", "https"] }),
    }),
    defineField({
      name: "buttonLabel",
      title: "Button label",
      type: "string",
      initialValue: "View registry",
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
    select: { title: "name", subtitle: "registryType", media: "image" },
  },
});
