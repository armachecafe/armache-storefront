import type { Metadata } from 'next';
import { FileText } from 'lucide-react';
import { COMPANY } from '@/lib/company';

export const metadata: Metadata = {
  title: 'Términos y Condiciones — Armache Café',
  description: 'Condiciones de compra, pagos, envíos y devoluciones de Armache Café.',
};

/**
 * Plantilla razonable de condiciones comerciales.
 * La empresa debería validarla con asesoría legal antes de considerarla definitiva.
 */
export default function TerminosPage() {
  return (
    <div data-testid="terms-page">
      {/* Hero */}
      <section className="bg-gradient-to-b from-brand-primary/5 to-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-brand-primary/10 flex items-center justify-center">
            <FileText className="w-8 h-8 text-brand-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
            Términos y Condiciones
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Condiciones de compra en {COMPANY.website}, operado por {COMPANY.legalName}{' '}
            (RUC N.º {COMPANY.taxId}). Última actualización: octubre de 2026.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-12 space-y-10 text-gray-600">
        <section data-testid="terms-products">
          <h2 className="text-xl font-display font-bold text-gray-900 mb-3">
            1. Productos y precios
          </h2>
          <p>
            Vendemos café de especialidad y derivados. Los precios se muestran en soles (PEN)
            e incluyen impuestos. Las imágenes son referenciales. Nos reservamos el derecho de
            corregir errores evidentes de precio o disponibilidad antes del envío,
            devolviéndote el importe si ya pagaste.
          </p>
        </section>

        <section data-testid="terms-payment">
          <h2 className="text-xl font-display font-bold text-gray-900 mb-3">
            2. Pagos
          </h2>
          <p>
            Aceptamos tarjetas y billeteras digitales a través de nuestra pasarela de pagos.
            El pedido se confirma cuando el pago es aprobado. Nunca vemos ni almacenamos los
            datos de tu tarjeta: el cobro lo procesa la pasarela.
          </p>
        </section>

        <section data-testid="terms-shipping">
          <h2 className="text-xl font-display font-bold text-gray-900 mb-3">
            3. Envíos
          </h2>
          <p>
            Despachamos a Lima metropolitana y a provincias de todo el Perú. El costo y el
            plazo de entrega se informan antes de confirmar tu compra según tu dirección.
            Una vez despachado, te avisamos para que puedas hacerle seguimiento.
          </p>
        </section>

        <section data-testid="terms-returns">
          <h2 className="text-xl font-display font-bold text-gray-900 mb-3">
            4. Cambios y devoluciones
          </h2>
          <p>
            Si tu pedido llega con un error nuestro o en mal estado, escribinos a{' '}
            {COMPANY.email} dentro de los 7 días de recibido con fotos del producto y tu
            número de pedido: lo cambiamos o te devolvemos el importe por el mismo medio de
            pago. Por tratarse de alimentos, no aceptamos devoluciones por simple
            desistimiento una vez abierto el empaque.
          </p>
        </section>

        <section data-testid="terms-accounts">
          <h2 className="text-xl font-display font-bold text-gray-900 mb-3">
            5. Cuentas y uso del sitio
          </h2>
          <p>
            Sos responsable de la confidencialidad de tu cuenta. No podés usar el sitio para
            fines ilícitos ni intentar vulnerar su seguridad. El tratamiento de tus datos
            personales se rige por nuestra{' '}
            <a href="/politica-privacidad" className="text-brand-primary underline">
              Política de Privacidad
            </a>
            .
          </p>
        </section>

        <section data-testid="terms-contact">
          <h2 className="text-xl font-display font-bold text-gray-900 mb-3">6. Contacto</h2>
          <p>
            {COMPANY.legalName} — {COMPANY.email} — {COMPANY.phones.sales.join(' / ')}.
          </p>
        </section>
      </div>
    </div>
  );
}
