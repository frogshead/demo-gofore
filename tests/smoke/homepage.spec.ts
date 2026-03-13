import { test, expect } from '@playwright/test';

test.describe('Homepage smoke tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('navbar is visible with key links', async ({ page }) => {
    await expect(page.locator('.navbar-brand')).toBeVisible();
    await expect(page.locator('a[href="index.html"]').first()).toBeVisible();
    await expect(page.locator('#cartur')).toBeVisible();
    await expect(page.locator('#login2')).toBeVisible();
    await expect(page.locator('#signin2')).toBeVisible();
  });

  test('carousel renders', async ({ page }) => {
    await expect(page.locator('#carouselExampleIndicators')).toBeVisible();
  });

  test('product grid loads with cards', async ({ page }) => {
    await page.waitForSelector('.card-title');
    await expect(page.locator('#tbodyid .card-title').first()).toBeVisible();
  });

  test('footer is visible', async ({ page }) => {
    await expect(page.locator('footer')).toBeVisible();
  });
});
