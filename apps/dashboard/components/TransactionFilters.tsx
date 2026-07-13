"use client";

import {
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

export interface FilterState {
  searchQuery: string;
  type: "all" | "in" | "out";
  category: string;
  startDate: string;
  endDate: string;
  minAmount: string;
  maxAmount: string;
  sortBy: string;
}

interface TransactionFiltersProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onClear: () => void;
  activeFiltersCount: number;
}

const categoryOptions = [
  { value: "Alimentação", labelKey: "categoryFood" },
  { value: "Compras", labelKey: "categoryShopping" },
  { value: "Trabalho", labelKey: "categoryWork" },
  { value: "Moradia", labelKey: "categoryHousing" },
  { value: "Investimentos", labelKey: "categoryInvestments" },
  { value: "Contas", labelKey: "categoryBills" },
] as const;

export function TransactionFilters({
  filters,
  onChange,
  onClear,
  activeFiltersCount,
}: TransactionFiltersProps) {
  const t = useTranslations("filters");
  const tModal = useTranslations("transactionModal");
  const [isExpanded, setIsExpanded] = useState(false);

  function handleFilterChange<K extends keyof FilterState>(
    key: K,
    value: FilterState[K],
  ) {
    onChange({
      ...filters,
      [key]: value,
    });
  }

  return (
    <div className="w-full px-6 py-5 md:px-8">
      {/* Top Search & Filter Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="text-muted absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 transition-colors duration-300" />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => handleFilterChange("searchQuery", e.target.value)}
            placeholder={t("searchPlaceholder")}
            className="bg-input border-outline/55 text-foreground placeholder:text-muted/70 focus:border-brand focus:ring-brand/30 w-full rounded-xl border py-3 pr-4 pl-12 text-sm transition-all duration-300 outline-none focus:ring-1 md:text-base"
          />
        </div>

        {/* Buttons and Sorting */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Sorting */}
          <div className="flex items-center gap-2">
            <label className="text-muted hidden text-sm font-medium xl:inline-block">
              {t("sortByLabel")}:
            </label>
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange("sortBy", e.target.value)}
              className="bg-input border-outline/55 text-foreground focus:border-brand rounded-xl border px-3 py-3 text-sm font-semibold transition-colors duration-300 outline-none"
            >
              <option value="date-desc">{t("sortDateNewest")}</option>
              <option value="date-asc">{t("sortDateOldest")}</option>
              <option value="amount-desc">{t("sortAmountHighest")}</option>
              <option value="amount-asc">{t("sortAmountLowest")}</option>
              <option value="alpha-asc">{t("sortAlphaAZ")}</option>
              <option value="alpha-desc">{t("sortAlphaZA")}</option>
            </select>
          </div>

          {/* Toggle Advanced Filters Button */}
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-bold transition-all duration-300 ${
              isExpanded
                ? "bg-brand border-brand text-background hover:bg-brand-hover"
                : "bg-surface border-outline/55 text-foreground hover:bg-input"
            }`}
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span>{t("advancedFilters")}</span>
            {activeFiltersCount > 0 && (
              <span
                className={`flex h-5 items-center justify-center rounded-full px-2 text-xs font-bold ${
                  isExpanded
                    ? "bg-background text-brand"
                    : "bg-brand text-background"
                }`}
              >
                {activeFiltersCount}
              </span>
            )}
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>

          {/* Clear Filters Button */}
          {activeFiltersCount > 0 && (
            <button
              type="button"
              onClick={onClear}
              className="text-muted hover:text-alert border-outline/30 hover:border-alert/30 flex items-center justify-center gap-2 rounded-xl border bg-transparent p-3 text-sm font-bold transition-colors"
              title={t("clearFilters")}
            >
              <RotateCcw className="h-4 w-4" />
              <span className="hidden sm:inline">{t("clearFilters")}</span>
            </button>
          )}
        </div>
      </div>

      {/* Expandable Advanced Filters Panel */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isExpanded
            ? "mt-5 max-h-[500px] opacity-100"
            : "pointer-events-none max-h-0 opacity-0"
        }`}
      >
        <div className="bg-input/40 border-outline/35 rounded-2xl border p-5 md:p-6">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {/* Type Filter */}
            <div className="flex flex-col gap-1.5">
              <label className="text-muted text-xs font-bold tracking-wider uppercase">
                {t("typeLabel")}
              </label>
              <select
                value={filters.type}
                onChange={(e) =>
                  handleFilterChange(
                    "type",
                    e.target.value as FilterState["type"],
                  )
                }
                className="bg-surface border-outline/40 text-foreground focus:border-brand w-full rounded-xl border px-3.5 py-2.5 text-sm transition-colors duration-300 outline-none"
              >
                <option value="all">{t("typeAll")}</option>
                <option value="in">{t("typeIn")}</option>
                <option value="out">{t("typeOut")}</option>
              </select>
            </div>

            {/* Category Filter */}
            <div className="flex flex-col gap-1.5">
              <label className="text-muted text-xs font-bold tracking-wider uppercase">
                {t("categoryLabel")}
              </label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange("category", e.target.value)}
                className="bg-surface border-outline/40 text-foreground focus:border-brand w-full rounded-xl border px-3.5 py-2.5 text-sm transition-colors duration-300 outline-none"
              >
                <option value="all">{t("categoryAll")}</option>
                {categoryOptions.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {tModal(cat.labelKey)}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Range Filters */}
            <div className="flex flex-col gap-1.5 sm:col-span-1">
              <label className="text-muted text-xs font-bold tracking-wider uppercase">
                {t("dateRangeLabel")}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) =>
                    handleFilterChange("startDate", e.target.value)
                  }
                  className="bg-surface border-outline/40 text-foreground focus:border-brand w-full rounded-xl border px-3.5 py-2 text-sm transition-colors duration-300 outline-none"
                  placeholder={t("startDate")}
                />
                <span className="text-muted text-xs font-medium">to</span>
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) =>
                    handleFilterChange("endDate", e.target.value)
                  }
                  className="bg-surface border-outline/40 text-foreground focus:border-brand w-full rounded-xl border px-3.5 py-2 text-sm transition-colors duration-300 outline-none"
                  placeholder={t("endDate")}
                />
              </div>
            </div>

            {/* Amount Range Filters */}
            <div className="flex flex-col gap-1.5 sm:col-span-1">
              <label className="text-muted text-xs font-bold tracking-wider uppercase">
                {t("amountRangeLabel")}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={filters.minAmount}
                  onChange={(e) =>
                    handleFilterChange("minAmount", e.target.value)
                  }
                  placeholder={t("minAmount")}
                  min="0"
                  step="any"
                  className="bg-surface border-outline/40 text-foreground placeholder:text-muted/50 focus:border-brand w-full rounded-xl border px-3.5 py-2 text-sm transition-colors duration-300 outline-none"
                />
                <span className="text-muted text-xs font-medium">to</span>
                <input
                  type="number"
                  value={filters.maxAmount}
                  onChange={(e) =>
                    handleFilterChange("maxAmount", e.target.value)
                  }
                  placeholder={t("maxAmount")}
                  min="0"
                  step="any"
                  className="bg-surface border-outline/40 text-foreground placeholder:text-muted/50 focus:border-brand w-full rounded-xl border px-3.5 py-2 text-sm transition-colors duration-300 outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
