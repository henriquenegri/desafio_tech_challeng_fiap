import en from "@vault/shared/messages/en.json";
import ptBR from "@vault/shared/messages/pt-BR.json";
import { routing } from "@vault/shared/routing";
import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";

const messages = { en, "pt-BR": ptBR };

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    messages: messages[locale],
  };
});
