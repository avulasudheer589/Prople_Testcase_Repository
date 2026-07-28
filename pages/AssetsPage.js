// pages/AssetsPage.js
// Covers:
//   Employee My Assets  – /employee/assets  (search + filter, read-only)
//   Admin Assets        – /admin/assets     (full CRUD + lifecycle management)

class AssetsPage {
  /**
   * @param {import('@playwright/test').Page} page
   * @param {'employee'|'admin'} role
   */
  constructor(page, role = 'employee') {
    this.page = page;
    this.role = role;

    // Shared inputs
    this.searchInput = page.getByRole('searchbox')
      .or(page.getByPlaceholder(/search/i))
      .or(page.locator('input[type="search"], input[placeholder*="earch"]'))
      .first();

    this.categoryFilter = page.getByRole('combobox', { name: /category|type|filter/i })
      .or(page.locator('select'))
      .first();

    // Admin – top actions
    this.addAssetButton = page.getByRole('button', { name: /add asset|new asset|\+ asset/i })
      .or(page.getByText(/add asset|\+ asset/i))
      .first();

    // Admin – status tabs (handles tab role, button, link, or text fallback)
    this.allTab = page.getByRole('tab', { name: /^all/i })
      .or(page.getByRole('button', { name: /^all/i }))
      .or(page.getByText(/^all$/i))
      .first();

    this.availableTab = page.getByRole('tab', { name: /available/i })
      .or(page.getByRole('button', { name: /available/i }))
      .or(page.getByText(/available/i))
      .first();

    this.assignedTab = page.getByRole('tab', { name: /assigned/i })
      .or(page.getByRole('button', { name: /assigned/i }))
      .or(page.getByText(/assigned/i))
      .first();

    this.maintenanceTab = page.getByRole('tab', { name: /maintenance/i })
      .or(page.getByRole('button', { name: /maintenance/i }))
      .or(page.getByText(/maintenance/i))
      .first();

    this.retiredTab = page.getByRole('tab', { name: /retired/i })
      .or(page.getByRole('button', { name: /retired/i }))
      .or(page.getByText(/retired/i))
      .first();

    // Admin – row actions
    this.assignButtons = page.getByRole('button', { name: /^assign$/i });
    this.maintenanceButtons = page.getByRole('button', { name: /maintenance/i });
    this.retireButtons = page.getByRole('button', { name: /^retire$/i });
    this.editButtons = page.getByRole('button', { name: /^edit$/i });
    this.historyButtons = page.getByRole('button', { name: /history/i });

    // ---- New Asset dialog ----
    this.assetNameInput = page.getByLabel(/asset name|name/i)
      .or(page.getByPlaceholder(/asset name|name/i))
      .or(page.locator('input[name="name"], input[name="assetName"]'))
      .first();

    this.assetTypeDropdown = page.getByRole('combobox', { name: /asset type|type|category/i })
      .or(page.getByLabel(/asset type|type/i))
      .or(page.locator('select'))
      .first();

    this.assetTagInput = page.getByLabel(/asset tag|tag/i)
      .or(page.getByPlaceholder(/asset tag|tag/i))
      .or(page.locator('input[name="tag"], input[name="assetTag"]'))
      .first();

    this.serialInput = page.getByLabel(/serial/i)
      .or(page.getByPlaceholder(/serial/i))
      .or(page.locator('input[name="serial"], input[name="serialNumber"]'))
      .first();

    this.purchaseDateInput = page.getByLabel(/purchase date|purchased/i)
      .or(page.getByPlaceholder(/purchase/i))
      .or(page.locator('input[type="date"]'))
      .first();

    this.warrantyInput = page.getByLabel(/warranty/i)
      .or(page.getByPlaceholder(/warranty/i))
      .first();

    this.purchasedFromInput = page.getByLabel(/purchased from|vendor/i)
      .or(page.getByPlaceholder(/purchased from|vendor/i))
      .first();

    this.notesTextarea = page.getByLabel(/description|notes|remarks/i)
      .or(page.getByPlaceholder(/description|notes|remarks/i))
      .or(page.locator('textarea'))
      .first();

    this.createButton = page.getByRole('button', { name: /^create$|^add$|^save$/i }).first();
    this.closeButton = page.getByRole('button', { name: /close|cancel|×/i })
      .or(page.locator('button.close, button[aria-label="Close"]'))
      .first();

    // ---- Assign dialog ----
    this.assignEmployeeInput = page.getByRole('textbox', { name: /search employee/i })
      .or(page.getByPlaceholder(/search employee/i))
      .first();
    this.assignDateInput = page.getByLabel(/assign date/i).or(page.locator('input[type="date"]')).first();
    this.assignNoteInput = page.getByLabel(/note/i).or(page.getByPlaceholder(/note/i)).first();
    this.confirmAssignButton = page.getByRole('button', { name: /^assign$/i }).last();

    // ---- Retire dialog ----
    this.retireReasonTextarea = page.getByLabel(/reason/i).or(page.getByPlaceholder(/reason/i)).first();
    this.retireAssetButton = page.getByRole('button', { name: /retire asset|retire/i }).last();
  }

  async goto() {
    const path = this.role === 'admin' ? '/admin/assets' : '/employee/assets';
    await this.page.goto(path);
    await this.page.waitForLoadState('domcontentloaded').catch(() => {});
  }

  async search(text) {
    await this.searchInput.fill(text);
  }

  async filterByCategory(category) {
    await this.categoryFilter.selectOption(category);
  }

  // ─── Admin actions ──────────────────────────────────────────────────────────

  async openAddAssetDialog() {
    await this.addAssetButton.click();
  }

  /**
   * Create a new asset.
   * @param {{ name, type, tag, serial, purchaseDate, warranty, purchasedFrom, notes }} data
   */
  async createAsset({ name, type, tag, serial, purchaseDate, warranty, purchasedFrom, notes }) {
    await this.openAddAssetDialog();
    await this.assetNameInput.fill(name);
    await this.assetTypeDropdown.selectOption({ label: type });
    await this.assetTagInput.fill(tag);
    await this.serialInput.fill(serial);
    await this.purchaseDateInput.fill(purchaseDate);
    await this.warrantyInput.fill(warranty);
    await this.purchasedFromInput.fill(purchasedFrom);
    await this.notesTextarea.fill(notes);
    await this.createButton.click();
  }

  async assignAsset(rowIndex = 0, employeeName, assignDate) {
    await this.assignButtons.nth(rowIndex).click();
    await this.assignEmployeeInput.fill(employeeName);
    await this.page.getByRole('option', { name: employeeName }).click();
    await this.assignDateInput.fill(assignDate);
    await this.confirmAssignButton.click();
  }

  async sendForMaintenance(rowIndex = 0) {
    await this.maintenanceButtons.nth(rowIndex).click();
  }

  async retireAsset(rowIndex = 0, reason) {
    await this.retireButtons.nth(rowIndex).click();
    await this.retireReasonTextarea.fill(reason);
    await this.retireAssetButton.click();
  }

  async editAsset(rowIndex = 0) {
    await this.editButtons.nth(rowIndex).click();
  }

  async viewHistory(rowIndex = 0) {
    await this.historyButtons.nth(rowIndex).click();
  }

  async closeDialog() {
    await this.closeButton.click();
  }
}

module.exports = { AssetsPage };