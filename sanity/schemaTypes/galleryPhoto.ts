import { defineField, defineType } from "sanity";
import { orderRankOrdering } from "@sanity/orderable-document-list";
import {
  featuredField,
  imageWithAltField,
  listOrderFields,
  showOnWebsiteField,
} from "./objects";

export const galleryPhoto = defineType({
  name: "galleryPhoto",
  title: "Gallery Photo",
  type: "document",
  fields: [
    ...listOrderFields("galleryPhoto"),
    imageWithAltField({
      name: "image",
      title: "Photo",
      description:
        "Use the highest-quality JPEG or PNG original available. Avoid screenshots or social-media downloads.",
      warning: "Add a photo before publishing for best results.",
    }),
    defineField({
      name: "caption",
      title: "Caption",
      type: "string",
      validation: (rule) => rule.max(120),
    }),
    defineField({
      name: "photographerCredit",
      title: "Photographer credit (optional)",
      type: "string",
    }),
    defineField({
      name: "category",
      title: "Category (optional)",
      type: "string",
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
    select: { title: "caption", media: "image", subtitle: "category" },
    prepare: ({ title, media, subtitle }) => ({
      title: title || "Gallery photo",
      media,
      subtitle,
    }),
  },
});
