"use client";

import { useLocale } from "next-intl";
import { useTransition } from "react";

import { usePathname, useRouter } from "@/i18n/navigation";

interface Props {
  locales: readonly string[];
  labels: Record<string, string>;
}

export function LocaleSwitcherSelect({ locales, labels }: Props) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  function onChange(newLocale: string) {
    startTransition(() => {
      router.replace(pathname, { locale: newLocale });
    });
  }

  return (
    <select
      value={locale}
      disabled={isPending}
      onChange={(e) => onChange(e.target.value)}
      className="text-muted hover:text-foreground border-outline/50 cursor-pointer rounded-lg border bg-transparent px-2 py-1 text-xs transition-colors"
    >
      {locales.map((locale) => (
        <option key={locale} value={locale}>
          {labels[locale]}
        </option>
      ))}
    </select>
  );
}
