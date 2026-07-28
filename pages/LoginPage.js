// pages/LoginPage.js
// Handles all authentication flows for Prople (https://app.prople.pro)
// Including the "Already signed in elsewhere" device conflict dialog.

class LoginPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // --- Locators (matched to actual Prople login DOM) ---
    this.emailInput         = page.locator('input[type="email"], input[type="text"]').first();
    this.passwordInput      = page.locator('input[type="password"]').first();
    this.signInButton       = page.getByRole('button', { name: /sign in/i });
    // "Forgot password?" — target any clickable element containing that text
    this.forgotPasswordLink = page.locator('a, button, span, p, [role="button"]')
      .filter({ hasText: /forgot.{0,5}password/i })
      .first();

    // --- Device Conflict Dialog ("Already signed in elsewhere") ---
    this.deviceConflictDialog = page.getByRole('dialog')
      .or(page.locator('div').filter({ hasText: /already signed in elsewhere/i }))
      .first();
    this.deviceConflictTitle   = page.getByText(/already signed in elsewhere/i);
    this.continueHereButton    = page.getByRole('button', { name: /continue here/i });
    this.cancelConflictButton  = page.getByRole('button', { name: /^cancel$/i });
  }

  /**
   * Navigate to the login page and wait for the email input.
   */
  async goto() {
    await this.page.goto('/');
    await this.emailInput.waitFor({ state: 'visible', timeout: 10000 });
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
   * Handles the "Already signed in elsewhere" modal if it appears after submitting credentials.
   * Waits reliably for either dashboard redirect OR the conflict modal.
   * @param {'continue' | 'cancel'} action - 'continue' to sign out the other session or 'cancel' to abort.
   */
  async handleDeviceConflict(action = 'continue') {
    const conflictModal = this.deviceConflictTitle;
    
    // Wait up to 8s for either redirect or conflict modal to appear
    try {
      await Promise.race([
        this.page.waitForURL(/\/admin|\/employee/, { timeout: 8000 }),
        conflictModal.waitFor({ state: 'visible', timeout: 8000 })
      ]);
    } catch {
      // Timeout reached – check if modal is visible now
    }

    if (await conflictModal.isVisible().catch(() => false)) {
      if (action === 'continue') {
        await this.continueHereButton.click();
      } else if (action === 'cancel') {
        await this.cancelConflictButton.click();
      }
    }
  }

  /**
   * Full employee login — handles sign-in and device conflict resolution end to end.
   */
  async loginAsEmployee() {
    await this.goto();
    await this.fillEmail(process.env.EMPLOYEE_EMAIL || 'abc1@gmail.com');
    await this.fillPassword(process.env.EMPLOYEE_PASSWORD || 'Welcome@123');
    await this.submit();
    await this.handleDeviceConflict('continue');
    await this.page.waitForURL(/\/employee/, { timeout: 15000 });
  }

  /**
   * Full admin login — handles sign-in and device conflict resolution end to end.
   */
  async loginAsAdmin() {
    await this.goto();
    await this.fillEmail(process.env.ADMIN_EMAIL || 'mahesh970098@gmail.com');
    await this.fillPassword(process.env.ADMIN_PASSWORD || 'Welcome@123');
    await this.submit();
    await this.handleDeviceConflict('continue');
    await this.page.waitForURL(/\/admin/, { timeout: 15000 });
  }

  /**
   * Logs out the currently signed-in user via the header profile menu.
   */
  async logout() {
    const avatarButton = this.page.locator('header').getByRole('button').last();
    await avatarButton.click();
    const logoutOption = this.page.getByRole('menuitem', { name: /logout|sign out/i });
    await logoutOption.waitFor({ state: 'visible', timeout: 5000 });
    await logoutOption.click();
    await this.page.waitForURL(/\/$|\/login/, { timeout: 10000 });
  }
}

module.exports = { LoginPage };