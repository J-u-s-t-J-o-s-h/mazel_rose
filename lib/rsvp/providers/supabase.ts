import type { RsvpProvider, RsvpResult, RsvpSubmission } from "../types";

/**
 * Supabase adapter — requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.
 * Uses the REST API so the service role key never reaches the client.
 */
export const supabaseProvider: RsvpProvider = {
  name: "supabase",
  async submit(data: RsvpSubmission): Promise<RsvpResult> {
    const url = process.env.SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !serviceKey) {
      return {
        success: false,
        error: "Supabase is not configured.",
        code: "PROVIDER_MISCONFIGURED",
      };
    }

    const response = await fetch(`${url}/rest/v1/rsvps`, {
      method: "POST",
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        primary_guest_name: data.primaryGuestName,
        email: data.email,
        phone: data.phone ?? null,
        invitation_code: data.invitationCode ?? null,
        attendance: data.attendance,
        guests: data.guests,
        events: data.events,
        meal_choice: data.mealChoice ?? null,
        dietary_restrictions: data.dietaryRestrictions ?? null,
        song_request: data.songRequest ?? null,
        message: data.message ?? null,
        submitted_at: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      return {
        success: false,
        error: "Unable to save RSVP to Supabase.",
        code: "PROVIDER_ERROR",
      };
    }

    const json = (await response.json()) as Array<{ id?: string }>;
    return {
      success: true,
      id: json[0]?.id ?? `supabase_${Date.now()}`,
    };
  },
};
