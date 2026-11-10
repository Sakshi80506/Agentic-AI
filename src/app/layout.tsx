import type { Metadata } from "next";
import "./globals.css";
import { AuthProviderWrapper } from "@frontend/components/auth/AuthProviderWrapper";
import { ThemeProvider } from "@frontend/context/ThemeContext";

export const metadata: Metadata = {
  title: "Agentic AI - Meeting & Productivity Assistant",
  description: "Next-generation autonomous AI meeting and schedule orchestration assistant",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full dark" suppressHydrationWarning>
      <body className="h-full antialiased bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-200">
        <ThemeProvider>
          <AuthProviderWrapper>{children}</AuthProviderWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
