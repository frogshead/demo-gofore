import { test, expect } from '@playwright/test';

test.describe('Cart page smoke tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/cart.html');
  });

  test('cart table headers are visible', async ({ page }) => {
    await expect(page.locator('text=Pic')).toBeVisible();
    await expect(page.locator('text=Title')).toBeVisible();
    await expect(page.locator('text=Price')).toBeVisible();
  });

  test('Place Order button is visible', async ({ page }) => {
    await expect(page.locator('button:has-text("Place Order")')).toBeVisible();
  });
});
