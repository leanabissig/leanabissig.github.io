import type { Localized } from "../i18n";

// Selected results in the highlights list, newest first. Finish times stay on PTO.
export interface Result {
  rank: number;
  race: Localized;
  /** Green label for context a rank alone doesn't give; keep these rare. */
  tag?: Localized;
  /** Grey context, joined with " · ". */
  details: Localized[];
  /** One row per race; a repeated podium adds a second date. */
  dates: string[];
  logo: { src: string; label: string; kind: "ironman" | "trumer" | "t100" | "apfelland" };
}

const middle = { de: "Mitteldistanz", en: "Middle distance" };
const long = { de: "Langdistanz", en: "Long distance" };

export const results: Result[] = [
  {
    rank: 3,
    race: "Ironman 70.3 Cascais",
    details: [middle, { de: "zweimal auf dem Podest", en: "on the podium twice" }],
    dates: ["2026-10-17", "2024-10-19"],
    logo: { src: "/assets/onepager/races/ironman-703-cascais.png", label: "IRONMAN 70.3", kind: "ironman" },
  },
  {
    rank: 23,
    race: { de: "Ironman 70.3 Nizza", en: "Ironman 70.3 Nice" },
    tag: { de: "Weltmeisterschaft", en: "World Championship" },
    details: [middle],
    dates: ["2026-09-12"],
    logo: {
      src: "/assets/onepager/races/ironman-703-world-championship-nice.png",
      label: "IRONMAN 70.3 World Championship",
      kind: "ironman",
    },
  },
  {
    rank: 5,
    race: "Ironman 70.3 Zell am See",
    details: [middle, "Ironman Pro Series"],
    dates: ["2026-08-30"],
    logo: {
      src: "/assets/onepager/races/ironman-703-zell-am-see.png",
      label: "IRONMAN 70.3 Zell am See-Kaprun",
      kind: "ironman",
    },
  },
  {
    rank: 2,
    race: "Trumer Triathlon",
    details: [middle],
    dates: ["2026-07-26"],
    logo: { src: "/assets/onepager/races/trumer.svg", label: "Trumer Triathlon", kind: "trumer" },
  },
  {
    rank: 4,
    race: "Ironman Switzerland",
    tag: { de: "Langdistanz-Debüt", en: "Long-distance debut" },
    details: [long],
    dates: ["2026-07-05"],
    logo: { src: "/assets/onepager/races/ironman-switzerland.png", label: "IRONMAN Switzerland", kind: "ironman" },
  },
  {
    rank: 7,
    race: "Wollongong T100",
    tag: "T100 World Tour",
    details: ["100 km"],
    dates: ["2025-10-18"],
    logo: { src: "/assets/onepager/races/t100.svg", label: "T100 World Tour", kind: "t100" },
  },
  {
    rank: 1,
    race: "Apfelland Triathlon",
    tag: { de: "Erster internationaler Profisieg", en: "First international pro win" },
    details: [middle],
    dates: ["2024-05-19"],
    logo: { src: "/assets/onepager/races/apfelland.svg", label: "Apfelland Triathlon", kind: "apfelland" },
  },
];
