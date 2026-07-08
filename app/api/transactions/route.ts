import fs from "fs/promises";
import { NextResponse } from "next/server";
import path from "path";

import { Transaction } from "@/app/_types/transactionTypes";

const filePath = path.join(process.cwd(), "app", "utils", "transactions.json");

export async function GET() {
  try {
    const file = await fs.readFile(filePath, "utf-8");
    const transactions: Transaction[] = JSON.parse(file);

    return NextResponse.json({
      success: true,
      data: transactions,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Erro ao buscar transações" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const newTransaction: Transaction = await request.json();

    const file = await fs.readFile(filePath, "utf-8");
    const transactions: Transaction[] = JSON.parse(file);

    transactions.unshift(newTransaction);

    await fs.writeFile(
      filePath,
      JSON.stringify(transactions, null, 2),
      "utf-8",
    );

    return NextResponse.json({ success: true, data: newTransaction });
  } catch {
    return NextResponse.json(
      { success: false, error: "Erro ao salvar transação" },
      { status: 500 },
    );
  }
}
