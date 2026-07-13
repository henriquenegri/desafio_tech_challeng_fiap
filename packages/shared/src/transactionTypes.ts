export type TransactionType = "in" | "out";

export interface TransactionAttachment {
  name: string;
  type: string;
  size: number;
  dataUrl: string;
}

export interface Transaction {
  id: string;
  title: string;
  category: string;
  amount: number;
  type: TransactionType;
  date: string;
  iconName: string;
  attachment?: TransactionAttachment | null;
}
