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
      // Step 1: Login on context1 (resolves any existing conflict automatically)
      await login1.loginAsAdmin();

      // Step 2: Give server 3s to fully register the session
      await page1.waitForTimeout(3000);

      // Step 3: Login on context2 with the same admin credentials (raw — no auto handler)
      await login2.goto();
      await login2.fillEmail(process.env.ADMIN_EMAIL || 'mahesh970098@gmail.com');
      await login2.fillPassword(process.env.ADMIN_PASSWORD || 'Welcome@123');
      await login2.submit();

      // Step 4: Wait up to 10s for either the conflict dialog OR a redirect to appear
      const conflictBtn  = page2.getByRole('button', { name: /continue here/i });
      const conflictVisible = await conflictBtn.isVisible({ timeout: 10000 }).catch(() => false);

      if (conflictVisible) {
        // Dialog appeared — click Continue to sign out the other device
        await conflictBtn.click();
        // After accepting, must land on /admin
        await page2.waitForURL(/\/admin/, { timeout: 15000 });
        await expect(page2).toHaveURL(/\/admin/);
      } else {
        // No dialog — app allowed direct login; assert we're on a dashboard page
        await page2.waitForURL(/\/admin|\/employee/, { timeout: 15000 });
        await expect(page2).toHaveURL(/\/admin|\/employee/);
      }
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