import type { Locator, Page } from '@playwright/test';

export class ForgotPasswordPage {
  readonly emailForm: Locator;
  readonly emailInput: Locator;
  readonly sendCodeButton: Locator;
  readonly resetForm: Locator;
  readonly codeInput: Locator;
  readonly newPasswordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly resetSubmitButton: Locator;
  readonly errorMessage: Locator;
  readonly successMessage: Locator;
  readonly backToEmailButton: Locator;
  readonly backLink: Locator;

  constructor(private page: Page) {
    this.emailForm = page.getByTestId('forgot-password-email-form');
    this.emailInput = page.getByTestId('forgot-password-email-input');
    this.sendCodeButton = page.getByTestId('forgot-password-send-code');
    this.resetForm = page.getByTestId('forgot-password-reset-form');
    this.codeInput = page.getByTestId('forgot-password-code-input');
    this.newPasswordInput = page.getByTestId('forgot-password-new-password-input');
    this.confirmPasswordInput = page.getByTestId('forgot-password-confirm-password-input');
    this.resetSubmitButton = page.getByTestId('forgot-password-reset-submit');
    this.errorMessage = page.getByTestId('forgot-password-error');
    this.successMessage = page.getByTestId('forgot-password-success');
    this.backToEmailButton = page.getByTestId('forgot-password-back-to-email');
    this.backLink = page.getByTestId('recuperar-back-link');
  }

  async goto() {
    await this.page.goto('/cuenta/recuperar/');
  }

  async sendCode(email: string) {
    await this.emailInput.fill(email);
    await this.sendCodeButton.click();
  }

  async resetPassword(code: string, newPassword: string) {
    await this.codeInput.fill(code);
    await this.newPasswordInput.fill(newPassword);
    await this.confirmPasswordInput.fill(newPassword);
    await this.resetSubmitButton.click();
  }
}
