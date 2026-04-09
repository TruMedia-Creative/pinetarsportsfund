import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { supabase } from "../../../lib/supabase";

interface AuthContextValue {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Restore session from Supabase on mount
    supabase.auth.getSession().then(({ data }) => {
      setIsAuthenticated(!!data.session);
    });

    // Listen for auth state changes (login/logout from any tab)
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  async function login(email: string, password: string): Promise<boolean> {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return false;
    return true;
  }

  async function logout(): Promise<void> {
    await supabase.auth.signOut();
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
