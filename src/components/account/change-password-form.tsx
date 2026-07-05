'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { type AuthError } from '@/lib/auth';

export function ChangePasswordForm() {
  const { changePassword } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Validate
    if (newPassword.length < 8) {
      setError('La nueva contraseña debe tener al menos 8 caracteres.');
      return;
    }
    if (!/[A-Z]/.test(newPassword)) {
      setError('La nueva contraseña debe incluir al menos una mayúscula.');
      return;
    }
    if (!/[a-z]/.test(newPassword)) {
      setError('La nueva contraseña debe incluir al menos una minúscula.');
      return;
    }
    if (!/\d/.test(newPassword)) {
      setError('La nueva contraseña debe incluir al menos un número.');
      return;
    }
    if (!/[^A-Za-z0-9]/.test(newPassword)) {
      setError('La nueva contraseña debe incluir al menos un carácter especial.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    if (currentPassword === newPassword) {
      setError('La nueva contraseña debe ser diferente a la actual.');
      return;
    }

    setLoading(true);

    try {
      await changePassword(currentPassword, newPassword);
      setSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      const authErr = err as AuthError;
      if (authErr.code === 'NotAuthorizedException') {
        setError('La contraseña actual es incorrecta.');
      } else if (authErr.code === 'InvalidPasswordException') {
        setError('La nueva contraseña no cumple los requisitos de seguridad.');
      } else if (authErr.code === 'LimitExceededException') {
        setError('Demasiados intentos. Intenta de nuevo en unos minutos.');
      } else {
        setError(authErr.message || 'Error al cambiar la contraseña.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" data-testid="change-password-form">
      <div>
        <label htmlFor="current-password" className="block text-sm font-medium text-gray-700 mb-1">
          Contraseña actual
        </label>
        <input
          id="current-password"
          type="password"
          autoComplete="current-password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary"
          required
          data-testid="change-password-current-input"
        />
      </div>

      <div>
        <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-1">
          Nueva contraseña
        </label>
        <input
          id="new-password"
          type="password"
          autoComplete="new-password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary"
          placeholder="Mínimo 8 caracteres"
          required
          data-testid="change-password-new-input"
        />
        <p className="text-xs text-gray-500 mt-1">Mínimo 8 caracteres, mayúscula, minúscula, número y carácter especial.</p>
      </div>

      <div>
        <label htmlFor="confirm-new-password" className="block text-sm font-medium text-gray-700 mb-1">
          Confirmar nueva contraseña
        </label>
        <input
          id="confirm-new-password"
          type="password"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary"
          required
          data-testid="change-password-confirm-input"
        />
      </div>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg" role="alert" data-testid="change-password-error">
          {error}
        </div>
      )}

      {success && (
        <div className="text-sm text-green-700 bg-green-50 p-3 rounded-lg" role="alert" data-testid="change-password-success">
          Contraseña cambiada correctamente.
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 px-4 bg-brand-primary text-white font-medium rounded-lg hover:bg-brand-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        data-testid="change-password-submit"
      >
        {loading ? 'Cambiando...' : 'Cambiar Contraseña'}
      </button>
    </form>
  );
}
