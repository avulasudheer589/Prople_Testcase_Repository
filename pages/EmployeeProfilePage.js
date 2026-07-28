// pages/EmployeeProfilePage.js
// Employee "My Profile" – /employee/profile
// Tabs: Personal Info | Work | Bank & Compliance | Change Password

class EmployeeProfilePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // Tabs
    this.personalInfoTab     = page.getByRole('tab', { name: /personal info/i });
    this.workTab             = page.getByRole('tab', { name: /^work$/i });
    this.bankComplianceTab   = page.getByRole('tab', { name: /bank.*compliance/i });
    this.changePasswordTab   = page.getByRole('tab', { name: /change password/i });

    // Personal Info – view mode actions
    this.editButton  = page.getByRole('button', { name: /^edit$/i });
    this.resignButton = page.getByRole('button', { name: /resign/i });

    // Personal Info – edit mode fields
    this.fullNameInput        = page.getByLabel(/full name/i);
    this.phoneInput           = page.getByLabel(/phone number/i);
    this.dobInput             = page.getByLabel(/date of birth/i);
    this.bloodGroupDropdown   = page.getByRole('combobox', { name: /blood group/i });
    this.addressTextarea      = page.getByLabel(/employee address/i);
    this.emergencyNameInput   = page.getByLabel(/emergency contact name/i);
    this.emergencyPhoneInput  = page.getByLabel(/emergency contact number/i);

    // Edit mode actions
    this.saveButton   = page.getByRole('button', { name: /^save$/i });
    this.cancelButton = page.getByRole('button', { name: /^cancel$/i });

    // Change Password fields
    this.currentPasswordInput = page.getByLabel(/current password/i);
    this.newPasswordInput     = page.getByLabel(/^new password$/i);
    this.confirmPasswordInput = page.getByLabel(/confirm password/i);
    this.updatePasswordButton = page.getByRole('button', { name: /^update$/i });

    // Resignation dialog
    this.resignationDialog    = page.getByRole('dialog');
    this.toInput              = page.getByLabel(/^to/i);
    this.ccInput              = page.getByLabel(/^cc/i);
    this.subjectInput         = page.getByLabel(/^subject/i);
    this.messageTextarea      = page.getByLabel(/^message/i);
    this.submitResignationBtn = page.getByRole('button', { name: /submit resignation/i });
    this.closeDialogButton    = page.getByRole('button', { name: /^close$/i });
  }

  async goto() {
    await this.page.goto('/employee/profile');
  }

  /** Enter edit mode on Personal Info tab */
  async enterEditMode() {
    await this.editButton.click();
  }

  /**
   * Update personal information fields.
   * @param {{ fullName?, phone?, dob?, bloodGroup?, address?, emergencyName?, emergencyPhone? }} data
   */
  async updatePersonalInfo(data = {}) {
    await this.enterEditMode();
    if (data.fullName)       await this.fullNameInput.fill(data.fullName);
    if (data.phone)          await this.phoneInput.fill(data.phone);
    if (data.dob)            await this.dobInput.fill(data.dob);
    if (data.bloodGroup)     await this.bloodGroupDropdown.selectOption({ label: data.bloodGroup });
    if (data.address)        await this.addressTextarea.fill(data.address);
    if (data.emergencyName)  await this.emergencyNameInput.fill(data.emergencyName);
    if (data.emergencyPhone) await this.emergencyPhoneInput.fill(data.emergencyPhone);
    await this.saveButton.click();
  }

  /** Change the employee password */
  async changePassword(currentPwd, newPwd, confirmPwd) {
    await this.changePasswordTab.click();
    await this.currentPasswordInput.fill(currentPwd);
    await this.newPasswordInput.fill(newPwd);
    await this.confirmPasswordInput.fill(confirmPwd);
    await this.updatePasswordButton.click();
  }

  /** Submit a resignation */
  async submitResignation({ to, cc, subject, message }) {
    await this.resignButton.click();
    if (to)      await this.toInput.fill(to);
    if (cc)      await this.ccInput.fill(cc);
    if (subject) await this.subjectInput.fill(subject);
    if (message) await this.messageTextarea.fill(message);
    await this.submitResignationBtn.click();
  }
}

module.exports = { EmployeeProfilePage };