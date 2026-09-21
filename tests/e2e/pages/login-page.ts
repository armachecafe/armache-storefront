import type { Locator, Page } from '@playwright/test';

export class LoginPage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;
  readonly forgotPasswordLink: Locator;
  readonly loginTab: Locator;
  readonly registerTab: Locator;
  readonly confirmForm: Locator;
  readonly confirmCodeInput: Locator;
  readonly confirmSubmit: Locator;

  constructor(private page: Page) {
    this.emailInput = page.getByTestId('login-email-input');
    this.passwordInput = page.getByTestId('login-password-input');
    this.submitButton = page.getByTestId('login-submit-button');
    this.errorMessage = page.getByTestId('login-error');
    this.forgotPasswordLink = page.getByTestId('login-forgot-password');
    this.loginTab = page.getByTestId('cuenta-tab-login');
    this.registerTab = page.getByTestId('cuenta-tab-register');
    this.confirmForm = page.getByTestId('login-confirm-form');
    this.confirmCodeInput = page.getByTestId('login-confirm-code-input');
    this.confirmSubmit = page.getByTestId('login-confirm-submit');
  }

  async goto() {
    await this.page.goto('/cuenta/');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async switchToRegister() {
    await this.registerTab.click();
  }
}
