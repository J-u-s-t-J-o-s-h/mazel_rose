import { z } from "zod";

export const mealChoiceSchema = z.enum([
  "beef",
  "chicken",
  "fish",
  "vegetarian",
  "vegan",
  "kids",
  "undecided",
]);

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
    events: z.object({
      ceremony: z.boolean(),
      reception: z.boolean(),
      welcome: z.boolean().optional(),
      brunch: z.boolean().optional(),
    }),
    mealChoice: mealChoiceSchema.optional(),
    dietaryRestrictions: z.string().trim().max(500).optional(),
    songRequest: z.string().trim().max(200).optional(),
    message: z.string().trim().max(1000).optional(),
    website: z.string().max(0).optional().or(z.literal("")),
  })
  .superRefine((data, ctx) => {
    if (data.attendance === "attending") {
      if (!data.events.ceremony && !data.events.reception) {
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
