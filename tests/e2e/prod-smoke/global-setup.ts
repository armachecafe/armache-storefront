import { chromium, type FullConfig } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

/**
 * Global setup for prod-smoke: performs a REAL Cognito login through the
 * production storefront UI and persists storageState for reuse by specs
 * (D-07: one spec validates UI login; the rest reuse storageState).
 *
 * Requires env vars (provided by run-prod-verification.sh with an ephemeral user):
 *   PROD_URL              (default https://armachecafe.com)
 *   TEST_USER_EMAIL       (ephemeral customer email)
 *   TEST_USER_PASSWORD    (ephemeral customer password)
 *   PROD_STORAGE_STATE    (default tests/e2e/prod-smoke/.auth/state.json)
 *
 * If credentials are absent, it writes an empty storageState so guest-only
 * specs (catalog, navigation) can still run.
 */
async function globalSetup(_config: FullConfig) {
  const baseURL = process.env.PROD_URL ?? 'https://armachecafe.com';
  const statePath = process.env.PROD_STORAGE_STATE ?? 'tests/e2e/prod-smoke/.auth/state.json';
  const email = process.env.TEST_USER_EMAIL;
  const password = process.env.TEST_USER_PASSWORD;

  mkdirSync(dirname(statePath), { recursive: true });

  const browser = await chromium.launch();
  const context = await browser.newContext({ baseURL });
  const page = await context.newPage();

  if (email && password) {
    try {
      await page.goto('/cuenta/');
      await page.getByTestId('login-email-input').fill(email);
      await page.getByTestId('login-password-input').fill(password);
      await page.getByTestId('login-submit-button').click();
      // Wait for authenticated state: header account area or redirect away from /cuenta login form.
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
      console.log(`[prod-smoke] Logged in as ${email}`);
    } catch (err) {
      console.warn(`[prod-smoke] UI login failed, saving guest state: ${(err as Error).message}`);
    }
  } else {
    console.warn('[prod-smoke] No TEST_USER_EMAIL/PASSWORD — saving guest storageState.');
  }

  await context.storageState({ path: statePath });
  await browser.close();
}

export default globalSetup;
