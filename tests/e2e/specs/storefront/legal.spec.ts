import { test, expect } from '../../fixtures';
import { mockPublicApis, mockEmptyCart } from '../../helpers/api-mocks';

test.describe('Legal pages (Meta verification readiness)', () => {
  test.beforeEach(async ({ page }) => {
    await mockPublicApis(page);
    await mockEmptyCart(page);
  });

  test('/politica-privacidad renders controller, purposes and rights', async ({ page }) => {
    await page.goto('/politica-privacidad/');
    await expect(page.getByTestId('privacy-page')).toBeVisible();
    await expect(page.getByTestId('privacy-controller')).toContainText('GPAL EQUIPAMIENTOS S.A.C.');
    await expect(page.getByTestId('privacy-controller')).toContainText('20607092631');
    await expect(page.getByTestId('privacy-purposes')).toContainText('Ley N.º 29733');
    await expect(page.getByTestId('privacy-rights')).toContainText('ARCO');
    await expect(page.getByTestId('privacy-cookies')).toBeVisible();
  });

  test('/terminos renders payment, shipping and returns', async ({ page }) => {
    await page.goto('/terminos/');
    await expect(page.getByTestId('terms-page')).toBeVisible();
    await expect(page.getByTestId('terms-payment')).toBeVisible();
    await expect(page.getByTestId('terms-shipping')).toBeVisible();
    await expect(page.getByTestId('terms-returns')).toBeVisible();
    await expect(page.getByTestId('terms-contact')).toContainText('ventas@armachecafe.com');
  });

  test('NAP is consistent between footer and /empresa', async ({ page }) => {
    await page.goto('/');
    const footer = page.locator('footer');
    await expect(page.getByTestId('footer-company')).toContainText('Calle 7 418');
    await expect(footer).toContainText('ventas@armachecafe.com');
    await page.goto('/empresa/');
    const fiscal = page.getByTestId('empresa-fiscal');
    await expect(fiscal).toContainText('Tienda');
    await expect(fiscal).toContainText('Domicilio fiscal');
  });

  test('footer links to privacy and terms pages', async ({ page }) => {
    await page.goto('/');
    const company = page.getByTestId('footer-company');
    await expect(company.getByRole('link', { name: /política de privacidad/i })).toHaveAttribute(
      'href',
      '/politica-privacidad/',
    );
    await expect(company.getByRole('link', { name: /términos/i })).toHaveAttribute('href', '/terminos/');
  });
});
