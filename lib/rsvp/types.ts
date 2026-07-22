export type RsvpAttendance = "attending" | "declined";

// Meal choices and event keys are configured by the owner in Sanity Studio,
// so these are open string/boolean maps rather than fixed unions — the form
// must not break when an option is renamed or added.
export type RsvpMealChoice = string;

export type RsvpEventAttendance = Record<string, boolean>;

export type RsvpGuest = {
  name: string;
  mealChoice?: RsvpMealChoice;
  dietaryRestrictions?: string;
};

export type RsvpSubmission = {
  primaryGuestName: string;
  email: string;
  phone?: string;
  invitationCode?: string;
  attendance: RsvpAttendance;
  guests: RsvpGuest[];
  events: RsvpEventAttendance;
  mealChoice?: RsvpMealChoice;
  dietaryRestrictions?: string;
  songRequest?: string;
  message?: string;
  /** Honeypot field — must remain empty */
  website?: string;
  submittedAt?: string;
};

export type RsvpResult =
  | { success: true; id: string }
  | { success: false; error: string; code?: string };

export interface RsvpProvider {
  name: string;
  submit(data: RsvpSubmission): Promise<RsvpResult>;
}
