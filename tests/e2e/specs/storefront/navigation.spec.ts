import { test, expect } from '../../fixtures';
import { mockPublicApis, mockEmptyCart } from '../../helpers/api-mocks';

test.describe('Navigation & Header', () => {
  test.beforeEach(async ({ page }) => {
    await mockPublicApis(page);
    await mockEmptyCart(page);
  });

  test('renders logo and navigation links', async ({ page, header }) => {
    await page.goto('/');
    await expect(header.logo).toBeVisible();
    await expect(header.nav).toBeVisible();
    await expect(header.nav.getByText('Catálogo')).toBeVisible();
    await expect(header.nav.getByText('Empresas')).toBeVisible();
    await expect(header.nav.getByText(/Nuestro Caf/)).toBeVisible();
  });

  test('logo navigates to homepage', async ({ page, header }) => {
    await page.goto('/catalogo/');
    await header.logo.click();
    await expect(page).toHaveURL('/');
  });

  test('shows account icon for guest users', async ({ page, header }) => {
    await page.goto('/');
    await expect(header.accountLink).toBeVisible();
  });

  test('shows cart button', async ({ page, header }) => {
    await page.goto('/');
    await expect(header.cartButton).toBeVisible();
  });
});
