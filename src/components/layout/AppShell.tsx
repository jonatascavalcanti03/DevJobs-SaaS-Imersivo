"use client";

import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import Sidebar, { type SidebarLink } from "@/components/ui/Sidebar";
import { 
  LayoutDashboard, 
  Search, 
  Briefcase, 
  User, 
  Star, 
  Users, 
  PlusCircle, 
  Building2 
} from "lucide-react";

const CANDIDATE_LINKS: SidebarLink[] = [
  { label: "Dashboard", href: "/candidato", icon: LayoutDashboard },
  { label: "Buscar Vagas", href: "/vagas", icon: Search },
  { label: "Candidaturas", href: "/candidato/candidaturas", icon: Briefcase },
  { label: "Meu Perfil", href: "/candidato/perfil", icon: User },
  { label: "Plano PRO", href: "/candidato/pro", icon: Star },
];

const COMPANY_LINKS: SidebarLink[] = [
  { label: "Dashboard", href: "/empresa", icon: LayoutDashboard },
  { label: "Minhas Vagas", href: "/empresa/vagas", icon: Building2 },
  { label: "Nova Vaga", href: "/empresa/nova-vaga", icon: PlusCircle },
  { label: "Candidatos", href: "/empresa/candidatos", icon: Users },
  { label: "Perfil", href: "/empresa/perfil", icon: User },
  { label: "Plano Premium", href: "/empresa/premium", icon: Star },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  // Páginas que NUNCA devem mostrar o sidebar (mesmo se logado, embora improvável)
  const isAuthPage = pathname?.startsWith("/login") || pathname?.startsWith("/cadastro");
  
  // Se estiver carregando ou não autenticado, ou em página de auth, renderiza apenas o conteúdo
  if (status === "loading" || status === "unauthenticated" || isAuthPage) {
    return <>{children}</>;
  }

  const role = (session?.user as any)?.role;
  const links = role === "COMPANY" ? COMPANY_LINKS : CANDIDATE_LINKS;
  const userName = session?.user?.name || (role === "COMPANY" ? "Empresa" : "Usuário");
  const userRole = role === "COMPANY" ? "Empresa" : "Candidato(a)";

  return (
    <div className="min-h-screen bg-[#050510] flex">
      <Sidebar
        links={links}
        activePath={pathname || ""}
        userName={userName}
        userRole={userRole}
        userImage={session?.user?.image || undefined}
      />
      <main className="flex-1 lg:pl-[260px] pb-16 lg:pb-0 min-h-screen transition-all duration-300 relative overflow-hidden">
        {children}
      </main>
    </div>
  );
}
