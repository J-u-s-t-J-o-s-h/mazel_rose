export type RsvpAttendance = "attending" | "declined";

export type RsvpMealChoice =
  | "beef"
  | "chicken"
  | "fish"
  | "vegetarian"
  | "vegan"
  | "kids"
  | "undecided";

export type RsvpEventAttendance = {
  ceremony: boolean;
  reception: boolean;
  welcome?: boolean;
  brunch?: boolean;
};

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
