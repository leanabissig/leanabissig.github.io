import type { Localized } from "../i18n";

// Facts about Leana shared by the page head, the structured data and llms.txt.
export const profile = {
  name: "Leana Bissig",
  site: "https://leanabissig.ch",
  email: "contact@leanabissig.ch",
  portrait: "/assets/onepager/images/bike-portrait-1200.webp",
  home: "Winterthur",
  since: 2012,
  instagram: "https://www.instagram.com/leanabissig/",
  linkedin: "https://www.linkedin.com/in/leana-bissig/",
  pto: "https://stats.protriathletes.org/athlete/leana-bissig",
  jobTitle: { de: "Profi-Triathletin", en: "Professional triathlete" } as Localized,
  summary: {
    de: "Schweizer Profi-Triathletin aus Winterthur auf der Mittel- und Langdistanz.",
    en: "Swiss professional middle- and long-distance triathlete from Winterthur.",
  } as Localized,
  country: { de: "Schweiz", en: "Switzerland" } as Localized,
  university: { de: "ETH Zürich", en: "ETH Zurich" } as Localized,
  degree: "MSc ETH in Health Sciences and Technology",
  // Titles from the story, shown in the partnership deck.
  titles: [
    { de: "Schweizer Meisterin Elite im Sprinttriathlon 2023", en: "Swiss elite champion in sprint triathlon, 2023" },
    { de: "Mehrere Schweizer Meistertitel U20 und U23", en: "Several Swiss U20 and U23 titles" },
  ] as Localized[],
  // Highlights for search engines and agents (schema.org "award").
  awards: [
    {
      de: "Schweizer Meistertitel Elite im Sprinttriathlon 2023",
      en: "Swiss elite champion in sprint triathlon, 2023",
    },
    {
      de: "1. Rang Apfelland Triathlon 2024, erster internationaler Profisieg",
      en: "1st place, Apfelland Triathlon 2024, first international pro win",
    },
    {
      de: "3. Rang Ironman 70.3 Cascais 2024 und 2026",
      en: "3rd place, Ironman 70.3 Cascais 2024 and 2026",
    },
    {
      de: "4. Rang Ironman Switzerland 2026, erster Ironman",
      en: "4th place, Ironman Switzerland 2026, her first Ironman",
    },
    {
      de: "Qualifiziert für die Ironman-70.3-WM 2027 in Chattanooga (USA)",
      en: "Qualified for the 2027 Ironman 70.3 World Championship in Chattanooga, USA",
    },
  ] as Localized[],
  // Opening summary of llms.txt (English).
  intro:
    "Swiss professional triathlete from Winterthur, racing middle and long distance (Ironman 70.3 and Ironman). She qualified for the 2027 Ironman 70.3 World Championship in Chattanooga, USA; her next big goal is to qualify for the Ironman World Championship in Kona.",
  // Profile in short sentences for llms.txt (English).
  facts: [
    "Swiss professional triathlete, middle and long distance; at home in Winterthur, Switzerland.",
    "Competitive swimmer as a child; first triathlon training at the end of August 2012.",
    "Several Swiss U20 and U23 championship titles; Swiss elite champion in sprint triathlon in 2023.",
    "Raced in the World Triathlon Championship Series (WTCS) and on the T100 World Tour before moving to long distance.",
    "Master's degree (MSc) in Health Sciences and Technology from ETH Zurich; works 50% as a business analyst alongside professional sport.",
    "What drives her: to bring out the best in herself.",
  ],
};
