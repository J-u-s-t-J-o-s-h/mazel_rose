import { defineField, defineType } from "sanity";

export const rsvpFormSettings = defineType({
  name: "rsvpFormSettings",
  title: "RSVP Form Settings",
  type: "document",
  description:
    "Controls the public RSVP form appearance and options. Guest responses are stored separately and securely.",
  fields: [
    defineField({
      name: "heading",
      title: "Page heading",
      type: "string",
      validation: (rule) => rule.required().max(80),
    }),
    defineField({
      name: "scriptIntro",
      title: "Script introduction",
      type: "string",
    }),
    defineField({
      name: "introduction",
      title: "Introductory message",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required().max(600),
    }),
    defineField({
      name: "rsvpDeadlineDisplay",
      title: "RSVP deadline display text",
      type: "string",
    }),
    defineField({
      name: "formOpen",
      title: "Form is open for responses",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "closedMessage",
      title: "Closed-form message",
      type: "text",
      rows: 3,
      description: "Shown when the form is closed.",
    }),
    defineField({
      name: "confirmationHeading",
      title: "Confirmation heading",
      type: "string",
      initialValue: "Your reply has been received",
    }),
    defineField({
      name: "confirmationMessage",
      title: "Confirmation message",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "mealOptions",
      title: "Meal options",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "value",
              title: "Internal value",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "label",
              title: "Label shown to guests",
              type: "string",
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: { title: "label", subtitle: "value" },
          },
        },
      ],
    }),
    defineField({
      name: "eventOptions",
      title: "Event attendance options",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "key",
              title: "Internal key",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "label",
              title: "Label shown to guests",
              type: "string",
              validation: (rule) => rule.required(),
            }),
          ],
        },
      ],
    }),
    defineField({
      name: "showDietaryField",
      title: "Show dietary restrictions field",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "showSongRequestField",
      title: "Show song request field",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "showPhoneField",
      title: "Show phone field",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "showEmailField",
      title: "Show email field",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "helpMessage",
      title: "Contact-for-help message",
      type: "text",
      rows: 2,
    }),
  ],
  preview: {
    prepare: () => ({ title: "RSVP Form Settings" }),
  },
});
