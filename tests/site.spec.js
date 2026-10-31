import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("tabs, keyboard, deep links and browser history preserve the selected section", async ({
  page,
}) => {
  await page.goto("/?tab=story&lang=de");
  await expect(page.getByRole("tabpanel")).toHaveCount(1);
  await expect(page.locator("#story")).toBeVisible();
  await page.getByRole("tab", { name: "Highlights & Ausblick" }).click();
  await expect(page.locator("#highlights")).toBeVisible();
  await expect(page.locator("#story")).toBeHidden();
  await page
    .getByRole("tab", { name: "Highlights & Ausblick" })
    .press("ArrowRight");
  await expect(page.getByRole("tab", { name: "Meine Partner" })).toBeFocused();
  await expect(page.locator("#support")).toBeVisible();
  await page.goBack();
  await expect(page.locator("#highlights")).toBeVisible();
  await page.reload();
  await expect(page.locator("#highlights")).toBeVisible();
  await page.getByRole("tab", { name: "Highlights & Ausblick" }).press("Home");
  await expect(page.locator("#story")).toBeVisible();
  await page.goto("/#support");
  await expect(page.locator("#support")).toBeVisible();
  await page.goto("/?tab=unknown&lang=xx");
  await expect(page.locator("#story")).toBeVisible();
});

