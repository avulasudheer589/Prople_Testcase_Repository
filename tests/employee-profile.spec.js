// tests/employee-profile.spec.js
// Employee – My Profile module test cases.

const { test, expect }         = require('@playwright/test');
const { LoginPage }            = require('../pages/LoginPage');
const { EmployeeProfilePage }  = require('../pages/EmployeeProfilePage');

test.describe('Employee – My Profile', () => {

  test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);
    await login.loginAsEmployee();
  });

  test('Profile page loads with Personal Info tab active', async ({ page }) => {
    const profile = new EmployeeProfilePage(page);
    await profile.goto();
    await expect(profile.personalInfoTab).toHaveAttribute('aria-selected', 'true');
    await expect(profile.editButton).toBeVisible();
  });

  test('All profile tabs are visible', async ({ page }) => {
    const profile = new EmployeeProfilePage(page);
    await profile.goto();
    await expect(profile.personalInfoTab).toBeVisible();
    await expect(profile.workTab).toBeVisible();
    await expect(profile.bankComplianceTab).toBeVisible();
    await expect(profile.changePasswordTab).toBeVisible();
  });

  test('Clicking Edit enables the editable fields', async ({ page }) => {
    const profile = new EmployeeProfilePage(page);
    await profile.goto();
    await profile.enterEditMode();
    await expect(profile.fullNameInput).toBeEnabled();
    await expect(profile.saveButton).toBeVisible();
    await expect(profile.cancelButton).toBeVisible();
  });

  test('Cancelling edit reverts to view mode', async ({ page }) => {
    const profile = new EmployeeProfilePage(page);
    await profile.goto();
    await profile.enterEditMode();
    await profile.cancelButton.click();
    await expect(profile.editButton).toBeVisible();
  });

  test('Work tab shows read-only information', async ({ page }) => {
    const profile = new EmployeeProfilePage(page);
    await profile.goto();
    await profile.workTab.click();
    await expect(page.getByText(/department/i)).toBeVisible();
    await expect(page.getByText(/position/i)).toBeVisible();
  });

  test('Bank & Compliance tab shows account information', async ({ page }) => {
    const profile = new EmployeeProfilePage(page);
    await profile.goto();
    await profile.bankComplianceTab.click();
    await expect(page.getByText(/bank account/i)).toBeVisible();
    await expect(page.getByText(/ifsc/i)).toBeVisible();
  });

  test('Change Password tab shows password fields', async ({ page }) => {
    const profile = new EmployeeProfilePage(page);
    await profile.goto();
    await profile.changePasswordTab.click();
    await expect(profile.currentPasswordInput).toBeVisible();
    await expect(profile.newPasswordInput).toBeVisible();
    await expect(profile.confirmPasswordInput).toBeVisible();
    await expect(profile.updatePasswordButton).toBeVisible();
  });

  test('"Resign" button opens the resignation dialog', async ({ page }) => {
    const profile = new EmployeeProfilePage(page);
    await profile.goto();
    await profile.resignButton.click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(profile.submitResignationBtn).toBeVisible();
  });

  test('Resignation dialog can be cancelled', async ({ page }) => {
    const profile = new EmployeeProfilePage(page);
    await profile.goto();
    await profile.resignButton.click();
    await profile.closeDialogButton.click();
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });

});