import { expect, test } from "@playwright/test";

test.describe("FareScout basic product flow", () => {
  test("homepage loads and shows the main search UI", async ({ page }) => {
    await page.goto("/");

    await expect(page).toHaveTitle(/FareScout/i);
    await expect(page.getByRole("heading", { name: /find the fare worth catching/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /search fares/i })).toBeVisible();
  });

  test("user can see symmetric origin and destination pickers", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator("#origin-country")).toBeVisible();
    await expect(page.locator('select[name="origin"]')).toBeVisible();
    await expect(page.locator("#destination-country")).toBeVisible();
    await expect(page.locator('select[name="destination"]')).toBeVisible();
    await expect(page.locator('select[name="origin"]')).toHaveValue("WAW");
  });

  test("invalid same-airport search is blocked with validation", async ({ page }) => {
    await page.goto("/");

    await page.locator("#destination-country").selectOption("PL");
    await page.locator('select[name="destination"]').selectOption("WAW");
    await page.getByRole("button", { name: /search fares/i }).click();

    await expect(page.getByText(/origin and destination need to be different/i)).toBeVisible();
  });
});
