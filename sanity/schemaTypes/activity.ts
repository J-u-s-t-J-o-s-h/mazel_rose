import { defineField, defineType } from "sanity";
import {
  altTextField,
  displayOrderField,
  featuredField,
  showOnWebsiteField,
} from "./objects";

export const activity = defineType({
  name: "activity",
  title: "Things To Do Recommendation",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Restaurants", value: "restaurants" },
          { title: "Coffee", value: "coffee" },
          { title: "Bars", value: "bars" },
          { title: "Attractions", value: "attractions" },
          { title: "Shopping", value: "shopping" },
          { title: "Outdoor Activities", value: "outdoor" },
          { title: "Family Friendly", value: "family" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      fields: [altTextField],
      validation: (rule) =>
        rule.warning("Add an image before publishing for best results."),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required().max(400),
    }),
    defineField({
      name: "address",
      title: "Address",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "distance",
      title: "Distance from venue",
      type: "string",
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
    defineField({
      name: "priceRange",
      title: "Price range",
      type: "string",
    }),
    defineField({
      name: "recommendation",
      title: "Personal recommendation",
      type: "text",
      rows: 2,
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
    select: { title: "name", subtitle: "category", media: "image" },
  },
});
