import { test, expect } from '@playwright/test';

const TEST_USERNAME = process.env.TEST_USERNAME ?? 'demo_user';
const TEST_PASSWORD = process.env.TEST_PASSWORD ?? 'demo_password';

test.describe('Auth smoke tests', () => {
  test('sign up with unique username', async ({ page }) => {
    await page.goto('/');
    await page.click('#signin2');
    await page.locator('#signInModal').waitFor({ state: 'visible' });

    const username = `smoke_${Date.now()}`;
    await page.fill('#sign-username', username);
    await page.fill('#sign-password', 'TestPass123!');

    page.on('dialog', async (dialog) => {
      await dialog.accept();
    });
    await page.click('#signInModal button.btn-primary');
    await page.waitForEvent('dialog');
  });

  test('login with valid credentials', async ({ page }) => {
    await page.goto('/');
    await page.click('#login2');
    await page.locator('#logInModal').waitFor({ state: 'visible' });

    await page.fill('#loginusername', TEST_USERNAME);
    await page.fill('#loginpassword', TEST_PASSWORD);
    await page.click('#logInModal button.btn-primary');

    await expect(page.locator('#nameofuser')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('#nameofuser')).toContainText('Welcome');
  });

  test('login with invalid credentials shows alert', async ({ page }) => {
    await page.goto('/');
    await page.click('#login2');
    await page.locator('#logInModal').waitFor({ state: 'visible' });

    let dialogMessage = '';
    page.on('dialog', async (dialog) => {
      dialogMessage = dialog.message();
      await dialog.accept();
    });

    await page.fill('#loginusername', 'invalid_user_xyz');
    await page.fill('#loginpassword', 'wrong_password');
    await page.click('#logInModal button.btn-primary');
    await page.waitForEvent('dialog');

    expect(dialogMessage).toBeTruthy();
    await expect(page.locator('#logInModal')).toBeVisible();
  });

  test('logout after login', async ({ page }) => {
    await page.goto('/');
    await page.click('#login2');
    await page.locator('#logInModal').waitFor({ state: 'visible' });

    await page.fill('#loginusername', TEST_USERNAME);
    await page.fill('#loginpassword', TEST_PASSWORD);
    await page.click('#logInModal button.btn-primary');

    await expect(page.locator('#nameofuser')).toBeVisible({ timeout: 10000 });

    await page.click('#logout2');
    await expect(page.locator('#login2')).toBeVisible();
  });
});
