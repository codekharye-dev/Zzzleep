import { test, expect } from "@playwright/test";
const year = new Date().getFullYear() + 1;

test("experiences have their own navigation, filters and USD prices", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .locator(".desktop-nav")
    .getByRole("link", { name: "Təcrübələr", exact: true })
    .click();
  await expect(page).toHaveURL(/#\/experiences$/);
  await expect(page.locator(".experience-grid .experience-card")).toHaveCount(
    8,
  );
  await expect(page.locator(".experience-card-price")).toContainText([
    "$200",
    "$125",
    "$23",
    "$35",
    "$65",
    "$90",
    "$55",
    "$75",
  ]);
  await page.getByRole("combobox", { name: "Ölkə seç" }).selectOption("CN");
  await expect(page.locator(".experience-grid .experience-card")).toHaveCount(
    1,
  );
  await expect(page.locator(".experience-card-title")).toContainText(
    "Çin mətbəxi",
  );
  await page.reload();
  await expect(page.locator(".experience-card-title")).toContainText(
    "Çin mətbəxi",
  );
  await page.getByRole("combobox", { name: "Ölkə seç" }).selectOption("AZ");
  await expect(page.locator(".experience-grid .experience-card")).toHaveCount(
    2,
  );
  await page
    .locator(".experience-categories")
    .getByRole("button", { name: "Təbiət və macəra" })
    .click();
  await expect(page.locator(".experience-grid .experience-card")).toHaveCount(
    1,
  );
  await expect(page.locator(".experience-card-price")).toContainText("$23");
  await page.getByRole("slider", { name: "Maksimum qiymət" }).fill("20");
  await expect(page.locator(".experience-grid .experience-card")).toHaveCount(
    0,
  );
  await page
    .getByRole("button", { name: "Filtrləri sıfırla", exact: true })
    .click();
  await expect(page.locator(".experience-grid .experience-card")).toHaveCount(
    8,
  );
});

test("Chinese food conveyor opens accessible dishes and adds a tasting choice without changing price", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#/experience/beijing-wok");
  await expect(page.locator(".experience-plan-price")).toContainText("$200");
  const conveyor = page.locator('[data-slot="sushi-conveyor-menu"]');
  await expect(conveyor.locator("[data-dish]")).toHaveCount(4);
  const plate = conveyor.locator('[data-dish="0"]');
  await plate.scrollIntoViewIfNeeded();
  await plate.focus();
  await page.keyboard.press("Enter");
  const dialog = page.locator("[data-dish-dialog]");
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText("Dana ətli wok");
  await expect(dialog).toContainText("Buğda");
  await dialog
    .getByRole("button", { name: "Dadım planına əlavə et", exact: true })
    .click();
  await expect(dialog).toHaveCount(0);
  await expect(page.locator(".experience-picked-dish")).toHaveCount(1);
  await expect(page.locator(".experience-picked-dish")).toContainText(
    "Dana ətli wok",
  );
  await expect(page.locator(".experience-plan-total")).toContainText("$400");
  await plate.focus();
  await page.keyboard.press("Enter");
  await expect(dialog).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(plate).toBeFocused();
  await page.locator(".experience-picked-dish button").click();
  await expect(page.locator(".experience-picked-dish")).toHaveCount(0);
});

test("American menu is adapted and a demo activity plan validates and persists", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#/experience/new-york-flavors");
  await expect(page.locator(".experience-detail-heading h1")).toContainText(
    "Amerikanın dadları",
  );
  await page.locator('[data-dish="0"]').focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("[data-dish-dialog] h3")).toHaveText(
    "Klassik burger",
  );
  await page
    .locator("[data-dish-dialog]")
    .getByRole("button", { name: "Dadım planına əlavə et" })
    .click();
  await expect(page.locator("[data-dish-dialog]")).toHaveCount(0);
  await page
    .getByRole("textbox", { name: "Tarix", exact: true })
    .fill("2020-01-01");
  await page
    .getByRole("button", { name: "Sınaq planı yarat", exact: true })
    .click();
  await expect(page.getByRole("alert")).toContainText("keçmiş olmayan");
  await page
    .getByRole("textbox", { name: "Tarix", exact: true })
    .fill(`${year}-05-10`);
  await page
    .getByRole("spinbutton", { name: "İştirakçı sayı", exact: true })
    .fill("9");
  await page
    .getByRole("button", { name: "Sınaq planı yarat", exact: true })
    .click();
  await expect(page.getByRole("alert")).toContainText("qrupun tutumuna");
  await page
    .getByRole("spinbutton", { name: "İştirakçı sayı", exact: true })
    .fill("3");
  await page
    .getByRole("button", { name: "Sınaq planı yarat", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByRole("dialog")).toContainText("$375 USD");
  await expect(page.getByRole("dialog")).toContainText("Real fəaliyyət");
  const plans = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("zzzlep-experience-plans") || "[]"),
  );
  expect(plans).toHaveLength(1);
  expect(plans[0]).toMatchObject({
    experienceId: "new-york-flavors",
    currency: "USD",
    total: 375,
    people: 3,
    dishes: ["american-burger"],
    demo: true,
  });
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
});

test("Sheki concept and responsive EN/RU experiences keep existing stays intact", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/#/experience/sheki-cable");
  await expect(page.locator(".experience-detail-heading")).toContainText(
    "Konsept fəaliyyət",
  );
  await expect(page.locator(".experience-plan-price")).toContainText("$23");
  await expect(page.locator('[data-slot="sushi-conveyor-menu"]')).toHaveCount(
    0,
  );
  await expect(page.locator(".experience-story")).toContainText(
    "real kanat xətti",
  );
  await page.getByRole("button", { name: "Dil seçimi" }).click();
  await page.getByRole("button", { name: "English", exact: true }).click();
  await expect(page.locator(".experience-detail-heading h1")).toContainText(
    "cable-car concept",
  );
  await page.getByRole("button", { name: "Dark mode", exact: true }).click();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.getByRole("button", { name: "Choose language" }).click();
  await page.getByRole("button", { name: "Русский", exact: true }).click();
  await expect(page.locator(".experience-detail-heading h1")).toContainText(
    "Шеки",
  );
  await page
    .getByRole("button", { name: "К впечатлениям", exact: true })
    .click();
  await expect(page.locator(".experience-grid .experience-card")).toHaveCount(
    8,
  );
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.goto("/#/");
  await expect(page.locator(".stay-card")).toHaveCount(8);
});

test("experience page and food detail do not overflow at phone, tablet and desktop sizes", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [375, 768, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/#/experiences");
    await expect(page.locator(".experience-grid .experience-card")).toHaveCount(
      8,
    );
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.goto("/#/experience/beijing-wok");
    await expect(page.locator("[data-dish]")).toHaveCount(4);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
});
