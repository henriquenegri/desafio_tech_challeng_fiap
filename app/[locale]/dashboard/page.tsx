"use client";

import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Transaction } from "@/app/_types/transactionTypes";
import {
  DashboardHeader,
  DeleteTransactionModal,
  SummaryCards,
  TransactionModal,
  TransactionsSection,
} from "@/app/dashboard/components";

export default function DashboardPage() {
  const t = useTranslations("dashboard");
  const tToast = useTranslations("toast");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadTransactions() {
      try {
        const response = await fetch("/api/transactions");

        if (!response.ok) {
          throw new Error(t("fetchError"));
        }

        const result = await response.json();
        setTransactions(result.data ?? []);
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
        <DashboardHeader onCreate={handleCreate} />

        <SummaryCards isLoading={isLoading} transactions={transactions} />

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
    </div>
  );
}
