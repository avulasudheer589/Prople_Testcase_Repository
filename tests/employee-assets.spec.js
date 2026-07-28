// tests/employee-assets.spec.js
// Employee – My Assets module test cases.

const { test, expect } = require('@playwright/test');
const { LoginPage }    = require('../pages/LoginPage');
const { AssetsPage }   = require('../pages/AssetsPage');

test.describe('Employee – My Assets', () => {

  test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);
    await login.loginAsEmployee();
  });

  test('My Assets page loads and shows summary statistics', async ({ page }) => {
    const assets = new AssetsPage(page, 'employee');
    await assets.goto();
    await expect(page.getByText(/total/i)).toBeVisible();
    await expect(page.getByText(/currently assigned/i)).toBeVisible();
    await expect(page.getByText(/returned/i)).toBeVisible();
  });

  test('Search input is present', async ({ page }) => {
    const assets = new AssetsPage(page, 'employee');
    await assets.goto();
    await expect(assets.searchInput).toBeVisible();
  });

  test('Category filter dropdown is present', async ({ page }) => {
    const assets = new AssetsPage(page, 'employee');
    await assets.goto();
    await expect(assets.categoryFilter).toBeVisible();
  });

  test('Employee can search assets by name', async ({ page }) => {
    const assets = new AssetsPage(page, 'employee');
    await assets.goto();
    await assets.search('laptop');
    // Empty state or filtered results – no crash
    await expect(page).toHaveURL(/\/assets/);
  });

  test('Empty state message shows when no assets assigned', async ({ page }) => {
    const assets = new AssetsPage(page, 'employee');
    await assets.goto();
    // The test account has 0 assets per documentation
    await expect(page.getByText(/no assets assigned/i)).toBeVisible();
  });

});