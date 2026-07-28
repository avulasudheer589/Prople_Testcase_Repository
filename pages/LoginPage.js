// pages/LoginPage.js
// Handles all authentication flows for Prople (https://app.prople.pro)

class LoginPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // --- Login form locators ---
    this.emailInput    = page.locator('input[type="email"], input[type="text"]').first();
    this.passwordInput = page.locator('input[type="password"]').first();
    this.signInButton  = page.getByRole('button', { name: /sign in/i });

    // "Forgot password?" — match any clickable element with that text
    this.forgotPasswordLink = page
      .locator('a, button, span, p, [role="button"]')
      .filter({ hasText: /forgot.{0,5}password/i })
      .first();

    // --- Device Conflict Dialog ---
    this.deviceConflictTitle  = page.getByText(/already signed in elsewhere/i);
    this.continueHereButton   = page.getByRole('button', { name: /continue here/i });
    this.cancelConflictButton = page.getByRole('button', { name: /^cancel$/i });
  }

  /** Navigate to the login page and wait for the email input to appear */
  async goto() {
    await this.page.goto('/', { waitUntil: 'domcontentloaded' });
    await this.emailInput.waitFor({ state: 'visible', timeout: 15000 });
  }

  async fillEmail(email) {
    await this.emailInput.clear();
    await this.emailInput.fill(email);
  }

  async fillPassword(password) {
    await this.passwordInput.clear();
    await this.passwordInput.fill(password);
  }

  async submit() {
    await this.signInButton.click();
  }

  /**
   * Wait for login to complete — detect by:
   * 1. Device conflict dialog appearing, OR
   * 2. The login form disappearing (sign-in button gone = we moved past login)
   * Does NOT rely on a specific URL pattern.
   */
  async waitForLoginComplete() {
    // First handle device conflict if it appears
    try {
      await this.deviceConflictTitle.waitFor({ state: 'visible', timeout: 8000 });
      // Dialog appeared — click continue
      await this.continueHereButton.click();
    } catch {
      // No conflict dialog — that's fine
    }

    // Wait for the sign-in button to disappear (means we left the login page)
    try {
      await this.signInButton.waitFor({ state: 'hidden', timeout: 20000 });
    } catch {
      // Sign-in button may have already gone
    }

    // Give the SPA time to finish routing and render the dashboard
    await this.page.waitForTimeout(3000);
    await this.page.waitForLoadState('domcontentloaded');
  }

  /** Full employee login */
  async loginAsEmployee() {
    await this.goto();
    await this.fillEmail(process.env.EMPLOYEE_EMAIL || 'abc1@gmail.com');
    await this.fillPassword(process.env.EMPLOYEE_PASSWORD || 'Welcome@123');
    await this.submit();
    await this.waitForLoginComplete();
  }

  /** Full admin login */
  async loginAsAdmin() {
    await this.goto();
    await this.fillEmail(process.env.ADMIN_EMAIL || 'mahesh970098@gmail.com');
    await this.fillPassword(process.env.ADMIN_PASSWORD || 'Welcome@123');
    await this.submit();
    await this.waitForLoginComplete();
  }

  /** Logout via the header profile menu */
  async logout() {
    const avatarBtn = this.page.locator('header').getByRole('button').last();
    await avatarBtn.click();
    const logoutOpt = this.page.getByRole('menuitem', { name: /logout|sign out/i });
    await logoutOpt.waitFor({ state: 'visible', timeout: 5000 });
    await logoutOpt.click();
    await this.page.waitForLoadState('domcontentloaded');
  }
}

module.exports = { LoginPage };
