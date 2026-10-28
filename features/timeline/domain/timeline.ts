export interface TimelineEntry {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  start: string;
  time: string;
}

const venueFormatter = new Intl.DateTimeFormat("sv-SE", {
  timeZone: "Europe/Berlin", year: "numeric", month: "2-digit", day: "2-digit",
  hour: "2-digit", minute: "2-digit", hourCycle: "h23",
});

function venueStart(value: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})(?::(\d{2})(?:\.\d{1,3})?)?(Z|[+-]\d{2}:\d{2})?$/.exec(value);
  if (!match) throw new Error("Invalid timeline start");
  const [, year, month, day, hour, minute, second, zone] = match;
  const date = new Date(Date.UTC(+year, +month - 1, +day));
  if (date.getUTCFullYear() !== +year || date.getUTCMonth() !== +month - 1 ||
      date.getUTCDate() !== +day || +hour > 23 || +minute > 59 || +(second ?? 0) > 59) {
    throw new Error("Invalid timeline start");
  }
  if (!zone) return `${year}-${month}-${day}T${hour}:${minute}`;
  const instant = new Date(value.replace(" ", "T"));
  if (!Number.isFinite(instant.getTime())) throw new Error("Invalid timeline start");
  const parts = venueFormatter.formatToParts(instant);
  const part = (type: Intl.DateTimeFormatPartTypes) => parts.find(p => p.type === type)!.value;
  return `${part("year")}-${part("month")}-${part("day")}T${part("hour")}:${part("minute")}`;
}

export function parseTimeline(value: unknown): TimelineEntry[] {
  if (!Array.isArray(value)) throw new Error("Invalid timeline collection");
  const entries = value.map((row: unknown): TimelineEntry => {
    if (!row || typeof row !== "object" ||
        !("_id" in row) || typeof row._id !== "string" || !row._id.trim() ||
        !("title" in row) || typeof row.title !== "string" || !row.title.trim() ||
        !("subtitle" in row) || typeof row.subtitle !== "string" ||
        !("description" in row) || typeof row.description !== "string" ||
        !("start" in row) || typeof row.start !== "string") {
      throw new Error("Invalid timeline entry");
    }
    const start = venueStart(row.start);
    return {
      id: row._id, title: row.title.trim(), subtitle: row.subtitle.trim(),
      description: row.description.trim(), start, time: start.slice(11, 16),
    };
  });
  return entries.sort((a, b) => a.start.localeCompare(b.start));
}

export function invitationReturnLink(id: string | string[] | undefined): string | null {
  return typeof id === "string" && id.trim() ? `/invite?id=${encodeURIComponent(id)}` : null;
}
