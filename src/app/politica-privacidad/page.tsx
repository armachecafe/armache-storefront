import type { Metadata } from 'next';
import { ShieldCheck } from 'lucide-react';
import { COMPANY, companyAddressLine } from '@/lib/company';

export const metadata: Metadata = {
  title: 'Política de Privacidad — Armache Café',
  description:
    'Cómo GPAL EQUIPAMIENTOS S.A.C. trata tus datos personales conforme a la Ley N.º 29733.',
};

/**
 * Plantilla razonable conforme a la Ley N.º 29733 y su reglamento.
 * La empresa debería validarla con asesoría legal antes de considerarla definitiva.
 */
export default function PoliticaPrivacidadPage() {
  return (
    <div data-testid="privacy-page">
      {/* Hero */}
      <section className="bg-gradient-to-b from-brand-primary/5 to-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-brand-primary/10 flex items-center justify-center">
            <ShieldCheck className="w-8 h-8 text-brand-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
            Política de Privacidad
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Última actualización: octubre de 2026. Tratamos tus datos personales conforme a la
            Ley N.º 29733, Ley de Protección de Datos Personales del Perú, y su reglamento.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-12 space-y-10 text-gray-600">
        <section data-testid="privacy-controller">
          <h2 className="text-xl font-display font-bold text-gray-900 mb-3">
            1. Responsable del tratamiento
          </h2>
          <p>
            {COMPANY.legalName}, con RUC N.º {COMPANY.taxId}, domiciliada en{' '}
            {companyAddressLine()}, es responsable de los datos personales que nos
            proporcionás a través de {COMPANY.website} (en adelante, «Armache Café»).
            Contacto para asuntos de privacidad: {COMPANY.email}.
          </p>
        </section>

        <section data-testid="privacy-purposes">
          <h2 className="text-xl font-display font-bold text-gray-900 mb-3">
            2. Datos que recolectamos y finalidades
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong className="text-gray-900">Cuenta y contacto:</strong> nombre, correo
              electrónico y teléfono, para crear y administrar tu cuenta, autenticarte y
              comunicarnos con vos sobre tus pedidos.
            </li>
            <li>
              <strong className="text-gray-900">Compras y envíos:</strong> dirección de entrega y
              datos del pedido, para procesar, cobrar, enviar y facturar tus compras.
            </li>
            <li>
              <strong className="text-gray-900">Comunicaciones comerciales:</strong> solo te
              enviamos ofertas y novedades si nos diste tu consentimiento; podés retirarlo
              cuando quieras.
            </li>
            <li>
              <strong className="text-gray-900">Seguridad y mejora:</strong> registros técnicos
              de uso para prevenir fraude y mejorar el sitio.
            </li>
          </ul>
          <p className="mt-3">
            Al marcar la casilla de aceptación en el registro o la compra, consentís este
            tratamiento conforme a la Ley N.º 29733. Sin esos datos no podemos crear tu cuenta
            ni procesar pedidos.
          </p>
        </section>

        <section data-testid="privacy-rights">
          <h2 className="text-xl font-display font-bold text-gray-900 mb-3">
            3. Tus derechos (ARCO)
          </h2>
          <p>
            Tenés derecho a acceder, rectificar, cancelar y oponerte al tratamiento de tus
            datos, así como a revocar tu consentimiento. Para ejercerlos, escribinos a{' '}
            {COMPANY.email} con el asunto «Derechos de datos personales», indicando tu nombre,
            tu documento de identidad y qué derecho querés ejercer. Respondemos dentro de los
            plazos de la ley. También podés reclamar ante la Autoridad Nacional de Protección
            de Datos Personales.
          </p>
        </section>

        <section data-testid="privacy-transfers">
          <h2 className="text-xl font-display font-bold text-gray-900 mb-3">
            4. Encargados y transferencias
          </h2>
          <p>
            Compartimos tus datos solo con los proveedores necesarios para operar el sitio:
            alojamiento en la nube (AWS), pasarela de pagos para procesar tus cobros y
            servicios de mensajería para el envío de códigos y avisos. No vendemos tus datos
            personales.
          </p>
        </section>

        <section data-testid="privacy-cookies">
          <h2 className="text-xl font-display font-bold text-gray-900 mb-3">
            5. Cookies y almacenamiento local
          </h2>
          <p>
            Usamos almacenamiento local del navegador para el carrito de invitados y la sesión
            (tokens de autenticación). No usamos cookies publicitarias de terceros. Podés
            borrar estos datos desde tu navegador, aunque el carrito y la sesión se perderán.
          </p>
        </section>

        <section data-testid="privacy-retention">
          <h2 className="text-xl font-display font-bold text-gray-900 mb-3">
            6. Conservación y seguridad
          </h2>
          <p>
            Conservamos tus datos mientras tu cuenta esté activa o mientras sean necesarios
            para las finalidades descritas y las obligaciones tributarias aplicables.
            Aplicamos medidas de seguridad razonables para protegerlos contra accesos no
            autorizados. No solicitamos datos de menores de edad.
          </p>
        </section>

        <section data-testid="privacy-changes">
          <h2 className="text-xl font-display font-bold text-gray-900 mb-3">7. Cambios</h2>
          <p>
            Publicaremos aquí cualquier cambio de esta política indicando la fecha de
            actualización. El uso continuado del sitio implica la aceptación de la versión
            vigente.
          </p>
        </section>
      </div>
    </div>
  );
}
