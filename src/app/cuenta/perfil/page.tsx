'use client';

import { useEffect, useState } from 'react';
import { api, type UserProfile } from '@/lib/api';
import { ProfileForm } from '@/components/account/profile-form';
import { ChangePasswordForm } from '@/components/account/change-password-form';
import { ChangeEmailForm } from '@/components/account/change-email-form';
import { useAuth } from '@/contexts/auth-context';

export default function PerfilPage() {
  const { refreshUser } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await api.getProfile();
        setProfile(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar perfil.');
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  function handleUpdated(updated: UserProfile) {
    setProfile(updated);
    refreshUser(); // Refresh auth context with new attributes
  }

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse" data-testid="profile-skeleton">
        <div className="h-8 bg-gray-200 rounded w-48" />
        <div className="h-4 bg-gray-100 rounded w-32" />
        <div className="space-y-3 mt-6">
          <div className="h-10 bg-gray-100 rounded" />
          <div className="h-10 bg-gray-100 rounded" />
          <div className="h-10 bg-gray-100 rounded" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4" data-testid="profile-load-error">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="text-brand-primary hover:underline"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div data-testid="profile-page">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Mi Perfil</h2>
        <p className="text-sm text-gray-500 mt-1">Actualiza tu información personal.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <ProfileForm profile={profile} onUpdated={handleUpdated} />
      </div>

      {/* Change Email */}
      <div className="mt-8 mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Cambiar Email</h2>
        <p className="text-sm text-gray-500 mt-1">Actualiza tu dirección de email. Recibirás un código de verificación.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <ChangeEmailForm />
      </div>

      {/* Change Password */}
      <div className="mt-8 mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Cambiar Contraseña</h2>
        <p className="text-sm text-gray-500 mt-1">Actualiza tu contraseña de acceso.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <ChangePasswordForm />
      </div>
    </div>
  );
}
