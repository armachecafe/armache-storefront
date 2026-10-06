/**
 * company.ts — single source of truth for the business identity (NAP).
 *
 * Meta Business verification requires the legal name, street address, phone
 * and website to match the legal entity EXACTLY across the site, the Facebook
 * page, the WhatsApp profile and the uploaded documents. Every legal/contact
 * surface (footer, /empresa, JSON-LD) must consume this module — never
 * hardcode these values elsewhere.
 *
 * Sources: SUNAT ficha pública (razón social, RUC, estado) y la página
 * pública de Facebook Armache Cafetería Artesanal (dirección, teléfono de la
 * cafetería, Instagram), leída el 2026-10-05.
 */
export const COMPANY = {
  brandName: 'Armache Café',
  legalName: 'GPAL EQUIPAMIENTOS S.A.C.',
  taxId: '20607092631',
  taxStatus: 'Activo — Habido (ficha pública)',
  address: {
    street: 'Calle 7 418',
    district: 'Los Olivos',
    postalCode: '15307',
    city: 'Lima',
    country: 'Perú',
    countryCode: 'PE',
  },
  phones: {
    /** Published in the site footer. */
    sales: ['947 258 244', '947 389 156'],
    /** Cafeteria phone from the public Facebook page. */
    store: '906 381 389',
  },
  /** Only domain email already published on the site (/empresas contact form). */
  email: 'ventas@armachecafe.com',
  website: 'https://armachecafe.com',
  /** Only URLs verified by reading the public Facebook page. */
  sameAs: [
    'https://www.facebook.com/ArmacheCafeteriaArtesanal',
    'https://www.instagram.com/armache_cafeteria',
  ],
  /** Company-provided, NOT verified against a public source. */
  representative: {
    name: 'Carlos Raul Laura Arenas',
    role: 'Principal accionista y representante legal',
  },
} as const;

/** Full address line as shown on the site. */
export function companyAddressLine(): string {
  const a = COMPANY.address;
  return `${a.street}, ${a.district} ${a.postalCode}, ${a.city} — ${a.country}`;
}
