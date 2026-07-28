// pages/ProjectViewPage.js
// Employee Project View – /employee/projects (read-only, assigned projects)

class ProjectViewPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // Project cards listed on the page
    this.projectCards = page.locator('[role="article"], .project-card, [data-testid="project-card"]');

    // Detail modal
    this.detailModal = page.getByRole('dialog');
    this.closeButton = page.getByRole('button', { name: /close/i });
  }

  async goto() {
    await this.page.goto('/employee/projects');
  }

  /** Click a project card by its name to open the detail modal */
  async openProject(name) {
    await this.page.getByRole('heading', { name, level: 3 }).click();
  }

  /** Close the project detail modal */
  async closeDetail() {
    await this.closeButton.click();
  }
}

module.exports = { ProjectViewPage };