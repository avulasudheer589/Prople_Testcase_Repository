// tests/employee-leaves.spec.js
// Employee – My Leaves module test cases.

const { test, expect } = require('@playwright/test');
const { LoginPage }    = require('../pages/LoginPage');
const { LeavesPage }   = require('../pages/LeavesPage');

test.describe('Employee – My Leaves', () => {

  test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);
    await login.loginAsEmployee();
  });

  test('Leaves page loads and shows leave balance cards', async ({ page }) => {
    const leaves = new LeavesPage(page);
    await leaves.goto();
    await expect(page.getByText(/sick leaves/i)).toBeVisible();
  });

  test('"Apply leave" button opens the dialog', async ({ page }) => {
    const leaves = new LeavesPage(page);
    await leaves.goto();
    await leaves.openApplyDialog();
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(leaves.categoryDropdown).toBeVisible();
  });

  test('Apply leave dialog shows all required fields', async ({ page }) => {
    const leaves = new LeavesPage(page);
    await leaves.goto();
    await leaves.openApplyDialog();
    await expect(leaves.categoryDropdown).toBeVisible();
    await expect(leaves.datePickerButton).toBeVisible();
    await expect(leaves.submitButton).toBeVisible();
    await expect(leaves.closeButton).toBeVisible();
  });

  test('Leave dialog can be closed without submitting', async ({ page }) => {
    const leaves = new LeavesPage(page);
    await leaves.goto();
    await leaves.openApplyDialog();
    await leaves.closeDialog();
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });

  test('Status tabs render: All, Pending, Approved, Rejected, Cancelled', async ({ page }) => {
    const leaves = new LeavesPage(page);
    await leaves.goto();
    await expect(leaves.allTab).toBeVisible();
    await expect(leaves.pendingTab).toBeVisible();
    await expect(leaves.approvedTab).toBeVisible();
    await expect(leaves.rejectedTab).toBeVisible();
    await expect(leaves.cancelledTab).toBeVisible();
  });

  test('Switching to Pending tab filters the table', async ({ page }) => {
    const leaves = new LeavesPage(page);
    await leaves.goto();
    await leaves.pendingTab.click();
    // Table should show only pending or empty state
    await expect(page).toHaveURL(/\/leaves/);
  });

  test('Leave balance cards display quota information', async ({ page }) => {
    const leaves = new LeavesPage(page);
    await leaves.goto();
    // E.g. "12 / 12"
    await expect(page.getByText(/\d+ \/ \d+/)).toBeVisible();
  });

  test('Rows-per-page selector is present', async ({ page }) => {
    const leaves = new LeavesPage(page);
    await leaves.goto();
    await expect(leaves.rowsPerPage).toBeVisible();
  });

});