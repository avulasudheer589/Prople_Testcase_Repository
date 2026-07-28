// pages/InboxPage.js
// Inbox – /admin/inbox (shared: employee + admin)
// Tabs: Inbox | Sent

class InboxPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // Tab navigation
    this.inboxTab  = page.getByRole('tab', { name: /^inbox$/i });
    this.sentTab   = page.getByRole('tab', { name: /^sent$/i });

    // Top actions
    this.composeButton   = page.getByRole('button', { name: /compose/i });
    this.markAllReadLink = page.getByRole('button', { name: /mark all read/i });

    // Search
    this.searchInput = page.getByRole('searchbox', { name: /search mail/i });

    // Compose dialog
    this.toInput      = page.getByLabel(/^to$/i);
    this.subjectInput = page.getByLabel(/^subject$/i);
    this.messageInput = page.getByRole('textbox', { name: /message/i });
    this.sendButton   = page.getByRole('button', { name: /^send$/i });
    this.cancelButton = page.getByRole('button', { name: /^cancel$/i });
    this.closeButton  = page.getByRole('button', { name: /^close$/i });
  }

  async goto() {
    await this.page.goto('/admin/inbox');
  }

  async goToInbox() { await this.inboxTab.click(); }
  async goToSent()  { await this.sentTab.click();  }

  /** Open the compose dialog */
  async openCompose() {
    await this.composeButton.click();
  }

  /**
   * Compose and send a new message.
   * @param {string} to      Recipient name (autocomplete will suggest)
   * @param {string} subject
   * @param {string} message
   */
  async sendMessage(to, subject, message) {
    await this.openCompose();
    await this.toInput.fill(to);
    await this.subjectInput.fill(subject);
    await this.messageInput.fill(message);
    await this.sendButton.click();
  }

  /** Search inbox/sent messages */
  async search(text) {
    await this.searchInput.fill(text);
  }

  /** Mark all messages as read */
  async markAllRead() {
    await this.markAllReadLink.click();
  }

  /** Click the nth message in the list to read it (0-indexed) */
  async openMessage(index = 0) {
    await this.page.getByRole('listitem').nth(index).click();
  }
}

module.exports = { InboxPage };