"use client";

import { Transaction } from "@vault/shared";
import { Target } from "lucide-react";

interface SavingsGoalWidgetProps {
  transactions: Transaction[];
}

export function SavingsGoalWidget({ transactions }: SavingsGoalWidgetProps) {
  // Simple logic for the mockup goal: Save 20% of the total income
  const totalIncome = transactions
    .filter((tx) => tx.type === "in")
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalExpenses = transactions
    .filter((tx) => tx.type === "out")
    .reduce((sum, tx) => sum + tx.amount, 0);

  const currentBalance = totalIncome - totalExpenses;
  const savingsGoal = totalIncome * 0.2; // 20% of income

  // Calculate percentage
  let progress = 0;
  if (savingsGoal > 0) {
    progress = Math.max(0, Math.min(100, (currentBalance / savingsGoal) * 100));
  }

  return (
    <section className="bg-surface border-outline/30 mt-6 w-full rounded-2xl border p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-3">
        <div className="bg-brand/10 rounded-lg p-2">
          <Target className="text-brand h-5 w-5" />
        </div>
        <h3 className="text-foreground text-lg font-semibold">
          Meta de Economia
        </h3>
      </div>

      <div className="mb-2 flex justify-between text-sm">
        <span className="text-muted">Progresso (Meta: 20% da Receita)</span>
        <span className="text-foreground font-medium">
          {progress.toFixed(0)}%
        </span>
      </div>

      <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
        <div
          className="bg-brand h-full transition-all duration-1000 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="text-muted mt-3 text-xs">
        {totalIncome === 0
          ? "Registre suas receitas para calcular a meta de economia."
          : currentBalance >= savingsGoal && savingsGoal > 0
            ? "Parabéns! Você alcançou sua meta de economia este mês."
            : `Economize mais R$ ${Math.max(0, savingsGoal - currentBalance).toFixed(2)} para atingir a meta.`}
      </p>
    </section>
  );
}
