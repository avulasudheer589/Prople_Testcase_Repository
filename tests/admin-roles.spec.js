// tests/admin-roles.spec.js
// Admin – Role Management module test cases.

const { test, expect }        = require('@playwright/test');
const { LoginPage }           = require('../pages/LoginPage');
const { RoleManagementPage }  = require('../pages/RoleManagementPage');

test.describe('Admin – Role Management', () => {

  test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);
    await login.loginAsAdmin();
  });

  test('Role Management page loads with sidebar and right panel', async ({ page }) => {
    const roles = new RoleManagementPage(page);
    await roles.goto();
    await expect(roles.sidebarSearch).toBeVisible();
    await expect(roles.resetAllButton).toBeVisible();
  });

  test('Sidebar shows list of employees/roles', async ({ page }) => {
    const roles = new RoleManagementPage(page);
    await roles.goto();
    // At least one role item should be present
    await expect(roles.permissionCheckboxes.first()).toBeVisible();
  });

  test('Searching in the sidebar filters the role list', async ({ page }) => {
    const roles = new RoleManagementPage(page);
    await roles.goto();
    await roles.searchRole('resign');
    await expect(page.getByText(/resign/i)).toBeVisible();
  });

  test('Selecting a role loads its permissions in the right panel', async ({ page }) => {
    const roles = new RoleManagementPage(page);
    await roles.goto();
    // Click the first role item
    await roles.roleItems.first().click();
    await expect(roles.permissionsSearch).toBeVisible();
  });

  test('Permission checkboxes are toggleable', async ({ page }) => {
    const roles = new RoleManagementPage(page);
    await roles.goto();
    await roles.roleItems.first().click();
    const firstCheckbox = roles.permissionCheckboxes.first();
    const initialState  = await firstCheckbox.isChecked();
    await firstCheckbox.click();
    await expect(firstCheckbox).toBeChecked({ checked: !initialState });
  });

  test('"Save" button appears after changing a permission', async ({ page }) => {
    const roles = new RoleManagementPage(page);
    await roles.goto();
    await roles.roleItems.first().click();
    await roles.permissionCheckboxes.first().click();
    await expect(roles.saveButton).toBeVisible();
  });

  test('"Reset all" button is visible', async ({ page }) => {
    const roles = new RoleManagementPage(page);
    await roles.goto();
    await expect(roles.resetAllButton).toBeVisible();
  });

  test('Permission categories (CORE, PEOPLE, etc.) are present', async ({ page }) => {
    const roles = new RoleManagementPage(page);
    await roles.goto();
    await roles.roleItems.first().click();
    await expect(page.getByText(/core/i)).toBeVisible();
    await expect(page.getByText(/people/i)).toBeVisible();
  });

});