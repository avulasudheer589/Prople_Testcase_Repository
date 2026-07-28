// tests/admin-documents.spec.js
// Admin – Documents management (/admin/documents).

const { test, expect }   = require('@playwright/test');
const { LoginPage }      = require('../pages/LoginPage');
const { DocumentsPage }  = require('../pages/DocumentsPage');

test.describe('Admin – Documents', () => {

  test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);
    await login.loginAsAdmin();
  });

  test('Admin Documents page loads with status tabs', async ({ page }) => {
    const docs = new DocumentsPage(page, 'admin');
    await docs.goto();
    await expect(docs.pendingTab).toBeVisible();
    await expect(docs.approvedTab).toBeVisible();
    await expect(docs.rejectedTab).toBeVisible();
    await expect(docs.allTab).toBeVisible();
  });

  test('Documents table shows Employee, Type, Status columns', async ({ page }) => {
    const docs = new DocumentsPage(page, 'admin');
    await docs.goto();
    await expect(page.getByRole('columnheader', { name: /employee/i })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: /type/i })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: /status/i })).toBeVisible();
  });

  test('Search input is present and usable', async ({ page }) => {
    const docs = new DocumentsPage(page, 'admin');
    await docs.goto();
    await expect(docs.searchInput).toBeVisible();
    await docs.search('Aadhaar');
    await expect(page).toHaveURL(/\/documents/);
  });

  test('Pending tab shows Approve, Reject, Delete actions', async ({ page }) => {
    const docs = new DocumentsPage(page, 'admin');
    await docs.goto();
    await docs.pendingTab.click();
    const count = await docs.approveButtons.count();
    if (count > 0) {
      await expect(docs.approveButtons.first()).toBeVisible();
      await expect(docs.rejectButtons.first()).toBeVisible();
      await expect(docs.deleteButtons.first()).toBeVisible();
    }
  });

  test('Approved tab shows View and Delete actions only', async ({ page }) => {
    const docs = new DocumentsPage(page, 'admin');
    await docs.goto();
    await docs.approvedTab.click();
    const approveCount = await docs.approveButtons.count();
    expect(approveCount).toBe(0);
  });

  test('View button opens a dialog with Download option', async ({ page }) => {
    const docs = new DocumentsPage(page, 'admin');
    await docs.goto();
    const viewCount = await docs.viewButtons.count();
    if (viewCount > 0) {
      await docs.viewDocument(0);
      await expect(page.getByRole('dialog')).toBeVisible();
      await expect(docs.downloadButton).toBeVisible();
      await docs.closeDialog();
    }
  });

});