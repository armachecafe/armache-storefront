import { test, expect } from '../../fixtures';
import { mockPublicApis, mockCheckout, mockCognitoSuccess } from '../../helpers/api-mocks';

test.describe('Checkout', () => {
  test.beforeEach(async ({ page }) => {
    await mockPublicApis(page);
    await mockCheckout(page);
    // Mock Cognito so that fetchAuthSession() resolves quickly (no auth = guest mode)
    await mockCognitoSuccess(page);
    // Pre-seed localStorage with a guest cart ID so CartContext doesn't start empty
    await page.addInitScript(() => {
      localStorage.setItem('armache_cart_id', 'cart-001');
    });
  });

  test('shows shipping form on step 1', async ({ checkoutPage }) => {
    await checkoutPage.goto();
    await expect(checkoutPage.shippingForm).toBeVisible({ timeout: 15000 });
    await expect(checkoutPage.steps).toBeVisible();
  });

  test('shows order summary sidebar', async ({ checkoutPage }) => {
    await checkoutPage.goto();
    await expect(checkoutPage.orderSummaryTotal).toBeVisible({ timeout: 15000 });
  });

  test('validates required shipping fields', async ({ checkoutPage }) => {
    await checkoutPage.goto();
    await expect(checkoutPage.shippingForm).toBeVisible({ timeout: 15000 });
    // The "continue" button stays disabled until all required fields are valid,
    // which is how the form prevents submission with empty fields.
    await expect(checkoutPage.continueButton).toBeDisabled();
  });

  test('shows contact fields for guest checkout', async ({ checkoutPage }) => {
    await checkoutPage.goto();
    await expect(checkoutPage.contactName).toBeVisible({ timeout: 15000 });
    await expect(checkoutPage.contactEmail).toBeVisible();
  });
});
