// pages/RoleManagementPage.js
// Admin – Role Management (/admin/roles)

class RoleManagementPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // Sidebar
    this.sidebarSearch    = page.getByRole('searchbox', { name: /search employees/i });
    this.roleItems        = page.getByRole('button', { name: /pages/i }); // each role item shows "N pages"

    // Right panel
    this.permissionsSearch = page.getByRole('searchbox', { name: /search/i });
    this.resetAllButton    = page.getByRole('button', { name: /reset all/i });
    this.saveButton        = page.getByRole('button', { name: /^save$/i });

    // Permission checkboxes (all toggles in the grid)
    this.permissionCheckboxes = page.getByRole('checkbox');
  }

  async goto() {
    await this.page.goto('/admin/roles');
  }

  /** Select a role/employee from the sidebar by name */
  async selectRole(name) {
    await this.page.getByRole('button', { name: new RegExp(name, 'i') }).first().click();
  }

  /** Search roles/employees in the sidebar */
  async searchRole(text) {
    await this.sidebarSearch.fill(text);
  }

  /** Search within the permissions grid */
  async searchPermission(text) {
    await this.permissionsSearch.fill(text);
  }

  /**
   * Toggle a specific permission by its label text.
   * @param {string} label  e.g. 'Employees', 'Attendance'
   */
  async togglePermission(label) {
    const row = this.page.getByRole('row', { name: new RegExp(label, 'i') });
    await row.getByRole('checkbox').click();
  }

  /** Save the current permission configuration */
  async savePermissions() {
    await this.saveButton.click();
  }

  /** Reset all permissions for the selected role */
  async resetAll() {
    await this.resetAllButton.click();
  }
}

module.exports = { RoleManagementPage };