"use client";

import { LayoutDashboard, Search, Briefcase, User, Star } from "lucide-react";
import Sidebar, { type SidebarLink } from "@/components/ui/Sidebar";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

const CANDIDATE_LINKS: SidebarLink[] = [
  { label: "Dashboard", href: "/candidato", icon: LayoutDashboard },
  { label: "Buscar Vagas", href: "/vagas", icon: Search },
  { label: "Candidaturas", href: "/candidato/candidaturas", icon: Briefcase, badge: "3" },
  { label: "Meu Perfil", href: "/candidato/perfil", icon: User },
  { label: "Plano PRO", href: "/candidato/pro", icon: Star },
];

export default function CandidateLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "/candidato";
  const { data: session } = useSession();

  const userName = session?.user?.name || "Carregando...";
  const userRole = "Candidato(a)";

  return (
    <div className="min-h-screen bg-[#050510] flex">
      <Sidebar
        links={CANDIDATE_LINKS}
        activePath={pathname}
        userName={userName}
        userRole={userRole}
        userImage={session?.user?.image || undefined}
      />
      <main className="flex-1 lg:pl-[260px] pb-16 lg:pb-0 min-h-screen transition-all duration-300 relative overflow-hidden">
        {/* Background Gradients for Dashboard */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-[#6366F1]/10 blur-[120px]" />
          <div className="absolute bottom-[20%] left-[20%] w-[30%] h-[30%] rounded-full bg-[#06B6D4]/5 blur-[100px]" />
        </div>
        
        <div className="relative z-10 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
