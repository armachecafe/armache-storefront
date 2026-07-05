'use client';

import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { api, type Cart, type CartItem } from '@/lib/api';
import { useAuth } from '@/contexts/auth-context';

interface CartContextValue {
  cart: Cart | null;
  itemCount: number;
  isLoading: boolean;
  error: string | null;
  addItem: (sku: string, quantity?: number) => Promise<void>;
  updateItem: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  refreshCart: () => Promise<void>;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

function getGuestCartId(): string {
  if (typeof window === 'undefined') return '';
  let cartId = localStorage.getItem('armache_cart_id');
  if (!cartId) {
    cartId = crypto.randomUUID();
    localStorage.setItem('armache_cart_id', cartId);
  }
  return cartId;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, user } = useAuth();
  const prevAuthRef = useRef(isAuthenticated);

  const refreshCart = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await api.getCart();
      setCart(data);
    } catch (err) {
      // If 404 or no cart, treat as empty
      setCart({ cartId: '', items: [], itemCount: 0, subtotalCents: 0 });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load cart on mount
  useEffect(() => {
    // Ensure guest cartId exists
    if (!isAuthenticated) {
      getGuestCartId();
    }
    refreshCart();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Merge guest cart on login
  useEffect(() => {
    if (isAuthenticated && !prevAuthRef.current) {
      const guestCartId = typeof window !== 'undefined' ? localStorage.getItem('armache_cart_id') : null;
      if (guestCartId) {
        api.mergeCart(guestCartId)
          .then((merged) => {
            setCart(merged);
            localStorage.removeItem('armache_cart_id');
          })
          .catch(() => {
            // Merge failed — just refresh normally
            refreshCart();
          });
      } else {
        refreshCart();
      }
    }
    prevAuthRef.current = isAuthenticated;
  }, [isAuthenticated, refreshCart]);

  const addItem = useCallback(async (sku: string, quantity = 1) => {
    try {
      setError(null);
      const updated = await api.addCartItem(sku, quantity);
      setCart(updated);
      // Store cartId for guests
      if (!isAuthenticated && updated.cartId) {
        localStorage.setItem('armache_cart_id', updated.cartId);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al agregar al carrito');
      throw err;
    }
  }, [isAuthenticated]);

  const updateItem = useCallback(async (itemId: string, quantity: number) => {
    try {
      setError(null);
      const updated = await api.updateCartItem(itemId, quantity);
      setCart(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar item');
      throw err;
    }
  }, []);

  const removeItem = useCallback(async (itemId: string) => {
    try {
      setError(null);
      const updated = await api.removeCartItem(itemId);
      setCart(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar item');
      throw err;
    }
  }, []);

  const clearCart = useCallback(() => {
    setCart({ cartId: '', items: [], itemCount: 0, subtotalCents: 0 });
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        itemCount: cart?.itemCount ?? 0,
        isLoading,
        error,
        addItem,
        updateItem,
        removeItem,
        refreshCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
