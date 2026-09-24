/**
 * API client for the storefront.
 * Calls the API Gateway endpoints.
 *
 * CONTRACT-FIRST (integration-contracts SDD):
 * The OpenAPI contract (openapi/storefront.yaml, via @armachecafe/openapi-client) is
 * the SINGLE SOURCE OF TRUTH for backend request/response shapes. This module
 * imports the generated `components['schemas']` types as `Contract*` and maps
 * them to the storefront's UI-facing types in ONE place — the wrappers below.
 *
 * Why a mapping layer instead of renaming across the app: the backend uses
 * different field names than the UI (design.md Option A documents this as
 * x-known-divergence, e.g. backend `subtotal`/`imageUrl`/`addressLine` vs UI
 * `subtotalCents`/`thumbnailUrl`/`street`). Keeping the mapping here means the
 * ~26 UI consumers do not change, and the divergence is isolated to this file
 * (easy to delete once the backend serialization is aligned in a future change).
 */

import { getIdToken } from '@/lib/auth';
import type { components } from '../types/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.armachecafe.com';

// ---------------------------------------------------------------------------
// Contract types (backend truth, generated from openapi/storefront.yaml)
// ---------------------------------------------------------------------------
type ContractSchemas = components['schemas'];

type ContractCart = ContractSchemas['Cart'];
type ContractCartItem = ContractSchemas['CartItem'];
type ContractCheckoutSession = ContractSchemas['CheckoutSession'];
type ContractShippingQuote = ContractSchemas['ShippingQuote'];
type ContractPaymentResult = ContractSchemas['PaymentResult'];

// Types that already match the UI shape are re-exported directly from the
// contract (no mapping needed).
export type ProductImage = ContractSchemas['Image'];
type ContractProductSummary = ContractSchemas['ProductSummary'];
//
// UI-facing ProductSummary. El backend /storefront/products hoy devuelve
// registros crudos Dynamo (PK/SK/GSI, primaryImageId, sin thumbnailUrl)
// mientras /storefront/products/featured sí devuelve thumbnailUrl.
// Se mantiene la forma UI histórica (thumbnailUrl?) y se mapea abajo.
export type ProductSummary = Omit<ContractProductSummary, 'thumbnailUrl'> & {
  thumbnailUrl?: string;
};
export type Category = ContractSchemas['Category'];
export type Theme = ContractSchemas['Theme'];
export type UserProfile = ContractSchemas['UserProfile'];
export type UserAddress = ContractSchemas['UserAddress'];
export type OrderSummary = ContractSchemas['OrderSummary'];
export type OrderItem = ContractSchemas['OrderItem'];
export type OrderTimeline = ContractSchemas['OrderTimelineEvent'];
export type OrderStatus = ContractSchemas['OrderStatus'];
export type LotPublicProfile = ContractSchemas['LotPublicProfile'];

type ContractProductDetail = ContractSchemas['ProductDetail'];
type ContractVariant = ContractSchemas['Variant'];
type ContractUpdateProfileInput = ContractSchemas['UpdateProfileInput'];
type ContractOrderDetail = ContractSchemas['OrderDetail'];

// ---------------------------------------------------------------------------
// UI-facing types (unchanged names the 26 consumers already use).
// Kept where the backend field names diverge from the UI's (Option A).
// ---------------------------------------------------------------------------

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

export interface ShippingQuote {
  method: string;
  label: string;
  costCents: number;
  estimatedDays?: number;
  pickupLocationId?: string;
  pickupAddress?: string;
}

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

// ProductDetail: UI shape keeps `images` embedded and re-uses the contract's
// nested types. The wrapper merges the contract's top-level `images` back in.
export type Variant = ContractVariant;
export interface ProductDetail extends Omit<ContractProductDetail, never> {
  images: ProductImage[];
  variants: Variant[];
}

// UpdateProfileInput matches the contract (all fields optional).
export type UpdateProfileInput = ContractUpdateProfileInput;

// CreateAddressInput: UI adds an `isDefault` flag not present in the contract
// request body (the backend derives default separately). Kept UI-facing.
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

// OrderDetail: UI shape adds optional `paymentMethod` (not in the contract;
// x-known-divergence). All other fields come from the contract aggregate.
export interface OrderDetail extends ContractOrderDetail {
  paymentMethod?: string;
}

// ---------------------------------------------------------------------------
// Mapping layer (backend contract shape -> UI shape). Isolated here.
// ---------------------------------------------------------------------------

