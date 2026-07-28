# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: admin-assets.spec.js >> Admin – Assets >> Asset dialog can be closed without creating
- Location: tests\admin-assets.spec.js:39:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: /add asset|new asset|\+ asset/i }).or(getByText(/add asset|\+ asset/i)).first()

```

# Page snapshot

```yaml
- generic [ref=f1e2]:
  - generic [ref=f1e3]:
    - generic [ref=f1e9]:
      - link [ref=f1e10] [cursor=pointer]:
        - /url: /
      - heading "Welcome back. Let's get to work." [level=1] [ref=f1e15]: Welcome back.Let's get to work.
      - paragraph [ref=f1e16]: Manage your people, projects, and pipeline — all from one beautiful dashboard.
      - generic [ref=f1e17]:
        - generic [ref=f1e18]: People
        - generic [ref=f1e25]: Secure
        - generic [ref=f1e30]: Fast
    - generic [ref=f1e35]:
      - heading "Sign in" [level=2] [ref=f1e36]
      - paragraph [ref=f1e37]: Enter your credentials to continue.
      - generic [ref=f1e38]:
        - generic [ref=f1e39]:
          - text: Email
          - textbox "you@company.com" [ref=f1e44]
        - generic [ref=f1e45]:
          - generic [ref=f1e46]:
            - generic [ref=f1e47]: Password
            - button "Forgot password?" [ref=f1e48]
          - textbox "••••••••" [ref=f1e53]
        - button "Sign in" [ref=f1e54]
  - region "Notifications alt+T"
