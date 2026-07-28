// tests/employee-wfh.spec.js
// Employee – Work From Home module test cases.

const { test, expect } = require('@playwright/test');
const { LoginPage }    = require('../pages/LoginPage');
const { WFHPage }      = require('../pages/WFHPage');

test.describe('Employee – Work From Home', () => {

  test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);
    await login.loginAsEmployee();
  });

  test('WFH page loads with statistics cards', async ({ page }) => {
    const wfh = new WFHPage(page);
    await wfh.goto();
    await expect(page.getByText(/total/i)).toBeVisible();
    await expect(page.getByText(/pending/i)).toBeVisible();
    await expect(page.getByText(/approved/i)).toBeVisible();
  });

  test('"Request WFH" button opens the request dialog', async ({ page }) => {
    const wfh = new WFHPage(page);
    await wfh.goto();
    await wfh.openRequestDialog();
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(wfh.selectDatesButton).toBeVisible();
    await expect(wfh.reasonTextarea).toBeVisible();
  });

  test('WFH dialog can be closed without submitting', async ({ page }) => {
    const wfh = new WFHPage(page);
    await wfh.goto();
    await wfh.openRequestDialog();
    await wfh.closeDialog();
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });

  test('WFH requests table shows correct columns', async ({ page }) => {
    const wfh = new WFHPage(page);
    await wfh.goto();
    await expect(page.getByRole('columnheader', { name: /days/i })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: /reason/i })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: /status/i })).toBeVisible();
  });

  test('Status filter dropdown exists and is interactive', async ({ page }) => {
    const wfh = new WFHPage(page);
    await wfh.goto();
    await expect(wfh.statusFilter).toBeVisible();
    await wfh.filterByStatus('Pending');
    await expect(page.getByText(/pending/i)).toBeVisible();
  });

  test('Pagination controls are visible when rows exist', async ({ page }) => {
    const wfh = new WFHPage(page);
    await wfh.goto();
    // At least one of Prev/Next should be present
    const prev = page.getByRole('button', { name: /previous|prev/i });
    await expect(prev).toBeVisible();
  });

});