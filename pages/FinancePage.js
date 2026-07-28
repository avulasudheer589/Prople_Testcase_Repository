// pages/FinancePage.js
// Employee Finance module – /employee/finance
// Tabs: Expense Claims | Payslips | Annual Salary

class FinancePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // Tabs
    this.expenseClaimsTab = page.getByRole('tab', { name: /expense claims/i });
    this.payslipsTab      = page.getByRole('tab', { name: /payslips/i });
    this.annualSalaryTab  = page.getByRole('tab', { name: /annual salary/i });

    // Expense Claims tab
    this.addExpenseButton = page.getByRole('button', { name: /add expense/i });

    // New Expense Claim dialog
    this.dateInput        = page.getByLabel(/^date$/i);
    this.categoryDropdown = page.getByRole('combobox', { name: /category/i });
    this.titleInput       = page.getByLabel(/^title$/i);
    this.amountInput      = page.getByLabel(/amount/i);
    this.attachmentInput  = page.getByLabel(/attachment/i);
    this.descriptionInput = page.getByLabel(/description/i);
    this.submitClaimBtn   = page.getByRole('button', { name: /submit claim/i });
    this.cancelButton     = page.getByRole('button', { name: /^cancel$/i });

    // Payslips tab
    this.pdfLinks         = page.getByRole('link', { name: /pdf/i });

    // Annual Salary tab
    this.showSalaryButton = page.getByRole('button', { name: /show salary/i });
  }

  async goto() {
    await this.page.goto('/employee/finance');
  }

  async goToExpenseClaims() { await this.expenseClaimsTab.click(); }
  async goToPayslips()      { await this.payslipsTab.click(); }
  async goToAnnualSalary()  { await this.annualSalaryTab.click(); }

  /**
   * Submit a new expense claim.
   * @param {{ date?, category?, title?, amount?, description? }} data
   */
  async submitExpenseClaim({ date, category, title, amount, description } = {}) {
    await this.addExpenseButton.click();
    if (date)        await this.dateInput.fill(date);
    if (category)    await this.categoryDropdown.selectOption({ label: category });
    if (title)       await this.titleInput.fill(title);
    if (amount)      await this.amountInput.fill(String(amount));
    if (description) await this.descriptionInput.fill(description);
    await this.submitClaimBtn.click();
  }

  /** Download the nth payslip PDF (0-indexed) */
  async downloadPayslip(index = 0) {
    await this.payslipsTab.click();
    await this.pdfLinks.nth(index).click();
  }

  /** Toggle the annual salary reveal */
  async revealAnnualSalary() {
    await this.annualSalaryTab.click();
    await this.showSalaryButton.click();
  }
}

module.exports = { FinancePage };