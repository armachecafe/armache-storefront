import type { Locator, Page } from '@playwright/test';

export class CheckoutPage {
  readonly pageContainer: Locator;
  readonly shippingForm: Locator;
  readonly contactName: Locator;
  readonly contactEmail: Locator;
  readonly recipientInput: Locator;
  readonly streetInput: Locator;
  readonly departmentSelect: Locator;
  readonly provinceInput: Locator;
  readonly cityInput: Locator;
  readonly consentCheckbox: Locator;
  readonly continueButton: Locator;
  readonly paymentCulqi: Locator;
  readonly culqiPayButton: Locator;
  readonly orderSummaryTotal: Locator;
  readonly backToShipping: Locator;
  readonly steps: Locator;

  constructor(private page: Page) {
    this.pageContainer = page.getByTestId('checkout-page');
    this.shippingForm = page.getByTestId('shipping-form');
    this.contactName = page.getByTestId('shipping-contact-name');
    this.contactEmail = page.getByTestId('shipping-contact-email');
    this.recipientInput = page.getByTestId('shipping-recipient');
    this.streetInput = page.getByTestId('shipping-street');
    this.departmentSelect = page.getByTestId('shipping-department');
    this.provinceInput = page.getByTestId('shipping-province');
    this.cityInput = page.getByTestId('shipping-city');
    this.consentCheckbox = page.getByTestId('shipping-consent-checkbox');
    this.continueButton = page.getByTestId('shipping-continue-button');
    this.paymentCulqi = page.getByTestId('payment-method-culqi');
    this.culqiPayButton = page.getByTestId('culqi-payment-button');
    this.orderSummaryTotal = page.getByTestId('order-summary-total');
    this.backToShipping = page.getByTestId('checkout-back-to-shipping');
    this.steps = page.getByTestId('checkout-steps');
  }

  async goto() {
    await this.page.goto('/checkout/');
  }

  async fillGuestShipping(data: { name: string; email: string; street: string; department: string; province: string; city: string }) {
    await this.contactName.fill(data.name);
    await this.contactEmail.fill(data.email);
    await this.recipientInput.fill(data.name);
    await this.streetInput.fill(data.street);
    await this.departmentSelect.selectOption(data.department);
    await this.provinceInput.fill(data.province);
    await this.cityInput.fill(data.city);
    await this.consentCheckbox.check();
  }
}
