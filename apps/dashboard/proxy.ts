import { routing } from "@vault/shared/routing";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";

const handleI18nRouting = createMiddleware(routing);

export function proxy(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;

  // Zona protegida: sem token, volta para o login (zona home, mesma origem)
  if (!token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return handleI18nRouting(request);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
