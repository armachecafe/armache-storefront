import { test, expect } from '../../fixtures';

test.describe('Catalog', () => {
  test('displays product listing', async ({ catalogPage }) => {
    await catalogPage.goto();
    await expect(catalogPage.categoryFilters).toBeVisible();
  });

  test('shows category filter buttons', async ({ catalogPage }) => {
    await catalogPage.goto();
    await expect(catalogPage.categoryFilters.getByText('Todos')).toBeVisible();
    await expect(catalogPage.categoryFilters.getByText('Nuestro Café')).toBeVisible();
  });

  test('shows product detail page', async ({ productDetailPage }) => {
    await productDetailPage.goto('cafe-san-ignacio-250g');
    await expect(productDetailPage.title).toContainText('Café San Ignacio', { timeout: 10000 });
    await expect(productDetailPage.price).toBeVisible();
  });

  test('displays coffee attributes on product detail', async ({ productDetailPage }) => {
    await productDetailPage.goto('cafe-san-ignacio-250g');
    await expect(productDetailPage.coffeeAttributes).toBeVisible({ timeout: 10000 });
  });

  test('shows add to cart button', async ({ productDetailPage }) => {
    await productDetailPage.goto('cafe-san-ignacio-250g');
    await expect(productDetailPage.addToCartButton).toBeVisible({ timeout: 10000 });
    await expect(productDetailPage.addToCartButton).toBeEnabled();
  });
});
