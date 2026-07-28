// pages/DashboardPage.js
// Dashboard page object — works for both Employee (/employee) and Admin (/admin).

class DashboardPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // ── Employee Dashboard widgets ──────────────────────────────────────────

    // Clock In button — only visible when employee has NOT clocked in today
    this.clockInButton = page.getByRole('button', { name: 'Clock In' });

    // "Today's Attendance" section heading — try both apostrophe variants
    this.todaysAttendanceSection = page
      .locator('h1, h2, h3, h4, h5, h6, p, span, div')
      .filter({ hasText: /today.{0,3}s attendance/i })
      .first();

    // "Pending Leave Requests" heading — app may render it slightly differently
    this.pendingLeaveHeading = page
      .locator('h1, h2, h3, h4, h5, h6, p, span, div')
      .filter({ hasText: /pending leave requests/i })
      .first();

    // "View All" link scoped near pending leaves section
    this.viewAllLeavesLink = page
      .locator('a, button')
      .filter({ hasText: /view all/i })
      .first();

    // "Upcoming Holiday" section heading
    this.upcomingHolidaySection = page
      .locator('h1, h2, h3, h4, h5, h6, p, span, div')
      .filter({ hasText: /upcoming holiday/i })
      .first();

    // "Open AI assistant" — target the one inside the "Meet Prople AI" widget
    // NOT the fixed footer button (which redirects back to dashboard)
    this.openAIButton = page
      .locator('section, div, article')
      .filter({ hasText: /meet prople ai/i })
      .locator('a, button')
      .filter({ hasText: /open ai assistant/i })
      .first();

    // Show buttons inside Pending Leave Requests table rows
    this.showButtons = page.getByRole('button', { name: /show/i });

    // Modal close button
    this.modalCloseButton = page.getByRole('button', { name: /close/i });

    // ── Admin Dashboard ─────────────────────────────────────────────────────
    this.pendingApprovalsSection = page
      .locator('h1, h2, h3, h4, h5, h6, p, span, div')
      .filter({ hasText: /pending approvals/i })
      .first();
  }

  // ── Navigation ─────────────────────────────────────────────────────────────

  /**
   * Navigate to the employee dashboard.
   * Uses 'domcontentloaded' — 'networkidle' times out on SPAs that poll continuously.
   */
  async gotoEmployee() {
    await this.page.goto('https://app.prople.pro/employee', {
      waitUntil: 'domcontentloaded',
      timeout: 20000,
    });
    // Give the SPA router a moment to finish its internal redirect
    await this.page.waitForTimeout(1500);
  }

  /**
   * Navigate to the admin dashboard.
   */
  async gotoAdmin() {
    await this.page.goto('https://app.prople.pro/admin', {
      waitUntil: 'domcontentloaded',
      timeout: 20000,
    });
    await this.page.waitForTimeout(1500);
  }

  // ── Actions ────────────────────────────────────────────────────────────────

  /** Click Clock In if visible (only shown when employee hasn't clocked in today) */
  async clockIn() {
    await this.clockInButton.waitFor({ state: 'visible', timeout: 5000 });
    await this.clockInButton.click();
  }

  /** Click the first Show button in the Pending Leave Requests table */
  async clickFirstShowButton() {
    await this.showButtons.first().waitFor({ state: 'visible', timeout: 5000 });
    await this.showButtons.first().click();
  }

  /** Close any open modal dialog */
  async closeModal() {
    await this.modalCloseButton.waitFor({ state: 'visible', timeout: 5000 });
    await this.modalCloseButton.click();
  }

  /** Click "View All" in the Pending Leave Requests section */
  async clickViewAllLeaves() {
    await this.viewAllLeavesLink.waitFor({ state: 'visible', timeout: 5000 });
    await this.viewAllLeavesLink.click();
  }

  /** Click the "Open AI assistant" button inside the Meet Prople AI widget */
  async clickOpenAI() {
    try {
      await this.openAIButton.waitFor({ state: 'visible', timeout: 4000 });
      await this.openAIButton.click();
    } catch {
      // fallback to first aria-label match
      await this.openAIButtonFallback.click();
    }
  }
}

module.exports = { DashboardPage };