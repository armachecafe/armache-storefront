import { test, expect } from '../../fixtures';
import { mockCognitoSuccess, mockCognitoError } from '../../helpers/api-mocks';

test.describe('Forgot Password', () => {
  test('shows email form on page load', async ({ forgotPasswordPage }) => {
    await forgotPasswordPage.goto();
    await expect(forgotPasswordPage.emailForm).toBeVisible();
    await expect(forgotPasswordPage.emailInput).toBeVisible();
    await expect(forgotPasswordPage.sendCodeButton).toBeVisible();
  });

  test('sends code and shows reset form', async ({ page, forgotPasswordPage }) => {
    await mockCognitoSuccess(page);
    await forgotPasswordPage.goto();
    await forgotPasswordPage.sendCode('test@armachecafe.com');
    await expect(forgotPasswordPage.resetForm).toBeVisible();
    await expect(forgotPasswordPage.codeInput).toBeVisible();
  });

  test('shows error for non-existent user', async ({ page, forgotPasswordPage }) => {
    await mockCognitoError(page, 'UserNotFoundException', 'User does not exist.');
    await forgotPasswordPage.goto();
    await forgotPasswordPage.sendCode('nonexistent@email.com');
    await expect(forgotPasswordPage.errorMessage).toBeVisible();
    await expect(forgotPasswordPage.errorMessage).toContainText('No encontramos');
  });

  test('shows success after password reset', async ({ page, forgotPasswordPage }) => {
    await mockCognitoSuccess(page);
    await forgotPasswordPage.goto();
    await forgotPasswordPage.sendCode('test@armachecafe.com');
    await forgotPasswordPage.resetPassword('123456', 'NewPass1234!');
    await expect(forgotPasswordPage.successMessage).toBeVisible();
  });
});
