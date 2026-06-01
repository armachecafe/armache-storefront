import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-brand-dark text-white py-12">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
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

        {/* Contact */}
        <div>
          <h4 className="font-semibold mb-3">Contacto</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>📞 947 258 244 / 947 389 156</li>
            <li>📷 @armachecafe</li>
            <li>📘 /cafearmache</li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 mt-8 pt-8 border-t border-gray-700 text-center text-sm text-gray-400">
        © 2026 Armache Café. Todos los derechos reservados.
      </div>
    </footer>
  );
}
