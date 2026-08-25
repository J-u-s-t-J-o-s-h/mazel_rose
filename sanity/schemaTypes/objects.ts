import { defineField, type FieldDefinition } from "sanity";
import { orderRankField } from "@sanity/orderable-document-list";
import { CompatibleImageInput } from "@/sanity/components/CompatibleImageInput";

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
  title: "Show this card on the website",
  type: "boolean",
  initialValue: true,
  description:
    "Turn this off to hide the card from guests without deleting it. To delete it for good, use Delete in the top-right menu.",
});

export const displayOrderField = defineField({
  name: "displayOrder",
  title: "Display order",
  type: "number",
  description: "Lower numbers appear first.",
  initialValue: 0,
  validation: (rule) => rule.integer().min(0),
});

export function listOrderFields(type: string): FieldDefinition[] {
  return [
    orderRankField({ type }),
    defineField({
      ...displayOrderField,
      hidden: true,
      description:
        "Fallback only. Drag cards in the list to set the order on the website.",
    }),
  ];
}

export function imageWithAltField(config: {
  name: string;
  title: string;
  description?: string;
  group?: string;
  warning?: string;
  includeAlt?: boolean;
}) {
  return defineField({
    name: config.name,
    title: config.title,
    type: "image",
    group: config.group,
    description:
      config.description ||
      "JPEG or PNG works best. Large camera files are resized so the upload can finish. Click Publish after the photo attaches.",
    options: {
      hotspot: true,
      accept: "image/jpeg,image/png,image/webp,image/gif",
    },
    fields: config.includeAlt === false ? [] : [altTextField],
    components: { input: CompatibleImageInput },
    validation: config.warning
      ? (rule) => rule.warning(config.warning)
      : undefined,
  });
}

export const featuredField = defineField({
  name: "featured",
  title: "Featured",
  type: "boolean",
  initialValue: false,
});
