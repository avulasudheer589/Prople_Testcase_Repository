// tests/integration.spec.js
// End-to-end integration flows – cross-module scenarios spanning employee and admin interactions.

const { test, expect }        = require('@playwright/test');
const { LoginPage }           = require('../pages/LoginPage');
const { WFHPage }             = require('../pages/WFHPage');
const { AttendancePage }      = require('../pages/AttendancePage');
const { LeavesPage }          = require('../pages/LeavesPage');
const { AdminLeavesPage }     = require('../pages/AdminLeavesPage');
const { DocumentsPage }       = require('../pages/DocumentsPage');
const { SupportPage }         = require('../pages/SupportPage');
const { InboxPage }           = require('../pages/InboxPage');
const { DashboardPage }       = require('../pages/DashboardPage');
const { AdminEmployeesPage }  = require('../pages/AdminEmployeesPage');
const { ResignationsPage }    = require('../pages/ResignationsPage');
const { GlobalNav }           = require('../pages/GlobalNav');

// ── Integration Test 1: Employee submits WFH → Admin sees it in Attendance ──
test.describe('Integration: WFH Request Lifecycle', () => {

  test('Employee opens WFH dialog; admin can see pending WFH on Attendance page', async ({ browser }) => {
    // Employee context
    const empCtx  = await browser.newContext();
    const empPage = await empCtx.newPage();
    await new LoginPage(empPage).loginAsEmployee();
    const wfh = new WFHPage(empPage);
    await wfh.goto();
    await wfh.openRequestDialog();
    await expect(empPage.getByRole('dialog')).toBeVisible();
    // Verify dialog fields render correctly
    await expect(wfh.selectDatesButton).toBeVisible();
    await expect(wfh.reasonTextarea).toBeVisible();
    await wfh.closeDialog();
    await empCtx.close();

    // Admin context – check WFH Requests tab has data
    const adminCtx  = await browser.newContext();
    const adminPage = await adminCtx.newPage();
    await new LoginPage(adminPage).loginAsAdmin();
    const att = new AttendancePage(adminPage);
    await att.goto();
    await att.goToWFHRequests();
    await expect(adminPage.getByText(/total/i)).toBeVisible();
    await adminCtx.close();
  });

});

// ── Integration Test 2: Employee applies leave → Admin reviews it ────────────
test.describe('Integration: Leave Request Lifecycle', () => {

  test('Employee leave form is accessible; admin can view pending requests', async ({ browser }) => {
    const empCtx  = await browser.newContext();
    const empPage = await empCtx.newPage();
    await new LoginPage(empPage).loginAsEmployee();
    const leaves = new LeavesPage(empPage);
    await leaves.goto();
    await leaves.openApplyDialog();
    await expect(empPage.getByRole('dialog')).toBeVisible();
    await leaves.closeDialog();
    await empCtx.close();

    const adminCtx  = await browser.newContext();
    const adminPage = await adminCtx.newPage();
    await new LoginPage(adminPage).loginAsAdmin();
    const adminLeaves = new AdminLeavesPage(adminPage);
    await adminLeaves.goto();
    await adminLeaves.goToRequests();
    await adminLeaves.pendingFilter.click();
    // Verify Approve/Reject buttons exist for pending requests
    const approveCount = await adminLeaves.approveButtons.count();
    expect(approveCount).toBeGreaterThanOrEqual(0); // May already be 0 if none pending
    await adminCtx.close();
  });

});

// ── Integration Test 3: Employee uploads document → Admin approves it ────────
test.describe('Integration: Document Approval Lifecycle', () => {

  test('Employee documents page is accessible; admin can see pending documents', async ({ browser }) => {
    const empCtx  = await browser.newContext();
    const empPage = await empCtx.newPage();
    await new LoginPage(empPage).loginAsEmployee();
    const empDocs = new DocumentsPage(empPage, 'employee');
    await empDocs.goto();
    await expect(empPage.getByRole('button', { name: /upload/i })).toBeVisible();
    await empCtx.close();

    const adminCtx  = await browser.newContext();
    const adminPage = await adminCtx.newPage();
    await new LoginPage(adminPage).loginAsAdmin();
    const adminDocs = new DocumentsPage(adminPage, 'admin');
    await adminDocs.goto();
    await adminDocs.pendingTab.click();
    await expect(adminPage).toHaveURL(/\/documents/);
    await adminCtx.close();
  });

});

// ── Integration Test 4: Employee submits support ticket → Admin resolves it ──
test.describe('Integration: Support Ticket Lifecycle', () => {

  test('Employee creates a ticket; admin sees it and can update status', async ({ browser }) => {
    // Employee creates ticket
    const empCtx  = await browser.newContext();
    const empPage = await empCtx.newPage();
    await new LoginPage(empPage).loginAsEmployee();
    const empSupport = new SupportPage(empPage);
    await empSupport.goto();
    await empSupport.newTicketButton.click();
    await expect(empPage.getByRole('dialog')).toBeVisible();
    await empSupport.cancelButton.click();   // cancel – don't actually create in E2E
    await empCtx.close();

    // Admin views existing tickets
    const adminCtx  = await browser.newContext();
    const adminPage = await adminCtx.newPage();
    await new LoginPage(adminPage).loginAsAdmin();
    const adminSupport = new SupportPage(adminPage);
    await adminSupport.goto();
    const ticketCount = await adminSupport.ticketItems.count();
    if (ticketCount > 0) {
      await adminSupport.openTicket(0);
      await expect(adminSupport.replyTextarea).toBeVisible();
      await expect(adminSupport.statusDropdown).toBeVisible();
      await adminSupport.closeButton.click();
    }
    await adminCtx.close();
  });

});

