// tests/shared-support.spec.js
// Support – accessible by both employee and admin.

const { test, expect }  = require('@playwright/test');
const { LoginPage }     = require('../pages/LoginPage');
const { SupportPage }   = require('../pages/SupportPage');

for (const [role, loginMethod] of [['Employee', 'loginAsEmployee'], ['Admin', 'loginAsAdmin']]) {
  test.describe(`Support – ${role}`, () => {

    test.beforeEach(async ({ page }) => {
      const login = new LoginPage(page);
      await login[loginMethod]();
    });

    test(`${role}: Support page loads with status tabs`, async ({ page }) => {
      const support = new SupportPage(page);
      await support.goto();
      await expect(support.allTab).toBeVisible();
      await expect(support.openTab).toBeVisible();
      await expect(support.inProgressTab).toBeVisible();
      await expect(support.resolvedTab).toBeVisible();
      await expect(support.closedTab).toBeVisible();
    });

    test(`${role}: "New ticket" button opens the ticket creation dialog`, async ({ page }) => {
      const support = new SupportPage(page);
      await support.goto();
      await support.newTicketButton.click();
      await expect(page.getByRole('dialog')).toBeVisible();
      await expect(support.subjectInput).toBeVisible();
      await expect(support.categoryDropdown).toBeVisible();
      await expect(support.priorityDropdown).toBeVisible();
      await expect(support.descriptionInput).toBeVisible();
    });

    test(`${role}: Ticket creation dialog shows all fields`, async ({ page }) => {
      const support = new SupportPage(page);
      await support.goto();
      await support.newTicketButton.click();
      await expect(support.subjectInput).toBeVisible();
      await expect(support.categoryDropdown).toBeVisible();
      await expect(support.priorityDropdown).toBeVisible();
      await expect(support.descriptionInput).toBeVisible();
      await expect(support.submitButton).toBeVisible();
      await expect(support.cancelButton).toBeVisible();
    });

    test(`${role}: Ticket dialog can be cancelled`, async ({ page }) => {
      const support = new SupportPage(page);
      await support.goto();
      await support.newTicketButton.click();
      await support.cancelButton.click();
      await expect(page.getByRole('dialog')).not.toBeVisible();
    });

    test(`${role}: Clicking a ticket opens the detail dialog`, async ({ page }) => {
      const support = new SupportPage(page);
      await support.goto();
      const count = await support.ticketItems.count();
      if (count > 0) {
        await support.openTicket(0);
        await expect(page.getByRole('dialog')).toBeVisible();
        await support.closeButton.click();
      }
    });

    test(`${role}: Ticket detail shows Reply textarea and Status selector`, async ({ page }) => {
      const support = new SupportPage(page);
      await support.goto();
      const count = await support.ticketItems.count();
      if (count > 0) {
        await support.openTicket(0);
        await expect(support.replyTextarea).toBeVisible();
        await expect(support.statusDropdown).toBeVisible();
        await support.closeButton.click();
      }
    });

  });
}