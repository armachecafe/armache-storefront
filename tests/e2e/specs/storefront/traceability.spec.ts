import { test, expect } from '../../fixtures';
import { mockPublicApis, mockEmptyCart, mockTraceability } from '../../helpers/api-mocks';

// /trazabilidad/<code>/ (QR path) only resolves in prod via a CloudFront rewrite;
// there is no dynamic route (static export), so `next dev` returns 404 for it.
// Locally the same client page is reached through the ?code= query param.
test.describe('Traceability', () => {
  test('displays lot profile when found', async ({ page }) => {
    await mockPublicApis(page);
    await mockEmptyCart(page);
    await mockTraceability(page);
    await page.goto('/trazabilidad/?code=LOT-2026-001');
    await expect(page.getByTestId('lot-profile')).toBeVisible({ timeout: 10000 });
    await expect(page.getByTestId('lot-code')).toContainText('LOT-2026-001');
  });

  test('shows not found for invalid lot code', async ({ page }) => {
    await mockPublicApis(page);
    await mockEmptyCart(page);
    await page.route('**/traceability/lots/*', (route) =>
      route.fulfill({ status: 404, contentType: 'application/json', body: JSON.stringify({ message: 'Not found' }) }),
    );
    await page.goto('/trazabilidad/?code=INVALID-CODE');
    await expect(page.getByText(/no encontr/i)).toBeVisible({ timeout: 10000 });
  });
});
