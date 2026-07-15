"use client";

import { X } from "lucide-react";

import { useDashboardWidgets } from "@/hooks/useDashboardWidgets";
import { useEscapeKey } from "@/hooks/useEscapeKey";

interface WidgetManagerModalProps {
  onClose: () => void;
}

export function WidgetManagerModal({ onClose }: WidgetManagerModalProps) {
  const { widgets, updateWidgets } = useDashboardWidgets();

  useEscapeKey(onClose);

  return (
    <div
      className="bg-background/80 fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="widget-manager-title"
    >
      <div className="bg-surface border-outline/50 w-full max-w-md rounded-2xl border p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h2
            id="widget-manager-title"
            className="text-foreground text-xl font-bold"
          >
            Personalizar Dashboard
          </h2>
          <button
            onClick={onClose}
            aria-label="Fechar configurações de widgets"
            className="text-muted hover:bg-muted/10 rounded-full p-2 transition-colors"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="space-y-4">
          <label
            htmlFor="widget-charts"
            className="border-outline/30 hover:bg-muted/5 flex cursor-pointer items-center justify-between rounded-lg border p-4 transition-colors"
          >
            <div>
              <span className="text-foreground block font-medium">
                Gráfico Financeiro
              </span>
              <span className="text-muted block text-sm">
                Receitas vs Despesas
              </span>
            </div>
            <input
              id="widget-charts"
              type="checkbox"
              checked={widgets.showCharts}
              onChange={(e) => updateWidgets({ showCharts: e.target.checked })}
              className="border-outline text-brand focus:ring-brand h-5 w-5 rounded"
            />
          </label>

          <label
            htmlFor="widget-savings"
            className="border-outline/30 hover:bg-muted/5 flex cursor-pointer items-center justify-between rounded-lg border p-4 transition-colors"
          >
            <div>
              <span className="text-foreground block font-medium">
                Meta de Economia
              </span>
              <span className="text-muted block text-sm">
                Progresso para economizar 20%
              </span>
            </div>
            <input
              id="widget-savings"
              type="checkbox"
              checked={widgets.showSavingsGoal}
              onChange={(e) =>
                updateWidgets({ showSavingsGoal: e.target.checked })
              }
              className="border-outline text-brand focus:ring-brand h-5 w-5 rounded"
            />
          </label>

          <label
            htmlFor="widget-alerts"
            className="border-outline/30 hover:bg-muted/5 flex cursor-pointer items-center justify-between rounded-lg border p-4 transition-colors"
          >
            <div>
              <span className="text-foreground block font-medium">
                Alerta de Gastos
              </span>
              <span className="text-muted block text-sm">
                Aviso ao exceder 80% da receita
              </span>
            </div>
            <input
              id="widget-alerts"
              type="checkbox"
              checked={widgets.showSpendingAlert}
              onChange={(e) =>
                updateWidgets({ showSpendingAlert: e.target.checked })
              }
              className="border-outline text-brand focus:ring-brand h-5 w-5 rounded"
            />
          </label>

          <label
            htmlFor="widget-cards"
            className="border-outline/30 hover:bg-muted/5 flex cursor-pointer items-center justify-between rounded-lg border p-4 transition-colors"
          >
            <div>
              <span className="text-foreground block font-medium">
                Meus Cartões
              </span>
              <span className="text-muted block text-sm">
                Visualização dos seus cartões
              </span>
            </div>
            <input
              id="widget-cards"
              type="checkbox"
              checked={widgets.showCards}
              onChange={(e) => updateWidgets({ showCards: e.target.checked })}
              className="border-outline text-brand focus:ring-brand h-5 w-5 rounded"
            />
          </label>
        </div>

        <div className="mt-8">
          <button
            onClick={onClose}
            className="bg-brand hover:bg-brand-hover text-background w-full rounded-xl py-3 font-semibold transition-colors"
          >
            Salvar e Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
