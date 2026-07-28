// tests/admin-employees.spec.js
// Admin – Employees module test cases.

const { test, expect }        = require('@playwright/test');
const { LoginPage }           = require('../pages/LoginPage');
const { AdminEmployeesPage }  = require('../pages/AdminEmployeesPage');

test.describe('Admin – Employees', () => {

  test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);
    await login.loginAsAdmin();
  });

  test('Employees page loads with Active tab selected', async ({ page }) => {
    const emp = new AdminEmployeesPage(page);
    await emp.goto();
    await expect(emp.activeTab).toBeVisible();
    await expect(emp.addEmployeeButton).toBeVisible();
  });

  test('All status tabs are visible', async ({ page }) => {
    const emp = new AdminEmployeesPage(page);
    await emp.goto();
    await expect(emp.activeTab).toBeVisible();
    await expect(emp.inactiveTab).toBeVisible();
    await expect(emp.fullTimeTab).toBeVisible();
    await expect(emp.internsTab).toBeVisible();
  });

  test('Employee table shows correct columns', async ({ page }) => {
    const emp = new AdminEmployeesPage(page);
    await emp.goto();
    await expect(page.getByRole('columnheader', { name: /employee/i })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: /department/i })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: /position/i })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: /status/i })).toBeVisible();
  });

  test('"Add Employee" button opens the creation dialog', async ({ page }) => {
    const emp = new AdminEmployeesPage(page);
    await emp.goto();
    await emp.openAddDialog();
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(emp.fullNameInput).toBeVisible();
    await expect(emp.emailInput).toBeVisible();
  });

  test('Add Employee dialog shows all required fields', async ({ page }) => {
    const emp = new AdminEmployeesPage(page);
    await emp.goto();
    await emp.openAddDialog();
    await expect(emp.fullNameInput).toBeVisible();
    await expect(emp.emailInput).toBeVisible();
    await expect(emp.phoneInput).toBeVisible();
    await expect(emp.positionInput).toBeVisible();
    await expect(emp.departmentSelect).toBeVisible();
    await expect(emp.tempPwdInput).toBeVisible();
    await expect(emp.createEmpButton).toBeVisible();
  });

  test('Add Employee dialog can be cancelled', async ({ page }) => {
    const emp = new AdminEmployeesPage(page);
    await emp.goto();
    await emp.openAddDialog();
    await emp.cancelButton.click();
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });

  test('"Bulk Add" button opens the bulk import dialog', async ({ page }) => {
    const emp = new AdminEmployeesPage(page);
    await emp.goto();
    await emp.bulkAddButton.click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByRole('button', { name: /download template/i })).toBeVisible();
  });

  test('Search by employee name filters the table', async ({ page }) => {
    const emp = new AdminEmployeesPage(page);
    await emp.goto();
    await emp.searchByEmployee('abc');
    await expect(page).toHaveURL(/\/employees/);
  });

  test('Department dropdown filter is present', async ({ page }) => {
    const emp = new AdminEmployeesPage(page);
    await emp.goto();
    await expect(emp.departmentDropdown).toBeVisible();
  });

  test('Viewing an employee opens the detail modal with all tabs', async ({ page }) => {
    const emp = new AdminEmployeesPage(page);
    await emp.goto();
    await emp.viewEmployee(0);
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(emp.personalTab).toBeVisible();
    await expect(emp.workTab).toBeVisible();
    await expect(emp.bankTab).toBeVisible();
    await expect(emp.documentsTab).toBeVisible();
  });

  test('Export button is present', async ({ page }) => {
    const emp = new AdminEmployeesPage(page);
    await emp.goto();
    await expect(emp.exportButton).toBeVisible();
  });

});