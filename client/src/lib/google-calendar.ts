/** Google Calendar "create event" template URL (UTC `dates` segment). */
function toGoogleUtcSegment(d: Date): string {
  const iso = d.toISOString();
  return iso.replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

export function buildGoogleCalendarUrl(opts: {
  title: string;
  details?: string;
  location?: string;
  start: Date;
  end: Date;
}): string {
  const dates = `${toGoogleUtcSegment(opts.start)}/${toGoogleUtcSegment(opts.end)}`;
  const q = new URLSearchParams();
  q.set("action", "TEMPLATE");
  q.set("text", opts.title);
  q.set("dates", dates);
  if (opts.details) q.set("details", opts.details);
  if (opts.location) q.set("location", opts.location);
  return `https://calendar.google.com/calendar/render?${q.toString()}`;
}

/** Fallback window when only wedding date is known (local midday → +5h). */
export function defaultCalendarWindowFromWeddingDate(weddingDate: Date | null | undefined): {
  start: Date;
  end: Date;
} | null {
  if (!weddingDate || Number.isNaN(weddingDate.getTime())) return null;
  const start = new Date(weddingDate.getTime());
  start.setUTCHours(12, 0, 0, 0);
  const end = new Date(start.getTime() + 5 * 60 * 60 * 1000);
  return { start, end };
}

export function parseIsoDateTime(s: string | undefined): Date | null {
  if (!s?.trim()) return null;
  const d = new Date(s.trim());
  return Number.isNaN(d.getTime()) ? null : d;
}
