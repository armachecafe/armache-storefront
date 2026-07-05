'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { ForgotPasswordForm } from '@/components/account/forgot-password-form';

export default function RecuperarPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace('/cuenta/perfil');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Cargando...</div>
      </div>
    );
  }

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Back link */}
        <Link
          href="/cuenta"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-brand-primary mb-6"
          data-testid="recuperar-back-link"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a Iniciar Sesión
        </Link>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl text-gray-900 mb-2">Recuperar Contraseña</h1>
          <p className="text-gray-600">Te enviaremos un código a tu email para restablecer tu contraseña</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6" data-testid="recuperar-form-container">
          <ForgotPasswordForm onSuccess={() => router.push('/cuenta')} />
        </div>
      </div>
    </div>
  );
}
