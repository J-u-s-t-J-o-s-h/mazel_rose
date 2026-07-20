import { defineField, defineType } from "sanity";
import { altTextField } from "./objects";

export const gallerySettings = defineType({
  name: "gallerySettings",
  title: "Gallery Settings",
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
      name: "featureImage",
      title: "Feature image",
      type: "image",
      options: { hotspot: true },
      fields: [altTextField],
    }),
    defineField({
      name: "showCaptions",
      title: "Show captions",
      type: "boolean",
      initialValue: true,
    }),
  ],
  preview: {
    prepare: () => ({ title: "Gallery Settings" }),
  },
});
