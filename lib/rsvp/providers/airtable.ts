import type { RsvpProvider, RsvpResult, RsvpSubmission } from "../types";

/**
 * Airtable adapter — requires AIRTABLE_API_KEY, AIRTABLE_BASE_ID, AIRTABLE_TABLE_NAME.
 */
export const airtableProvider: RsvpProvider = {
  name: "airtable",
  async submit(data: RsvpSubmission): Promise<RsvpResult> {
    const apiKey = process.env.AIRTABLE_API_KEY;
    const baseId = process.env.AIRTABLE_BASE_ID;
    const tableName = process.env.AIRTABLE_TABLE_NAME;

    if (!apiKey || !baseId || !tableName) {
      return {
        success: false,
        error: "Airtable is not configured.",
        code: "PROVIDER_MISCONFIGURED",
      };
    }

    const response = await fetch(
      `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fields: {
            Name: data.primaryGuestName,
            Email: data.email,
            Phone: data.phone ?? "",
            "Invitation Code": data.invitationCode ?? "",
            Attendance: data.attendance,
            Guests: JSON.stringify(data.guests),
            Events: JSON.stringify(data.events),
            "Meal Choice": data.mealChoice ?? "",
            "Dietary Restrictions": data.dietaryRestrictions ?? "",
            "Song Request": data.songRequest ?? "",
            Message: data.message ?? "",
            "Submitted At": new Date().toISOString(),
          },
        }),
      },
    );

    if (!response.ok) {
      return {
        success: false,
        error: "Unable to save RSVP to Airtable.",
        code: "PROVIDER_ERROR",
      };
    }

    const json = (await response.json()) as { id?: string };
    return { success: true, id: json.id ?? `airtable_${Date.now()}` };
  },
};
