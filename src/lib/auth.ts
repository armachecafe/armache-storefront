/**
 * Cognito Authentication Library — Storefront (Customers Pool)
 *
 * Wraps amazon-cognito-identity-js for:
 * - Sign up (with Ley 29733 consent)
 * - Confirm sign up (verification code)
 * - Sign in
 * - Sign out
 * - Get current session / id token
 * - Get current authenticated user attributes
 */

import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
  CognitoUserAttribute,
  CognitoUserSession,
  ISignUpResult,
} from 'amazon-cognito-identity-js';

const USER_POOL_ID = process.env['NEXT_PUBLIC_COGNITO_USER_POOL_ID'] ?? 'us-east-1_jw3PdJZAN';
const CLIENT_ID = process.env['NEXT_PUBLIC_COGNITO_CLIENT_ID'] ?? '';

const userPool = new CognitoUserPool({
  UserPoolId: USER_POOL_ID,
  ClientId: CLIENT_ID,
});

export type AuthError =
  | { code: 'UserNotConfirmedException'; message: string }
  | { code: 'NotAuthorizedException'; message: string }
  | { code: 'UsernameExistsException'; message: string }
  | { code: 'CodeMismatchException'; message: string }
  | { code: 'ExpiredCodeException'; message: string }
  | { code: 'LimitExceededException'; message: string }
  | { code: 'InvalidPasswordException'; message: string }
  | { code: 'Unknown'; message: string };

function toAuthError(err: unknown): AuthError {
  if (err && typeof err === 'object' && 'code' in err) {
    const e = err as { code: string; message?: string };
    const knownCodes = [
      'UserNotConfirmedException',
      'NotAuthorizedException',
      'UsernameExistsException',
      'CodeMismatchException',
      'ExpiredCodeException',
      'LimitExceededException',
      'InvalidPasswordException',
    ] as const;
    for (const code of knownCodes) {
      if (e.code === code) return { code, message: e.message ?? code };
    }
  }
  const message = err instanceof Error ? err.message : 'Error desconocido';
  return { code: 'Unknown', message };
}

export interface SignUpParams {
  email: string;
  password: string;
  givenName: string;
  familyName: string;
  phoneNumber?: string;
}

export interface SignUpResult {
  userConfirmed: boolean;
  userSub: string;
}

export function signUp(params: SignUpParams): Promise<SignUpResult> {
  const { email, password, givenName, familyName, phoneNumber } = params;

  const attributes: CognitoUserAttribute[] = [
    new CognitoUserAttribute({ Name: 'email', Value: email }),
    new CognitoUserAttribute({ Name: 'given_name', Value: givenName }),
    new CognitoUserAttribute({ Name: 'family_name', Value: familyName }),
  ];

  if (phoneNumber) {
    attributes.push(new CognitoUserAttribute({ Name: 'phone_number', Value: phoneNumber }));
  }

  return new Promise((resolve, reject) => {
    userPool.signUp(email, password, attributes, [], (err, result?: ISignUpResult) => {
      if (err) return reject(toAuthError(err));
      resolve({
        userConfirmed: result?.userConfirmed ?? false,
        userSub: result?.userSub ?? '',
      });
    });
  });
}

export function confirmSignUp(email: string, code: string): Promise<void> {
  const cognitoUser = new CognitoUser({ Username: email, Pool: userPool });

  return new Promise((resolve, reject) => {
    cognitoUser.confirmRegistration(code, true, (err) => {
      if (err) return reject(toAuthError(err));
      resolve();
    });
  });
}

export function resendConfirmationCode(email: string): Promise<void> {
  const cognitoUser = new CognitoUser({ Username: email, Pool: userPool });

  return new Promise((resolve, reject) => {
    cognitoUser.resendConfirmationCode((err) => {
      if (err) return reject(toAuthError(err));
      resolve();
    });
  });
}

export function signIn(email: string, password: string): Promise<CognitoUserSession> {
  const cognitoUser = new CognitoUser({ Username: email, Pool: userPool });
  const authDetails = new AuthenticationDetails({ Username: email, Password: password });

  return new Promise((resolve, reject) => {
    cognitoUser.authenticateUser(authDetails, {
      onSuccess: (session) => resolve(session),
      onFailure: (err) => reject(toAuthError(err)),
    });
  });
}

export function signOut(): void {
  const currentUser = userPool.getCurrentUser();
  if (currentUser) {
    currentUser.signOut();
  }
}

export function getSession(): Promise<CognitoUserSession | null> {
  const currentUser = userPool.getCurrentUser();
  if (!currentUser) return Promise.resolve(null);

  return new Promise((resolve) => {
    currentUser.getSession((err: Error | null, session: CognitoUserSession | null) => {
      if (err || !session || !session.isValid()) {
        resolve(null);
      } else {
        resolve(session);
      }
    });
  });
}

export function getIdToken(): Promise<string | null> {
  return getSession().then((session) => session?.getIdToken().getJwtToken() ?? null);
}

export interface CognitoUserAttributes {
  sub: string;
  email: string;
  givenName?: string;
  familyName?: string;
  phoneNumber?: string;
}

export function getCurrentUser(): Promise<CognitoUserAttributes | null> {
  const currentUser = userPool.getCurrentUser();
  if (!currentUser) return Promise.resolve(null);

  return new Promise((resolve) => {
    currentUser.getSession((err: Error | null, session: CognitoUserSession | null) => {
      if (err || !session || !session.isValid()) {
        resolve(null);
        return;
      }

      currentUser.getUserAttributes((attrErr, attributes) => {
        if (attrErr || !attributes) {
          resolve(null);
          return;
        }

        const attrMap: Record<string, string> = {};
        for (const attr of attributes) {
          attrMap[attr.getName()] = attr.getValue();
        }

        resolve({
          sub: attrMap['sub'] ?? '',
          email: attrMap['email'] ?? '',
          givenName: attrMap['given_name'],
          familyName: attrMap['family_name'],
          phoneNumber: attrMap['phone_number'],
        });
      });
    });
  });
}
