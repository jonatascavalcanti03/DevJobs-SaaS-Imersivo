"use client";

import { LayoutDashboard, Users, PlusCircle, Building2, Star, User } from "lucide-react";
import Sidebar, { type SidebarLink } from "@/components/ui/Sidebar";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

const COMPANY_LINKS: SidebarLink[] = [
  { label: "Dashboard", href: "/empresa", icon: LayoutDashboard },
  { label: "Minhas Vagas", href: "/empresa/vagas", icon: Building2 },
  { label: "Nova Vaga", href: "/empresa/nova-vaga", icon: PlusCircle },
  { label: "Candidatos", href: "/empresa/candidatos", icon: Users, badge: "Novo" },
  { label: "Perfil", href: "/empresa/perfil", icon: User },
  { label: "Plano Premium", href: "/empresa/premium", icon: Star },
];

export default function CompanyLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "/empresa";
  const { data: session } = useSession();

  const userName = session?.user?.name || "Carregando...";
  const userRole = "Empresa";

  return (
    <div className="min-h-screen bg-[#050510] flex">
      <Sidebar
        links={COMPANY_LINKS}
        activePath={pathname}
        userName={userName}
        userRole={userRole}
        userImage={session?.user?.image || undefined}
      />
      <main className="flex-1 lg:pl-[260px] pb-16 lg:pb-0 min-h-screen transition-all duration-300 relative overflow-hidden">
        {/* Background Gradients for Company Dashboard (different colors) */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-[#06B6D4]/10 blur-[120px]" />
          <div className="absolute bottom-[20%] left-[20%] w-[30%] h-[30%] rounded-full bg-[#8B5CF6]/5 blur-[100px]" />
        </div>
        
        <div className="relative z-10 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
