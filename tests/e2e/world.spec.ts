import { test, expect } from "@playwright/test";

test("country collection opens only that country and survives reload", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .locator(".desktop-nav")
    .getByRole("button", { name: "Dünyanı kəşf et" })
    .click();
  await expect(page.locator("#world")).toBeVisible();
  await expect(page.locator(".world-countries button")).toHaveCount(5);
  await page
    .locator(".world-countries")
    .getByRole("button", { name: "Türkiyə", exact: true })
    .click();
  await expect(page).toHaveURL(/#\/country\/TR$/);
  await expect(page.locator(".stay-card")).toHaveCount(4);
  await expect(page.locator(".listings-section h2")).toContainText("Türkiyə");
  await expect(page.locator(".stay-meta").first()).toContainText("Türkiyə");
  await page.reload();
  await expect(page.locator(".stay-card")).toHaveCount(4);
  await page
    .getByRole("combobox", { name: "Hara gedirik?" })
    .selectOption("Kaş");
  await page.getByRole("button", { name: "Axtar", exact: true }).click();
  await expect(page.locator(".stay-card")).toHaveCount(1);
  await page
    .locator(".country-result-tabs")
    .getByRole("button", { name: "Yaponiya", exact: true })
    .click();
  await expect(page.locator(".stay-card")).toHaveCount(4);
  await expect(page.locator(".listings-section h2")).toContainText("Yaponiya");
});

test("globe card navigation, country CTA and rotation control work", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const globe = page.locator('[data-slot="testimonial-globe"]');
  await globe.scrollIntoViewIfNeeded();
  await expect(globe.locator("[data-quote-card]")).toContainText("Azərbaycan");
  await page.getByRole("button", { name: "Fırlanmanı dayandır" }).click();
  await expect(
    page.getByRole("button", { name: "Fırlanmanı başlat" }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Növbəti ölkə", exact: true }).click();
  await expect(globe.locator("[data-quote-card]")).toContainText("Türkiyə");
  await globe
    .locator("[data-quote-card]")
    .getByRole("button", { name: "Bu ölkənin evlərinə bax" })
    .click();
  await expect(page).toHaveURL(/#\/country\/TR$/);
  await page.locator(".stay-title").first().click();
  await expect(page.locator(".detail-heading h1")).toContainText("Boğaz");
  await expect(page.locator(".booking-panel")).toBeVisible();
});

test("foreign favorites and comparisons include international properties", async ({
  page,
}) => {
  await page.goto("/#/country/US");
  await expect(page.locator(".stay-card")).toHaveCount(4);
  await page
    .locator(".stay-card")
    .first()
    .getByRole("button", { name: /Seçilmişlər:/ })
    .click();
  await page.locator(".stay-card").first().hover();
  await page
    .locator(".stay-card")
    .first()
    .getByRole("button", { name: /Müqayisə:/ })
    .click();
  await page
    .locator(".desktop-nav")
    .getByRole("link", { name: /Seçilmişlər/ })
    .click();
  await expect(page.locator(".stay-card")).toHaveCount(1);
  await expect(page.locator(".stay-meta")).toContainText("ABŞ");
  await page
    .locator(".compare-tray")
    .getByRole("button", { name: /Müqayisə/ })
    .click();
  await expect(page.locator(".extras-compare-home")).toHaveCount(1);
  await expect(page.locator(".extras-compare-home")).toContainText("Bruklində");
});

test("countries remain accessible on mobile in English and Russian without overflow", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.getByRole("button", { name: "Dil seçimi" }).click();
  await page.getByRole("button", { name: "English", exact: true }).click();
  await page.locator("#world").scrollIntoViewIfNeeded();
  await expect(page.locator("#world h2")).toContainText("A big world");
  await page
    .locator(".world-countries")
    .getByRole("button", { name: "United States", exact: true })
    .click();
  await expect(page).toHaveURL(/#\/country\/US$/);
  await expect(page.locator(".stay-card")).toHaveCount(4);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.getByRole("button", { name: "Choose language" }).click();
  await page.getByRole("button", { name: "Русский", exact: true }).click();
  await expect(page.locator(".listings-section h2")).toContainText("США");
  await page
    .locator(".country-result-tabs")
    .getByRole("button", { name: "Италия", exact: true })
    .click();
  await expect(page.locator(".stay-card")).toHaveCount(4);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});
