import { test, expect } from '@playwright/test';
import { attachConsoleGuard, describeProblems } from '../helpers/console-guard';

/**
 * PROD-SMOKE: validates the REAL login UI flow against production Cognito (D-07).
 * This spec runs as a GUEST (clears storageState) to exercise the form itself.
 *
 * Requires ephemeral credentials via env (TEST_USER_EMAIL / TEST_USER_PASSWORD);
 * skips gracefully if absent.
 */
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('prod-smoke: login UI', () => {
  test('login form renders and authenticates a real user', async ({ page }) => {
    const email = process.env.TEST_USER_EMAIL;
    const password = process.env.TEST_USER_PASSWORD;
    test.skip(!email || !password, 'No ephemeral credentials provided');

    const problems = attachConsoleGuard(page, test.info());
    await page.goto('/cuenta/');

    await expect(page.getByTestId('login-email-input')).toBeVisible({ timeout: 15000 });
    await page.getByTestId('login-email-input').fill(email!);
    await page.getByTestId('login-password-input').fill(password!);
    await page.getByTestId('login-submit-button').click();

    // Successful auth: no visible login error, and the login form is no longer the active state.
    await page.waitForLoadState('networkidle');
    await expect(page.getByTestId('login-error')).toHaveCount(0);
    expect(problems.serverErrors, describeProblems(problems)).toHaveLength(0);
  });

  test('login form shows error on invalid credentials', async ({ page }) => {
    await page.goto('/cuenta/');
    await expect(page.getByTestId('login-email-input')).toBeVisible({ timeout: 15000 });
    await page.getByTestId('login-email-input').fill('no-such-user@armachecafe.com');
    await page.getByTestId('login-password-input').fill('WrongPassword123!');
    await page.getByTestId('login-submit-button').click();
    await expect(page.getByTestId('login-error')).toBeVisible({ timeout: 15000 });
  });
});
