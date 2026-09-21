import type { Locator, Page } from '@playwright/test';

export class RegisterPage {
  readonly givenNameInput: Locator;
  readonly familyNameInput: Locator;
  readonly emailInput: Locator;
  readonly phoneInput: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly consentCheckbox: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;
  readonly confirmForm: Locator;
  readonly confirmCodeInput: Locator;
  readonly confirmSubmit: Locator;
  readonly resendCodeButton: Locator;

  constructor(private page: Page) {
    this.givenNameInput = page.getByTestId('register-given-name-input');
    this.familyNameInput = page.getByTestId('register-family-name-input');
    this.emailInput = page.getByTestId('register-email-input');
    this.phoneInput = page.getByTestId('register-phone-input');
    this.passwordInput = page.getByTestId('register-password-input');
    this.confirmPasswordInput = page.getByTestId('register-confirm-password-input');
    this.consentCheckbox = page.getByTestId('register-consent-checkbox');
    this.submitButton = page.getByTestId('register-submit-button');
    this.errorMessage = page.getByTestId('register-error');
    this.confirmForm = page.getByTestId('register-confirm-form');
    this.confirmCodeInput = page.getByTestId('register-confirm-code-input');
    this.confirmSubmit = page.getByTestId('register-confirm-submit');
    this.resendCodeButton = page.getByTestId('register-resend-code');
  }

  async fillForm(data: { givenName: string; familyName: string; email: string; password: string; phone?: string }) {
    await this.givenNameInput.fill(data.givenName);
    await this.familyNameInput.fill(data.familyName);
    await this.emailInput.fill(data.email);
    if (data.phone) await this.phoneInput.fill(data.phone);
    await this.passwordInput.fill(data.password);
    await this.confirmPasswordInput.fill(data.password);
    await this.consentCheckbox.check();
  }

  async submit() {
    await this.submitButton.click();
  }
}
