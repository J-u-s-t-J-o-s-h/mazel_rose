import { defineArrayMember, defineField, defineType } from "sanity";
import { imageWithAltField } from "./objects";

export const gallerySettings = defineType({
  name: "gallerySettings",
  title: "Gallery",
  type: "document",
  fields: [
    defineField({
      name: "scriptIntro",
      title: "Script introduction",
      type: "string",
    }),
    defineField({
      name: "heading",
      title: "Page heading",
      type: "string",
      validation: (rule) => rule.required().max(80),
    }),
    defineField({
      name: "introduction",
      title: "Page introduction",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required().max(600),
    }),
    defineField({
      name: "photos",
      title: "Photos",
      type: "array",
      description:
        "Drag cards to reorder. Open a card to replace its photo. Use the card menu to remove it from the website.",
      of: [
        defineArrayMember({
          type: "object",
          name: "galleryPhotoItem",
          title: "Photo",
          fields: [
            imageWithAltField({
              name: "image",
              title: "Photo",
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
          ],
          preview: {
            select: { title: "caption", media: "image" },
            prepare: ({ title, media }) => ({
              title: title || "Gallery photo",
              media,
            }),
          },
        }),
      ],
      options: { layout: "grid" },
    }),
    imageWithAltField({
      name: "featureImage",
      title: "Feature image",
    }),
    defineField({
      name: "showCaptions",
      title: "Show captions",
      type: "boolean",
      initialValue: true,
    }),
  ],
  preview: {
    prepare: () => ({ title: "Gallery" }),
  },
});
