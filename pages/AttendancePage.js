
// pages/AttendancePage.js
// Admin Attendance module – Master Logs, Adjustments, WFH Requests tabs.

class AttendancePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // Tabs
    this.masterLogsTab    = page.getByRole('tab', { name: /master logs/i });
    this.adjustmentsTab   = page.getByRole('tab', { name: /adjustments/i });
    this.wfhRequestsTab   = page.getByRole('tab', { name: /wfh requests/i });

    // Master Logs – quick filters
    this.allLogsFilter    = page.getByRole('button', { name: /all logs/i });
    this.clockedInFilter  = page.getByRole('button', { name: /clocked in/i });
    this.absentFilter     = page.getByRole('button', { name: /absent/i });

    // Shared inputs
    this.statusDropdown   = page.getByRole('combobox').first();
    this.searchInput      = page.getByRole('searchbox').first();
    this.downloadButton   = page.getByRole('button', { name: /download/i });

    // Adjustment / WFH row actions
    this.approveButtons   = page.getByRole('button', { name: /^approve$/i });
    this.rejectButtons    = page.getByRole('button', { name: /^reject$/i });
    this.undoButtons      = page.getByRole('button', { name: /^undo$/i });

    // CSV export (Master Logs rows)
    this.csvExportButtons = page.getByRole('button', { name: /csv/i });

    // Pagination
    this.prevButton       = page.getByRole('button', { name: /prev/i });
    this.nextButton       = page.getByRole('button', { name: /next/i });
  }

  async goto() {
    await this.page.goto('/admin/attendance');
  }

  async goToMasterLogs()  { await this.masterLogsTab.click();  }
  async goToAdjustments() { await this.adjustmentsTab.click(); }
  async goToWFHRequests() { await this.wfhRequestsTab.click(); }

  /** Filter status via the dropdown */
  async selectStatus(status) {
    await this.statusDropdown.selectOption(status);
  }

  /** Search by text (employee name / email / date / reason) */
  async search(text) {
    await this.searchInput.fill(text);
  }

  /** Approve the nth pending row (0-indexed) */
  async approveRow(index = 0) {
    await this.approveButtons.nth(index).click();
  }

  /** Reject the nth pending row (0-indexed) */
  async rejectRow(index = 0) {
    await this.rejectButtons.nth(index).click();
  }

  /** Undo the nth approved/rejected row (0-indexed) */
  async undoRow(index = 0) {
    await this.undoButtons.nth(index).click();
  }

  /** Export the nth master log row as CSV (0-indexed) */
  async exportCSV(index = 0) {
    await this.csvExportButtons.nth(index).click();
  }

  /** Download full attendance export */
  async downloadData() {
    await this.downloadButton.click();
  }
}

module.exports = { AttendancePage };