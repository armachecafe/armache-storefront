import { test, expect } from '../../fixtures';
import { mockPublicApis, mockEmptyCart, mockCartWithItems } from '../../helpers/api-mocks';

test.describe('Cart', () => {
  test('shows empty cart message', async ({ page, cartPage }) => {
    await mockPublicApis(page);
    await mockEmptyCart(page);
    await cartPage.goto();
    await expect(cartPage.emptyExploreButton).toBeVisible();
  });

  test('displays cart items', async ({ page, cartPage }) => {
    await mockPublicApis(page);
    await mockCartWithItems(page);
    await cartPage.goto();
    await expect(cartPage.pageContainer).toBeVisible();
    await expect(cartPage.summarySubtotal).toBeVisible();
  });

  test('shows checkout button when cart has items', async ({ page, cartPage }) => {
    await mockPublicApis(page);
    await mockCartWithItems(page);
    await cartPage.goto();
    await expect(cartPage.checkoutButton).toBeVisible();
  });

  test('shows quantity controls for items', async ({ page, cartPage }) => {
    await mockPublicApis(page);
    await mockCartWithItems(page);
    await cartPage.goto();
    await expect(cartPage.getItemQuantity('item-001')).toContainText('2');
  });

  test('shows login link for guest users', async ({ page, cartPage }) => {
    await mockPublicApis(page);
    await mockCartWithItems(page);
    await cartPage.goto();
    await expect(cartPage.loginLink).toBeVisible();
  });
});
