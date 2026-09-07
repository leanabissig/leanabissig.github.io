const { test, expect } = require("@playwright/test");
const AxeBuilder = require("@axe-core/playwright").default;

test("tabs, keyboard, deep links and browser history preserve the selected section", async ({
  page,
}) => {
  await page.goto("/?tab=story&lang=de");
  await expect(page.getByRole("tabpanel")).toHaveCount(1);
  await expect(page.locator("#story")).toBeVisible();
  await page.getByRole("tab", { name: "Highlights & Goals" }).click();
  await expect(page.locator("#highlights")).toBeVisible();
  await expect(page.locator("#story")).toBeHidden();
  await page
    .getByRole("tab", { name: "Highlights & Goals" })
    .press("ArrowRight");
  await expect(page.getByRole("tab", { name: "My Support" })).toBeFocused();
  await expect(page.locator("#support")).toBeVisible();
  await page.goBack();
  await expect(page.locator("#highlights")).toBeVisible();
  await page.reload();
  await expect(page.locator("#highlights")).toBeVisible();
  await page.getByRole("tab", { name: "Highlights & Goals" }).press("Home");
  await expect(page.locator("#story")).toBeVisible();
  await page.goto("/#support");
  await expect(page.locator("#support")).toBeVisible();
  await page.goto("/?tab=unknown&lang=xx");
  await expect(page.locator("#story")).toBeVisible();
});

test("language switches text and accessibility labels without losing the active tab", async ({
  page,
}) => {
  await page.goto("/?tab=highlights&lang=de");
  await page.getByRole("button", { name: "English", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.locator("#highlights")).toBeVisible();
  await expect(page.locator(".goal h3")).toHaveText("The goal: Kona.");
  await expect(page.locator(".place").last()).toHaveText("1st place");
  await expect(
    page.getByRole("button", { name: "Next photo", exact: true }),
  ).toBeVisible();
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await page.getByRole("button", { name: "Deutsch", exact: true }).click();
  await expect(page.locator(".goal h3")).toHaveText("Das Ziel: Kona.");
  await expect(page.locator(".place").last()).toHaveText("1. Rang");
});

test("photos load, wrap in both directions and contact links have real destinations", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/?lang=en");
  for (let i = 0; i < 4; i++) {
    const photo = page.locator(".hero-photo:visible");
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
  await expect(page.locator(".contact-button")).toHaveAttribute(
    "href",
    "mailto:contact@leanabissig.ch",
  );
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
  await expect(page.locator(".languages")).toBeHidden();
  await expect(page.locator(".photo-controls")).toBeHidden();
  await expect(page.locator(".contact-button")).toHaveAttribute(
    "href",
    "mailto:contact@leanabissig.ch",
  );
  await context.close();
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
  await page.clock.install({ time: new Date("2026-09-07T12:00:00Z") });
  await page.goto("/?tab=highlights&lang=de");
  await expect(page.locator(".season-race.is-past")).toHaveCount(5);
  const seasonDates = () => page.locator(".season-race").evaluateAll(
    (rows) => rows.map((row) => row.dataset.date),
  );
  expect(await seasonDates()).toEqual([
    "2026-09-12", "2026-10-17", "2026-12-06", "2026-08-30",
    "2026-07-26", "2026-07-05", "2026-06-21", "2026-04-19",
  ]);
  const nice = page.locator('.season-race[data-date="2026-09-12"]');
  await expect(nice.locator(".race-state")).toHaveText("Geplant");
  await page.clock.setSystemTime(new Date("2026-09-12T10:00:00Z"));
  await page.reload();
  await expect(nice).toHaveClass(/is-today/);
  await expect(nice).not.toHaveClass(/is-past/);
  await expect(nice.locator(".race-state")).toHaveText("Heute");
  await page.clock.setSystemTime(new Date("2026-09-12T21:59:30Z"));
  await page.reload();
  await expect(nice).not.toHaveClass(/is-past/);
  await page.clock.runFor(61000);
  await expect(nice).toHaveClass(/is-past/);
  await expect(nice.locator(".race-state")).toHaveText("Vergangen");
  expect(await seasonDates()).toEqual([
    "2026-10-17", "2026-12-06", "2026-09-12", "2026-08-30",
    "2026-07-26", "2026-07-05", "2026-06-21", "2026-04-19",
  ]);
  await page.getByRole("button", { name: "English", exact: true }).click();
  await expect(nice.locator(".race-state")).toHaveText("Past date");
  await expect(
    page.locator('.season-race[data-date="2026-08-30"] .race-state'),
  ).toHaveText("5th place");
  const australia = page.locator('.season-race[data-date="2026-12-06"]');
  await page.clock.setSystemTime(new Date("2026-12-06T15:59:00Z"));
  await page.reload();
  await expect(australia.locator(".race-state")).toHaveText("Today");
  await page.clock.setSystemTime(new Date("2026-12-06T16:00:00Z"));
  await page.reload();
  await expect(australia).toHaveClass(/is-past/);
  await expect(australia.locator(".race-state")).toHaveText("Past date");
  expect(await seasonDates()).toEqual([
    "2026-12-06", "2026-10-17", "2026-09-12", "2026-08-30",
    "2026-07-26", "2026-07-05", "2026-06-21", "2026-04-19",
  ]);
});