function mapCartItem(item: ContractCartItem): CartItem {
  return {
    itemId: item.itemId,
    sku: item.sku,
    name: item.productName,
    // backend has no variantName; leave undefined.
    thumbnailUrl: item.imageUrl ?? undefined,
    priceCents: item.unitPrice,
    quantity: item.quantity,
    subtotalCents: item.lineTotal,
  };
}

function mapCart(cart: ContractCart): Cart {
  return {
    cartId: cart.cartId,
    items: (cart.items ?? []).map(mapCartItem),
    itemCount: cart.itemCount,
    subtotalCents: cart.subtotal,
  };
}

function mapCheckoutSession(session: ContractCheckoutSession): CheckoutSession {
  return {
    sessionId: session.sessionId,
    status: session.status,
    totalCents: session.total,
    shippingCents: session.shippingCost,
    items: (session.items ?? []).map((it) => ({
      itemId: it.sku, // checkout items are keyed by sku; no itemId in contract
      sku: it.sku,
      name: it.productName,
      priceCents: it.unitPrice,
      quantity: it.quantity,
      subtotalCents: it.lineTotal,
    })),
  };
}

function mapShippingQuote(quote: ContractShippingQuote): ShippingQuote {
  const days = quote.estimatedDays ? Number.parseInt(quote.estimatedDays, 10) : undefined;
  return {
    method: quote.type,
    label: quote.zoneName || quote.description,
    costCents: quote.cost ?? 0,
    estimatedDays: Number.isFinite(days) ? days : undefined,
    pickupLocationId: quote.pickupLocationId,
    pickupAddress: quote.pickupLocationName,
  };
}

function mapPaymentResult(result: ContractPaymentResult): PaymentResult {
  // Live flow has no `status`; mock flow does. Normalize to the UI shape.
  const status = 'status' in result ? result.status : 'INITIATED';
  return {
    transactionId: result.transactionId,
    status,
  };
}

const CATALOG_CDN_BASE = 'https://cdn.armachecafe.com';

/**
 * Normaliza un ProductSummary del backend a la forma UI (thumbnailUrl).
 * Tolera: thumbnailUrl (featured + mocks), imageUrl (x-known-divergence),
 * y registros crudos de /storefront/products (primaryImageId + productId).
 */
function mapProductSummary(raw: ContractProductSummary & Record<string, unknown>): ProductSummary {
  const record = raw as Record<string, unknown>;
  const direct =
    (record['thumbnailUrl'] as string | undefined) ??
    (record['imageUrl'] as string | undefined) ??
    (record['thumbnail'] as string | undefined) ??
    undefined;
  const productId = record['productId'] as string | undefined;
  const primaryImageId = record['primaryImageId'] as string | undefined;
  const thumbnailUrl =
    direct ??
    (productId && primaryImageId
      ? `${CATALOG_CDN_BASE}/catalog/products/${productId}/${primaryImageId}`
      : undefined);
  return { ...(raw as object), thumbnailUrl } as ProductSummary;
}

/** Maps the UI PrepareCheckoutInput to the backend contract body. */
function mapPrepareCheckoutBody(input: PrepareCheckoutInput): unknown {
  const isPickup = input.shippingMethod === 'PICKUP' || input.shippingMethod === 'pickup';
  return {
    shippingAddress: {
      department: input.shippingAddress.department,
      province: input.shippingAddress.province,
      district: input.shippingAddress.district ?? '',
      addressLine: input.shippingAddress.street,
    },
    contact: {
      fullName: input.shippingAddress.recipientName || input.contact.name,
      email: input.contact.email,
      phone: input.contact.phoneNumber ?? input.shippingAddress.phoneNumber ?? '',
    },
    shippingMethod: isPickup
      ? { type: 'PICKUP', pickupLocationId: input.shippingMethod }
      : { type: 'DELIVERY', zoneId: input.shippingMethod },
  };
}

