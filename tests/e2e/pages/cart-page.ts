import type { Locator, Page } from '@playwright/test';

export class CartPage {
  readonly pageContainer: Locator;
  readonly emptyExploreButton: Locator;
  readonly summarySubtotal: Locator;
  readonly summaryTotal: Locator;
  readonly checkoutButton: Locator;
  readonly loginLink: Locator;

  constructor(private page: Page) {
    this.pageContainer = page.getByTestId('cart-page');
    this.emptyExploreButton = page.getByTestId('cart-empty-explore-button');
    this.summarySubtotal = page.getByTestId('cart-summary-subtotal');
    this.summaryTotal = page.getByTestId('cart-summary-total');
    this.checkoutButton = page.getByTestId('cart-summary-checkout-button');
    this.loginLink = page.getByTestId('cart-summary-login-link');
  }

  async goto() {
    await this.page.goto('/carrito/');
  }

  getItemQuantity(itemId: string): Locator {
    return this.page.getByTestId(`cart-item-quantity-${itemId}`);
  }

  getItemIncreaseButton(itemId: string): Locator {
    return this.page.getByTestId(`cart-item-increase-${itemId}`);
  }

  getItemDecreaseButton(itemId: string): Locator {
    return this.page.getByTestId(`cart-item-decrease-${itemId}`);
  }

  getItemRemoveButton(itemId: string): Locator {
    return this.page.getByTestId(`cart-item-remove-${itemId}`);
  }
}
