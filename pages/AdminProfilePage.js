// pages/AdminProfilePage.js
// Admin – Profile (/admin/profile)
// Tabs: Company Details | Change Password

class AdminProfilePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // Tabs
    this.companyDetailsTab = page.getByRole('tab', { name: /company details/i });
    this.changePasswordTab = page.getByRole('tab', { name: /change password/i });

    // Company Details fields
    this.companyNameInput  = page.getByLabel(/company name/i);
    this.companyEmailInput = page.getByLabel(/company email/i);
    this.industryInput     = page.getByLabel(/industry/i);
    this.companySizeInput  = page.getByLabel(/company size/i);
    this.gstinInput        = page.getByLabel(/gstin/i);
    this.websiteInput      = page.getByLabel(/website/i);
    this.addressTextarea   = page.getByLabel(/^address$/i);
    this.adminNameInput    = page.getByLabel(/admin name/i);
    this.adminEmailInput   = page.getByLabel(/admin email/i);
    this.editProfileButton = page.getByRole('button', { name: /edit profile/i });

    // Change Password fields
    this.currentPwdInput  = page.getByLabel(/current password/i);
    this.newPwdInput      = page.getByLabel(/^new password$/i);
    this.confirmPwdInput  = page.getByLabel(/confirm password/i);
    this.updatePwdButton  = page.getByRole('button', { name: /^update$/i });
  }

  async goto() {
    await this.page.goto('/admin/profile');
  }

  /**
   * Update company details.
   * @param {{ companyName?, industry?, website?, address? }} data
   */
  async updateCompanyDetails(data = {}) {
    await this.companyDetailsTab.click();
    if (data.companyName) await this.companyNameInput.fill(data.companyName);
    if (data.industry)    await this.industryInput.fill(data.industry);
    if (data.website)     await this.websiteInput.fill(data.website);
    if (data.address)     await this.addressTextarea.fill(data.address);
    await this.editProfileButton.click();
  }

  async changePassword(currentPwd, newPwd, confirmPwd) {
    await this.changePasswordTab.click();
    await this.currentPwdInput.fill(currentPwd);
    await this.newPwdInput.fill(newPwd);
    await this.confirmPwdInput.fill(confirmPwd);
    await this.updatePwdButton.click();
  }
}

module.exports = { AdminProfilePage };