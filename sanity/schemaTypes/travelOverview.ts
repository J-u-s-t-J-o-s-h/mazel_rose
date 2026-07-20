import { defineField, defineType } from "sanity";
import { altTextField } from "./objects";

export const travelOverview = defineType({
  name: "travelOverview",
  title: "Travel Overview",
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
      name: "intro",
      title: "Introductory note",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required().max(800),
    }),
    defineField({
      name: "drivingInfo",
      title: "Driving information",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "transportationOverview",
      title: "Transportation overview",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "shuttleInfo",
      title: "Shuttle information",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "parkingInfo",
      title: "Parking information",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "generalMapUrl",
      title: "General map link",
      type: "url",
      validation: (rule) => rule.uri({ scheme: ["http", "https"] }),
    }),
    defineField({
      name: "contactNote",
      title: "Contact note",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "contactEmail",
      title: "Travel contact email",
      type: "string",
      validation: (rule) => rule.email(),
    }),
    defineField({
      name: "featureImage",
      title: "Feature image",
      type: "image",
      options: { hotspot: true },
      fields: [altTextField],
    }),
  ],
  preview: {
    prepare: () => ({ title: "Travel Overview" }),
  },
});
