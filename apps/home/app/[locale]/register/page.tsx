"use client";

import { useAuth } from "@vault/ui";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  Wallet,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import React, { useState } from "react";

export default function RegisterPage() {
  const { handleLogin } = useAuth();
  const locale = useLocale();
  const tLayout = useTranslations("layout");

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "Erro ao criar conta");
        setIsLoading(false);
        return;
      }

      // Automatically login after successful registration
      const success = await handleLogin(email, password);
      if (!success) {
        setError("Conta criada, mas falha ao fazer login automático");
        setIsLoading(false);
      }
    } catch (err) {
      console.error(err);
      setError("Erro interno ao criar conta");
      setIsLoading(false);
    }
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
        </header>

        <section className="bg-surface border-outline/30 mx-auto w-full max-w-[420px] rounded-2xl border p-6 shadow-2xl md:p-8">
          <div className="mb-8">
            <h2 className="text-foreground mb-1 text-xl font-semibold md:text-2xl">
              Criar Conta
            </h2>
            <p className="text-muted text-sm">
              Preencha seus dados para começar
            </p>
          </div>

          <form className="space-y-5" onSubmit={onSubmit}>
            <div className="space-y-2">
              <label
                htmlFor="username"
                className="text-foreground text-sm font-medium"
              >
                Nome de Usuário
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                  <User className="text-muted h-5 w-5" aria-hidden="true" />
                </div>
                <input
                  id="username"
                  value={username}
                  type="text"
                  required
                  className="bg-input border-outline text-foreground placeholder:text-muted/60 focus:ring-brand w-full rounded-lg border py-3 pr-4 pl-11 transition-all focus:border-transparent focus:ring-2 focus:outline-none"
                  placeholder="Seu nome"
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-foreground text-sm font-medium"
              >
                E-mail
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
                  placeholder="seu@email.com"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-foreground text-sm font-medium"
              >
                Senha
              </label>
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
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="bg-brand hover:bg-brand-hover focus:ring-brand focus:ring-offset-surface mt-2 flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 font-semibold text-[#121413] transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:opacity-50"
            >
              <span>{isLoading ? "Criando..." : "Criar Conta"}</span>
              {!isLoading && (
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </form>

          <div className="border-outline/50 mt-8 border-t pt-6 text-center">
            <p className="text-muted text-sm">
              Já tem uma conta?{" "}
              <a
                href={`/${locale}`}
                className="text-brand hover:text-brand-hover font-medium focus:underline focus:outline-none"
              >
                Fazer Login
              </a>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
