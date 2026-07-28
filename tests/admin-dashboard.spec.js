// tests/admin-dashboard.spec.js
// Admin Dashboard test cases.

const { test, expect }  = require('@playwright/test');
const { LoginPage }     = require('../pages/LoginPage');
const { DashboardPage } = require('../pages/DashboardPage');

test.describe('Admin Dashboard', () => {

  test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);
    await login.loginAsAdmin();
  });

  test('Admin lands on /admin after login', async ({ page }) => {
    await expect(page).toHaveURL(/\/admin/);
  });

  test('Pending Approvals cards are visible', async ({ page }) => {
    await expect(page.getByText(/pending approvals/i)).toBeVisible();
    await expect(page.getByText(/leaves/i)).toBeVisible();
    await expect(page.getByText(/wfh/i)).toBeVisible();
  });

  test('Clicking a Pending Approvals card navigates to the correct page', async ({ page }) => {
    // Click the "Leaves" approval card
    await page.getByText(/leaves/i).first().click();
    await expect(page).toHaveURL(/\/leaves/);
  });

  test('Pending Leave Requests section shows employee leave data', async ({ page }) => {
    await expect(page.getByText(/pending leave requests/i)).toBeVisible();
  });

  test('"Show" button opens employee profile modal', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    const showButtons = page.getByRole('button', { name: /show/i });
    const count = await showButtons.count();
    if (count > 0) {
      await showButtons.first().click();
      await expect(page.getByRole('dialog')).toBeVisible();
      await dashboard.closeModal();
    }
  });

  test('Upcoming Holiday widget is visible', async ({ page }) => {
    await expect(page.getByText(/upcoming holiday/i)).toBeVisible();
  });

  test('Admin does NOT see "Clock In" button', async ({ page }) => {
    const clockIn = page.getByRole('button', { name: /clock in/i });
    await expect(clockIn).not.toBeVisible();
  });

});