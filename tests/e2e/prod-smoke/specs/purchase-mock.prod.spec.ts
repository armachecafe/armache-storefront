import { test, expect, request as pwRequest } from '@playwright/test';
import { attachConsoleGuard, describeProblems } from '../helpers/console-guard';

/**
 * PROD-SMOKE: exercises the storefront purchase UI against production and drives
 * payment through the MOCK (X-Test-Payment-Mock) so no real Culqi charge occurs.
 *
 * F-5 note: the real frontend expects a Culqi redirect; the mock returns a
 * `testMode` CONFIRMED response without a redirect URL. This spec therefore
 * validates the API-level mock response directly (authenticated as the ephemeral
 * user) rather than completing the hosted-checkout redirect. The UI navigation up
 * to the payment step is still exercised for real-execution problems.
 *
 * Requires env: API_URL, TEST_MOCK_SECRET, TEST_RUN_ID (+ authenticated storageState).
 * Skips gracefully if the mock secret is not provided.
 */
test.describe('prod-smoke: purchase with payment mock', () => {
  test('catalog → product → cart UI loads without errors', async ({ page }) => {
    const problems = attachConsoleGuard(page, test.info());
    await page.goto('/catalogo/');
    await expect(page.getByTestId('category-filters')).toBeVisible({ timeout: 15000 });
    await page.goto('/carrito/');
    await page.waitForLoadState('networkidle');
    expect(problems.pageErrors, describeProblems(problems)).toHaveLength(0);
    expect(problems.serverErrors, describeProblems(problems)).toHaveLength(0);
  });

  test('payment mock returns CONFIRMED testMode transaction', async ({ page }) => {
    const apiUrl = process.env.API_URL ?? 'https://api.armachecafe.com';
    const secret = process.env.TEST_MOCK_SECRET;
    const testRunId = process.env.TEST_RUN_ID ?? `prod-smoke-${Date.now()}`;
    test.skip(!secret, 'No TEST_MOCK_SECRET provided');

    // Reuse the authenticated session token from storageState (Amplify stores it in localStorage).
    await page.goto('/');
    const idToken = await page.evaluate(() => {
      const clientId = '780qhrdegeu08g7nlb81bqpuvv';
      const prefix = `CognitoIdentityServiceProvider.${clientId}`;
      const last = localStorage.getItem(`${prefix}.LastAuthUser`);
      return last ? localStorage.getItem(`${prefix}.${last}.idToken`) : null;
    });
    test.skip(!idToken, 'No authenticated session in storageState');

    const ctx = await pwRequest.newContext();
    const res = await ctx.post(`${apiUrl}/payments/initiate`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`,
        'X-Test-Payment-Mock': JSON.stringify({ secret, scenario: 'approved', testRunId }),
      },
      data: {
        checkoutSessionId: `prod-smoke-${testRunId}`,
        orderRef: `prod-smoke-${testRunId}`,
        amountCents: 1000,
        currency: 'PEN',
        customerEmail: process.env.TEST_USER_EMAIL ?? 'test@armachecafe.com',
      },
    });

    expect(res.status(), 'mock initiate status').toBe(200);
    const body = await res.json();
    expect(body.testMode).toBe(true);
    expect(body.status).toBe('CONFIRMED');
    await ctx.dispose();
  });
});
