import type { Locator, Page } from '@playwright/test';

export class CatalogPage {
  readonly categoryFilters: Locator;
  readonly loadMoreButton: Locator;

  constructor(private page: Page) {
    this.categoryFilters = page.getByTestId('category-filters');
    this.loadMoreButton = page.getByTestId('load-more-button');
  }

  async goto() {
    await this.page.goto('/catalogo/');
  }

  getProductCard(slug: string): Locator {
    return this.page.getByTestId(`product-card-${slug}`);
  }
}
