import { z } from "zod";

/**
 * Meal and event options are owner-editable in Sanity Studio, so validation
 * must accept whatever the owner configures — not a frozen list. Guest
 * responses are stored as free text (Airtable "Meal Choice", Supabase
 * meal_choice), so the right contract for a meal choice is simply "a
 * non-empty, reasonably short string." Hardcoding the seven seed values as an
 * enum here is what silently broke the form the moment a meal was renamed in
 * Studio.
 */
export const mealChoiceSchema = z.string().trim().min(1).max(80);

export const rsvpGuestSchema = z.object({
  name: z.string().trim().min(1, "Guest name is required").max(120),
  mealChoice: mealChoiceSchema.optional(),
  dietaryRestrictions: z.string().trim().max(500).optional(),
});

export const rsvpSchema = z
  .object({
    primaryGuestName: z
      .string()
      .trim()
      .min(2, "Please enter your full name")
      .max(120),
    email: z.string().trim().email("Please enter a valid email address"),
    phone: z
      .string()
      .trim()
      .max(40)
      .optional()
      .or(z.literal("")),
    invitationCode: z
      .string()
      .trim()
      .max(40)
      .optional()
      .or(z.literal("")),
    attendance: z.enum(["attending", "declined"]),
    guests: z.array(rsvpGuestSchema).max(8),
    // Event keys are owner-editable in Studio too, so accept any set of
    // labelled checkboxes rather than a fixed ceremony/reception/... shape.
    events: z.record(z.string(), z.boolean()),
    mealChoice: mealChoiceSchema.optional(),
    dietaryRestrictions: z.string().trim().max(500).optional(),
    songRequest: z.string().trim().max(200).optional(),
    message: z.string().trim().max(1000).optional(),
    website: z.string().max(0).optional().or(z.literal("")),
  })
  .superRefine((data, ctx) => {
    if (data.attendance === "attending") {
      const anyEventSelected = Object.values(data.events).some(Boolean);
      if (!anyEventSelected) {
        ctx.addIssue({
          code: "custom",
          message: "Please select at least one event you will attend",
          path: ["events"],
        });
      }
      if (!data.mealChoice) {
        ctx.addIssue({
          code: "custom",
          message: "Please select a meal preference",
          path: ["mealChoice"],
        });
      }
    }
  });

export type RsvpFormValues = z.infer<typeof rsvpSchema>;
