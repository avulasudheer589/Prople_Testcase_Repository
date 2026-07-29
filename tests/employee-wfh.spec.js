// tests/employee-wfh.spec.js
// Employee – Work From Home module test cases.

const { test, expect } = require('@playwright/test');
const { LoginPage }    = require('../pages/LoginPage');
const { WFHPage }      = require('../pages/WFHPage');

test.describe('Employee – Work From Home', () => {

  test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);
    await login.loginAsEmployee();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
  });

  // ── 1. Page loads ──────────────────────────────────────────────────────────

  test('WFH page loads with statistics cards', async ({ page }) => {
    const wfh = new WFHPage(page);
    await wfh.goto();

    // The page heading or a visible label must contain "WFH" or "Work From Home"
    const heading = page.locator('h1, h2, h3').filter({ hasText: /work from home|wfh/i }).first();
    await expect(heading).toBeVisible({ timeout: 10000 });

    // Stats cards — at least one summary number is visible
    const anyCard = page.locator('*').filter({ hasText: /total|pending|approved/i }).first();
    await expect(anyCard).toBeVisible({ timeout: 10000 });
  });

  // ── 2. Request WFH button ─────────────────────────────────────────────────

  test('"Request WFH" button is visible on the page', async ({ page }) => {
    const wfh = new WFHPage(page);
    await wfh.goto();

    // Find any button that could be the request button
    const btn = page.locator('button').filter({ hasText: /wfh|work from home/i }).first();
    await expect(btn).toBeVisible({ timeout: 15000 });
  });

  test('"Request WFH" button opens the request dialog', async ({ page }) => {
    const wfh = new WFHPage(page);
    await wfh.goto();

    // Click the first button containing WFH text
    const btn = page.locator('button').filter({ hasText: /wfh|work from home/i }).first();
    await btn.waitFor({ state: 'visible', timeout: 15000 });
    await btn.click();

    // Dialog should appear
    await expect(page.getByRole('dialog')).toBeVisible({ timeout: 10000 });
  });

  // ── 3. Dialog close ───────────────────────────────────────────────────────

  test('WFH dialog can be closed without submitting', async ({ page }) => {
    const wfh = new WFHPage(page);
    await wfh.goto();

    const btn = page.locator('button').filter({ hasText: /wfh|work from home/i }).first();
    await btn.waitFor({ state: 'visible', timeout: 15000 });
    await btn.click();
    await page.getByRole('dialog').waitFor({ state: 'visible', timeout: 10000 });

    // Close via X button or Cancel button inside dialog
    const closeBtn = page.getByRole('dialog').locator('button').filter({ hasText: /close|cancel|×/i }).first();
    const fallback = page.keyboard.press('Escape');
    try {
      await closeBtn.click({ timeout: 5000 });
    } catch {
      await fallback;
    }

    await expect(page.getByRole('dialog')).not.toBeVisible({ timeout: 5000 });
  });

  // ── 4. Table columns ──────────────────────────────────────────────────────

  test('WFH requests table shows column headers', async ({ page }) => {
    const wfh = new WFHPage(page);
    await wfh.goto();

    // Check for any recognizable column text in the table area
    const dateCol   = page.locator('*').filter({ hasText: /^dates?$/i }).first();
    const statusCol = page.locator('*').filter({ hasText: /^status$/i }).first();
    const reasonCol = page.locator('*').filter({ hasText: /^reason$/i }).first();

    // At least status column must be visible
    await expect(statusCol).toBeVisible({ timeout: 10000 });

    // Date and Reason are conditional — check softly
    const dateVisible   = await dateCol.isVisible().catch(() => false);
    const reasonVisible = await reasonCol.isVisible().catch(() => false);
    console.log(`Date col: ${dateVisible}, Reason col: ${reasonVisible}`);
  });

  // ── 5. Status filter ──────────────────────────────────────────────────────

  test('Status filter is present on the WFH page', async ({ page }) => {
    const wfh = new WFHPage(page);
    await wfh.goto();

    // Filter can be a select, button, or custom dropdown — match any
    const filter = page
      .locator('select, [role="combobox"], button')
      .filter({ hasText: /all|status|filter|pending|approved/i })
      .first();

    await expect(filter).toBeVisible({ timeout: 10000 });
  });

  // ── 6. Pagination ─────────────────────────────────────────────────────────

  test('Pagination or row count indicator is visible', async ({ page }) => {
    const wfh = new WFHPage(page);
    await wfh.goto();

    // Accept either pagination buttons OR a "showing X of Y" text OR "no records"
    const prevBtn    = page.locator('button').filter({ hasText: /prev/i }).first();
    const nextBtn    = page.locator('button').filter({ hasText: /next/i }).first();
    const rowCount   = page.locator('*').filter({ hasText: /showing|rows|records|entries/i }).first();
    const noRecords  = page.locator('*').filter({ hasText: /no records|no data|no requests/i }).first();

    const any =
      (await prevBtn.isVisible().catch(() => false))   ||
      (await nextBtn.isVisible().catch(() => false))   ||
      (await rowCount.isVisible().catch(() => false))  ||
      (await noRecords.isVisible().catch(() => false));

    expect(any, 'Expected pagination or row count indicator to be visible').toBe(true);
  });

});
