import type { Locator, Page } from '@playwright/test';

export class EmpresasPage {
  readonly pageContainer: Locator;
  readonly whatsappButton: Locator;
  readonly emailButton: Locator;
  readonly contactForm: Locator;
  readonly contactName: Locator;
  readonly contactEmpresa: Locator;
  readonly contactRuc: Locator;
  readonly contactTipo: Locator;
  readonly contactVolumen: Locator;
  readonly contactMensaje: Locator;
  readonly contactSubmit: Locator;

  constructor(private page: Page) {
    this.pageContainer = page.getByTestId('empresas-page');
    this.whatsappButton = page.getByTestId('empresas-whatsapp-button');
    this.emailButton = page.getByTestId('empresas-email-button');
    this.contactForm = page.getByTestId('empresas-contact-form');
    this.contactName = page.getByTestId('b2b-contact-name');
    this.contactEmpresa = page.getByTestId('b2b-contact-empresa');
    this.contactRuc = page.getByTestId('b2b-contact-ruc');
    this.contactTipo = page.getByTestId('b2b-contact-tipo');
    this.contactVolumen = page.getByTestId('b2b-contact-volumen');
    this.contactMensaje = page.getByTestId('b2b-contact-mensaje');
    this.contactSubmit = page.getByTestId('b2b-contact-submit');
  }

  async goto() {
    await this.page.goto('/empresas/');
  }

  async fillContactForm(data: { name: string; empresa?: string; tipo?: string }) {
    await this.contactName.fill(data.name);
    if (data.empresa) await this.contactEmpresa.fill(data.empresa);
    if (data.tipo) await this.contactTipo.selectOption(data.tipo);
  }
}
