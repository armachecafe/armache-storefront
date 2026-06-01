'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { User, MapPin, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';

const accountNavItems = [
  { href: '/cuenta/perfil', label: 'Mi Perfil', icon: User },
  { href: '/cuenta/direcciones', label: 'Direcciones', icon: MapPin },
];

export default function CuentaLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Don't redirect from the login/register page itself
    if (!isLoading && !isAuthenticated && pathname !== '/cuenta') {
      router.replace('/cuenta');
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  // The /cuenta page (login/register) renders without the account layout chrome
  if (pathname === '/cuenta') {
    return <>{children}</>;
  }

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Cargando...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  function handleLogout() {
    logout();
    router.push('/');
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Page Title */}
      <div className="mb-8">
        <h1 className="font-display text-2xl text-gray-900">
          Hola, {user?.givenName || 'Cliente'}
        </h1>
        <p className="text-sm text-gray-500 mt-1">{user?.email}</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Navigation */}
        <aside className="md:w-56 shrink-0" data-testid="cuenta-sidebar">
          <nav className="flex md:flex-col gap-1">
            {accountNavItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-brand-light text-brand-primary'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  data-testid={`cuenta-nav-${item.href.split('/').pop()}`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}

            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors mt-4"
              data-testid="cuenta-nav-logout"
            >
              <LogOut className="w-4 h-4" />
              Cerrar Sesión
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0" data-testid="cuenta-content">
          {children}
        </main>
      </div>
    </div>
  );
}
