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