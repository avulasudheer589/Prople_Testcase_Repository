// pages/WFHPage.js
// Employee Work From Home module — /employee/wfh

class WFHPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // ── Request WFH button ──────────────────────────────────────────────────
    // Broadest possible match — any button on page that could be the request button
    this.requestWFHButton = page.locator('button').filter({ hasText: /request|add|new|\+/i }).first();

    // ── Stats / Summary cards ───────────────────────────────────────────────
    this.statsArea = page.locator('*').filter({ hasText: /total|pending|approved/i }).first();

    // ── Status filter ───────────────────────────────────────────────────────
    this.statusFilter = page.locator('select, [role="combobox"], [role="listbox"]').first();

    // ── Table ───────────────────────────────────────────────────────────────
    this.tableArea = page.locator('table, [role="table"], .table, [class*="table"]').first();

    // ── Dialog elements ─────────────────────────────────────────────────────
    this.dialog         = page.getByRole('dialog');
    this.reasonTextarea = page.locator('textarea').first();
    this.submitButton   = page.locator('button').filter({ hasText: /submit/i }).first();

    // ── Pagination ──────────────────────────────────────────────────────────
    this.prevButton = page.locator('button').filter({ hasText: /prev/i }).first();
    this.nextButton = page.locator('button').filter({ hasText: /next/i }).first();

    // ── Row actions ─────────────────────────────────────────────────────────
    this.cancelButtons = page.locator('button').filter({ hasText: /cancel/i });
  }

  // ── Navigation ──────────────────────────────────────────────────────────────

  /**
   * Navigate directly to /employee/wfh and wait for content to appear.
   * Must be called AFTER login.
   */
  async goto() {
    await this.page.goto('https://app.prople.pro/employee/wfh', {
      waitUntil: 'domcontentloaded',
      timeout: 30000,
    });
    // Wait for ANY button to appear — means page has rendered
    await this.page.locator('button').first().waitFor({ state: 'visible', timeout: 15000 });
  }

  // ── Actions ─────────────────────────────────────────────────────────────────

  /** Open the Request WFH dialog */
  async openRequestDialog() {
    await this.requestWFHButton.waitFor({ state: 'visible', timeout: 15000 });
    await this.requestWFHButton.click();
    await this.dialog.waitFor({ state: 'visible', timeout: 10000 });
  }

  /** Close open dialog via button or Escape */
  async closeDialog() {
    try {
      const closeBtn = this.dialog.locator('button').last();
      await closeBtn.click({ timeout: 5000 });
    } catch {
      await this.page.keyboard.press('Escape');
    }
  }

  /** Cancel a WFH request by row index */
  async cancelRequest(index = 0) {
    await this.cancelButtons.nth(index).click();
  }
}

module.exports = { WFHPage };
