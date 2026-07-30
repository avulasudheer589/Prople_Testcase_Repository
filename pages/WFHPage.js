// pages/WFHPage.js
// Employee Work From Home module — /employee/wfh
//
// ⚠️  IMPORTANT — why we use sidebar navigation, NOT page.goto():
//
//   This app stores auth state in memory (SPA session). Calling page.goto()
//   after login performs a hard browser reload which clears that state,
//   causing the app to redirect back to the login page.
//
//   The correct approach is:
//     1. Login normally (lands on /employee dashboard)
//     2. Click the "Work From Home" sidebar link  ← client-side route change
//     3. Wait for the WFH page to render
//
//   This preserves the session and lands on /employee/wfh correctly.

class WFHPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // ── Sidebar navigation link ─────────────────────────────────────────────
    // The left sidebar has a "Work From Home" menu item
    this.sidebarWFHLink = page
      .locator('nav, aside, [role="navigation"]')
      .getByText(/work from home/i)
      .first();

    // ── "Request WFH" button ────────────────────────────────────────────────
    // Button text is exactly "+ Request WFH"
    this.requestWFHButton = page.getByRole('button', { name: /request wfh/i });

    // ── Summary / Statistics cards ──────────────────────────────────────────
    // Five cards visible on the WFH page: TOTAL, PENDING, APPROVED, REJECTED, TOTAL DAYS
    this.statCardTotal    = page.getByText(/^total$/i).first();
    this.statCardPending  = page.getByText(/^pending$/i).first();
    this.statCardApproved = page.getByText(/^approved$/i).first();
    this.statCardRejected = page.getByText(/^rejected$/i).first();
    this.statCardDays     = page.getByText(/total days/i).first();

    // ── Status filter dropdown ──────────────────────────────────────────────
    // Dropdown: All | Pending | Approved | Rejected | Cancelled
    this.statusFilter = page.locator('select, [role="combobox"]').first();

    // ── Search input ────────────────────────────────────────────────────────
    this.searchInput = page.locator('input[type="text"], input[type="search"]').first();

    // ── Table ───────────────────────────────────────────────────────────────
    // A standard <table> always rendered (even when empty it shows headers)
    this.table = page.locator('table').first();

    // Column headers: Days | Dates | Reason | Proof | Status | Actions
    this.colHeaderDays    = page.getByRole('columnheader', { name: /^days$/i });
    this.colHeaderDates   = page.getByRole('columnheader', { name: /^dates$/i });
    this.colHeaderReason  = page.getByRole('columnheader', { name: /^reason$/i });
    this.colHeaderProof   = page.getByRole('columnheader', { name: /^proof$/i });
    this.colHeaderStatus  = page.getByRole('columnheader', { name: /^status$/i });
    this.colHeaderActions = page.getByRole('columnheader', { name: /^actions$/i });

    // ── Row actions ─────────────────────────────────────────────────────────
    // "show (1)" — opens a date-detail modal for that row
    this.showDateButtons = page.locator('button').filter({ hasText: /show/i });
    // "Cancel" — only available on pending requests
    this.cancelButtons   = page.locator('button').filter({ hasText: /^cancel$/i });

    // ── Dialog (Request WFH form) ───────────────────────────────────────────
    // Form fields: date picker, reason textarea, proof upload
    this.dialog         = page.getByRole('dialog').first();
    this.reasonTextarea = page.locator('textarea').first();
    this.submitButton   = page.getByRole('button', { name: /submit/i });
    // Close button inside the dialog
    this.dialogCloseBtn = page.getByRole('button', { name: /close/i }).last();

    // ── Pagination ──────────────────────────────────────────────────────────
    // Only rendered when records exist
    this.prevButton     = page.getByRole('button', { name: /prev/i });
    this.nextButton     = page.getByRole('button', { name: /next/i });
    this.paginationInfo = page.getByText(/showing \d+ to \d+ of \d+/i);
  }

  // ── Navigation ──────────────────────────────────────────────────────────────

  /**
   * Navigate to the WFH page by clicking the sidebar link.
   *
   * MUST be called after login (LoginPage.loginAsEmployee()).
   * Do NOT use page.goto() — it reloads the page and destroys the SPA session,
   * redirecting back to the login screen.
   */
  async goto() {
    // Click the sidebar "Work From Home" link for a client-side SPA route change
    await this.sidebarWFHLink.waitFor({ state: 'visible', timeout: 15000 });
    await this.sidebarWFHLink.click();

    // Wait for the URL to update to /employee/wfh
    await this.page.waitForURL('**/employee/wfh', { timeout: 15000 });

    // Wait for the "Request WFH" button — confirms the WFH component has mounted
    await this.requestWFHButton.waitFor({ state: 'visible', timeout: 20000 });
  }

  // ── Actions ─────────────────────────────────────────────────────────────────

  /** Click "+ Request WFH" and wait for the dialog to open */
  async openRequestDialog() {
    await this.requestWFHButton.waitFor({ state: 'visible', timeout: 10000 });
    await this.requestWFHButton.click();
    await this.dialog.waitFor({ state: 'visible', timeout: 10000 });
  }

  /** Close the open dialog — tries the Close button first, falls back to Escape */
  async closeDialog() {
    try {
      await this.dialogCloseBtn.waitFor({ state: 'visible', timeout: 5000 });
      await this.dialogCloseBtn.click();
    } catch {
      await this.page.keyboard.press('Escape');
    }
    // Brief wait for the dialog animation to finish
    await this.page.waitForTimeout(500);
  }

  /** Returns true when the table has at least one data row */
  async hasTableRows() {
    const count = await this.page.locator('table tbody tr').count().catch(() => 0);
    return count > 0;
  }

  /** Cancel the WFH request at the given row index (0-based) */
  async cancelRequest(index = 0) {
    await this.cancelButtons.nth(index).click();
  }
}

module.exports = { WFHPage };
