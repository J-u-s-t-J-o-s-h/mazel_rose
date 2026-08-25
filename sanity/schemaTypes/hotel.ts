import { defineField, defineType } from "sanity";
import { orderRankOrdering } from "@sanity/orderable-document-list";
import {
  featuredField,
  imageWithAltField,
  listOrderFields,
  showOnWebsiteField,
} from "./objects";

export const hotel = defineType({
  name: "hotel",
  title: "Hotel",
  type: "document",
  fields: [
    ...listOrderFields("hotel"),
    defineField({
      name: "name",
      title: "Hotel name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    imageWithAltField({
      name: "image",
      title: "Hotel photograph",
      description: "Recommended horizontal image, at least 1600 × 1000 pixels. JPEG or PNG works best.",
      warning: "Add a hotel photo before publishing for best results.",
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
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "driveTime",
      title: "Approximate drive time",
      type: "string",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required().max(500),
    }),
    defineField({
      name: "bookingUrl",
      title: "Booking link",
      type: "url",
      validation: (rule) =>
        rule.required().uri({ scheme: ["http", "https"] }),
    }),
    defineField({
      name: "groupCode",
      title: "Group code",
      type: "string",
    }),
    defineField({
      name: "bookingDeadline",
      title: "Booking deadline",
      type: "string",
    }),
    defineField({
      name: "phone",
      title: "Phone number",
      type: "string",
    }),
    defineField({
      name: "amenities",
      title: "Amenities",
      type: "array",
      of: [{ type: "string" }],
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
    select: { title: "name", media: "image", subtitle: "distance" },
  },
});