test("language links open the other page on the same tab", async ({ page }) => {
  await page.goto("/?tab=highlights");
  await expect(page.getByRole("link", { name: "Deutsch", exact: true })).toHaveAttribute(
    "aria-current",
    "page",
  );
  await page.getByRole("link", { name: "English", exact: true }).click();
  await expect(page).toHaveURL(/\/en\/\?tab=highlights$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByRole("link", { name: "English", exact: true })).toHaveAttribute(
    "aria-current",
    "page",
  );
  await expect(
    page.getByRole("tab", { name: "My Story", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("tab", { name: "Highlights & Goals", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("tab", { name: "My Support", exact: true }),
  ).toBeVisible();
  await expect(page.locator("#highlights")).toBeVisible();
  await expect(page.locator(".goal h3")).toHaveText("The goal: Kona.");
  await expect(page.locator(".place").last()).toHaveText("1st place");
  // Ranks past 20 keep a correct suffix in the showcase too: 23rd, not 23th.
  await expect(page.locator('.place[data-rank="23"]')).toHaveText("23rd place");
  await expect(page.locator(".result-tag")).toHaveText([
    "World Championship",
    "Long-distance debut",
    "T100 World Tour",
    "First international pro win",
  ]);
  await page.locator(".press-bio summary").click();
  await expect(page.locator("#press-bio-text")).toContainText(
    "master’s degree in Health Sciences and Technology",
  );
  await expect(page.locator(".copy-bio")).toHaveText("Copy text");
  await expect(
    page.getByRole("button", { name: "Next photo", exact: true }),
  ).toBeVisible();
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await page.getByRole("link", { name: "Deutsch", exact: true }).click();
  await expect(page).toHaveURL(/:8017\/\?tab=highlights$/);
  await expect(
    page.getByRole("tab", { name: "Mein Weg", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("tab", { name: "Highlights & Ausblick", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("tab", { name: "Meine Partner", exact: true }),
  ).toBeVisible();
  await expect(page.locator(".hero-copy > .eyebrow")).toHaveText(
    "Schweizer Profi-Triathletin",
  );
  await expect(page.locator(".goal h3")).toHaveText("Das Ziel: Kona.");
  await expect(page.locator(".place").last()).toHaveText("1. Rang");
  await expect(page.locator('.place[data-rank="23"]')).toHaveText("23. Rang");
  // Results show rank, race and distance only; finish times live on PTO.
  await expect(page.locator(".results")).not.toContainText(/\d:\d{2}:\d{2}/);
  // Pro Series is plain context text, not a label, so the four labels stay rare.
  const zell = page.locator(".result", { hasText: "Zell am See" });
  await expect(zell.locator("p")).toHaveText("Mitteldistanz · Ironman Pro Series");
  await expect(zell.locator(".result-tag")).toHaveCount(0);
  // Both Cascais podiums share a single row, so the race is listed once.
  const cascais = page.locator(".result", { hasText: "Cascais" });
  await expect(cascais).toHaveCount(1);
  await expect(cascais.locator(".place")).toHaveText("3. Rang");
  await expect(cascais.locator(".result-dates time")).toHaveText([
    "17.10.2026",
    "19.10.2024",
  ]);
  await expect(cascais.locator("p")).toHaveText(
    "Mitteldistanz · zweimal auf dem Podest",
  );
});

test("old ?lang= links and a stored choice lead to the matching page", async ({
  page,
}) => {
  await page.goto("/?lang=en&tab=support");
  await expect(page).toHaveURL(/\/en\/\?tab=support$/);
  await expect(page.locator("#support")).toBeVisible();
  await page.goto("/en/?lang=de");
  await expect(page).toHaveURL(/:8017\/$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "de");
  // Choosing English is remembered for the home page …
  await page.getByRole("link", { name: "English", exact: true }).click();
  await expect(page).toHaveURL(/\/en\/\?tab=story$/);
  await page.goto("/");
  await expect(page).toHaveURL(/\/en\/$/);
  // … but an explicit German link still wins, and choosing German sticks.
  await page.goto("/?lang=de");
  await expect(page.locator("html")).toHaveAttribute("lang", "de");
  await page.getByRole("link", { name: "Deutsch", exact: true }).click();
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("lang", "de");
  await expect(page).toHaveURL(/:8017\/$/);
});

test("photos load, wrap in both directions and contact links have real destinations", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/?lang=en");
  await expect(page).toHaveURL(/\/en\/$/);
  for (let i = 0; i < 4; i++) {
    const photo = page.locator('.hero-photo[aria-hidden="false"]');
    await expect(photo).toHaveCount(1);
    await expect
      .poll(() => photo.evaluate((img) => img.complete && img.naturalWidth > 0))
      .toBe(true);
    await page.getByRole("button", { name: "Next photo", exact: true }).click();
  }
  await page
    .getByRole("button", { name: "Previous photo", exact: true })
    .click();
  await expect(page.locator("#photo-count")).toHaveText("01 / 03");
  await page.locator(".hero-photos").focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.locator("#photo-count")).toHaveText("02 / 03");
  await page.keyboard.press("ArrowLeft");
  await expect(page.locator("#photo-count")).toHaveText("01 / 03");
  await expect(page.locator(".contact-button")).toHaveAttribute(
    "href",
    "mailto:contact@leanabissig.ch?subject=Partnerships%20%26%20press%20%C2%B7%20leanabissig.ch",
  );
  await expect(page.locator("footer a")).toHaveAttribute(
    "href",
    "mailto:contact@leanabissig.ch?subject=Contact%20%C2%B7%20leanabissig.ch",
  );
  await expect(page).toHaveTitle("Leana Bissig · Swiss Professional Triathlete");
  expect(errors).toEqual([]);
});

for (const width of [320, 390, 768, 1440]) {
  test(`all tabs fit at ${width}px with accessible controls`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/?lang=de");
    await page.evaluate(() => document.fonts.ready);
    for (const id of ["story", "highlights", "support"]) {
      await page.locator(`#tab-${id}`).click();
      await expect(page.locator(`#${id}`)).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      const audit = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();
      expect(
        audit.violations.map((v) => ({
          id: v.id,
          targets: v.nodes.map((n) => n.target),
        })),
      ).toEqual([]);
    }
  });
}

test("all content and contact remain available without JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:8017/");
  for (const id of ["story", "highlights", "support"])
    await expect(page.locator(`#${id}`)).toBeVisible();
  await expect(page.getByRole("link", { name: "English", exact: true })).toHaveAttribute(
    "href",
    "/en/",
  );
  await expect(page.locator(".photo-controls")).toBeHidden();
  await expect(page.locator(".contact-button")).toHaveAttribute(
    "href",
    "mailto:contact@leanabissig.ch?subject=Partnerschaft%20%26%20Medien%20%C2%B7%20leanabissig.ch",
  );
  await expect(page).toHaveTitle("Leana Bissig · Schweizer Profi-Triathletin");
  await page.locator(".press-bio summary").click();
  await expect(page.locator("#press-bio-text")).toContainText(
    "Master in Health Sciences and Technology",
  );
  await expect(page.locator(".copy-bio")).toBeHidden();
  // Coins still show their front; the tap hint only appears when tapping works.
  await expect(page.locator(".coin")).toHaveCount(3);
  await expect(page.locator(".coins-hint")).toBeHidden();
  // The English page is complete without JavaScript too.
  await page.goto("http://127.0.0.1:8017/en/");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page).toHaveTitle("Leana Bissig · Swiss Professional Triathlete");
  await expect(page.locator("#story h2")).toHaveText("Step by step.Always myself.");
  await expect(page.locator(".contact-button")).toHaveAttribute(
    "href",
    "mailto:contact@leanabissig.ch?subject=Partnerships%20%26%20press%20%C2%B7%20leanabissig.ch",
  );
  await expect(page.locator(".season-race").first().locator(".race-state")).not.toBeEmpty();
  await context.close();
});

test("both pages name each other for search engines and describe Leana in their language", async ({
  page,
  request,
}) => {
  for (const [path, lang, other] of [
    ["/", "de", "en"],
    ["/en/", "en", "de"],
  ]) {
    await page.goto(path);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      `https://leanabissig.ch${path}`,
    );
    await expect(page.locator(`link[rel="alternate"][hreflang="${other}"]`)).toHaveAttribute(
      "href",
      `https://leanabissig.ch${other === "en" ? "/en/" : "/"}`,
    );
    await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveAttribute(
      "href",
      "https://leanabissig.ch/",
    );
    const graph = JSON.parse(
      await page.locator('script[type="application/ld+json"]').textContent(),
    )["@graph"];
    const person = graph.find((node) => node["@type"] === "Person");
    const webPage = graph.find((node) => node["@type"] === "ProfilePage");
    expect(person.name).toBe("Leana Bissig");
    expect(person.jobTitle).toBe(lang === "en" ? "Professional triathlete" : "Profi-Triathletin");
    expect(person.sponsor.map((s) => s.name)).toEqual(["Saucony", "Sensolar"]);
    expect(person.memberOf.map((m) => m.name)).toEqual([
      "Pro Team Hotel Jakob",
      "Swiss Triathlon",
      "TG Hütten",
    ]);
    expect(person.award.length).toBeGreaterThan(0);
    expect(webPage.inLanguage).toBe(lang);
    expect(webPage.mainEntity["@id"]).toBe(person["@id"]);
  }
  const sitemap = await (await request.get("/sitemap.xml")).text();
  for (const url of ["https://leanabissig.ch/", "https://leanabissig.ch/en/"])
    expect(sitemap).toContain(`<loc>${url}</loc>`);
  expect(sitemap).toContain('hreflang="en" href="https://leanabissig.ch/en/"');
  expect(await (await request.get("/robots.txt")).text()).toContain(
    "https://leanabissig.ch/llms.txt",
  );
});

test("qualification coins flip between front and back on tap and keyboard", async ({
  page,
}) => {
  await page.goto("/?tab=highlights&lang=de");
  await expect(page.locator(".coins-hint")).toHaveText("Zum Drehen antippen");
  const nice = page.getByRole("button", {
    name: "Coin Nizza 2026 drehen",
    exact: true,
  });
  await expect(nice).toHaveAttribute("aria-pressed", "false");
  await nice.click();
  await expect(nice).toHaveAttribute("aria-pressed", "true");
  await nice.press("Enter");
  await expect(nice).toHaveAttribute("aria-pressed", "false");
  // Each tap is one and a half turns, so two taps land on the front again.
  await expect(nice).toHaveAttribute("style", /--coin-turn:\s*1080deg/);
  await page.getByRole("link", { name: "English", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Flip the Nice 2026 coin", exact: true }),
  ).toBeVisible();
  await expect(page.locator(".coins-hint")).toHaveText("Tap a coin to flip it");
  await expect(page.locator(".coin-item figcaption")).toHaveText([
    "T100Qatar 2025",
    "70.3Nice 2026",
    "70.3Chattanooga 2027",
  ]);
  // The patch flips onto its velcro back like a coin, but has no metal edge.
  const patch = page.getByRole("button", {
    name: "Flip the T100 Qatar 2025 patch",
    exact: true,
  });
  await patch.click();
  await expect(patch).toHaveAttribute("style", /--coin-turn:\s*540deg/);
  await expect(patch).toHaveAttribute("aria-pressed", "true");
  await expect(patch.locator(".coin-back img")).toHaveAttribute(
    "src",
    /patch-t100-qatar-2025-back\.webp$/,
  );
  await expect(patch.locator(".coin-edge")).toHaveCount(0);
});

test("llms.txt and llms-full.txt carry the page's races, results and bios", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator('link[rel="describedby"]').first()).toHaveAttribute(
    "href",
    "https://leanabissig.ch/llms.txt",
  );
  const summary = await (await page.request.get("/llms.txt")).text();
  const full = await (await page.request.get("/llms-full.txt")).text();
  const ordinal = (n) =>
    n % 100 >= 11 && n % 100 <= 13
      ? `${n}th`
      : `${n}${{ 1: "st", 2: "nd", 3: "rd" }[n % 10] ?? "th"}`;
  const seasonLines = summary.split("## Season")[1].split("\n## ")[0].split("\n");
  const races = await page
    .locator(".season-race")
    .evaluateAll((items) =>
      items.map((item) => ({ date: item.dataset.date, result: item.dataset.result })),
    );
  expect(races.length).toBeGreaterThan(0);
  for (const { date, result } of races) {
    const line = seasonLines.find((l) => l.startsWith(`- ${date} · `));
    expect(line, `llms.txt season line for ${date}`).toBeTruthy();
    if (result) expect(line).toContain(`· ${ordinal(Number(result))} place`);
    else expect(line).not.toContain(" place");
  }
  for (const date of await page
    .locator(".results time")
    .evaluateAll((times) => times.map((t) => t.dateTime)))
    expect(summary, `llms.txt result on ${date}`).toContain(date);
  // Both short bios word for word, and the full text of both pages.
  for (const path of ["/", "/en/"]) {
    await page.goto(path);
    const text = (selector) =>
      page.locator(selector).evaluateAll((els) => els.map((el) => el.textContent.trim()));
    const [bio] = await text("#press-bio-text");
    expect(summary).toContain(bio);
    for (const paragraph of await text("#story .story-copy > p:not(.eyebrow), .goal > p, .support-intro"))
      expect(full, path).toContain(paragraph);
  }
});

