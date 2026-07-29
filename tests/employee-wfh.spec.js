// tests/employee-wfh.spec.js
// Employee – Work From Home module test cases.
//
// The WFH page lives at /employee/EmployeeWorkType (not /employee/wfh).
// It renders:
//   - Heading: "My WFH Requests"
//   - "+ New Request" button (opens the RequestModalofc dialog)
//   - A <table> with headers: #, Dates, Reason, Status, Actions
//   - Empty state: "No pending leaves found" when no records
//   - Pagination (Prev / Next) only when records exist

const { test, expect } = require('@playwright/test');
const { LoginPage }    = require('../pages/LoginPage');
const { WFHPage }      = require('../pages/WFHPage');

test.describe('Employee – Work From Home', () => {

  test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);
    await login.loginAsEmployee();
    // Wait for the SPA to finish routing post-login
    await page.waitForLoadState('domcontentloaded');
  });

  // ── 1. Page loads ──────────────────────────────────────────────────────────

  test('WFH page loads with the correct heading', async ({ page }) => {
    const wfh = new WFHPage(page);
    await wfh.goto();

    // Confirm the URL is correct
    await expect(page).toHaveURL(/EmployeeWorkType/, { timeout: 10000 });

    // Confirm the heading "My WFH Requests" is rendered
    await expect(wfh.pageHeading).toBeVisible({ timeout: 10000 });
  });

  // ── 2. "New Request" button is visible ────────────────────────────────────

  test('"+ New Request" button is visible on the WFH page', async ({ page }) => {
    const wfh = new WFHPage(page);
    await wfh.goto();

    // The button text is "+ New Request"
    await expect(wfh.requestWFHButton).toBeVisible({ timeout: 10000 });
  });

  // ── 3. Request dialog opens ───────────────────────────────────────────────

  test('"+ New Request" button opens the request dialog', async ({ page }) => {
    const wfh = new WFHPage(page);
    await wfh.goto();

    await wfh.openRequestDialog();

    // The RequestModalofc modal should be visible
    const dialog = page.locator('[role="dialog"], [class*="modal"], [class*="Modal"]').first();
    await expect(dialog).toBeVisible({ timeout: 10000 });
  });

  // ── 4. Dialog close ───────────────────────────────────────────────────────

  test('WFH dialog can be closed without submitting', async ({ page }) => {
    const wfh = new WFHPage(page);
    await wfh.goto();

    await wfh.openRequestDialog();

    // Confirm the dialog opened
    const dialog = page.locator('[role="dialog"], [class*="modal"], [class*="Modal"]').first();
    await expect(dialog).toBeVisible({ timeout: 10000 });

    // Close it
    await wfh.closeDialog();

    // Dialog should no longer be visible
    await expect(dialog).not.toBeVisible({ timeout: 8000 });
  });

  // ── 5. Table column headers ───────────────────────────────────────────────

  test('WFH requests table shows column headers', async ({ page }) => {
    const wfh = new WFHPage(page);
    await wfh.goto();

    // The table is always rendered; check its column headers
    await expect(wfh.table).toBeVisible({ timeout: 10000 });
    await expect(wfh.colHeaderDates).toBeVisible();
    await expect(wfh.colHeaderReason).toBeVisible();
    await expect(wfh.colHeaderStatus).toBeVisible();
    await expect(wfh.colHeaderActions).toBeVisible();
  });

  // ── 6. Table body — rows or empty state ──────────────────────────────────

  test('WFH table shows requests or an empty-state message', async ({ page }) => {
    const wfh = new WFHPage(page);
    await wfh.goto();

    // At least one of: a data row OR the empty-state message must be present
    const hasRows = await page.locator('table tbody tr').first().isVisible().catch(() => false);
    const hasEmpty = await wfh.emptyState.isVisible().catch(() => false);

    expect(
      hasRows || hasEmpty,
      'Expected table data rows OR empty-state message to be visible'
    ).toBe(true);
  });

  // ── 7. Pagination or row count indicator ─────────────────────────────────

  test('Pagination controls or row-count text is visible when records exist', async ({ page }) => {
    const wfh = new WFHPage(page);
    await wfh.goto();

    // Check if there are any data rows
    const rowCount = await page.locator('table tbody tr').count();

    if (rowCount > 0) {
      // When records exist, "Showing X to Y of Z results" and Prev/Next appear
      const paginationVisible = await wfh.isPaginationVisible();
      expect(
        paginationVisible,
        'Expected pagination controls when WFH records are present'
      ).toBe(true);
    } else {
      // When no records, the empty state should be present instead
      await expect(wfh.emptyState).toBeVisible({ timeout: 5000 });
    }
  });

  // ── 8. Refresh button ─────────────────────────────────────────────────────

  test('Refresh button is present on the WFH page', async ({ page }) => {
    const wfh = new WFHPage(page);
    await wfh.goto();

    // The Refresh icon button sits next to "+ New Request"
    // It has title="Refresh" — target by title attribute
    const refreshBtn = page.locator('button[title="Refresh"]');
    await expect(refreshBtn).toBeVisible({ timeout: 10000 });
  });

});
