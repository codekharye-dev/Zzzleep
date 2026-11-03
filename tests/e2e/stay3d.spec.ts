import { test, expect } from "@playwright/test";

test("3D home opens lazily, floors and rooms work, and switching listings disposes the canvas", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/#/listing/model-gabala");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Meşə kənarında",
  );
  await expect(page.locator(".stay-tour canvas")).toHaveCount(0);
  await page.getByRole("button", { name: "3D baxışı aç", exact: true }).click();
  await expect(page.locator(".stay-tour canvas")).toBeVisible({
    timeout: 20000,
  });
  await expect(page.locator(".stay-tour [role=alert]")).toHaveCount(0);
  await page
    .getByRole("combobox", { name: "Mərtəbə", exact: true })
    .selectOption("1");
  const rooms = page.getByRole("combobox", { name: "Otaq", exact: true });
  const roomId = await rooms.locator("option").nth(1).getAttribute("value");
  await rooms.selectOption(roomId!);
  await page.getByRole("button", { name: "Baxış 2", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Baxış 2", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await page
    .getByRole("button", { name: "Avtomatik fırlatma", exact: true })
    .click();
  await page.getByRole("button", { name: "Bütöv ev", exact: true }).click();
  await expect(rooms).toHaveValue("");
  await page
    .getByRole("button", { name: "3D baxışı bağla", exact: true })
    .click();
  await expect(page.locator(".stay-tour canvas")).toHaveCount(0);
  await page.goto("/#/listing/gabala-01");
  await expect(page.locator(".detail-gallery")).toBeVisible();
  await expect(page.locator(".stay-tour")).toHaveCount(0);
  expect(errors).toEqual([]);
});

test("3D tour fits mobile and translates controls", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.addInitScript(() =>
    localStorage.setItem("zzzlep-language", JSON.stringify("en")),
  );
  await page.goto("/#/listing/model-baku");
  await page.getByRole("button", { name: "Open 3D tour", exact: true }).click();
  await expect(page.locator(".stay-tour canvas")).toBeVisible({
    timeout: 20000,
  });
  await expect(
    page.getByRole("combobox", { name: "Floor", exact: true }),
  ).toBeVisible();
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  );
  expect(overflow).toBe(false);
});
