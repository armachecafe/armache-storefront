'use client';

import { useState } from 'react';
import { forgotPassword, confirmForgotPassword, type AuthError } from '@/lib/auth';

interface ForgotPasswordFormProps {
  onSuccess?: () => void;
}

export function ForgotPasswordForm({ onSuccess }: ForgotPasswordFormProps) {
  const [step, setStep] = useState<'email' | 'code'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [destination, setDestination] = useState('');

  async function handleSendCode(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await forgotPassword(email);
      setDestination(result.codeDeliveryDetails.destination ?? email);
      setStep('code');
    } catch (err) {
      const authErr = err as AuthError;
      if (authErr.code === 'UserNotFoundException') {
        setError('No encontramos una cuenta con ese email.');
      } else if (authErr.code === 'LimitExceededException') {
        setError('Demasiados intentos. Intenta de nuevo en unos minutos.');
      } else {
        setError(authErr.message || 'Error al enviar el código.');
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    // Validate passwords
    if (newPassword.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }
    if (!/[A-Z]/.test(newPassword)) {
      setError('La contraseña debe incluir al menos una mayúscula.');
      return;
    }
    if (!/[a-z]/.test(newPassword)) {
      setError('La contraseña debe incluir al menos una minúscula.');
      return;
    }
    if (!/\d/.test(newPassword)) {
      setError('La contraseña debe incluir al menos un número.');
      return;
    }
    if (!/[^A-Za-z0-9]/.test(newPassword)) {
      setError('La contraseña debe incluir al menos un carácter especial.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);

    try {
      await confirmForgotPassword(email, code, newPassword);
      setSuccess('Contraseña restablecida correctamente. Ya puedes iniciar sesión.');
      setTimeout(() => onSuccess?.(), 2000);
    } catch (err) {
      const authErr = err as AuthError;
      if (authErr.code === 'CodeMismatchException') {
        setError('Código incorrecto. Verifica e intenta de nuevo.');
      } else if (authErr.code === 'ExpiredCodeException') {
        setError('Código expirado. Solicita uno nuevo.');
        setStep('email');
      } else if (authErr.code === 'InvalidPasswordException') {
        setError('La contraseña no cumple los requisitos de seguridad.');
      } else if (authErr.code === 'LimitExceededException') {
        setError('Demasiados intentos. Intenta de nuevo en unos minutos.');
      } else {
        setError(authErr.message || 'Error al restablecer la contraseña.');
      }
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="text-center py-4" data-testid="forgot-password-success">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <span className="text-green-600 text-xl">✓</span>
        </div>
        <p className="text-sm text-green-700">{success}</p>
      </div>
    );
  }

  if (step === 'email') {
    return (
      <form onSubmit={handleSendCode} className="space-y-4" data-testid="forgot-password-email-form">
        <div>
          <label htmlFor="forgot-email" className="block text-sm font-medium text-gray-700 mb-1">
            Email de tu cuenta
          </label>
          <input
            id="forgot-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary"
            placeholder="tu@email.com"
            required
            data-testid="forgot-password-email-input"
          />
        </div>

        {error && (
          <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg" role="alert" data-testid="forgot-password-error">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 px-4 bg-brand-primary text-white font-medium rounded-lg hover:bg-brand-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          data-testid="forgot-password-send-code"
        >
          {loading ? 'Enviando...' : 'Enviar código de verificación'}
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleResetPassword} className="space-y-4" data-testid="forgot-password-reset-form">
      <div className="text-center mb-4">
        <p className="text-sm text-gray-600">
          Enviamos un código de verificación a <strong>{destination}</strong>
        </p>
      </div>

      <div>
        <label htmlFor="forgot-code" className="block text-sm font-medium text-gray-700 mb-1">
          Código de verificación
        </label>
        <input
          id="forgot-code"
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary text-center text-lg tracking-widest"
          placeholder="123456"
          maxLength={6}
          required
          data-testid="forgot-password-code-input"
        />
      </div>

      <div>
        <label htmlFor="forgot-new-password" className="block text-sm font-medium text-gray-700 mb-1">
          Nueva contraseña
        </label>
        <input
          id="forgot-new-password"
          type="password"
          autoComplete="new-password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary"
          placeholder="Mínimo 8 caracteres"
          required
          data-testid="forgot-password-new-password-input"
        />
        <p className="text-xs text-gray-500 mt-1">Mínimo 8 caracteres, mayúscula, minúscula, número y carácter especial.</p>
      </div>

      <div>
        <label htmlFor="forgot-confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
          Confirmar nueva contraseña
        </label>
        <input
          id="forgot-confirm-password"
          type="password"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary"
          required
          data-testid="forgot-password-confirm-password-input"
        />
      </div>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg" role="alert" data-testid="forgot-password-error">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 px-4 bg-brand-primary text-white font-medium rounded-lg hover:bg-brand-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        data-testid="forgot-password-reset-submit"
      >
        {loading ? 'Restableciendo...' : 'Restablecer contraseña'}
      </button>

      <p className="text-center text-sm text-gray-500">
        <button
          type="button"
          onClick={() => { setStep('email'); setError(null); }}
          className="text-brand-primary hover:underline"
          data-testid="forgot-password-back-to-email"
        >
          Usar otro email
        </button>
      </p>
    </form>
  );
}
