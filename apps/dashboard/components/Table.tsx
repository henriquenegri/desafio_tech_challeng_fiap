"use client";

import { Transaction } from "@vault/shared";
import { getIcon } from "@vault/ui";
import { Paperclip, Pencil, Trash2 } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";

interface TableProps {
  transactions: Transaction[];
  handleEdit: (id: Transaction) => void;
  handleDelete: (e: Transaction) => void;
}

export function Table({ transactions, handleEdit, handleDelete }: TableProps) {
  const t = useTranslations("table");
  const tAttachment = useTranslations("attachment");
  const format = useFormatter();

  function formatCurrency(value: number) {
    return format.number(value, { style: "currency", currency: "BRL" });
  }

  return (
    <table className="w-full border-collapse">
      <thead className="hidden md:table-header-group">
        <tr className="text-muted border-outline/20 border-b text-xs font-semibold tracking-wider uppercase transition-colors duration-300">
          <th className="px-8 py-4 text-left">{t("description")}</th>
          <th className="px-8 py-4 text-right">{t("amount")}</th>
          <th className="px-8 py-4 text-right">{t("date")}</th>
          <th className="px-8 py-4 text-right">{t("config")}</th>
        </tr>
      </thead>

      <tbody>
        {transactions.slice().map((tx) => (
          <tr
            key={tx.id}
            className="bg-surface border-outline/10 mb-3 block rounded-xl border transition-colors duration-300 hover:bg-black/5 md:mb-0 md:table-row md:rounded-none md:border-0 md:bg-transparent dark:hover:bg-white/5"
          >
            <td className="block px-4 py-4 align-middle md:table-cell md:px-8 md:py-6">
              <div className="flex items-center gap-4">
                <div className="bg-input flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-colors duration-300">
                  {getIcon(tx.iconName)}
                </div>

                <div>
                  <p className="text-foreground text-sm font-semibold transition-colors duration-300 md:text-base xl:text-lg">
                    {tx.title}
                  </p>

                  <p className="text-muted mt-0.5 text-xs transition-colors duration-300 md:text-sm">
                    {tx.category}
                    <span className="md:hidden"> • {tx.date}</span>
                  </p>
                </div>
              </div>
            </td>

            <td className="block px-4 pb-2 text-left align-middle md:table-cell md:px-8 md:py-6 md:text-right">
              <span
                className={`text-sm font-bold whitespace-nowrap md:text-base xl:text-lg ${
                  tx.type === "in" ? "text-brand" : "text-alert"
                }`}
              >
                {tx.type === "in" ? "+" : "-"} {formatCurrency(tx.amount)}
              </span>
            </td>

            <td className="hidden px-8 py-6 text-right align-middle md:table-cell">
              <span className="text-muted text-sm transition-colors duration-300 md:text-base">
                {tx.date}
              </span>
            </td>

            <td className="block px-4 pt-2 pb-4 text-left align-middle md:table-cell md:px-8 md:py-6 md:text-right">
              <div className="flex items-center gap-2 md:justify-end">
                {tx.attachment && (
                  <button
                    type="button"
                    className="hover:bg-input text-muted hover:text-brand cursor-pointer rounded-lg p-2.5 transition-colors duration-300"
                    onClick={() => {
                      if (tx.attachment?.dataUrl) {
                        const newTab = window.open();
                        if (newTab) {
                          newTab.document.write(
                            `<iframe src="${tx.attachment.dataUrl}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`,
                          );
                        }
                      }
                    }}
                    title={tAttachment("viewButton")}
                  >
                    <Paperclip className="h-4 w-4" />
                  </button>
                )}

                <button
                  type="button"
                  className="hover:bg-input text-muted hover:text-foreground cursor-pointer rounded-lg p-2.5 transition-colors duration-300"
                  onClick={() => handleEdit(tx)}
                >
                  <Pencil className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  className="text-muted cursor-pointer rounded-lg p-2.5 transition-colors duration-300 hover:bg-red-500/10 hover:text-red-500"
                  onClick={() => handleDelete(tx)}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
