'use client';

import Link from 'next/link';
import { useCart } from '@/contexts/cart-context';
import { useAuth } from '@/contexts/auth-context';

export function CartSummary() {
  const { cart } = useCart();
  const { isAuthenticated } = useAuth();

  if (!cart || cart.items.length === 0) return null;

  const subtotalFormatted = (cart.subtotalCents / 100).toFixed(2);

  return (
    <div className="bg-gray-50 rounded-xl p-6 sticky top-24" data-testid="cart-summary">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Resumen</h2>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal ({cart.itemCount} items)</span>
          <span className="font-medium" data-testid="cart-summary-subtotal">S/ {subtotalFormatted}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Envío</span>
          <span className="text-gray-500 italic">Calculado en checkout</span>
        </div>
        <hr className="border-gray-200" />
        <div className="flex justify-between text-base font-semibold">
          <span>Total estimado</span>
          <span data-testid="cart-summary-total">S/ {subtotalFormatted}</span>
        </div>
      </div>

      <Link
        href="/checkout"
        className="mt-6 block w-full text-center py-3 px-4 bg-brand-primary text-white font-medium rounded-lg hover:bg-brand-primary/90 transition-colors"
        data-testid="cart-summary-checkout-button"
      >
        Ir al Checkout
      </Link>

      {!isAuthenticated && (
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500 mb-2">¿Ya tienes cuenta?</p>
          <Link
            href="/cuenta"
            className="text-sm text-brand-primary hover:underline"
            data-testid="cart-summary-login-link"
          >
            Iniciar sesión
          </Link>
          <span className="text-xs text-gray-400 mx-2">o</span>
          <span className="text-sm text-gray-600">continuar como invitado</span>
        </div>
      )}
    </div>
  );
}
