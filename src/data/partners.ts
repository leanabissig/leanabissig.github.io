import type { Localized } from "../i18n";

// The team, partner groups and logos on "My Support". Personal partners appear as
// sponsors and the team, federation and club as memberships in the structured data.
export const team = {
  name: "Pro Team Hotel Jakob",
  url: "https://www.hoteljakob.at/de/pro-team/leana-bissig-a97",
  logoGray: "/assets/onepager/logos/hotel-jakob-gray.svg",
  logoColor: "/assets/onepager/logos/hotel-jakob.svg",
  logoAlt: "Hotel Jakob",
};

export interface Partner {
  name: string;
  url: string;
  caption: Localized;
  logo: { src: string; width: number; height: number; className?: string };
}

export interface PartnerGroup {
  role: "sponsor" | "team" | "membership";
  heading: Localized;
  partners: Partner[];
  /** Further team partners named without a logo. */
  others?: string[];
}

const logo = (file: string) => `/assets/onepager/logos/${file}`;

export const partnerGroups: PartnerGroup[] = [
  {
    role: "sponsor",
    heading: { de: "Meine persönlichen Partner", en: "My personal partners" },
    partners: [
      {
        name: "Sensolar",
        url: "https://sensolar.ch/",
        caption: { de: "Sonnenschutz", en: "Sun protection" },
        logo: { src: logo("sensolar.png"), width: 480, height: 126 },
      },
    ],
  },
  {
    role: "team",
    heading: { de: "Unterstützung über das Team", en: "Support through the team" },
    partners: [
      {
        name: "Canyon",
        url: "https://www.canyon.com/de-ch/",
        caption: { de: "Radsport", en: "Cycling" },
        logo: { src: logo("canyon.png"), width: 223, height: 32 },
      },
      {
        name: "Pure Encapsulations",
        url: "https://www.purecaps.net/",
        caption: { de: "Mikronährstoffe", en: "Micronutrients" },
        logo: { src: logo("pure.png"), width: 211, height: 79, className: "pure-logo" },
      },
    ],
    others: ["Sailfish", "Uvex", "Zoggs", "Powerbar", "Schwalbe", "Garmin", "Incylence", "Renerosa"],
  },
  {
    role: "membership",
    heading: { de: "Verband & Verein", en: "Federation & club" },
    partners: [
      {
        name: "Swiss Triathlon",
        url: "https://www.swisstriathlon.ch/",
        caption: { de: "Mein Verband", en: "My federation" },
        logo: { src: logo("swisstriathlon.png"), width: 480, height: 194, className: "swiss-logo" },
      },
      {
        name: "TG Hütten",
        url: "https://www.tghuetten.ch/",
        caption: { de: "Mein Verein", en: "My club" },
        logo: { src: logo("tghuetten.png"), width: 480, height: 200 },
      },
    ],
  },
];
