import { test, expect } from '@playwright/test';

test.describe('Category filter smoke tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.card-title');
  });

  test('Phones category shows products', async ({ page }) => {
    await page.click('a:has-text("Phones")');
    await page.waitForSelector('.card-title');
    await expect(page.locator('#tbodyid .card-title').first()).toBeVisible();
  });

  test('Laptops category shows products', async ({ page }) => {
    await page.click('a:has-text("Laptops")');
    await page.waitForSelector('.card-title');
    await expect(page.locator('#tbodyid .card-title').first()).toBeVisible();
  });

  test('Monitors category shows products', async ({ page }) => {
    await page.click('a:has-text("Monitors")');
    await page.waitForSelector('.card-title');
    await expect(page.locator('#tbodyid .card-title').first()).toBeVisible();
  });
});
