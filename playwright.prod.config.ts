import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright config for PROD-SMOKE: runs against the REAL production storefront
 * (https://armachecafe.com) with NO network mocks and NO local webServer.
 *
 * Purpose (FR-6): detect real frontend execution problems in production —
 * console JS errors, 5xx responses, resources that fail to load.
 *
 * The default config (playwright.config.ts) is the `mocked` profile for CI/local
 * and is left untouched. Run this one explicitly:
 *   npx playwright test --config=playwright.prod.config.ts
 */
// Unified per-run output: the orchestrator exports PW_RESULTS_DIR=tests/results/<runId>/playwright
// so k6 and Playwright artifacts for the same run live under one tree. Falls back to
// playwright-report/ for standalone runs.
const RESULTS_DIR = process.env.PW_RESULTS_DIR ?? 'playwright-report';

export default defineConfig({
  testDir: './tests/e2e/prod-smoke/specs',
  // Backoffice specs live under specs/backoffice and require the Staff-pool storageState
  // from playwright.backoffice.config.ts (backoffice-global-setup). Exclude them here so the
  // storefront prod run doesn't execute them unauthenticated.
  testIgnore: '**/backoffice/**',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 1,
  workers: 1,
  outputDir: `${RESULTS_DIR}/prod-smoke-artifacts`,
  reporter: [['list'], ['json', { outputFile: `${RESULTS_DIR}/prod-smoke-results.json` }]],

  // storageState produced by global-setup (real Cognito login).
  globalSetup: './tests/e2e/prod-smoke/global-setup.ts',

  use: {
    baseURL: process.env.PROD_URL ?? 'https://armachecafe.com',
    storageState: process.env.PROD_STORAGE_STATE ?? 'tests/e2e/prod-smoke/.auth/state.json',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    // NO webServer — we target the deployed site.
  },

  projects: [
    {
      name: 'prod-smoke',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
