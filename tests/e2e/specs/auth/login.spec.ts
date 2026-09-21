import { test, expect } from '../../fixtures';
import { mockCognitoSuccess, mockCognitoError, mockAuthenticatedApis, mockEmptyCart, mockPublicApis } from '../../helpers/api-mocks';
import { injectAuthSession } from '../../helpers/amplify-auth-mock';

test.describe('Login', () => {
  test('shows login form by default', async ({ loginPage }) => {
    await loginPage.goto();
    await expect(loginPage.emailInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.submitButton).toBeVisible();
  });

  // NOTE: The real Cognito SRP login flow (USER_SRP_AUTH) cannot be reliably
  // mocked at the network level (it requires a cryptographic PASSWORD_VERIFIER
  // challenge/response exchange). Real end-to-end login is covered by the
  // prod-smoke suite against real Cognito. Here we verify the frontend redirect
  // behavior: an authenticated user landing on /cuenta is sent to /cuenta/perfil
  // (the redirect implemented in CuentaPage's useEffect).
  test('authenticated user is redirected from /cuenta to profile', async ({ page }) => {
    await injectAuthSession(page);
    await mockPublicApis(page);
    await mockEmptyCart(page);
    await mockCognitoSuccess(page);
    await mockAuthenticatedApis(page);
    await page.goto('/cuenta/');
    await expect(page).toHaveURL(/\/cuenta\/perfil/, { timeout: 15000 });
  });

  test('shows error on wrong credentials', async ({ page, loginPage }) => {
    await mockCognitoError(page, 'NotAuthorizedException', 'Incorrect username or password.');
    await loginPage.goto();
    await loginPage.login('test@armachecafe.com', 'wrongpassword');
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('incorrectos');
  });

  test('forgot password link navigates to recovery page', async ({ page, loginPage }) => {
    await loginPage.goto();
    await loginPage.forgotPasswordLink.click();
    await expect(page).toHaveURL(/\/cuenta\/recuperar/);
  });
});
