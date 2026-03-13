import { test, expect } from '@playwright/test';

test.describe('Product page smoke tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.card-title');
    await page.locator('#tbodyid .card-title a').first().click();
    await page.waitForURL('**/prod.html**');
  });

  test('product name is visible', async ({ page }) => {
    await expect(page.locator('h2.name')).toBeVisible();
  });

  test('price is visible', async ({ page }) => {
    await expect(page.locator('h3.price-container')).toBeVisible();
  });

  test('Add to cart button is visible', async ({ page }) => {
    await expect(page.locator('a.btn:has-text("Add to cart")')).toBeVisible();
  });

  test('Add to cart shows confirmation dialog', async ({ page }) => {
    let dialogMessage = '';
    page.on('dialog', async (dialog) => {
      dialogMessage = dialog.message();
      await dialog.accept();
    });
    await page.locator('a.btn:has-text("Add to cart")').click();
    await page.waitForEvent('dialog');
    expect(dialogMessage).toContain('Product added');
  });
});
