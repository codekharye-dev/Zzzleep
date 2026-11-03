import { test, expect } from "@playwright/test";
const year = new Date().getFullYear() + 1;
const arrival = `${year}-05-10`;
const departure = `${year}-05-13`;
const invalidDeparture = `${year}-05-09`;

test("homepage, local assets, translations and persistent dark mode", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Bir az uzaqlaş.",
  );
  await expect(page.locator(".stay-card")).toHaveCount(8);
  await page.getByRole("button", { name: "Dil seçimi" }).click();
  await page.getByRole("button", { name: "English", exact: true }).click();
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "A little further away.",
  );
  await page.getByRole("button", { name: "Dark mode", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.getByRole("button", { name: "Choose language" }).click();
  await page.getByRole("button", { name: "Русский", exact: true }).click();
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Чуть дальше от суеты.",
  );
  await page.locator(".footer").scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  const broken = await page
    .locator("img")
    .evaluateAll((imgs) =>
      imgs
        .filter((i) => i.complete && !i.naturalWidth)
        .map((i) => i.getAttribute("src")),
    );
  expect(broken).toEqual([]);
  expect(errors).toEqual([]);
});

test("search combines city, capacity, category, price and amenities", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("combobox", { name: "Hara gedirik?" })
    .selectOption("Qəbələ");
  await page
    .getByRole("combobox", { name: "Qonaqlar", exact: true })
    .selectOption("4");
  await page.getByRole("button", { name: "Axtar", exact: true }).click();
  await expect(page).toHaveURL(/#\/search/);
  await expect(page.locator(".stay-card")).toHaveCount(4);
  await page.getByRole("button", { name: "Villalar", exact: true }).click();
  await expect(page.locator(".stay-card")).toHaveCount(1);
  await page.getByRole("button", { name: "Filtrlər", exact: true }).click();
  await page.getByRole("slider").fill("200");
  await page.getByRole("button", { name: /Nəticələri göstər/ }).click();
  await expect(page.locator(".stay-card")).toHaveCount(0);
  await expect(page.getByText("Hələlik burada sakitlikdir.")).toBeVisible();
  await page.getByRole("button", { name: "Bütün məkanları göstər" }).click();
  await expect(page.locator(".stay-card")).toHaveCount(8);
  await page.getByRole("button", { name: "Filtrlər", exact: true }).click();
  await page.getByRole("checkbox", { name: "Hovuz", exact: true }).check();
  await page.getByRole("button", { name: /Nəticələri göstər/ }).click();
  await expect(page.locator(".stay-card")).toHaveCount(6);
});

test("favorites persist and are not hidden by previous search filters", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .locator(".stay-card")
    .nth(2)
    .getByRole("button", { name: /Seçilmişlər:/ })
    .click();
  await page
    .getByRole("combobox", { name: "Hara gedirik?" })
    .selectOption("Bakı");
  await page.getByRole("button", { name: "Axtar", exact: true }).click();
  await page
    .locator(".desktop-nav")
    .getByRole("link", { name: /Seçilmişlər/ })
    .click();
  await expect(page.locator(".stay-card")).toHaveCount(1);
  await expect(page.locator(".stay-title")).toContainText(
    "Sakitliyin içində bağ evi",
  );
  await page.reload();
  await expect(page.locator(".stay-card")).toHaveCount(1);
  await page
    .locator(".stay-card")
    .getByRole("button", { name: /Seçilmişlər:/ })
    .click();
  await expect(page.getByText("İlk sevimli məkanını seç.")).toBeVisible();
});

