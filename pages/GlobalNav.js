// pages/GlobalNav.js
// Global header elements shared across the entire application.

class GlobalNav {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // Global Search
    this.globalSearchInput = page.getByRole('searchbox', { name: /search/i }).first();

    // Language selector
    this.languageButton = page.getByRole('button', { name: /language/i });

    // Notifications
    this.notificationsBell  = page.getByRole('button', { name: /notifications?/i });
    this.markAllReadButton  = page.getByRole('button', { name: /mark all read/i });

    // User profile menu
    this.userMenuButton = page.getByRole('button', { name: /profile|avatar|initials/i });
    this.profileLink    = page.getByRole('link',   { name: /^profile$/i });
    this.logoutButton   = page.getByRole('button', { name: /logout|sign out/i });

    // AI Voice Assistant quick-launch (header)
    this.aiAssistantButton = page.getByRole('button', { name: /open ai assistant/i });

    // Left Sidebar navigation
    this.sidebar = page.getByRole('navigation');
  }

  /** Search for an employee by name or email in the global search bar */
  async globalSearch(query) {
    await this.globalSearchInput.fill(query);
  }

  /** Open the language selector and choose a language */
  async selectLanguage(language) {
    await this.languageButton.click();
    await this.page.getByRole('option', { name: language }).click();
  }

  /** Open the notifications center */
  async openNotifications() {
    await this.notificationsBell.click();
  }

  /** Mark all notifications as read */
  async markAllNotificationsRead() {
    await this.openNotifications();
    await this.markAllReadButton.click();
  }

  /** Log out of the application */
  async logout() {
    await this.userMenuButton.click();
    await this.logoutButton.click();
  }

  /** Navigate to any sidebar item by its label */
  async navigateTo(label) {
    await this.sidebar.getByRole('link', { name: new RegExp(label, 'i') }).click();
  }
}

module.exports = { GlobalNav };