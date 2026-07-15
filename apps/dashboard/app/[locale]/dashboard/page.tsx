"use client";

import { Transaction } from "@vault/shared";
import { Plus, Settings2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import {
  CardsWidget,
  DashboardHeader,
  DeleteTransactionModal,
  FinancialChartWidget,
  SavingsGoalWidget,
  SpendingAlertWidget,
  SummaryCards,
  TransactionModal,
  TransactionsSection,
  WidgetManagerModal,
} from "@/components";
import { BankCard } from "@/components/widgets/CardsWidget";
import { useDashboardWidgets } from "@/hooks/useDashboardWidgets";

export default function DashboardPage() {
  const t = useTranslations("dashboard");
  const tToast = useTranslations("toast");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [cards, setCards] = useState<BankCard[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isWidgetManagerOpen, setIsWidgetManagerOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { widgets, isLoaded: isWidgetsLoaded } = useDashboardWidgets();

  useEffect(() => {
    async function loadTransactions() {
      try {
        const response = await fetch("/api/transactions");

        if (!response.ok) {
          throw new Error(t("fetchError"));
        }

        const result = await response.json();
        setTransactions(result.data ?? []);
        setCards(result.cards ?? []);
      } catch (error) {
        console.error(error);
        toast.error(tToast("fetchError"));
      } finally {
        setIsLoading(false);
      }
    }

    loadTransactions();
  }, [t, tToast]);

  function handleCreate() {
    setSelectedTransaction(null);
    setIsModalOpen(true);
  }

  function handleEdit(transaction: Transaction) {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  }

  function handleDelete(transaction: Transaction) {
    setSelectedTransaction(transaction);
    setIsDeleteModalOpen(true);
  }

  async function confirmDelete() {
    if (!selectedTransaction) return;

    try {
      const response = await fetch(
        `/api/transactions/${selectedTransaction.id}`,
        { method: "DELETE" },
      );

      if (!response.ok) {
        throw new Error(t("deleteError"));
      }

      setTransactions((prev) =>
        prev.filter((tx) => tx.id !== selectedTransaction.id),
      );
      setSelectedTransaction(null);
      setIsDeleteModalOpen(false);
      toast.success(tToast("deleteSuccess"));
    } catch (error) {
      console.error(error);
      toast.error(tToast("deleteError"));
    }
  }

  return (
    <div className="bg-background flex min-h-screen w-full flex-col font-sans transition-colors duration-300 md:flex-row">
      <main className="relative mx-auto w-full max-w-350 flex-1 px-5 py-6 md:px-8 md:py-10 xl:px-12 xl:py-12">
        <div className="mb-8 flex items-start justify-between md:mb-12 xl:mb-14">
          <DashboardHeader onCreate={handleCreate} />

          <button
            onClick={() => setIsWidgetManagerOpen(true)}
            className="text-muted hover:text-foreground border-outline/30 bg-surface hover:bg-muted/5 mt-1 hidden items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors md:flex"
          >
            <Settings2 className="h-4 w-4" />
            Personalizar
          </button>
        </div>

        <button
          onClick={() => setIsWidgetManagerOpen(true)}
          className="text-muted hover:text-foreground border-outline/30 bg-surface hover:bg-muted/5 mb-6 flex w-full items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors md:hidden"
        >
          <Settings2 className="h-4 w-4" />
          Personalizar Dashboard
        </button>

        <SummaryCards isLoading={isLoading} transactions={transactions} />

        {isWidgetsLoaded && widgets.showCards && cards.length > 0 && (
          <div className="mb-8">
            <CardsWidget cards={cards} />
          </div>
        )}

        {isWidgetsLoaded && (
          <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              {widgets.showCharts && (
                <FinancialChartWidget transactions={transactions} />
              )}
            </div>
            <div className="flex flex-col">
              {widgets.showSavingsGoal && (
                <SavingsGoalWidget transactions={transactions} />
              )}
              {widgets.showSpendingAlert && (
                <SpendingAlertWidget transactions={transactions} />
              )}
            </div>
          </div>
        )}

        <TransactionsSection
          transactions={transactions}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <div className="fixed right-6 bottom-6 left-6 z-30 md:hidden">
          <button
            onClick={handleCreate}
            className="bg-brand hover:bg-brand-hover text-background flex w-full items-center justify-center gap-2 rounded-xl py-4 font-bold shadow-[0_8px_30px_rgb(56,162,141,0.3)] transition-colors"
          >
            <Plus className="h-6 w-6" />
            {t("newTransaction")}
          </button>
        </div>

        <div className="h-24 md:hidden" />
      </main>

      {isModalOpen && (
        <TransactionModal
          transaction={selectedTransaction}
          setTransactions={setTransactions}
          setIsModalOpen={setIsModalOpen}
        />
      )}

      {isDeleteModalOpen && selectedTransaction && (
        <DeleteTransactionModal
          transaction={selectedTransaction}
          onConfirm={confirmDelete}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setSelectedTransaction(null);
          }}
        />
      )}

      {isWidgetManagerOpen && (
        <WidgetManagerModal onClose={() => setIsWidgetManagerOpen(false)} />
      )}
    </div>
  );
}
