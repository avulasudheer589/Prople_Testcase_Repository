// pages/DashboardPage.js
// Dashboard page object — works for both Employee (/employee) and Admin (/admin).

class DashboardPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // ── Clock In ────────────────────────────────────────────────────────────
    // Only visible when employee has NOT clocked in today
    this.clockInButton = page.getByRole('button', { name: 'Clock In' });

    // ── Today's Attendance ──────────────────────────────────────────────────
    // Fuzzy match handles smart-quote vs straight-quote apostrophe variants
    this.todaysAttendanceSection = page
      .locator('*')
      .filter({ hasText: /today.{0,3}s\s+attendance/i })
      .first();

    // ── Pending Leave Requests ──────────────────────────────────────────────
    this.pendingLeaveHeading = page
      .locator('*')
      .filter({ hasText: /pending\s+leave\s+requests/i })
      .first();

    // ── View All (leaves) ───────────────────────────────────────────────────
    this.viewAllLeavesLink = page
      .locator('a, button')
      .filter({ hasText: /view\s+all/i })
      .first();

    // ── Upcoming Holiday ────────────────────────────────────────────────────
    this.upcomingHolidaySection = page
      .locator('*')
      .filter({ hasText: /upcoming\s+holiday/i })
      .first();

    // ── Open AI assistant ───────────────────────────────────────────────────
    // Match by aria-label attribute (the button has no visible text node)
    this.openAIButton = page.locator('[aria-label="Open AI assistant"]').first();

    // ── Misc ────────────────────────────────────────────────────────────────
    this.showButtons          = page.getByRole('button', { name: /^show$/i });
    this.modalCloseButton     = page.getByRole('button', { name: /close/i });
    this.pendingApprovalsSection = page
      .locator('*')
      .filter({ hasText: /pending\s+approvals/i })
      .first();
  }

  // ── Navigation ─────────────────────────────────────────────────────────────

  /**
   * Navigate to the employee dashboard.
   * NEVER use 'networkidle' — Prople SPA polls continuously and never idles.
   */
  async gotoEmployee() {
    await this.page.goto('https://app.prople.pro/employee', {
      waitUntil: 'domcontentloaded',
      timeout: 20000,
    });
    // Allow the SPA router to finish its internal redirect
    await this.page.waitForTimeout(2000);
  }

  /** Navigate to the admin dashboard */
  async gotoAdmin() {
    await this.page.goto('https://app.prople.pro/admin', {
      waitUntil: 'domcontentloaded',
      timeout: 20000,
    });
    await this.page.waitForTimeout(2000);
  }

  // ── Actions ────────────────────────────────────────────────────────────────

  async clockIn() {
    await this.clockInButton.waitFor({ state: 'visible', timeout: 5000 });
    await this.clockInButton.click();
  }

  async clickFirstShowButton() {
    await this.showButtons.first().waitFor({ state: 'visible', timeout: 5000 });
    await this.showButtons.first().click();
  }

  async closeModal() {
    await this.modalCloseButton.waitFor({ state: 'visible', timeout: 5000 });
    await this.modalCloseButton.click();
  }

  async clickViewAllLeaves() {
    await this.viewAllLeavesLink.waitFor({ state: 'visible', timeout: 5000 });
    await this.viewAllLeavesLink.click();
  }
}

module.exports = { DashboardPage };
