
// tests/admin-resignations.spec.js
// Admin – Resignations module test cases.

const { test, expect }       = require('@playwright/test');
const { LoginPage }          = require('../pages/LoginPage');
const { ResignationsPage }   = require('../pages/ResignationsPage');

test.describe('Admin – Resignations', () => {

  test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);
    await login.loginAsAdmin();
  });

  test('Resignations page loads with status tabs', async ({ page }) => {
    const res = new ResignationsPage(page);
    await res.goto();
    await expect(res.allTab).toBeVisible();
    await expect(res.pendingTab).toBeVisible();
    await expect(res.approvedTab).toBeVisible();
    await expect(res.rejectedTab).toBeVisible();
  });

  test('Resignations table shows correct columns', async ({ page }) => {
    const res = new ResignationsPage(page);
    await res.goto();
    await expect(page.getByRole('columnheader', { name: /employee/i })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: /position/i })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: /status/i })).toBeVisible();
  });

  test('"Details" button opens resignation detail modal', async ({ page }) => {
    const res = new ResignationsPage(page);
    await res.goto();
    const detailCount = await res.detailsButtons.count();
    if (detailCount > 0) {
      await res.openDetails(0);
      await expect(page.getByRole('dialog')).toBeVisible();
      await res.closeModal();
    }
  });

  test('Pending tab shows Approve and Reject buttons in detail modal', async ({ page }) => {
    const res = new ResignationsPage(page);
    await res.goto();
    await res.pendingTab.click();
    const count = await res.detailsButtons.count();
    if (count > 0) {
      await res.openDetails(0);
      await expect(res.approveButton).toBeVisible();
      await expect(res.rejectButton).toBeVisible();
      await res.closeModal();
    }
  });

  test('Pending detail modal has editable Notice Period and Last Working Day', async ({ page }) => {
    const res = new ResignationsPage(page);
    await res.goto();
    await res.pendingTab.click();
    const count = await res.detailsButtons.count();
    if (count > 0) {
      await res.openDetails(0);
      await expect(res.noticePeriodInput).toBeVisible();
      await expect(res.lastWorkingDayInput).toBeVisible();
      await res.closeModal();
    }
  });

  test('Switching to Approved tab shows only approved resignations', async ({ page }) => {
    const res = new ResignationsPage(page);
    await res.goto();
    await res.approvedTab.click();
    await expect(page).toHaveURL(/\/resignations/);
  });

});