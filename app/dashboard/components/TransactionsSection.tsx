"use client";

import { RotateCcw, Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";

import { Transaction } from "../../_types/transactionTypes";
import { Table } from "./Table";
import { FilterState, TransactionFilters } from "./TransactionFilters";
import { TransactionPagination } from "./TransactionPagination";

interface TransactionsSectionProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
}

const initialFilters: FilterState = {
  searchQuery: "",
  type: "all",
  category: "all",
  startDate: "",
  endDate: "",
  minAmount: "",
  maxAmount: "",
  sortBy: "date-desc",
};

export function TransactionsSection({
  transactions,
  onEdit,
  onDelete,
}: TransactionsSectionProps) {
  const t = useTranslations("transactions");
  const tFilters = useTranslations("filters");

  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  function handleClearFilters() {
    setFilters(initialFilters);
    setCurrentPage(1);
  }

  // Count active filters in the advanced panel (excluding text search)
  const activeFiltersCount = useMemo(() => {
    return [
      filters.type !== "all",
      filters.category !== "all",
      filters.startDate !== "",
      filters.endDate !== "",
      filters.minAmount !== "",
      filters.maxAmount !== "",
    ].filter(Boolean).length;
  }, [filters]);

  // Parse Portuguese format date DD/MM/YYYY into JS Date
  const parseDate = (dateStr: string): Date => {
    const [day, month, year] = dateStr.split("/").map(Number);
    return new Date(year, month - 1, day);
  };

  const processedTransactions = useMemo(() => {
    return transactions
      .filter((tx) => {
        // Text Search
        if (filters.searchQuery) {
          const query = filters.searchQuery.toLowerCase();
          const matchTitle = tx.title.toLowerCase().includes(query);
          const matchCategory = tx.category.toLowerCase().includes(query);
          if (!matchTitle && !matchCategory) return false;
        }

        // Type Filter
        if (filters.type !== "all") {
          if (tx.type !== filters.type) return false;
        }

        // Category Filter
        if (filters.category !== "all") {
          if (tx.category !== filters.category) return false;
        }

        // Parse date for range filters
        const txDate = parseDate(tx.date);

        // Start Date Filter
        if (filters.startDate) {
          const start = new Date(filters.startDate + "T00:00:00");
          if (txDate < start) return false;
        }

        // End Date Filter
        if (filters.endDate) {
          const end = new Date(filters.endDate + "T23:59:59");
          if (txDate > end) return false;
        }

        // Min Amount Filter
        if (filters.minAmount !== "") {
          if (tx.amount < Number(filters.minAmount)) return false;
        }

        // Max Amount Filter
        if (filters.maxAmount !== "") {
          if (tx.amount > Number(filters.maxAmount)) return false;
        }

        return true;
      })
      .sort((a, b) => {
        switch (filters.sortBy) {
          case "date-asc": {
            const dateA = parseDate(a.date).getTime();
            const dateB = parseDate(b.date).getTime();
            return dateA - dateB;
          }
          case "amount-desc":
            return b.amount - a.amount;
          case "amount-asc":
            return a.amount - b.amount;
          case "alpha-asc":
            return a.title.localeCompare(b.title);
          case "alpha-desc":
            return b.title.localeCompare(a.title);
          case "date-desc":
          default: {
            const dateA = parseDate(a.date).getTime();
            const dateB = parseDate(b.date).getTime();
            return dateB - dateA;
          }
        }
      });
  }, [transactions, filters]);

  const totalItems = processedTransactions.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return processedTransactions.slice(startIndex, startIndex + itemsPerPage);
  }, [processedTransactions, currentPage, itemsPerPage]);

  return (
    <section className="md:bg-surface md:border-outline/30 rounded-2xl bg-transparent transition-colors duration-300 md:overflow-hidden md:border xl:rounded-3xl">
      {/* Section Header */}
      <div className="md:border-outline/30 mb-4 flex items-center justify-between md:mb-0 md:border-b md:px-8 md:py-7">
        <h3 className="text-foreground text-lg font-semibold transition-colors duration-300 md:text-2xl">
          <span className="md:hidden">{t("recentMobile")}</span>
          <span className="hidden md:inline">{t("latestDesktop")}</span>
        </h3>
      </div>

      {/* Filter and Search Controls */}
      <TransactionFilters
        filters={filters}
        onChange={handleFiltersChange}
        onClear={handleClearFilters}
        activeFiltersCount={activeFiltersCount}
      />

      {/* Table / List Container */}
      <div className="bg-surface overflow-hidden rounded-2xl transition-colors duration-300 md:rounded-none">
        <div className="overflow-x-auto">
          {paginatedTransactions.length > 0 ? (
            <>
              <Table
                transactions={paginatedTransactions}
                handleEdit={onEdit}
                handleDelete={onDelete}
              />
              <TransactionPagination
                currentPage={currentPage}
                totalPages={totalPages}
                itemsPerPage={itemsPerPage}
                totalItems={totalItems}
                onPageChange={setCurrentPage}
                onItemsPerPageChange={setItemsPerPage}
              />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
              <div className="bg-input border-outline/10 text-muted mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border transition-colors duration-300">
                <Search className="h-8 w-8 opacity-45" />
              </div>
              <h4 className="text-foreground text-base font-semibold transition-colors duration-300 md:text-lg">
                {tFilters("noResults")}
              </h4>
              <button
                onClick={handleClearFilters}
                className="text-brand hover:text-brand-hover mt-3 flex cursor-pointer items-center gap-1.5 text-sm font-bold transition-colors"
              >
                <RotateCcw className="h-4 w-4" />
                <span>{tFilters("clearFilters")}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
