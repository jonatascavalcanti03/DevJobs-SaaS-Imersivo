"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function CandidateLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "/candidato";
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") {
      router.replace("/login");
      return;
    }
    // Empresa tentando acessar área de candidato
    if ((session?.user as any)?.role === "COMPANY") {
      router.replace("/empresa");
    }
  }, [status, session, router]);

  // Exibe tela de loading enquanto verifica a sessão
  if (status === "loading" || status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-[#050510] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-[#6366F1] border-t-transparent rounded-full animate-spin" />
          <p className="text-[#64748B] text-sm">Verificando acesso...</p>
        </div>
      </div>
    );
  }

  const userName = session?.user?.name || "Usuário";
  const userRole = "Candidato(a)";

  return (
    <div className="relative">
      {/* Background Gradients for Dashboard */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-[#6366F1]/10 blur-[120px]" />
        <div className="absolute bottom-[20%] left-[20%] w-[30%] h-[30%] rounded-full bg-[#06B6D4]/5 blur-[100px]" />
      </div>
      
      <div className="relative z-10 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        {children}
      </div>
    </div>
  );
}
