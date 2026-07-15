import { CreditCard, Wifi } from "lucide-react";

export interface BankCard {
  id: string;
  type: string;
  number: string;
  dueDate: string;
  name: string;
  cvc: string;
}

interface CardsWidgetProps {
  cards: BankCard[];
}

export function CardsWidget({ cards }: CardsWidgetProps) {
  if (!cards || cards.length === 0) return null;

  return (
    <div className="bg-surface border-outline/50 flex flex-col rounded-3xl border p-6 shadow-sm transition-all duration-300">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-foreground text-lg font-bold">Meus Cartões</h3>
        <button className="text-muted hover:text-brand text-sm font-medium transition-colors">
          Ver todos
        </button>
      </div>

      <div className="hide-scrollbar flex snap-x gap-4 overflow-x-auto pb-4">
        {cards.map((card) => {
          // Format card number to show only last 4 digits: **** **** **** 1010
          const last4 = card.number ? card.number.slice(-4) : "0000";
          const formattedDate = card.dueDate
            ? new Date(card.dueDate).toLocaleDateString("pt-BR", {
                month: "2-digit",
                year: "2-digit",
              })
            : "00/00";

          const isCredit = card.type === "Credit";

          return (
            <div
              key={card.id}
              className={`relative flex h-48 min-w-[300px] shrink-0 snap-center flex-col justify-between overflow-hidden rounded-2xl p-6 text-white shadow-lg transition-transform hover:scale-[1.02] ${
                isCredit
                  ? "from-brand/90 bg-linear-to-br to-[#1b5e50]"
                  : "bg-linear-to-br from-slate-700 to-slate-900"
              }`}
            >
              {/* Glass overlay */}
              <div
                className="absolute inset-0 bg-white/5 backdrop-blur-[2px]"
                aria-hidden="true"
              />

              {/* Card Header */}
              <div className="relative z-10 flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-6 w-6 opacity-80" />
                  <span className="font-medium tracking-wider text-white/90">
                    {isCredit ? "CRÉDITO" : "DÉBITO"}
                  </span>
                </div>
                <Wifi className="h-6 w-6 rotate-90 opacity-80" />
              </div>

              {/* Card Number */}
              <div className="relative z-10 mt-6 flex items-center justify-between">
                <div className="font-mono text-xl tracking-[0.2em] text-white shadow-sm md:text-2xl">
                  **** **** **** {last4}
                </div>
              </div>

              {/* Card Footer */}
              <div className="relative z-10 mt-4 flex items-end justify-between">
                <div className="flex flex-col">
                  <span className="text-[10px] font-medium tracking-widest text-white/60 uppercase">
                    Titular
                  </span>
                  <span className="max-w-[150px] truncate font-semibold tracking-widest text-white uppercase">
                    {card.name || "Usuário"}
                  </span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-medium tracking-widest text-white/60 uppercase">
                    Validade
                  </span>
                  <span className="font-semibold tracking-wider text-white">
                    {formattedDate}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
