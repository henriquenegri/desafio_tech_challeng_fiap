"use client";

import { Transaction } from "@vault/shared";
import { useTranslations } from "next-intl";

import { Table } from "./Table";

interface TransactionsSectionProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
}

export function TransactionsSection({
  transactions,
  onEdit,
  onDelete,
}: TransactionsSectionProps) {
  const t = useTranslations("transactions");

  return (
    <section className="md:bg-surface md:border-outline/30 rounded-2xl bg-transparent transition-colors duration-300 md:overflow-hidden md:border xl:rounded-3xl">
      <div className="md:border-outline/30 mb-4 flex items-center justify-between md:mb-0 md:border-b md:px-8 md:py-7">
        <h3 className="text-foreground text-lg font-semibold transition-colors duration-300 md:text-2xl">
          <span className="md:hidden">{t("recentMobile")}</span>
          <span className="hidden md:inline">{t("latestDesktop")}</span>
        </h3>
      </div>

      <div className="bg-surface overflow-hidden rounded-2xl transition-colors duration-300 md:rounded-none">
        <div className="overflow-x-auto">
          <Table
            transactions={transactions}
            handleEdit={onEdit}
            handleDelete={onDelete}
          />
        </div>
      </div>
    </section>
  );
}
