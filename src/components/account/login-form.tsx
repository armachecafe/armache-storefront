'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth, type AuthError } from '@/contexts/auth-context';
import { confirmSignUp, resendConfirmationCode } from '@/lib/auth';

interface LoginFormProps {
  onSuccess?: () => void;
  onNeedConfirmation?: (email: string) => void;
}

export function LoginForm({ onSuccess, onNeedConfirmation }: LoginFormProps) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Confirmation flow state
  const [needsConfirmation, setNeedsConfirmation] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState('');
  const [confirmLoading, setConfirmLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password);
      onSuccess?.();
    } catch (err) {
      const authErr = err as AuthError;
      if (authErr.code === 'UserNotConfirmedException') {
        setNeedsConfirmation(true);
        onNeedConfirmation?.(email);
        await resendConfirmationCode(email).catch(() => {});
      } else if (authErr.code === 'NotAuthorizedException') {
        setError('Email o contraseña incorrectos.');
      } else if (authErr.code === 'LimitExceededException') {
        setError('Demasiados intentos. Intenta de nuevo en unos minutos.');
      } else {
        setError(authErr.message || 'Error al iniciar sesión.');
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleConfirm(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setConfirmLoading(true);

    try {
      await confirmSignUp(email, confirmationCode);
      // After confirmation, auto-login
      await login(email, password);
      onSuccess?.();
    } catch (err) {
      const authErr = err as AuthError;
      if (authErr.code === 'CodeMismatchException') {
        setError('Código incorrecto. Verifica e intenta de nuevo.');
      } else if (authErr.code === 'ExpiredCodeException') {
        setError('Código expirado. Te enviamos uno nuevo.');
        await resendConfirmationCode(email).catch(() => {});
      } else {
        setError(authErr.message || 'Error al confirmar.');
      }
    } finally {
      setConfirmLoading(false);
    }
  }

  if (needsConfirmation) {
    return (
      <form onSubmit={handleConfirm} className="space-y-4" data-testid="login-confirm-form">
        <div className="text-center mb-4">
          <p className="text-sm text-gray-600">
            Tu cuenta necesita verificación. Ingresa el código enviado a <strong>{email}</strong>.
          </p>
        </div>

        <div>
          <label htmlFor="confirmation-code" className="block text-sm font-medium text-gray-700 mb-1">
            Código de verificación
          </label>
          <input
            id="confirmation-code"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            value={confirmationCode}
            onChange={(e) => setConfirmationCode(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary"
            placeholder="123456"
            required
            data-testid="login-confirm-code-input"
          />
        </div>

        {error && (
          <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg" role="alert" data-testid="login-confirm-error">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={confirmLoading}
          className="w-full py-2.5 px-4 bg-brand-primary text-white font-medium rounded-lg hover:bg-brand-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          data-testid="login-confirm-submit"
        >
          {confirmLoading ? 'Verificando...' : 'Verificar cuenta'}
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" data-testid="login-form">
      <div>
        <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          id="login-email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary"
          placeholder="tu@email.com"
          required
          data-testid="login-email-input"
        />
      </div>

      <div>
        <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 mb-1">
          Contraseña
        </label>
        <input
          id="login-password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary"
          placeholder="••••••••"
          required
          data-testid="login-password-input"
        />
      </div>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg" role="alert" data-testid="login-error">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 px-4 bg-brand-primary text-white font-medium rounded-lg hover:bg-brand-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        data-testid="login-submit-button"
      >
        {loading ? 'Ingresando...' : 'Iniciar Sesión'}
      </button>

      <p className="text-center text-sm text-gray-500">
        <Link href="/cuenta/recuperar" className="text-brand-primary hover:underline" data-testid="login-forgot-password">
          ¿Olvidaste tu contraseña?
        </Link>
      </p>
    </form>
  );
}
