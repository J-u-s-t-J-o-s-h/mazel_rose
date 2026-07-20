import { defineField, defineType } from "sanity";
import { displayOrderField, showOnWebsiteField } from "./objects";

export const airport = defineType({
  name: "airport",
  title: "Airport",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Airport name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "code",
      title: "Airport code",
      type: "string",
      validation: (rule) => rule.required().max(8),
    }),
    defineField({
      name: "address",
      title: "Address",
      type: "string",
    }),
    defineField({
      name: "distance",
      title: "Distance from venue",
      type: "string",
    }),
    defineField({
      name: "driveTime",
      title: "Approximate drive time",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required().max(400),
    }),
    defineField({
      name: "websiteUrl",
      title: "Website URL",
      type: "url",
      validation: (rule) => rule.uri({ scheme: ["http", "https"] }),
    }),
    defineField({
      name: "mapUrl",
      title: "Map URL",
      type: "url",
      validation: (rule) => rule.uri({ scheme: ["http", "https"] }),
    }),
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
    select: { title: "name", subtitle: "code" },
  },
});
