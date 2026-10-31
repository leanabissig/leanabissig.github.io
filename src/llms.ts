// llms.txt and llms-full.txt: the page's facts as Markdown for language models,
// built from the same data and texts as the pages so they never drift apart.
import { championships } from "./data/championships";
import { partnerGroups, team, type PartnerGroup } from "./data/partners";
import { profile } from "./data/profile";
import { results } from "./data/results";
import { seasonRaces } from "./data/season";
import { local, pagePath, texts, type Lang } from "./i18n";
import { placeText } from "./scripts/places";
import { compareRaces, raceStatus } from "./scripts/season";

const url = (lang: Lang) => new URL(pagePath(lang), profile.site).href;
const link = (label: string, href: string) => `[${label}](${href})`;
const today = (now: Date) => now.toISOString().slice(0, 10);

/** Season rows as of `now`, upcoming first, with an English status. */
export function seasonLines(now: Date, lang: Lang = "en"): string[] {
  const t = texts[lang];
  return seasonRaces
    .map((race) => {
      const status = raceStatus(race.date, race.timeZone, now);
      return { ...race, status, past: status === "past" };
    })
    .sort(compareRaces)
    .map((race) => {
      const state = race.result
        ? placeText(race.result, lang)
        : race.status === "past"
          ? lang === "en"
            ? "raced, result not yet listed"
            : "gelaufen, Resultat folgt"
          : (race.status === "today" ? t.seasonToday : t.seasonPlanned).toLowerCase();
      const more = race.result || race.past ? "" : ` (${link(lang === "en" ? "race site" : "Rennseite", race.url)})`;
      return `- ${race.date} · ${local(race.race, lang)} · ${state}${more}`;
    });
}

function resultLines(lang: Lang): string[] {
  return results.map((result) => {
    const context = [result.tag, ...result.details].filter((x) => x !== undefined);
    const place = placeText(result.rank, lang);
    const repeat = result.dates.length > 1 ? (lang === "en" ? " both times" : ", beide Male") : "";
    return `- ${result.dates.join(lang === "en" ? " and " : " und ")} · ${local(result.race, lang)} · ${place}${repeat} (${context.map((c) => local(c, lang)).join(", ")})`;
  });
}

const roleLabels: Record<PartnerGroup["role"], string> = {
  sponsor: "Personal partners",
  team: "Support through the team",
  membership: "Federation and club",
};

/** Team and partner groups; `summary` words them in the third person for llms.txt. */
function partnerLines(lang: Lang, summary = false): string[] {
  // German captions are nouns and keep their capital.
  const caption = (text: string) =>
    lang === "en" ? (summary ? text.replace(/^my /i, "") : text).toLowerCase() : text;
  return [
    `- ${summary ? "Team" : texts[lang].teamLabel}: ${link(team.name, team.url)}`,
    ...partnerGroups.map((group) => {
      const named = group.partners.map((p) => `${link(p.name, p.url)} (${caption(local(p.caption, lang))})`);
      const label = summary ? roleLabels[group.role] : local(group.heading, lang);
      return `- ${label}: ${[...named, ...(group.others ?? [])].join(", ")}`;
    }),
  ];
}

export function llmsTxt(now = new Date()): string {
  const en = texts.en;
  return [
    `# ${profile.name}`,
    "",
    `> ${profile.intro}`,
    "",
    `This file summarises ${profile.site}/ for language models and agents. The website is a one-pager in German (${url("de")}) and English (${url("en")}); the full page text in both languages is at ${profile.site}/llms-full.txt. Dates are ISO 8601 (YYYY-MM-DD). Generated from the website's data on ${today(now)}.`,
    "",
    "## Pages",
    "",
    `- ${link(en.title, url("en"))}: ${en.description}`,
    `- ${link(texts.de.title, url("de"))}: ${texts.de.description}`,
    `- ${link("Full page text, English and German", `${profile.site}/llms-full.txt`)}`,
    "",
    "## Profile",
    "",
    ...profile.facts.map((fact) => `- ${fact}`),
    `- Team: ${link(team.name, team.url)}.`,
    "",
    "## Selected results",
    "",
    ...resultLines("en"),
    "",
    `All results: ${link("PTO athlete profile", profile.pto)}`,
    "",
    "## World Championships",
    "",
    ...championships.map((item) => `- ${item.summary}`),
    "",
    `## Season ${en.seasonHeading.match(/\d{4}\/\d{2}/)?.[0] ?? ""}`.trimEnd(),
    "",
    `Upcoming first, then past races, newest first. Status as of ${today(now)}.`,
    "",
    ...seasonLines(now),
    "",
    "## Goal",
    "",
    `${en.goalHeading} In her words: “${en.goalText}”`,
    "",
    "## Partners",
    "",
    ...partnerLines("en", true),
    "",
    "## Short bio for media",
    "",
    "English:",
    "",
    en.pressBio,
    "",
    "Deutsch:",
    "",
    texts.de.pressBio,
    "",
    "## Contact and links",
    "",
    `- Partnerships, media and contact: ${profile.email}`,
    `- ${link("Website in German", url("de"))}, ${link("in English", url("en"))}`,
    `- ${link("Instagram", profile.instagram)}`,
    `- ${link("LinkedIn", profile.linkedin)}`,
    `- ${link("PTO athlete profile with all results", profile.pto)}`,
    "",
  ].join("\n");
}

/** The whole page as plain text in one language. */
function pageText(lang: Lang, now: Date): string[] {
  const t = texts[lang];
  const flat = (text: string) => text.replace(/\n/g, " ");
  return [
    `## ${lang === "en" ? "English" : "Deutsch"}: ${url(lang)}`,
    "",
    `${t.heroEyebrow}. ${t.introText}`,
    "",
    `### ${t.tabStory}: ${flat(t.storyHeading)}`,
    "",
    t.storyP1,
    "",
    t.storyP2,
    "",
    t.storyP3,
    "",
    `- ${t.sinceLabel}: ${profile.since}`,
    `- ${t.homeLabel}: ${profile.home}`,
    `- ${t.driveLabel}: ${t.driveValue}`,
    "",
    `### ${t.tabHighlights}: ${flat(t.highlightsHeading)}`,
    "",
    `${t.selectedResults}:`,
    "",
    ...resultLines(lang),
    "",
    `${t.coinsEyebrow}:`,
    "",
    ...championships.map((item) => `- ${local(item.caption[0], lang)} ${local(item.caption[1], lang)}`),
    "",
    `${t.seasonHeading}`,
    "",
    ...seasonLines(now, lang),
    "",
    `${t.goalHeading} ${t.goalText}`,
    "",
    `### ${t.tabSupport}: ${flat(t.supportHeading)}`,
    "",
    t.supportIntro,
    "",
    ...partnerLines(lang),
    "",
    `### ${t.contactHeading}`,
    "",
    `${t.pressBioLabel}: ${t.pressBio}`,
    "",
    `${t.contact}: ${profile.email}`,
    "",
  ];
}

export function llmsFullTxt(now = new Date()): string {
  return [
    `# ${profile.name}: full page text`,
    "",
    `> The complete text of ${profile.site}/ in English and German, generated from the website's data on ${today(now)}. A shorter summary: ${profile.site}/llms.txt`,
    "",
    ...pageText("en", now),
    ...pageText("de", now),
  ].join("\n");
}
