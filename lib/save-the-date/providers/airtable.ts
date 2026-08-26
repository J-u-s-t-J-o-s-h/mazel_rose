import type {
  SaveTheDateProvider,
  SaveTheDateResult,
  SaveTheDateSubmission,
} from "../types";

/**
 * Airtable adapter — reuses AIRTABLE_API_KEY and AIRTABLE_BASE_ID.
 * Writes to AIRTABLE_SAVE_THE_DATE_TABLE_NAME (default "Save the Date"),
 * never to the formal RSVPs table.
 */
export const airtableProvider: SaveTheDateProvider = {
  name: "airtable",
  async submit(data: SaveTheDateSubmission): Promise<SaveTheDateResult> {
    const apiKey = process.env.AIRTABLE_API_KEY;
    const baseId = process.env.AIRTABLE_BASE_ID;
    const tableName =
      process.env.AIRTABLE_SAVE_THE_DATE_TABLE_NAME || "Save the Date";

    if (!apiKey || !baseId) {
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
            "Guest Name": data.guestName,
            Attendance: data.attendance,
            "Party Size": data.partySize,
            "Guest Names": data.guestNames,
            "Additional Notes": data.additionalNotes,
            "Street Address": data.streetAddress,
            "Address Line 2": data.addressLine2,
            City: data.city,
            State: data.state,
            "ZIP Code": data.zipCode,
            "Submitted At": new Date().toISOString(),
          },
        }),
      },
    );

    if (!response.ok) {
      return {
        success: false,
        error: "Unable to save your response right now.",
        code: "PROVIDER_ERROR",
      };
    }

    const json = (await response.json()) as { id?: string };
    return { success: true, id: json.id ?? `airtable_${Date.now()}` };
  },
};