```

# Test source

```ts
  37  |       .or(page.getByRole('button', { name: /available/i }))
  38  |       .or(page.getByText(/available/i))
  39  |       .first();
  40  | 
  41  |     this.assignedTab = page.getByRole('tab', { name: /assigned/i })
  42  |       .or(page.getByRole('button', { name: /assigned/i }))
  43  |       .or(page.getByText(/assigned/i))
  44  |       .first();
  45  | 
  46  |     this.maintenanceTab = page.getByRole('tab', { name: /maintenance/i })
  47  |       .or(page.getByRole('button', { name: /maintenance/i }))
  48  |       .or(page.getByText(/maintenance/i))
  49  |       .first();
  50  | 
  51  |     this.retiredTab = page.getByRole('tab', { name: /retired/i })
  52  |       .or(page.getByRole('button', { name: /retired/i }))
  53  |       .or(page.getByText(/retired/i))
  54  |       .first();
  55  | 
  56  |     // Admin – row actions
  57  |     this.assignButtons = page.getByRole('button', { name: /^assign$/i });
  58  |     this.maintenanceButtons = page.getByRole('button', { name: /maintenance/i });
  59  |     this.retireButtons = page.getByRole('button', { name: /^retire$/i });
  60  |     this.editButtons = page.getByRole('button', { name: /^edit$/i });
  61  |     this.historyButtons = page.getByRole('button', { name: /history/i });
  62  | 
  63  |     // ---- New Asset dialog ----
  64  |     this.assetNameInput = page.getByLabel(/asset name|name/i)
  65  |       .or(page.getByPlaceholder(/asset name|name/i))
  66  |       .or(page.locator('input[name="name"], input[name="assetName"]'))
  67  |       .first();
  68  | 
  69  |     this.assetTypeDropdown = page.getByRole('combobox', { name: /asset type|type|category/i })
  70  |       .or(page.getByLabel(/asset type|type/i))
  71  |       .or(page.locator('select'))
  72  |       .first();
  73  | 
  74  |     this.assetTagInput = page.getByLabel(/asset tag|tag/i)
  75  |       .or(page.getByPlaceholder(/asset tag|tag/i))
  76  |       .or(page.locator('input[name="tag"], input[name="assetTag"]'))
  77  |       .first();
  78  | 
  79  |     this.serialInput = page.getByLabel(/serial/i)
  80  |       .or(page.getByPlaceholder(/serial/i))
  81  |       .or(page.locator('input[name="serial"], input[name="serialNumber"]'))
  82  |       .first();
  83  | 
  84  |     this.purchaseDateInput = page.getByLabel(/purchase date|purchased/i)
  85  |       .or(page.getByPlaceholder(/purchase/i))
  86  |       .or(page.locator('input[type="date"]'))
  87  |       .first();
  88  | 
  89  |     this.warrantyInput = page.getByLabel(/warranty/i)
  90  |       .or(page.getByPlaceholder(/warranty/i))
  91  |       .first();
  92  | 
  93  |     this.purchasedFromInput = page.getByLabel(/purchased from|vendor/i)
  94  |       .or(page.getByPlaceholder(/purchased from|vendor/i))
  95  |       .first();
  96  | 
  97  |     this.notesTextarea = page.getByLabel(/description|notes|remarks/i)
  98  |       .or(page.getByPlaceholder(/description|notes|remarks/i))
  99  |       .or(page.locator('textarea'))
  100 |       .first();
  101 | 
  102 |     this.createButton = page.getByRole('button', { name: /^create$|^add$|^save$/i }).first();
  103 |     this.closeButton = page.getByRole('button', { name: /close|cancel|×/i })
  104 |       .or(page.locator('button.close, button[aria-label="Close"]'))
  105 |       .first();
  106 | 
  107 |     // ---- Assign dialog ----
  108 |     this.assignEmployeeInput = page.getByRole('textbox', { name: /search employee/i })
  109 |       .or(page.getByPlaceholder(/search employee/i))
  110 |       .first();
  111 |     this.assignDateInput = page.getByLabel(/assign date/i).or(page.locator('input[type="date"]')).first();
  112 |     this.assignNoteInput = page.getByLabel(/note/i).or(page.getByPlaceholder(/note/i)).first();
  113 |     this.confirmAssignButton = page.getByRole('button', { name: /^assign$/i }).last();
  114 | 
  115 |     // ---- Retire dialog ----
  116 |     this.retireReasonTextarea = page.getByLabel(/reason/i).or(page.getByPlaceholder(/reason/i)).first();
  117 |     this.retireAssetButton = page.getByRole('button', { name: /retire asset|retire/i }).last();
  118 |   }
  119 | 
  120 |   async goto() {
  121 |     const path = this.role === 'admin' ? '/admin/assets' : '/employee/assets';
  122 |     await this.page.goto(path);
  123 |     await this.page.waitForLoadState('domcontentloaded').catch(() => {});
  124 |   }
  125 | 
  126 |   async search(text) {
  127 |     await this.searchInput.fill(text);
  128 |   }
  129 | 
  130 |   async filterByCategory(category) {
  131 |     await this.categoryFilter.selectOption(category);
  132 |   }
  133 | 
  134 |   // ─── Admin actions ──────────────────────────────────────────────────────────
  135 | 
  136 |   async openAddAssetDialog() {
> 137 |     await this.addAssetButton.click();
      |                               ^ Error: locator.click: Test timeout of 30000ms exceeded.
  138 |   }
  139 | 
  140 |   /**
  141 |    * Create a new asset.
  142 |    * @param {{ name, type, tag, serial, purchaseDate, warranty, purchasedFrom, notes }} data
  143 |    */
  144 |   async createAsset({ name, type, tag, serial, purchaseDate, warranty, purchasedFrom, notes }) {
  145 |     await this.openAddAssetDialog();
  146 |     await this.assetNameInput.fill(name);
  147 |     await this.assetTypeDropdown.selectOption({ label: type });
  148 |     await this.assetTagInput.fill(tag);
  149 |     await this.serialInput.fill(serial);
  150 |     await this.purchaseDateInput.fill(purchaseDate);
  151 |     await this.warrantyInput.fill(warranty);
  152 |     await this.purchasedFromInput.fill(purchasedFrom);
  153 |     await this.notesTextarea.fill(notes);
  154 |     await this.createButton.click();
  155 |   }
  156 | 
  157 |   async assignAsset(rowIndex = 0, employeeName, assignDate) {
  158 |     await this.assignButtons.nth(rowIndex).click();
  159 |     await this.assignEmployeeInput.fill(employeeName);
  160 |     await this.page.getByRole('option', { name: employeeName }).click();
  161 |     await this.assignDateInput.fill(assignDate);
  162 |     await this.confirmAssignButton.click();
  163 |   }
  164 | 
  165 |   async sendForMaintenance(rowIndex = 0) {
  166 |     await this.maintenanceButtons.nth(rowIndex).click();
  167 |   }
  168 | 
  169 |   async retireAsset(rowIndex = 0, reason) {
  170 |     await this.retireButtons.nth(rowIndex).click();
  171 |     await this.retireReasonTextarea.fill(reason);
  172 |     await this.retireAssetButton.click();
  173 |   }
  174 | 
  175 |   async editAsset(rowIndex = 0) {
  176 |     await this.editButtons.nth(rowIndex).click();
  177 |   }
  178 | 
  179 |   async viewHistory(rowIndex = 0) {
  180 |     await this.historyButtons.nth(rowIndex).click();
  181 |   }
  182 | 
  183 |   async closeDialog() {
  184 |     await this.closeButton.click();
  185 |   }
  186 | }
  187 | 
  188 | module.exports = { AssetsPage };
```