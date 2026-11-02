import { test, expect } from "@playwright/test";

test("different guests, real star values and critical-review filtering", async ({
  page,
}) => {
  await page.goto("/#/listing/quba-01");
  await page.locator(".reviews-section").scrollIntoViewIfNeeded();
  await expect(page.locator(".reviews-score>strong")).toContainText(/3[.,]17/);
  await expect(page.locator(".guest-review")).toHaveCount(4);
  const names = await page
    .locator(".guest-review-person strong")
    .allTextContents();
  expect(new Set(names).size).toBe(4);
  expect(names).not.toEqual(["Aysel", "Aysel", "Aysel", "Aysel"]);
  await page.getByRole("button", { name: /Bütün rəyləri göstər/ }).click();
  await expect(page.locator(".guest-review")).toHaveCount(6);
  await expect(
    page.locator('.guest-review .review-stars[aria-label="2/5"]'),
  ).toHaveCount(1);
  await page
    .locator(".review-filters")
    .getByRole("button", { name: /İradlar/ })
    .click();
  await expect(page.locator(".guest-review")).toHaveCount(4);
  await page.getByRole("combobox", { name: "Ən yeni" }).selectOption("low");
  await expect(page.locator(".guest-review-rating").first()).toContainText("2");
  await page.goto("/#/listing/gabala-01");
  await expect(page.locator(".reviews-score>strong")).toContainText(/4[.,]83/);
  await expect(page.locator(".reviews-score")).toContainText("Əla");
});

test("zlpy summaries cite the visible evidence and explain rating limits", async ({
  page,
}) => {
  await page.goto("/#/listing/quba-01");
  await page.getByRole("button", { name: "Niyə bu xal?", exact: true }).click();
  await expect(page.locator(".zlpy-answer")).toContainText(/3[.,]17/);
  await expect(page.locator(".zlpy-answer")).toContainText("dəqiq neçə bal");
  const source = page.locator(".zlpy-sources button").first();
  const name = (await source.innerText()).split("\n")[0];
  await source.click();
  await expect(page.locator(".guest-review.is-highlighted")).toBeFocused();
  await expect(page.locator(".guest-review.is-highlighted")).toContainText(
    name,
  );
  await expect(page.locator(".guest-review")).toHaveCount(6);
  await page.locator(".zlpy-footer summary").click();
  await expect(page.locator(".zlpy-footer details")).toContainText(
    "Xarici AI modeli istifadə olunmur",
  );
  await page.locator(".zlpy-input input").fill("Wi-Fi necədir?");
  await page.getByRole("button", { name: "Sualı göndər" }).click();
  await expect(page.locator(".zlpy-answer")).toContainText("Wi-Fi");
  await page.locator(".zlpy-input input").fill("Marsda hava necədir?");
  await page.getByRole("button", { name: "Sualı göndər" }).click();
  await expect(page.locator(".zlpy-answer")).toContainText(
    "Yalnız bu evin rəylərindəki",
  );
  await expect(page.locator(".zlpy-sources")).toHaveCount(0);
});

test("review assistant works in English/Russian and mobile dark mode", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#/listing/quba-01");
  await page.getByRole("button", { name: "Dil seçimi" }).click();
  await page.getByRole("button", { name: "English", exact: true }).click();
  await page.getByRole("button", { name: "Dark mode", exact: true }).click();
  await page
    .getByRole("button", { name: "Any concerns?", exact: true })
    .click();
  await expect(page.locator(".zlpy-answer")).toContainText(
    "Topics with concerns",
  );
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.getByRole("button", { name: "Choose language" }).click();
  await page.getByRole("button", { name: "Русский", exact: true }).click();
  await expect(page.locator(".zlpy-answer")).toContainText(
    "Темы с замечаниями",
  );
  await expect(page.locator(".reviews-heading h2")).toContainText("Глазами");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test("guest favorite badges are earned from the displayed review score", async ({
  page,
}) => {
  await page.goto("/");
  const scores = await page.locator(".stay-rating").allTextContents();
  expect(scores.some((score) => Number(score.trim()) < 4)).toBe(true);
  expect(scores.some((score) => Number(score.trim()) >= 4.7)).toBe(true);
  for (const card of await page.locator(".stay-card").all()) {
    const score = Number(
      (await card.locator(".stay-rating").innerText()).trim(),
    );
    await expect(card.locator(".guest-favorite")).toHaveCount(
      score >= 4.7 ? 1 : 0,
    );
  }
});
