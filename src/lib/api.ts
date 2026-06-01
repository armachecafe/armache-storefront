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
    next: { revalidate: 60 }, // ISR: revalidate every 60s
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
  images: { url: string; thumbnailUrl: string; mediumUrl: string; isPrimary: boolean }[];
  variants: { variantId: string; name: string; priceCents: number; compareAtPriceCents?: number; inStock: boolean }[];
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
  getProductBySlug: (slug: string) => fetchApi<{ product: ProductDetail; variants: ProductDetail['variants'] }>(`/storefront/products/${slug}`),

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
};
