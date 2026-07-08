"use client";

import { Bell, Menu, Moon, Sun, User } from "lucide-react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

import { useTheme } from "@/app/theme/themeProvider";

import { LocaleSwitcher } from "./LocaleSwitcher";

export function HeaderMobile() {
  const t = useTranslations("header");
  const tLayout = useTranslations("layout");
  const { toggleTheme, theme } = useTheme();

  const pathname = usePathname();

  if (pathname === "/") return null;

  return (
    <header className="bg-background sticky top-0 z-20 flex items-center justify-between p-6 transition-colors duration-300 md:hidden">
      <div className="flex items-center gap-4">
        <button
          className="text-foreground hover:text-brand transition-colors"
          aria-label={t("menuAriaLabel")}
        >
          <Menu className="h-6 w-6" />
        </button>
        <span className="text-brand text-xl font-semibold tracking-tight">
          {tLayout("appNameMobile")}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <LocaleSwitcher />
        <button
          onClick={toggleTheme}
          className="text-muted hover:text-foreground transition-colors"
          aria-label={t("toggleThemeAriaLabel")}
        >
          {theme ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        <Bell className="text-muted hover:text-foreground h-5 w-5 cursor-pointer transition-colors" />
        <div className="bg-brand/20 text-brand flex h-8 w-8 items-center justify-center rounded-full">
          <User className="h-4 w-4" />
        </div>
      </div>
    </header>
  );
}
