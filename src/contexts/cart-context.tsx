'use client';

import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { api, type Cart } from '@/lib/api';
import { localCart, type LocalCartProductInfo } from '@/lib/local-cart';
import { useAuth } from '@/contexts/auth-context';

interface CartContextValue {
  cart: Cart | null;
  itemCount: number;
  isLoading: boolean;
  error: string | null;
  /**
   * Add an item to the cart.
   * - Guest mode: uses localStorage (requires product info for local persistence).
   * - Authenticated: calls the API (only sku + quantity needed; product info optional).
   */
  addItem: (sku: string, quantity?: number, productInfo?: LocalCartProductInfo) => Promise<void>;
  updateItem: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  refreshCart: () => Promise<void>;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();
  const prevAuthRef = useRef(isAuthenticated);

  // --- Load cart (local or API) ---
  const refreshCart = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!isAuthenticated) {
        // Guest mode: read from localStorage (no API calls)
        setCart(localCart.get());
      } else {
        // Authenticated: fetch from API
        const data = await api.getCart();
        setCart(data);
      }
    } catch {
      setCart({ cartId: '', items: [], itemCount: 0, subtotalCents: 0 });
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  // Load cart on mount and when auth state changes
  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  // --- Merge local cart on login ---
  useEffect(() => {
    if (isAuthenticated && !prevAuthRef.current) {
      // User just logged in — merge local cart to server
      if (localCart.hasItems()) {
        const items = localCart.getItemsForMerge();
        // Add each item to the server cart one by one (the existing API).
        // This uses the authenticated addCartItem endpoint that validates stock/price.
        (async () => {
          try {
            for (const item of items) {
              await api.addCartItem(item.sku, item.quantity);
            }
            localCart.clear();
            // Refresh to get the consolidated server cart
            const serverCart = await api.getCart();
            setCart(serverCart);
          } catch {
            // Merge partially failed — clear local anyway and refresh server cart
            localCart.clear();
            const serverCart = await api.getCart().catch(() => null);
            if (serverCart) setCart(serverCart);
          }
        })();
      } else {
        // No local items — just load server cart
        refreshCart();
      }
    }
    prevAuthRef.current = isAuthenticated;
  }, [isAuthenticated, refreshCart]);

  // --- Add item ---
  const addItem = useCallback(async (sku: string, quantity = 1, productInfo?: LocalCartProductInfo) => {
    try {
      setError(null);

      if (!isAuthenticated) {
        // Guest: store locally (requires productInfo)
        if (!productInfo) {
          throw new Error('Product info is required for guest cart');
        }
        const updated = localCart.add(productInfo, quantity);
        setCart(updated);
      } else {
        // Authenticated: call API
        const updated = await api.addCartItem(sku, quantity);
        setCart(updated);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al agregar al carrito';
      setError(msg);
      throw err;
    }
  }, [isAuthenticated]);

  // --- Update item quantity ---
  const updateItem = useCallback(async (itemId: string, quantity: number) => {
    try {
      setError(null);

      if (!isAuthenticated) {
        const updated = localCart.update(itemId, quantity);
        setCart(updated);
      } else {
        const updated = await api.updateCartItem(itemId, quantity);
        setCart(updated);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al actualizar item';
      setError(msg);
      throw err;
    }
  }, [isAuthenticated]);

  // --- Remove item ---
  const removeItem = useCallback(async (itemId: string) => {
    try {
      setError(null);

      if (!isAuthenticated) {
        const updated = localCart.remove(itemId);
        setCart(updated);
      } else {
        const updated = await api.removeCartItem(itemId);
        setCart(updated);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al eliminar item';
      setError(msg);
      throw err;
    }
  }, [isAuthenticated]);

  // --- Clear cart ---
  const clearCart = useCallback(() => {
    if (!isAuthenticated) {
      localCart.clear();
    }
    setCart({ cartId: '', items: [], itemCount: 0, subtotalCents: 0 });
  }, [isAuthenticated]);

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
