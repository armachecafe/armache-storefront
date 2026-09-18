/**
 * API client for the storefront.
 * Calls the API Gateway endpoints.
 */

import { getIdToken } from '@/lib/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.armachecafe.com';

async function fetchApi<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
  });
  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}

/**
 * Authenticated API call — includes Bearer token from Cognito session.
 * Used for /me/* endpoints that require a valid Customers pool token.
 */
async function fetchAuthApi<T>(path: string, options?: RequestInit): Promise<T> {
  const token = await getIdToken();
  if (!token) {
    throw new Error('No authenticated session');
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options?.headers,
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`API error: ${res.status} ${res.statusText} ${body}`);
  }
  return res.json() as Promise<T>;
}

export interface ProductImage {
  imageId: string;
  url: string;
  thumbnailUrl: string;
  mediumUrl: string;
  altText: string;
  sortOrder: number;
  isPrimary: boolean;
}

export interface ProductSummary {
  productId: string;
  slug: string;
  name: string;
  shortDescription?: string;
  thumbnailUrl?: string;
  categoryId: string;
  priceCents: number;
  compareAtPriceCents?: number;
  inStock: boolean;
  featured: boolean;
  coffeeAttributes?: {
    origin: string;
    process: string;
    roastLevel: string;
  };
}

export interface ProductDetail {
  productId: string;
  slug: string;
  name: string;
  description: string;
  images: ProductImage[];
  variants: { variantId: string; sku: string; name: string; priceCents: number; compareAtPriceCents?: number; inStock: boolean }[];
  coffeeAttributes?: {
    species: string;
    origin: string;
    altitude: number;
    process: string;
    variety: string;
    roastLevel: string;
    flavorNotes: string[];
  };
  registroSanitario?: string;
}

export interface Category {
  categoryId: string;
  name: string;
  slug: string;
  imageUrl?: string;
  children?: Category[];
}

export interface Theme {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  logoUrl: string;
  heroBannerUrl?: string;
  heroBannerTitle?: string;
  heroBannerSubtitle?: string;
  heroBannerCta?: string;
  heroBannerLink?: string;
  storeTitle: string;
  storeSubtitle?: string;
  socialLinks?: { instagram?: string; facebook?: string; whatsapp?: string };
}

// --- Account Types ---

export interface UserProfile {
  userId: string;
  email: string;
  givenName?: string;
  familyName?: string;
  phoneNumber?: string;
  defaultAddressId?: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'DELETED';
  createdAt: string;
}

