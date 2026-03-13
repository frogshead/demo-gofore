import { test, expect } from '@playwright/test';

test.describe('Seed', () => {
  test('seed', async ({ page }) => {
    // Navigate to the homepage and wait for the product grid to load.
    // The Generator and Healer agents use this as the baseline starting state.
    await page.goto('/');
    await page.waitForSelector('.card-title');
    await expect(page.locator('#tbodyid .card-title').first()).toBeVisible();
  });
});
