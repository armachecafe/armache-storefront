'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { LoginForm } from '@/components/account/login-form';
import { RegisterForm } from '@/components/account/register-form';

type Tab = 'login' | 'register';

export default function CuentaPage() {
  const [activeTab, setActiveTab] = useState<Tab>('login');
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
    return null; // Will redirect
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl text-gray-900 mb-2">Mi Cuenta</h1>
          <p className="text-gray-600">Ingresa o crea tu cuenta para comprar</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6" role="tablist" data-testid="cuenta-tabs">
          <button
            role="tab"
            aria-selected={activeTab === 'login'}
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'login'
                ? 'border-brand-primary text-brand-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            data-testid="cuenta-tab-login"
          >
            Iniciar Sesión
          </button>
          <button
            role="tab"
            aria-selected={activeTab === 'register'}
            onClick={() => setActiveTab('register')}
            className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'register'
                ? 'border-brand-primary text-brand-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            data-testid="cuenta-tab-register"
          >
            Crear Cuenta
          </button>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6" data-testid="cuenta-form-container">
          {activeTab === 'login' ? (
            <LoginForm onSuccess={() => router.push('/cuenta/perfil')} />
          ) : (
            <RegisterForm onSuccess={() => router.push('/cuenta/perfil')} />
          )}
        </div>
      </div>
    </div>
  );
}
