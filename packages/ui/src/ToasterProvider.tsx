"use client";

import { Toaster } from "sonner";

import { useTheme } from "./themeProvider";

export function ToasterProvider() {
  const { theme } = useTheme();
  return <Toaster theme={theme} position="top-right" richColors />;
}
