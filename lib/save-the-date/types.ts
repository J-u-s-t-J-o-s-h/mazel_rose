export type SaveTheDateSubmission = {
  guestName: string;
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
