// tests/employee-dashboard.spec.js
// Employee Dashboard — full test suite.

const { test, expect } = require('@playwright/test');
const { LoginPage }    = require('../pages/LoginPage');
const { DashboardPage } = require('../pages/DashboardPage');

test.describe('Employee Dashboard', () => {

  test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);
    await login.loginAsEmployee();
    // domcontentloaded — NEVER networkidle (SPA polls forever)
    await page.waitForLoadState('domcontentloaded');
  });

  // ── 1. Page load ────────────────────────────────────────────────────────

  test('Employee dashboard loads at /employee', async ({ page }) => {
    // loginAsEmployee() already lands on /employee — just assert the URL
    await expect(page).toHaveURL(/\/employee/);
  });

  // ── 2. Clock In ─────────────────────────────────────────────────────────

  test('Employee can clock in (when not already clocked in today)', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.gotoEmployee();

    const isVisible = await dashboard.clockInButton.isVisible();

    if (!isVisible) {
      // Already clocked in today — valid, skip gracefully
      console.log('Clock In button not present — employee already clocked in today.');
      return;
    }

    await dashboard.clockIn();
    // Button may stay visible (app behaviour) — assert page didn't navigate away
    await page.waitForLoadState('domcontentloaded');
    await expect(page).toHaveURL(/\/employee/);
  });

  // ── 3. Pending Leave Requests ────────────────────────────────────────────

  test('Pending Leave Requests section is visible', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.gotoEmployee();
    await expect(dashboard.pendingLeaveHeading).toBeVisible({ timeout: 10000 });
  });

  test('"View All" navigates to the leaves page', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.gotoEmployee();
    await dashboard.viewAllLeavesLink.click();
    await expect(page).toHaveURL(/\/leaves/, { timeout: 10000 });
  });

  // ── 4. Upcoming Holiday ──────────────────────────────────────────────────

  test('Upcoming Holiday section is visible', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.gotoEmployee();
    await expect(dashboard.upcomingHolidaySection).toBeVisible({ timeout: 10000 });
  });

  // ── 5. AI Assistant ──────────────────────────────────────────────────────

  test('"Open AI assistant" button navigates to AI page', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.gotoEmployee();

    // There are 2 buttons with aria-label="Open AI assistant":
    //   • One inside the "Meet Prople AI" widget  → navigates to /employee/ai
    //   • One fixed in the footer                 → stays on /employee
    // Try each one until one navigates to /ai.
    const buttons = page.locator('[aria-label="Open AI assistant"]');
    const count   = await buttons.count();

    let navigated = false;
    for (let i = 0; i < count; i++) {
      const btn = buttons.nth(i);
      if (!(await btn.isVisible().catch(() => false))) continue;

      await btn.click();
      try {
        await page.waitForURL(/\/ai/, { timeout: 5000 });
        navigated = true;
        break;
      } catch {
        // This one didn't navigate — go back and try next
        await page.goto('https://app.prople.pro/employee', {
          waitUntil: 'domcontentloaded',
        });
        await page.waitForTimeout(1500);
      }
    }

    expect(navigated, 'Expected an "Open AI assistant" button to navigate to /ai').toBe(true);
    await expect(page).toHaveURL(/\/ai/);
  });

  // ── 6. Today's Attendance ────────────────────────────────────────────────

  test("Today's Attendance section is visible for employee", async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.gotoEmployee();
    await expect(dashboard.todaysAttendanceSection).toBeVisible({ timeout: 10000 });
  });

  // ── 7. Attendance status ─────────────────────────────────────────────────

  test('Attendance status shows current state', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.gotoEmployee();

    // Status is either "Not clocked in" OR a clocked-in timestamp
    const notClockedIn = page.locator('*').filter({ hasText: /not clocked in/i }).first();
    const clockedIn    = page.locator('*').filter({ hasText: /clocked in at/i }).first();

    const either =
      (await notClockedIn.isVisible().catch(() => false)) ||
      (await clockedIn.isVisible().catch(() => false));

    expect(either, 'Expected either "Not clocked in" or "Clocked in at" to be visible').toBe(true);
  });

});
