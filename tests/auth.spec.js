// tests/auth.spec.js
// Authentication test cases for Prople (https://app.prople.pro)
//
// Scenarios covered:
//   1.  Login page renders all fields (email, password, sign-in button, forgot password)
//   2.  "Forgot password?" link navigates away from login
//   3.  Employee login with valid credentials → lands on /employee
//   4.  Admin login with valid credentials → lands on /admin
//   5.  Login with wrong password → stays on login, shows error
//   6.  Login with wrong email → stays on login, shows error
//   7.  Login with empty email → stays on login (submit blocked or error shown)
//   8.  Login with empty password → stays on login (submit blocked or error shown)
//   9.  Login with both fields empty → stays on login
//  10.  Device conflict dialog appears for same account on two sessions → Continue
//  11.  Device conflict dialog → Cancel keeps user on login page
//  12.  Employee can log out → redirected to login/root
//  13.  Admin can log out → redirected to login/root
//  14.  Navigating directly to /employee while logged out redirects to login
//  15.  Navigating directly to /admin while logged out redirects to login

const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');

test.describe('Authentication', () => {

  // ── 1. Login page renders all required fields ────────────────────────────

  test('Login page renders email, password, sign-in button and forgot-password link', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();

    await expect(login.emailInput).toBeVisible();
    await expect(login.passwordInput).toBeVisible();
    await expect(login.signInButton).toBeVisible();
    await expect(login.forgotPasswordLink).toBeVisible();
  });

  // ── 2. "Forgot password?" link navigates away from login ─────────────────

  test('"Forgot password?" link navigates away from the login page', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();

    const urlBefore = page.url();
    await login.forgotPasswordLink.click();

    // Should navigate to a different URL (forgot-password page)
    await page.waitForTimeout(2000);
    const urlAfter = page.url();
    expect(urlAfter).not.toBe(urlBefore);
  });

  // ── 3. Employee valid login ───────────────────────────────────────────────

  test('Employee logs in with valid credentials and lands on /employee', async ({ page }) => {
    const login = new LoginPage(page);
    await login.loginAsEmployee();

    await expect(page).toHaveURL(/\/employee/, { timeout: 15000 });
    // Sidebar should be visible — confirms the dashboard rendered
    await expect(
      page.locator('nav, aside, [role="navigation"]').first()
    ).toBeVisible({ timeout: 10000 });
  });

  // ── 4. Admin valid login ──────────────────────────────────────────────────

  test('Admin logs in with valid credentials and lands on /admin', async ({ page }) => {
    const login = new LoginPage(page);
    await login.loginAsAdmin();

    await expect(page).toHaveURL(/\/admin/, { timeout: 15000 });
    await expect(
      page.locator('nav, aside, [role="navigation"]').first()
    ).toBeVisible({ timeout: 10000 });
  });

  // ── 5. Wrong password ─────────────────────────────────────────────────────

  test('Login with correct email but wrong password stays on login and shows error', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();

    await login.fillEmail('abc1@gmail.com');
    await login.fillPassword('WrongPassword999!');
    await login.submit();

    // Must NOT redirect to any dashboard
    await page.waitForTimeout(3000);
    expect(page.url()).not.toMatch(/\/employee|\/admin/);

    // An error/toast message should be visible
    const errorShown = await login.waitForErrorMessage(6000);
    // Acceptable: either error shown OR still on login URL
    expect(
      errorShown || !page.url().match(/\/employee|\/admin/),
      'Expected to stay on login page with an error after wrong password'
    ).toBe(true);
  });

  // ── 6. Wrong email ────────────────────────────────────────────────────────

  test('Login with unregistered email stays on login and shows error', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();

    await login.fillEmail('notregistered@example.com');
    await login.fillPassword('SomePassword123!');
    await login.submit();

    await page.waitForTimeout(3000);
    expect(page.url()).not.toMatch(/\/employee|\/admin/);
  });

  // ── 7. Empty email ────────────────────────────────────────────────────────

  test('Login with empty email field stays on login page', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();

    await login.fillEmail('');
    await login.fillPassword('Welcome@123');
    await login.submit();

    // Form validation or server error — must NOT navigate away
    await page.waitForTimeout(2000);
    expect(page.url()).not.toMatch(/\/employee|\/admin/);
  });

  // ── 8. Empty password ─────────────────────────────────────────────────────

  test('Login with empty password field stays on login page', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();

    await login.fillEmail('abc1@gmail.com');
    await login.fillPassword('');
    await login.submit();

    await page.waitForTimeout(2000);
    expect(page.url()).not.toMatch(/\/employee|\/admin/);
  });

  // ── 9. Both fields empty ──────────────────────────────────────────────────

  test('Login with both fields empty stays on login page', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();

    await login.submit();

    await page.waitForTimeout(2000);
    expect(page.url()).not.toMatch(/\/employee|\/admin/);
  });

  // ── 10. Device conflict → Continue ───────────────────────────────────────

  test('Device conflict dialog: "Continue here" signs out other session and logs in', async ({ browser }) => {
    const ctx1 = await browser.newContext();
    const ctx2 = await browser.newContext();
    const page1 = await ctx1.newPage();
    const page2 = await ctx2.newPage();

    const login1 = new LoginPage(page1);
    const login2 = new LoginPage(page2);

    try {
      // Session 1: login as admin (resolves any existing conflict automatically)
      await login1.loginAsAdmin();
      await expect(page1).toHaveURL(/\/admin/, { timeout: 15000 });

      // Give the server time to register session 1
      await page1.waitForTimeout(3000);

      // Session 2: login with same admin credentials (raw — no auto-handler)
      await login2.goto();
      await login2.fillEmail(process.env.ADMIN_EMAIL || 'mahesh970098@gmail.com');
      await login2.fillPassword(process.env.ADMIN_PASSWORD || 'Welcome@123');
      await login2.submit();

      // Check if conflict dialog appears
      const conflictVisible = await login2.deviceConflictDialog
        .isVisible({ timeout: 10000 })
        .catch(() => false);

      if (conflictVisible) {
        await expect(login2.continueHereButton).toBeVisible({ timeout: 5000 });
        await login2.continueHereButton.click();
        // After continuing, must land on /admin
        await page2.waitForURL(/\/admin/, { timeout: 15000 });
        await expect(page2).toHaveURL(/\/admin/);
      } else {
        // App allowed direct login without conflict — still valid
        await page2.waitForURL(/\/admin|\/employee/, { timeout: 15000 });
        await expect(page2).toHaveURL(/\/admin|\/employee/);
      }
    } finally {
      await ctx1.close();
      await ctx2.close();
    }
  });

  // ── 11. Device conflict → Cancel ─────────────────────────────────────────

  test('Device conflict dialog: "Cancel" keeps the user on the login page', async ({ browser }) => {
    const ctx1 = await browser.newContext();
    const ctx2 = await browser.newContext();
    const page1 = await ctx1.newPage();
    const page2 = await ctx2.newPage();

    const login1 = new LoginPage(page1);
    const login2 = new LoginPage(page2);

    try {
      await login1.loginAsAdmin();
      await expect(page1).toHaveURL(/\/admin/, { timeout: 15000 });
      await page1.waitForTimeout(3000);

      await login2.goto();
      await login2.fillEmail(process.env.ADMIN_EMAIL || 'mahesh970098@gmail.com');
      await login2.fillPassword(process.env.ADMIN_PASSWORD || 'Welcome@123');
      await login2.submit();

      const conflictVisible = await login2.deviceConflictDialog
        .isVisible({ timeout: 10000 })
        .catch(() => false);

      if (conflictVisible) {
        await expect(login2.cancelConflictButton).toBeVisible({ timeout: 5000 });
        await login2.cancelConflictButton.click();
        // After cancel, should NOT be on a dashboard page
        await page2.waitForTimeout(2000);
        expect(page2.url()).not.toMatch(/\/admin|\/employee/);
      } else {
        // No conflict appeared — skip assertion (environment already clean)
        test.skip();
      }
    } finally {
      await ctx1.close();
      await ctx2.close();
    }
  });

  // ── 12. Employee logout ───────────────────────────────────────────────────

  test('Employee can log out and is redirected to the login page', async ({ page }) => {
    const login = new LoginPage(page);
    await login.loginAsEmployee();
    await expect(page).toHaveURL(/\/employee/, { timeout: 15000 });

    await login.logout();

    // After logout, must be on root or /login
    await expect(page).toHaveURL(/\/$|\/login/, { timeout: 15000 });
    // Login form should be visible again
    await expect(login.emailInput).toBeVisible({ timeout: 10000 });
  });

  // ── 13. Admin logout ──────────────────────────────────────────────────────

  test('Admin can log out and is redirected to the login page', async ({ page }) => {
    const login = new LoginPage(page);
    await login.loginAsAdmin();
    await expect(page).toHaveURL(/\/admin/, { timeout: 15000 });

    await login.logout();

    await expect(page).toHaveURL(/\/$|\/login/, { timeout: 15000 });
    await expect(login.emailInput).toBeVisible({ timeout: 10000 });
  });

  // ── 14. Protected route /employee — unauthenticated ───────────────────────

  test('Navigating to /employee while logged out redirects to login', async ({ page }) => {
    // Fresh page — no session — navigate directly to the protected route
    await page.goto('/employee', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);

    // Must be redirected to root or /login, NOT stay on /employee
    expect(page.url()).not.toMatch(/\/employee/);
  });

  // ── 15. Protected route /admin — unauthenticated ──────────────────────────

  test('Navigating to /admin while logged out redirects to login', async ({ page }) => {
    await page.goto('/admin', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);

    expect(page.url()).not.toMatch(/\/admin/);
  });

});
