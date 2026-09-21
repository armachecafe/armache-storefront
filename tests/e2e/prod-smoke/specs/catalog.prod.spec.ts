import { test, expect } from '@playwright/test';
import { attachConsoleGuard, describeProblems } from '../helpers/console-guard';

/**
 * PROD-SMOKE: catalog loads from the REAL production site with no mocks.
 * Detects real frontend execution problems (JS errors, 5xx, broken resources).
 */
test.describe('prod-smoke: catalog', () => {
  test('home loads without JS errors or 5xx', async ({ page }) => {
    const problems = attachConsoleGuard(page, test.info());
    const resp = await page.goto('/');
    expect(resp?.status(), 'home HTTP status').toBeLessThan(400);
    await page.waitForLoadState('networkidle');
    expect(problems.pageErrors, describeProblems(problems)).toHaveLength(0);
    expect(problems.serverErrors, describeProblems(problems)).toHaveLength(0);
  });

  test('catalog page renders product listing', async ({ page }) => {
    const problems = attachConsoleGuard(page, test.info());
    await page.goto('/catalogo/');
    await expect(page.getByTestId('category-filters')).toBeVisible({ timeout: 15000 });
    await page.waitForLoadState('networkidle');
    expect(problems.serverErrors, describeProblems(problems)).toHaveLength(0);
  });

  test('product detail page loads without errors', async ({ page }) => {
    const problems = attachConsoleGuard(page, test.info());

    // Navigate to catalog and wait for products to render
    await page.goto('/catalogo/');
    await expect(page.getByTestId('category-filters')).toBeVisible({ timeout: 15000 });
    await page.waitForLoadState('networkidle');

    // ProductCard uses data-testid="product-card-<slug>" and IS the <a> (Next Link)
    const productCard = page.locator('[data-testid^="product-card-"]').first();
    const hasProduct = await productCard.count() > 0;
    if (!hasProduct) {
      console.warn('No product cards found on /catalogo/ — skipping detail page test');
      return;
    }

    await productCard.click();
    await page.waitForLoadState('networkidle');

    // Should land on the product detail page (static route + ?slug= query param)
    await expect(page).toHaveURL(/\/catalogo\/producto\/\?slug=.+/, { timeout: 10000 });

    // --- Core elements ---
    // Title (product name)
    const title = page.getByTestId('product-title');
    await expect(title).toBeVisible({ timeout: 10000 });
    const titleText = await title.textContent();
    expect(titleText?.trim().length).toBeGreaterThan(0);

    // Price
    const price = page.getByTestId('product-price');
    await expect(price).toBeVisible();
    const priceText = await price.textContent();
    expect(priceText).toMatch(/S\/\s*\d+/);

    // Add to cart button
    await expect(page.getByTestId('add-to-cart-button')).toBeVisible();

    // Description section
    const description = page.getByTestId('product-description');
    await expect(description).toBeVisible();

    // --- Breadcrumb navigation ---
    // Scope to the breadcrumb nav (the one that contains "Inicio") to avoid matching the
    // header nav, which also links to /catalogo/ (strict-mode violation otherwise).
    const breadcrumbNav = page.locator('nav', { hasText: 'Inicio' }).filter({ has: page.locator('a[href="/catalogo/"]') });
    const breadcrumbCatalogo = breadcrumbNav.locator('a[href="/catalogo/"]').first();
    await expect(breadcrumbCatalogo).toBeVisible();

    // --- Image: either the primary image loads, OR the storefront falls back to the
    // placeholder (☕). A broken <img> (present but naturalWidth=0) is NOT acceptable —
    // the onError handler must swap it for the fallback (CIMG-03). ---
    const mainImage = page.getByTestId('product-main-image');
    const hasImage = await mainImage.count() > 0;
    if (hasImage) {
      // Give the onError fallback a moment to swap if the CDN object is missing.
      const loaded = await mainImage.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0);
      if (!loaded) {
        // The image failed to load — the fallback placeholder MUST be shown instead.
        await expect(page.getByTestId('product-image-fallback')).toBeVisible({ timeout: 5000 });
      } else {
        await expect(mainImage).toBeVisible();
      }
    }
    // else: placeholder emoji shown from the start — acceptable, not an error

    // --- Coffee attributes (optional, depends on product type) ---
    const coffeeAttrs = page.getByTestId('coffee-attributes');
    const hasCoffeeAttrs = await coffeeAttrs.count() > 0;
    if (hasCoffeeAttrs) {
      await expect(coffeeAttrs).toBeVisible();
      // Should have at least origin and process
      await expect(coffeeAttrs.locator(':text("Origen:")')).toBeVisible();
      await expect(coffeeAttrs.locator(':text("Proceso:")')).toBeVisible();
    }

    // --- Variants (optional) ---
    const variantsSection = page.getByTestId('product-variants');
    const hasVariants = await variantsSection.count() > 0;
    if (hasVariants) {
      // If variants exist, there should be at least 2 buttons (otherwise section not rendered)
      const variantButtons = variantsSection.locator('button');
      const count = await variantButtons.count();
      expect(count).toBeGreaterThanOrEqual(2);
    }

    // No JS errors or 5xx
    expect(problems.pageErrors, describeProblems(problems)).toHaveLength(0);
    expect(problems.serverErrors, describeProblems(problems)).toHaveLength(0);
  });
});
