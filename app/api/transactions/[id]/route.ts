import fs from "fs/promises";
import { NextResponse } from "next/server";
import path from "path";

import { Transaction } from "@/app/_types/transactionTypes";

const filePath = path.join(process.cwd(), "app", "utils", "transactions.json");

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;

    const file = await fs.readFile(filePath, "utf-8");
    const transactions: Transaction[] = JSON.parse(file);

    const filteredTransactions = transactions.filter((tx) => tx.id !== id);

    if (filteredTransactions.length === transactions.length) {
      return NextResponse.json(
        { success: false, error: "Transação não encontrada" },
        { status: 404 },
      );
    }

    await fs.writeFile(
      filePath,
      JSON.stringify(filteredTransactions, null, 2),
      "utf-8",
    );

    return NextResponse.json({
      success: true,
      message: "Transação excluída com sucesso",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false, error: "Erro ao excluir transação" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const updatedData: Partial<Transaction> = await request.json();

    const file = await fs.readFile(filePath, "utf-8");
    const transactions: Transaction[] = JSON.parse(file);

    const transactionIndex = transactions.findIndex((tx) => tx.id === id);

    if (transactionIndex === -1) {
      return NextResponse.json(
        { success: false, error: "Transação não encontrada" },
        { status: 404 },
      );
    }

    const updatedTransaction: Transaction = {
      ...transactions[transactionIndex],
      ...updatedData,
      id,
    };

    transactions[transactionIndex] = updatedTransaction;

    await fs.writeFile(
      filePath,
      JSON.stringify(transactions, null, 2),
      "utf-8",
    );

    return NextResponse.json({
      success: true,
      data: updatedTransaction,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, error: "Erro ao editar transação" },
      { status: 500 },
    );
  }
}
