"use client";

import { Transaction } from "@vault/shared";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

interface SpendingAlertWidgetProps {
  transactions: Transaction[];
}

export function SpendingAlertWidget({
  transactions,
}: SpendingAlertWidgetProps) {
  const totalIncome = transactions
    .filter((tx) => tx.type === "in")
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalExpenses = transactions
    .filter((tx) => tx.type === "out")
    .reduce((sum, tx) => sum + tx.amount, 0);

  // Alert if expenses > 80% of income, or if there's no income but there are expenses
  const alertThreshold = totalIncome * 0.8;
  const isAlert =
    (totalIncome > 0 && totalExpenses > alertThreshold) ||
    (totalIncome === 0 && totalExpenses > 0);

  return (
    <section
      className={`border-outline/30 mt-6 w-full rounded-2xl border p-6 shadow-sm transition-colors ${isAlert ? "border-red-200 bg-red-50/50 dark:border-red-900/30 dark:bg-red-950/20" : "bg-surface"}`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`rounded-full p-3 ${isAlert ? "bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400" : "bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400"}`}
        >
          {isAlert ? (
            <AlertTriangle className="h-6 w-6" />
          ) : (
            <CheckCircle2 className="h-6 w-6" />
          )}
        </div>
        <div>
          <h3
            className={`text-lg font-semibold ${isAlert ? "text-red-700 dark:text-red-400" : "text-green-700 dark:text-green-400"}`}
          >
            {isAlert ? "Alerta de Gastos!" : "Gastos Controlados"}
          </h3>
          <p className="text-muted mt-1 text-sm">
            {isAlert
              ? totalIncome === 0
                ? `Atenção: Você já tem R$ ${totalExpenses.toFixed(2)} em despesas, mas nenhuma receita foi registrada!`
                : `Atenção: Suas despesas (R$ ${totalExpenses.toFixed(2)}) ultrapassaram 80% da sua receita do período. Recomenda-se frear os gastos.`
              : totalIncome === 0 && totalExpenses === 0
                ? "Nenhuma movimentação registrada no período."
                : "Parabéns! Suas despesas estão abaixo da zona de risco (80% da receita)."}
          </p>
        </div>
      </div>
    </section>
  );
}
