/**
 * Cognito Authentication Library — Storefront (Customers Pool)
 *
 * Uses AWS Amplify Auth v6 (modular imports for tree-shaking).
 *
 * Provides:
 * - Sign up (with Ley 29733 consent)
 * - Confirm sign up (verification code)
 * - Resend confirmation code
 * - Sign in / Sign out
 * - Get current session / id token
 * - Get current authenticated user attributes
 * - Forgot password / Reset password
 * - Change password (authenticated)
 * - Change email (with verification)
 */

import {
  signIn as amplifySignIn,
  signUp as amplifySignUp,
  signOut as amplifySignOut,
  confirmSignUp as amplifyConfirmSignUp,
  resendSignUpCode,
  resetPassword,
  confirmResetPassword,
  updatePassword,
  fetchAuthSession,
  fetchUserAttributes,
  getCurrentUser as amplifyGetCurrentUser,
  updateUserAttributes,
  confirmUserAttribute,
} from 'aws-amplify/auth';

// --- Error Types ---

export type AuthErrorCode =
  | 'UserNotConfirmedException'
  | 'NotAuthorizedException'
  | 'UsernameExistsException'
  | 'CodeMismatchException'
  | 'ExpiredCodeException'
  | 'LimitExceededException'
  | 'InvalidPasswordException'
  | 'UserNotFoundException'
  | 'AliasExistsException'
  | 'InvalidParameterException'
  | 'Unknown';

export interface AuthError {
  code: AuthErrorCode;
  message: string;
}

function toAuthError(err: unknown): AuthError {
  if (err && typeof err === 'object' && 'name' in err) {
    const e = err as { name: string; message?: string };
    const knownCodes: AuthErrorCode[] = [
      'UserNotConfirmedException',
      'NotAuthorizedException',
      'UsernameExistsException',
      'CodeMismatchException',
      'ExpiredCodeException',
      'LimitExceededException',
      'InvalidPasswordException',
      'UserNotFoundException',
      'AliasExistsException',
      'InvalidParameterException',
    ];
    for (const code of knownCodes) {
      if (e.name === code) return { code, message: e.message ?? code };
    }
  }
  const message = err instanceof Error ? err.message : 'Error desconocido';
  return { code: 'Unknown', message };
}

// --- Sign Up ---

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

export async function signUp(params: SignUpParams): Promise<SignUpResult> {
  const { email, password, givenName, familyName, phoneNumber } = params;

  try {
    const result = await amplifySignUp({
      username: email,
      password,
      options: {
        userAttributes: {
          email,
          given_name: givenName,
          family_name: familyName,
          ...(phoneNumber ? { phone_number: phoneNumber } : {}),
        },
      },
    });

    return {
      userConfirmed: result.isSignUpComplete,
      userSub: result.userId ?? '',
    };
  } catch (err) {
    throw toAuthError(err);
  }
}

// --- Confirm Sign Up ---

export async function confirmSignUp(email: string, code: string): Promise<void> {
  try {
    await amplifyConfirmSignUp({ username: email, confirmationCode: code });
  } catch (err) {
    throw toAuthError(err);
  }
}

// --- Resend Confirmation Code ---

export async function resendConfirmationCode(email: string): Promise<void> {
  try {
    await resendSignUpCode({ username: email });
  } catch (err) {
    throw toAuthError(err);
  }
}

// --- Sign In ---

export async function signIn(email: string, password: string): Promise<void> {
  try {
    await amplifySignIn({ username: email, password });
  } catch (err) {
    throw toAuthError(err);
  }
}

// --- Sign Out ---

export async function signOut(): Promise<void> {
  try {
    await amplifySignOut();
  } catch {
    // Silently handle sign out errors — user is already logged out locally
  }
}

// --- Session / Token ---

export async function getSession(): Promise<{ idToken: string; accessToken: string } | null> {
  try {
    const session = await fetchAuthSession();
    const idToken = session.tokens?.idToken?.toString();
    const accessToken = session.tokens?.accessToken?.toString();
    if (!idToken || !accessToken) return null;
    return { idToken, accessToken };
  } catch {
    return null;
  }
}

export async function getIdToken(): Promise<string | null> {
  const session = await getSession();
  return session?.idToken ?? null;
}

// --- Current User ---

export interface CognitoUserAttributes {
  sub: string;
  email: string;
  givenName?: string;
  familyName?: string;
  phoneNumber?: string;
}

export async function getCurrentUser(): Promise<CognitoUserAttributes | null> {
  try {
    // First check if there's an authenticated user
    await amplifyGetCurrentUser();

    // Fetch user attributes
    const attributes = await fetchUserAttributes();

    return {
      sub: attributes.sub ?? '',
      email: attributes.email ?? '',
      givenName: attributes.given_name,
      familyName: attributes.family_name,
      phoneNumber: attributes.phone_number,
    };
  } catch {
    return null;
  }
}

// --- Forgot Password / Reset Password ---

export interface ForgotPasswordResult {
  codeDeliveryDetails: {
    destination?: string;
    medium?: string;
  };
}

export async function forgotPassword(email: string): Promise<ForgotPasswordResult> {
  try {
    const result = await resetPassword({ username: email });
    return {
      codeDeliveryDetails: {
        destination: result.nextStep.codeDeliveryDetails?.destination,
        medium: result.nextStep.codeDeliveryDetails?.deliveryMedium,
      },
    };
  } catch (err) {
    throw toAuthError(err);
  }
}

export async function confirmForgotPassword(
  email: string,
  code: string,
  newPassword: string,
): Promise<void> {
  try {
    await confirmResetPassword({ username: email, confirmationCode: code, newPassword });
  } catch (err) {
    throw toAuthError(err);
  }
}

// --- Change Password (authenticated) ---

export async function changePassword(oldPassword: string, newPassword: string): Promise<void> {
  try {
    await updatePassword({ oldPassword, newPassword });
  } catch (err) {
    throw toAuthError(err);
  }
}

// --- Change Email (with verification) ---

export async function changeEmail(newEmail: string): Promise<void> {
  try {
    await updateUserAttributes({
      userAttributes: { email: newEmail },
    });
  } catch (err) {
    throw toAuthError(err);
  }
}

export async function confirmEmailChange(code: string): Promise<void> {
  try {
    await confirmUserAttribute({ userAttributeKey: 'email', confirmationCode: code });
  } catch (err) {
    throw toAuthError(err);
  }
}
