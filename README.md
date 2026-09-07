# Leana Bissig — Onepager

Statische Website für `leanabissig.ch` / `leanabissig.github.io`. Drei Bereiche: **My Story**, **Highlights & Goals**, **My Support**. Deutsch und Englisch, responsive, ohne Framework oder Build-Schritt. Blog und Galerie wurden entfernt; frühere Inhalte bleiben in der Git-Historie.

## Vorschau

```sh
python3 -m http.server 8000
```

Anschliessend `http://localhost:8000` öffnen. Kein npm-Schritt für die Website nötig.

## Inhalte pflegen

- `index.html`: deutsche Texte, Resultate, Partner, Kontakt und Bilder.
- `assets/onepager/site.js`: englische Übersetzung, Tabs, Sprachwahl und manueller Bildwechsel.
- `assets/onepager/site.css`: Farben, Schrift, Abstände und mobile Darstellung.
- `assets/onepager/images/`: optimierte Kopien der neu bereitgestellten Inbox-Fotos; die Originaldateien bleiben unverändert in der Inbox.
- `CNAME`: bestehende Domain `leanabissig.ch`.

Tabnamen bleiben in beiden Sprachen Englisch. Direktlinks funktionieren mit `?tab=story`, `?tab=highlights` oder `?tab=support`; `&lang=en` wählt Englisch. Ohne JavaScript sind alle drei Bereiche sichtbar. Keine automatisch wechselnden Bilder, Tracking-Skripte oder eingebetteten Social-Feeds. Die Schrift Manrope ist lokal eingebunden; Lizenz: `assets/onepager/fonts/OFL.txt`.

