// pages/DocumentsPage.js
// Documents module – employee view (/employee/documents) and admin view (/admin/documents).

class DocumentsPage {
  /**
   * @param {import('@playwright/test').Page} page
   * @param {'employee'|'admin'} role
   */
  constructor(page, role = 'employee') {
    this.page = page;
    this.role = role;

    // ---- Employee View ----
    this.uploadButton = page.getByRole('button', { name: /upload/i });

    // Upload dialog
    this.typeDropdown  = page.getByRole('combobox', { name: /type/i });
    this.fileInput     = page.getByLabel(/file/i);
    this.submitButton  = page.getByRole('button', { name: /^submit$/i });
    this.closeButton   = page.getByRole('button', { name: /^close$/i });

    // View (eye icon) buttons
    this.viewButtons   = page.getByRole('button', { name: /view/i });

    // ---- Admin View ----
    this.pendingTab    = page.getByRole('tab', { name: /pending/i });
    this.approvedTab   = page.getByRole('tab', { name: /approved/i });
    this.rejectedTab   = page.getByRole('tab', { name: /rejected/i });
    this.allTab        = page.getByRole('tab', { name: /^all$/i });

    this.searchInput   = page.getByRole('searchbox');

    this.approveButtons = page.getByRole('button', { name: /^approve$/i });
    this.rejectButtons  = page.getByRole('button', { name: /^reject$/i });
    this.deleteButtons  = page.getByRole('button', { name: /^delete$/i });
    this.downloadButton = page.getByRole('button', { name: /download/i });
  }

  async goto() {
    const path = this.role === 'admin' ? '/admin/documents' : '/employee/documents';
    await this.page.goto(path);
  }

  // ─── Employee actions ───────────────────────────────────────────────────────

  /** Upload a document (employee view) */
  async uploadDocument(type, filePath) {
    await this.uploadButton.click();
    await this.typeDropdown.selectOption({ label: type });
    await this.fileInput.setInputFiles(filePath);
    await this.submitButton.click();
  }

  /** Preview/view a document row by index (employee view) */
  async viewDocument(index = 0) {
    await this.viewButtons.nth(index).click();
  }

  // ─── Admin actions ──────────────────────────────────────────────────────────

  /** Search documents by employee name / type / filename */
  async search(text) {
    await this.searchInput.fill(text);
  }

  /** Approve the nth pending document */
  async approveDocument(index = 0) {
    await this.approveButtons.nth(index).click();
  }

  /** Reject the nth pending document */
  async rejectDocument(index = 0) {
    await this.rejectButtons.nth(index).click();
  }

  /** Delete a document by index */
  async deleteDocument(index = 0) {
    await this.deleteButtons.nth(index).click();
  }

  async closeDialog() {
    await this.closeButton.click();
  }
}

module.exports = { DocumentsPage };