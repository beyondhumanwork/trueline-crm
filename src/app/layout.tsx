import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: "variable",
});

export const metadata: Metadata = {
  title: "TrueLine CRM",
  description: "Motorcycle training business management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased h-full`}>
        {children}
      </body>
    </html>
  );
}
