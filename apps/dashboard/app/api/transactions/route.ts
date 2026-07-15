import { Transaction } from "@vault/shared";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

interface ApiTransaction {
  id: string;
  type: string;
  value: number;
  date: string;
  from?: string;
  to?: string;
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const response = await fetch(`${process.env.API_URL}/account`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch account");
    }

    const data = await response.json();
    const apiTransactions = data.result?.transactions || [];
    const apiCards = data.result?.cards || [];

    const transactions: Transaction[] = apiTransactions.map(
      (tx: ApiTransaction) => ({
        id: tx.id,
        title:
          tx.from || tx.to || (tx.type === "Credit" ? "Depósito" : "Pagamento"),
        category: tx.type === "Credit" ? "Entrada" : "Saída",
        amount: Math.abs(tx.value),
        type: tx.type === "Credit" ? "in" : "out",
        date: tx.date,
        iconName: tx.type === "Credit" ? "ArrowUpCircle" : "ArrowDownCircle",
      }),
    );

    return NextResponse.json({
      success: true,
      data: transactions,
      cards: apiCards,
    });
  } catch (error) {
    console.error("GET transactions error:", error);
    return NextResponse.json(
      { success: false, error: "Erro ao buscar transações" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const newTransaction: Transaction = await request.json();

    // Fetch account to get accountId
    const accountResponse = await fetch(`${process.env.API_URL}/account`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!accountResponse.ok) {
      throw new Error("Failed to fetch account for posting");
    }

    const accountData = await accountResponse.json();
    const accountId = accountData.result?.account?.[0]?.id;

    if (!accountId) {
      throw new Error("Account not found");
    }

    const payload = {
      accountId,
      type: newTransaction.type === "in" ? "Credit" : "Debit",
      value:
        newTransaction.type === "in"
          ? newTransaction.amount
          : -newTransaction.amount,
      from: newTransaction.type === "in" ? newTransaction.title : "",
      to: newTransaction.type === "out" ? newTransaction.title : "",
      anexo: newTransaction.attachment?.name || "",
    };

    const postResponse = await fetch(
      `${process.env.API_URL}/account/transaction`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      },
    );

    if (!postResponse.ok) {
      throw new Error("Failed to post transaction");
    }

    const postData = await postResponse.json();

    const createdTransaction: Transaction = {
      ...newTransaction,
      id: postData.result?.id || newTransaction.id,
      date: postData.result?.date || newTransaction.date,
    };

    return NextResponse.json({ success: true, data: createdTransaction });
  } catch (error) {
    console.error("POST transaction error:", error);
    return NextResponse.json(
      { success: false, error: "Erro ao salvar transação" },
      { status: 500 },
    );
  }
}
