/**
 * Local Cart Adapter — localStorage-only cart for guest (unauthenticated) users.
 *
 * The cart lives 100% in localStorage until the user logs in, at which point
 * it gets merged to the server-side cart via POST /cart/merge.
 *
 * No API calls are made while in guest mode. Price/stock validation happens
 * server-side at merge time; if something changed the user is notified.
 *
 * Shape matches the Cart/CartItem interfaces from @/lib/api for seamless switching.
 */
import type { Cart, CartItem } from '@/lib/api';

const STORAGE_KEY = 'armache_local_cart';
const MAX_ITEMS = 20;
const MAX_QUANTITY = 50;

export interface LocalCartProductInfo {
  sku: string;
  name: string;
  variantName?: string;
  thumbnailUrl?: string;
  priceCents: number;
}

function generateItemId(): string {
  return crypto.randomUUID();
}

function readCart(): Cart {
  if (typeof window === 'undefined') {
    return emptyCart();
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyCart();
    return JSON.parse(raw) as Cart;
  } catch {
    return emptyCart();
  }
}

function writeCart(cart: Cart): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
}

function emptyCart(): Cart {
  return { cartId: 'local', items: [], itemCount: 0, subtotalCents: 0 };
}

function recalculate(cart: Cart): void {
  cart.itemCount = cart.items.length;
  cart.subtotalCents = cart.items.reduce((sum, item) => sum + item.subtotalCents, 0);
}

// --- Public API ---

export const localCart = {
  /** Get the current local cart. */
  get(): Cart {
    return readCart();
  },

  /** Add an item (or increase quantity if SKU already exists). */
  add(product: LocalCartProductInfo, quantity = 1): Cart {
    const cart = readCart();

    const existing = cart.items.find((i) => i.sku === product.sku);
    if (existing) {
      existing.quantity = Math.min(existing.quantity + quantity, MAX_QUANTITY);
      existing.subtotalCents = existing.priceCents * existing.quantity;
    } else {
      if (cart.items.length >= MAX_ITEMS) {
        throw new Error('Máximo 20 productos distintos en el carrito');
      }
      const newItem: CartItem = {
        itemId: generateItemId(),
        sku: product.sku,
        name: product.name,
        variantName: product.variantName,
        thumbnailUrl: product.thumbnailUrl,
        priceCents: product.priceCents,
        quantity: Math.min(quantity, MAX_QUANTITY),
        subtotalCents: product.priceCents * Math.min(quantity, MAX_QUANTITY),
      };
      cart.items.push(newItem);
    }

    recalculate(cart);
    writeCart(cart);
    return cart;
  },

  /** Update an item's quantity. */
  update(itemId: string, quantity: number): Cart {
    if (quantity < 1 || quantity > MAX_QUANTITY) {
      throw new Error(`La cantidad debe ser entre 1 y ${MAX_QUANTITY}`);
    }
    const cart = readCart();
    const item = cart.items.find((i) => i.itemId === itemId);
    if (!item) throw new Error('Item no encontrado en el carrito');

    item.quantity = quantity;
    item.subtotalCents = item.priceCents * quantity;
    recalculate(cart);
    writeCart(cart);
    return cart;
  },

  /** Remove an item from the cart. */
  remove(itemId: string): Cart {
    const cart = readCart();
    cart.items = cart.items.filter((i) => i.itemId !== itemId);
    recalculate(cart);
    writeCart(cart);
    return cart;
  },

  /** Clear the entire local cart (called after successful merge). */
  clear(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('armache_cart_id');
  },

  /** Check if there are items in the local cart. */
  hasItems(): boolean {
    const cart = readCart();
    return cart.items.length > 0;
  },

  /**
   * Get items formatted for the merge endpoint.
   * Returns the array needed by POST /cart/merge (via the existing addCartItem loop).
   */
  getItemsForMerge(): Array<{ sku: string; quantity: number }> {
    const cart = readCart();
    return cart.items.map((i) => ({ sku: i.sku, quantity: i.quantity }));
  },
};
