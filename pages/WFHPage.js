// pages/WFHPage.js
// Employee Work From Home module – /employee/wfh

class WFHPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // Top-level action
    this.requestWFHButton = page.getByRole('button', { name: /request wfh/i });

    // Filter dropdown
    this.statusFilter = page.getByRole('combobox');

    // Table row actions
    this.showDateButtons = page.getByRole('button', { name: /show/i });
    this.cancelButtons   = page.getByRole('button', { name: /^cancel$/i });

    // ---- Request WFH Dialog ----
    this.selectDatesButton = page.getByRole('button', { name: /select multiple dates/i });
    this.reasonTextarea    = page.getByRole('textbox', { name: /reason/i });
    this.proofInput        = page.getByLabel(/proof/i);
    this.submitButton      = page.getByRole('button', { name: /submit/i });
    this.closeDialogButton = page.getByRole('button', { name: /close/i });

    // Pagination
    this.prevButton = page.getByRole('button', { name: /previous/i });
    this.nextButton = page.getByRole('button', { name: /next/i });
  }

  async goto() {
    await this.page.goto('/employee/wfh');
  }

  /** Open the "Request WFH" dialog */
  async openRequestDialog() {
    await this.requestWFHButton.click();
  }

  /**
   * Fill and submit a new WFH request.
   * Date selection in the calendar must be done by the caller before this helper,
   * or pass a callback `pickDates` that selects dates in the calendar.
   *
   * @param {string} reason
   * @param {Function|null} pickDates  – async callback to select dates in the picker
   */
  async submitWFHRequest(reason, pickDates = null) {
    await this.openRequestDialog();
    await this.selectDatesButton.click();
    if (pickDates) await pickDates(this.page);
    await this.reasonTextarea.fill(reason);
    await this.submitButton.click();
  }

  /** Filter the requests table by status */
  async filterByStatus(status) {
    await this.statusFilter.selectOption(status);
  }

  /** Click "show (1)" to expand dates for a row */
  async showDates(index = 0) {
    await this.showDateButtons.nth(index).click();
  }

  /** Cancel a pending WFH request by row index */
  async cancelRequest(index = 0) {
    await this.cancelButtons.nth(index).click();
  }

  /** Close any open dialog */
  async closeDialog() {
    await this.closeDialogButton.click();
  }
}

module.exports = { WFHPage };