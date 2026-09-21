import type { Page } from '@playwright/test';

/**
 * Amplify v6 stores auth tokens in localStorage using the key format:
 *   CognitoIdentityServiceProvider.{clientId}.LastAuthUser
 *   CognitoIdentityServiceProvider.{clientId}.{username}.accessToken
 *   CognitoIdentityServiceProvider.{clientId}.{username}.idToken
 *   CognitoIdentityServiceProvider.{clientId}.{username}.refreshToken
 *   CognitoIdentityServiceProvider.{clientId}.{username}.clockDrift
 *
 * Amplify v6's DefaultTokenStore.loadTokens() calls decodeJWT() on the
 * accessToken. decodeJWT splits on '.', takes part[1], converts base64url→base64,
 * then decodes. The token MUST be a valid 3-part JWT with a JSON payload.
 *
 * We use Buffer-based base64url encoding (no padding) to produce tokens
 * compatible with Amplify's decodeJWT parser.
 */

const CLIENT_ID = '780qhrdegeu08g7nlb81bqpuvv';
const USER_POOL_ID = 'us-east-1_jw3PdJZAN';
const TEST_USERNAME = 'test@armachecafe.com';

/**
 * Encode a JSON object as a base64url string (no padding).
 * Works in Node.js (Playwright runs in Node).
 */
function base64UrlEncode(obj: Record<string, unknown>): string {
  const json = JSON.stringify(obj);
  const b64 = Buffer.from(json, 'utf-8').toString('base64');
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function createMockIdToken() {
  const header = base64UrlEncode({ alg: 'RS256', kid: 'mock-key' });
  const now = Math.floor(Date.now() / 1000);
  const payload = base64UrlEncode({
    sub: 'user-123-abc',
    email_verified: true,
    iss: `https://cognito-idp.us-east-1.amazonaws.com/${USER_POOL_ID}`,
    'cognito:username': TEST_USERNAME,
    given_name: 'Juan',
    family_name: 'Perez',
    aud: CLIENT_ID,
    token_use: 'id',
    auth_time: now,
    exp: now + 3600,
    iat: now,
    email: TEST_USERNAME,
    phone_number: '+51999888777',
  });
  const signature = base64UrlEncode({ sig: 'mock' });
  return `${header}.${payload}.${signature}`;
}

function createMockAccessToken() {
  const header = base64UrlEncode({ alg: 'RS256', kid: 'mock-key' });
  const now = Math.floor(Date.now() / 1000);
  const payload = base64UrlEncode({
    sub: 'user-123-abc',
    iss: `https://cognito-idp.us-east-1.amazonaws.com/${USER_POOL_ID}`,
    client_id: CLIENT_ID,
    token_use: 'access',
    scope: 'aws.cognito.signin.user.admin',
    auth_time: now,
    exp: now + 3600,
    iat: now,
    username: TEST_USERNAME,
  });
  const signature = base64UrlEncode({ sig: 'mock' });
  return `${header}.${payload}.${signature}`;
}

/**
 * Injects Amplify v6 auth tokens into localStorage so that the AuthContext
 * resolves `isAuthenticated = true` on mount without network calls.
 *
 * Must be called BEFORE navigating to any page that uses `useAuth()`.
 * Also requires mockCognitoSuccess() to handle the GetUser/fetchUserAttributes
 * call that Amplify makes after loading tokens from storage.
 */
export async function injectAuthSession(page: Page) {
  const idToken = createMockIdToken();
  const accessToken = createMockAccessToken();
  const refreshToken = 'mock-refresh-token';
  const clockDrift = '0';
  const lastAuthUser = TEST_USERNAME;

  const prefix = `CognitoIdentityServiceProvider.${CLIENT_ID}`;

  await page.addInitScript(
    ({ prefix, lastAuthUser, idToken, accessToken, refreshToken, clockDrift }) => {
      localStorage.setItem(`${prefix}.LastAuthUser`, lastAuthUser);
      localStorage.setItem(`${prefix}.${lastAuthUser}.accessToken`, accessToken);
      localStorage.setItem(`${prefix}.${lastAuthUser}.idToken`, idToken);
      localStorage.setItem(`${prefix}.${lastAuthUser}.refreshToken`, refreshToken);
      localStorage.setItem(`${prefix}.${lastAuthUser}.clockDrift`, clockDrift);
    },
    { prefix, lastAuthUser, idToken, accessToken, refreshToken, clockDrift },
  );
}

/**
 * Clears the Amplify auth session from localStorage.
 * Use to test unauthenticated/guest flows after a previous `injectAuthSession`.
 */
export async function clearAuthSession(page: Page) {
  const prefix = `CognitoIdentityServiceProvider.${CLIENT_ID}`;

  await page.addInitScript(
    ({ prefix }) => {
      const keys = Object.keys(localStorage).filter((k) => k.startsWith(prefix));
      keys.forEach((k) => localStorage.removeItem(k));
    },
    { prefix },
  );
}
