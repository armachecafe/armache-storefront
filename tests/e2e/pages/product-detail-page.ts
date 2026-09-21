import type { Locator, Page } from '@playwright/test';

export class ProductDetailPage {
  readonly title: Locator;
  readonly price: Locator;
  readonly mainImage: Locator;
  readonly coffeeAttributes: Locator;
  readonly variants: Locator;
  readonly addToCartButton: Locator;
  readonly description: Locator;

  constructor(private page: Page) {
    this.title = page.getByTestId('product-title');
    this.price = page.getByTestId('product-price');
    this.mainImage = page.getByTestId('product-main-image');
    this.coffeeAttributes = page.getByTestId('coffee-attributes');
    this.variants = page.getByTestId('product-variants');
    this.addToCartButton = page.getByTestId('add-to-cart-button');
    this.description = page.getByTestId('product-description');
  }

  async goto(slug: string) {
    await this.page.goto(`/catalogo/${slug}/`);
  }

  async addToCart() {
    await this.addToCartButton.click();
  }
}