Die öffentliche Kontaktadresse `contact@leanabissig.ch` stammt aus der bisherigen Partnerseite. Partnerangaben stammen aus Leanas Gesprächsangaben, Resultate aus dem [PTO-Profil](https://stats.protriathletes.org/athlete/leana-bissig), Stand 07.09.2026. Kona wird als Qualifikationsziel 2027 formuliert. Quellen für die Partnerlinks: [Hotel Jakob](https://www.hoteljakob.at/de/pro-team/leana-bissig-a97), bisherige Saucony-Verlinkung und [Sensolar](https://sensolar.ch/).

## Bilder

| Verwendung | Webdatei | Von Leana gewählte Quelle |
| --- | --- | --- |
| Karussell 1 | `bike-portrait-*.webp` | `Fotoshooting_Leana Mai-8.JPG` |
| Karussell 2 | `bike-action-*.webp` | `Fotoshooting_Leana Mai-19.JPG` |
| Karussell 3 | `after-race-*.webp` | `77fa350a-20a3-4ba6-832f-f4a7f7e9d105.JPG` |
| My Story | `story-portrait.webp` | `DSC04684.JPG` |

Die Originale bleiben unverändert in der Inbox. Webkopien sind verkleinert und ohne EXIF-Metadaten gespeichert. Die Fotos werden ohne Farbfilter oder abdunkelnde Überlagerung dargestellt. Name und Bild liegen auf getrennten Flächen. Kreuz und Ortsangabe wurden aus dem Karussell entfernt. Fotocredits sind noch nicht angegeben.

## Logos

Sieben lokal gespeicherte Logos in `assets/onepager/logos/`: Hotel Jakob, Saucony, Sensolar, Canyon, Pure Encapsulations, Swiss Triathlon und TG Hütten. Schriftzüge und Proportionen bleiben erhalten. Ein gemeinsamer SVG-Tonwertfilter vereinheitlicht den Grauton. Das illustrierte Hotel-Emblem verwendet eine separate SVG-Variante mit drei Grautönen; Pure eine lineare Tonwertanpassung, die die feine weisse Schrift erhält. Bei Hover und Tastaturfokus erscheint das unveränderte farbige Logo. Team, persönliche Partner, Team-Partner sowie Verband/Verein werden passend zu ihrer Beziehung getrennt beschriftet.

Quellen und Abrufdatum sind in [SOURCES.md](assets/onepager/logos/SOURCES.md) dokumentiert. Neue Logos sind echte Bilddateien aus dem bestehenden Repository bzw. der offiziellen Teamseite. Keine nachgebauten Wortmarken.

## Browserchecks

Node-Abhängigkeiten werden ausschliesslich zum Testen verwendet:

```sh
npm ci
npx playwright install chromium
npm test
```

Alternativ mit installiertem Chrome:

```sh
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/google-chrome npm test
```

Die Checks prüfen Navigation, Browserhistorie, Sprache, Bilder, Kontaktziele, mobile Überläufe, WCAG-A/AA-Regeln mit axe, Darstellung ohne JavaScript sowie alte und entfernte URLs. Ein automatisierter Accessibility-Check ersetzt keine vollständige manuelle Prüfung.

## GitHub Pages

Die leere `.nojekyll`-Datei aktiviert die direkte Auslieferung der statischen Dateien. Die bestehende Veröffentlichung aus dem Root-Verzeichnis des Veröffentlichungsbranches kann weiterverwendet werden. [GitHub-Dokumentation](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site).

`/about/`, `/highlights/`, `/partners/` und `/calendar/` leiten zum passenden Tab weiter. Entfernte Blog- und Galerie-URLs erhalten die neue `404.html` mit Link zur Startseite. `sitemap.xml` enthält die kanonische Hauptseite.

Arbeitsbranch: `redesign/onepager`. Der Entwurf ist lokal; vor dem Veröffentlichen Gestaltung, Texte und Bilder mit Leana abstimmen. Push/Merge auf den aktiven Pages-Branch kann die Live-Seite aktualisieren.

## Saisonkalender

Unter Highlights & Goals stehen fünf belegte Rennen aus 2026 sowie Nizza, Cascais und Western Australia. Bereits vorliegende Resultate bleiben manuell gepflegt. Der Browser vergleicht das heutige Datum mit dem Renndatum in der Zeitzone des Veranstaltungsorts. Erst am Folgetag wird der Termin mit einem Häkchen markiert; Namen und Daten werden nicht durchgestrichen. Ein Datum allein erzeugt kein Resultat; in diesem Fall lautet der Status «Vergangen» / «Past date». Aktualisierung beim Laden, nach Sprachwechsel, beim Zurückkehren zur Seite und minütlich für offen gelassene Seiten. Ohne JavaScript bleiben die im HTML dokumentierten Resultate und geplanten Termine lesbar.

Quellen, geprüft am 07.09.2026:

- Bisherige Rennen 2026 und Cascais-Podium vom 19.10.2024 (3. Rang, 4:16:28): [PTO](https://stats.protriathletes.org/athlete/leana-bissig).
- Nizza, Frauenrennen am 12.09.2026: [IRONMAN Pro Series](https://www.ironman.com/proseries) und [offizielle Terminbestätigung](https://www.ironman.com/sites/default/files/2025-06/2026%20IM%2070.3%20Qualifier%20Letter%20-%20NICE.pdf).
- Cascais 70.3 am 17.10.2026: [Veranstalter-Registrierung](https://regprt.ironman.com/event/2026-ironman-703-portugal-cascais).
- Ironman Western Australia am 06.12.2026: [offizieller Veranstaltungsplan](https://www.ironman.com/races/im-western-australia/schedule).

Die drei kommenden Starts wurden von Leana als Saisonplanung genannt. Organisationsdaten können sich ändern und müssen bei Terminänderungen im HTML angepasst werden. Die Datumsautomatik fragt keine externen Renndaten ab.

Die Saisonliste zeigt heutige und zukünftige Rennen mit dem nächsten Termin zuerst, danach vergangene Rennen nach Datum absteigend. Die Reihenfolge wird zusammen mit den Häkchen nach dem lokalen Renntag automatisch aktualisiert.
