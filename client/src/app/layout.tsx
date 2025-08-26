import type { Metadata } from "next";
import { Montserrat, Lato } from "next/font/google";
import "./globals.css";
import ConditionalLayout from "@/components/layout/ConditionalLayout";

const montserrat = Montserrat({
  weight: ['500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
});

const lato = Lato({
  weight: ['400'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: "Woof Marketing Platform",
  description: "Plataforma de gestão para marketing de clínicas veterinárias.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${lato.variable} ${montserrat.variable} ${lato.className} antialiased`}>
        <ConditionalLayout>
          {children}
        </ConditionalLayout>
      </body>
    </html>
  );
}
