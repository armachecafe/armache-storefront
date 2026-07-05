'use client';

import type { CartItem } from '@/lib/api';

interface OrderSummarySidebarProps {
  items: CartItem[];
  subtotalCents: number;
  shippingCents?: number;
}

export function OrderSummarySidebar({ items, subtotalCents, shippingCents }: OrderSummarySidebarProps) {
  const totalCents = subtotalCents + (shippingCents ?? 0);

  return (
    <div className="bg-gray-50 rounded-xl p-6" data-testid="order-summary-sidebar">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumen del pedido</h3>

      <div className="space-y-3 max-h-60 overflow-y-auto">
        {items.map((item) => (
          <div key={item.itemId} className="flex gap-3">
            <div className="w-10 h-10 bg-gray-200 rounded flex-shrink-0 overflow-hidden">
              {item.thumbnailUrl ? (
                <img src={item.thumbnailUrl} alt={item.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gray-300" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
              <p className="text-xs text-gray-500">×{item.quantity}</p>
            </div>
            <p className="text-sm font-medium text-gray-900 flex-shrink-0">
              S/ {(item.subtotalCents / 100).toFixed(2)}
            </p>
          </div>
        ))}
      </div>

      <hr className="my-4 border-gray-200" />

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span>S/ {(subtotalCents / 100).toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Envío</span>
          <span>
            {shippingCents === undefined
              ? '—'
              : shippingCents === 0
                ? 'Gratis'
                : `S/ ${(shippingCents / 100).toFixed(2)}`}
          </span>
        </div>
        <hr className="border-gray-200" />
        <div className="flex justify-between text-base font-semibold">
          <span>Total</span>
          <span data-testid="order-summary-total">S/ {(totalCents / 100).toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
