// pages/WFHPage.js
// Employee Work From Home module — /employee/EmployeeWorkType
//
// The WFH feature lives at /employee/EmployeeWorkType (not /employee/wfh).
// The page renders:
//   - A heading "My WFH Requests"
//   - A "+ New Request" button (sky-blue) that opens the RequestModalofc dialog
//   - A Refresh button (icon only)
//   - A <table> with headers: #, Dates, Reason, Status, Actions
//   - Pagination (Prev / page numbers / Next) — only when requests exist
//   - The dialog has date-picker, reason textarea, and Submit/Close controls

class WFHPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // ── Page heading ────────────────────────────────────────────────────────
    // The live page renders: <h1>My WFH Requests</h1>
    this.pageHeading = page.getByRole('heading', { name: /my wfh requests/i });

    // ── Request WFH button ───────────────────────────────────────────────────
    // The button text is "+ New Request" (sky-blue bg-sky-600 button)
    this.requestWFHButton = page.getByRole('button', { name: /new request/i });

    // ── Refresh button ───────────────────────────────────────────────────────
    this.refreshButton = page.getByRole('button', { name: /refresh/i });

    // ── Table ────────────────────────────────────────────────────────────────
    // A standard <table> is always rendered (even when empty).
    this.table = page.locator('table').first();

    // Table column headers
    this.colHeaderDates   = page.getByRole('columnheader', { name: /dates/i });
    this.colHeaderReason  = page.getByRole('columnheader', { name: /reason/i });
    this.colHeaderStatus  = page.getByRole('columnheader', { name: /status/i });
    this.colHeaderActions = page.getByRole('columnheader', { name: /actions/i });

    // ── Empty state ──────────────────────────────────────────────────────────
    // Rendered when no requests exist: "No pending leaves found"
    this.emptyState = page.getByText(/no pending (leaves|requests|wfh)/i);

    // ── Dialog (RequestModalofc) ─────────────────────────────────────────────
    // The dialog is rendered by RequestModalofc — it uses role="dialog" or a
    // visible overlay. We target the first dialog or the modal container.
    this.dialog = page.getByRole('dialog').first();

    // Close button inside the dialog (last button or labelled Close/Cancel)
    this.dialogCloseButton = page.getByRole('button', { name: /close|cancel/i }).last();

    // ── Pagination ───────────────────────────────────────────────────────────
    // Only rendered when requests.length > 0
    this.prevButton = page.getByRole('button', { name: /prev/i });
    this.nextButton = page.getByRole('button', { name: /next/i });

    // "Showing X to Y of Z results" text
    this.paginationInfo = page.getByText(/showing \d+ to \d+ of \d+ results/i);

    // ── Row actions ───────────────────────────────────────────────────────────
    // Edit (pencil icon button) and Cancel/Delete (trash icon button) per row
    this.editButtons   = page.locator('button').filter({ has: page.locator('[data-lucide="pencil"], svg') });
    this.deleteButtons = page.locator('button').filter({ has: page.locator('[data-lucide="trash-2"], svg') });
  }

  // ── Navigation ──────────────────────────────────────────────────────────────

  /**
   * Navigate to the WFH page at its actual route and wait for it to render.
   * Must be called AFTER login.
   */
  async goto() {
    await this.page.goto('/employee/EmployeeWorkType', {
      waitUntil: 'domcontentloaded',
      timeout: 30000,
    });
    // Wait for the heading — confirms the WFH component has mounted
    await this.pageHeading.waitFor({ state: 'visible', timeout: 20000 });
  }

  // ── Actions ─────────────────────────────────────────────────────────────────

  /** Click "+ New Request" and wait for the dialog to open */
  async openRequestDialog() {
    await this.requestWFHButton.waitFor({ state: 'visible', timeout: 10000 });
    await this.requestWFHButton.click();
    // Wait for the dialog/modal to become visible
    await this.page.waitForSelector(
      '[role="dialog"], [class*="modal"], [class*="Modal"]',
      { state: 'visible', timeout: 10000 }
    );
  }

  /** Close the open dialog via its Close/Cancel button or Escape key */
  async closeDialog() {
    try {
      // Try explicit close button first
      const closeBtn = this.page.getByRole('button', { name: /close|cancel/i }).last();
      await closeBtn.waitFor({ state: 'visible', timeout: 5000 });
      await closeBtn.click();
    } catch {
      // Fall back to Escape
      await this.page.keyboard.press('Escape');
    }
    // Brief wait for the dialog to animate away
    await this.page.waitForTimeout(500);
  }

  /** Check if the table is visible (may be empty) */
  async isTableVisible() {
    return this.table.isVisible().catch(() => false);
  }

  /** Check if pagination controls are visible (only when records exist) */
  async isPaginationVisible() {
    const prevVisible = await this.prevButton.isVisible().catch(() => false);
    const infoVisible = await this.paginationInfo.isVisible().catch(() => false);
    return prevVisible || infoVisible;
  }
}

module.exports = { WFHPage };
