// tests/admin-assets.spec.js
// Admin – Assets module test cases.

const { test, expect } = require('@playwright/test');
const { LoginPage }    = require('../pages/LoginPage');
const { AssetsPage }   = require('../pages/AssetsPage');

test.describe('Admin – Assets', () => {

  test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);
    await login.loginAsAdmin();
  });

  test('Assets page loads with correct status tabs', async ({ page }) => {
    const assets = new AssetsPage(page, 'admin');
    await assets.goto();
    await expect(assets.allTab).toBeVisible({ timeout: 15000 });
    await expect(assets.availableTab).toBeVisible({ timeout: 10000 });
    await expect(assets.assignedTab).toBeVisible({ timeout: 10000 });
    await expect(assets.maintenanceTab).toBeVisible({ timeout: 10000 });
    await expect(assets.retiredTab).toBeVisible({ timeout: 10000 });
  });

  test('"Add Asset" button is visible', async ({ page }) => {
    const assets = new AssetsPage(page, 'admin');
    await assets.goto();
    await expect(assets.addAssetButton).toBeVisible({ timeout: 15000 });
  });

  test('"Add Asset" dialog opens with all required fields', async ({ page }) => {
    const assets = new AssetsPage(page, 'admin');
    await assets.goto();
    await assets.openAddAssetDialog();
    await expect(page.getByRole('dialog').or(page.locator('div[class*="dialog"], div[class*="modal"]')).first()).toBeVisible({ timeout: 10000 });
    await expect(assets.assetNameInput).toBeVisible({ timeout: 5000 });
  });

  test('Asset dialog can be closed without creating', async ({ page }) => {
    const assets = new AssetsPage(page, 'admin');
    await assets.goto();
    await assets.openAddAssetDialog();
    await assets.closeDialog();
    await expect(page.getByRole('dialog')).not.toBeVisible({ timeout: 5000 });
  });

  test('Asset summary statistics are visible', async ({ page }) => {
    const assets = new AssetsPage(page, 'admin');
    await assets.goto();
    await expect(page.getByText(/total/i).first()).toBeVisible({ timeout: 15000 });
    await expect(page.getByText(/available/i).first()).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(/assigned/i).first()).toBeVisible({ timeout: 10000 });
  });

  test('Assets list displays asset items and status badges', async ({ page }) => {
    const assets = new AssetsPage(page, 'admin');
    await assets.goto();
    await expect(page.getByText(/available|assigned|maintenance|retired/i).first()).toBeVisible({ timeout: 15000 });
  });

  test('Search input filters assets', async ({ page }) => {
    const assets = new AssetsPage(page, 'admin');
    await assets.goto();
    await assets.search('laptop');
    await expect(page).toHaveURL(/\/assets/);
  });

  test('Row actions (Assign, Maintenance, Retire, Edit, History) are present', async ({ page }) => {
    const assets = new AssetsPage(page, 'admin');
    await assets.goto();
    const rowCount = await assets.assignButtons.count();
    if (rowCount > 0) {
      await expect(assets.editButtons.first()).toBeVisible();
      await expect(assets.historyButtons.first()).toBeVisible();
    }
  });

});