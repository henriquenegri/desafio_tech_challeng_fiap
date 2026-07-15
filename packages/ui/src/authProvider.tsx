"use client";

import { routing } from "@vault/shared/routing";
import { useLocale } from "next-intl";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

type AuthContextData = {
  handleLogin: (email: string, password: string) => Promise<boolean>;
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
  const locale = useLocale();
  const [isAuthenticated, setIsAuthenticated] = useState(hasAuthCookie);

  // Login and dashboard live in different zones (micro-frontends), so
  // navigation between them must be a full page load, not a client-side push.
  const localePrefix = locale === routing.defaultLocale ? "" : `/${locale}`;

  const handleLogout = useCallback(() => {
    document.cookie =
      "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    setIsAuthenticated(false);
    window.location.assign(localePrefix || "/");
  }, [localePrefix]);

  const handleLogin = useCallback(
    async (email: string, password: string) => {
      try {
        const response = await fetch("/api/auth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) return false;

        const data = await response.json();
        if (data.success && data.token) {
          document.cookie = `auth_token=${data.token}; path=/; max-age=${60 * 60 * 24}`;
          setIsAuthenticated(true);
          window.location.assign(`${localePrefix}/dashboard`);
          return true;
        }
      } catch (error) {
        console.error("Login failed", error);
      }
      return false;
    },
    [localePrefix],
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
