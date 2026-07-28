// pages/PayrollPage.js
// Admin – Payroll (/admin/payroll)
// Tabs: Overview | Expense Claims | Run Payroll

class PayrollPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // Main tabs
    this.overviewTab       = page.getByRole('tab', { name: /overview/i });
    this.expenseClaimsTab  = page.getByRole('tab', { name: /expense claims/i });
    this.runPayrollTab     = page.getByRole('tab', { name: /run payroll/i });

    // Overview tab
    this.allPeriodsDropdown   = page.getByRole('combobox', { name: /all periods/i });
    this.payrollPolicyButton  = page.getByRole('button', { name: /payroll policy/i });

    // Expense Claims tab
    this.pendingFilter  = page.getByRole('button', { name: /^pending/i });
    this.approvedFilter = page.getByRole('button', { name: /^approved/i });
    this.rejectedFilter = page.getByRole('button', { name: /^rejected/i });
    this.allFilter      = page.getByRole('button', { name: /^all$/i });
    this.expenseRowMenu = page.getByRole('button', { name: /actions/i });

    // Expense Claims pagination
    this.prevButton = page.getByRole('button', { name: /^prev$/i });
    this.nextButton = page.getByRole('button', { name: /^next$/i });

    // Run Payroll tab
    this.periodInput      = page.getByLabel(/^period$/i);
    this.searchEmpInput   = page.getByRole('searchbox', { name: /search employees/i });
    this.selectAllButton  = page.getByRole('button', { name: /select all/i });
    this.clearButton      = page.getByRole('button', { name: /^clear$/i });
    this.employeeCheckboxes = page.getByRole('checkbox');

    // Policy modal close
    this.closeButton = page.getByRole('button', { name: /close/i });
  }

  async goto() {
    await this.page.goto('/admin/payroll');
  }

  async goToOverview()      { await this.overviewTab.click();      }
  async goToExpenseClaims() { await this.expenseClaimsTab.click(); }
  async goToRunPayroll()    { await this.runPayrollTab.click();     }

  async filterByPeriod(period) {
    await this.allPeriodsDropdown.selectOption(period);
  }

  async openPayrollPolicy() {
    await this.payrollPolicyButton.click();
  }

  /** Select employees for payroll run by employee name */
  async searchAndSelectEmployee(name) {
    await this.searchEmpInput.fill(name);
    await this.page.getByRole('checkbox').first().check();
  }

  async selectAllEmployees() {
    await this.selectAllButton.click();
  }

  async clearSelection() {
    await this.clearButton.click();
  }

  async setPeriod(period) {
    await this.periodInput.fill(period);
  }

  async closeDialog() {
    await this.closeButton.click();
  }
}

module.exports = { PayrollPage };