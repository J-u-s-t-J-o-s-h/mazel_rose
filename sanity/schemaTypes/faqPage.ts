import { defineField, defineType } from "sanity";

export const faqPage = defineType({
  name: "faqPage",
  title: "FAQ Page",
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
      validation: (rule) => rule.required().max(600),
    }),
    defineField({
      name: "contactMessage",
      title: "Contact message",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "contactEmail",
      title: "Contact email or link",
      type: "string",
    }),
  ],
  preview: {
    prepare: () => ({ title: "FAQ Page" }),
  },
});
