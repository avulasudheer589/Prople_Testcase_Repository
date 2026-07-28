// pages/ProjectManagementPage.js
// Admin – Project Management (/admin/projects)

class ProjectManagementPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // Top action
    this.newProjectButton = page.getByRole('button', { name: /new project/i });

    // Project cards
    this.projectCards = page.getByRole('heading', { level: 3 });

    // Create/Edit Project dialog
    this.projectNameInput  = page.getByLabel(/project name/i);
    this.descriptionInput  = page.getByLabel(/description/i);
    this.startDateInput    = page.getByLabel(/start date/i);
    this.endDateInput      = page.getByLabel(/end date/i);
    this.teamMemberSearch  = page.getByRole('searchbox', { name: /team/i });
    this.createProjectBtn  = page.getByRole('button', { name: /create project/i });
    this.saveChangesButton = page.getByRole('button', { name: /save changes/i });

    // Detail modal actions
    this.editButton        = page.getByRole('button', { name: /^edit$/i });
    this.reactivateButton  = page.getByRole('button', { name: /reactivate/i });
    this.deleteButton      = page.getByRole('button', { name: /^delete$/i });
    this.closeButton       = page.getByRole('button', { name: /^close$/i });
  }

  async goto() {
    await this.page.goto('/admin/projects');
  }

  /** Open a project detail modal by project name */
  async openProject(name) {
    await this.page.getByRole('heading', { name, level: 3 }).click();
  }

  /**
   * Create a new project.
   * @param {{ name, description?, startDate, members?: string[] }} data
   */
  async createProject({ name, description, startDate }) {
    await this.newProjectButton.click();
    await this.projectNameInput.fill(name);
    if (description) await this.descriptionInput.fill(description);
    await this.startDateInput.fill(startDate);
    await this.createProjectBtn.click();
  }

  /** Edit the currently open project */
  async editCurrentProject({ name, description, startDate, endDate } = {}) {
    await this.editButton.click();
    if (name)        await this.projectNameInput.fill(name);
    if (description) await this.descriptionInput.fill(description);
    if (startDate)   await this.startDateInput.fill(startDate);
    if (endDate)     await this.endDateInput.fill(endDate);
    await this.saveChangesButton.click();
  }

  async reactivateProject() {
    await this.reactivateButton.click();
  }

  async deleteProject() {
    await this.deleteButton.click();
    // Confirm deletion prompt
    await this.page.getByRole('button', { name: /confirm|yes|delete/i }).click();
  }

  async closeModal() {
    await this.closeButton.click();
  }
}

module.exports = { ProjectManagementPage };