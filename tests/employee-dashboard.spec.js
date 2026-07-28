// tests/employee-dashboard.spec.js
const { test, expect }  = require('@playwright/test');
const { LoginPage }     = require('../pages/LoginPage');
const { DashboardPage } = require('../pages/DashboardPage');

test.describe('Employee Dashboard', () => {

  // Login + land on /employee once before each test
  test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);
    await login.loginAsEmployee();
    // Wait for the dashboard widgets to actually render
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000); // SPA needs time to render all widgets
  });

  // ── 1. Page load ──────────────────────────────────────────────────────────

  test('Employee dashboard loads at /employee', async ({ page }) => {
    // loginAsEmployee() already landed on /employee — just assert
    await expect(page).toHaveURL(/\/employee/);
  });

  // ── 2. Clock In ───────────────────────────────────────────────────────────

  test('Employee can clock in (when not already clocked in today)', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    const isVisible = await dashboard.clockInButton.isVisible();

    if (!isVisible) {
      console.log('Already clocked in today — skipping.');
      return;
    }

    await dashboard.clockIn();
    await page.waitForLoadState('domcontentloaded');
    await expect(page).toHaveURL(/\/employee/);
  });

  // ── 3. Pending Leave Requests ─────────────────────────────────────────────

  test('Pending Leave Requests section is visible', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await expect(dashboard.pendingLeaveHeading).toBeVisible({ timeout: 15000 });
  });

  // ── 4. View All → Leaves ──────────────────────────────────────────────────

  test('"View All" navigates to the leaves page', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.viewAllLeavesLink.waitFor({ state: 'visible', timeout: 15000 });
    await dashboard.viewAllLeavesLink.click();
    await expect(page).toHaveURL(/\/leaves/, { timeout: 10000 });
  });

  // ── 5. Upcoming Holiday ───────────────────────────────────────────────────

  test('Upcoming Holiday section is visible', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await expect(dashboard.upcomingHolidaySection).toBeVisible({ timeout: 15000 });
  });

  // ── 6. AI Assistant ───────────────────────────────────────────────────────

  test('"Open AI assistant" button navigates to AI page', async ({ page }) => {
    // Wait for all buttons to render
    await page.waitForTimeout(2000);

    // Try aria-label first, then fallback to href containing 'ai'
    const byAriaLabel = page.locator('[aria-label="Open AI assistant"]');
    const byHref      = page.locator('a[href*="/ai"]');

    let navigated = false;

    // Try aria-label buttons
    const ariaCount = await byAriaLabel.count();
    for (let i = 0; i < ariaCount; i++) {
      const btn = byAriaLabel.nth(i);
      if (!(await btn.isVisible().catch(() => false))) continue;
      await btn.click();
      try {
        await page.waitForURL(/\/ai/, { timeout: 5000 });
        navigated = true;
        break;
      } catch {
        await page.goto('https://app.prople.pro/employee', { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(2000);
      }
    }

    // Fallback — try href links
    if (!navigated) {
      const hrefCount = await byHref.count();
      for (let i = 0; i < hrefCount; i++) {
        const link = byHref.nth(i);
        if (!(await link.isVisible().catch(() => false))) continue;
        await link.click();
        try {
          await page.waitForURL(/\/ai/, { timeout: 5000 });
          navigated = true;
          break;
        } catch {
          await page.goto('https://app.prople.pro/employee', { waitUntil: 'domcontentloaded' });
          await page.waitForTimeout(2000);
        }
      }
    }

    expect(navigated, 'No button/link navigated to /ai').toBe(true);
    await expect(page).toHaveURL(/\/ai/);
  });

  // ── 7. Today's Attendance ─────────────────────────────────────────────────

  test("Today's Attendance section is visible for employee", async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await expect(dashboard.todaysAttendanceSection).toBeVisible({ timeout: 15000 });
  });

  // ── 8. Attendance status ──────────────────────────────────────────────────

  test('Attendance status shows current state', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    // Status is either "Not clocked in" or a clocked-in time
    const notClockedIn = page.locator('*').filter({ hasText: /not clocked in/i }).first();
    const clockedIn    = page.locator('*').filter({ hasText: /clocked in at/i }).first();

    const either =
      (await notClockedIn.isVisible().catch(() => false)) ||
      (await clockedIn.isVisible().catch(() => false));

    expect(either, 'Expected attendance status to be visible').toBe(true);
  });

});
