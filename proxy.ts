import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";

import { routing } from "./i18n/routing";

const handleI18nRouting = createMiddleware(routing);

// Login page is the root path: "/" (pt-BR) or "/en" (English)
function isLoginPage(pathname: string) {
  return pathname === "/" || pathname === "/en" || pathname === "/en/";
}

export function proxy(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;
  const { pathname } = request.nextUrl;

  // Unauthenticated: allow only the login root, redirect everything else
  if (!token && !isLoginPage(pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Authenticated user on login page: redirect to dashboard
  if (token && isLoginPage(pathname)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return handleI18nRouting(request);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
