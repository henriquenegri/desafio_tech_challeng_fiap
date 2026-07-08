"use client";

import {
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useState } from "react";

import { useAuth } from "@/app/auth/authProvider";

export default function LoginPage() {
  const { handleLogin } = useAuth();
  const t = useTranslations("login");
  const tLayout = useTranslations("layout");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const ok = email === "admin@vault.com" && password === "admin123";
    if (!ok) {
      setError(true);
      return;
    }
    setError(false);
    handleLogin(email, password);
  }

  return (
    <main className="bg-background relative flex min-h-screen w-full flex-col overflow-hidden font-sans">
      <div
        className="bg-brand/5 pointer-events-none absolute top-0 left-1/2 h-[400px] w-[600px] -translate-x-1/2 rounded-full blur-[120px]"
        aria-hidden="true"
      />

      <div className="z-10 flex w-full flex-1 flex-col items-center justify-center px-6 py-12">
        <header className="mb-8 flex w-full flex-col items-center justify-center text-center">
          <div className="bg-surface border-outline mb-4 flex h-12 w-12 items-center justify-center rounded-xl border shadow-sm md:hidden">
            <Wallet className="text-brand h-6 w-6" />
          </div>
          <h1 className="text-brand text-2xl font-semibold tracking-tight md:text-3xl">
            <span className="md:hidden">{tLayout("appNameMobile")}</span>
            <span className="hidden md:inline">{tLayout("appName")}</span>
          </h1>
          <p className="text-muted mt-2 text-xs font-medium tracking-widest uppercase md:text-sm">
            {t("financialManagement")}
          </p>
        </header>

        <section className="bg-surface border-outline/30 mx-auto w-full max-w-[420px] rounded-2xl border p-6 shadow-2xl md:p-8">
          <div className="mb-8">
            <h2 className="text-foreground mb-1 text-xl font-semibold md:text-2xl">
              {t("welcomeBack")}
            </h2>
            <p className="text-muted text-sm">{t("accessYourAccount")}</p>
          </div>

          <form className="space-y-5" onSubmit={onSubmit}>
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-foreground text-sm font-medium"
              >
                {t("emailLabel")}
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                  <Mail className="text-muted h-5 w-5" aria-hidden="true" />
                </div>
                <input
                  id="email"
                  value={email}
                  type="email"
                  required
                  className="bg-input border-outline text-foreground placeholder:text-muted/60 focus:ring-brand w-full rounded-lg border py-3 pr-4 pl-11 transition-all focus:border-transparent focus:ring-2 focus:outline-none"
                  placeholder={t("emailPlaceholder")}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-foreground text-sm font-medium"
                >
                  {t("passwordLabel")}
                </label>
                <a
                  href="#"
                  className="text-brand hover:text-brand-hover focus:ring-brand focus:ring-offset-surface rounded-sm text-xs font-medium transition-colors focus:underline focus:ring-2 focus:ring-offset-2 focus:outline-none"
                >
                  {t("forgotPassword")}
                </a>
              </div>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                  <Lock className="text-muted h-5 w-5" aria-hidden="true" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  required
                  className="bg-input border-outline text-foreground placeholder:text-muted/50 focus:ring-brand w-full rounded-lg border py-3 pr-11 pl-11 tracking-widest transition-all focus:border-transparent focus:ring-2 focus:outline-none"
                  placeholder="••••••••"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="text-muted hover:text-foreground absolute inset-y-0 right-0 flex items-center pr-3.5 transition-colors"
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" aria-hidden="true" />
                  ) : (
                    <Eye className="h-5 w-5" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-alert text-sm font-medium" role="alert">
                {t("invalidCredentials")}
              </p>
            )}

            <button
              type="submit"
              className="bg-brand hover:bg-brand-hover focus:ring-brand focus:ring-offset-surface mt-2 flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 font-semibold text-[#121413] transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none"
            >
              <span className="md:hidden">{t("submitMobile")}</span>
              <span className="hidden md:inline">{t("submitDesktop")}</span>
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </form>

          <div className="border-outline/50 mt-8 border-t pt-6 text-center md:hidden">
            <p className="text-muted text-sm">
              {t("noAccount")}{" "}
              <a
                href="#"
                className="text-brand hover:text-brand-hover font-medium focus:underline focus:outline-none"
              >
                {t("createNow")}
              </a>
            </p>
          </div>
        </section>
      </div>

      <footer className="text-muted bg-background/50 z-10 w-full p-6 text-xs font-medium tracking-wider uppercase backdrop-blur-sm">
        <div className="mx-auto flex w-full max-w-[420px] justify-between md:hidden">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            <span className="text-left leading-tight">
              {t("securityBadge")}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <LockKeyhole className="h-4 w-4" aria-hidden="true" />
            <span className="text-left leading-tight">
              {t("encryptionBadge")}
            </span>
          </div>
        </div>

        <div className="hidden items-center justify-center md:flex">
          {t("footer", { year: new Date().getFullYear() })}
        </div>
      </footer>
    </main>
  );
}
