// Browser behaviour for both language pages. The pages are complete without it:
// this adds tabs, the photo strip, coin flips, live season checks and copying.
import { placeText } from "./places";
import { compareRaces, raceStatus } from "./season";

const lang = document.documentElement.lang === "en" ? "en" : "de";
const $ = <T extends Element>(selector: string) => document.querySelector<T>(selector)!;

// Season: check races off after their local race day and keep the next ones on top.
const seasonList = $<HTMLOListElement>(".season-list");
const seasonRaces = [...seasonList.querySelectorAll<HTMLLIElement>(".season-race")];
function updateSeason(now = new Date()) {
  const labels = seasonList.dataset;
  seasonRaces.forEach((race) => {
    const status = raceStatus(race.dataset.date!, race.dataset.timezone!, now);
    race.classList.toggle("is-past", status === "past");
    race.classList.toggle("is-today", status === "today");
    race.querySelector(".race-check")!.textContent = status === "past" ? "✓" : "○";
    const rank = race.dataset.result;
    race.querySelector(".race-state")!.textContent = rank
      ? placeText(Number(rank), lang)
      : labels[status]!;
  });
  const ordered = [...seasonRaces].sort((a, b) =>
    compareRaces(
      { date: a.dataset.date!, past: a.classList.contains("is-past") },
      { date: b.dataset.date!, past: b.classList.contains("is-past") },
    ),
  );
  ordered.forEach((race, index) => {
    if (seasonList.children[index] !== race) seasonList.insertBefore(race, seasonList.children[index]!);
  });
}
updateSeason();
setInterval(updateSeason, 60000);
addEventListener("pageshow", () => updateSeason());
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) updateSeason();
});

// Tabs: one panel at a time, kept in ?tab= so links and history work.
const tabs = [...document.querySelectorAll<HTMLAnchorElement>("[data-tab]")];
const panels = [...document.querySelectorAll<HTMLElement>(".panel")];
const languageLinks = [...document.querySelectorAll<HTMLAnchorElement>("[data-language]")];
const aliases: Record<string, string> = { about: "story", results: "highlights", partners: "support" };
let activeTab = "story";
const validTab = (value: string | null) => {
  const key = (value && aliases[value]) || value;
  return tabs.some((tab) => tab.dataset.tab === key) ? key : null;
};
function updateUrl(push = false) {
  const url = new URL(location.href);
  url.searchParams.set("tab", activeTab);
  if (validTab(url.hash.slice(1))) url.hash = "content";
  if (url.href !== location.href) history[push ? "pushState" : "replaceState"]({}, "", url);
}
function selectTab(next: string | null, focus = false) {
  activeTab = validTab(next) || "story";
  tabs.forEach((tab) => {
    const selected = tab.dataset.tab === activeTab;
    tab.setAttribute("aria-selected", String(selected));
    tab.tabIndex = selected ? 0 : -1;
    if (selected && focus) tab.focus({ preventScroll: true });
  });
  panels.forEach((panel) => {
    panel.hidden = panel.id !== activeTab;
  });
  // The other language opens on the same tab.
  languageLinks.forEach((link) => {
    const url = new URL(link.href);
    url.searchParams.set("tab", activeTab);
    link.href = url.href;
  });
}
$(".tabs").setAttribute("role", "tablist");
tabs.forEach((tab) => {
  tab.setAttribute("role", "tab");
  tab.setAttribute("aria-controls", tab.dataset.tab!);
  tab.addEventListener("click", (event) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    selectTab(tab.dataset.tab!);
    updateUrl(true);
  });
  tab.addEventListener("keydown", (event) => {
    let index = tabs.indexOf(tab);
    if (event.key === "ArrowRight") index = (index + 1) % tabs.length;
    else if (event.key === "ArrowLeft") index = (index + tabs.length - 1) % tabs.length;
    else if (event.key === "Home") index = 0;
    else if (event.key === "End") index = tabs.length - 1;
    else if (event.key !== " ") return;
    event.preventDefault();
    selectTab(tabs[index]!.dataset.tab!, true);
    updateUrl(true);
  });
});
panels.forEach((panel) => {
  panel.setAttribute("role", "tabpanel");
  panel.setAttribute("aria-labelledby", `tab-${panel.id}`);
  panel.tabIndex = 0;
});
function restoreFromUrl() {
  const params = new URLSearchParams(location.search);
  selectTab(validTab(location.hash.slice(1)) || validTab(params.get("tab")) || "story");
}
addEventListener("popstate", restoreFromUrl);
addEventListener("hashchange", restoreFromUrl);
restoreFromUrl();
// Remember the choice, so the home page opens in it next time.
languageLinks.forEach((link) =>
  link.addEventListener("click", () => {
    try {
      localStorage.setItem("leana-language", link.dataset.language!);
    } catch {
      /* Storage may be unavailable. */
    }
  }),
);

