'use client';

import { Minus, Plus, Trash2 } from 'lucide-react';
import { useState, useCallback } from 'react';
import type { CartItem } from '@/lib/api';

interface CartItemCardProps {
  item: CartItem;
  onUpdateQuantity: (itemId: string, quantity: number) => Promise<void>;
  onRemove: (itemId: string) => Promise<void>;
}

export function CartItemCard({ item, onUpdateQuantity, onRemove }: CartItemCardProps) {
  const [updating, setUpdating] = useState(false);

  const handleQuantityChange = useCallback(
    async (newQty: number) => {
      if (newQty < 1 || newQty > 10 || updating) return;
      setUpdating(true);
      try {
        await onUpdateQuantity(item.itemId, newQty);
      } finally {
        setUpdating(false);
      }
    },
    [item.itemId, onUpdateQuantity, updating],
  );

  const handleRemove = useCallback(async () => {
    if (updating) return;
    setUpdating(true);
    try {
      await onRemove(item.itemId);
    } finally {
      setUpdating(false);
    }
  }, [item.itemId, onRemove, updating]);

  const priceFormatted = (item.priceCents / 100).toFixed(2);
  const subtotalFormatted = (item.subtotalCents / 100).toFixed(2);

  return (
    <div
      className="flex gap-4 py-4 border-b border-gray-100 last:border-b-0"
      data-testid={`cart-item-${item.itemId}`}
    >
      {/* Thumbnail */}
      <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
        {item.thumbnailUrl ? (
          <img
            src={item.thumbnailUrl}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
            Sin imagen
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-gray-900 truncate" data-testid={`cart-item-name-${item.itemId}`}>
          {item.name}
        </h3>
        {item.variantName && (
          <p className="text-sm text-gray-500">{item.variantName}</p>
        )}
        <p className="text-sm text-gray-600 mt-1">S/ {priceFormatted} c/u</p>

        {/* Quantity controls */}
        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={() => handleQuantityChange(item.quantity - 1)}
            disabled={item.quantity <= 1 || updating}
            className="w-7 h-7 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Disminuir cantidad"
            data-testid={`cart-item-decrease-${item.itemId}`}
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span
            className="w-8 text-center text-sm font-medium"
            data-testid={`cart-item-quantity-${item.itemId}`}
          >
            {item.quantity}
          </span>
          <button
            onClick={() => handleQuantityChange(item.quantity + 1)}
            disabled={item.quantity >= 10 || updating}
            className="w-7 h-7 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Aumentar cantidad"
            data-testid={`cart-item-increase-${item.itemId}`}
          >
            <Plus className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleRemove}
            disabled={updating}
            className="ml-auto text-red-500 hover:text-red-700 p-1 disabled:opacity-40"
            aria-label={`Eliminar ${item.name} del carrito`}
            data-testid={`cart-item-remove-${item.itemId}`}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Subtotal */}
      <div className="text-right flex-shrink-0">
        <p className="font-semibold text-gray-900" data-testid={`cart-item-subtotal-${item.itemId}`}>
          S/ {subtotalFormatted}
        </p>
      </div>
    </div>
  );
}
