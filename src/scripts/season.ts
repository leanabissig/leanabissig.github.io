// Season state from the race day in the race's own time zone. The build uses it
// for the static page and llms.txt; the browser re-runs it so checks stay current.

export type RaceStatus = "planned" | "today" | "past";

const formatters = new Map<string, Intl.DateTimeFormat>();

/** Today's date (YYYY-MM-DD) in the given time zone. */
export function localDate(now: Date, timeZone: string): string {
  let format = formatters.get(timeZone);
  if (!format) {
    format = new Intl.DateTimeFormat("en", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    formatters.set(timeZone, format);
  }
  const parts = Object.fromEntries(
    format.formatToParts(now).map((part) => [part.type, part.value]),
  );
  return `${parts.year}-${parts.month}-${parts.day}`;
}

export function raceStatus(date: string, timeZone: string, now: Date): RaceStatus {
  const today = localDate(now, timeZone);
  return date < today ? "past" : date === today ? "today" : "planned";
}

/** Next races first; completed dates follow with the most recent at the top. */
export function compareRaces(
  a: { date: string; past: boolean },
  b: { date: string; past: boolean },
): number {
  if (a.past !== b.past) return a.past ? 1 : -1;
  return a.past ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date);
}
