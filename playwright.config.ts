import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e/specs',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI
    ? 'github'
    : [['html'], ['json', { outputFile: 'playwright-report/results.json' }]],

  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: {
    command: 'pnpm --filter @armache/storefront dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    // La primera compilación de Next en WSL sobre /mnt/c puede exceder 60s.
    // Se puede bajar en CI (filesystem nativo) o pre-arrancando el dev server.
    timeout: 180_000,
  },
});
