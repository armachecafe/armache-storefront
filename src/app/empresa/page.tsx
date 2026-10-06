import type { Metadata } from 'next';
import { Building2, History, UserCheck, Phone } from 'lucide-react';
import { COMPANY, companyAddressLine } from '@/lib/company';

export const metadata: Metadata = {
  title: 'Nuestra Empresa — Armache Café',
  description:
    'GPAL EQUIPAMIENTOS S.A.C. (RUC 20607092631): razón social, historia de Armache Café y representante legal.',
};

const ORG_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: COMPANY.brandName,
  legalName: COMPANY.legalName,
  taxID: COMPANY.taxId,
  url: COMPANY.website,
  email: COMPANY.email,
  telephone: `+51 ${COMPANY.phones.sales[0]}`,
  address: {
    '@type': 'PostalAddress',
    streetAddress: COMPANY.address.street,
    addressLocality: COMPANY.address.district,
    postalCode: COMPANY.address.postalCode,
    addressRegion: COMPANY.address.city,
    addressCountry: COMPANY.address.countryCode,
  },
  sameAs: [...COMPANY.sameAs],
};

export default function EmpresaPage() {
  return (
    <div data-testid="empresa-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_JSON_LD) }}
      />

      {/* Hero */}
      <section className="bg-gradient-to-b from-brand-primary/5 to-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-brand-primary/10 flex items-center justify-center">
            <Building2 className="w-8 h-8 text-brand-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
            Nuestra Empresa
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {COMPANY.brandName} es la marca comercial de {COMPANY.legalName},
            empresa peruana registrada ante la SUNAT.
          </p>
        </div>
      </section>

      {/* Datos fiscales */}
      <section className="max-w-4xl mx-auto px-4 py-12" data-testid="empresa-fiscal">
        <h2 className="text-2xl font-display font-bold text-gray-900 mb-6">
          Información fiscal
        </h2>
        <dl className="bg-white border border-gray-200 rounded-xl p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-gray-500">Razón social</dt>
            <dd className="font-semibold text-gray-900">{COMPANY.legalName}</dd>
          </div>
          <div>
            <dt className="text-gray-500">RUC</dt>
            <dd className="font-semibold text-gray-900">{COMPANY.taxId}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Estado del contribuyente</dt>
            <dd className="font-semibold text-gray-900">{COMPANY.taxStatus}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Domicilio</dt>
            <dd className="font-semibold text-gray-900">{companyAddressLine()}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Marca comercial</dt>
            <dd className="font-semibold text-gray-900">{COMPANY.brandName}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Correo</dt>
            <dd className="font-semibold text-gray-900">{COMPANY.email}</dd>
          </div>
        </dl>
        <p className="text-sm text-gray-500 mt-4">
          Podés verificar estos datos en la{' '}
          <a
            href="https://e-consultaruc.sunat.gob.pe/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-primary underline"
          >
            Consulta RUC de la SUNAT
          </a>
          .
        </p>
      </section>

      {/* Historia */}
      <section className="bg-gray-50 py-12 px-4" data-testid="empresa-historia">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <History className="w-6 h-6 text-brand-primary" />
            <h2 className="text-2xl font-display font-bold text-gray-900">
              Historia de Armache
            </h2>
          </div>
          <div className="space-y-4 text-gray-600">
            <p>
              Armache Cafetería Artesanal es una cafetería de especialidad de Los Olivos, Lima:
              una <strong className="text-gray-900">cafetería de productores</strong>, nacida en el
              campo y sostenida con trabajo familiar, que decidió crecer en un distrito donde
              hacer cultura cafetera sigue siendo un desafío.
            </p>
            <p>
              Nuestro café es de origen único: San Ignacio, Cajamarca. 100% arábico,
              de cosecha y proceso artesanal, del campo a la taza sin intermediarios.
            </p>
            <p>
              El diario Perú21 contó nuestra historia al cumplir 6 años:{' '}
              <a
                href="https://peru21.pe/gastronomia/cafeteria-de-productores-armache-cafe-de-los-olivos-cumple-6-anos-y-esta-es-su-historia/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-primary underline"
              >
                «Cafetería de productores: Armache Café de Los Olivos cumple 6 años y esta es su
                historia»
              </a>
              .
            </p>
          </div>
        </div>
      </section>

      {/* Videos */}
      <section className="max-w-4xl mx-auto px-4 py-12" data-testid="empresa-videos">
        <h2 className="text-2xl font-display font-bold text-gray-900 mb-2">
          Conocé más a Armache en video
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Visitas de creadores independientes a nuestra cafetería en Pro, Los Olivos.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <figure>
            <div className="relative aspect-video overflow-hidden rounded-xl border border-gray-200 bg-gray-100">
              <iframe
                src="https://www.youtube-nocookie.com/embed/kkP1M-KDxJc"
                title="Así es la mejor cafetería de especialidad en Pro #14 — uncafeconelflaco"
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 h-full w-full"
              />
            </div>
            <figcaption className="text-sm text-gray-500 mt-2">
              «Así es la mejor cafetería de especialidad en Pro» — uncafeconelflaco
            </figcaption>
          </figure>
          <figure>
            <div className="relative aspect-video overflow-hidden rounded-xl border border-gray-200 bg-gray-100">
              <iframe
                src="https://www.youtube-nocookie.com/embed/402R05NiQ-k"
                title="El mejor café de Los Olivos: visitamos Armache en el corazón de Pro — ActualidadCS"
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 h-full w-full"
              />
            </div>
            <figcaption className="text-sm text-gray-500 mt-2">
              «El mejor café de Los Olivos» — ActualidadCS
            </figcaption>
          </figure>
        </div>
      </section>

      {/* Representante */}
      <section className="max-w-4xl mx-auto px-4 py-12" data-testid="empresa-representante">
        <div className="flex items-center gap-3 mb-4">
          <UserCheck className="w-6 h-6 text-brand-primary" />
          <h2 className="text-2xl font-display font-bold text-gray-900">
            Representante legal
          </h2>
        </div>
        <p className="text-gray-600">
          <strong className="text-gray-900">{COMPANY.representative.name}</strong>,{' '}
          {COMPANY.representative.role.toLowerCase()} de {COMPANY.legalName}.{' '}
          <span className="text-sm text-gray-500">(información proporcionada por la empresa).</span>
        </p>
      </section>

      {/* Contacto */}
      <section className="bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Phone className="w-6 h-6 text-brand-primary" />
            <h2 className="text-2xl font-display font-bold text-gray-900">Contacto</h2>
          </div>
          <ul className="text-gray-600 space-y-2">
            <li>📍 {companyAddressLine()}</li>
            <li>📞 {COMPANY.phones.sales.join(' / ')}</li>
            <li>📞 {COMPANY.phones.store} (cafetería)</li>
            <li>✉️ {COMPANY.email}</li>
            <li>
              📘{' '}
              <a
                href="https://www.facebook.com/ArmacheCafeteriaArtesanal"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-primary underline"
              >
                Armache Cafetería Artesanal en Facebook
              </a>
            </li>
            <li>🌐 armachecafe.com</li>
          </ul>
          <p className="text-sm text-gray-500 mt-4">
            Dirección y teléfono de la cafetería según su página pública de Facebook
            (cafetería de productores, café orgánico de San Ignacio, Cajamarca).
          </p>
        </div>
      </section>
    </div>
  );
}
