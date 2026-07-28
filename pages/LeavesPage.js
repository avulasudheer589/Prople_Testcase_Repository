// pages/LeavesPage.js
// Employee My Leaves module – /employee/leaves

class LeavesPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // Top-level actions
    this.applyLeaveButton = page.getByRole('button', { name: /apply leave/i });

    // Status tabs
    this.allTab       = page.getByRole('tab', { name: /^all$/i });
    this.pendingTab   = page.getByRole('tab', { name: /^pending$/i });
    this.approvedTab  = page.getByRole('tab', { name: /^approved$/i });
    this.rejectedTab  = page.getByRole('tab', { name: /^rejected$/i });
    this.cancelledTab = page.getByRole('tab', { name: /^cancelled$/i });

    // Rows per page
    this.rowsPerPage = page.getByRole('combobox', { name: /rows/i });

    // Row actions
    this.viewDatesButtons = page.getByRole('button', { name: /view dates/i });
    this.editButtons      = page.getByRole('button', { name: /^edit$/i });
    this.cancelButtons    = page.getByRole('button', { name: /^cancel$/i });

    // ---- Apply / Edit Leave Dialog ----
    this.optionalHolidayCheckbox = page.getByLabel(/apply optional holiday/i);
    this.categoryDropdown        = page.getByRole('combobox', { name: /category/i });
    this.datePickerButton        = page.getByRole('button',   { name: /pick the leave dates/i });
    this.reasonTextarea          = page.getByRole('textbox',  { name: /reason/i });
    this.proofInput              = page.getByLabel(/proof/i);
    this.submitButton            = page.getByRole('button',   { name: /^submit$/i });
    this.saveChangesButton       = page.getByRole('button',   { name: /save changes/i });
    this.closeButton             = page.getByRole('button',   { name: /^close$/i });
  }

  async goto() {
    await this.page.goto('/employee/leaves');
  }

  /** Open the "Apply leave" dialog */
  async openApplyDialog() {
    await this.applyLeaveButton.click();
  }

  /**
   * Apply a new leave.
   * @param {string} category   – leave category label (e.g. "Sick Leaves")
   * @param {Function} pickDates – async callback that selects dates in the picker
   * @param {string} [reason]
   */
  async applyLeave(category, pickDates, reason = '') {
    await this.openApplyDialog();
    await this.categoryDropdown.selectOption({ label: category });
    await this.datePickerButton.click();
    await pickDates(this.page);
    if (reason) await this.reasonTextarea.fill(reason);
    await this.submitButton.click();
  }

  /** Edit the nth pending leave (0-indexed) */
  async editLeave(index = 0) {
    await this.pendingTab.click();
    await this.editButtons.nth(index).click();
  }

  /** Cancel the nth pending leave (0-indexed) */
  async cancelLeave(index = 0) {
    await this.pendingTab.click();
    await this.cancelButtons.nth(index).click();
  }

  /** View dates for any row */
  async viewDates(index = 0) {
    await this.viewDatesButtons.nth(index).click();
  }

  async closeDialog() {
    await this.closeButton.click();
  }
}

module.exports = { LeavesPage };