'use client';

import { CreditCard, Smartphone } from 'lucide-react';

export type PaymentMethod = 'culqi' | 'yape';

interface PaymentSelectorProps {
  selected: PaymentMethod | null;
  onSelect: (method: PaymentMethod) => void;
}

export function PaymentSelector({ selected, onSelect }: PaymentSelectorProps) {
  return (
    <div className="space-y-3" data-testid="payment-selector">
      <h3 className="text-lg font-semibold text-gray-900">Método de pago</h3>

      <label
        className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-colors ${
          selected === 'culqi' ? 'border-brand-primary bg-brand-primary/5' : 'border-gray-200 hover:border-gray-300'
        }`}
      >
        <input
          type="radio"
          name="paymentMethod"
          value="culqi"
          checked={selected === 'culqi'}
          onChange={() => onSelect('culqi')}
          className="sr-only"
          data-testid="payment-method-culqi"
        />
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
          <CreditCard className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <p className="font-medium text-gray-900">Tarjeta de crédito o débito</p>
          <p className="text-xs text-gray-500">Visa, Mastercard — procesado por Culqi</p>
        </div>
      </label>

      <label
        className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-colors ${
          selected === 'yape' ? 'border-brand-primary bg-brand-primary/5' : 'border-gray-200 hover:border-gray-300'
        }`}
      >
        <input
          type="radio"
          name="paymentMethod"
          value="yape"
          checked={selected === 'yape'}
          onChange={() => onSelect('yape')}
          className="sr-only"
          data-testid="payment-method-yape"
        />
        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
          <Smartphone className="w-5 h-5 text-purple-600" />
        </div>
        <div>
          <p className="font-medium text-gray-900">Yape</p>
          <p className="text-xs text-gray-500">Paga con tu código autorizador de Yape</p>
        </div>
      </label>
    </div>
  );
}
