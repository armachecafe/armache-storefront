import type { Page } from '@playwright/test';
import {
  MOCK_THEME,
  MOCK_CATEGORIES,
  MOCK_PRODUCTS,
  MOCK_PRODUCT_DETAIL,
  MOCK_CART,
  MOCK_EMPTY_CART,
  MOCK_SHIPPING_QUOTES,
  MOCK_CHECKOUT_SESSION,
  MOCK_PROFILE,
  MOCK_ADDRESSES,
  MOCK_ORDERS,
  MOCK_LOT_PROFILE,
} from './test-data';

const API_BASE = 'https://api.armachecafe.com';

function json(data: unknown, status = 200) {
  return {
    status,
    contentType: 'application/json',
    body: JSON.stringify(data),
  };
}

/** Mock all public storefront APIs (no auth required).
 * `listingOverride` reemplaza la respuesta de GET /storefront/products —
 * usar MOCK_PRODUCTS_RAW para ejercitar la forma cruda real del backend. */
export async function mockPublicApis(page: Page, opts?: { listingOverride?: unknown }) {
  const listing = opts?.listingOverride ?? MOCK_PRODUCTS;
  await page.route(`${API_BASE}/storefront/theme`, (route) => route.fulfill(json(MOCK_THEME)));
  await page.route(`${API_BASE}/storefront/categories`, (route) => route.fulfill(json(MOCK_CATEGORIES)));
  await page.route(`${API_BASE}/storefront/products/featured*`, (route) => route.fulfill(json({ products: MOCK_PRODUCTS.items })));
  await page.route(`${API_BASE}/storefront/products?*`, (route) => route.fulfill(json(listing)));
  await page.route(`${API_BASE}/storefront/products`, (route) => route.fulfill(json(listing)));
  await page.route(`${API_BASE}/storefront/products/cafe-san-ignacio-250g`, (route) => route.fulfill(json(MOCK_PRODUCT_DETAIL)));
  await page.route(`${API_BASE}/storefront/products/*`, (route) => route.fulfill(json(MOCK_PRODUCT_DETAIL)));
}

/** Mock cart APIs (guest mode — empty cart by default) */
export async function mockEmptyCart(page: Page) {
  await page.route(`${API_BASE}/cart`, (route) => {
    if (route.request().method() === 'GET') {
      return route.fulfill(json(MOCK_EMPTY_CART));
    }
    return route.fulfill(json(MOCK_CART));
  });
  await page.route(`${API_BASE}/cart/items`, (route) => route.fulfill(json(MOCK_CART)));
  await page.route(`${API_BASE}/cart/merge`, (route) => route.fulfill(json(MOCK_EMPTY_CART)));
}

/** Mock cart APIs with items */
export async function mockCartWithItems(page: Page) {
  await page.route(`${API_BASE}/cart`, (route) => route.fulfill(json(MOCK_CART)));
  await page.route(`${API_BASE}/cart/items`, (route) => route.fulfill(json(MOCK_CART)));
  await page.route(`${API_BASE}/cart/shipping`, (route) => route.fulfill(json(MOCK_SHIPPING_QUOTES)));
}

/** Mock checkout flow */
export async function mockCheckout(page: Page) {
  await mockCartWithItems(page);
  await page.route(`${API_BASE}/checkout/prepare`, (route) => route.fulfill(json(MOCK_CHECKOUT_SESSION)));
  await page.route(`${API_BASE}/checkout/finalize`, (route) =>
    route.fulfill(json({ status: 'CONFIRMED', orderId: 'order-001', orderCode: 'ARM-2026-001' })),
  );
  await page.route(`${API_BASE}/payments/initiate`, (route) =>
    route.fulfill(json({ transactionId: 'txn-001', status: 'APPROVED', gatewayRef: 'culqi-ref' })),
  );
}

/** Mock authenticated user APIs (/me/*) */
export async function mockAuthenticatedApis(page: Page) {
  await page.route(`${API_BASE}/me/profile`, (route) => {
    if (route.request().method() === 'PATCH') {
      return route.fulfill(json(MOCK_PROFILE));
    }
    return route.fulfill(json(MOCK_PROFILE));
  });
  await page.route(`${API_BASE}/me/addresses`, (route) => route.fulfill(json(MOCK_ADDRESSES)));
  await page.route(`${API_BASE}/me/orders?*`, (route) => route.fulfill(json(MOCK_ORDERS)));
  await page.route(`${API_BASE}/me/orders`, (route) => route.fulfill(json(MOCK_ORDERS)));
}

