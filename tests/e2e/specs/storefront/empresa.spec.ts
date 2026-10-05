import { test, expect } from '../../fixtures';
import { mockPublicApis, mockEmptyCart } from '../../helpers/api-mocks';

test.describe('Empresa (información fiscal)', () => {
  test.beforeEach(async ({ page }) => {
    await mockPublicApis(page);
    await mockEmptyCart(page);
  });

  test('footer shows company name and RUC with link to /empresa', async ({ page }) => {
    await page.goto('/');
    const company = page.getByTestId('footer-company');
    await expect(company).toBeVisible();
    await expect(company).toContainText('GPAL EQUIPAMIENTOS S.A.C.');
    await expect(company).toContainText('RUC 20607092631');
    await expect(company.getByRole('link', { name: /informaci.n de la empresa/i })).toHaveAttribute('href', '/empresa/');
  });

  test('/empresa renders fiscal, history and representative sections', async ({ page }) => {
    await page.goto('/empresa/');
    await expect(page.getByTestId('empresa-page')).toBeVisible();
    const fiscal = page.getByTestId('empresa-fiscal');
    await expect(fiscal).toContainText('GPAL EQUIPAMIENTOS S.A.C.');
    await expect(fiscal).toContainText('20607092631');
    const historia = page.getByTestId('empresa-historia');
    await expect(historia).toContainText('Los Olivos');
    await expect(historia.locator('a[href*="peru21.pe"]')).toBeVisible();
    await expect(page.getByTestId('empresa-representante')).toContainText('Carlos Raul Laura Arenas');
  });

  test('/empresa embeds third-party visit videos', async ({ page }) => {
    await page.goto('/empresa/');
    const videos = page.getByTestId('empresa-videos');
    await expect(videos).toBeVisible();
    await expect(videos.locator('iframe[src*="youtube-nocookie.com/embed/kkP1M-KDxJc"]')).toBeVisible();
    await expect(videos.locator('iframe[src*="youtube-nocookie.com/embed/402R05NiQ-k"]')).toBeVisible();
  });
});
