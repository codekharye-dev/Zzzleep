import { test, expect } from "@playwright/test";
test("admin login, listing creation, publication and profile UI", async ({
  page,
}) => {
  let loggedIn = false;
  let user = {
    id: "admin",
    email: "admin@example.com",
    name: "Admin",
    role: "admin",
  };
  const listings: Record<string, unknown>[] = [];
  await page.route("**/api/**", async (route) => {
    const request = route.request();
    const path = new URL(request.url()).pathname;
    let status = 200;
    let body: unknown = {};
    if (path === "/api/listings")
      body = { listings: listings.filter((l) => l.status === "published") };
    else if (path === "/api/auth/me") {
      status = loggedIn ? 200 : 401;
      body = loggedIn ? { user } : { error: "UNAUTHORIZED" };
    } else if (path === "/api/auth/login") {
      loggedIn = true;
      body = { user };
    } else if (path === "/api/admin/profile") {
      user = { ...user, ...request.postDataJSON() };
      body = { user };
    } else if (path === "/api/admin/listings" && request.method() === "POST") {
      const listing = {
        ...request.postDataJSON(),
        id: "stay-test",
        host: user.name,
        rating: 0,
        reviews: 0,
      };
      listings.push(listing);
      body = { listing };
      status = 201;
    } else if (path === "/api/admin/listings") body = { listings };
    await route.fulfill({
      status,
      contentType: "application/json",
      body: JSON.stringify(body),
    });
  });
  await page.goto("/#/admin");
  await page
    .getByRole("textbox", { name: "E-poçt", exact: true })
    .fill("admin@example.com");
  await page.getByLabel("Şifrə", { exact: true }).fill("test-password-123");
  await page.getByRole("button", { name: "Daxil ol", exact: true }).click();
  await page.getByRole("button", { name: "Yeni elan", exact: true }).click();
  for (const lang of ["AZ", "EN", "RU"]) {
    await page.getByLabel(`Başlıq · ${lang}`, { exact: true }).fill("New home");
    await page
      .getByLabel(`Təsvir · ${lang}`, { exact: true })
      .fill("A comfortable new stay.");
  }
  await page.getByLabel("Şəhər", { exact: true }).fill("Bakı");
  await page.getByLabel("Ərazi", { exact: true }).fill("Mərkəz");

  await page.getByRole("button", { name: "Elanı yayımla", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("Elan saxlanıldı");
  await expect(page.locator(".admin-row")).toHaveCount(1);
  await page.getByRole("button", { name: "Profilim", exact: true }).click();
  await page.getByLabel("Ad", { exact: true }).fill("New Admin");
  await page
    .getByRole("button", { name: "Profili saxla", exact: true })
    .click();
  await expect(page.getByRole("status")).toHaveText("Profil yeniləndi.");
  await page.goto("/#/listing/stay-test");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("New home");
  await expect(page.locator(".detail-gallery")).toBeVisible();
  await page.goto("/");
  await expect(page.locator(".stay-title").first()).toHaveText("New home");
});
