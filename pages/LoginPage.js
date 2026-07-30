// pages/LoginPage.js
// Authentication page object for Prople (https://app.prople.pro)
//
// Confirmed from app exploration:
//   - Login URL  : https://app.prople.pro/  (redirects to /login)
//   - Employee   : abc1@gmail.com / Welcome@123  → lands on /employee
//   - Admin      : mahesh970098@gmail.com / Welcome@123  → lands on /admin
//   - Device conflict dialog: "Already signed in elsewhere"
//     buttons: "Continue here & sign out other device" | "Cancel"
//   - Forgot password link is present on the login page
//   - Logout: accessible via the user avatar/menu in the top header

class LoginPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // ── Login form ──────────────────────────────────────────────────────────
    this.emailInput    = page.locator('input[type="email"], input[type="text"]').first();
    this.passwordInput = page.locator('input[type="password"]').first();

    // The submit button label is "Sign In" or "Login"
    this.signInButton  = page.getByRole('button', { name: /sign in|login/i });

    // "Forgot password?" — any clickable element with that text
    this.forgotPasswordLink = page
      .locator('a, button, span, p, [role="button"]')
      .filter({ hasText: /forgot.{0,10}password/i })
      .first();

    // ── Error / validation messages ─────────────────────────────────────────
    // Shown when credentials are wrong or fields are empty
    this.errorMessage = page
      .locator('[role="alert"], .error, [class*="error"], [class*="toast"]')
      .first();

    // ── Device conflict dialog ──────────────────────────────────────────────
    // Appears when the same account is already signed in on another device/tab
    this.deviceConflictDialog  = page.getByText(/already signed in elsewhere/i);
    this.continueHereButton    = page.getByRole('button', { name: /continue here/i });
    this.cancelConflictButton  = page.getByRole('button', { name: /^cancel$/i });

    // ── Logout ──────────────────────────────────────────────────────────────
    // User avatar / profile button in the top header (last button in header)
    this.avatarButton = page.locator('header').getByRole('button').last();
    this.logoutOption = page.getByRole('menuitem', { name: /logout|sign out/i });
  }

  // ── Navigation ─────────────────────────────────────────────────────────────

  /** Go to the login page and wait for the email field to appear */
  async goto() {
    await this.page.goto('/', { waitUntil: 'domcontentloaded' });
    await this.emailInput.waitFor({ state: 'visible', timeout: 15000 });
  }

  // ── Form helpers ───────────────────────────────────────────────────────────

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

  // ── Post-submit helpers ────────────────────────────────────────────────────

  /**
   * Wait for login to complete after submit().
   * Handles the "already signed in elsewhere" device conflict dialog automatically.
   * Resolves when the SPA dashboard is rendered.
   */
  async waitForLoginComplete() {
    // Handle device conflict dialog if it appears (within 8 s)
    try {
      await this.deviceConflictDialog.waitFor({ state: 'visible', timeout: 8000 });
      await this.continueHereButton.click();
    } catch {
      // No conflict — continue normally
    }

    // Wait for the sign-in button to disappear (left the login page)
    try {
      await this.signInButton.waitFor({ state: 'hidden', timeout: 20000 });
    } catch {
      // May already be gone
    }

    // Allow the SPA to finish routing and render the dashboard
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(2000);
  }

  /**
   * Wait for an error message to appear after a failed login attempt.
   * Returns true if any error/toast is visible within the timeout.
   */
  async waitForErrorMessage(timeout = 8000) {
    try {
      await this.errorMessage.waitFor({ state: 'visible', timeout });
      return true;
    } catch {
      return false;
    }
  }

  // ── Full login flows ───────────────────────────────────────────────────────

  /** Login as the employee user (abc1@gmail.com) */
  async loginAsEmployee() {
    await this.goto();
    await this.fillEmail(process.env.EMPLOYEE_EMAIL || 'abc1@gmail.com');
    await this.fillPassword(process.env.EMPLOYEE_PASSWORD || 'Welcome@123');
    await this.submit();
    await this.waitForLoginComplete();
  }

  /** Login as the admin user (mahesh970098@gmail.com) */
  async loginAsAdmin() {
    await this.goto();
    await this.fillEmail(process.env.ADMIN_EMAIL || 'mahesh970098@gmail.com');
    await this.fillPassword(process.env.ADMIN_PASSWORD || 'Welcome@123');
    await this.submit();
    await this.waitForLoginComplete();
  }

  // ── Logout ─────────────────────────────────────────────────────────────────

  /**
   * Logout via the top-header avatar/profile menu.
   * Works for both employee and admin sessions.
   */
  async logout() {
    await this.avatarButton.waitFor({ state: 'visible', timeout: 10000 });
    await this.avatarButton.click();
    await this.logoutOption.waitFor({ state: 'visible', timeout: 5000 });
    await this.logoutOption.click();
    // Wait for redirect back to the login page
    await this.page.waitForURL(/\/$|\/login/, { timeout: 15000 });
    await this.page.waitForLoadState('domcontentloaded');
  }
}

module.exports = { LoginPage };
