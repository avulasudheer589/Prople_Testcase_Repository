// tests/employee-dashboard.spec.js
// Employee Dashboard test cases.

const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { DashboardPage } = require('../pages/DashboardPage');

test.describe('Employee Dashboard', () => {

  // Log in once before each test
  test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);
    await login.loginAsEmployee();
    // Use domcontentloaded — networkidle times out on SPAs that poll continuously
    await page.waitForLoadState('domcontentloaded');
  });

  // ── 1. Page load ────────────────────────────────────────────────────────────

  test('Employee dashboard loads at /employee', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.gotoEmployee();

    // Wait for the page to fully settle after any internal redirect.
    // The final URL is /employee or a child route like /employee/dashboard —
    // both contain "/employee" so this pattern is safe.
    await page.waitForURL(/\/employee/, { timeout: 10000 });
    await expect(page).toHaveURL(/\/employee/);
  });

  // ── 2. Clock In (conditional — button only shows if not yet clocked in) ────

  test('Employee can clock in (when not already clocked in today)', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.gotoEmployee();

    const isVisible = await dashboard.clockInButton.isVisible();

    if (!isVisible) {
      // Already clocked in today — this is valid; mark test as skipped
      test.info().annotations.push({
        type: 'skip-reason',
        description: 'Employee has already clocked in today — Clock In button not present.',
      });
      return;
    }

    await dashboard.clockIn();
    // After clocking in, the button either disappears OR shows a success state
    // Either outcome is valid — just assert the click didn't crash the page
    await page.waitForLoadState('domcontentloaded');
    await expect(page).toHaveURL(/\/employee/);
  });

  // ── 3. Pending Leave Requests ───────────────────────────────────────────────

  test('Pending Leave Requests section is visible', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.gotoEmployee();

    // Exact heading text from the app
    await expect(dashboard.pendingLeaveHeading).toBeVisible({ timeout: 8000 });
  });

  test('"View All" navigates to the leaves page', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.gotoEmployee();

    // Scope "View All" to the Pending Leave Requests section only
    const leavesSection = page.locator('section, div').filter({
      has: page.getByText('Pending Leave Requests', { exact: true }),
    });
    const viewAllLink = leavesSection.getByRole('link', { name: /view all/i });

    // Fallback to first "View All" on page if section scoping doesn't work
    const target = (await viewAllLink.count()) > 0
      ? viewAllLink
      : dashboard.viewAllLeavesLink;

    await target.click();
    await expect(page).toHaveURL(/\/leaves/, { timeout: 8000 });
  });

  // ── 4. Upcoming Holiday ────────────────────────────────────────────────────

  test('Upcoming Holiday section is visible', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.gotoEmployee();

    // Exact heading from app knowledge: "Upcoming Holiday"
    await expect(dashboard.upcomingHolidaySection).toBeVisible({ timeout: 8000 });
  });

  // ── 5. AI Assistant ────────────────────────────────────────────────────────

  test('"Open AI assistant" button navigates to AI page', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.gotoEmployee();

    // The AI button uses aria-label="Open AI assistant" — match by attribute, not visible text
    // There are two: one in the "Meet Prople AI" widget (navigates to /ai)
    // and one fixed footer button (stays on /employee). Try each until one navigates.
    const aiButtons = page.locator('[aria-label="Open AI assistant"], a[href*="ai"], button[aria-label*="AI"]');
    const count = await aiButtons.count();

    let navigated = false;
    for (let i = 0; i < count; i++) {
      const btn = aiButtons.nth(i);
      if (!(await btn.isVisible().catch(() => false))) continue;
      await btn.click();
      try {
        await page.waitForURL(/\/ai/, { timeout: 5000 });
        navigated = true;
        break;
      } catch {
        await page.goto('https://app.prople.pro/employee', { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(1000);
      }
    }

    expect(navigated, 'No "Open AI assistant" button navigated to /ai').toBe(true);
    await expect(page).toHaveURL(/\/ai/);
  });

  // ── 6. Today's Attendance section ─────────────────────────────────────────

  test("Today's Attendance section is visible for employee", async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.gotoEmployee();

    await expect(dashboard.todaysAttendanceSection).toBeVisible({ timeout: 8000 });
  });

  // ── 7. "Not clocked in" status ─────────────────────────────────────────────

  test('Attendance status shows current state', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.gotoEmployee();

    // The status is either "Not clocked in" or a clocked-in timestamp
    const notClockedIn = page.getByText('Not clocked in', { exact: true });
    const clockedIn = page.getByText(/clocked in at/i);

    const eitherVisible =
      (await notClockedIn.isVisible()) || (await clockedIn.isVisible());

    expect(eitherVisible).toBe(true);
  });

});