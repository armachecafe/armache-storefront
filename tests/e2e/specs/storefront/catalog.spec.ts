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

  test('renders CDN image for raw backend items with primaryImageId', async ({ rawCatalogPage, page }) => {
    // Regresión 2026-09-24: /storefront/products devuelve ítems crudos sin
    // thumbnailUrl; el storefront debe construir la URL desde primaryImageId.
    await rawCatalogPage.goto();
    const img = page.getByTestId('product-card-image-drip-bag-caja-10');
    await expect(img).toBeVisible({ timeout: 10000 });
    await expect(img).toHaveAttribute(
      'src',
      /\/catalog\/products\/prod-006\/15cd090c-ddad-4af5-b132-8a8bd789c231/,
    );
  });

  test('shows placeholder when raw item has no image data', async ({ rawCatalogPage, page }) => {
    await rawCatalogPage.goto();
    await expect(
      page.getByTestId('product-card-image-fallback-miel-de-cafe-250ml'),
    ).toBeVisible({ timeout: 10000 });
  });
});
