"use client";

import { TriangleAlert, X } from "lucide-react";
import { useTranslations } from "next-intl";

import { Transaction } from "../../_types/transactionTypes";

interface DeleteTransactionModalProps {
  transaction: Transaction;
  onConfirm: () => void;
  onClose: () => void;
}

export function DeleteTransactionModal({
  transaction,
  onConfirm,
  onClose,
}: DeleteTransactionModalProps) {
  const t = useTranslations("deleteModal");

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      aria-modal="true"
      role="dialog"
    >
      <div className="bg-surface border-outline/50 relative w-full max-w-md rounded-2xl border p-6 shadow-2xl transition-colors duration-300">
        <button
          type="button"
          onClick={onClose}
          className="text-muted hover:text-foreground absolute top-4 right-4 transition-colors"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="mb-4 flex items-start gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-500/10">
            <TriangleAlert className="h-6 w-6 text-red-500" />
          </div>

          <div>
            <h2 className="text-foreground text-xl font-bold transition-colors duration-300">
              {t("title")}
            </h2>
            <p className="text-muted mt-1 text-sm transition-colors duration-300">
              {t("irreversible")}
            </p>
          </div>
        </div>

        <div className="bg-input/60 mb-6 rounded-xl p-4 transition-colors duration-300">
          <p className="text-muted text-sm transition-colors duration-300">
            {t("aboutToDelete")}
          </p>
          <p className="text-foreground mt-1 text-base font-semibold transition-colors duration-300">
            {transaction.title}
          </p>
          <p className="text-muted mt-1 text-sm transition-colors duration-300">
            {transaction.category} • {transaction.date}
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onClose}
            className="border-outline text-foreground hover:bg-input flex-1 rounded-xl border py-3 font-semibold transition-colors duration-300"
          >
            {t("cancel")}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 rounded-xl bg-red-500 py-3 font-semibold text-white transition-colors duration-300 hover:bg-red-600"
          >
            {t("confirm")}
          </button>
        </div>
      </div>
    </div>
  );
}
