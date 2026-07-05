'use client';

import { useState, useEffect, useCallback } from 'react';
import { Smartphone, Clock } from 'lucide-react';

interface YapePaymentProps {
  amountCents: number;
  onCodeSubmitted: (code: string) => void;
  onError: (message: string) => void;
  disabled?: boolean;
}

const YAPE_TIMEOUT_SECONDS = 300; // 5 minutes

export function YapePayment({ amountCents, onCodeSubmitted, onError, disabled }: YapePaymentProps) {
  const [code, setCode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(YAPE_TIMEOUT_SECONDS);

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) {
      onError('El tiempo para confirmar el pago ha expirado. Intenta de nuevo.');
      return;
    }
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, onError]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (code.length !== 6 || submitting || disabled) return;
      setSubmitting(true);
      try {
        onCodeSubmitted(code);
      } catch {
        setSubmitting(false);
      }
    },
    [code, submitting, disabled, onCodeSubmitted],
  );

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div data-testid="yape-payment">
      <div className="bg-purple-50 border border-purple-200 rounded-xl p-6 text-center mb-4">
        <Smartphone className="w-10 h-10 mx-auto text-purple-600 mb-3" />
        <p className="font-semibold text-purple-900 mb-1">Pago con Yape</p>
        <p className="text-2xl font-bold text-purple-800">S/ {(amountCents / 100).toFixed(2)}</p>
        <p className="text-sm text-purple-700 mt-2">
          Abre tu app Yape, genera un código de aprobación e ingrésalo abajo.
        </p>

        {/* Timer */}
        <div className="flex items-center justify-center gap-1.5 mt-3 text-sm text-purple-600">
          <Clock className="w-4 h-4" />
          <span data-testid="yape-timer">
            {minutes}:{seconds.toString().padStart(2, '0')}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="yape-code" className="block text-sm font-medium text-gray-700 mb-1">
            Código autorizador (6 dígitos)
          </label>
          <input
            id="yape-code"
            type="text"
            inputMode="numeric"
            pattern="[0-9]{6}"
            maxLength={6}
            required
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="000000"
            className="w-full px-4 py-3 text-center text-2xl font-mono tracking-[0.3em] border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-300 focus:border-purple-500"
            disabled={submitting || disabled || timeLeft <= 0}
            data-testid="yape-code-input"
          />
        </div>

        <button
          type="submit"
          disabled={code.length !== 6 || submitting || disabled || timeLeft <= 0}
          className="w-full py-3 px-4 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          data-testid="yape-payment-confirm"
        >
          {submitting ? 'Verificando...' : 'Confirmar pago Yape'}
        </button>
      </form>
    </div>
  );
}
