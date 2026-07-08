export type TransactionType = "in" | "out";

export interface Transaction {
  id: string;
  title: string;
  category: string;
  amount: number;
  type: TransactionType;
  date: string;
  iconName: string;
}
