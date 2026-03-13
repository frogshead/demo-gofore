import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html'], ['list']],
  use: {
    baseURL: process.env.BASE_URL ?? 'https://www.demoblaze.com',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
    trace: 'on-first-retry',
  },
  projects: [
    // Desktop browsers
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'edge',
      use: { ...devices['Desktop Edge'] },
    },

    // Mobile
    {
      name: 'mobile-chrome-pixel5',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'mobile-chrome-galaxy-s23',
      use: { ...devices['Galaxy S9+'] },
    },
    {
      name: 'mobile-safari-iphone14',
      use: { ...devices['iPhone 14'] },
    },
    {
      name: 'mobile-safari-iphone14-landscape',
      use: { ...devices['iPhone 14 landscape'] },
    },
    {
      name: 'tablet-ipad-pro',
      use: { ...devices['iPad Pro 11'] },
    },
    {
      name: 'tablet-ipad-pro-landscape',
      use: { ...devices['iPad Pro 11 landscape'] },
    },
  ],
});