test("compare enforces 3 properties and supports removal", async ({ page }) => {
  await page.goto("/");
  for (let i = 0; i < 4; i++) {
    await page.locator(".stay-card").nth(i).hover();
    await page
      .locator(".stay-card")
      .nth(i)
      .getByRole("button", { name: /Müqayisə:/ })
      .click();
  }
  await expect(page.getByRole("status")).toHaveText(
    "Ən çox 3 məkanı müqayisə edə bilərsiniz.",
  );
  await page
    .locator(".compare-tray")
    .getByRole("button", { name: /Müqayisə/ })
    .click();
  await expect(page.locator(".extras-compare-home")).toHaveCount(3);
  await page
    .locator(".extras-compare-home")
    .first()
    .getByRole("button", { name: /Müqayisədən çıxar/ })
    .click();
  await expect(page.locator(".extras-compare-home")).toHaveCount(2);
});

test("booking preserves search selections, validates dates and confirms a demo", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("textbox", { name: "Giriş tarixi", exact: true })
    .fill(arrival);
  await page
    .getByRole("textbox", { name: "Çıxış tarixi", exact: true })
    .fill(departure);
  await page
    .getByRole("combobox", { name: "Qonaqlar", exact: true })
    .selectOption("3");
  await page.getByRole("button", { name: "Axtar", exact: true }).click();
  await page.locator(".stay-title").first().click();
  await expect(page.locator(".booking-dates input").first()).toHaveValue(
    arrival,
  );
  await expect(page.locator(".booking-guests select")).toHaveValue("3");
  await expect(page.locator(".booking-total")).toContainText(/456[.,]75/);
  await page.locator(".detail-photo-0").click();
  await expect(page.locator(".gallery-modal")).toBeVisible();
  await page.keyboard.press("ArrowRight");
  await expect(page.locator(".gallery-count")).toContainText("2");
  await page.keyboard.press("Escape");
  await expect(page.locator(".gallery-modal")).toHaveCount(0);
  await page.locator(".booking-dates input").last().fill(invalidDeparture);
  await page
    .getByRole("button", { name: "Sınaq rezervasiyası", exact: true })
    .click();
  await expect(page.getByRole("alert")).toContainText("Çıxış tarixi");
  await page.locator(".booking-dates input").last().fill(departure);
  await page
    .getByRole("button", { name: "Sınaq rezervasiyası", exact: true })
    .click();
  await expect(page.locator(".booking-confirm")).toBeVisible();
  await expect(page.locator(".booking-confirm-demo")).toContainText(
    "Real ödəniş",
  );
  const bookings = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("zzzlep-bookings") || "[]"),
  );
  expect(bookings).toHaveLength(1);
  expect(bookings[0].total).toBe(456.75);
  expect(bookings[0].guests).toBe(3);
});

test("split calculator changes costs and rejects capacity/date errors", async ({
  page,
}) => {
  await page.goto("/#/split");
  await page.locator("#split-arrival").fill(arrival);
  await page.locator("#split-departure").fill(departure);
  await expect(page.locator(".extras-per-person")).toContainText(/114[.,]19/);
  await page.locator("#split-people").fill("2");
  await expect(page.locator(".extras-per-person")).toContainText(/228[.,]38/);
  await page.locator("#split-people").fill("9");
  await expect(page.getByRole("alert")).toContainText("Nəfər sayı");
  await page.locator("#split-people").fill("4");
  await page.locator("#split-departure").fill(invalidDeparture);
  await expect(page.getByRole("alert")).toContainText("Çıxış tarixi");
});

test("mobile, tablet and desktop do not overflow; shared modal manages keyboard focus", async ({
  page,
}) => {
  for (const width of [375, 768, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
  await page.getByRole("button", { name: "Filtrlər", exact: true }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Bağla", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(
    page.getByRole("button", { name: /Nəticələri göstər/ }),
  ).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Filtrlər", exact: true }),
  ).toBeFocused();
  await page.setViewportSize({ width: 375, height: 812 });
  await page.getByRole("button", { name: "Menyu", exact: true }).click();
  await page
    .locator(".mobile-menu")
    .getByRole("link", { name: "Dostlarla büdcə" })
    .click();
  await expect(page.locator(".extras-budget")).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});
