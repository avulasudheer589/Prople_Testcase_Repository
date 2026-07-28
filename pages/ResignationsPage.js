// pages/ResignationsPage.js
// Admin – Resignations (/admin/resignations)

class ResignationsPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // Status tabs
    this.allTab      = page.getByRole('tab', { name: /^all/i });
    this.pendingTab  = page.getByRole('tab', { name: /^pending/i });
    this.approvedTab = page.getByRole('tab', { name: /^approved/i });
    this.rejectedTab = page.getByRole('tab', { name: /^rejected/i });

    // Row action
    this.detailsButtons = page.getByRole('button', { name: /details/i });

    // Resignation detail modal – editable fields (pending only)
    this.noticePeriodInput  = page.getByLabel(/notice period/i);
    this.lastWorkingDayInput= page.getByLabel(/last working day/i);
    this.adminCommentInput  = page.getByLabel(/admin comment/i);

    // Modal actions
    this.approveButton = page.getByRole('button', { name: /^approve$/i });
    this.rejectButton  = page.getByRole('button', { name: /^reject$/i });
    this.closeButton   = page.getByRole('button', { name: /^close$/i });
  }

  async goto() {
    await this.page.goto('/admin/resignations');
  }

  /** Open the detail modal for a resignation row by index */
  async openDetails(index = 0) {
    await this.detailsButtons.nth(index).click();
  }

  /**
   * Approve a pending resignation.
   * @param {number} index  Row index in the table
   * @param {{ noticePeriod?, lastWorkingDay?, comment? }} data
   */
  async approveResignation(index = 0, { noticePeriod, lastWorkingDay, comment } = {}) {
    await this.pendingTab.click();
    await this.openDetails(index);
    if (noticePeriod)   await this.noticePeriodInput.fill(String(noticePeriod));
    if (lastWorkingDay) await this.lastWorkingDayInput.fill(lastWorkingDay);
    if (comment)        await this.adminCommentInput.fill(comment);
    await this.approveButton.click();
  }

  /**
   * Reject a pending resignation.
   * @param {number} index
   * @param {string} [comment]
   */
  async rejectResignation(index = 0, comment) {
    await this.pendingTab.click();
    await this.openDetails(index);
    if (comment) await this.adminCommentInput.fill(comment);
    await this.rejectButton.click();
  }

  async closeModal() {
    await this.closeButton.click();
  }
}

module.exports = { ResignationsPage };