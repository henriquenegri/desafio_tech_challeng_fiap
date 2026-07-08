import { routing } from "@vault/shared/routing";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";

const handleI18nRouting = createMiddleware(routing);

// Login page is the root path: "/" (pt-BR) or "/en" (English)
function isLoginPage(pathname: string) {
  return pathname === "/" || pathname === "/en" || pathname === "/en/";
}

// Paths served by the dashboard zone (see rewrites in next.config.ts)
function isDashboardZone(pathname: string) {
  return /^(\/en)?\/dashboard(-static)?(\/|$)/.test(pathname);
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

  // Dashboard paths belong to the other zone: skip i18n handling here and
  // let the rewrites in next.config.ts forward the request
  if (isDashboardZone(pathname)) {
    return NextResponse.next();
  }

  return handleI18nRouting(request);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
