'use client';

import Script from 'next/script';
import { useState, useCallback, useEffect } from 'react';
import { CreditCard } from 'lucide-react';

declare global {
  interface Window {
    Culqi?: {
      publicKey: string;
      settings: (opts: Record<string, unknown>) => void;
      open: () => void;
      close: () => void;
      token?: { id: string };
      order?: unknown;
    };
    culqi?: () => void;
  }
}

interface CulqiPaymentProps {
  amountCents: number;
  description: string;
  onTokenReceived: (token: string) => void;
  onError: (message: string) => void;
  disabled?: boolean;
}

const CULQI_PUBLIC_KEY = process.env.NEXT_PUBLIC_CULQI_PUBLIC_KEY || 'pk_test_xxxxxxxx';

export function CulqiPayment({ amountCents, description, onTokenReceived, onError, disabled }: CulqiPaymentProps) {
  const [sdkReady, setSdkReady] = useState(false);
  const [processing, setProcessing] = useState(false);

  // Set up Culqi callback
  useEffect(() => {
    window.culqi = () => {
      if (window.Culqi?.token?.id) {
        onTokenReceived(window.Culqi.token.id);
      } else {
        onError('No se pudo procesar el pago. Intenta de nuevo.');
      }
      setProcessing(false);
    };

    return () => {
      window.culqi = undefined;
    };
  }, [onTokenReceived, onError]);

  const handleOpen = useCallback(() => {
    if (!window.Culqi || !sdkReady || disabled) return;

    window.Culqi.publicKey = CULQI_PUBLIC_KEY;
    window.Culqi.settings({
      title: 'Armache Café',
      currency: 'PEN',
      amount: amountCents,
      description,
    });

    setProcessing(true);
    window.Culqi.open();
  }, [amountCents, description, sdkReady, disabled]);

  return (
    <div data-testid="culqi-payment">
      <Script
        src="https://checkout.culqi.com/js/v4"
        strategy="lazyOnload"
        onLoad={() => setSdkReady(true)}
      />

      <button
        type="button"
        onClick={handleOpen}
        disabled={!sdkReady || processing || disabled}
        className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        data-testid="culqi-payment-button"
      >
        <CreditCard className="w-5 h-5" />
        {processing ? 'Procesando...' : `Pagar S/ ${(amountCents / 100).toFixed(2)}`}
      </button>

      {!sdkReady && (
        <p className="text-xs text-gray-400 mt-2 text-center">Cargando pasarela de pago...</p>
      )}
    </div>
  );
}
