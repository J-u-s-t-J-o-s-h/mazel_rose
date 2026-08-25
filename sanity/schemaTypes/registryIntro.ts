import { defineField, defineType } from "sanity";
import { imageWithAltField } from "./objects";

export const registryIntro = defineType({
  name: "registryIntro",
  title: "Registry Introduction",
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
      name: "message",
      title: "Message from the couple",
      type: "text",
      rows: 5,
      validation: (rule) => rule.required().max(800),
    }),
    defineField({
      name: "honeymoonIntro",
      title: "Honeymoon fund introduction (optional)",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "charityIntro",
      title: "Charitable-giving introduction (optional)",
      type: "text",
      rows: 3,
    }),
    imageWithAltField({
      name: "featureImage",
      title: "Feature image",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Registry Introduction" }),
  },
});
