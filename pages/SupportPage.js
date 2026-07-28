// pages/SupportPage.js
// Support – /admin/support (shared: employee + admin)

class SupportPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // Top action
    this.newTicketButton = page.getByRole('button', { name: /new ticket/i });

    // Status tabs
    this.allTab        = page.getByRole('tab', { name: /^all$/i });
    this.openTab       = page.getByRole('tab', { name: /^open$/i });
    this.inProgressTab = page.getByRole('tab', { name: /in progress/i });
    this.resolvedTab   = page.getByRole('tab', { name: /resolved/i });
    this.closedTab     = page.getByRole('tab', { name: /^closed$/i });

    // New Ticket dialog
    this.subjectInput      = page.getByLabel(/subject/i);
    this.categoryDropdown  = page.getByRole('combobox', { name: /category/i });
    this.priorityDropdown  = page.getByRole('combobox', { name: /priority/i });
    this.descriptionInput  = page.getByLabel(/describe/i);
    this.submitButton      = page.getByRole('button', { name: /^submit$/i });
    this.cancelButton      = page.getByRole('button', { name: /^cancel$/i });

    // Ticket detail dialog
    this.replyTextarea    = page.getByRole('textbox', { name: /reply/i });
    this.statusDropdown   = page.getByRole('combobox', { name: /status/i });
    this.saveButton       = page.getByRole('button', { name: /^save$/i });
    this.closeButton      = page.getByRole('button', { name: /^close$/i });

    // Ticket list items
    this.ticketItems = page.getByRole('listitem');
  }

  async goto() {
    await this.page.goto('/admin/support');
  }

  /**
   * Create a new support ticket.
   * @param {{ subject, category?, priority?, description }} data
   */
  async createTicket({ subject, category, priority, description }) {
    await this.newTicketButton.click();
    await this.subjectInput.fill(subject);
    if (category)    await this.categoryDropdown.selectOption({ label: category });
    if (priority)    await this.priorityDropdown.selectOption({ label: priority });
    if (description) await this.descriptionInput.fill(description);
    await this.submitButton.click();
  }

  /** Open a ticket by index from the list */
  async openTicket(index = 0) {
    await this.ticketItems.nth(index).click();
  }

  /**
   * Reply to an open ticket and optionally change its status.
   * @param {string} reply
   * @param {string} [status]
   */
  async replyToTicket(reply, status) {
    await this.replyTextarea.fill(reply);
    if (status) await this.statusDropdown.selectOption({ label: status });
    await this.saveButton.click();
  }

  async filterByStatus(tab) {
    const tabMap = {
      all: this.allTab, open: this.openTab, inProgress: this.inProgressTab,
      resolved: this.resolvedTab, closed: this.closedTab,
    };
    await tabMap[tab].click();
  }
}

module.exports = { SupportPage };