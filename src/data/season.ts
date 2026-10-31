import type { Localized } from "../i18n";
import { profile } from "./profile";

// The season list. Order here doesn't matter: the page sorts upcoming races first.
// A race is checked off the day after it in its own time zone; add `result`
// once the rank is known, it is never guessed from the date.
export interface SeasonRace {
  date: string;
  timeZone: string;
  race: Localized;
  url: string;
  result?: number;
}

export const seasonRaces: SeasonRace[] = [
  {
    date: "2026-12-06",
    timeZone: "Australia/Perth",
    race: "Ironman Western Australia",
    url: "https://www.ironman.com/races/im-western-australia/schedule",
  },
  {
    date: "2027-08-28",
    timeZone: "America/New_York",
    race: { de: "Ironman 70.3 WM · Chattanooga", en: "Ironman 70.3 World Championship · Chattanooga" },
    url: "https://www.ironman.com/races/im703-world-championship-2027",
  },
  { date: "2026-10-17", timeZone: "Europe/Lisbon", race: "Ironman 70.3 Cascais", url: profile.pto, result: 3 },
  {
    date: "2026-09-12",
    timeZone: "Europe/Paris",
    race: { de: "Ironman 70.3 WM · Nizza", en: "Ironman 70.3 World Championship · Nice" },
    url: profile.pto,
    result: 23,
  },
  { date: "2026-08-30", timeZone: "Europe/Vienna", race: "Ironman 70.3 Zell am See", url: profile.pto, result: 5 },
  { date: "2026-07-26", timeZone: "Europe/Vienna", race: "Trumer Triathlon", url: profile.pto, result: 2 },
  { date: "2026-07-05", timeZone: "Europe/Zurich", race: "Ironman Switzerland", url: profile.pto, result: 4 },
  { date: "2026-06-21", timeZone: "Europe/Copenhagen", race: "Ironman 70.3 Elsinore", url: profile.pto, result: 10 },
  { date: "2026-04-19", timeZone: "Europe/Madrid", race: "Ironman 70.3 Valencia", url: profile.pto, result: 10 },
];
