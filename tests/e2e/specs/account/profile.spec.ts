import { test, expect } from '../../fixtures';
import { mockPublicApis, mockEmptyCart, mockCognitoSuccess, mockAuthenticatedApis } from '../../helpers/api-mocks';
import { injectAuthSession } from '../../helpers/amplify-auth-mock';

test.describe('Profile', () => {
  test.beforeEach(async ({ page }) => {
    // Inject auth tokens BEFORE any navigation so AuthContext resolves as authenticated
    await injectAuthSession(page);
    await mockPublicApis(page);
    await mockEmptyCart(page);
    await mockCognitoSuccess(page);
    await mockAuthenticatedApis(page);
  });

  test('displays profile form with user data', async ({ page, profilePage }) => {
    await profilePage.goto();
    await page.waitForLoadState('networkidle');
    await expect(profilePage.pageContainer).toBeVisible({ timeout: 15000 });
    await expect(profilePage.givenNameInput).toBeVisible();
    await expect(profilePage.emailInput).toBeVisible();
  });

  test('shows success message after updating profile', async ({ page, profilePage }) => {
    await profilePage.goto();
    await page.waitForLoadState('networkidle');
    await expect(profilePage.pageContainer).toBeVisible({ timeout: 15000 });
    await profilePage.updateName('Carlos', 'López');
    await expect(profilePage.successMessage).toBeVisible();
  });

  test('displays change password section', async ({ page, profilePage }) => {
    await profilePage.goto();
    await page.waitForLoadState('networkidle');
    await expect(profilePage.changePasswordForm).toBeVisible({ timeout: 15000 });
  });

  test('displays change email section', async ({ page, profilePage }) => {
    await profilePage.goto();
    await page.waitForLoadState('networkidle');
    await expect(profilePage.changeEmailForm).toBeVisible({ timeout: 15000 });
  });
});
