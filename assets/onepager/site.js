/* Plain browser JavaScript. German content in index.html remains usable without JS. */
(() => {
  "use strict";
  const english = {
    skip: "Skip to content",
    previousPhoto: "Previous photo",
    nextPhoto: "Next photo",
    photosLabel: "Photos of Leana",
    photoAfterRace: "Leana laughing in conversation after a race",
    photoCycling: "Leana in team kit on her Canyon time-trial bike",
    photoBikePortrait: "Leana in team kit with her bike in the evening light",
    introText:
      "Professional middle- and long-distance triathlete. Driven by the joy of sport, curiosity about what comes next and the will to keep learning.",
    contact: "Contact",
    socialLinks: "Social media & contact",
    topics: "Explore",
    heroEyebrow: "Swiss professional triathlete",
    tabStory: "My Story",
    tabHighlights: "Highlights & Goals",
    tabSupport: "My Support",
    storyEyebrow: "My journey",
    storyHeading: "Step by step.\nAlways myself.",
    storyP1:
      "It all started in the water. I was a competitive swimmer as a child. But I wanted to run and try something new, too. At the end of August 2012, I went to my first triathlon training session.",
    storyP2:
      "The sport has stayed with me ever since. My path gradually led from short-course racing to longer distances. I wasn’t right at the front in my U23 years. But I kept going, kept learning and got better over the years. After several Swiss U20 and U23 championship titles, I also won the elite Swiss sprint triathlon title in 2023 and raced at the highest level of short-course triathlon, the World Triathlon Championship Series (WTCS).",
    storyP3:
      "Alongside professional sport, I work 50% as a business analyst. After studying at ETH Zurich, I still value that different perspective. When there’s time: cooking, documentaries and podcasts.",
    portraitAlt: "Leana smiling in a green sports shirt in the evening sun",
    sinceLabel: "In triathlon since",
    homeLabel: "At home in",
    driveLabel: "What drives me",
    driveValue: "To bring out the best in myself.",
    highlightsEyebrow: "Highlights & what’s next",
    highlightsHeading: "A lot behind me.\nMore still ahead.",
    allResults: "All results on PTO",
    selectedResults: "Selected results",
    placeLabel: "place",
    middleDistance: "Middle distance",
    longDistance: "Long distance",
    seasonEyebrow: "Looking ahead",
    seasonHeading: "My 2026 season.",
    seasonLegend: "✓ Past dates",
    niceRace: "Ironman 70.3 World Championship · Nice",
    goalEyebrow: "Looking ahead · 2027",
    goalHeading: "The goal: Kona.",
    goalText:
      "I want to qualify for the Ironman World Championship in Kona. The history of this race and the challenge of long-distance triathlon motivate me to keep working on myself.",
    supportEyebrow: "The people beside me",
    supportHeading: "My own path.\nA shared journey.",
    supportIntro:
      "There are people and partners behind my sport who support my development. Thank you for your trust and support, in training as much as on race day.",
    teamLabel: "My team",
    teamText: "Training, growing and working towards our goals together.",
    personalPartner: "Personal partner",
    personalPartners: "My personal partners",
    runningLabel: "Running",
    sunLabel: "Sun protection",
    cyclingLabel: "Cycling",
    nutritionLabel: "Micronutrients",
    federationClub: "Federation & club",
    federationLabel: "My federation",
    clubLabel: "My club",
    sauconyText: "By my side on the run.",
    sensolarText: "Sun protection for my time outdoors.",
    teamPartners: "Support through the team",
    contactEyebrow: "Partnerships, press & conversations",
    contactHeading: "Let’s stay in touch.",
    writeMe: "Get in touch",
  };
  const textNodes = [...document.querySelectorAll("[data-i18n]")];
  const altNodes = [...document.querySelectorAll("[data-i18n-alt]")];
  const ariaNodes = [...document.querySelectorAll("[data-i18n-aria]")];
  const german = {};
  textNodes.forEach((node) => {
    german[node.dataset.i18n] = [...node.childNodes]
      .map((child) => (child.nodeName === "BR" ? "\u0000" : child.textContent))
      .join("")
      .split("\u0000")
      .map((line) => line.replace(/\s+/g, " ").trim())
      .join("\n");
  });
  altNodes.forEach((node) => {
    german[node.dataset.i18nAlt] = node.alt;
  });
  ariaNodes.forEach((node) => {
    german[node.dataset.i18nAria] = node.getAttribute("aria-label");
  });
  const descriptions = {
    de: document.querySelector('meta[name="description"]').content,
    en: "Leana Bissig – Swiss professional triathlete from Winterthur. My story, race highlights and the partners by my side.",
  };
  const ogDescriptions = {
    de: document.querySelector('meta[property="og:description"]').content,
    en: "Swim. Bike. Run. My story, my goals and my journey in middle- and long-distance triathlon.",
  };
  const tabs = [...document.querySelectorAll("[data-tab]")];
  const panels = [...document.querySelectorAll(".panel")];
  const aliases = {
    about: "story",
    results: "highlights",
    partners: "support",
  };
  let language = "de";
  let activeTab = "story";
  const seasonRaces = [...document.querySelectorAll(".season-race")];
  const raceDateFormatters = new Map();
  function updateSeason(now = new Date()) {
    const labels =
      language === "en"
        ? { planned: "Planned", today: "Today", past: "Past date" }
        : { planned: "Geplant", today: "Heute", past: "Vergangen" };
    seasonRaces.forEach((race) => {
      const zone = race.dataset.timezone;
      if (!raceDateFormatters.has(zone))
        raceDateFormatters.set(
          zone,
          new Intl.DateTimeFormat("en", {
            timeZone: zone,
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          }),
        );
      const parts = Object.fromEntries(
        raceDateFormatters
          .get(zone)
          .formatToParts(now)
          .map((part) => [part.type, part.value]),
      );
      const today = `${parts.year}-${parts.month}-${parts.day}`;
      const past = race.dataset.date < today;
      const isToday = race.dataset.date === today;
      race.classList.toggle("is-past", past);
      race.classList.toggle("is-today", isToday);
      race.querySelector(".race-check").textContent = past ? "✓" : "○";
      const rank = race.dataset.result;
      let state = past ? labels.past : isToday ? labels.today : labels.planned;
      if (rank)
        state =
          language === "en"
            ? `${rank}${{ 1: "st", 2: "nd", 3: "rd" }[rank] || "th"} place`
            : `${rank}. Rang`;
      race.querySelector(".race-state").textContent = state;
    });
    // Next races first; completed dates follow with the most recent at the top.
    const orderedRaces = [...seasonRaces].sort((a, b) => {
      const aPast = a.classList.contains("is-past");
      const bPast = b.classList.contains("is-past");
      if (aPast !== bPast) return aPast ? 1 : -1;
      return aPast
        ? b.dataset.date.localeCompare(a.dataset.date)
        : a.dataset.date.localeCompare(b.dataset.date);
    });
    orderedRaces.forEach((race, index) => {
      const list = race.parentElement;
      if (list.children[index] !== race)
        list.insertBefore(race, list.children[index]);
    });
  }
  const validTab = (value) => {
    const key = aliases[value] || value;
    return tabs.some((tab) => tab.dataset.tab === key) ? key : null;
  };
  function updateUrl(push = false) {
    const url = new URL(location.href);
    url.searchParams.set("tab", activeTab);
    url.searchParams.set("lang", language);
    if (validTab(url.hash.slice(1))) url.hash = "content";
    if (url.href !== location.href)
      history[push ? "pushState" : "replaceState"]({}, "", url);
  }
  function applyLanguage(next) {
    language = next === "en" ? "en" : "de";
    const dictionary = language === "en" ? english : german;
    textNodes.forEach((node) => {
      const value = dictionary[node.dataset.i18n] ?? german[node.dataset.i18n];
      const children = [];
      value.split("\n").forEach((line, index) => {
        if (index) children.push(document.createElement("br"));
        children.push(document.createTextNode(line));
      });
      node.replaceChildren(...children);
    });
    altNodes.forEach((node) => {
      node.alt = dictionary[node.dataset.i18nAlt];
    });
    ariaNodes.forEach((node) => {
      node.setAttribute("aria-label", dictionary[node.dataset.i18nAria]);
    });
    document.querySelectorAll(".place").forEach((place) => {
      const rank = place.dataset.rank;
      place.querySelector(".place-ordinal").textContent =
        language === "en" ? { 1: "st", 2: "nd", 3: "rd" }[rank] || "th" : ".";
    });
    document.documentElement.lang = language;
    document
      .querySelectorAll("[data-language]")
      .forEach((button) =>
        button.setAttribute(
          "aria-pressed",
          String(button.dataset.language === language),
        ),
      );
    document.querySelector('meta[name="description"]').content =
      descriptions[language];
    document.querySelector('meta[property="og:description"]').content =
      ogDescriptions[language];
    document.querySelector('meta[property="og:image:alt"]').content =
      dictionary.photoBikePortrait;
    updateSeason();
  }
  function selectTab(next, focus = false) {
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
  }
  document.querySelector(".tabs").setAttribute("role", "tablist");
  tabs.forEach((tab) => {
    tab.setAttribute("role", "tab");
    tab.setAttribute("aria-controls", tab.dataset.tab);
    tab.addEventListener("click", (event) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
        return;
      event.preventDefault();
      selectTab(tab.dataset.tab);
      updateUrl(true);
    });
    tab.addEventListener("keydown", (event) => {
      let index = tabs.indexOf(tab);
      if (event.key === "ArrowRight") index = (index + 1) % tabs.length;
      else if (event.key === "ArrowLeft")
        index = (index + tabs.length - 1) % tabs.length;
      else if (event.key === "Home") index = 0;
      else if (event.key === "End") index = tabs.length - 1;
      else if (event.key !== " ") return;
      event.preventDefault();
      selectTab(tabs[index].dataset.tab, true);
      updateUrl(true);
    });
  });
  panels.forEach((panel) => {
    panel.setAttribute("role", "tabpanel");
    panel.setAttribute("aria-labelledby", `tab-${panel.id}`);
    panel.tabIndex = 0;
  });
  document.querySelectorAll("[data-language]").forEach((button) =>
    button.addEventListener("click", () => {
      applyLanguage(button.dataset.language);
      try {
        localStorage.setItem("leana-language", language);
      } catch {
        /* Storage may be unavailable. */
      }
      updateUrl();
    }),
  );
  function restoreFromUrl() {
    const params = new URLSearchParams(location.search);
    let savedLanguage;
    try {
      savedLanguage = localStorage.getItem("leana-language");
    } catch {
      /* Default below. */
    }
    applyLanguage(params.get("lang") || savedLanguage || "de");
    selectTab(
      validTab(location.hash.slice(1)) ||
        validTab(params.get("tab")) ||
        "story",
    );
  }
  addEventListener("popstate", restoreFromUrl);
  addEventListener("hashchange", restoreFromUrl);
  restoreFromUrl();
  setInterval(updateSeason, 60000);
  addEventListener("pageshow", () => updateSeason());
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) updateSeason();
  });
  document.querySelector(".languages").hidden = false;
  const photoStrip = document.querySelector(".hero-photos");
  const photos = [...photoStrip.querySelectorAll(".hero-photo")];
  const photoCount = document.querySelector("#photo-count");
  let photoIndex = 0;
  function selectPhoto(index) {
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
  // Native scrolling follows the finger and keeps vertical scrolling/pinch zoom.
  photoStrip.addEventListener(
    "scroll",
    () => {
      const index = Math.max(
        0,
        Math.min(
          photos.length - 1,
          Math.round(photoStrip.scrollLeft / photoStrip.clientWidth),
        ),
      );
      if (index !== photoIndex) selectPhoto(index);
    },
    { passive: true },
  );
  function changePhoto(step) {
    selectPhoto((photoIndex + step + photos.length) % photos.length);
    photoStrip.scrollTo({
      left: photoIndex * photoStrip.clientWidth,
      behavior: "auto",
    });
  }
  photoStrip.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    changePhoto(event.key === "ArrowRight" ? 1 : -1);
  });
  document
    .querySelector("#previous-photo")
    .addEventListener("click", () => changePhoto(-1));
  document
    .querySelector("#next-photo")
    .addEventListener("click", () => changePhoto(1));
  document.querySelector(".photo-controls").hidden = false;
  document.querySelector("#year").textContent = new Date().getFullYear();
})();
