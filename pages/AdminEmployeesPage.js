// pages/AdminEmployeesPage.js
// Admin – Employees module (/admin/employees)

class AdminEmployeesPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // Top actions
    this.addEmployeeButton = page.getByRole('button', { name: /add employee/i });
    this.bulkAddButton     = page.getByRole('button', { name: /bulk add/i });
    this.exportButton      = page.getByRole('button', { name: /export/i });

    // Status tabs
    this.activeTab    = page.getByRole('tab', { name: /^active$/i });
    this.inactiveTab  = page.getByRole('tab', { name: /inactive/i });
    this.fullTimeTab  = page.getByRole('tab', { name: /full.?time/i });
    this.internsTab   = page.getByRole('tab', { name: /interns/i });

    // Filters
    this.departmentDropdown = page.getByRole('combobox', { name: /department/i });
    this.searchByName       = page.getByRole('searchbox', { name: /search employees by name/i });
    this.advancedSearch     = page.getByRole('searchbox', { name: /search name, email/i });

    // Row actions
    this.viewButtons = page.getByRole('button', { name: /view/i });

    // Pagination
    this.prevButton = page.getByRole('button', { name: /^prev$/i });
    this.nextButton = page.getByRole('button', { name: /^next$/i });

    // ---- Add Employee Dialog ----
    this.fullNameInput    = page.getByLabel(/full name/i);
    this.emailInput       = page.getByLabel(/^email$/i);
    this.phoneInput       = page.getByLabel(/^phone$/i);
    this.positionInput    = page.getByLabel(/position/i);
    this.departmentSelect = page.getByRole('combobox', { name: /^department$/i });
    this.tempPwdInput     = page.getByLabel(/temp password/i);
    this.createEmpButton  = page.getByRole('button', { name: /create employee/i });
    this.cancelButton     = page.getByRole('button', { name: /^cancel$/i });
    this.closeButton      = page.getByRole('button', { name: /^close$/i });

    // Employee Detail Modal tabs
    this.personalTab    = page.getByRole('tab', { name: /personal/i });
    this.workTab        = page.getByRole('tab', { name: /^work$/i });
    this.bankTab        = page.getByRole('tab', { name: /bank.*compliance/i });
    this.documentsTab   = page.getByRole('tab', { name: /documents/i });
    this.assetsTab      = page.getByRole('tab', { name: /assets/i });
    this.attendanceTab  = page.getByRole('tab', { name: /attendance/i });
    this.leavesTab      = page.getByRole('tab', { name: /leaves/i });
    this.payslipsTab    = page.getByRole('tab', { name: /payslips/i });
    this.careerTab      = page.getByRole('tab', { name: /career/i });
    this.historyTab     = page.getByRole('tab', { name: /history/i });

    // Detail modal save
    this.saveButton = page.getByRole('button', { name: /^save$/i });
  }

  async goto() {
    await this.page.goto('/admin/employees');
  }

  /** Open the Add Employee dialog */
  async openAddDialog() {
    await this.addEmployeeButton.click();
  }

  /**
   * Create a new employee with required fields.
   * @param {{ fullName, email, phone, position, department, tempPassword }} data
   */
  async createEmployee({ fullName, email, phone, position, department, tempPassword }) {
    await this.openAddDialog();
    await this.fullNameInput.fill(fullName);
    await this.emailInput.fill(email);
    await this.phoneInput.fill(phone);
    await this.positionInput.fill(position);
    await this.departmentSelect.selectOption({ label: department });
    await this.tempPwdInput.fill(tempPassword);
    await this.createEmpButton.click();
  }

  /** Open the detail modal for the nth employee row */
  async viewEmployee(index = 0) {
    await this.viewButtons.nth(index).click();
  }

  /** Filter by department */
  async filterByDepartment(department) {
    await this.departmentDropdown.selectOption({ label: department });
  }

  /** Search by name or email */
  async searchByEmployee(text) {
    await this.searchByName.fill(text);
  }

  async closeDialog() {
    await this.closeButton.click();
  }
}

module.exports = { AdminEmployeesPage };