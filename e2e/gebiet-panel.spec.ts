import { test, expect } from "@playwright/test";

// Wait for the app to finish loading the CSV data
async function waitForAppReady(page: import("@playwright/test").Page) {
  // The loading screen disappears once data is loaded
  await expect(page.getByText("Loading election results...")).not.toBeVisible({
    timeout: 30_000,
  });
}

test.describe("GebietPanel", () => {
  test.beforeEach(async ({ page }) => {
    // Clear storage so tests start from a clean default state
    await page.goto("/");
    await page.evaluate(() => localStorage.clear());
    await page.goto("/");
    await waitForAppReady(page);
  });

  test("shows exactly one GebietPanel on first load", async ({ page }) => {
    const panels = page.locator("[data-testid='gebiet-panel']");
    await expect(panels).toHaveCount(1);
  });

  test("single panel has no close button", async ({ page }) => {
    const closeButton = page.getByRole("button", { name: "close" });
    await expect(closeButton).not.toBeVisible();
  });

  test("clicking '+ Add Gebiet' adds a second panel with the default gebiet (Bundesgebiet)", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "+ Add Gebiet" }).click();

    const panels = page.locator("[data-testid='gebiet-panel']");
    await expect(panels).toHaveCount(2);

    // Both panels should display "Bundesgebiet" (the default key Bund:99)
    const gebietButtons = page.getByRole("combobox");
    await expect(gebietButtons).toHaveCount(2);
    await expect(gebietButtons.nth(1)).toContainText("Bundesgebiet");
  });
});
