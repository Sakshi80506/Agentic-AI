import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en" className="h-full">
      <body className="h-full antialiased bg-slate-900 text-slate-100">
        {children}
      </body>
    </html>
  );
}

