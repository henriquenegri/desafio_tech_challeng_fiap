import { cookies } from "next/headers";
import { NextResponse } from "next/server";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const url = `${process.env.API_URL}/account/transaction/${(await params).id}`;
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log(
      "DELETE backend response:",
      response.status,
      response.statusText,
      url,
    );

    if (!response.ok) {
      throw new Error(
        `Failed to delete transaction. Status: ${response.status}`,
      );
    }

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
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const updatedData = await request.json();

    const payload = {
      type: updatedData.type === "in" ? "Credit" : "Debit",
      value:
        updatedData.type === "in" ? updatedData.amount : -updatedData.amount,
      from: updatedData.type === "in" ? updatedData.title : "",
      to: updatedData.type === "out" ? updatedData.title : "",
      anexo: updatedData.attachment?.name || "",
    };

    // Legitimate call to the backend API
    const response = await fetch(
      `${process.env.API_URL}/account/transaction/${(await params).id}`,
      {
        method: "PUT", // Assumes PUT or PATCH for update
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      },
    );

    if (!response.ok) {
      throw new Error("Failed to update transaction");
    }

    const responseData = await response.json();

    const savedTransaction = {
      ...updatedData,
      id: responseData.result?.id || updatedData.id,
      date: responseData.result?.date || updatedData.date,
    };

    return NextResponse.json({
      success: true,
      data: savedTransaction,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Erro ao editar transação" },
      { status: 500 },
    );
  }
}
