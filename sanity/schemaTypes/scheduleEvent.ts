import { defineField, defineType } from "sanity";
import { displayOrderField, featuredField, showOnWebsiteField } from "./objects";

export const scheduleEvent = defineType({
  name: "scheduleEvent",
  title: "Schedule Event",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Event title",
      type: "string",
      validation: (rule) => rule.required().max(80),
    }),
    defineField({
      name: "date",
      title: "Date",
      type: "string",
      description: 'Example: “October 18, 2027”',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "startTime",
      title: "Start time",
      type: "string",
      description: 'Example: “4:00 PM”',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "endTime",
      title: "End time",
      type: "string",
      description: 'Example: “4:45 PM”',
    }),
    defineField({
      name: "venue",
      title: "Venue",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "address",
      title: "Address",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required().max(600),
    }),
    defineField({
      name: "dressCode",
      title: "Dress code",
      type: "string",
    }),
    defineField({
      name: "mapUrl",
      title: "Map link",
      type: "url",
      validation: (rule) => rule.uri({ scheme: ["http", "https"] }),
    }),
    defineField({
      name: "transportation",
      title: "Transportation notes",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "parking",
      title: "Parking notes",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "invitationOnly",
      title: "Invitation-only event",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "isPrivate",
      title: "Private event note",
      type: "boolean",
      initialValue: false,
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
    select: { title: "title", subtitle: "date" },
  },
});
