import type { Localized } from "../i18n";

// "My World Championships", left to right in date order. Each needs a front and
// a back photo; coins get a metal edge in the colour of their rim.
export interface Championship {
  kind: "patch" | "coin";
  metal?: "gold" | "brass";
  label: Localized;
  caption: [Localized, Localized];
  front: string;
  back: string;
  width: number;
  height: number;
  /** One line for llms.txt (English). */
  summary: string;
}

const image = (name: string) => `/assets/onepager/images/${name}.webp`;

export const championships: Championship[] = [
  {
    kind: "patch",
    label: { de: "Patch T100 Katar 2025 drehen", en: "Flip the T100 Qatar 2025 patch" },
    caption: ["T100", { de: "Katar 2025", en: "Qatar 2025" }],
    front: image("patch-t100-qatar-2025-front"),
    back: image("patch-t100-qatar-2025-back"),
    width: 237,
    height: 400,
    summary: "T100 World Championship Final, Qatar, 2025.",
  },
  {
    kind: "coin",
    metal: "gold",
    label: { de: "Coin Nizza 2026 drehen", en: "Flip the Nice 2026 coin" },
    caption: ["70.3", { de: "Nizza 2026", en: "Nice 2026" }],
    front: image("coin-nice-2026-front"),
    back: image("coin-nice-2026-back"),
    width: 400,
    height: 400,
    summary: "2026 Ironman 70.3 World Championship, Nice, France (23rd place).",
  },
  {
    kind: "coin",
    metal: "brass",
    label: { de: "Coin Chattanooga 2027 drehen", en: "Flip the Chattanooga 2027 coin" },
    caption: ["70.3", "Chattanooga 2027"],
    front: image("coin-chattanooga-2027-front"),
    back: image("coin-chattanooga-2027-back"),
    width: 400,
    height: 400,
    summary:
      "2027 Ironman 70.3 World Championship, Chattanooga, USA (women's race on 2027-08-28): qualified at Ironman 70.3 Cascais 2026.",
  },
];
