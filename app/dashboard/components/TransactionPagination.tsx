"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";

interface TransactionPaginationProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (size: number) => void;
}

export function TransactionPagination({
  currentPage,
  totalPages,
  itemsPerPage,
  totalItems,
  onPageChange,
  onItemsPerPageChange,
}: TransactionPaginationProps) {
  const t = useTranslations("pagination");

  if (totalItems === 0) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Generate page numbers to display
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="border-outline/20 border-t px-6 py-5 md:px-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between transition-colors duration-300">
      {/* Items per page selector & status text */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* Page size dropdown */}
        <div className="flex items-center gap-2">
          <label className="text-muted text-xs font-medium md:text-sm">
            {t("itemsPerPage")}:
          </label>
          <select
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
            className="bg-input border-outline/55 text-foreground rounded-lg border px-2.5 py-1.5 text-xs font-semibold outline-none transition-colors duration-300 focus:border-brand"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </div>

        {/* Text details */}
        <span className="text-muted text-xs md:text-sm">
          {t("showing", { start: startItem, end: endItem, total: totalItems })}
        </span>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between sm:justify-end gap-3">
        {/* Previous Button */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`flex items-center gap-1.5 border border-outline/40 rounded-xl px-3 py-2 text-xs font-bold transition-all duration-300 ${
            currentPage === 1
              ? "opacity-40 cursor-not-allowed text-muted"
              : "bg-surface text-foreground hover:bg-input"
          }`}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden xs:inline">{t("previous")}</span>
        </button>

        {/* Dynamic Page Buttons (Hidden on small mobile viewports) */}
        <div className="hidden md:flex items-center gap-1.5">
          {pageNumbers.map((page) => (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              className={`min-w-[36px] h-9 flex items-center justify-center rounded-xl text-xs font-bold transition-all duration-300 ${
                page === currentPage
                  ? "bg-brand text-background shadow-[0_4px_12px_rgb(56,162,141,0.2)]"
                  : "bg-transparent text-muted hover:bg-input hover:text-foreground"
              }`}
            >
              {page}
            </button>
          ))}
        </div>

        {/* Page text indicator for mobile devices */}
        <span className="text-muted text-xs font-semibold md:hidden">
          {t("pageIndicator", { current: currentPage, total: totalPages })}
        </span>

        {/* Next Button */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`flex items-center gap-1.5 border border-outline/40 rounded-xl px-3 py-2 text-xs font-bold transition-all duration-300 ${
            currentPage === totalPages
              ? "opacity-40 cursor-not-allowed text-muted"
              : "bg-surface text-foreground hover:bg-input"
          }`}
        >
          <span className="hidden xs:inline">{t("next")}</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
