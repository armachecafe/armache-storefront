'use client';

/**
 * Authentication Context — provides auth state and methods to all components.
 *
 * Wraps the Amplify v6 auth library and exposes:
 * - user (attributes)
 * - isAuthenticated
 * - isLoading
 * - login, register, confirmCode, logout, refreshUser
 * - changePassword, changeEmail, confirmEmailChange
 */

import '@/lib/amplify-config'; // Configure Amplify before any auth call

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import {
  signIn,
  signUp,
  signOut,
  confirmSignUp,
  getCurrentUser,
  getIdToken,
  changePassword as authChangePassword,
  changeEmail as authChangeEmail,
  confirmEmailChange as authConfirmEmailChange,
  type SignUpParams,
  type CognitoUserAttributes,
  type AuthError,
} from '@/lib/auth';

interface AuthState {
  user: CognitoUserAttributes | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (params: SignUpParams) => Promise<{ userConfirmed: boolean }>;
  confirmCode: (email: string, code: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  getToken: () => Promise<string | null>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
  changeEmail: (newEmail: string) => Promise<void>;
  confirmEmailChange: (code: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  const refreshUser = useCallback(async () => {
    try {
      const user = await getCurrentUser();
      setState({
        user,
        isAuthenticated: user !== null,
        isLoading: false,
      });
    } catch {
      setState({ user: null, isAuthenticated: false, isLoading: false });
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = useCallback(async (email: string, password: string) => {
    await signIn(email, password);
    const user = await getCurrentUser();
    setState({ user, isAuthenticated: user !== null, isLoading: false });
  }, []);

  const register = useCallback(async (params: SignUpParams) => {
    const result = await signUp(params);
    return { userConfirmed: result.userConfirmed };
  }, []);

  const confirmCode = useCallback(async (email: string, code: string) => {
    await confirmSignUp(email, code);
  }, []);

  const logout = useCallback(async () => {
    await signOut();
    setState({ user: null, isAuthenticated: false, isLoading: false });
  }, []);

  const getToken = useCallback(async () => {
    return getIdToken();
  }, []);

  const handleChangePassword = useCallback(async (oldPassword: string, newPassword: string) => {
    await authChangePassword(oldPassword, newPassword);
  }, []);

  const handleChangeEmail = useCallback(async (newEmail: string) => {
    await authChangeEmail(newEmail);
  }, []);

  const handleConfirmEmailChange = useCallback(async (code: string) => {
    await authConfirmEmailChange(code);
    // Refresh user to pick up new email
    await refreshUser();
  }, [refreshUser]);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        confirmCode,
        logout,
        refreshUser,
        getToken,
        changePassword: handleChangePassword,
        changeEmail: handleChangeEmail,
        confirmEmailChange: handleConfirmEmailChange,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export type { AuthError };
