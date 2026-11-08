import React, { createContext, useContext, useEffect, useState } from 'react';
import { getToken, saveToken, removeToken } from './authService';

interface Ctx {
  token: string | null;
  isLoading: boolean;
  signIn: (t: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<Ctx | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const stored = await getToken();
      setToken(stored);
      setIsLoading(false);
    })();
  }, []);

  const signIn = async (t: string) => {
    await saveToken(t);
    setToken(t);
  };

  const signOut = async () => {
    await removeToken();
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth outside AuthProvider');
  return ctx;
};