// Photo strip: native scrolling follows the finger and keeps vertical scrolling/pinch zoom.
const photoStrip = $<HTMLElement>(".hero-photos");
const photos = [...photoStrip.querySelectorAll<HTMLImageElement>(".hero-photo")];
const photoCount = $<HTMLElement>("#photo-count");
let photoIndex = 0;
function selectPhoto(index: number) {
  photoIndex = index;
  photos.forEach((photo, position) => {
    photo.setAttribute("aria-hidden", String(position !== photoIndex));
  });
  photoCount.textContent = `${String(photoIndex + 1).padStart(2, "0")} / ${String(photos.length).padStart(2, "0")}`;
}
photoStrip.classList.add("is-swipeable");
photoStrip.tabIndex = 0;
photos.forEach((photo) => {
  photo.hidden = false;
  photo.draggable = false;
});
selectPhoto(0);
photoStrip.addEventListener(
  "scroll",
  () => {
    const index = Math.max(
      0,
      Math.min(photos.length - 1, Math.round(photoStrip.scrollLeft / photoStrip.clientWidth)),
    );
    if (index !== photoIndex) selectPhoto(index);
  },
  { passive: true },
);
function changePhoto(step: number) {
  selectPhoto((photoIndex + step + photos.length) % photos.length);
  photoStrip.scrollTo({ left: photoIndex * photoStrip.clientWidth, behavior: "auto" });
}
photoStrip.addEventListener("keydown", (event) => {
  if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
  event.preventDefault();
  changePhoto(event.key === "ArrowRight" ? 1 : -1);
});
$("#previous-photo").addEventListener("click", () => changePhoto(-1));
$("#next-photo").addEventListener("click", () => changePhoto(1));
$<HTMLElement>(".photo-controls").hidden = false;

// Each tap spins a coin or the patch one and a half turns, so it lands on its other face.
document.querySelectorAll<HTMLButtonElement>(".coin").forEach((coin) => {
  // Thin metal discs stacked between the faces show a coin's edge mid-spin;
  // the woven patch is too thin for one.
  // Only parallel layers: a plane across the faces makes Chrome split them.
  const hasEdge = !coin.classList.contains("coin-patch");
  const inner = coin.querySelector(".coin-inner")!;
  for (let layer = 0; hasEdge && layer <= 16; layer += 1) {
    const edge = document.createElement("span");
    edge.className = "coin-edge";
    edge.style.setProperty("--layer", String(layer));
    inner.prepend(edge);
  }
  let turns = 0;
  coin.addEventListener("click", () => {
    turns += 1;
    coin.style.setProperty("--coin-turn", `${turns * 540}deg`);
    coin.setAttribute("aria-pressed", String(turns % 2 === 1));
  });
});
$<HTMLElement>(".coins-hint").hidden = false;

// Clipboard needs a secure context; without it the bio stays selectable text.
const copyBio = $<HTMLButtonElement>(".copy-bio");
if (navigator.clipboard) {
  const label = copyBio.textContent!;
  copyBio.hidden = false;
  copyBio.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText($("#press-bio-text").textContent!.trim());
    } catch {
      return;
    }
    copyBio.textContent = copyBio.dataset.copied!;
    setTimeout(() => {
      copyBio.textContent = label;
    }, 2000);
  });
}
$("#year").textContent = String(new Date().getFullYear());
