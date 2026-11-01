import type { Localized } from "../i18n";

// The partnership deck (/deck/de/, /deck/en/ and their PDFs). Facts such as
// results, coins, the season and partners come from the other data files; this
// file holds only what the deck adds: Leana's values and her partnership offer.
//
// While `draft` is true, every page carries a draft stamp, sections written as
// proposals are marked, and the website does not link the deck.
export const partnership = {
  draft: false,
  title: { de: "Leana Bissig · Partnerschaft", en: "Leana Bissig · Partnership" } as Localized,
  file: (lang: "de" | "en") => `/deck/leana-bissig-partnership-${lang}.pdf`,
  labels: {
    draftStamp: { de: "Entwurf – von Leana zu bestätigen", en: "Draft – to be confirmed by Leana" },
    draft: { de: "Entwurf", en: "Draft" },
    profileTitle: { de: "Profil & Erfolge", en: "Profile & achievements" },
    goalsTitle: { de: "Ziele & Partnerschaft", en: "Goals & partnership" },
    subtitle: {
      de: "Mittel- und Langdistanz · MSc ETH Health Sciences and Technology · Business Analyst",
      en: "Middle and long distance · MSc ETH Health Sciences and Technology · Business analyst",
    },
    titles: { de: "Titel", en: "Titles" },
    partners: { de: "Partner & Team", en: "Partners & team" },
    roadmap: { de: "Fahrplan", en: "Roadmap" },
    offer: { de: "Was ich biete", en: "What I offer" },
    contact: { de: "Kontakt", en: "Contact" },
    deckLink: { de: "Partnerschafts-Deck (PDF)", en: "Partnership deck (PDF)" },
  } satisfies Record<string, Localized>,
  // Context for the races ahead, keyed by date (the races come from season.ts).
  roadmap: {
    "2026-12-06": {
      de: "Zweite Langdistanz nach dem 4. Rang beim Debüt am Ironman Switzerland.",
      en: "Second long-distance race after finishing fourth on debut at Ironman Switzerland.",
    },
    "2027-08-28": {
      de: "Zweite 70.3-WM nach Nizza 2026, qualifiziert in Cascais.",
      en: "Second 70.3 World Championship after Nice 2026, qualified in Cascais.",
    },
  } as Record<string, Localized>,
  values: [
    {
      title: { de: "Freude am Sport", en: "Joy in the sport" },
      text: {
        de: "Seit dem ersten Triathlontraining 2012 treibt mich die Freude an Schwimmen, Rad und Laufen an.",
        en: "Since my first triathlon session in 2012, the joy of swimming, cycling and running has kept me going.",
      },
    },
    {
      title: { de: "Dranbleiben", en: "Perseverance" },
      text: {
        de: "In den U23-Jahren war ich international nicht ganz vorne dabei. Ich blieb dran, lernte dazu und wurde Jahr für Jahr besser.",
        en: "I wasn’t right at the front internationally in my U23 years. I kept going, kept learning and got better every year.",
      },
    },
    {
      title: { de: "Resilienz", en: "Resilience" },
      text: {
        de: "Fünf Jahre Vollzeitstudium an der ETH Zürich, Bachelor und Master, neben der Profikarriere: Ich halte durch, auch wenn es streng wird.",
        en: "Five years of full-time study at ETH Zurich, bachelor’s and master’s, alongside my pro career: I keep going when things get tough.",
      },
    },
    {
      title: { de: "Neugier", en: "Curiosity" },
      text: {
        de: "Von der Kurzdistanz über die T100 World Tour zur Langdistanz: Ich will wissen, was als Nächstes möglich ist.",
        en: "From short course via the T100 World Tour to long distance: I want to find out what’s possible next.",
      },
    },
    {
      title: { de: "Das Beste herausholen", en: "Bringing out my best" },
      text: {
        de: "Ich setze mir gerne ehrgeizige Ziele. Im Training, im Rennen und in meinem Beruf als Business Analyst gebe ich alles, um sie zu erreichen.",
        en: "I like to set myself ambitious goals. In training, in racing and in my work as a business analyst, I give everything I have to achieve them.",
      },
    },
  ] as { title: Localized; text: Localized }[],
  intro: {
    de: "Jede Partnerschaft ist anders. Ob Sichtbarkeit, deine Mitarbeitenden oder deine Produkte: Wir gestalten gemeinsam eine Zusammenarbeit, die zu deinem Unternehmen passt.",
    en: "Every partnership is different. Whether it’s visibility, your people or your products, we shape a collaboration together that fits your organisation.",
  } as Localized,
  offers: [
    {
      title: { de: "Sichtbarkeit", en: "Visibility" },
      items: [
        {
          de: "Dein Logo auf Renn- und Trainingsbekleidung, je nach Verfügbarkeit und Umfang der Partnerschaft.",
          en: "Your logo on race and training kit, depending on availability and the scope of the partnership.",
        },
        {
          de: "Fotos, Videos, Rennberichte und Einblicke für deine Kanäle.",
          en: "Photos, videos, race stories and behind-the-scenes content for your channels.",
        },
        { de: "Präsenz auf leanabissig.ch und Instagram.", en: "Presence on leanabissig.ch and Instagram." },
      ],
    },
    {
      title: { de: "Austausch & Vorträge", en: "Talks & exchange" },
      items: [
        {
          de: "Leistungssport und 50-%-Job verbinden: Prioritäten, Planung, Erholung.",
          en: "Combining pro sport with a 50% job: priorities, planning, recovery.",
        },
        {
          de: "Training, Belastung und Gesundheit aus Sicht einer ETH-Absolventin in Health Sciences and Technology.",
          en: "Training, load and health from the perspective of an ETH graduate in Health Sciences and Technology.",
        },
        {
          de: "Teilnahme an Firmenanlässen, Teamevents und gemeinsamen Trainings.",
          en: "Taking part in company events, team days and group workouts.",
        },
      ],
    },
    {
      title: { de: "Produkte im Renneinsatz", en: "Products in race conditions" },
      items: [
        {
          de: "Deine Ausrüstung und Ernährung im Training und im Wettkampf einsetzen.",
          en: "Using your gear and nutrition in training and racing.",
        },
        {
          de: "Ehrliches, detailliertes Feedback für deine Produktentwicklung.",
          en: "Honest, detailed feedback for your product development.",
        },
      ],
    },
    {
      title: { de: "Massgeschneidert", en: "Made to fit" },
      items: [
        {
          de: "Für eine Saison oder bis Kona: Umfang und Form legen wir gemeinsam fest.",
          en: "For one season or all the way to Kona: we agree on scope and format together.",
        },
        {
          de: "Persönliche Saison- und Rennberichte nur für dich und dein Team.",
          en: "Personal season and race reports just for you and your team.",
        },
        { de: "Exklusivität in deiner Branche.", en: "Exclusivity in your industry." },
      ],
    },
  ] as { title: Localized; items: Localized[] }[],
  closing: {
    de: "Kona ist das Ziel. Begleite mich auf dem Weg dorthin.",
    en: "Kona is the goal. Join me on the way there.",
  } as Localized,
};
