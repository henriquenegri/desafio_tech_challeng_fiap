"use client";

import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";

export function DashboardHeader({ onCreate }: { onCreate: () => void }) {
  const t = useTranslations("dashboard");

  return (
    <div className="mb-12 hidden items-end justify-between md:flex xl:mb-14">
      <div>
        <h2 className="text-foreground mb-2 text-3xl font-bold transition-colors duration-300 xl:text-4xl">
          {t("overview")}
        </h2>
        <p className="text-muted text-sm transition-colors duration-300 md:text-base">
          {t("welcomeSubtitle")}
        </p>
      </div>

      <button
        onClick={onCreate}
        className="bg-brand hover:bg-brand-hover text-background flex items-center gap-2 rounded-xl px-6 py-3 font-semibold shadow-lg transition-colors"
      >
        <Plus className="h-5 w-5" />
        {t("newTransaction")}
      </button>
    </div>
  );
}
