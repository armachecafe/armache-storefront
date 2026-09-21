import type { Locator, Page } from '@playwright/test';

export class ProfilePage {
  readonly pageContainer: Locator;
  readonly givenNameInput: Locator;
  readonly familyNameInput: Locator;
  readonly emailInput: Locator;
  readonly phoneInput: Locator;
  readonly submitButton: Locator;
  readonly successMessage: Locator;
  readonly errorMessage: Locator;
  readonly changePasswordForm: Locator;
  readonly changeEmailForm: Locator;

  constructor(private page: Page) {
    this.pageContainer = page.getByTestId('profile-page');
    this.givenNameInput = page.getByTestId('profile-given-name-input');
    this.familyNameInput = page.getByTestId('profile-family-name-input');
    this.emailInput = page.getByTestId('profile-email-input');
    this.phoneInput = page.getByTestId('profile-phone-input');
    this.submitButton = page.getByTestId('profile-submit-button');
    this.successMessage = page.getByTestId('profile-success');
    this.errorMessage = page.getByTestId('profile-error');
    this.changePasswordForm = page.getByTestId('change-password-form');
    this.changeEmailForm = page.getByTestId('change-email-form');
  }

  async goto() {
    await this.page.goto('/cuenta/perfil/');
  }

  async updateName(givenName: string, familyName: string) {
    await this.givenNameInput.fill(givenName);
    await this.familyNameInput.fill(familyName);
    await this.submitButton.click();
  }
}
