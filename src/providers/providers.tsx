"use client";

import {
  QueryProvider,
} from "./query-provider";

import {
  ThemeProvider,
} from "./theme-provider";

import {
  Toaster,
} from "@/components/ui/sonner";

export function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <QueryProvider>
        {children}

        <Toaster
          position="top-right"
          richColors
        />
      </QueryProvider>
    </ThemeProvider>
  );
}