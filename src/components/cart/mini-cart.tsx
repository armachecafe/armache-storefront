'use client';

import { ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { useCart } from '@/contexts/cart-context';

export function MiniCart() {
  const { cart, itemCount } = useCart();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const subtotalFormatted = cart ? (cart.subtotalCents / 100).toFixed(2) : '0.00';
  const visibleItems = cart?.items.slice(0, 3) ?? [];

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="text-gray-700 hover:text-brand-primary relative"
        aria-label="Carrito de compras"
        data-testid="header-cart-button"
      >
        <ShoppingBag className="w-5 h-5" />
        {itemCount > 0 && (
          <span
            className="absolute -top-1.5 -right-1.5 bg-brand-primary text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center"
            data-testid="header-cart-badge"
          >
            {itemCount > 9 ? '9+' : itemCount}
          </span>
        )}
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-2 w-72 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden"
          data-testid="mini-cart-dropdown"
        >
          {itemCount === 0 ? (
            <div className="p-6 text-center">
              <ShoppingBag className="w-8 h-8 mx-auto text-gray-300 mb-2" />
              <p className="text-sm text-gray-500">Tu carrito está vacío</p>
            </div>
          ) : (
            <>
              <div className="max-h-56 overflow-y-auto p-4 space-y-3">
                {visibleItems.map((item) => (
                  <div key={item.itemId} className="flex gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded flex-shrink-0 overflow-hidden">
                      {item.thumbnailUrl ? (
                        <img src={item.thumbnailUrl} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gray-200" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                      <p className="text-xs text-gray-500">
                        {item.quantity} × S/ {(item.priceCents / 100).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
                {cart && cart.items.length > 3 && (
                  <p className="text-xs text-gray-400 text-center">
                    +{cart.items.length - 3} más
                  </p>
                )}
              </div>

              <div className="border-t border-gray-100 p-4">
                <div className="flex justify-between text-sm mb-3">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold" data-testid="mini-cart-subtotal">S/ {subtotalFormatted}</span>
                </div>
                <Link
                  href="/carrito"
                  onClick={() => setOpen(false)}
                  className="block w-full text-center py-2 px-4 bg-brand-primary text-white text-sm font-medium rounded-lg hover:bg-brand-primary/90 transition-colors"
                  data-testid="mini-cart-view-button"
                >
                  Ver carrito
                </Link>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
