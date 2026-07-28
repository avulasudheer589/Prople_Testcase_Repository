// tests/auth.spec.js
// Authentication test cases — including device conflict ("Already signed in elsewhere") resolution.

const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');

test.describe('Authentication', () => {

  // ── Happy path ─────────────────────────────────────────────────────────

  test('Login page renders all required fields', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await expect(login.emailInput).toBeVisible();
    await expect(login.passwordInput).toBeVisible();
    await expect(login.signInButton).toBeVisible();
    await expect(login.forgotPasswordLink).toBeVisible();
  });

  test('"Forgot password?" link is clickable', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.forgotPasswordLink.click();
    // Should navigate away from the root login page
    await expect(page).not.toHaveURL(/^https:\/\/app\.prople\.pro\/?$/);
  });

  test('Employee can log in with valid credentials', async ({ page }) => {
    const login = new LoginPage(page);
    await login.loginAsEmployee();
    await expect(page).toHaveURL(/\/employee/);
  });

  test('Admin can log in and lands on /admin', async ({ page }) => {
    const login = new LoginPage(page);
    await login.loginAsAdmin();
    await expect(page).toHaveURL(/\/admin/);
  });

  // ── Negative path ───────────────────────────────────────────────────────

  test('Login fails with invalid credentials and stays on login page', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.fillEmail('invalid@example.com');
    await login.fillPassword('WrongPassword123!');
    await login.submit();
    // Should NOT redirect to any dashboard
    await expect(page).not.toHaveURL(/\/employee|\/admin/);
  });

  // ── Device Conflict Dialog ("Already signed in elsewhere") ─────────────

  test('Handles "Already signed in elsewhere" device conflict dialog when signing in on a new session', async ({ browser }) => {
    const context1 = await browser.newContext();
    const context2 = await browser.newContext();

    const page1 = await context1.newPage();
    const page2 = await context2.newPage();

    const login1 = new LoginPage(page1);
    const login2 = new LoginPage(page2);

    try {
      // 1. First device logs in
      await login1.loginAsAdmin();
      await expect(page1).toHaveURL(/\/admin/);

      // 2. Second device attempts login with the same credentials
      await login2.goto();
      await login2.fillEmail(process.env.ADMIN_EMAIL || 'mahesh970098@gmail.com');
      await login2.fillPassword(process.env.ADMIN_PASSWORD || 'Welcome@123');
      await login2.submit();

      // 3. Verify the "Already signed in elsewhere" modal appears
      await expect(login2.deviceConflictTitle).toBeVisible({ timeout: 10000 });
      await expect(login2.continueHereButton).toBeVisible();
      await expect(login2.cancelConflictButton).toBeVisible();

      // 4. Click "Continue here & sign out other device"
      await login2.continueHereButton.click();
      await expect(page2).toHaveURL(/\/admin/);
    } finally {
      await context1.close();
      await context2.close();
    }
  });

  test('Device conflict dialog can be cancelled', async ({ browser }) => {
    const context1 = await browser.newContext();
    const context2 = await browser.newContext();

    const page1 = await context1.newPage();
    const page2 = await context2.newPage();

    const login1 = new LoginPage(page1);
    const login2 = new LoginPage(page2);

    try {
      await login1.loginAsAdmin();
      await expect(page1).toHaveURL(/\/admin/);

      await login2.goto();
      await login2.fillEmail(process.env.ADMIN_EMAIL || 'mahesh970098@gmail.com');
      await login2.fillPassword(process.env.ADMIN_PASSWORD || 'Welcome@123');
      await login2.submit();

      if (await login2.deviceConflictTitle.isVisible({ timeout: 5000 }).catch(() => false)) {
        await login2.cancelConflictButton.click();
        await expect(page2).not.toHaveURL(/\/admin/);
      }
    } finally {
      await context1.close();
      await context2.close();
    }
  });

  // ── Logout ──────────────────────────────────────────────────────────────

  test('Employee can log out', async ({ page }) => {
    const login = new LoginPage(page);
    await login.loginAsEmployee();
    await expect(page).toHaveURL(/\/employee/);
    await login.logout();
    await expect(page).toHaveURL(/\/$|\/login/);
  });

  test('Admin can log out', async ({ page }) => {
    const login = new LoginPage(page);
    await login.loginAsAdmin();
    await expect(page).toHaveURL(/\/admin/);
    await login.logout();
    await expect(page).toHaveURL(/\/$|\/login/);
  });

});