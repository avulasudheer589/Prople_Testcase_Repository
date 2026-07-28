# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: admin-assets.spec.js >> Admin – Assets >> Asset summary statistics are visible
- Location: tests\admin-assets.spec.js:47:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText(/total/i).first()
Expected: visible
Timeout: 15000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 15000ms
  - waiting for getByText(/total/i).first()

```

```yaml
- link "Prople":
  - /url: /
- heading "Welcome back. Let's get to work." [level=1]
- paragraph: Manage your people, projects, and pipeline — all from one beautiful dashboard.
- text: People Secure Fast
- heading "Sign in" [level=2]
- paragraph: Enter your credentials to continue.
- text: Email
- textbox "you@company.com"
- text: Password
- button "Forgot password?"
- textbox "••••••••"
- button "Sign in"
- region "Notifications alt+T"
```

# Test source

```ts
  1  | // tests/admin-assets.spec.js
  2  | // Admin – Assets module test cases.
  3  | 
  4  | const { test, expect } = require('@playwright/test');
  5  | const { LoginPage }    = require('../pages/LoginPage');
  6  | const { AssetsPage }   = require('../pages/AssetsPage');
  7  | 
  8  | test.describe('Admin – Assets', () => {
  9  | 
  10 |   test.beforeEach(async ({ page }) => {
  11 |     const login = new LoginPage(page);
  12 |     await login.loginAsAdmin();
  13 |   });
  14 | 
  15 |   test('Assets page loads with correct status tabs', async ({ page }) => {
  16 |     const assets = new AssetsPage(page, 'admin');
  17 |     await assets.goto();
  18 |     await expect(assets.allTab).toBeVisible({ timeout: 15000 });
  19 |     await expect(assets.availableTab).toBeVisible({ timeout: 10000 });
  20 |     await expect(assets.assignedTab).toBeVisible({ timeout: 10000 });
  21 |     await expect(assets.maintenanceTab).toBeVisible({ timeout: 10000 });
  22 |     await expect(assets.retiredTab).toBeVisible({ timeout: 10000 });
  23 |   });
  24 | 
  25 |   test('"Add Asset" button is visible', async ({ page }) => {
  26 |     const assets = new AssetsPage(page, 'admin');
  27 |     await assets.goto();
  28 |     await expect(assets.addAssetButton).toBeVisible({ timeout: 15000 });
  29 |   });
  30 | 
  31 |   test('"Add Asset" dialog opens with all required fields', async ({ page }) => {
  32 |     const assets = new AssetsPage(page, 'admin');
  33 |     await assets.goto();
  34 |     await assets.openAddAssetDialog();
  35 |     await expect(page.getByRole('dialog').or(page.locator('div[class*="dialog"], div[class*="modal"]')).first()).toBeVisible({ timeout: 10000 });
  36 |     await expect(assets.assetNameInput).toBeVisible({ timeout: 5000 });
  37 |   });
  38 | 
  39 |   test('Asset dialog can be closed without creating', async ({ page }) => {
  40 |     const assets = new AssetsPage(page, 'admin');
  41 |     await assets.goto();
  42 |     await assets.openAddAssetDialog();
  43 |     await assets.closeDialog();
  44 |     await expect(page.getByRole('dialog')).not.toBeVisible({ timeout: 5000 });
  45 |   });
  46 | 
  47 |   test('Asset summary statistics are visible', async ({ page }) => {
  48 |     const assets = new AssetsPage(page, 'admin');
  49 |     await assets.goto();
> 50 |     await expect(page.getByText(/total/i).first()).toBeVisible({ timeout: 15000 });
     |                                                    ^ Error: expect(locator).toBeVisible() failed
  51 |     await expect(page.getByText(/available/i).first()).toBeVisible({ timeout: 10000 });
  52 |     await expect(page.getByText(/assigned/i).first()).toBeVisible({ timeout: 10000 });
  53 |   });
  54 | 
  55 |   test('Assets list displays asset items and status badges', async ({ page }) => {
  56 |     const assets = new AssetsPage(page, 'admin');
  57 |     await assets.goto();
  58 |     await expect(page.getByText(/available|assigned|maintenance|retired/i).first()).toBeVisible({ timeout: 15000 });
  59 |   });
  60 | 
  61 |   test('Search input filters assets', async ({ page }) => {
  62 |     const assets = new AssetsPage(page, 'admin');
  63 |     await assets.goto();
  64 |     await assets.search('laptop');
  65 |     await expect(page).toHaveURL(/\/assets/);
  66 |   });
  67 | 
  68 |   test('Row actions (Assign, Maintenance, Retire, Edit, History) are present', async ({ page }) => {
  69 |     const assets = new AssetsPage(page, 'admin');
  70 |     await assets.goto();
  71 |     const rowCount = await assets.assignButtons.count();
  72 |     if (rowCount > 0) {
  73 |       await expect(assets.editButtons.first()).toBeVisible();
  74 |       await expect(assets.historyButtons.first()).toBeVisible();
  75 |     }
  76 |   });
  77 | 
  78 | });
```