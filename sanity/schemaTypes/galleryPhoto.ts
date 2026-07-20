import { defineField, defineType } from "sanity";
import {
  altTextField,
  displayOrderField,
  featuredField,
  showOnWebsiteField,
} from "./objects";

export const galleryPhoto = defineType({
  name: "galleryPhoto",
  title: "Gallery Photo",
  type: "document",
  fields: [
    defineField({
      name: "image",
      title: "Photo",
      type: "image",
      options: { hotspot: true },
      description:
        "Use the highest-quality original available. Avoid screenshots or social-media downloads.",
      fields: [altTextField],
      validation: (rule) =>
        rule.warning("Add a photo before publishing for best results."),
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
    select: { title: "caption", media: "image", subtitle: "category" },
    prepare: ({ title, media, subtitle }) => ({
      title: title || "Gallery photo",
      media,
      subtitle,
    }),
  },
});
