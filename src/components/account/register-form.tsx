'use client';

import { useState } from 'react';
import { useAuth, type AuthError } from '@/contexts/auth-context';
import { confirmSignUp, resendConfirmationCode } from '@/lib/auth';

interface RegisterFormProps {
  onSuccess?: () => void;
}

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const { register, login } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    givenName: '',
    familyName: '',
    phoneNumber: '',
  });
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  // Confirmation flow
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState('');
  const [confirmLoading, setConfirmLoading] = useState(false);

  function updateField(field: string, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prev) => ({ ...prev, [field]: '' }));
  }

  function validate(): boolean {
    const errors: Record<string, string> = {};

    if (!formData.givenName.trim()) errors.givenName = 'Nombre es obligatorio';
    if (!formData.familyName.trim()) errors.familyName = 'Apellido es obligatorio';
    if (!formData.email.trim()) errors.email = 'Email es obligatorio';

    if (formData.password.length < 8) {
      errors.password = 'Mínimo 8 caracteres';
    } else if (!/[A-Z]/.test(formData.password)) {
      errors.password = 'Debe incluir al menos una mayúscula';
    } else if (!/[a-z]/.test(formData.password)) {
      errors.password = 'Debe incluir al menos una minúscula';
    } else if (!/\d/.test(formData.password)) {
      errors.password = 'Debe incluir al menos un número';
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Las contraseñas no coinciden';
    }

    if (!consent) {
      errors.consent = 'Debes aceptar la política de privacidad';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!validate()) return;

    setLoading(true);
    try {
      const result = await register({
        email: formData.email,
        password: formData.password,
        givenName: formData.givenName,
        familyName: formData.familyName,
        phoneNumber: formData.phoneNumber || undefined,
      });

      if (!result.userConfirmed) {
        setShowConfirmation(true);
      } else {
        // Auto-login if already confirmed (unlikely but possible)
        await login(formData.email, formData.password);
        onSuccess?.();
      }
    } catch (err) {
      const authErr = err as AuthError;
      if (authErr.code === 'UsernameExistsException') {
        setError('Ya existe una cuenta con este email. ¿Quieres iniciar sesión?');
      } else if (authErr.code === 'InvalidPasswordException') {
        setError('La contraseña no cumple los requisitos de seguridad.');
      } else {
        setError(authErr.message || 'Error al crear la cuenta.');
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
      await confirmSignUp(formData.email, confirmationCode);
      await login(formData.email, formData.password);
      onSuccess?.();
    } catch (err) {
      const authErr = err as AuthError;
      if (authErr.code === 'CodeMismatchException') {
        setError('Código incorrecto. Verifica e intenta de nuevo.');
      } else if (authErr.code === 'ExpiredCodeException') {
        setError('Código expirado. Te enviamos uno nuevo.');
        await resendConfirmationCode(formData.email).catch(() => {});
      } else {
        setError(authErr.message || 'Error al confirmar.');
      }
    } finally {
      setConfirmLoading(false);
    }
  }

  async function handleResendCode() {
    try {
      await resendConfirmationCode(formData.email);
      setError(null);
    } catch {
      setError('No se pudo reenviar el código. Intenta de nuevo.');
    }
  }

  if (showConfirmation) {
    return (
      <form onSubmit={handleConfirm} className="space-y-4" data-testid="register-confirm-form">
        <div className="text-center mb-4">
          <div className="w-12 h-12 bg-brand-light rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-brand-primary text-xl">✉️</span>
          </div>
          <h3 className="font-semibold text-gray-900">Verifica tu email</h3>
          <p className="text-sm text-gray-600 mt-1">
            Enviamos un código de verificación a <strong>{formData.email}</strong>
          </p>
        </div>

        <div>
          <label htmlFor="register-confirm-code" className="block text-sm font-medium text-gray-700 mb-1">
            Código de verificación
          </label>
          <input
            id="register-confirm-code"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            value={confirmationCode}
            onChange={(e) => setConfirmationCode(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary text-center text-lg tracking-widest"
            placeholder="123456"
            maxLength={6}
            required
            data-testid="register-confirm-code-input"
          />
        </div>

        {error && (
          <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg" role="alert" data-testid="register-confirm-error">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={confirmLoading}
          className="w-full py-2.5 px-4 bg-brand-primary text-white font-medium rounded-lg hover:bg-brand-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          data-testid="register-confirm-submit"
        >
          {confirmLoading ? 'Verificando...' : 'Verificar y crear cuenta'}
        </button>

        <p className="text-center text-sm text-gray-500">
          ¿No recibiste el código?{' '}
          <button type="button" onClick={handleResendCode} className="text-brand-primary hover:underline" data-testid="register-resend-code">
            Reenviar
          </button>
        </p>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" data-testid="register-form">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="register-given-name" className="block text-sm font-medium text-gray-700 mb-1">
            Nombre *
          </label>
          <input
            id="register-given-name"
            type="text"
            autoComplete="given-name"
            value={formData.givenName}
            onChange={(e) => updateField('givenName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary"
            required
            data-testid="register-given-name-input"
          />
          {fieldErrors.givenName && <p className="text-xs text-red-600 mt-1">{fieldErrors.givenName}</p>}
        </div>

        <div>
          <label htmlFor="register-family-name" className="block text-sm font-medium text-gray-700 mb-1">
            Apellido *
          </label>
          <input
            id="register-family-name"
            type="text"
            autoComplete="family-name"
            value={formData.familyName}
            onChange={(e) => updateField('familyName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary"
            required
            data-testid="register-family-name-input"
          />
          {fieldErrors.familyName && <p className="text-xs text-red-600 mt-1">{fieldErrors.familyName}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="register-email" className="block text-sm font-medium text-gray-700 mb-1">
          Email *
        </label>
        <input
          id="register-email"
          type="email"
          autoComplete="email"
          value={formData.email}
          onChange={(e) => updateField('email', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary"
          placeholder="tu@email.com"
          required
          data-testid="register-email-input"
        />
        {fieldErrors.email && <p className="text-xs text-red-600 mt-1">{fieldErrors.email}</p>}
      </div>

      <div>
        <label htmlFor="register-phone" className="block text-sm font-medium text-gray-700 mb-1">
          Teléfono <span className="text-gray-400">(opcional)</span>
        </label>
        <input
          id="register-phone"
          type="tel"
          autoComplete="tel"
          value={formData.phoneNumber}
          onChange={(e) => updateField('phoneNumber', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary"
          placeholder="+51 999 999 999"
          data-testid="register-phone-input"
        />
      </div>

      <div>
        <label htmlFor="register-password" className="block text-sm font-medium text-gray-700 mb-1">
          Contraseña *
        </label>
        <input
          id="register-password"
          type="password"
          autoComplete="new-password"
          value={formData.password}
          onChange={(e) => updateField('password', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary"
          placeholder="Mínimo 8 caracteres"
          required
          data-testid="register-password-input"
        />
        {fieldErrors.password && <p className="text-xs text-red-600 mt-1">{fieldErrors.password}</p>}
        <p className="text-xs text-gray-500 mt-1">Mínimo 8 caracteres, una mayúscula, una minúscula y un número.</p>
      </div>

      <div>
        <label htmlFor="register-confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
          Confirmar contraseña *
        </label>
        <input
          id="register-confirm-password"
          type="password"
          autoComplete="new-password"
          value={formData.confirmPassword}
          onChange={(e) => updateField('confirmPassword', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary"
          required
          data-testid="register-confirm-password-input"
        />
        {fieldErrors.confirmPassword && <p className="text-xs text-red-600 mt-1">{fieldErrors.confirmPassword}</p>}
      </div>

      {/* Consent Ley 29733 */}
      <div className="flex items-start gap-3">
        <input
          id="register-consent"
          type="checkbox"
          checked={consent}
          onChange={(e) => {
            setConsent(e.target.checked);
            setFieldErrors((prev) => ({ ...prev, consent: '' }));
          }}
          className="mt-1 h-4 w-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
          data-testid="register-consent-checkbox"
        />
        <label htmlFor="register-consent" className="text-sm text-gray-600">
          Acepto la{' '}
          <a href="/politica-privacidad" className="text-brand-primary hover:underline" target="_blank" rel="noopener noreferrer">
            Política de Privacidad
          </a>{' '}
          y autorizo el tratamiento de mis datos personales conforme a la Ley 29733 de Protección de Datos Personales. *
        </label>
      </div>
      {fieldErrors.consent && <p className="text-xs text-red-600">{fieldErrors.consent}</p>}

      {error && (
        <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg" role="alert" data-testid="register-error">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 px-4 bg-brand-primary text-white font-medium rounded-lg hover:bg-brand-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        data-testid="register-submit-button"
      >
        {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
      </button>
    </form>
  );
}
