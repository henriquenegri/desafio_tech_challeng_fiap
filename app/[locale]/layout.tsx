import "@/app/globals.css";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { getMessages } from "next-intl/server";

import { HeaderMobile } from "@/app/_components/layout/headerMobile";
import { Sidebar } from "@/app/_components/layout/sidebar";
import { ToasterProvider } from "@/app/_components/ToasterProvider";
import { AuthProvider } from "@/app/auth/authProvider";
import { ThemeProvider } from "@/app/theme/themeProvider";
import { routing } from "@/i18n/routing";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Digital Vault",
  description: "Financial management dashboard",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t!=='dark'&&t!=='light'){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}if(t==='dark'){document.documentElement.classList.add('dark');}}catch(e){}})();`,
          }}
        />
      </head>
      <ThemeProvider>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <AuthProvider>
            <body className="flex flex-col md:flex-row">
              <HeaderMobile />
              <Sidebar />
              {children}
              <ToasterProvider />
            </body>
          </AuthProvider>
        </NextIntlClientProvider>
      </ThemeProvider>
    </html>
  );
}
