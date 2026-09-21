import { test, expect } from '../../fixtures';
import { mockPublicApis, mockEmptyCart } from '../../helpers/api-mocks';

test.describe('Empresas (B2B)', () => {
  test.beforeEach(async ({ page }) => {
    await mockPublicApis(page);
    await mockEmptyCart(page);
  });

  test('renders page with WhatsApp CTA', async ({ empresasPage }) => {
    await empresasPage.goto();
    await expect(empresasPage.pageContainer).toBeVisible();
    await expect(empresasPage.whatsappButton).toBeVisible();
    await expect(empresasPage.whatsappButton).toHaveAttribute('href', /wa\.me/);
  });

  test('shows contact form', async ({ empresasPage }) => {
    await empresasPage.goto();
    await expect(empresasPage.contactForm).toBeVisible();
    await expect(empresasPage.contactName).toBeVisible();
    await expect(empresasPage.contactSubmit).toBeVisible();
  });

  test('contact form has required company type options', async ({ empresasPage }) => {
    await empresasPage.goto();
    await expect(empresasPage.contactTipo).toBeVisible();
    await expect(empresasPage.contactTipo.locator('option')).toHaveCount(6); // empty + 5 types
  });
});
