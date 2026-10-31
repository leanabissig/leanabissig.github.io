# Leana Bissig — Onepager

Website für `leanabissig.ch`, gebaut mit [Astro](https://astro.build) zu statischen Seiten: Deutsch unter `/`, Englisch unter `/en/`. Drei Bereiche: **Mein Weg / My Story**, **Highlights & Ausblick / Highlights & Goals**, **Meine Partner / My Support**. Aus denselben Daten entstehen auch `llms.txt`, `llms-full.txt`, `sitemap.xml` und die strukturierten Daten. Blog und Galerie wurden entfernt; frühere Inhalte bleiben in der Git-Historie.

## Entwickeln und Vorschau

```sh
npm ci
npm run dev        # Entwicklungsserver mit Live-Reload, http://localhost:4321
npm run preview    # fertiger Build aus dist/, http://localhost:8000
npm run check      # TypeScript- und Astro-Prüfung
```

Node.js ab 22.12 (Astro 7.3). TypeScript im Modus `strict`.

## Inhalte pflegen

Inhalte stehen einmal in Daten- und Textdateien; beide Sprachseiten, `llms.txt`, `llms-full.txt` und die strukturierten Daten werden daraus gebaut und können nicht auseinanderlaufen.

- `src/i18n/de.ts`, `src/i18n/en.ts`: alle Seitentexte, Seitentitel, Beschreibungen und Mail-Betreffe. `en.ts` ist gegen `de.ts` typisiert; fehlt ein Text, bricht `npm run check` ab. `\n` in einem Text wird zum Zeilenumbruch.
- `src/data/results.ts`: ausgewählte Resultate (Rang, Rennen, Label, Kontext, Datum, Logo).
- `src/data/season.ts`: Saisonliste mit Datum, Zeitzone, Link und, sobald bekannt, `result`.
- `src/data/championships.ts`: WM-Coins und Patch mit Bildern, Beschriftung und einer Zeile für `llms.txt`.
- `src/data/partners.ts`: Team, Partnergruppen und Logos. Persönliche Partner erscheinen in den strukturierten Daten als `sponsor`, Team, Verband und Verein als `memberOf`.
- `src/data/profile.ts`: Kontakt, Profil-Links, Kurzfassung und Profilsätze für `llms.txt`, Auszeichnungen (`award`).
- `src/components/`: Aufbau der Seite; `src/layouts/Base.astro` das HTML-Gerüst.
- `src/styles/site.css`: Farben, Schrift, Abstände und mobile Darstellung.
- `src/scripts/site.ts`: Tabs, Bildwechsel, Coins, Saison-Automatik, Text kopieren. `places.ts` und `season.ts` rechnen Ränge und Saisonstatus gleich im Build und im Browser.
- `public/assets/onepager/`: Bilder, Logos, Rennlogos, Schrift und Favicon unter ihren bisherigen Adressen; die Originalfotos bleiben unverändert in der Inbox.

Die Reiter sind lokalisiert: «Mein Weg», «Highlights & Ausblick», «Meine Partner» auf Deutsch; «My Story», «Highlights & Goals», «My Support» auf Englisch. Direktlinks funktionieren mit `?tab=story`, `?tab=highlights` oder `?tab=support`. DE/EN oben rechts sind gewöhnliche Links auf die andere Sprachseite und behalten den offenen Tab. Die Wahl wird gemerkt: Wer Englisch gewählt hat, landet auf `/` künftig auf `/en/`; ein Link direkt auf `/en/` bleibt immer Englisch. Alte Links mit `?lang=en` oder `?lang=de` führen auf die passende Seite. Ohne JavaScript sind beide Sprachseiten mit allen drei Bereichen vollständig. Keine automatisch wechselnden Bilder, Tracking-Skripte oder eingebetteten Social-Feeds. Die Schrift Manrope ist lokal eingebunden; Lizenz: `public/assets/onepager/fonts/OFL.txt`. CSS und JavaScript erhalten beim Build einen Hash im Dateinamen; ein manuelles `?v=` ist nicht mehr nötig.

Die öffentliche Kontaktadresse `contact@leanabissig.ch` stammt aus der bisherigen Partnerseite. Partnerangaben stammen aus Leanas Gesprächsangaben, Resultate aus dem [PTO-Profil](https://stats.protriathletes.org/athlete/leana-bissig), Stand 28.10.2026. Kona wird als Qualifikationsziel 2027 formuliert. Quellen für die Partnerlinks: [Hotel Jakob](https://www.hoteljakob.at/de/pro-team/leana-bissig-a97), bisherige Saucony-Verlinkung und [Sensolar](https://sensolar.ch/).

Alle Mail-Links tragen eine Betreffzeile: «Kontakt · leanabissig.ch» bzw. «Contact · leanabissig.ch» (Kontakt-Button oben, Footer) und «Partnerschaft & Medien · leanabissig.ch» bzw. «Partnerships & press · leanabissig.ch» (Kontaktbereich). So sind Anfragen über die Website ohne Tracking erkennbar: im Postfach nach «leanabissig.ch» im Betreff filtern. Absender können den Betreff ändern; die Zählung ist deshalb eine Untergrenze.

Strukturierte Daten (schema.org, JSON-LD im `<head>`, je Sprache): `Person` mit Instagram, LinkedIn und PTO, Team, Verband, Verein, den persönlichen Partnern Saucony und Sensolar, Wohnort, ETH, dem MSc in Health Sciences and Technology sowie unter `award` dem Schweizer Elite-Titel 2023, den wichtigsten Resultaten und der WM-Qualifikation 2027; dazu `WebSite` und je Sprachseite eine `ProfilePage`. Beide Seiten verweisen mit `hreflang` aufeinander, `sitemap.xml` ebenso.

Resultate, deren Rang allein zu wenig Kontext gibt, erhalten ein Label (`tag`, auf der Seite `.result-tag`): «Weltmeisterschaft» (Nizza, 23. Rang), «Langdistanz-Debüt» (Ironman Switzerland; im PTO-Profil kein früherer Langdistanzstart, von Leana zu bestätigen), «T100 World Tour» (Wollongong, 100 km) und «Erster internationaler Profisieg» (Apfelland; Leanas eigene Einordnung, Sieg im PTO-Profil). Höchstens drei bis vier Labels, damit sie auffallen. Die beiden Cascais-Podestplätze (3. Rang 2024 und 2026) teilen sich bewusst eine Zeile: gleiches Rennen, gleicher Rang. Die Wiederholung steht als grauer Text «zweimal auf dem Podest» und nicht als Label, damit die vier Labels ihre Wirkung behalten; die Jahreszahlen stehen untereinander in `.result-dates` (auf schmalen Bildschirmen nebeneinander). Für ein drittes Jahr genügt ein weiteres Datum in `dates`. Die Resultatliste zeigt Rang, Rennen und Distanz, aber keine Zielzeiten (Entscheid vom 04.10.2026); Zeiten stehen im PTO-Profil. Zell am See trägt «Ironman Pro Series» bewusst als grauen Text statt als Label: der Begriff sagt Firmen wenig, und mehr Labels würden die übrigen schwächen. Quelle: [Pro Series Races & Results](https://www.ironman.com/proseries/races-and-results), geprüft 04.10.2026.

Unter dem Kontaktbereich steht ein aufklappbares «Kurzporträt für Medien» in der dritten Person (`pressBio` in beiden Sprachen). «Text kopieren» erscheint nur mit JavaScript und Zwischenablage-Zugriff (HTTPS oder localhost); sonst bleibt der Text markierbar. Bei neuen Resultaten oder Zielen mitpflegen.

## KI-Agenten (`llms.txt`, `llms-full.txt`)

`llms.txt` fasst die Seite für Sprachmodelle und KI-Agenten als Markdown auf Englisch zusammen: Profil, ausgewählte Resultate, Weltmeisterschaften, Saison mit Status, Ziel Kona, Partner, das Kurzporträt (EN und DE, wörtlich) und Kontakt. `llms-full.txt` enthält den ganzen Seitentext auf Englisch und Deutsch. Beide entstehen in `src/llms.ts` aus denselben Daten und Texten wie die Seiten; der Saisonstatus gilt am Tag des Builds, der täglich neu läuft. Die Seiten verlinken beide Dateien mit `rel="describedby"`, `robots.txt` nennt sie. Alle KI-Crawler sind über `User-agent: *` zugelassen; GitHub Pages sperrt keine Crawler, eine Einzelaufzählung wie bei Hostern mit Sperrliste ist deshalb nicht nötig.

## Partnerschafts-Deck (PDF)

Zwei Seiten A4 quer für Firmen und Sponsoren, auf Deutsch und Englisch: `/deck/leana-bissig-partnership-de.pdf` und `-en.pdf`. Seite 1 «Profil & Erfolge»: Foto, Kurzprofil, «Was mich antreibt», ausgewählte Resultate, Titel, Partner-Logos. Seite 2 «Ziele & Partnerschaft»: Ziel Kona, Fahrplan mit den kommenden Rennen der Saisonliste, WM-Coins, Partnerschaftsangebot, Kontakt.

Die Vorlage ist `src/pages/deck/[lang].astro` mit `src/styles/deck.css`; als Webseite unter `/deck/de/` und `/deck/en/` (nicht indexiert). Nach `astro build` druckt `scripts/deck-pdf.mjs` beide Seiten mit Chromium zu PDF, Teil von `npm run build`, also auch in GitHub Actions. Resultate, Titel, Saison, Coins, Partner und Kontakt kommen aus denselben Daten wie die Website und sind im Deck automatisch aktuell. Nur Werte («Was mich antreibt»), die Einordnung der kommenden Rennen und das Angebot stehen in `src/data/partnership.ts`. Fotos und Coins gehen als JPEG ins PDF (`src/pages/deck/img/[name].jpg.ts` erzeugt sie beim Build aus den WebP-Dateien); so bleibt jedes PDF bei rund 1 MB statt 7 MB.

Solange in `partnership.ts` `draft: true` steht, trägt jede Seite den Stempel «Entwurf – von Leana zu bestätigen», die vorgeschlagenen Abschnitte sind gestrichelt markiert, und Website und `llms.txt` verlinken das Deck nicht. Nach Leanas Freigabe `draft: false` setzen: Die Markierungen verschwinden, und im Kontaktbereich erscheint «Partnerschafts-Deck (PDF)». Ein Test prüft, dass beide PDFs zwei Seiten haben, unter 3 MB bleiben, nichts über den Seitenrand läuft und ein Entwurf nicht verlinkt ist.

## Bilder

| Verwendung | Webdatei | Von Leana gewählte Quelle |
| --- | --- | --- |
| Karussell 1 | `bike-portrait-*.webp` | `Fotoshooting_Leana Mai-8.JPG` |
| Karussell 2 | `bike-action-*.webp` | `Fotoshooting_Leana Mai-19.JPG` |
| Karussell 3 | `after-race-*.webp` | `77fa350a-20a3-4ba6-832f-f4a7f7e9d105.JPG` |
| My Story | `story-portrait.webp` | `DSC04684.JPG` |
| Coin Nizza 2026 | `coin-nice-2026-front.webp`, `coin-nice-2026-back.webp` | `coin-nice-2026-front.jpg`, `coin-nice-2026-back.jpg` |
| Patch T100 Katar 2025 | `patch-t100-qatar-2025-front.webp`, `patch-t100-qatar-2025-back.webp` | `patch-t100-qatar-2025-front.jpg`, `patch-t100-qatar-2025-back.jpg` |
| Coin Chattanooga 2027 | `coin-chattanooga-2027-front.webp`, `coin-chattanooga-2027-back.webp` | `coin-chattanooga-2027-front.jpg`, `coin-chattanooga-2027-back.jpg` |

Die Originale bleiben unverändert in der Inbox. Webkopien sind verkleinert und ohne EXIF-Metadaten gespeichert. Die Fotos werden ohne Farbfilter oder abdunkelnde Überlagerung dargestellt. Name und Bild liegen auf getrennten Flächen. Kreuz und Ortsangabe wurden aus dem Karussell entfernt. Fotocredits sind noch nicht angegeben.

## WM-Coins und Patch

Zwischen den Highlight-Resultaten und der Saisonliste steht «Meine Weltmeisterschaften»: der Patch vom T100-WM-Finale Katar 2025 (12.12.2025, 22. Rang laut [PTO](https://stats.protriathletes.org/athlete/leana-bissig), geprüft 30.10.2026) sowie Leanas Qualifikations-Coins der 70.3-WM Nizza 2026 und Chattanooga 2027, chronologisch von links. Tippen, Klicken, Enter oder Leertaste drehen einen Coin oder den Patch eineinhalb Umdrehungen auf die andere Seite; `aria-pressed` zeigt an, ob die Rückseite oben liegt. Der Patch zeigt hinten seine Klettseite und hat als dünnes Gewebe keinen Metallrand. Mit Maus kippen Coins und Patch beim Überfahren leicht als Hinweis. Bei «Bewegung reduzieren» wechselt die Seite ohne Animation. Ohne JavaScript bleibt die Vorderseite sichtbar und der Hinweis «Zum Drehen antippen» ausgeblendet.

Die Bilder sind eigene Fotos der Coins und des Patches vom 31.10.2026 bei Tageslicht (Originale in der Inbox), keine Bilder aus dem Netz. Die Coins sind am Rand entlang freigestellt (Ellipse auf den Rand gepasst und auf einen Kreis entzerrt, damit die schräge Aufnahme ausgeglichen ist), an der Schrift waagrecht ausgerichtet, am Papierhintergrund weissabgeglichen, um 8 % aufgehellt und in den Lichtern weich zurückgenommen, damit Metall nicht ausfrisst. Eine Retusche war nicht nötig. Gespeichert sind sie als 400 × 400 px WebP mit Transparenz und ohne Metadaten. Vorder- und Rückseite des Patches sind über den rosa Stickrand freigestellt, gerade gerichtet, am Papier weissabgeglichen (die hellere Rückseite auf die Helligkeit der Vorderseite) und als 237 × 400 px WebP gespeichert; jede Datei dient in `site.css` zugleich als Maske für die Schattierung ihrer Seite. Für einen weiteren Coin genügt ein weiterer Eintrag in `src/data/championships.ts` mit Vorder- und Rückseite, Beschriftung und `aria-label` in beiden Sprachen.

## Logos

Sieben lokal gespeicherte Logos in `public/assets/onepager/logos/`: Hotel Jakob, Saucony, Sensolar, Canyon, Pure Encapsulations, Swiss Triathlon und TG Hütten. Schriftzüge und Proportionen bleiben erhalten. Ein gemeinsamer SVG-Tonwertfilter vereinheitlicht den Grauton. Das illustrierte Hotel-Emblem verwendet eine separate SVG-Variante mit drei Grautönen; Pure eine lineare Tonwertanpassung, die die feine weisse Schrift erhält. Bei Hover und Tastaturfokus erscheint das unveränderte farbige Logo. Team, persönliche Partner, Team-Partner sowie Verband/Verein werden passend zu ihrer Beziehung getrennt beschriftet.

Quellen und Abrufdatum sind in [SOURCES.md](public/assets/onepager/logos/SOURCES.md) dokumentiert. Neue Logos sind echte Bilddateien aus dem bestehenden Repository bzw. der offiziellen Teamseite. Keine nachgebauten Wortmarken.

## Browserchecks

```sh
npx playwright install chromium
npm test                # baut dist/ und prüft es im Browser
```

Alternativ mit installiertem Chrome:

```sh
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/google-chrome npm test
```

Die Checks laufen gegen den fertigen Build und prüfen Navigation, Browserhistorie, Sprachseiten und Sprachwahl, Bilder, Kontaktziele, mobile Überläufe, WCAG-A/AA-Regeln mit axe, beide Sprachseiten ohne JavaScript, `hreflang`, strukturierte Daten, Sitemap, `llms.txt`/`llms-full.txt` sowie alte und entfernte URLs. Ein automatisierter Accessibility-Check ersetzt keine vollständige manuelle Prüfung.

## Veröffentlichen (GitHub Actions)

Ein Push auf `master` startet `.github/workflows/deploy.yml`: Abhängigkeiten installieren, `astro check`, Build, alle Browserchecks, dann Veröffentlichung von `dist/` auf GitHub Pages. Schlägt ein Schritt fehl, bleibt die bisherige Seite online. Zusätzlich baut der Workflow täglich um 02:17 UTC neu, damit Saison-Häkchen im HTML und der Status in `llms.txt` ohne Commit dem Kalender folgen (Besucherinnen und Besucher sehen den aktuellen Stand ohnehin über JavaScript). GitHub pausiert geplante Läufe nach 60 Tagen ohne Aktivität im Repository; unter «Actions» lässt sich der Workflow jederzeit auch von Hand starten.

Voraussetzung in den Repository-Einstellungen: Settings → Pages → Source «GitHub Actions». Die Domain `leanabissig.ch` ist dort ebenfalls hinterlegt; eine `CNAME`-Datei braucht es bei Actions nicht. [GitHub-Dokumentation](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site#publishing-with-a-custom-github-actions-workflow).

`/about/`, `/highlights/`, `/partners/` und `/calendar/` leiten zum passenden Tab weiter. Entfernte Blog- und Galerie-URLs erhalten `404.html` mit Link zur Startseite.

## Saisonkalender

Unter Highlights & Goals stehen sieben gelaufene Rennen aus 2026 — inklusive der 70.3-WM in Nizza und des Podestplatzes in Cascais — sowie die kommenden Starts Western Australia und die 70.3-WM 2027 in Chattanooga; der Titel lautet deshalb «Meine Saison 2026/27». Bereits vorliegende Resultate werden in `src/data/season.ts` als `result` eingetragen. Build und Browser vergleichen das heutige Datum mit dem Renndatum in der Zeitzone des Veranstaltungsorts. Erst am Folgetag wird der Termin mit einem Häkchen markiert; Namen und Daten werden nicht durchgestrichen. Ein Datum allein erzeugt kein Resultat; in diesem Fall lautet der Status «Vergangen» / «Past date». Der Build schreibt den Stand des Build-Tags ins HTML (täglicher Neubau); der Browser aktualisiert beim Laden, beim Zurückkehren zur Seite und minütlich für offen gelassene Seiten. Ohne JavaScript bleibt der Stand des letzten Builds lesbar.

Quellen, zuletzt geprüft am 28.10.2026:

- Bisherige Rennen 2026 und Cascais-Podium vom 19.10.2024 (3. Rang, 4:16:28): [PTO](https://stats.protriathletes.org/athlete/leana-bissig).
- Nizza, Frauenrennen am 12.09.2026, 23. Rang in 4:39:40. PTO ([Profil](https://stats.protriathletes.org/athlete/leana-bissig), [Rennresultate](https://stats.protriathletes.org/race/im-703-world-championship/2026/results)) zeigt fälschlich den 22. Rang; Korrektur am 04.10.2026 auf Leanas Angabe. Bei einer PTO-Korrektur hier nachführen; Termin und Rennlogo über die [offizielle WM-Seite](https://www.ironman.com/im703-world-championship).
- Cascais 70.3 am 17.10.2026, 3. Rang in 4:24:16 (Siegerin Lizzie Rayner 4:13:02, zweite Nikki Bartlett 4:20:11): [PTO-Profil](https://stats.protriathletes.org/athlete/leana-bissig) und [Rennbericht](https://tri-today.com/2026/10/three-in-a-row-lizzie-rayner-dominates-ironman-70-3-cascais/), geprüft 28.10.2026. Die Zielzeit steht wie bei den übrigen Rennen nur hier, nicht auf der Website.
- Ironman Western Australia am 06.12.2026: [offizieller Veranstaltungsplan](https://www.ironman.com/races/im-western-australia/schedule).
- Ironman-70.3-WM 2027 in Chattanooga (USA) am 28./29.08.2027, angekündigt am 18.06.2026: [Slowtwitch](https://slowtwitch.com/triathlon/its-back-to-chattanooga-2027-ironman-70-3-world-championship-host-announced/), offizielle Seite [ironman.com](https://www.ironman.com/races/im703-world-championship-2027), geprüft 30.10.2026. Das Frauenrennen ist am 28.08.2027 (Angabe vom 30.10.2026; in den geprüften Quellen noch nicht nach Tagen aufgeteilt). Leanas Qualifikation in Cascais beruht auf ihrer Angabe; eine öffentliche Slot-Liste lag am 30.10.2026 nicht vor.

Western Australia wurde von Leana als Saisonplanung genannt. Organisationsdaten können sich ändern und müssen bei Terminänderungen in `src/data/season.ts` angepasst werden. Die Datumsautomatik fragt keine externen Renndaten ab.

Die Saisonliste zeigt heutige und zukünftige Rennen mit dem nächsten Termin zuerst, danach vergangene Rennen nach Datum absteigend. Die Reihenfolge wird zusammen mit den Häkchen nach dem lokalen Renntag automatisch aktualisiert.

Highlight-Logos sind lokal in `public/assets/onepager/races/` gespeichert. Zuordnungen und Originalquellen stehen in [races/SOURCES.md](public/assets/onepager/races/SOURCES.md). Linkpfeile sind dekorative Inline-SVGs mit expliziten Abmessungen, damit Safari keine Emoji-Schrift verwendet.

Die My-Story-Ergänzung zu U20-/U23-Titeln und dem Schweizer Elite-Titel im Sprinttriathlon 2023 basiert auf Leanas Angaben und ihren [bisherigen Highlights](https://leanabissig.ch/highlights/). Die [World-Triathlon-Veranstaltungsseite der SM 2023](https://events.triathlon.org/2023-sui-sprint-triathlon-national-championships/results?program=620049) führt den Wettbewerb in Zürich. WTCS-Teilnahme: [World Triathlon, Yokohama 2025](https://triathlon.org/timing/674075), zusätzlich [offizielles Zeitnahme-Ergebnis](https://results.evochip.hu/results/PDF/yokohama25dad_gender_en.pdf). Im Story-Text werden keine einzelnen WTCS-Rennen oder Platzierungen aufgezählt. Geprüft am 07.09.2026.

Das Karussell verwendet natives horizontales Scrollen mit CSS-Snap-Punkten: auf Touchscreens mit dem Finger wischen, vertikales Scrollen und Pinch-Zoom bleiben verfügbar. Pfeiltasten und Zähler bleiben synchron; die Pfeile wechseln am Ende wieder zum Anfang. Ohne JavaScript bleibt das erste Foto sichtbar.
