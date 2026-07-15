import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { username, email, password } = await request.json();

    const response = await fetch(`${process.env.API_URL}/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
    });

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: "Erro ao criar usuário" },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json({ success: true, data: data.result });
  } catch (error) {
    console.error("Create user error:", error);
    return NextResponse.json(
      { success: false, error: "Erro interno" },
      { status: 500 },
    );
  }
}
