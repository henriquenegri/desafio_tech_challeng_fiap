"use client";

import { Transaction } from "@vault/shared";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface FinancialChartWidgetProps {
  transactions: Transaction[];
}

export function FinancialChartWidget({
  transactions,
}: FinancialChartWidgetProps) {
  // Group transactions by month-year
  const monthlyData = transactions.reduce(
    (acc, tx) => {
      const date = new Date(tx.date);
      const month = date.toLocaleString("default", {
        month: "short",
        year: "2-digit",
      });

      if (!acc[month]) {
        acc[month] = { name: month, income: 0, expenses: 0 };
      }

      if (tx.type === "in") {
        acc[month].income += tx.amount;
      } else {
        acc[month].expenses += tx.amount;
      }

      return acc;
    },
    {} as Record<string, { name: string; income: number; expenses: number }>,
  );

  const data = Object.values(monthlyData).reverse();

  return (
    <section className="bg-surface border-outline/30 mt-8 w-full rounded-2xl border p-6 shadow-sm">
      <h3 className="text-foreground mb-6 text-lg font-semibold">
        Desempenho Financeiro
      </h3>
      <div className="h-[300px] w-full">
        {data.length === 0 ? (
          <div className="text-muted flex h-full items-center justify-center">
            Sem dados suficientes para gerar o gráfico.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis
                dataKey="name"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `R$ ${value}`}
              />
              <Tooltip
                cursor={{ fill: "transparent" }}
                contentStyle={{
                  borderRadius: "8px",
                  border: "none",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                formatter={(value: any) => [
                  `R$ ${Number(value).toFixed(2)}`,
                  "",
                ]}
              />
              <Legend />
              <Bar
                dataKey="income"
                name="Entradas"
                fill="#38a28d"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="expenses"
                name="Saídas"
                fill="#e11d48"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </section>
  );
}
