'use client';

import Link from 'next/link';
import { ShoppingBag, User, Menu, LogOut, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const router = useRouter();
  const accountMenuRef = useRef<HTMLDivElement>(null);

  // Close account dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target as Node)) {
        setAccountMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleLogout() {
    logout();
    setAccountMenuOpen(false);
    router.push('/');
  }

  const userInitials = user
    ? `${(user.givenName?.[0] ?? '').toUpperCase()}${(user.familyName?.[0] ?? '').toUpperCase()}`
    : '';

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2" data-testid="header-logo">
          <span className="font-display text-2xl text-brand-primary font-bold">Armache</span>
          <span className="text-sm text-brand-accent font-medium">Café</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8" data-testid="header-nav">
          <Link href="/catalogo" className="text-gray-700 hover:text-brand-primary transition-colors">
            Catálogo
          </Link>
          <Link href="/catalogo?category=nuestro-cafe" className="text-gray-700 hover:text-brand-primary transition-colors">
            Nuestro Café
          </Link>
          <Link href="/catalogo?category=derivados" className="text-gray-700 hover:text-brand-primary transition-colors">
            Derivados
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {/* Account */}
          {isAuthenticated ? (
            <div className="relative" ref={accountMenuRef}>
              <button
                onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                className="flex items-center gap-1.5 text-gray-700 hover:text-brand-primary transition-colors"
                data-testid="header-account-menu-trigger"
                aria-label="Menú de cuenta"
              >
                <span className="w-7 h-7 rounded-full bg-brand-primary text-white text-xs font-medium flex items-center justify-center">
                  {userInitials || <User className="w-3.5 h-3.5" />}
                </span>
                <ChevronDown className="w-3.5 h-3.5 hidden sm:block" />
              </button>

              {accountMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50" data-testid="header-account-dropdown">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900 truncate">{user?.givenName} {user?.familyName}</p>
                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                  </div>
                  <Link
                    href="/cuenta/perfil"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setAccountMenuOpen(false)}
                    data-testid="header-dropdown-profile"
                  >
                    Mi Perfil
                  </Link>
                  <Link
                    href="/cuenta/direcciones"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setAccountMenuOpen(false)}
                    data-testid="header-dropdown-addresses"
                  >
                    Direcciones
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                    data-testid="header-dropdown-logout"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/cuenta" className="text-gray-700 hover:text-brand-primary" data-testid="header-account-link">
              <User className="w-5 h-5" />
            </Link>
          )}

          <button className="text-gray-700 hover:text-brand-primary relative" data-testid="header-cart-button">
            <ShoppingBag className="w-5 h-5" />
          </button>
          <button
            className="md:hidden text-gray-700"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="header-mobile-menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <nav className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-3">
          <Link href="/catalogo" className="block text-gray-700" onClick={() => setMobileMenuOpen(false)}>Catálogo</Link>
          <Link href="/catalogo?category=nuestro-cafe" className="block text-gray-700" onClick={() => setMobileMenuOpen(false)}>Nuestro Café</Link>
          <Link href="/catalogo?category=derivados" className="block text-gray-700" onClick={() => setMobileMenuOpen(false)}>Derivados</Link>
          {isAuthenticated && (
            <>
              <hr className="border-gray-100" />
              <Link href="/cuenta/perfil" className="block text-gray-700" onClick={() => setMobileMenuOpen(false)}>Mi Perfil</Link>
              <Link href="/cuenta/direcciones" className="block text-gray-700" onClick={() => setMobileMenuOpen(false)}>Direcciones</Link>
              <button onClick={handleLogout} className="block text-red-600 text-left">Cerrar Sesión</button>
            </>
          )}
        </nav>
      )}
    </header>
  );
}
