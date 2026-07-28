// pages/OrgTreePage.js
// Org Tree – /admin/orgtree (accessible to both employee and admin)

class OrgTreePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // Search input
    this.searchInput = page.getByRole('searchbox', { name: /search employees/i });

    // Zoom controls
    this.zoomInButton  = page.getByRole('button', { name: /zoom in/i });
    this.zoomOutButton = page.getByRole('button', { name: /zoom out/i });
    this.resetButton   = page.getByRole('button', { name: /reset/i });

    // Employee Profile modal (opened by clicking a tree node)
    this.profileModal  = page.getByRole('dialog');
    this.closeButton   = page.getByRole('button', { name: /close/i });
  }

  async goto() {
    await this.page.goto('/admin/orgtree');
  }

  /** Search for an employee by name or email */
  async searchEmployee(query) {
    await this.searchInput.fill(query);
  }

  /** Click an employee node in the tree by name */
  async clickEmployeeNode(name) {
    await this.page.getByText(name, { exact: false }).first().click();
  }

  async zoomIn()  { await this.zoomInButton.click();  }
  async zoomOut() { await this.zoomOutButton.click(); }
  async reset()   { await this.resetButton.click();   }

  async closeProfileModal() {
    await this.closeButton.click();
  }
}

module.exports = { OrgTreePage };