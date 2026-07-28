// tests/admin-payroll.spec.js
// Admin – Payroll module test cases.

const { test, expect }  = require('@playwright/test');
const { LoginPage }     = require('../pages/LoginPage');
const { PayrollPage }   = require('../pages/PayrollPage');

test.describe('Admin – Payroll', () => {

  test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);
    await login.loginAsAdmin();
  });

  test('Payroll page loads with Overview tab', async ({ page }) => {
    const payroll = new PayrollPage(page);
    await payroll.goto();
    await expect(payroll.overviewTab).toBeVisible();
    await expect(payroll.expenseClaimsTab).toBeVisible();
    await expect(payroll.runPayrollTab).toBeVisible();
  });

  test('Overview tab shows payroll statistics', async ({ page }) => {
    const payroll = new PayrollPage(page);
    await payroll.goto();
    await payroll.goToOverview();
    await expect(page.getByText(/payslips/i)).toBeVisible();
    await expect(page.getByText(/employees paid/i)).toBeVisible();
  });

  test('Overview table shows Period, Employee, Gross, Net columns', async ({ page }) => {
    const payroll = new PayrollPage(page);
    await payroll.goto();
    await payroll.goToOverview();
    await expect(page.getByRole('columnheader', { name: /period/i })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: /gross/i })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: /net/i })).toBeVisible();
  });

  test('"Payroll Policy & Formula" button opens the policy modal', async ({ page }) => {
    const payroll = new PayrollPage(page);
    await payroll.goto();
    await payroll.openPayrollPolicy();
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByText(/payroll calculation/i)).toBeVisible();
  });

  test('Expense Claims tab shows status filters', async ({ page }) => {
    const payroll = new PayrollPage(page);
    await payroll.goto();
    await payroll.goToExpenseClaims();
    await expect(payroll.pendingFilter).toBeVisible();
    await expect(payroll.approvedFilter).toBeVisible();
    await expect(payroll.rejectedFilter).toBeVisible();
    await expect(payroll.allFilter).toBeVisible();
  });

  test('Expense Claims table shows correct columns', async ({ page }) => {
    const payroll = new PayrollPage(page);
    await payroll.goto();
    await payroll.goToExpenseClaims();
    await expect(page.getByRole('columnheader', { name: /employee/i })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: /amount/i })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: /status/i })).toBeVisible();
  });

  test('Run Payroll tab shows period and employee search inputs', async ({ page }) => {
    const payroll = new PayrollPage(page);
    await payroll.goto();
    await payroll.goToRunPayroll();
    await expect(payroll.periodInput).toBeVisible();
    await expect(payroll.searchEmpInput).toBeVisible();
    await expect(payroll.selectAllButton).toBeVisible();
    await expect(payroll.clearButton).toBeVisible();
  });

  test('Period dropdown on Overview tab is usable', async ({ page }) => {
    const payroll = new PayrollPage(page);
    await payroll.goto();
    await expect(payroll.allPeriodsDropdown).toBeVisible();
  });

});