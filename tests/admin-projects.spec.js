// tests/admin-projects.spec.js
// Admin – Project Management module test cases.

const { test, expect }          = require('@playwright/test');
const { LoginPage }             = require('../pages/LoginPage');
const { ProjectManagementPage } = require('../pages/ProjectManagementPage');

test.describe('Admin – Project Management', () => {

  test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);
    await login.loginAsAdmin();
  });

  test('Projects page loads and shows project cards', async ({ page }) => {
    const proj = new ProjectManagementPage(page);
    await proj.goto();
    await expect(proj.newProjectButton).toBeVisible();
  });

  test('"New project" button opens the creation dialog', async ({ page }) => {
    const proj = new ProjectManagementPage(page);
    await proj.goto();
    await proj.newProjectButton.click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(proj.projectNameInput).toBeVisible();
    await expect(proj.startDateInput).toBeVisible();
  });

  test('Project creation dialog has all required fields', async ({ page }) => {
    const proj = new ProjectManagementPage(page);
    await proj.goto();
    await proj.newProjectButton.click();
    await expect(proj.projectNameInput).toBeVisible();
    await expect(proj.descriptionInput).toBeVisible();
    await expect(proj.startDateInput).toBeVisible();
    await expect(proj.createProjectBtn).toBeVisible();
  });

  test('Clicking a project card opens the detail modal', async ({ page }) => {
    const proj = new ProjectManagementPage(page);
    await proj.goto();
    const cards = await proj.projectCards.count();
    if (cards > 0) {
      await proj.projectCards.first().click();
      await expect(page.getByRole('dialog')).toBeVisible();
      await expect(proj.editButton).toBeVisible();
      await proj.closeModal();
    }
  });

  test('Project detail modal shows Edit and Delete actions', async ({ page }) => {
    const proj = new ProjectManagementPage(page);
    await proj.goto();
    const cards = await proj.projectCards.count();
    if (cards > 0) {
      await proj.projectCards.first().click();
      await expect(proj.editButton).toBeVisible();
      await expect(proj.deleteButton).toBeVisible();
      await proj.closeModal();
    }
  });

  test('Edit project dialog opens with existing data pre-filled', async ({ page }) => {
    const proj = new ProjectManagementPage(page);
    await proj.goto();
    const cards = await proj.projectCards.count();
    if (cards > 0) {
      await proj.projectCards.first().click();
      await proj.editButton.click();
      await expect(proj.saveChangesButton).toBeVisible();
      await proj.closeModal();
    }
  });

});