// pages/DashboardPage.js
// Dashboard page object — Employee (/employee) and Admin (/admin).
// All locators use fuzzy matching to handle SPA rendering delays.

class DashboardPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // ── Clock In ────────────────────────────────────────────────────────────
    // Only visible when employee has NOT clocked in today
    this.clockInButton = page.getByRole('button', { name: 'Clock In' });

    // ── Sidebar Navigation ──────────────────────────────────────────────────
    // These links are always present on the employee dashboard
    this.sidebarLeavesLink      = page.getByRole('link', { name: /my leaves|leaves/i }).first();
    this.sidebarAttendanceLink  = page.getByRole('link', { name: /attendance/i }).first();
    this.sidebarWFHLink         = page.getByRole('link', { name: /work from home|wfh/i }).first();
    this.sidebarDocumentsLink   = page.getByRole('link', { name: /documents/i }).first();
    this.sidebarAssetsLink      = page.getByRole('link', { name: /assets/i }).first();
    this.sidebarFinanceLink     = page.getByRole('link', { name: /finance|payroll/i }).first();
    this.sidebarOrgTreeLink     = page.getByRole('link', { name: /org tree|organization/i }).first();
    this.sidebarInboxLink       = page.getByRole('link', { name: /inbox/i }).first();
    this.sidebarSupportLink     = page.getByRole('link', { name: /support/i }).first();
    this.sidebarAILink          = page.getByRole('link', { name: /ai|voice assistant/i }).first();

    // ── Header ──────────────────────────────────────────────────────────────
    this.header              = page.locator('header');
    this.headerProfileButton = page.locator('header').getByRole('button').last();

    // ── Admin Dashboard widgets ──────────────────────────────────────────────
    this.pendingLeaveHeading     = page.locator('*').filter({ hasText: /pending\s+leave\s+requests/i }).first();
    this.viewAllLeavesLink       = page.locator('a, button').filter({ hasText: /view\s+all/i }).first();
    this.upcomingHolidaySection  = page.locator('*').filter({ hasText: /upcoming\s+holiday/i }).first();
    this.pendingApprovalsSection = page.locator('*').filter({ hasText: /pending\s+approvals/i }).first();

    // ── Attendance Status ────────────────────────────────────────────────────
    this.notClockedInText = page.locator('*').filter({ hasText: /not clocked in/i }).first();
    this.clockedInText    = page.locator('*').filter({ hasText: /clocked in at/i }).first();

    // ── Misc ────────────────────────────────────────────────────────────────
    this.showButtons      = page.getByRole('button', { name: /^show$/i });
    this.modalCloseButton = page.getByRole('button', { name: /close/i });
  }

  // ── Navigation ─────────────────────────────────────────────────────────────

  /**
   * Navigate to the employee dashboard.
   * Uses domcontentloaded — NEVER networkidle (Prople SPA polls continuously).
   */
  async gotoEmployee() {
    await this.page.goto('https://app.prople.pro/employee', {
      waitUntil: 'domcontentloaded',
      timeout: 20000,
    });
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

  /** Navigate to AI page via sidebar link or direct URL fallback */
  async gotoAI() {
    const count = await this.sidebarAILink.count();
    if (count > 0 && await this.sidebarAILink.isVisible().catch(() => false)) {
      await this.sidebarAILink.click();
    } else {
      await this.page.goto('https://app.prople.pro/employee/ai', {
        waitUntil: 'domcontentloaded',
      });
    }
  }

  // ── Actions ────────────────────────────────────────────────────────────────

  /** Clock In — only call after confirming button is visible */
  async clockIn() {
    await this.clockInButton.waitFor({ state: 'visible', timeout: 5000 });
    await this.clockInButton.click();
  }

  /** Click first Show button in a table */
  async clickFirstShowButton() {
    await this.showButtons.first().waitFor({ state: 'visible', timeout: 5000 });
    await this.showButtons.first().click();
  }

  /** Close any open modal */
  async closeModal() {
    await this.modalCloseButton.waitFor({ state: 'visible', timeout: 5000 });
    await this.modalCloseButton.click();
  }

  /** Click View All in the Pending Leave Requests section */
  async clickViewAllLeaves() {
    await this.viewAllLeavesLink.waitFor({ state: 'visible', timeout: 5000 });
    await this.viewAllLeavesLink.click();
  }
}

module.exports = { DashboardPage };
