import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/providers/AuthProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "DevJobs.br — Vagas de Programação no Brasil",
  description:
    "Encontre as melhores vagas de programação no Brasil. Conectamos desenvolvedores talentosos às melhores empresas de tecnologia. Vagas remotas, híbridas e presenciais.",
  keywords: [
    "vagas programação",
    "emprego desenvolvedor",
    "vagas tech Brasil",
    "trabalho remoto programação",
    "devjobs",
    "vagas TI",
  ],
  openGraph: {
    title: "DevJobs.br — Vagas de Programação no Brasil",
    description:
      "Encontre as melhores vagas de programação no Brasil. Conectamos desenvolvedores talentosos às melhores empresas de tecnologia.",
    type: "website",
    locale: "pt_BR",
    siteName: "DevJobs.br",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#050510] text-[#F1F5F9]">
        <AuthProvider>
          {/* Noise overlay for texture */}
          <div className="noise-overlay" aria-hidden="true" />

          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
