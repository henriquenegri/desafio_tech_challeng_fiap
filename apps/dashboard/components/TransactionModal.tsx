"use client";

import { Transaction } from "@vault/shared";
import { Paperclip, Trash2, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";

import { useEscapeKey } from "@/hooks/useEscapeKey";

interface TransactionModalProps {
  transaction: Transaction | null;
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  setIsModalOpen: (value: boolean) => void;
}

const categoryOptions = [
  { value: "Alimentação", iconName: "utensils", labelKey: "categoryFood" },
  { value: "Compras", iconName: "shopping", labelKey: "categoryShopping" },
  { value: "Trabalho", iconName: "briefcase", labelKey: "categoryWork" },
  { value: "Moradia", iconName: "building", labelKey: "categoryHousing" },
  {
    value: "Investimentos",
    iconName: "trending",
    labelKey: "categoryInvestments",
  },
  { value: "Contas", iconName: "zap", labelKey: "categoryBills" },
] as const;

const categoryKeywords: { value: string; keywords: string[] }[] = [
  {
    value: "Alimentação",
    keywords: [
      "mercado",
      "almoço",
      "jantar",
      "restaurante",
      "pizza",
      "lanche",
      "comida",
      "supermercado",
      "feira",
      "padaria",
      "mcdonald",
      "burger",
    ],
  },
  {
    value: "Compras",
    keywords: [
      "shopping",
      "roupas",
      "tênis",
      "camisa",
      "amazon",
      "loja",
      "eletronico",
      "livro",
      "presente",
      "mercadolivre",
    ],
  },
  {
    value: "Trabalho",
    keywords: [
      "salário",
      "freela",
      "bônus",
      "job",
      "projeto",
      "receita",
      "pagamento",
      "comissão",
    ],
  },
  {
    value: "Moradia",
    keywords: [
      "aluguel",
      "condomínio",
      "iptu",
      "reforma",
      "casa",
      "apartamento",
      "móveis",
      "decor",
    ],
  },
  {
    value: "Investimentos",
    keywords: [
      "ações",
      "fiis",
      "tesouro",
      "investimento",
      "poupança",
      "xp",
      "rendimento",
      "inter",
      "cdi",
      "dividendos",
    ],
  },
  {
    value: "Contas",
    keywords: [
      "luz",
      "água",
      "gás",
      "telefone",
      "internet",
      "energia",
      "boleto",
      "multa",
      "fatura",
      "seguro",
      "coelba",
      "sabesp",
      "net",
      "claro",
      "vivo",
    ],
  },
];

function createEmptyTransaction(): Transaction {
  return {
    id: crypto.randomUUID(),
    title: "",
    category: "",
    amount: 0,
    type: "in",
    date: new Date().toISOString(),
    iconName: "",
    attachment: null,
  };
}

export function TransactionModal({
  transaction,
  setTransactions,
  setIsModalOpen,
}: TransactionModalProps) {
  const t = useTranslations("transactionModal");
  const tToast = useTranslations("toast");
  const tValidation = useTranslations("validation");
  const tAttachment = useTranslations("attachment");

  const [transactionData, setTransactionData] = useState<Transaction>(
    () => transaction ?? createEmptyTransaction(),
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSuggested, setIsSuggested] = useState(false);

  const isEditing = Boolean(transaction);

  useEscapeKey(() => setIsModalOpen(false));

  const suggestCategory = (
    title: string,
  ): { value: string; iconName: string; type: string } | null => {
    if (!title.trim()) return null;
    const lowerTitle = title.toLowerCase();
    for (const cat of categoryKeywords) {
      for (const keyword of cat.keywords) {
        if (lowerTitle.includes(keyword)) {
          const matchedOption = categoryOptions.find(
            (opt) => opt.value === cat.value,
          );
          if (matchedOption) {
            const suggestedType =
              matchedOption.value === "Trabalho" ? "in" : "out";
            return {
              value: matchedOption.value,
              iconName: matchedOption.iconName,
              type: suggestedType,
            };
          }
        }
      }
    }
    return null;
  };

  const handleTitleChange = (val: string) => {
    setTransactionData((prev) => {
      const updated = { ...prev, title: val };
      const suggestion = suggestCategory(val);
      if (suggestion) {
        setIsSuggested(true);
        setErrors((prevErr) => {
          const newErrors = { ...prevErr };
          delete newErrors.category;
          return newErrors;
        });
        return {
          ...updated,
          category: suggestion.value,
          iconName: suggestion.iconName,
          type: suggestion.type as "in" | "out",
        };
      } else {
        setIsSuggested(false);
      }
      return updated;
    });

    if (val.trim().length >= 3) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.title;
        return newErrors;
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error(tAttachment("fileSizeError"));
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setTransactionData((prev) => ({
        ...prev,
        attachment: {
          name: file.name,
          type: file.type,
          size: file.size,
          dataUrl: reader.result as string,
        },
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveFile = () => {
    setTransactionData((prev) => ({
      ...prev,
      attachment: null,
    }));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!transactionData.title.trim()) {
      newErrors.title = "titleRequired";
    } else if (transactionData.title.trim().length < 3) {
      newErrors.title = "titleTooShort";
    }

    if (!transactionData.amount || Number(transactionData.amount) <= 0) {
      newErrors.amount = "amountPositive";
    }

    if (!transactionData.category) {
      newErrors.category = "categoryRequired";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  async function handleSubmit() {
    if (!validate()) {
      toast.error(tToast("saveError"));
      return;
    }

    try {
      const url = isEditing
        ? `/api/transactions/${transactionData.id}`
        : "/api/transactions";

      const method = isEditing ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(transactionData),
      });

      if (!response.ok) {
        throw new Error(isEditing ? t("editError") : t("saveError"));
      }

      const result = await response.json();
      const savedTransaction = result.data ?? transactionData;

      setTransactions((prev) =>
        isEditing
          ? prev.map((tx) =>
              tx.id === savedTransaction.id ? savedTransaction : tx,
            )
          : [savedTransaction, ...prev],
      );

      toast.success(
        isEditing ? tToast("editSuccess") : tToast("createSuccess"),
      );
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
      toast.error(isEditing ? tToast("editError") : tToast("saveError"));
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      aria-modal="true"
      role="dialog"
      aria-labelledby="transaction-modal-title"
    >
      <div className="bg-surface border-outline/50 relative w-full max-w-md rounded-2xl border p-6 shadow-2xl transition-colors duration-300">
        <button
          onClick={() => setIsModalOpen(false)}
          aria-label="Fechar"
          className="text-muted hover:text-foreground absolute top-4 right-4 transition-colors"
        >
          <X className="h-6 w-6" aria-hidden="true" />
        </button>

        <h2
          id="transaction-modal-title"
          className="text-foreground mb-6 text-xl font-bold transition-colors duration-300"
        >
          {isEditing ? t("editTitle") : t("addTitle")}
        </h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="space-y-4"
        >
          {/* Title input */}
          <div>
            <label
              htmlFor="tx-title"
              className="text-foreground mb-1 block text-sm font-medium"
            >
              {t("titleLabel")}
            </label>
            <input
              id="tx-title"
              value={transactionData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              type="text"
              className={`bg-input text-foreground focus:ring-brand/35 w-full rounded-lg border px-4 py-2.5 transition-colors outline-none focus:ring-1 ${
                errors.title ? "border-alert" : "border-outline"
              }`}
              placeholder={t("titlePlaceholder")}
            />
            {errors.title && (
              <p className="text-alert mt-1 text-xs font-semibold transition-all">
                {tValidation(errors.title)}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Amount Input */}
            <div>
              <label
                htmlFor="tx-amount"
                className="text-foreground mb-1 block text-sm font-medium"
              >
                {t("amountLabel")}
              </label>
              <input
                id="tx-amount"
                value={transactionData.amount || ""}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setTransactionData((prev) => ({
                    ...prev,
                    amount: val,
                  }));
                  if (val > 0) {
                    setErrors((prev) => {
                      const newErrors = { ...prev };
                      delete newErrors.amount;
                      return newErrors;
                    });
                  }
                }}
                type="number"
                step="0.01"
                className={`bg-input text-foreground focus:ring-brand/35 w-full rounded-lg border px-4 py-2.5 transition-colors outline-none focus:ring-1 ${
                  errors.amount ? "border-alert" : "border-outline"
                }`}
                placeholder="0.00"
              />
              {errors.amount && (
                <p className="text-alert mt-1 text-xs font-semibold transition-all">
                  {tValidation(errors.amount)}
                </p>
              )}
            </div>

            {/* Type Input */}
            <div>
              <label
                htmlFor="tx-type"
                className="text-foreground mb-1 block text-sm font-medium"
              >
                {t("typeLabel")}
              </label>
              <select
                id="tx-type"
                value={transactionData.type}
                onChange={(e) =>
                  setTransactionData((prev) => ({
                    ...prev,
                    type: e.target.value as Transaction["type"],
                  }))
                }
                className="bg-input border-outline text-foreground focus:ring-brand/35 w-full rounded-lg border px-4 py-2.5 outline-none focus:ring-1"
              >
                <option value="out">{t("typeOut")}</option>
                <option value="in">{t("typeIn")}</option>
              </select>
            </div>
          </div>

          {/* Category Input */}
          <div>
            <label
              htmlFor="tx-category"
              className="text-foreground mb-1 block text-sm font-medium"
            >
              {t("categoryLabel")}
            </label>
            <select
              id="tx-category"
              value={transactionData.category}
              onChange={(e) => {
                const val = e.target.value;
                const selected = categoryOptions.find(
                  (item) => item.value === val,
                );
                setTransactionData((prev) => ({
                  ...prev,
                  category: val,
                  iconName: selected?.iconName ?? "",
                }));
                setIsSuggested(false);
                if (val) {
                  setErrors((prev) => {
                    const newErrors = { ...prev };
                    delete newErrors.category;
                    return newErrors;
                  });
                }
              }}
              className={`bg-input text-foreground focus:ring-brand/35 w-full rounded-lg border px-4 py-2.5 transition-colors outline-none focus:ring-1 ${
                errors.category ? "border-alert" : "border-outline"
              }`}
            >
              <option value="">{t("categoryPlaceholder")}</option>
              {categoryOptions.map((item) => (
                <option key={item.value} value={item.value}>
                  {t(item.labelKey)}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-alert mt-1 text-xs font-semibold transition-all">
                {tValidation(errors.category)}
              </p>
            )}
            {isSuggested && !errors.category && (
              <p className="text-brand mt-1 flex animate-pulse items-center gap-1 text-xs font-semibold">
                <span>✨ {tValidation("suggested")}</span>
              </p>
            )}
          </div>

          {/* Attachments Upload Field */}
          <div>
            <label
              htmlFor="tx-attachment"
              className="text-foreground mb-1 block text-sm font-medium"
            >
              {tAttachment("label")}
            </label>
            {transactionData.attachment ? (
              <div className="bg-input/40 border-outline/40 flex items-center justify-between rounded-xl border p-3.5 transition-colors">
                <div className="flex items-center gap-3 overflow-hidden">
                  <Paperclip
                    className="text-brand h-5 w-5 shrink-0"
                    aria-hidden="true"
                  />
                  <div className="overflow-hidden">
                    <p className="text-foreground truncate text-xs font-semibold">
                      {transactionData.attachment.name}
                    </p>
                    <p className="text-muted mt-0.5 text-[10px]">
                      {(transactionData.attachment.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  aria-label="Remover anexo"
                  className="text-muted hover:text-alert cursor-pointer rounded-lg p-1.5 transition-colors"
                >
                  <Trash2 className="h-4.5 w-4.5" aria-hidden="true" />
                </button>
              </div>
            ) : (
              <div className="border-outline/50 hover:border-brand/40 bg-input/10 relative flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed px-4 py-5 text-center transition-colors">
                <input
                  id="tx-attachment"
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={handleFileChange}
                  className="absolute inset-0 cursor-pointer opacity-0"
                  aria-label={tAttachment("uploadButton")}
                />
                <Paperclip
                  className="text-muted mb-1 h-5 w-5 opacity-60"
                  aria-hidden="true"
                />
                <p className="text-brand text-xs font-bold">
                  {tAttachment("uploadButton")}
                </p>
                <p className="text-muted mt-0.5 text-[10px]">
                  {tAttachment("helperText")}
                </p>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="bg-brand hover:bg-brand-hover text-background mt-4 w-full cursor-pointer rounded-xl py-3 font-bold transition-colors"
          >
            {isEditing ? t("saveEdit") : t("saveNew")}
          </button>
        </form>
      </div>
    </div>
  );
}
