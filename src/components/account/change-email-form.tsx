'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { type AuthError } from '@/lib/auth';

export function ChangeEmailForm() {
  const { user, changeEmail, confirmEmailChange } = useAuth();
  const [step, setStep] = useState<'form' | 'verify'>('form');
  const [newEmail, setNewEmail] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmitEmail(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!newEmail.trim() || !newEmail.includes('@')) {
      setError('Ingresa un email válido.');
      return;
    }

    if (newEmail === user?.email) {
      setError('El nuevo email debe ser diferente al actual.');
      return;
    }

    setLoading(true);

    try {
      await changeEmail(newEmail);
      setStep('verify');
    } catch (err) {
      const authErr = err as AuthError;
      if (authErr.code === 'AliasExistsException') {
        setError('Ya existe una cuenta con ese email.');
      } else if (authErr.code === 'LimitExceededException') {
        setError('Demasiados intentos. Intenta de nuevo en unos minutos.');
      } else if (authErr.code === 'InvalidParameterException') {
        setError('El formato del email no es válido.');
      } else {
        setError(authErr.message || 'Error al cambiar el email.');
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await confirmEmailChange(code);
      setSuccess(true);
    } catch (err) {
      const authErr = err as AuthError;
      if (authErr.code === 'CodeMismatchException') {
        setError('Código incorrecto. Verifica e intenta de nuevo.');
      } else if (authErr.code === 'ExpiredCodeException') {
        setError('Código expirado. Solicita uno nuevo.');
        setStep('form');
      } else if (authErr.code === 'LimitExceededException') {
        setError('Demasiados intentos. Intenta de nuevo en unos minutos.');
      } else {
        setError(authErr.message || 'Error al verificar el email.');
      }
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="text-center py-4" data-testid="change-email-success">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <span className="text-green-600 text-xl">✓</span>
        </div>
        <p className="text-sm text-green-700">Email actualizado correctamente a <strong>{newEmail}</strong>.</p>
      </div>
    );
  }

  if (step === 'verify') {
    return (
      <form onSubmit={handleVerify} className="space-y-4" data-testid="change-email-verify-form">
        <div className="text-center mb-4">
          <p className="text-sm text-gray-600">
            Enviamos un código de verificación a <strong>{newEmail}</strong>
          </p>
        </div>

        <div>
          <label htmlFor="email-verify-code" className="block text-sm font-medium text-gray-700 mb-1">
            Código de verificación
          </label>
          <input
            id="email-verify-code"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary text-center text-lg tracking-widest"
            placeholder="123456"
            maxLength={6}
            required
            data-testid="change-email-code-input"
          />
        </div>

        {error && (
          <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg" role="alert" data-testid="change-email-error">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 px-4 bg-brand-primary text-white font-medium rounded-lg hover:bg-brand-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          data-testid="change-email-verify-submit"
        >
          {loading ? 'Verificando...' : 'Verificar nuevo email'}
        </button>

        <p className="text-center text-sm text-gray-500">
          <button
            type="button"
            onClick={() => { setStep('form'); setError(null); }}
            className="text-brand-primary hover:underline"
            data-testid="change-email-back"
          >
            Usar otro email
          </button>
        </p>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmitEmail} className="space-y-4" data-testid="change-email-form">
      <div>
        <p className="text-sm text-gray-500 mb-3">
          Email actual: <strong>{user?.email}</strong>
        </p>
        <label htmlFor="new-email" className="block text-sm font-medium text-gray-700 mb-1">
          Nuevo email
        </label>
        <input
          id="new-email"
          type="email"
          autoComplete="email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary"
          placeholder="nuevo@email.com"
          required
          data-testid="change-email-new-input"
        />
      </div>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg" role="alert" data-testid="change-email-error">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 px-4 bg-brand-primary text-white font-medium rounded-lg hover:bg-brand-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        data-testid="change-email-submit"
      >
        {loading ? 'Enviando código...' : 'Cambiar Email'}
      </button>
    </form>
  );
}