test("legacy section links redirect; blog and gallery are removed", async ({
  page,
  request,
}) => {
  for (const [route, tab] of [
    ["about", "story"],
    ["highlights", "highlights"],
    ["partners", "support"],
    ["calendar", "highlights"],
  ]) {
    await page.goto(`/${route}/`);
    await expect(page.locator(`#${tab}`)).toBeVisible();
    await expect(page).toHaveURL(new RegExp(`tab=${tab}`));
  }
  for (const route of ["/posts/", "/gallery/", "/_posts/", "/_pages/"])
    expect((await request.get(route)).status()).toBe(404);
  await page.goto("/404.html");
  await expect(page.getByRole("link", { name: /Back home/ })).toHaveAttribute(
    "href",
    "/",
  );
});

test("season dates check off only after the local race day and never invent results", async ({
  page,
}) => {
  await page.clock.install({ time: new Date("2026-10-28T12:00:00Z") });
  await page.goto("/?tab=highlights&lang=de");
  await expect(page.locator(".season-race.is-past")).toHaveCount(7);
  const seasonDates = () =>
    page
      .locator(".season-race")
      .evaluateAll((rows) => rows.map((row) => row.dataset.date));
  const pastOrder = [
    "2026-12-06",
    "2027-08-28",
    "2026-10-17",
    "2026-09-12",
    "2026-08-30",
    "2026-07-26",
    "2026-07-05",
    "2026-06-21",
    "2026-04-19",
  ];
  expect(await seasonDates()).toEqual(pastOrder);
  // Nice and Cascais carry recorded results, so they show the rank rather than a date status.
  const nice = page.locator('.season-race[data-date="2026-09-12"]');
  await expect(nice).toHaveClass(/is-past/);
  await expect(nice.locator(".race-state")).toHaveText("23. Rang");
  const cascais = page.locator('.season-race[data-date="2026-10-17"]');
  await expect(cascais).toHaveClass(/is-past/);
  await expect(cascais.locator(".race-state")).toHaveText("3. Rang");
  // Western Australia has no result yet: the date alone must never produce one.
  const australia = page.locator('.season-race[data-date="2026-12-06"]');
  await expect(australia).not.toHaveClass(/is-past/);
  await expect(australia.locator(".race-state")).toHaveText("Geplant");
  // The 2027 World Championship sits in the same list as the next upcoming race after 2026.
  const chattanooga = page.locator('.season-race[data-date="2027-08-28"]');
  await expect(chattanooga.locator(".race-name")).toHaveText(
    "Ironman 70.3 WM · Chattanooga",
  );
  await expect(chattanooga.locator(".race-state")).toHaveText("Geplant");
  await page.clock.setSystemTime(new Date("2026-12-06T02:00:00Z"));
  await page.reload();
  await expect(australia).toHaveClass(/is-today/);
  await expect(australia).not.toHaveClass(/is-past/);
  await expect(australia.locator(".race-state")).toHaveText("Heute");
  await page.clock.setSystemTime(new Date("2026-12-06T15:59:30Z"));
  await page.reload();
  await expect(australia).not.toHaveClass(/is-past/);
  await page.clock.runFor(61000);
  await expect(australia).toHaveClass(/is-past/);
  await expect(australia.locator(".race-state")).toHaveText("Vergangen");
  // Once Western Australia is done, Chattanooga leads as the next race.
  expect(await seasonDates()).toEqual([
    "2027-08-28",
    "2026-12-06",
    ...pastOrder.slice(2),
  ]);
  await page.getByRole("link", { name: "English", exact: true }).click();
  await expect(page).toHaveURL(/\/en\//);
  await expect(australia.locator(".race-state")).toHaveText("Past date");
  await expect(chattanooga.locator(".race-state")).toHaveText("Planned");
  await expect(
    page.locator('.season-race[data-date="2026-08-30"] .race-state'),
  ).toHaveText("5th place");
  await expect(cascais.locator(".race-state")).toHaveText("3rd place");
  // Ranks past 20 keep a correct suffix: 23rd, not 23th.
  await expect(nice.locator(".race-state")).toHaveText("23rd place");
});

test("touch swipes change photos while vertical gestures scroll the page", async ({
  browser,
}) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:8017/?lang=de");
  const strip = page.locator(".hero-photos");
  await strip.scrollIntoViewIfNeeded();
  const session = await context.newCDPSession(page);
  async function swipe(dx, dy) {
    const box = await strip.boundingBox();
    const x = box.x + box.width * (dx < 0 ? 0.85 : dx > 0 ? 0.15 : 0.5);
    const y = Math.max(180, Math.min(650, box.y + box.height / 2));
    await session.send("Input.dispatchTouchEvent", {
      type: "touchStart",
      touchPoints: [{ x, y }],
    });
    for (let step = 1; step <= 12; step++) {
      await session.send("Input.dispatchTouchEvent", {
        type: "touchMove",
        touchPoints: [{ x: x + (dx * step) / 12, y: y + (dy * step) / 12 }],
      });
      await page.waitForTimeout(20);
    }
    await session.send("Input.dispatchTouchEvent", {
      type: "touchEnd",
      touchPoints: [],
    });
  }
  async function expectPhoto(index) {
    await expect(page.locator("#photo-count")).toHaveText(`0${index + 1} / 03`);
    await expect
      .poll(() =>
        strip.evaluate((el) =>
          Math.abs(
            el.scrollLeft / el.clientWidth - Number(el.dataset.expectedIndex),
          ),
        ),
      )
      .toBeLessThan(0.02);
  }
  await strip.evaluate((el) => {
    el.dataset.expectedIndex = "1";
  });
  await swipe(-240, 0);
  await expectPhoto(1);
  await strip.evaluate((el) => {
    el.dataset.expectedIndex = "0";
  });
  await swipe(240, 0);
  await expectPhoto(0);
  await swipe(-15, 0);
  await expectPhoto(0);
  const before = await page.evaluate(() => scrollY);
  await swipe(0, -210);
  await expect
    .poll(() => page.evaluate(() => scrollY))
    .toBeGreaterThan(before + 80);
  await expect(page.locator("#photo-count")).toHaveText("01 / 03");
  await context.close();
});