/** Mock traceability API */
export async function mockTraceability(page: Page) {
  await page.route(`${API_BASE}/traceability/lots/*`, (route) => route.fulfill(json(MOCK_LOT_PROFILE)));
}

/**
 * Mock Amplify/Cognito auth at the network level.
 * Amplify v6 uses the Cognito User Pools API via HTTPS POST to cognito-idp.{region}.amazonaws.com.
 * Tokens returned by InitiateAuth MUST be valid 3-part JWTs that decodeJWT() can parse.
 */
export async function mockCognitoSuccess(page: Page) {
  // Build minimal valid JWTs for the InitiateAuth response (browser-compatible base64)
  const mockIdTokenJwt = buildBrowserJwt({
    sub: 'user-123-abc',
    email: 'test@armachecafe.com',
    given_name: 'Juan',
    family_name: 'Perez',
    'cognito:username': 'test@armachecafe.com',
    token_use: 'id',
    aud: '780qhrdegeu08g7nlb81bqpuvv',
    iss: 'https://cognito-idp.us-east-1.amazonaws.com/us-east-1_jw3PdJZAN',
    auth_time: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 3600,
    iat: Math.floor(Date.now() / 1000),
  });
  const mockAccessTokenJwt = buildBrowserJwt({
    sub: 'user-123-abc',
    client_id: '780qhrdegeu08g7nlb81bqpuvv',
    token_use: 'access',
    scope: 'aws.cognito.signin.user.admin',
    username: 'test@armachecafe.com',
    iss: 'https://cognito-idp.us-east-1.amazonaws.com/us-east-1_jw3PdJZAN',
    auth_time: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 3600,
    iat: Math.floor(Date.now() / 1000),
  });

  await page.route('**/cognito-idp.*.amazonaws.com/**', (route) => {
    const headers = route.request().headers();
    const target = headers['x-amz-target'] || '';

    if (target.includes('InitiateAuth')) {
      return route.fulfill(json({
        AuthenticationResult: {
          IdToken: mockIdTokenJwt,
          AccessToken: mockAccessTokenJwt,
          RefreshToken: 'mock-refresh-token',
          ExpiresIn: 3600,
          TokenType: 'Bearer',
        },
      }));
    }

    if (target.includes('SignUp')) {
      return route.fulfill(json({ UserConfirmed: false, UserSub: 'new-user-sub' }));
    }

    if (target.includes('ConfirmSignUp')) {
      return route.fulfill(json({}));
    }

    if (target.includes('ForgotPassword')) {
      return route.fulfill(json({
        CodeDeliveryDetails: { Destination: 't***@email.com', DeliveryMedium: 'EMAIL' },
      }));
    }

    if (target.includes('ConfirmForgotPassword')) {
      return route.fulfill(json({}));
    }

    if (target.includes('ChangePassword')) {
      return route.fulfill(json({}));
    }

    if (target.includes('GetUser')) {
      return route.fulfill(json({
        Username: 'test@armachecafe.com',
        UserAttributes: [
          { Name: 'sub', Value: 'user-123-abc' },
          { Name: 'email', Value: 'test@armachecafe.com' },
          { Name: 'given_name', Value: 'Juan' },
          { Name: 'family_name', Value: 'Pérez' },
        ],
      }));
    }

    // Default: success (covers UpdateUserAttributes, VerifyUserAttribute, etc.)
    return route.fulfill(json({}));
  });
}

/**
 * Build a minimal 3-part JWT string that Amplify's decodeJWT can parse.
 * Uses Node.js Buffer (runs in Playwright/Node context).
 */
function buildBrowserJwt(payload: Record<string, unknown>): string {
  const header = Buffer.from(JSON.stringify({ alg: 'RS256', kid: 'mock-key' })).toString('base64url');
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = Buffer.from('mock-signature').toString('base64url');
  return `${header}.${body}.${sig}`;
}

/** Mock Cognito returning auth error */
export async function mockCognitoError(page: Page, errorCode: string, message: string) {
  await page.route('**/cognito-idp.*.amazonaws.com/**', (route) => {
    return route.fulfill({
      status: 400,
      contentType: 'application/x-amz-json-1.1',
      body: JSON.stringify({ __type: errorCode, message }),
    });
  });
}
