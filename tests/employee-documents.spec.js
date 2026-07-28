// tests/employee-documents.spec.js
// Employee – Documents module test cases.

const { test, expect }   = require('@playwright/test');
const { LoginPage }      = require('../pages/LoginPage');
const { DocumentsPage }  = require('../pages/DocumentsPage');

test.describe('Employee – Documents', () => {

  test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);
    await login.loginAsEmployee();
  });

  test('Documents page loads and shows upload button', async ({ page }) => {
    const docs = new DocumentsPage(page, 'employee');
    await docs.goto();
    await expect(docs.uploadButton).toBeVisible();
  });

  test('"Upload" button opens the document upload dialog', async ({ page }) => {
    const docs = new DocumentsPage(page, 'employee');
    await docs.goto();
    await docs.uploadButton.click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(docs.typeDropdown).toBeVisible();
  });

  test('Upload dialog shows correct document type options', async ({ page }) => {
    const docs = new DocumentsPage(page, 'employee');
    await docs.goto();
    await docs.uploadButton.click();
    // Check at least one type is listed
    await expect(page.getByRole('option', { name: /aadhaar/i })).toBeVisible();
  });

  test('Upload dialog Submit is disabled until file is selected', async ({ page }) => {
    const docs = new DocumentsPage(page, 'employee');
    await docs.goto();
    await docs.uploadButton.click();
    await expect(docs.submitButton).toBeDisabled();
  });

  test('Documents table shows correct columns', async ({ page }) => {
    const docs = new DocumentsPage(page, 'employee');
    await docs.goto();
    await expect(page.getByRole('columnheader', { name: /type/i })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: /status/i })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: /uploaded/i })).toBeVisible();
  });

  test('Dialog can be closed without uploading', async ({ page }) => {
    const docs = new DocumentsPage(page, 'employee');
    await docs.goto();
    await docs.uploadButton.click();
    await docs.closeDialog();
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });

});