import { test, expect } from "@playwright/test";

test.describe("Design Skill — Jazan interior design studio", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("has RTL Arabic document and correct title", async ({ page }) => {
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await expect(page.locator("html")).toHaveAttribute("lang", "ar");
    await expect(page).toHaveTitle(/ديزاين سكِل/);
  });

  test("hero headline and CTAs are visible", async ({ page }) => {
    await expect(page.locator("#hero-title")).toBeVisible();
    await expect(page.getByRole("link", { name: "اطلب تصميمك" })).toBeVisible();
  });

  test("Google rating 4.5 is cited", async ({ page }) => {
    await expect(page.locator(".trust")).toContainText("4.5");
    await expect(page.locator(".trust")).toContainText("149");
  });

  test("all images reference existing files and have alt text", async ({ page }) => {
    const imgs = page.locator("img");
    const count = await imgs.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      const img = imgs.nth(i);
      await expect(img).toHaveAttribute("alt", /.+/);
      const ok = await img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0);
      expect(ok).toBeTruthy();
    }
  });

  test("JSON-LD InteriorDesigner with aggregateRating exists", async ({ page }) => {
    const ld = await page.locator('script[type="application/ld+json"]').textContent();
    expect(ld).toContain("InteriorDesigner");
    expect(ld).toContain("4.5");
    expect(ld).toContain("149");
  });

  test("no invented prices; uses حسب الطلب", async ({ page }) => {
    await expect(page.locator(".services-note")).toContainText("حسب الطلب");
  });

  test("services section lists all five services", async ({ page }) => {
    const cards = page.locator(".service-card h3");
    await expect(cards).toHaveCount(5);
  });
});

test.describe("Mobile menu (full-screen overlay)", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("opens full-screen and closes via X", async ({ page }) => {
    await page.goto("/");
    const burger = page.locator("#burger");
    await expect(burger).toBeVisible();
    await burger.click();

    const menu = page.locator("#mobile-menu");
    await expect(menu).toBeVisible();
    // Full-screen: width should match viewport
    const box = await menu.boundingBox();
    expect(box?.width).toBeGreaterThanOrEqual(389);

    await page.locator("#menu-close").click();
    await expect(menu).toBeHidden();
  });

  test("no horizontal scroll at 390px", async ({ page }) => {
    await page.goto("/");
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth
    );
    expect(overflow).toBeLessThanOrEqual(1);
  });
});

test.describe("Quote form", () => {
  test("shows validation errors when empty", async ({ page }) => {
    await page.goto("/");
    await page.locator("#quote-submit").click();
    await expect(page.locator('[data-err="name"]')).toHaveText(/اكتب اسمك/);
  });

  test("valid submit stores to localStorage and shows toast", async ({ page, context }) => {
    await context.grantPermissions([]);
    await page.goto("/");
    await page.fill("#f-name", "محمد العمري");
    await page.fill("#f-phone", "0551234567");
    await page.selectOption("#f-service", "تصميم داخلي");
    // prevent the new tab from actually opening
    await page.evaluate(() => { window.open = () => null; });
    await page.locator("#quote-submit").click();
    await expect(page.locator("#toast")).toBeVisible();
    const stored = await page.evaluate(() => localStorage.getItem("designskill_quotes"));
    expect(stored).toContain("محمد العمري");
  });
});