// ---------------------------------------------------------------------------
// Fetch helpers
// ---------------------------------------------------------------------------

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
  getTheme: () =>
    fetchApi<{ theme: Theme }>('/storefront/theme').then((r) => r.theme),
  getFeaturedProducts: (limit = 6) =>
    fetchApi<{ products: ProductSummary[] }>(`/storefront/products/featured?limit=${limit}`).then((r) =>
      (r.products ?? []).map(mapProductSummary),
    ),
  getCategories: () =>
    fetchApi<{ level1: Category[]; children: Record<string, Category[]> }>('/storefront/categories'),
  getProducts: (params?: { category?: string; limit?: number; cursor?: string }) => {
    const qs = new URLSearchParams();
    if (params?.category) qs.set('category', params.category);
    if (params?.limit) qs.set('limit', String(params.limit));
    if (params?.cursor) qs.set('cursor', params.cursor);
    return fetchApi<{ items: ProductSummary[]; nextCursor?: string }>(`/storefront/products?${qs}`).then((r) => ({
      items: (r.items ?? []).map(mapProductSummary),
      nextCursor: r.nextCursor,
    }));
  },
  getProductBySlug: (slug: string) =>
    fetchApi<{
      product: ContractProductDetail;
      variants: Variant[];
      images: ProductImage[];
    }>(`/storefront/products/${encodeURIComponent(slug)}`).then((response) => {
      const images = [...(response.images ?? [])].sort(
        (left, right) => left.sortOrder - right.sortOrder || left.imageId.localeCompare(right.imageId),
      );
      const product: ProductDetail = { ...response.product, images, variants: response.variants };
      return { product, variants: response.variants, images };
    }),

  // --- Public Traceability ---
  getLotProfile: (code: string) =>
    fetchApi<LotPublicProfile>(`/traceability/lots/${encodeURIComponent(code)}`),

  // --- Cart (auth or guest) ---
  getCart: () => fetchCartApi<{ cart: ContractCart }>('/cart').then((r) => mapCart(r.cart)),
  addCartItem: (sku: string, quantity: number) =>
    fetchCartApi<{ cart: ContractCart }>('/cart/items', {
      method: 'POST',
      body: JSON.stringify({ sku, quantity }),
    }).then((r) => mapCart(r.cart)),
  updateCartItem: (itemId: string, quantity: number) =>
    fetchCartApi<{ cart: ContractCart }>('/cart/items', {
      method: 'PUT',
      body: JSON.stringify({ itemId, quantity }),
    }).then((r) => mapCart(r.cart)),
  removeCartItem: (itemId: string) =>
    fetchCartApi<{ cart: ContractCart }>('/cart/items', {
      method: 'DELETE',
      body: JSON.stringify({ itemId }),
    }).then((r) => mapCart(r.cart)),
  mergeCart: (guestCartId: string) =>
    fetchAuthApi<{ cart: ContractCart }>('/cart/merge', {
      method: 'POST',
      body: JSON.stringify({ guestCartId }),
    }).then((r) => mapCart(r.cart)),
  calculateShipping: (department: string, province: string, district?: string) =>
    fetchCartApi<{ quotes: ContractShippingQuote[] }>('/cart/shipping', {
      method: 'POST',
      body: JSON.stringify({ department, province, district }),
    }).then((r) => r.quotes.map(mapShippingQuote)),

  // --- Checkout (auth or guest with session) ---
  prepareCheckout: (input: PrepareCheckoutInput) =>
    fetchCartApi<{ session: ContractCheckoutSession }>('/checkout/prepare', {
      method: 'POST',
      body: JSON.stringify(mapPrepareCheckoutBody(input)),
    }).then((r) => mapCheckoutSession(r.session)),
  finalizeCheckout: (sessionId: string, paymentReference: string) =>
    fetchCartApi<{ sessionId: string; status: string; orderId?: string | null }>('/checkout/finalize', {
      method: 'POST',
      body: JSON.stringify({ sessionId, paymentReference }),
    }).then((r) => ({ status: r.status, orderId: r.orderId ?? undefined, orderCode: undefined as string | undefined })),

  // --- Payment ---
  initiatePayment: (input: InitiatePaymentInput) =>
    fetchCartApi<ContractPaymentResult>('/payments/initiate', {
      method: 'POST',
      body: JSON.stringify(input),
    }).then(mapPaymentResult),

  // --- Authenticated Account ---
  getProfile: () => fetchAuthApi<{ profile: UserProfile }>('/me/profile').then((r) => r.profile),
  updateProfile: (data: UpdateProfileInput) =>
    fetchAuthApi<{ profile: UserProfile }>('/me/profile', {
      method: 'PATCH',
      body: JSON.stringify(data),
    }).then((r) => r.profile),
  getAddresses: () => fetchAuthApi<{ addresses: UserAddress[] }>('/me/addresses').then((r) => r.addresses),
  createAddress: (data: CreateAddressInput) => {
    // The contract request body has no `isDefault`; strip it before sending.
    const { isDefault: _isDefault, ...body } = data;
    return fetchAuthApi<{ address: UserAddress }>('/me/addresses', {
      method: 'POST',
      body: JSON.stringify(body),
    }).then((r) => r.address);
  },
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
