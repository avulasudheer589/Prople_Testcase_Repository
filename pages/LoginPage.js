// pages/LoginPage.js
// Handles all authentication flows for Prople (https://app.prople.pro)
// Including the "Already signed in elsewhere" device conflict dialog.

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
   * After submitting credentials, wait for either:
   *   (a) a redirect to /employee or /admin, OR
   *   (b) the device-conflict dialog
   * Then handle the conflict if it appeared.
   */
  async handleDeviceConflict(action = 'continue') {
    try {
      await Promise.race([
        this.page.waitForURL(/\/(employee|admin)/, { timeout: 10000 }),
        this.deviceConflictTitle.waitFor({ state: 'visible', timeout: 10000 }),
      ]);
    } catch {
      // Neither happened in time — continue anyway
    }

    if (await this.deviceConflictTitle.isVisible().catch(() => false)) {
      if (action === 'continue') {
        await this.continueHereButton.click();
      } else {
        await this.cancelConflictButton.click();
      }
    }
  }

  /** Full employee login */
  async loginAsEmployee() {
    await this.goto();
    await this.fillEmail(process.env.EMPLOYEE_EMAIL || 'abc1@gmail.com');
    await this.fillPassword(process.env.EMPLOYEE_PASSWORD || 'Welcome@123');
    await this.submit();
    await this.handleDeviceConflict('continue');
    // Accept any dashboard URL — /employee, /admin, or a sub-route
    await this.page.waitForURL(/\/(employee|admin)/, { timeout: 25000 });
    await this.page.waitForLoadState('domcontentloaded');
  }

  /** Full admin login */
  async loginAsAdmin() {
    await this.goto();
    await this.fillEmail(process.env.ADMIN_EMAIL || 'mahesh970098@gmail.com');
    await this.fillPassword(process.env.ADMIN_PASSWORD || 'Welcome@123');
    await this.submit();
    await this.handleDeviceConflict('continue');
    await this.page.waitForURL(/\/(employee|admin)/, { timeout: 25000 });
    await this.page.waitForLoadState('domcontentloaded');
  }

  /** Logout via the header profile menu */
  async logout() {
    const avatarBtn = this.page.locator('header').getByRole('button').last();
    await avatarBtn.click();
    const logoutOpt = this.page.getByRole('menuitem', { name: /logout|sign out/i });
    await logoutOpt.waitFor({ state: 'visible', timeout: 5000 });
    await logoutOpt.click();
    await this.page.waitForURL(/\/$|\/login/, { timeout: 10000 });
  }
}

module.exports = { LoginPage };
