"use client";

import { Home, LogOut, Moon, Sun, User } from "lucide-react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

// 1. IMPORTANTE: Importe o seu LocaleSwitcher aqui. 
// Ajuste o caminho conforme a sua estrutura de pastas.
import { LocaleSwitcher } from "@/app/_components/layout/LocaleSwitcher"; 
import { useAuth } from "@/app/auth/authProvider";
import { useTheme } from "@/app/theme/themeProvider";

export function Sidebar() {
  // 2. CORREÇÃO: Inicialize as funções de tradução conforme o seu JSON de mensagens
  const t = useTranslations("sidebar"); // Ou o namespace que você definiu
  const tHeader = useTranslations("header"); 

  const { toggleTheme, theme } = useTheme();
  const { handleLogout } = useAuth();
  const pathname = usePathname();

  if (pathname === "/") return null;

  return (
    <aside className="bg-surface border-outline/30 sticky top-0 z-20 hidden h-screen w-70 flex-col border-r p-6 transition-colors duration-300 md:flex">
      <div className="mb-12">
        <h1 className="text-brand text-2xl leading-tight font-bold tracking-wider uppercase">
          The Digital
          <br />
          Vault
        </h1>
      </div>

      <nav className="flex-1 space-y-2">
        <a
          href="#"
          className="bg-brand/10 text-brand flex items-center gap-3 rounded-lg px-4 py-3 font-medium transition-colors"
        >
          <Home className="h-5 w-5" />
          {t("home")}
        </a>
        <button
          onClick={handleLogout}
          className="text-muted hover:text-foreground flex w-full items-center gap-3 rounded-lg px-4 py-3 font-medium transition-colors hover:bg-black/5 dark:hover:bg-white/5"
        >
          <LogOut className="h-5 w-5" />
          {t("logout")}
        </button>
      </nav>

      <div className="border-outline/30 mt-auto flex items-center justify-between border-t pt-6">
        <div className="flex items-center gap-3">
          <div className="bg-input border-outline flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border">
            <User className="text-muted h-5 w-5" />
          </div>
          <span className="text-foreground text-sm font-medium">
            {t("myAccount")}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <LocaleSwitcher />
          <button
            onClick={toggleTheme}
            className="text-muted hover:text-foreground rounded-lg p-2 transition-colors hover:bg-black/5 dark:hover:bg-white/5"
            aria-label={tHeader("toggleThemeAriaLabel")}
          >
            {theme ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        </div>
      </div>
    </aside>
  );
}