export interface UserAddress {
  addressId: string;
  userId: string;
  label?: string;
  recipientName: string;
  street: string;
  district?: string;
  city: string;
  department: string;
  province: string;
  postalCode?: string;
  phoneNumber?: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAddressInput {
  label?: string;
  recipientName: string;
  street: string;
  district?: string;
  city: string;
  department: string;
  province: string;
  postalCode?: string;
  phoneNumber?: string;
  isDefault?: boolean;
}

export interface UpdateProfileInput {
  givenName?: string;
  familyName?: string;
  phoneNumber?: string;
}

// --- Cart Types ---

export interface CartItem {
  itemId: string;
  sku: string;
  name: string;
  variantName?: string;
  thumbnailUrl?: string;
  priceCents: number;
  quantity: number;
  subtotalCents: number;
}

export interface Cart {
  cartId: string;
  items: CartItem[];
  itemCount: number;
  subtotalCents: number;
}

// --- Shipping Types ---

export interface ShippingQuote {
  method: string;
  label: string;
  costCents: number;
  estimatedDays?: number;
  pickupLocationId?: string;
  pickupAddress?: string;
}

// --- Checkout Types ---

export interface CheckoutSession {
  sessionId: string;
  status: string;
  totalCents: number;
  shippingCents: number;
  items: CartItem[];
}

export interface PrepareCheckoutInput {
  shippingAddress: {
    recipientName: string;
    street: string;
    district?: string;
    city: string;
    department: string;
    province: string;
    postalCode?: string;
    phoneNumber?: string;
  };
  contact: {
    email: string;
    name: string;
    phoneNumber?: string;
  };
  shippingMethod: string;
}

// --- Payment Types ---

export interface PaymentResult {
  transactionId: string;
  status: string;
  gatewayRef?: string;
}

export interface InitiatePaymentInput {
  checkoutSessionId: string;
  orderRef: string;
  amountCents: number;
  currency: 'PEN';
  customerEmail: string;
  customerName?: string;
  userId?: string;
}

// --- Order Types ---

export type OrderStatus = 'CONFIRMED' | 'PREPARING' | 'DISPATCHED' | 'DELIVERED' | 'CANCELLED';

export interface OrderSummary {
  orderId: string;
  orderCode: string;
  status: OrderStatus;
  totalCents: number;
  itemCount: number;
  createdAt: string;
}

export interface OrderItem {
  sku: string;
  name: string;
  quantity: number;
  priceCents: number;
  subtotalCents: number;
}

export interface OrderTimeline {
  status: string;
  timestamp: string;
  actor?: string;
}

export interface OrderDetail {
  orderId: string;
  orderCode: string;
  status: OrderStatus;
  totalCents: number;
  shippingCents: number;
  items: OrderItem[];
  timeline: OrderTimeline[];
  shippingAddress?: {
    recipientName: string;
    street: string;
    city: string;
    department: string;
    province: string;
  };
  paymentMethod?: string;
  trackingNumber?: string;
  courierName?: string;
  createdAt: string;
}

// --- Traceability Types ---

export interface LotPublicProfile {
  lotCode: string;
  sku: string;
  productName?: string;
  variety?: string;
  origin?: string;
  altitude?: string;
  roastDate: string;
  expiryDate: string;
  roastProfile?: string;
  sensorNotes?: string;
  processType: string;
  producedBy?: string;
  traceabilityUrl?: string;
}

/**
 * Cart API call — supports both authenticated and guest carts.
 * For guests, uses x-cart-id header from localStorage.
 * For authenticated users, uses Bearer token (cart linked to userId).
 */
async function fetchCartApi<T>(path: string, options?: RequestInit): Promise<T> {
  const token = await getIdToken().catch(() => null);
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  } else {
    const cartId = typeof window !== 'undefined' ? localStorage.getItem('armache_cart_id') : null;
    if (cartId) {
      headers['x-cart-id'] = cartId;
    }
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { ...headers, ...options?.headers },
    cache: 'no-store',
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`API error: ${res.status} ${res.statusText} ${body}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  // --- Public Storefront ---
  getTheme: () => fetchApi<Theme>('/storefront/theme').then((r) => (r as unknown as { theme: Theme }).theme),
  getFeaturedProducts: (limit = 6) => fetchApi<{ products: ProductSummary[] }>(`/storefront/products/featured?limit=${limit}`).then((r) => r.products),
  getCategories: () => fetchApi<{ level1: Category[]; children: Record<string, Category[]> }>('/storefront/categories'),
  getProducts: (params?: { category?: string; limit?: number; cursor?: string }) => {
    const qs = new URLSearchParams();
    if (params?.category) qs.set('category', params.category);
    if (params?.limit) qs.set('limit', String(params.limit));
    if (params?.cursor) qs.set('cursor', params.cursor);
    return fetchApi<{ items: ProductSummary[]; nextCursor?: string }>(`/storefront/products?${qs}`);
  },
  getProductBySlug: (slug: string) =>
    fetchApi<{
      product: Omit<ProductDetail, 'images'> & { images?: ProductImage[] };
      variants: ProductDetail['variants'];
      images?: ProductImage[];
    }>(`/storefront/products/${encodeURIComponent(slug)}`).then((response) => ({
      product: {
        ...response.product,
        images: [...(response.product.images ?? response.images ?? [])].sort(
          (left, right) => left.sortOrder - right.sortOrder || left.imageId.localeCompare(right.imageId),
        ),
      },
      variants: response.variants,
    })),

  // --- Public Traceability ---
  getLotProfile: (code: string) => fetchApi<LotPublicProfile>(`/traceability/lots/${encodeURIComponent(code)}`),

  // --- Cart (auth or guest) ---
  getCart: () => fetchCartApi<{ cart: Cart }>('/cart').then((r) => r.cart),
  addCartItem: (sku: string, quantity: number) =>
    fetchCartApi<{ cart: Cart }>('/cart/items', {
      method: 'POST',
      body: JSON.stringify({ sku, quantity }),
    }).then((r) => r.cart),
  updateCartItem: (itemId: string, quantity: number) =>
    fetchCartApi<{ cart: Cart }>('/cart/items', {
      method: 'PUT',
      body: JSON.stringify({ itemId, quantity }),
    }).then((r) => r.cart),
  removeCartItem: (itemId: string) =>
    fetchCartApi<{ cart: Cart }>('/cart/items', {
      method: 'DELETE',
      body: JSON.stringify({ itemId }),
    }).then((r) => r.cart),
  mergeCart: (guestCartId: string) =>
    fetchAuthApi<{ cart: Cart }>('/cart/merge', {
      method: 'POST',
      body: JSON.stringify({ guestCartId }),
    }).then((r) => r.cart),
  calculateShipping: (department: string, province: string, district?: string) =>
    fetchCartApi<{ quotes: ShippingQuote[] }>('/cart/shipping', {
      method: 'POST',
      body: JSON.stringify({ department, province, district }),
    }).then((r) => r.quotes),

  // --- Checkout (auth or guest with session) ---
  prepareCheckout: (input: PrepareCheckoutInput) =>
    fetchCartApi<{ session: CheckoutSession }>('/checkout/prepare', {
      method: 'POST',
      body: JSON.stringify(input),
    }).then((r) => r.session),
  finalizeCheckout: (sessionId: string, paymentReference: string) =>
    fetchCartApi<{ status: string; orderId?: string; orderCode?: string }>('/checkout/finalize', {
      method: 'POST',
      body: JSON.stringify({ sessionId, paymentReference }),
    }),

  // --- Payment ---
  initiatePayment: (input: InitiatePaymentInput) =>
    fetchCartApi<PaymentResult>('/payments/initiate', {
      method: 'POST',
      body: JSON.stringify(input),
    }),

  // --- Authenticated Account ---
  getProfile: () => fetchAuthApi<{ profile: UserProfile }>('/me/profile').then((r) => r.profile),
  updateProfile: (data: UpdateProfileInput) =>
    fetchAuthApi<{ profile: UserProfile }>('/me/profile', {
      method: 'PATCH',
      body: JSON.stringify(data),
    }).then((r) => r.profile),
  getAddresses: () => fetchAuthApi<{ addresses: UserAddress[] }>('/me/addresses').then((r) => r.addresses),
  createAddress: (data: CreateAddressInput) =>
    fetchAuthApi<{ address: UserAddress }>('/me/addresses', {
      method: 'POST',
      body: JSON.stringify(data),
    }).then((r) => r.address),
  deleteAddress: (addressId: string) =>
    fetchAuthApi<void>(`/me/addresses/${addressId}`, { method: 'DELETE' }),

  // --- Orders (authenticated) ---
  getMyOrders: (pageSize = 20, cursor?: string) => {
    const qs = new URLSearchParams({ pageSize: String(pageSize) });
    if (cursor) qs.set('cursor', cursor);
    return fetchAuthApi<{ items: OrderSummary[]; nextCursor?: string }>(`/me/orders?${qs}`);
  },
  getOrderById: (orderId: string) =>
    fetchAuthApi<{ order: OrderDetail }>(`/me/orders/${orderId}`).then((r) => r.order),

  // --- Data Rights (DATA-02) ---
  exportMyData: () => fetchAuthApi<Record<string, unknown>>('/me/data-export'),
  requestAccountDeletion: () =>
    fetchAuthApi<{ requestId: string }>('/me/deletion-request', { method: 'POST' }),
};
