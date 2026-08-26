import { z } from "zod";

const requiredText = (message: string, maxLength: number) =>
  z.preprocess(
    (value) => (typeof value === "string" ? value : ""),
    z.string().trim().min(1, message).max(maxLength, message),
  );

export const saveTheDateSchema = z
  .object({
    guestName: requiredText("Please enter your name.", 120),
    attendance: z.preprocess(
      (value) => (typeof value === "string" ? value : ""),
      z.enum(["attending", "declined"]),
    ),
    partySize: z.union([z.string(), z.number()]).optional(),
    guestNames: z.string().trim().max(500).optional().or(z.literal("")),
    additionalNotes: z.string().trim().max(1000).optional().or(z.literal("")),
    streetAddress: requiredText(
      "Please enter a complete U.S. mailing address.",
      160,
    ),
    addressLine2: z.string().trim().max(100).optional().or(z.literal("")),
    city: requiredText("Please enter a complete U.S. mailing address.", 80),
    state: z.preprocess(
      (value) => (typeof value === "string" ? value.trim().toUpperCase() : ""),
      z.string().regex(/^[A-Z]{2}$/, "Please enter a complete U.S. mailing address."),
    ),
    zipCode: z.preprocess(
      (value) => (typeof value === "string" ? value.trim() : ""),
      z
        .string()
        .regex(
          /^\d{5}(-\d{4})?$/,
          "Please enter a complete U.S. mailing address.",
        ),
    ),
    website: z.string().max(0).optional().or(z.literal("")),
  })
  .superRefine((data, ctx) => {
    if (data.attendance !== "attending") return;

    const partySize = Math.floor(Number(data.partySize));
    if (!Number.isInteger(partySize) || partySize < 1 || partySize > 8) {
      ctx.addIssue({
        code: "custom",
        message: "Please tell us how many guests are attending and list their names.",
        path: ["partySize"],
      });
    }

    if (!data.guestNames?.trim()) {
      ctx.addIssue({
        code: "custom",
        message: "Please tell us how many guests are attending and list their names.",
        path: ["guestNames"],
      });
    }
  });

export type SaveTheDateFormValues = z.infer<typeof saveTheDateSchema>;
