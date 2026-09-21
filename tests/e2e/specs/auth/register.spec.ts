import { test, expect } from '../../fixtures';
import { mockCognitoSuccess, mockCognitoError } from '../../helpers/api-mocks';

test.describe('Register', () => {
  test('shows register form after switching tab', async ({ loginPage, registerPage }) => {
    await loginPage.goto();
    await loginPage.switchToRegister();
    await expect(registerPage.givenNameInput).toBeVisible();
    await expect(registerPage.emailInput).toBeVisible();
    await expect(registerPage.passwordInput).toBeVisible();
    await expect(registerPage.consentCheckbox).toBeVisible();
  });

  test('successful registration shows verification code form', async ({ page, loginPage, registerPage }) => {
    await mockCognitoSuccess(page);
    await loginPage.goto();
    await loginPage.switchToRegister();
    await registerPage.fillForm({
      givenName: 'María',
      familyName: 'García',
      email: 'maria@test.com',
      password: 'Test1234!',
    });
    await registerPage.submit();
    await expect(registerPage.confirmForm).toBeVisible();
  });

  test('shows error when email already exists', async ({ page, loginPage, registerPage }) => {
    await mockCognitoError(page, 'UsernameExistsException', 'User already exists');
    await loginPage.goto();
    await loginPage.switchToRegister();
    await registerPage.fillForm({
      givenName: 'Test',
      familyName: 'User',
      email: 'existing@test.com',
      password: 'Test1234!',
    });
    await registerPage.submit();
    await expect(registerPage.errorMessage).toBeVisible();
    await expect(registerPage.errorMessage).toContainText('Ya existe');
  });

  test('validates consent checkbox is required', async ({ page, loginPage, registerPage }) => {
    await loginPage.goto();
    await loginPage.switchToRegister();
    await registerPage.givenNameInput.fill('Test');
    await registerPage.familyNameInput.fill('User');
    await registerPage.emailInput.fill('test@test.com');
    await registerPage.passwordInput.fill('Test1234!');
    await registerPage.confirmPasswordInput.fill('Test1234!');
    // Don't check consent
    await registerPage.submit();
    // Should show validation error (consent not checked)
    await expect(page.getByText('Debes aceptar')).toBeVisible();
  });
});
