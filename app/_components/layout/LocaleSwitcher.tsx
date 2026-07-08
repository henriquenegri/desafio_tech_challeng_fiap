import { useTranslations } from "next-intl";

import { routing } from "@/i18n/routing";

import { LocaleSwitcherSelect } from "./LocaleSwitcherSelect";

export function LocaleSwitcher() {
  const t = useTranslations("localeSwitcher");

  const labels: Record<string, string> = {
    "pt-BR": t("ptBR"),
    en: t("en"),
  };

  return <LocaleSwitcherSelect locales={routing.locales} labels={labels} />;
}
