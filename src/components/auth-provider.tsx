'use client';

import * as React from 'react';

export type UserRole = 'admin' | 'user';
export type AuthUser = { email: string; role: UserRole; name: string };

const CREDENTIALS: Record<string, { password: string; role: UserRole; name: string }> = {
  'admin@fifgroup.co.id': { password: 'admin123', role: 'admin', name: 'Admin FIFGROUP' },
  'viewer@fifgroup.co.id': { password: 'viewer123', role: 'user', name: 'Viewer FIFGROUP' },
};

const AUTH_KEY = 'fifgroup_auth_v1';

function loadSession(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const s = localStorage.getItem(AUTH_KEY);
    if (s) return JSON.parse(s);
  } catch (_) {}
  return null;
}

function saveSession(user: AuthUser) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
}

function clearSession() {
  localStorage.removeItem(AUTH_KEY);
}

type AuthContextType = {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAdmin: boolean;
};

const AuthContext = React.createContext<AuthContextType>({
  user: null,
  login: async () => ({ success: false }),
  logout: () => {},
  isAdmin: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<AuthUser | null>(() => loadSession());

  const login = React.useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const cred = CREDENTIALS[email.toLowerCase().trim()];
    if (!cred) return { success: false, error: 'Email tidak ditemukan.' };
    if (cred.password !== password) return { success: false, error: 'Password salah.' };
    const authUser: AuthUser = { email: email.toLowerCase().trim(), role: cred.role, name: cred.name };
    saveSession(authUser);
    setUser(authUser);
    return { success: true };
  }, []);

  const logout = React.useCallback(() => {
    clearSession();
    setUser(null);
  }, []);

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return React.useContext(AuthContext);
}
