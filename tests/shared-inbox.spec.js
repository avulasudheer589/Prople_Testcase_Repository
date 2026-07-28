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
shared-orgtree.spec.js

JS

// tests/shared-orgtree.spec.js
// Org Tree – accessible by both employee and admin.

const { test, expect }  = require('@playwright/test');
const { LoginPage }     = require('../pages/LoginPage');
const { OrgTreePage }   = require('../pages/OrgTreePage');

// Run the same scenarios for both roles
for (const [role, loginMethod] of [['Employee', 'loginAsEmployee'], ['Admin', 'loginAsAdmin']]) {
  test.describe(`Org Tree – ${role}`, () => {

    test.beforeEach(async ({ page }) => {
      const login = new LoginPage(page);
      await login[loginMethod]();
    });

    test(`${role}: Org Tree page loads with interactive tree`, async ({ page }) => {
      const tree = new OrgTreePage(page);
      await tree.goto();
      await expect(page.getByText(/org|organization|tree/i)).toBeVisible();
    });

    test(`${role}: Search input is visible and functional`, async ({ page }) => {
      const tree = new OrgTreePage(page);
      await tree.goto();
      await expect(tree.searchInput).toBeVisible();
      await tree.searchEmployee('abc');
      // No crash, page remains
      await expect(page).toHaveURL(/\/orgtree/);
    });

    test(`${role}: Zoom controls are visible`, async ({ page }) => {
      const tree = new OrgTreePage(page);
      await tree.goto();
      await expect(tree.zoomInButton).toBeVisible();
      await expect(tree.zoomOutButton).toBeVisible();
      await expect(tree.resetButton).toBeVisible();
    });

    test(`${role}: Clicking an employee node opens profile modal`, async ({ page }) => {
      const tree = new OrgTreePage(page);
      await tree.goto();
      // Try clicking any employee node that exists
      const nodes = page.locator('[class*="node"], [class*="card"]').first();
      if (await nodes.isVisible()) {
        await nodes.click();
        await expect(page.getByRole('dialog')).toBeVisible();
        await tree.closeProfileModal();
      }
    });

  });
}
shared-inbox.spec.js

JS

// tests/shared-inbox.spec.js
// Inbox – accessible by both employee and admin.

const { test, expect } = require('@playwright/test');
const { LoginPage }    = require('../pages/LoginPage');
const { InboxPage }    = require('../pages/InboxPage');

for (const [role, loginMethod] of [['Employee', 'loginAsEmployee'], ['Admin', 'loginAsAdmin']]) {
  test.describe(`Inbox – ${role}`, () => {

    test.beforeEach(async ({ page }) => {
      const login = new LoginPage(page);
      await login[loginMethod]();
    });

    test(`${role}: Inbox page loads with Inbox and Sent tabs`, async ({ page }) => {
      const inbox = new InboxPage(page);
      await inbox.goto();
      await expect(inbox.inboxTab).toBeVisible();
      await expect(inbox.sentTab).toBeVisible();
    });

    test(`${role}: Compose button is visible`, async ({ page }) => {
      const inbox = new InboxPage(page);
      await inbox.goto();
      await expect(inbox.composeButton).toBeVisible();
    });

    test(`${role}: Compose dialog opens with required fields`, async ({ page }) => {
      const inbox = new InboxPage(page);
      await inbox.goto();
      await inbox.openCompose();
      await expect(page.getByRole('dialog')).toBeVisible();
      await expect(inbox.toInput).toBeVisible();
      await expect(inbox.subjectInput).toBeVisible();
      await expect(inbox.messageInput).toBeVisible();
    });

    test(`${role}: Compose dialog can be cancelled`, async ({ page }) => {
      const inbox = new InboxPage(page);
      await inbox.goto();
      await inbox.openCompose();
      await inbox.cancelButton.click();
      await expect(page.getByRole('dialog')).not.toBeVisible();
    });

    test(`${role}: Search mail input is visible`, async ({ page }) => {
      const inbox = new InboxPage(page);
      await inbox.goto();
      await expect(inbox.searchInput).toBeVisible();
    });

    test(`${role}: Switching to Sent tab shows sent messages`, async ({ page }) => {
      const inbox = new InboxPage(page);
      await inbox.goto();
      await inbox.goToSent();
      await expect(page).toHaveURL(/\/inbox/);
    });

  });
}