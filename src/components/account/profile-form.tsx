'use client';

import { useState } from 'react';
import { api, type UserProfile, type UpdateProfileInput } from '@/lib/api';

interface ProfileFormProps {
  profile: UserProfile;
  onUpdated?: (profile: UserProfile) => void;
}

export function ProfileForm({ profile, onUpdated }: ProfileFormProps) {
  const [formData, setFormData] = useState({
    givenName: profile.givenName ?? '',
    familyName: profile.familyName ?? '',
    phoneNumber: profile.phoneNumber ?? '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateField(field: string, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setSuccess(false);
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const data: UpdateProfileInput = {};
      if (formData.givenName !== (profile.givenName ?? '')) data.givenName = formData.givenName;
      if (formData.familyName !== (profile.familyName ?? '')) data.familyName = formData.familyName;
      if (formData.phoneNumber !== (profile.phoneNumber ?? '')) data.phoneNumber = formData.phoneNumber;

      if (Object.keys(data).length === 0) {
        setSuccess(true);
        return;
      }

      const updated = await api.updateProfile(data);
      setSuccess(true);
      onUpdated?.(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar perfil.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" data-testid="profile-form">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="profile-given-name" className="block text-sm font-medium text-gray-700 mb-1">
            Nombre
          </label>
          <input
            id="profile-given-name"
            type="text"
            autoComplete="given-name"
            value={formData.givenName}
            onChange={(e) => updateField('givenName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary"
            data-testid="profile-given-name-input"
          />
        </div>

        <div>
          <label htmlFor="profile-family-name" className="block text-sm font-medium text-gray-700 mb-1">
            Apellido
          </label>
          <input
            id="profile-family-name"
            type="text"
            autoComplete="family-name"
            value={formData.familyName}
            onChange={(e) => updateField('familyName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary"
            data-testid="profile-family-name-input"
          />
        </div>
      </div>

      <div>
        <label htmlFor="profile-email" className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          id="profile-email"
          type="email"
          value={profile.email}
          disabled
          className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
          data-testid="profile-email-input"
        />
        <p className="text-xs text-gray-400 mt-1">El email no se puede cambiar.</p>
      </div>

      <div>
        <label htmlFor="profile-phone" className="block text-sm font-medium text-gray-700 mb-1">
          Teléfono
        </label>
        <input
          id="profile-phone"
          type="tel"
          autoComplete="tel"
          value={formData.phoneNumber}
          onChange={(e) => updateField('phoneNumber', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary"
          placeholder="+51 999 999 999"
          data-testid="profile-phone-input"
        />
      </div>

      {/* Feedback */}
      {success && (
        <div className="text-sm text-green-700 bg-green-50 p-3 rounded-lg" role="status" data-testid="profile-success">
          ✓ Perfil actualizado correctamente.
        </div>
      )}
      {error && (
        <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg" role="alert" data-testid="profile-error">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="px-6 py-2.5 bg-brand-primary text-white font-medium rounded-lg hover:bg-brand-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        data-testid="profile-submit-button"
      >
        {loading ? 'Guardando...' : 'Guardar Cambios'}
      </button>
    </form>
  );
}
