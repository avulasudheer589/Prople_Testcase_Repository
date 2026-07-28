// tests/admin-attendance.spec.js
// Admin – Attendance module test cases.

const { test, expect }    = require('@playwright/test');
const { LoginPage }       = require('../pages/LoginPage');
const { AttendancePage }  = require('../pages/AttendancePage');

test.describe('Admin – Attendance', () => {

  test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);
    await login.loginAsAdmin();
  });

  test('Attendance page loads with Master Logs tab', async ({ page }) => {
    const att = new AttendancePage(page);
    await att.goto();
    await expect(att.masterLogsTab).toBeVisible();
    await expect(att.adjustmentsTab).toBeVisible();
    await expect(att.wfhRequestsTab).toBeVisible();
  });

  test('Master Logs tab shows summary statistics', async ({ page }) => {
    const att = new AttendancePage(page);
    await att.goto();
    await att.goToMasterLogs();
    await expect(page.getByText(/present today/i)).toBeVisible();
    await expect(page.getByText(/absent today/i)).toBeVisible();
  });

  test('Master Logs quick filters are functional', async ({ page }) => {
    const att = new AttendancePage(page);
    await att.goto();
    await att.goToMasterLogs();
    await expect(att.allLogsFilter).toBeVisible();
    await att.allLogsFilter.click();
    await expect(page).toHaveURL(/\/attendance/);
  });

  test('Master Logs table shows correct columns', async ({ page }) => {
    const att = new AttendancePage(page);
    await att.goto();
    await att.goToMasterLogs();
    await expect(page.getByRole('columnheader', { name: /employee/i })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: /date/i })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: /status/i })).toBeVisible();
  });

  test('Adjustments tab loads with correct statistics', async ({ page }) => {
    const att = new AttendancePage(page);
    await att.goto();
    await att.goToAdjustments();
    await expect(page.getByText(/total/i)).toBeVisible();
    await expect(page.getByText(/pending/i)).toBeVisible();
    await expect(page.getByText(/approved/i)).toBeVisible();
    await expect(page.getByText(/rejected/i)).toBeVisible();
  });

  test('Adjustments table shows Employee, Reason, Status columns', async ({ page }) => {
    const att = new AttendancePage(page);
    await att.goto();
    await att.goToAdjustments();
    await expect(page.getByRole('columnheader', { name: /employee/i })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: /reason/i })).toBeVisible();
  });

  test('WFH Requests tab loads', async ({ page }) => {
    const att = new AttendancePage(page);
    await att.goto();
    await att.goToWFHRequests();
    await expect(page.getByText(/total/i)).toBeVisible();
  });

  test('Status dropdown on Adjustments tab is usable', async ({ page }) => {
    const att = new AttendancePage(page);
    await att.goto();
    await att.goToAdjustments();
    await expect(att.statusDropdown).toBeVisible();
  });

  test('Download button is visible on Attendance page', async ({ page }) => {
    const att = new AttendancePage(page);
    await att.goto();
    await expect(att.downloadButton).toBeVisible();
  });

});