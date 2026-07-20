import { defineField } from "sanity";

export const ctaFields = [
  defineField({
    name: "label",
    title: "Button label",
    type: "string",
    validation: (rule) => rule.required().max(60).warning("Keep labels short."),
  }),
  defineField({
    name: "href",
    title: "Destination",
    type: "string",
    description: "Use a site path like /rsvp or a full https:// link.",
    validation: (rule) =>
      rule.required().custom((value) => {
        if (!value) return "Required";
        if (value.startsWith("/") || value.startsWith("http")) return true;
        return "Use a path starting with / or a full URL";
      }),
  }),
];

export const altTextField = defineField({
  name: "alt",
  title: "Image description (for accessibility)",
  type: "string",
  description: "Describe the image for guests using screen readers.",
  validation: (rule) =>
    rule.required().warning("Add a short description whenever possible."),
});

export const showOnWebsiteField = defineField({
  name: "showOnWebsite",
  title: "Show this on the website",
  type: "boolean",
  initialValue: true,
});

export const displayOrderField = defineField({
  name: "displayOrder",
  title: "Display order",
  type: "number",
  description: "Lower numbers appear first.",
  initialValue: 0,
  validation: (rule) => rule.integer().min(0),
});

export const featuredField = defineField({
  name: "featured",
  title: "Featured",
  type: "boolean",
  initialValue: false,
});
