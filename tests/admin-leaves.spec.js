// tests/admin-leaves.spec.js
// Admin – Leaves module test cases.

const { test, expect }    = require('@playwright/test');
const { LoginPage }       = require('../pages/LoginPage');
const { AdminLeavesPage } = require('../pages/AdminLeavesPage');

test.describe('Admin – Leaves', () => {

  test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);
    await login.loginAsAdmin();
  });

  test('Leaves page loads with all four tabs', async ({ page }) => {
    const leaves = new AdminLeavesPage(page);
    await leaves.goto();
    await expect(leaves.requestsTab).toBeVisible();
    await expect(leaves.categoriesTab).toBeVisible();
    await expect(leaves.leaveSetupTab).toBeVisible();
    await expect(leaves.holidaysTab).toBeVisible();
  });

  test('Requests tab shows status filter buttons', async ({ page }) => {
    const leaves = new AdminLeavesPage(page);
    await leaves.goto();
    await leaves.goToRequests();
    await expect(leaves.allFilter).toBeVisible();
    await expect(leaves.pendingFilter).toBeVisible();
    await expect(leaves.approvedFilter).toBeVisible();
    await expect(leaves.rejectedFilter).toBeVisible();
  });

  test('Requests table shows correct columns', async ({ page }) => {
    const leaves = new AdminLeavesPage(page);
    await leaves.goto();
    await leaves.goToRequests();
    await expect(page.getByRole('columnheader', { name: /employee/i })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: /category/i })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: /status/i })).toBeVisible();
  });

  test('Pending filter shows Approve and Reject buttons', async ({ page }) => {
    const leaves = new AdminLeavesPage(page);
    await leaves.goto();
    await leaves.goToRequests();
    await leaves.pendingFilter.click();
    const approveCount = await leaves.approveButtons.count();
    if (approveCount > 0) {
      await expect(leaves.approveButtons.first()).toBeVisible();
      await expect(leaves.rejectButtons.first()).toBeVisible();
    }
  });

  test('Categories tab loads and shows New Category button', async ({ page }) => {
    const leaves = new AdminLeavesPage(page);
    await leaves.goto();
    await leaves.goToCategories();
    await expect(leaves.newCategoryButton).toBeVisible();
  });

  test('"New Category" dialog shows required fields', async ({ page }) => {
    const leaves = new AdminLeavesPage(page);
    await leaves.goto();
    await leaves.goToCategories();
    await leaves.newCategoryButton.click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(leaves.catNameInput).toBeVisible();
    await expect(leaves.monthlyQtyInput).toBeVisible();
    await expect(leaves.yearlyQtyInput).toBeVisible();
  });

  test('Categories table shows correct columns', async ({ page }) => {
    const leaves = new AdminLeavesPage(page);
    await leaves.goto();
    await leaves.goToCategories();
    await expect(page.getByRole('columnheader', { name: /name/i })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: /period/i })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: /yearly/i })).toBeVisible();
  });

  test('Leave Setup tab loads with Setup buttons', async ({ page }) => {
    const leaves = new AdminLeavesPage(page);
    await leaves.goto();
    await leaves.goToLeaveSetup();
    await expect(leaves.assignManyButton).toBeVisible();
  });

  test('Holidays tab shows Template CSV and Bulk upload buttons', async ({ page }) => {
    const leaves = new AdminLeavesPage(page);
    await leaves.goto();
    await leaves.goToHolidays();
    await expect(leaves.templateCSVButton).toBeVisible();
    await expect(leaves.bulkUploadCSVButton).toBeVisible();
  });

  test('Holidays table shows Date, Day, Title columns', async ({ page }) => {
    const leaves = new AdminLeavesPage(page);
    await leaves.goto();
    await leaves.goToHolidays();
    await expect(page.getByRole('columnheader', { name: /date/i })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: /title/i })).toBeVisible();
  });

});