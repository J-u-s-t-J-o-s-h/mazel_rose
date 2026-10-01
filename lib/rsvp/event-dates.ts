type DatedEvent = {
  id: string;
  title: string;
  date: string;
  startTime: string;
};

const EVENT_ORDER = ["welcome", "ceremony", "reception"];

const TITLE_MATCH: Record<string, (title: string) => boolean> = {
  ceremony: (title) => title === "ceremony",
  reception: (title) =>
    title === "reception" || title === "give thanks and come celebrate",
  welcome: (title) =>
    title.startsWith("welcome") || title.includes("night before paradise"),
};

export function withEventDates<T extends { key: string; label: string }>(
  options: T[],
  events: DatedEvent[],
): Array<T & { when?: string }> {
  return options
    .map((option) => {
      const key = option.key.trim().toLowerCase();
      const label = option.label.trim().toLowerCase();
      const match = events.find((event) => {
        const title = event.title.trim().toLowerCase();
        const id = event.id.trim().toLowerCase();
        const byKey = TITLE_MATCH[key];
        return id === key || id.endsWith(`.${key}`) || (byKey ? byKey(title) : title === label);
      });
      if (!match?.date) return option;
      const time = match.startTime.replace(/ /g, "\u00a0");
      const when = time ? `${match.date} · ${time}` : match.date;
      return { ...option, when };
    })
    .sort((a, b) => eventRank(a.key) - eventRank(b.key));
}

function eventRank(key: string): number {
  const index = EVENT_ORDER.indexOf(key.trim().toLowerCase());
  return index === -1 ? EVENT_ORDER.length : index;
}
