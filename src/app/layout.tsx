import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers/Providers";
import AppShell from "@/components/layout/AppShell";
import { Toaster } from "sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Match.js | Vagas de Programação no Brasil",
  description:
    "Encontre as melhores vagas de programação no Brasil. Conectamos desenvolvedores talentosos às melhores empresas de tecnologia. Vagas remotas, híbridas e presenciais.",
  keywords: [
    "vagas programação",
    "emprego desenvolvedor",
    "vagas tech Brasil",
    "trabalho remoto programação",
    "matchjs",
    "vagas TI",
  ],
  openGraph: {
    title: "Match.js | Vagas de Programação no Brasil",
    description:
      "Encontre as melhores vagas de programação no Brasil. Conectamos desenvolvedores talentosos às melhores empresas de tecnologia.",
    type: "website",
    locale: "pt_BR",
    siteName: "Match.js",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-bg text-text-primary transition-colors duration-300">
        <Providers>
          {/* Global Animated Background */}
          <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#6366F1]/5 dark:bg-[#6366F1]/10 blur-[120px] animate-mesh" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#06B6D4]/5 dark:bg-[#06B6D4]/10 blur-[120px] animate-mesh" style={{ animationDelay: "-5s" }} />
          </div>

          {/* Noise overlay for texture */}
          <div className="noise-overlay" aria-hidden="true" />
          <Toaster richColors position="top-right" />

          <AppShell>
            {children}
          </AppShell>
        </Providers>
      </body>
    </html>
  );
}
