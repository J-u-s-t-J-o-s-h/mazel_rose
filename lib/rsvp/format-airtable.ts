import type { RsvpEventAttendance, RsvpGuest } from "./types";

/** Fallback labels match the RSVP form when Studio options are unavailable. */
const DEFAULT_EVENT_OPTIONS = [
  { key: "welcome", label: "Pre-Wedding Celebration" },
  { key: "ceremony", label: "Ceremony" },
  { key: "reception", label: "Give Thanks and Come Celebrate" },
] as const;

/**
 * Airtable column names for the three RSVP events. Keys stay stable so a
 * Studio label rename does not point the submission at a missing column.
 */
export const AIRTABLE_EVENT_COLUMNS = [
  { key: "welcome", field: "Pre-Wedding Celebration" },
  { key: "ceremony", field: "Ceremony" },
  { key: "reception", field: "Give Thanks and Come Celebrate" },
] as const;

export function formatEventColumns(
  events: RsvpEventAttendance,
  attending: boolean,
): Record<string, "Yes" | "No"> {
  const selected = new Set(
    attending
      ? Object.entries(events)
          .filter(([, coming]) => coming)
          .map(([key]) => key)
      : [],
  );

  return Object.fromEntries(
    AIRTABLE_EVENT_COLUMNS.map((column) => [
      column.field,
      selected.has(column.key) ? "Yes" : "No",
    ]),
  );
}

export function formatGuestNames(guests: RsvpGuest[]): string {
  return guests
    .map((guest) => guest.name.trim())
    .filter(Boolean)
    .join(", ");
}

export function formatSelectedEvents(
  events: RsvpEventAttendance,
  options?: Array<{ key: string; label: string }>,
): string {
  const selected = new Set(
    Object.entries(events)
      .filter(([, coming]) => coming)
      .map(([key]) => key),
  );

  const catalog = options?.length ? options : [...DEFAULT_EVENT_OPTIONS];
  const labels: string[] = [];
  const seen = new Set<string>();

  for (const option of catalog) {
    if (!selected.has(option.key)) continue;
    const label = option.label.trim();
    if (!label) continue;
    labels.push(label);
    seen.add(option.key);
  }

  for (const key of selected) {
    if (seen.has(key)) continue;
    labels.push(humanizeKey(key));
  }

  return labels.join(", ");
}

function humanizeKey(key: string): string {
  const known = DEFAULT_EVENT_OPTIONS.find((option) => option.key === key);
  if (known) return known.label;
  return key
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}
