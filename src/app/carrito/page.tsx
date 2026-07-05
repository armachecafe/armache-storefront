'use client';

import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '@/contexts/cart-context';
import { CartItemCard } from '@/components/cart/cart-item-card';
import { CartSummary } from '@/components/cart/cart-summary';

export default function CarritoPage() {
  const { cart, isLoading, updateItem, removeItem } = useCart();

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8" data-testid="cart-page">
        <h1 className="text-2xl font-display font-bold text-gray-900 mb-8">Mi Carrito</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-gray-100 rounded-lg animate-pulse" />
            ))}
          </div>
          <div className="h-64 bg-gray-100 rounded-xl animate-pulse" />
        </div>
      </div>
    );
  }

  const isEmpty = !cart || cart.items.length === 0;

  if (isEmpty) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center" data-testid="cart-page">
        <ShoppingBag className="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <h1 className="text-2xl font-display font-bold text-gray-900 mb-2">Tu carrito está vacío</h1>
        <p className="text-gray-500 mb-6">Agrega productos desde nuestro catálogo para empezar.</p>
        <Link
          href="/catalogo"
          className="inline-block px-6 py-3 bg-brand-primary text-white font-medium rounded-lg hover:bg-brand-primary/90 transition-colors"
          data-testid="cart-empty-explore-button"
        >
          Explorar catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8" data-testid="cart-page">
      <h1 className="text-2xl font-display font-bold text-gray-900 mb-8">Mi Carrito</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            {cart.items.map((item) => (
              <CartItemCard
                key={item.itemId}
                item={item}
                onUpdateQuantity={updateItem}
                onRemove={removeItem}
              />
            ))}
          </div>
        </div>

        {/* Summary Sidebar */}
        <div>
          <CartSummary />
        </div>
      </div>
    </div>
  );
}
