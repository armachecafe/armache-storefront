import type { Metadata } from 'next';
import Link from 'next/link';
import { Building2, Coffee, MessageCircle, Mail, ChevronRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Empresas — Armache Café',
  description: 'Café de especialidad para hoteles, oficinas y empresas. Solicita tu cotización personalizada.',
};

const B2B_PRODUCTS = [
  { name: 'Café Tostado en Grano (1kg)', description: 'Ideal para hoteles con molinos propios', image: null },
  { name: 'Café Molido Institucional (500g)', description: 'Para cafeteras de filtro y máquinas de oficina', image: null },
  { name: 'Drip Bags x100', description: 'Café individual para habitaciones de hotel', image: null },
  { name: 'Café Frío Concentrado (1L)', description: 'Listo para diluir en cold brew stations', image: null },
  { name: 'Kit de Bienvenida', description: 'Café + taza + guía de preparación', image: null },
];

const FAQ = [
  { q: '¿Cuál es el pedido mínimo?', a: 'No hay mínimo para la primera orden. A partir del segundo pedido, el mínimo es 5 kg de café o equivalente en productos.' },
  { q: '¿Hacen envíos a nivel nacional?', a: 'Sí, despachamos a todo el Perú. Lima metropolitana con entrega en 24-48h, provincias 3-5 días hábiles.' },
  { q: '¿Ofrecen precios preferenciales por volumen?', a: 'Sí. Los descuentos se aplican a partir de 10 kg mensuales. Solicita cotización para tu caso específico.' },
  { q: '¿Pueden personalizar el empaque con mi marca?', a: 'Sí, ofrecemos servicio de marca blanca (private label) para pedidos a partir de 50 kg mensuales.' },
  { q: '¿Tienen certificaciones?', a: 'Registro Sanitario DIGESA vigente. Nuestro café proviene de fincas certificadas en comercio justo y prácticas orgánicas.' },
];

const WHATSAPP_NUMBER = '51999999999';
const WHATSAPP_MESSAGE = encodeURIComponent(
  'Hola, me interesa cotizar café de especialidad para mi empresa. Estoy revisando la página de Empresas de Armache Café.'
);

export default function EmpresasPage() {
  return (
    <div data-testid="empresas-page">
      {/* Hero */}
      <section className="bg-gradient-to-b from-brand-primary/5 to-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-brand-primary/10 flex items-center justify-center">
            <Building2 className="w-8 h-8 text-brand-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
            Café de Especialidad para tu Empresa
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Proveemos café de origen único de San Ignacio, Cajamarca a hoteles, oficinas, restaurantes y empresas.
            Precios B2B, volúmenes a medida, y la trazabilidad que tus clientes valoran.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
              data-testid="empresas-whatsapp-button"
            >
              <MessageCircle className="w-5 h-5" />
              Solicitar cotización por WhatsApp
            </a>
            <a
              href="#contacto"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-brand-primary text-brand-primary font-semibold rounded-lg hover:bg-brand-primary/5 transition-colors"
              data-testid="empresas-email-button"
            >
              <Mail className="w-5 h-5" />
              Enviar correo
            </a>
          </div>
        </div>
      </section>

      {/* Products B2B */}
      <section className="max-w-5xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-display font-bold text-gray-900 mb-6 text-center">
          Nuestro Catálogo B2B
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {B2B_PRODUCTS.map((product) => (
            <div key={product.name} className="border border-gray-200 rounded-xl p-5 hover:border-brand-primary/30 transition-colors">
              <div className="w-12 h-12 bg-brand-accent/10 rounded-lg flex items-center justify-center mb-3">
                <Coffee className="w-6 h-6 text-brand-accent" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
              <p className="text-sm text-gray-500">{product.description}</p>
            </div>
          ))}
        </div>
        <p className="text-sm text-gray-400 text-center mt-4">
          Precios no publicados — solicita cotización personalizada según tu volumen.
        </p>
      </section>

      {/* FAQ */}
      <section className="bg-gray-50 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-display font-bold text-gray-900 mb-6 text-center">
            Preguntas Frecuentes
          </h2>
          <div className="space-y-4">
            {FAQ.map((item) => (
              <details key={item.q} className="bg-white border border-gray-200 rounded-lg">
                <summary className="px-5 py-4 cursor-pointer font-medium text-gray-900 flex items-center justify-between">
                  {item.q}
                  <ChevronRight className="w-4 h-4 text-gray-400 transition-transform details-open:rotate-90" />
                </summary>
                <p className="px-5 pb-4 text-sm text-gray-600">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Contact form (B2B-02) */}
      <section id="contacto" className="max-w-2xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-display font-bold text-gray-900 mb-6 text-center">
          Envíanos un Correo
        </h2>
        <ContactForm />
      </section>
    </div>
  );
}

function ContactForm() {
  return (
    <form
      action={`mailto:ventas@armachecafe.com`}
      method="POST"
      encType="text/plain"
      className="bg-white border border-gray-200 rounded-xl p-6 space-y-4"
      data-testid="empresas-contact-form"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="b2b-name" className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
          <input id="b2b-name" name="nombre" type="text" required className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" data-testid="b2b-contact-name" />
        </div>
        <div>
          <label htmlFor="b2b-empresa" className="block text-sm font-medium text-gray-700 mb-1">Empresa</label>
          <input id="b2b-empresa" name="empresa" type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" data-testid="b2b-contact-empresa" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="b2b-ruc" className="block text-sm font-medium text-gray-700 mb-1">RUC (opcional)</label>
          <input id="b2b-ruc" name="ruc" type="text" maxLength={11} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" data-testid="b2b-contact-ruc" />
        </div>
        <div>
          <label htmlFor="b2b-tipo" className="block text-sm font-medium text-gray-700 mb-1">Tipo de empresa</label>
          <select id="b2b-tipo" name="tipo" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" data-testid="b2b-contact-tipo">
            <option value="">Seleccionar...</option>
            <option value="hotel">Hotel</option>
            <option value="oficina">Oficina</option>
            <option value="restaurante">Restaurante / Cafetería</option>
            <option value="tienda">Tienda / Retail</option>
            <option value="otro">Otro</option>
          </select>
        </div>
      </div>
      <div>
        <label htmlFor="b2b-volumen" className="block text-sm font-medium text-gray-700 mb-1">Volumen estimado mensual</label>
        <input id="b2b-volumen" name="volumen" type="text" placeholder="Ej: 20 kg/mes" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" data-testid="b2b-contact-volumen" />
      </div>
      <div>
        <label htmlFor="b2b-mensaje" className="block text-sm font-medium text-gray-700 mb-1">Mensaje</label>
        <textarea id="b2b-mensaje" name="mensaje" rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" placeholder="Cuéntanos qué necesitas..." data-testid="b2b-contact-mensaje" />
      </div>
      <button type="submit" className="w-full py-3 bg-brand-primary text-white font-medium rounded-lg hover:bg-brand-primary/90 transition-colors" data-testid="b2b-contact-submit">
        Enviar Solicitud
      </button>
    </form>
  );
}
