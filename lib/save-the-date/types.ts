export type SaveTheDateAttendance = "attending" | "declined";

export type SaveTheDateSubmission = {
  guestName: string;
  attendance: SaveTheDateAttendance;
  partySize: number;
  guestNames: string;
  additionalNotes: string;
  streetAddress: string;
  addressLine2: string;
  city: string;
  state: string;
  zipCode: string;
  email: string;
  phone: string;
};

export type SaveTheDateResult =
  | { success: true; id: string }
  | { success: false; error: string; code?: string };

export interface SaveTheDateProvider {
  name: string;
  submit(data: SaveTheDateSubmission): Promise<SaveTheDateResult>;
}
