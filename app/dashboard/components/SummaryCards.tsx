"use client";
import { ArrowDown, ArrowUp, TrendingUp } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { useMemo } from "react";

import { Transaction } from "@/app/_types/transactionTypes";

interface SummaryCardsProps {
  transactions: Transaction[];
  isLoading: boolean;
}

export function SummaryCards({ transactions, isLoading }: SummaryCardsProps) {
  const t = useTranslations("summaryCards");
  const format = useFormatter();

  const { totalIn, totalOut, currentBalance } = useMemo(() => {
    const entries = transactions
      .filter((tx) => tx.type === "in")
      .reduce((acc, curr) => acc + Number(curr.amount), 0);

    const exits = transactions
      .filter((tx) => tx.type === "out")
      .reduce((acc, curr) => acc + Number(curr.amount), 0);

    return {
      totalIn: entries,
      totalOut: exits,
      currentBalance: entries - exits,
    };
  }, [transactions]);

  function formatCurrency(value: number) {
    return format.number(value, { style: "currency", currency: "BRL" });
  }

  return (
    <div className="mb-10 grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6 xl:mb-12 xl:gap-8">
      <div className="md:bg-surface md:border-outline/30 mb-6 rounded-2xl transition-colors duration-300 md:mb-0 md:border md:p-8 xl:rounded-3xl">
        <h3 className="text-muted mb-2 text-xs font-semibold tracking-widest uppercase md:text-sm">
          <span className="md:hidden">{t("availableBalanceMobile")}</span>
          <span className="hidden md:inline">{t("totalBalanceDesktop")}</span>
        </h3>

        <p className="text-xl font-bold md:text-3xl xl:text-4xl">
          {isLoading ? t("loading") : formatCurrency(currentBalance)}
        </p>

        <div className="text-brand flex items-center gap-1 text-sm font-medium md:hidden">
          <TrendingUp className="h-4 w-4" />
          <span>{t("monthlyGrowth")}</span>
        </div>
      </div>

      <div className="col-span-1 grid grid-cols-2 gap-4 md:col-span-2 md:grid-cols-2 md:gap-6 xl:gap-8">
        <div className="bg-surface border-outline/30 flex min-h-[140px] flex-col justify-between rounded-2xl border p-5 transition-colors duration-300 md:p-7 xl:rounded-3xl xl:p-8">
          <div className="mb-2 flex items-center gap-2 md:mb-4">
            <ArrowDown className="text-brand h-4 w-4 md:hidden" />
            <h3 className="text-muted text-xs font-semibold tracking-widest uppercase md:text-sm">
              {t("incomesThisMonth")}
            </h3>
          </div>

          <p className="text-brand text-xl font-bold md:text-3xl xl:text-4xl">
            {isLoading ? t("loading") : formatCurrency(totalIn)}
          </p>
        </div>

        <div className="bg-surface border-outline/30 flex min-h-[140px] flex-col justify-between rounded-2xl border p-5 transition-colors duration-300 md:p-7 xl:rounded-3xl xl:p-8">
          <div className="mb-2 flex items-center gap-2 md:mb-4">
            <ArrowUp className="text-alert h-4 w-4 md:hidden" />
            <h3 className="text-muted text-xs font-semibold tracking-widest uppercase md:text-sm">
              {t("expensesThisMonth")}
            </h3>
          </div>

          <p className="text-alert text-xl font-bold md:text-3xl xl:text-4xl">
            {isLoading ? t("loading") : formatCurrency(totalOut)}
          </p>
        </div>
      </div>
    </div>
  );
}
