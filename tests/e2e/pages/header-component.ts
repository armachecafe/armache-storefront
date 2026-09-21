import type { Locator, Page } from '@playwright/test';

export class HeaderComponent {
  readonly logo: Locator;
  readonly nav: Locator;
  readonly accountLink: Locator;
  readonly accountMenuTrigger: Locator;
  readonly accountDropdown: Locator;
  readonly dropdownProfile: Locator;
  readonly dropdownAddresses: Locator;
  readonly dropdownOrders: Locator;
  readonly dropdownLogout: Locator;
  readonly cartButton: Locator;
  readonly cartBadge: Locator;
  readonly mobileMenuButton: Locator;

  constructor(private page: Page) {
    this.logo = page.getByTestId('header-logo');
    this.nav = page.getByTestId('header-nav');
    this.accountLink = page.getByTestId('header-account-link');
    this.accountMenuTrigger = page.getByTestId('header-account-menu-trigger');
    this.accountDropdown = page.getByTestId('header-account-dropdown');
    this.dropdownProfile = page.getByTestId('header-dropdown-profile');
    this.dropdownAddresses = page.getByTestId('header-dropdown-addresses');
    this.dropdownOrders = page.getByTestId('header-dropdown-orders');
    this.dropdownLogout = page.getByTestId('header-dropdown-logout');
    this.cartButton = page.getByTestId('header-cart-button');
    this.cartBadge = page.getByTestId('header-cart-badge');
    this.mobileMenuButton = page.getByTestId('header-mobile-menu');
  }

  async openAccountDropdown() {
    await this.accountMenuTrigger.click();
  }

  async logout() {
    await this.openAccountDropdown();
    await this.dropdownLogout.click();
  }

  async navigateToProfile() {
    await this.openAccountDropdown();
    await this.dropdownProfile.click();
  }
}