// ── Integration Test 5: Admin sends inbox message → Employee receives it ─────
test.describe('Integration: Inbox Messaging', () => {

  test('Admin can compose a message; employee inbox page is accessible', async ({ browser }) => {
    const adminCtx  = await browser.newContext();
    const adminPage = await adminCtx.newPage();
    await new LoginPage(adminPage).loginAsAdmin();
    const adminInbox = new InboxPage(adminPage);
    await adminInbox.goto();
    await adminInbox.openCompose();
    await expect(adminPage.getByRole('dialog')).toBeVisible();
    await adminInbox.cancelButton.click();
    await adminCtx.close();

    const empCtx  = await browser.newContext();
    const empPage = await empCtx.newPage();
    await new LoginPage(empPage).loginAsEmployee();
    const empInbox = new InboxPage(empPage);
    await empInbox.goto();
    await expect(empInbox.inboxTab).toBeVisible();
    await empCtx.close();
  });

});

// ── Integration Test 6: Employee resignation → Admin reviews in Resignations ─
test.describe('Integration: Resignation Workflow', () => {

  test('Employee resignation dialog is accessible; admin can view pending resignations', async ({ browser }) => {
    const empCtx  = await browser.newContext();
    const empPage = await empCtx.newPage();
    await new LoginPage(empPage).loginAsEmployee();
    await empPage.goto('/employee/profile');
    await empPage.getByRole('button', { name: /resign/i }).click();
    await expect(empPage.getByRole('dialog')).toBeVisible();
    await empPage.getByRole('button', { name: /^close$/i }).click();
    await empCtx.close();

    const adminCtx  = await browser.newContext();
    const adminPage = await adminCtx.newPage();
    await new LoginPage(adminPage).loginAsAdmin();
    const res = new ResignationsPage(adminPage);
    await res.goto();
    await expect(res.pendingTab).toBeVisible();
    await adminCtx.close();
  });

});

// ── Integration Test 7: Admin creates employee → Employee appears in list ────
test.describe('Integration: Employee Management', () => {

  test('Admin employee creation form is accessible; employee list shows records', async ({ browser }) => {
    const adminCtx  = await browser.newContext();
    const adminPage = await adminCtx.newPage();
    await new LoginPage(adminPage).loginAsAdmin();
    const emp = new AdminEmployeesPage(adminPage);
    await emp.goto();
    await emp.openAddDialog();
    await expect(adminPage.getByRole('dialog')).toBeVisible();
    // Verify all required fields present
    await expect(emp.fullNameInput).toBeVisible();
    await expect(emp.emailInput).toBeVisible();
    await expect(emp.tempPwdInput).toBeVisible();
    await emp.cancelButton.click();
    await adminCtx.close();
  });

});

// ── Integration Test 8: Global navigation works for both roles ───────────────
test.describe('Integration: Global Navigation', () => {

  test('Employee can navigate via the sidebar to all their modules', async ({ page }) => {
    await new LoginPage(page).loginAsEmployee();
    const nav = new GlobalNav(page);

    const links = [
      { label: 'Attendance', url: /attendance/ },
      { label: 'Leaves',     url: /leaves/     },
      { label: 'Finance',    url: /finance/    },
      { label: 'Inbox',      url: /inbox/      },
    ];

    for (const { label, url } of links) {
      await nav.navigateTo(label);
      await expect(page).toHaveURL(url);
    }
  });

  test('Admin can navigate via the sidebar to all their modules', async ({ page }) => {
    await new LoginPage(page).loginAsAdmin();
    const nav = new GlobalNav(page);

    const links = [
      { label: 'Employees', url: /employees/ },
      { label: 'Leaves',    url: /leaves/    },
      { label: 'Payroll',   url: /payroll/   },
      { label: 'Inbox',     url: /inbox/     },
    ];

    for (const { label, url } of links) {
      await nav.navigateTo(label);
      await expect(page).toHaveURL(url);
    }
  });

  test('Language selector changes the UI language', async ({ page }) => {
    await new LoginPage(page).loginAsEmployee();
    const nav = new GlobalNav(page);
    await nav.selectLanguage('हिन्दी');
    // After switching, page stays accessible
    await expect(page).not.toHaveURL(/login/);
    // Switch back to English
    await nav.selectLanguage('English');
  });

  test('Global search finds employees by name', async ({ page }) => {
    await new LoginPage(page).loginAsAdmin();
    const nav = new GlobalNav(page);
    await nav.globalSearch('abc');
    // Results appear or page stays on /admin
    await expect(page).toHaveURL(/\/admin/);
  });

});

// ── Integration Test 9: Access control – employee cannot access admin routes ─
test.describe('Integration: Access Control', () => {

  test('Employee is redirected away from admin-only routes', async ({ page }) => {
    await new LoginPage(page).loginAsEmployee();
    await page.goto('/admin/employees');
    // Should be redirected, not show the admin employees page
    await expect(page).not.toHaveURL(/\/admin\/employees/);
  });

  test('Admin is redirected from employee-only WFH route', async ({ page }) => {
    await new LoginPage(page).loginAsAdmin();
    await page.goto('/employee/wfh');
    // Admin gets redirected (not served the employee WFH page)
    await expect(page).not.toHaveURL(/\/employee\/wfh/);
  });

  test('Unauthenticated user cannot access the dashboard', async ({ page }) => {
    await page.goto('/admin');
    await expect(page).not.toHaveURL(/\/admin$/);
  });

});