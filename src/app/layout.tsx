
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/AppShell";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Concierge AI - Hotel Voice Assistant",
  description: "Automated voice ordering for hotels.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={cn(inter.className, "antialiased bg-background text-foreground overflow-hidden")}
        suppressHydrationWarning
      >
        <AppShell>
          {children}
        </AppShell>
      </body>
    </html>
  );
}
