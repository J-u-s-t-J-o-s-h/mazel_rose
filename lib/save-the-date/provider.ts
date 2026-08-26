import { airtableProvider } from "./providers/airtable";
import { localProvider } from "./providers/local";
import type { SaveTheDateProvider } from "./types";

export function getSaveTheDateProvider(): SaveTheDateProvider {
  const name = (
    process.env.SAVE_THE_DATE_PROVIDER ||
    process.env.RSVP_PROVIDER ||
    "local"
  ).toLowerCase();

  switch (name) {
    case "airtable":
      return airtableProvider;
    case "local":
    default:
      return localProvider;
  }
}
