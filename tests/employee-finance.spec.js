// tests/employee-finance.spec.js
// Employee – Finance module test cases.

const { test, expect }  = require('@playwright/test');
const { LoginPage }     = require('../pages/LoginPage');
const { FinancePage }   = require('../pages/FinancePage');

test.describe('Employee – Finance', () => {

  test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);
    await login.loginAsEmployee();
  });

  test('Finance page loads and Expense Claims tab is active by default', async ({ page }) => {
    const finance = new FinancePage(page);
    await finance.goto();
    await expect(finance.expenseClaimsTab).toBeVisible();
    await expect(finance.addExpenseButton).toBeVisible();
  });

  test('"Add expense" opens the new expense dialog', async ({ page }) => {
    const finance = new FinancePage(page);
    await finance.goto();
    await finance.addExpenseButton.click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(finance.titleInput).toBeVisible();
    await expect(finance.amountInput).toBeVisible();
  });

  test('Expense dialog shows all fields', async ({ page }) => {
    const finance = new FinancePage(page);
    await finance.goto();
    await finance.addExpenseButton.click();
    await expect(finance.dateInput).toBeVisible();
    await expect(finance.categoryDropdown).toBeVisible();
    await expect(finance.titleInput).toBeVisible();
    await expect(finance.amountInput).toBeVisible();
    await expect(finance.descriptionInput).toBeVisible();
    await expect(finance.submitClaimBtn).toBeVisible();
  });

  test('Expense dialog can be cancelled without submitting', async ({ page }) => {
    const finance = new FinancePage(page);
    await finance.goto();
    await finance.addExpenseButton.click();
    await finance.cancelButton.click();
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });

  test('Switching to Payslips tab loads payslip data', async ({ page }) => {
    const finance = new FinancePage(page);
    await finance.goto();
    await finance.goToPayslips();
    await expect(page.getByText(/gross/i)).toBeVisible();
    await expect(page.getByText(/net/i)).toBeVisible();
  });

  test('Annual Salary tab has "Show salary" button', async ({ page }) => {
    const finance = new FinancePage(page);
    await finance.goto();
    await finance.goToAnnualSalary();
    await expect(finance.showSalaryButton).toBeVisible();
  });

  test('Clicking "Show salary" reveals the CTC', async ({ page }) => {
    const finance = new FinancePage(page);
    await finance.goto();
    await finance.revealAnnualSalary();
    await expect(page.getByText(/annual ctc|₹/i)).toBeVisible();
  });

  test('Expense Claims table shows correct columns', async ({ page }) => {
    const finance = new FinancePage(page);
    await finance.goto();
    await expect(page.getByRole('columnheader', { name: /date/i })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: /amount/i })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: /status/i })).toBeVisible();
  });

});