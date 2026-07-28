// pages/AdminLeavesPage.js
// Admin – Leaves module (/admin/leaves)
// Tabs: Requests | Categories | Leave Setup | Holidays

class AdminLeavesPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // Module-level tabs
    this.requestsTab   = page.getByRole('tab', { name: /requests/i });
    this.categoriesTab = page.getByRole('tab', { name: /categories/i });
    this.leaveSetupTab = page.getByRole('tab', { name: /leave setup/i });
    this.holidaysTab   = page.getByRole('tab', { name: /holidays/i });

    // ── Requests Tab ──────────────────────────────────────────────
    // Status filter buttons
    this.allFilter       = page.getByRole('button', { name: /^all/i });
    this.pendingFilter   = page.getByRole('button', { name: /^pending/i });
    this.approvedFilter  = page.getByRole('button', { name: /^approved/i });
    this.rejectedFilter  = page.getByRole('button', { name: /^rejected/i });
    this.cancelledFilter = page.getByRole('button', { name: /cancelled/i });

    this.searchInput   = page.getByRole('searchbox');

    // Row actions
    this.approveButtons  = page.getByRole('button', { name: /^approve$/i });
    this.rejectButtons   = page.getByRole('button', { name: /^reject$/i });
    this.undoButtons     = page.getByRole('button', { name: /^undo$/i });
    this.viewDatesButton = page.getByRole('button', { name: /view dates/i });
    this.viewFullButton  = page.getByRole('button', { name: /view full/i });

    // ── Categories Tab ────────────────────────────────────────────
    this.newCategoryButton = page.getByRole('button', { name: /new category/i });
    this.editCatButtons    = page.getByRole('button', { name: /edit/i });
    this.deleteCatButtons  = page.getByRole('button', { name: /delete/i });

    // New/Edit Category dialog
    this.catNameInput      = page.getByLabel(/^name$/i);
    this.catPeriodDropdown = page.getByRole('combobox', { name: /period/i });
    this.monthlyQtyInput   = page.getByLabel(/monthly qty/i);
    this.yearlyQtyInput    = page.getByLabel(/yearly qty/i);
    this.carryToggle       = page.getByLabel(/carry forward/i);
    this.specialToggle     = page.getByLabel(/special/i);
    this.createCatButton   = page.getByRole('button', { name: /^create$/i });
    this.saveCatButton     = page.getByRole('button', { name: /^save$/i });

    // ── Leave Setup Tab ───────────────────────────────────────────
    this.setupButtons      = page.getByRole('button', { name: /^setup$/i });
    this.assignManyButton  = page.getByRole('button', { name: /assign to many/i });
    this.categoryCheckboxes = page.getByRole('checkbox');
    this.saveSetupButton   = page.getByRole('button', { name: /^save$/i });

    // ── Holidays Tab ──────────────────────────────────────────────
    this.templateCSVButton  = page.getByRole('button', { name: /template csv/i });
    this.bulkUploadCSVButton= page.getByRole('button', { name: /bulk upload csv/i });
    this.editHolidayButtons = page.getByRole('button', { name: /edit/i });
    this.delHolidayButtons  = page.getByRole('button', { name: /delete/i });

    // Edit Holiday dialog
    this.holidayTitleInput  = page.getByLabel(/^title$/i);
    this.holidayDateInput   = page.getByLabel(/^date$/i);

    this.closeButton = page.getByRole('button', { name: /close/i });
  }

  async goto() {
    await this.page.goto('/admin/leaves');
  }

  // ── Requests ────────────────────────────────────────────────────

  async goToRequests()  { await this.requestsTab.click();   }
  async goToCategories(){ await this.categoriesTab.click(); }
  async goToLeaveSetup(){ await this.leaveSetupTab.click(); }
  async goToHolidays()  { await this.holidaysTab.click();   }

  async approveRequest(index = 0) { await this.approveButtons.nth(index).click(); }
  async rejectRequest(index = 0)  { await this.rejectButtons.nth(index).click();  }
  async undoRequest(index = 0)    { await this.undoButtons.nth(index).click();    }

  // ── Categories ──────────────────────────────────────────────────

  async createCategory({ name, period, monthlyQty, yearlyQty }) {
    await this.newCategoryButton.click();
    await this.catNameInput.fill(name);
    if (period)     await this.catPeriodDropdown.selectOption({ label: period });
    if (monthlyQty) await this.monthlyQtyInput.fill(String(monthlyQty));
    if (yearlyQty)  await this.yearlyQtyInput.fill(String(yearlyQty));
    await this.createCatButton.click();
  }

  async editCategory(index = 0) {
    await this.editCatButtons.nth(index).click();
  }

  async deleteCategory(index = 0) {
    await this.deleteCatButtons.nth(index).click();
  }

  // ── Leave Setup ─────────────────────────────────────────────────

  async openSetupForEmployee(index = 0) {
    await this.setupButtons.nth(index).click();
  }

  // ── Holidays ────────────────────────────────────────────────────

  async editHoliday(index = 0) {
    await this.editHolidayButtons.nth(index).click();
  }

  async deleteHoliday(index = 0) {
    await this.delHolidayButtons.nth(index).click();
  }

  async closeDialog() {
    await this.closeButton.click();
  }
}

module.exports = { AdminLeavesPage };