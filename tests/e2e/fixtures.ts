import { test as base } from '@playwright/test';
import { HeaderComponent } from './pages/header-component';
import { LoginPage } from './pages/login-page';
import { RegisterPage } from './pages/register-page';
import { ForgotPasswordPage } from './pages/forgot-password-page';
import { CatalogPage } from './pages/catalog-page';
import { ProductDetailPage } from './pages/product-detail-page';
import { CartPage } from './pages/cart-page';
import { CheckoutPage } from './pages/checkout-page';
import { ProfilePage } from './pages/profile-page';
import { EmpresasPage } from './pages/empresas-page';
import { mockPublicApis, mockEmptyCart } from './helpers/api-mocks';
import { MOCK_PRODUCTS_RAW } from './helpers/test-data';
import { injectAuthSession } from './helpers/amplify-auth-mock';

type Fixtures = {
  header: HeaderComponent;
  loginPage: LoginPage;
  registerPage: RegisterPage;
  forgotPasswordPage: ForgotPasswordPage;
  catalogPage: CatalogPage;
  /** Catálogo con el listado crudo real del backend (sin thumbnailUrl) */
  rawCatalogPage: CatalogPage;
  productDetailPage: ProductDetailPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  profilePage: ProfilePage;
  empresasPage: EmpresasPage;
  /** Pre-injects Amplify auth tokens so the page loads as authenticated */
  authenticatedPage: void;
};

export const test = base.extend<Fixtures>({
  header: async ({ page }, use) => {
    await use(new HeaderComponent(page));
  },
  loginPage: async ({ page }, use) => {
    await mockPublicApis(page);
    await mockEmptyCart(page);
    await use(new LoginPage(page));
  },
  registerPage: async ({ page }, use) => {
    await mockPublicApis(page);
    await mockEmptyCart(page);
    await use(new RegisterPage(page));
  },
  forgotPasswordPage: async ({ page }, use) => {
    await mockPublicApis(page);
    await mockEmptyCart(page);
    await use(new ForgotPasswordPage(page));
  },
  catalogPage: async ({ page }, use) => {
    await mockPublicApis(page);
    await mockEmptyCart(page);
    await use(new CatalogPage(page));
  },
  rawCatalogPage: async ({ page }, use) => {
    await mockPublicApis(page, { listingOverride: MOCK_PRODUCTS_RAW });
    await mockEmptyCart(page);
    await use(new CatalogPage(page));
  },
  productDetailPage: async ({ page }, use) => {
    await mockPublicApis(page);
    await mockEmptyCart(page);
    await use(new ProductDetailPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },
  profilePage: async ({ page }, use) => {
    await use(new ProfilePage(page));
  },
  empresasPage: async ({ page }, use) => {
    await use(new EmpresasPage(page));
  },
  authenticatedPage: async ({ page }, use) => {
    await injectAuthSession(page);
    await use();
  },
});

export { expect } from '@playwright/test';
