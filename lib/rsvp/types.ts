export type RsvpAttendance = "attending" | "declined";

export type RsvpEventAttendance = Record<string, boolean>;

export type RsvpGuest = {
  name: string;
  dietaryRestrictions?: string;
};

export type RsvpSubmission = {
  primaryGuestName: string;
  email: string;
  phone?: string;
  attendance: RsvpAttendance;
  guests: RsvpGuest[];
  events: RsvpEventAttendance;
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
