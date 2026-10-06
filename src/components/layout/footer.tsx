import Link from 'next/link';
import { COMPANY, companyAddressLine } from '@/lib/company';

export function Footer() {
  return (
    <footer className="bg-brand-dark text-white py-12">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div>
          <h3 className="font-display text-xl mb-3">Armache Café</h3>
          <p className="text-gray-300 text-sm">
            Café de especialidad de San Ignacio, Cajamarca. 100% Arábico, cosecha y proceso artesanal.
          </p>
        </div>

        {/* Links */}
        <div>
          <h4 className="font-semibold mb-3">Navegación</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            <li><Link href="/catalogo" className="hover:text-brand-accent">Catálogo</Link></li>
            <li><Link href="/catalogo?category=nuestro-cafe" className="hover:text-brand-accent">Nuestro Café</Link></li>
            <li><Link href="/catalogo?category=derivados" className="hover:text-brand-accent">Derivados</Link></li>
            <li><Link href="/empresas" className="hover:text-brand-accent">Empresas</Link></li>
          </ul>
        </div>

        {/* Empresa */}
        <div data-testid="footer-company">
          <h4 className="font-semibold mb-3">Empresa</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>{COMPANY.legalName}</li>
            <li>RUC {COMPANY.taxId}</li>
            <li>{companyAddressLine()}</li>
            <li><Link href="/empresa" className="hover:text-brand-accent">Información de la empresa</Link></li>
            <li><Link href="/politica-privacidad" className="hover:text-brand-accent">Política de Privacidad</Link></li>
            <li><Link href="/terminos" className="hover:text-brand-accent">Términos y Condiciones</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-semibold mb-3">Contacto</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>📞 {COMPANY.phones.sales.join(' / ')}</li>
            <li>✉️ {COMPANY.email}</li>
            <li>📷 <a href="https://www.instagram.com/armache_cafeteria" target="_blank" rel="noopener noreferrer" className="hover:text-brand-accent">@armache_cafeteria</a></li>
            <li>📘 <a href="https://www.facebook.com/ArmacheCafeteriaArtesanal" target="_blank" rel="noopener noreferrer" className="hover:text-brand-accent">Armache Cafetería Artesanal</a></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 mt-8 pt-8 border-t border-gray-700 text-center text-sm text-gray-400">
        © 2026 Armache Café. Todos los derechos reservados.
      </div>
    </footer>
  );
}
