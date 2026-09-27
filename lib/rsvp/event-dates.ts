type DatedEvent = {
  id: string;
  title: string;
  date: string;
  startTime: string;
};

const TITLE_MATCH: Record<string, (title: string) => boolean> = {
  ceremony: (title) => title === "ceremony",
  reception: (title) => title === "reception",
  welcome: (title) => title.startsWith("welcome"),
};

export function withEventDates<T extends { key: string; label: string }>(
  options: T[],
  events: DatedEvent[],
): Array<T & { when?: string }> {
  return options.map((option) => {
    const key = option.key.trim().toLowerCase();
    const label = option.label.trim().toLowerCase();
    const match = events.find((event) => {
      const title = event.title.trim().toLowerCase();
      const byKey = TITLE_MATCH[key];
      return event.id === key || (byKey ? byKey(title) : title === label);
    });
    if (!match?.date) return option;
    const time = match.startTime.replace(/ /g, "\u00a0");
    const when = time ? `${match.date} · ${time}` : match.date;
    return { ...option, when };
  });
}
