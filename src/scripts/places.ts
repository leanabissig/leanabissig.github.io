import type { Lang } from "../i18n";

// Shared by the build and the browser so both spell ranks the same way.

/** 1st, 2nd, 3rd, 4th … 11th/12th/13th stay "th", so 22 becomes "22nd", not "22th". */
export function englishOrdinal(rank: number): string {
  const lastTwo = rank % 100;
  if (lastTwo >= 11 && lastTwo <= 13) return "th";
  return { 1: "st", 2: "nd", 3: "rd" }[rank % 10] ?? "th";
}

/** "3. Rang" in German, "3rd place" in English. */
export function placeText(rank: number, lang: Lang): string {
  return lang === "en" ? `${rank}${englishOrdinal(rank)} place` : `${rank}. Rang`;
}
