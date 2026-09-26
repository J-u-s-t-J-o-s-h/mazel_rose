const DATE_ONLY = /^(\d{4})-(\d{2})-(\d{2})$/;

/** Calendar date in America/New_York, so a UTC timestamp cannot roll the wedding day. */
export function newYorkDateOnly(value: string): string {
  const trimmed = value.trim();
  if (DATE_ONLY.test(trimmed)) return trimmed;

  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) return "";

  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(parsed);
}

/** "October 12, 2026" from a YYYY-MM-DD date. */
export function formatUsLongDate(isoDate: string): string {
  const match = DATE_ONLY.exec(isoDate);
  if (!match) return isoDate;

  const date = new Date(
    Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])),
  );

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}
