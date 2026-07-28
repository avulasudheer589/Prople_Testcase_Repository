// @ts-check
require('dotenv').config();   // ← loads .env so AMIKOO_KEY reaches the reporter

const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 60000,              // 60s per test — login + SPA render takes time
  fullyParallel: false,        // run sequentially – avoids session conflicts
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : 1,
  reporter: [
    ['@muuktest/amikoo-reporter'],
    ['html', { open: 'never' }],
  ],
  use: {
    baseURL: process.env.BASE_URL || 'https://app.prople.pro',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'on',              // ← must be 'on' for Amikoo reporter (not retain-on-failure)
    headless: true,
    viewport: { width: 1280, height: 720 },
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
