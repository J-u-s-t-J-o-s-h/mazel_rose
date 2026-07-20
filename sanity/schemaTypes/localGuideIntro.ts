import { defineField, defineType } from "sanity";
import { altTextField } from "./objects";

export const localGuideIntro = defineType({
  name: "localGuideIntro",
  title: "Local Guide Introduction",
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
      title: "Introductory text",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required().max(800),
    }),
    defineField({
      name: "featureImage",
      title: "Feature image",
      type: "image",
      options: { hotspot: true },
      fields: [altTextField],
    }),
    defineField({
      name: "personalNote",
      title: "Personal note (optional)",
      type: "text",
      rows: 3,
    }),
  ],
  preview: {
    prepare: () => ({ title: "Local Guide Introduction" }),
  },
});
