// tests/employee-wfh.spec.js
// Employee – Work From Home module test cases.
// Route: /employee/wfh  (navigated via sidebar — NOT page.goto)
//
// ⚠️  Navigation note:
//   This app uses SPA session auth. Calling page.goto('/employee/wfh') after
//   login reloads the browser and destroys the session → login page appears.
//   All tests reach the WFH page via WFHPage.goto(), which clicks the
//   "Work From Home" sidebar link (client-side route change, session preserved).
//
// Page elements confirmed from app:
//   - Summary cards: TOTAL, PENDING, APPROVED, REJECTED, TOTAL DAYS
//   - "+ Request WFH" button → opens Request WFH modal
//   - Status filter dropdown: All | Pending | Approved | Rejected | Cancelled
//   - Search input field
//   - Table columns: Days | Dates | Reason | Proof | Status | Actions
//   - Row actions: "show (1)" (date detail) · "Cancel" (pending requests only)
//   - Pagination: Prev / Next

const { test, expect } = require('@playwright/test');
const { LoginPage }    = require('../pages/LoginPage');
const { WFHPage }      = require('../pages/WFHPage');

test.describe('Employee – Work From Home', () => {

  // Login once before each test and land on the employee dashboard.
  // WFHPage.goto() will then click the sidebar link to reach /employee/wfh.
  test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);
    await login.loginAsEmployee();
    // Confirm we are on the dashboard before each test
    await page.waitForURL('**/employee**', { timeout: 20000 });
    await page.waitForLoadState('domcontentloaded');
  });

  // ── 1. WFH page loads with statistics cards ───────────────────────────────

  test('WFH page loads with statistics cards', async ({ page }) => {
    const wfh = new WFHPage(page);
    await wfh.goto();

    // Confirm URL reached /employee/wfh via sidebar click
    await expect(page).toHaveURL(/\/employee\/wfh/, { timeout: 10000 });

    // At least one summary card must be visible (TOTAL / PENDING / APPROVED)
    const statsVisible =
      (await wfh.statCardTotal.isVisible().catch(() => false))    ||
      (await wfh.statCardPending.isVisible().catch(() => false))  ||
      (await wfh.statCardApproved.isVisible().catch(() => false));

    expect(statsVisible, 'Expected at least one summary statistics card (TOTAL / PENDING / APPROVED)').toBe(true);
  });

  // ── 2. "Request WFH" button is visible ───────────────────────────────────

  test('"Request WFH" button is visible on the page', async ({ page }) => {
    const wfh = new WFHPage(page);
    await wfh.goto();

    // The button text is "+ Request WFH"
    await expect(wfh.requestWFHButton).toBeVisible({ timeout: 10000 });
  });

  // ── 3. "Request WFH" button opens the request dialog ─────────────────────

  test('"Request WFH" button opens the request dialog', async ({ page }) => {
    const wfh = new WFHPage(page);
    await wfh.goto();

    await wfh.openRequestDialog();

    // Dialog must be open with the reason textarea visible
    await expect(wfh.dialog).toBeVisible({ timeout: 10000 });
    await expect(wfh.reasonTextarea).toBeVisible({ timeout: 10000 });
  });

  // ── 4. Dialog can be closed without submitting ────────────────────────────

  test('WFH dialog can be closed without submitting', async ({ page }) => {
    const wfh = new WFHPage(page);
    await wfh.goto();

    await wfh.openRequestDialog();
    await expect(wfh.dialog).toBeVisible({ timeout: 10000 });

    await wfh.closeDialog();

    // Dialog must disappear
    await expect(wfh.dialog).not.toBeVisible({ timeout: 8000 });
  });

  // ── 5. Table shows correct column headers ─────────────────────────────────

  test('WFH requests table shows column headers', async ({ page }) => {
    const wfh = new WFHPage(page);
    await wfh.goto();

    // Table is always rendered (even when empty it shows headers)
    await expect(wfh.table).toBeVisible({ timeout: 10000 });

    // Verify all documented column headers
    await expect(wfh.colHeaderDays).toBeVisible();
    await expect(wfh.colHeaderDates).toBeVisible();
    await expect(wfh.colHeaderReason).toBeVisible();
    await expect(wfh.colHeaderProof).toBeVisible();
    await expect(wfh.colHeaderStatus).toBeVisible();
    await expect(wfh.colHeaderActions).toBeVisible();
  });

  // ── 6. Status filter is present on the WFH page ──────────────────────────

  test('Status filter is present on the WFH page', async ({ page }) => {
    const wfh = new WFHPage(page);
    await wfh.goto();

    // Status filter dropdown: All | Pending | Approved | Rejected | Cancelled
    await expect(wfh.statusFilter).toBeVisible({ timeout: 10000 });
  });

  // ── 7. Pagination or row count indicator is visible ───────────────────────

  test('Pagination or row count indicator is visible', async ({ page }) => {
    const wfh = new WFHPage(page);
    await wfh.goto();

    const hasRows = await wfh.hasTableRows();

    if (hasRows) {
      // When records exist, Prev/Next or "Showing X to Y of Z" must appear
      const prevVisible  = await wfh.prevButton.isVisible().catch(() => false);
      const nextVisible  = await wfh.nextButton.isVisible().catch(() => false);
      const infoVisible  = await wfh.paginationInfo.isVisible().catch(() => false);

      expect(
        prevVisible || nextVisible || infoVisible,
        'Expected pagination controls when WFH records are present'
      ).toBe(true);
    } else {
      // No records — table still renders (with empty body); test passes
      await expect(wfh.table).toBeVisible({ timeout: 5000 });
    }
  });

});
