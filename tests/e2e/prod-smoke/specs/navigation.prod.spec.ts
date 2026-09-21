import { test, expect } from '@playwright/test';
import { attachConsoleGuard, describeProblems } from '../helpers/console-guard';

/**
 * PROD-SMOKE: main routes load on the real production site without 5xx / JS errors.
 */
const ROUTES = ['/', '/catalogo/', '/empresas/', '/cuenta/'];

test.describe('prod-smoke: navigation', () => {
  for (const route of ROUTES) {
    test(`route ${route} loads cleanly`, async ({ page }) => {
      const problems = attachConsoleGuard(page, test.info());
      const resp = await page.goto(route);
      expect(resp?.status(), `${route} HTTP status`).toBeLessThan(400);
      await page.waitForLoadState('networkidle');
      expect(problems.pageErrors, describeProblems(problems)).toHaveLength(0);
      expect(problems.serverErrors, describeProblems(problems)).toHaveLength(0);
    });
  }
});
