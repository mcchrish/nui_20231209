import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("Page title", async ({ page }) => {
  await expect(page).toHaveTitle(/Nui Coding Challenge/);
});
