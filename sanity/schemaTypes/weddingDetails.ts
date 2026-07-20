import { defineField, defineType } from "sanity";

export const weddingDetails = defineType({
  name: "weddingDetails",
  title: "Wedding Details",
  type: "document",
  fields: [
    defineField({
      name: "partnerOneName",
      title: "First partner's name",
      type: "string",
      validation: (rule) => rule.required().max(40),
    }),
    defineField({
      name: "partnerTwoName",
      title: "Second partner's name",
      type: "string",
      validation: (rule) => rule.required().max(40),
    }),
    defineField({
      name: "coupleDisplayName",
      title: "Couple display name",
      type: "string",
      description: 'Shown as “Mazel & Rose” throughout the site.',
      validation: (rule) => rule.required().max(80),
    }),
    defineField({
      name: "initials",
      title: "Monogram initials",
      type: "array",
      of: [{ type: "string" }],
      validation: (rule) => rule.length(2).warning("Use two initials."),
    }),
    defineField({
      name: "weddingDate",
      title: "Wedding date and time",
      type: "datetime",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "weddingDateDisplay",
      title: "Wedding date display text",
      type: "string",
      description: 'Example: “October 18, 2027”',
      validation: (rule) => rule.required().max(60),
    }),
    defineField({
      name: "rsvpDeadline",
      title: "RSVP deadline",
      type: "datetime",
      validation: (rule) =>
        rule.required().custom((value, context) => {
          const weddingDate = (context.document as { weddingDate?: string })
            ?.weddingDate;
          if (!value || !weddingDate) return true;
          if (new Date(value) > new Date(weddingDate)) {
            return "RSVP deadline should be on or before the wedding date.";
          }
          return true;
        }),
    }),
    defineField({
      name: "rsvpDeadlineDisplay",
      title: "RSVP deadline display text",
      type: "string",
      validation: (rule) => rule.required().max(60),
    }),
    defineField({
      name: "locationCity",
      title: "City",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "locationState",
      title: "State",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "locationDisplay",
      title: "Location display text",
      type: "string",
      description: 'Example: “Aiken, South Carolina”',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "ceremonyVenueName",
      title: "Ceremony venue name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "ceremonyVenueAddress",
      title: "Ceremony venue address",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "receptionVenueName",
      title: "Reception venue name",
      type: "string",
    }),
    defineField({
      name: "receptionVenueAddress",
      title: "Reception venue address",
      type: "string",
    }),
    defineField({
      name: "mapUrl",
      title: "Venue map link",
      type: "url",
      validation: (rule) => rule.uri({ scheme: ["http", "https"] }),
    }),
    defineField({
      name: "contactEmail",
      title: "Contact email",
      type: "string",
      validation: (rule) => rule.required().email(),
    }),
    defineField({
      name: "contactPhone",
      title: "Contact phone (optional)",
      type: "string",
    }),
    defineField({
      name: "footerMessage",
      title: "Footer message",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required().max(240),
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "string",
      initialValue: "Romantic. Rich. Timeless.",
    }),
    defineField({
      name: "socialDescription",
      title: "Social sharing description",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required().max(300),
    }),
    defineField({
      name: "socialImage",
      title: "Social sharing image",
      type: "image",
      options: { hotspot: true },
      description: "Recommended 1200 × 630 pixels.",
    }),
    defineField({
      name: "announcementText",
      title: "Announcement text",
      type: "string",
      description: "Optional banner message for guests.",
    }),
    defineField({
      name: "announcementVisible",
      title: "Show announcement",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "timezone",
      title: "Default timezone",
      type: "string",
      initialValue: "America/New_York",
      description: "Used for countdown and date display context.",
    }),
    defineField({
      name: "allowSearchIndexing",
      title: "Allow search engines to index this website",
      type: "boolean",
      initialValue: false,
      description: "Turn on only when you are ready for the site to appear in Google.",
    }),
  ],
  preview: {
    select: { title: "coupleDisplayName", subtitle: "weddingDateDisplay" },
  },
});
