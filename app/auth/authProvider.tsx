"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import { useRouter } from "@/i18n/navigation";

type AuthContextData = {
  handleLogin: (email: string, password: string) => boolean;
  handleLogout: () => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextData | null>(null);

function hasAuthCookie() {
  if (typeof document === "undefined") return false;
  return document.cookie
    .split("; ")
    .some((c) => c.startsWith("auth_token=") && c.split("=")[1]);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(hasAuthCookie);

  const handleLogout = useCallback(() => {
    document.cookie =
      "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    setIsAuthenticated(false);
    router.push("/");
  }, [router]);

  const handleLogin = useCallback(
    (email: string, password: string) => {
      if (email === "admin@vault.com" && password === "admin123") {
        document.cookie = `auth_token=true; path=/; max-age=${60 * 60 * 24}`;
        setIsAuthenticated(true);
        router.push("/dashboard");
        return true;
      }
      return false;
    },
    [router],
  );

  const value = useMemo(
    () => ({ handleLogin, handleLogout, isAuthenticated }),
    [handleLogin, handleLogout, isAuthenticated],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
