import { airtableProvider } from "./providers/airtable";
import { localProvider } from "./providers/local";
import { supabaseProvider } from "./providers/supabase";
import type { RsvpProvider } from "./types";

export function getRsvpProvider(): RsvpProvider {
  const name = (process.env.RSVP_PROVIDER || "local").toLowerCase();

  switch (name) {
    case "airtable":
      return airtableProvider;
    case "supabase":
      return supabaseProvider;
    case "local":
    default:
      return localProvider;
  }
}
