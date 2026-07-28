// pages/DashboardPage.js
// Dashboard page object — works for both Employee (/employee) and Admin (/admin).

class DashboardPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // ── Employee Dashboard widgets ──────────────────────────────────────────
    // "Today's Attendance" section — restricted to employee (abc1@gmail.com)
    this.clockInButton = page.getByRole('button', { name: 'Clock In' });
    this.todaysAttendanceSection = page.getByText("Today's Attendance", { exact: true });

    // "Pending Leave Requests" section
    this.pendingLeaveHeading = page.getByText('Pending Leave Requests', { exact: true });

    // "View All" links — scoped by their parent section to avoid ambiguity
    // There are multiple "View All" links; we scope each to its section heading
    this.viewAllLeavesLink = page.getByRole('link', { name: /view all/i }).first();

    // "Upcoming Holiday" widget
    this.upcomingHolidaySection = page.getByText('Upcoming Holiday', { exact: true });

    // "Meet Prople AI" section — the widget, not the fixed footer button
    this.openAIButton = page
      .locator('section, div')
      .filter({ hasText: /meet prople ai/i })
      .getByRole('button', { name: /open ai assistant/i });

    // Fallback: aria-label on the button itself
    this.openAIButtonFallback = page.getByRole('button', { name: 'Open AI assistant' }).first();

    // Show buttons inside Pending Leave Requests table rows
    this.showButtons = page.getByRole('button', { name: /show/i });

    // Modal close button
    this.modalCloseButton = page.getByRole('button', { name: /close/i });

    // ── Admin Dashboard additional ──────────────────────────────────────────
    this.pendingApprovalsSection = page.getByText('Pending Approvals', { exact: true });
  }

  // ── Navigation ─────────────────────────────────────────────────────────────

  /**
   * Navigate to the employee dashboard.
   * Waits for the page to fully settle (handles internal redirects like
   * /employee → /employee/dashboard or /employee with dynamic loading).
   */
  async gotoEmployee() {
    // navigate and wait for network to be idle so all redirects complete
    await this.page.goto('https://app.prople.pro/employee', {
      waitUntil: 'networkidle',
    });
  }

  /**
   * Navigate to the admin dashboard.
   */
  async gotoAdmin() {
    await this.page.goto('https://app.prople.pro/admin', {
      waitUntil: 'networkidle',
    });
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