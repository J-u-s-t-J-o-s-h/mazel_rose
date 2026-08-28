import { z } from "zod";

const requiredText = (message: string, maxLength: number) =>
  z.preprocess(
    (value) => (typeof value === "string" ? value : ""),
    z.string().trim().min(1, message).max(maxLength, message),
  );

export const saveTheDateSchema = z.object({
  guestName: requiredText("Please enter a guest or household name.", 120),
  partySize: z.preprocess(
    (value) => Math.floor(Number(value)),
    z
      .number({ error: "Please tell us the household party size." })
      .int()
      .min(1, "Please tell us the household party size.")
      .max(8, "Please tell us the household party size."),
  ),
  guestNames: requiredText(
    "Please list the names of everyone in the household.",
    500,
  ),
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
  email: z.preprocess(
    (value) => (typeof value === "string" ? value.trim() : ""),
    z.string().email("Please enter a preferred email address."),
  ),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  website: z.string().max(0).optional().or(z.literal("")),
});

export type SaveTheDateFormValues = z.infer<typeof saveTheDateSchema>;
