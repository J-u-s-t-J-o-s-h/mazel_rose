import { defineField, defineType } from "sanity";
import { orderRankOrdering } from "@sanity/orderable-document-list";
import { listOrderFields, showOnWebsiteField } from "./objects";

export const faqItem = defineType({
  name: "faqItem",
  title: "FAQ",
  type: "document",
  fields: [
    ...listOrderFields("faqItem"),
    defineField({
      name: "question",
      title: "Question",
      type: "string",
      validation: (rule) => rule.required().max(160),
    }),
    defineField({
      name: "answer",
      title: "Answer",
      type: "text",
      rows: 5,
      validation: (rule) => rule.required().max(1200),
    }),
    defineField({
      name: "category",
      title: "Category (optional)",
      type: "string",
    }),
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
    select: { title: "question", subtitle: "category" },
  },
});
