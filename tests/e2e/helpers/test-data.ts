/**
 * Mock data constants for E2E tests.
 * Used with page.route() to simulate API responses without a real backend.
 */

export const TEST_USER = {
  sub: 'user-123-abc',
  email: 'test@armachecafe.com',
  givenName: 'Juan',
  familyName: 'Pérez',
  phoneNumber: '+51999888777',
};

export const TEST_CREDENTIALS = {
  email: 'test@armachecafe.com',
  password: 'Test1234!',
};

export const MOCK_THEME = {
  theme: {
    primaryColor: '#6B4226',
    secondaryColor: '#8B5E3C',
    accentColor: '#D4A574',
    logoUrl: '/logo.png',
    storeTitle: 'Armache Café',
    storeSubtitle: 'Café de Especialidad',
    socialLinks: { instagram: 'https://instagram.com/armachecafe' },
  },
};

export const MOCK_CATEGORIES = {
  level1: [
    { categoryId: 'nuestro-cafe', name: 'Nuestro Café', slug: 'nuestro-cafe' },
    { categoryId: 'derivados', name: 'Derivados', slug: 'derivados' },
    { categoryId: 'metodos', name: 'Métodos', slug: 'metodos' },
  ],
  children: {},
};

export const MOCK_PRODUCTS = {
  items: [
    {
      productId: 'prod-001',
      slug: 'cafe-san-ignacio-250g',
      name: 'Café San Ignacio 250g',
      shortDescription: 'Tostado medio, notas de chocolate y cítricos',
      thumbnailUrl: '/products/cafe-san-ignacio.jpg',
      categoryId: 'nuestro-cafe',
      priceCents: 4500,
      inStock: true,
      featured: true,
      coffeeAttributes: { origin: 'San Ignacio', process: 'Lavado', roastLevel: 'Medio' },
    },
    {
      productId: 'prod-002',
      slug: 'cacao-nibs-100g',
      name: 'Nibs de Cacao 100g',
      shortDescription: 'Cacao puro tostado en nibs',
      thumbnailUrl: '/products/cacao-nibs.jpg',
      categoryId: 'derivados',
      priceCents: 2800,
      inStock: true,
      featured: true,
    },
  ],
  nextCursor: undefined,
};

export const MOCK_PRODUCT_DETAIL = {
  product: {
    productId: 'prod-001',
    slug: 'cafe-san-ignacio-250g',
    name: 'Café San Ignacio 250g',
    description: 'Café de especialidad de San Ignacio, Cajamarca. Tostado artesanal.',
    images: [{ url: '/products/cafe-san-ignacio.jpg', thumbnailUrl: '/products/cafe-san-ignacio-thumb.jpg', mediumUrl: '/products/cafe-san-ignacio-med.jpg', isPrimary: true }],
    variants: [
      { variantId: 'v1', name: '250g Grano', priceCents: 4500, inStock: true },
      { variantId: 'v2', name: '250g Molido', priceCents: 4500, inStock: true },
    ],
    coffeeAttributes: {
      species: 'Arábica',
      origin: 'San Ignacio, Cajamarca',
      altitude: 1800,
      process: 'Lavado',
      variety: 'Caturra',
      roastLevel: 'Medio',
      flavorNotes: ['Chocolate', 'Cítricos', 'Caramelo'],
    },
  },
  variants: [
    { variantId: 'v1', name: '250g Grano', priceCents: 4500, inStock: true },
    { variantId: 'v2', name: '250g Molido', priceCents: 4500, inStock: true },
  ],
};

export const MOCK_CART = {
  cart: {
    cartId: 'cart-001',
    items: [
      {
        itemId: 'item-001',
        sku: 'CAF-SI-250-G',
        name: 'Café San Ignacio 250g',
        variantName: 'Grano',
        thumbnailUrl: '/products/cafe-san-ignacio-thumb.jpg',
        priceCents: 4500,
        quantity: 2,
        subtotalCents: 9000,
      },
    ],
    itemCount: 2,
    subtotalCents: 9000,
  },
};

export const MOCK_EMPTY_CART = {
  cart: { cartId: 'cart-empty', items: [], itemCount: 0, subtotalCents: 0 },
};

export const MOCK_SHIPPING_QUOTES = {
  quotes: [
    { method: 'standard', label: 'Envío estándar', costCents: 1500, estimatedDays: 5 },
    { method: 'express', label: 'Envío express', costCents: 3000, estimatedDays: 2 },
  ],
};

export const MOCK_CHECKOUT_SESSION = {
  session: {
    sessionId: 'session-001',
    status: 'PENDING',
    totalCents: 10500,
    shippingCents: 1500,
    items: MOCK_CART.cart.items,
  },
};

export const MOCK_PROFILE = {
  profile: {
    userId: 'user-123-abc',
    email: 'test@armachecafe.com',
    givenName: 'Juan',
    familyName: 'Pérez',
    phoneNumber: '+51999888777',
    status: 'ACTIVE' as const,
    createdAt: '2026-05-01T00:00:00Z',
  },
};

export const MOCK_ADDRESSES = {
  addresses: [
    {
      addressId: 'addr-001',
      userId: 'user-123-abc',
      label: 'Casa',
      recipientName: 'Juan Pérez',
      street: 'Av. Javier Prado 1234',
      district: 'San Isidro',
      city: 'Lima',
      department: 'Lima',
      province: 'Lima',
      isDefault: true,
      createdAt: '2026-05-01T00:00:00Z',
      updatedAt: '2026-05-01T00:00:00Z',
    },
  ],
};

export const MOCK_ORDERS = {
  items: [
    {
      orderId: 'order-001',
      orderCode: 'ARM-2026-001',
      status: 'CONFIRMED' as const,
      totalCents: 10500,
      itemCount: 2,
      createdAt: '2026-06-01T10:00:00Z',
    },
  ],
  nextCursor: undefined,
};

export const MOCK_LOT_PROFILE = {
  lotCode: 'LOT-2026-001',
  sku: 'CAF-SI-250-G',
  productName: 'Café San Ignacio 250g',
  variety: 'Caturra',
  origin: 'San Ignacio, Cajamarca',
  altitude: '1800 m.s.n.m.',
  roastDate: '2026-05-15',
  expiryDate: '2026-11-15',
  roastProfile: 'Medio',
  processType: 'Lavado',
  producedBy: 'Armache Café',
};
