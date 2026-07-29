// pages/WFHPage.js
// Employee Work From Home module — /employee/wfh

class WFHPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // ── Request WFH button ──────────────────────────────────────────────────
    // Try multiple name variants — actual label may differ
    this.requestWFHButton = page.locator('button').filter({ hasText: /request\s*wfh|wfh\s*request|add\s*wfh|new\s*wfh/i }).first();

    // ── Stats / Summary cards ───────────────────────────────────────────────
    this.totalCard    = page.locator('*').filter({ hasText: /^total$/i }).first();
    this.pendingCard  = page.locator('*').filter({ hasText: /^pending$/i }).first();
    this.approvedCard = page.locator('*').filter({ hasText: /^approved$/i }).first();

    // ── Status filter ───────────────────────────────────────────────────────
    // Custom dropdown — not a native <select>
    this.statusFilter = page
      .locator('button, [role="combobox"], [role="listbox"], select')
      .filter({ hasText: /all|status|pending|approved/i })
      .first();

    // ── Table columns ───────────────────────────────────────────────────────
    // Div-based table — match header cells by text
    this.colDates  = page.locator('*').filter({ hasText: /^dates?$/i }).first();
    this.colReason = page.locator('*').filter({ hasText: /^reason$/i }).first();
    this.colStatus = page.locator('*').filter({ hasText: /^status$/i }).first();

    // ── Dialog elements ─────────────────────────────────────────────────────
    this.dialog            = page.getByRole('dialog');
    this.selectDatesButton = page.locator('button').filter({ hasText: /select.*dates|pick.*dates|dates/i }).first();
    this.reasonTextarea    = page.locator('textarea, [role="textbox"]').first();
    this.submitButton      = page.locator('button').filter({ hasText: /^submit$/i }).first();
    this.closeDialogButton = page
      .locator('button')
      .filter({ hasText: /^close$|^cancel$|^×$|\u00d7/i })
      .first();

    // ── Pagination ──────────────────────────────────────────────────────────
    this.prevButton = page.locator('button').filter({ hasText: /prev/i }).first();
    this.nextButton = page.locator('button').filter({ hasText: /next/i }).first();

    // ── Row actions ─────────────────────────────────────────────────────────
    this.showDateButtons = page.locator('button').filter({ hasText: /show/i });
    this.cancelButtons   = page.locator('button').filter({ hasText: /^cancel$/i });
  }

  // ── Navigation ──────────────────────────────────────────────────────────────

  async goto() {
    await this.page.goto('/employee/wfh', { waitUntil: 'domcontentloaded' });
    // Wait for any visible content — heading or button
    await this.page.waitForTimeout(3000);
  }

  // ── Actions ─────────────────────────────────────────────────────────────────

  /** Open the Request WFH dialog */
  async openRequestDialog() {
    await this.requestWFHButton.waitFor({ state: 'visible', timeout: 15000 });
    await this.requestWFHButton.click();
    await this.dialog.waitFor({ state: 'visible', timeout: 10000 });
  }

  /** Filter by status using custom dropdown */
  async filterByStatus(status) {
    await this.statusFilter.click();
    await this.page.locator('*').filter({ hasText: new RegExp(status, 'i') }).last().click();
  }

  /** Close open dialog */
  async closeDialog() {
    await this.closeDialogButton.waitFor({ state: 'visible', timeout: 5000 });
    await this.closeDialogButton.click();
  }

  /** Show dates for a row */
  async showDates(index = 0) {
    await this.showDateButtons.nth(index).click();
  }

  /** Cancel a WFH request by row index */
  async cancelRequest(index = 0) {
    await this.cancelButtons.nth(index).click();
  }
}

module.exports = { WFHPage };
