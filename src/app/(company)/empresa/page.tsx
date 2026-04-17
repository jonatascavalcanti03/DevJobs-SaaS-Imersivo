"use client";

import { motion } from "framer-motion";
import { Building2, Users, MousePointerClick, MoreHorizontal, PlusCircle } from "lucide-react";
import StatsCard from "@/components/ui/StatsCard";
import StatusBadge from "@/components/ui/StatusBadge";

// Mock Data
const VAGAS_ATIVAS = [
  { id: "1", title: "Desenvolvedor(a) Full-Stack Senior", applicants: 45, views: 1200, status: "ACTIVE", isPremium: true, date: "10 Abr 2026" },
  { id: "2", title: "UX/UI Designer Pleno", applicants: 12, views: 350, status: "ACTIVE", isPremium: false, date: "15 Abr 2026" },
  { id: "3", title: "Engenheiro(a) de Dados", applicants: 0, views: 89, status: "DRAFT", isPremium: false, date: "Hoje" },
];

const CANDIDATOS_RECENTES = [
  { id: "c1", name: "Ana Beatriz", role: "Frontend Developer", appliedFor: "Desenvolvedor(a) Full-Stack Senior", match: 95, status: "PENDING", date: "Há 2 horas" },
  { id: "c2", name: "Carlos Eduardo", role: "Full-Stack Dev", appliedFor: "Desenvolvedor(a) Full-Stack Senior", match: 82, status: "REVIEWED", date: "Ontem" },
  { id: "c3", name: "Mariana Silva", role: "Product Designer", appliedFor: "UX/UI Designer Pleno", match: 88, status: "PENDING", date: "Ontem" },
  { id: "c4", name: "Lucas Fernandes", role: "UX Researcher", appliedFor: "UX/UI Designer Pleno", match: 75, status: "REJECTED", date: "Há 2 dias" },
];

export default function CompanyDashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-2xl sm:text-3xl font-bold text-white mb-1">
            Painel da Empresa
          </motion.h1>
          <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="text-[#94A3B8]">
            Gerencie suas vagas e avalie candidatos.
          </motion.p>
        </div>
        <motion.a
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          href="/empresa/nova-vaga"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#06B6D4] to-[#6366F1] text-white text-sm font-semibold shadow-lg shadow-[#06B6D4]/25 hover:shadow-[#06B6D4]/40 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <PlusCircle className="w-4 h-4" />
          Publicar Vaga
        </motion.a>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <StatsCard icon={Building2} label="Vagas Publicadas" value="15" index={0} />
        <StatsCard icon={Users} label="Total de Candidatos" value="184" trend={{ value: 24, positive: true }} index={1} />
        <StatsCard icon={MousePointerClick} label="Visualizações (Mês)" value="8.4K" trend={{ value: 12, positive: true }} index={2} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Vagas Recentes */}
        <div className="xl:col-span-2 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold text-white">Minhas Vagas</h2>
            <a href="/empresa/vagas" className="text-sm font-medium text-[#06B6D4] hover:text-[#22D3EE] transition-colors">Ver todas</a>
          </div>
          
          <div className="glass-card rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 bg-white/5">
                    <th className="px-6 py-4 text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">Vaga</th>
                    <th className="px-6 py-4 text-xs font-semibold text-[#94A3B8] uppercase tracking-wider text-center">Candidatos</th>
                    <th className="px-6 py-4 text-xs font-semibold text-[#94A3B8] uppercase tracking-wider text-center">Visualizações</th>
                    <th className="px-6 py-4 text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-semibold text-[#94A3B8] uppercase tracking-wider text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {VAGAS_ATIVAS.map((item, index) => (
                    <motion.tr 
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="hover:bg-white/5 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-white group-hover:text-[#22D3EE] transition-colors">{item.title}</p>
                          {item.isPremium && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#F59E0B]/20 text-[#FBBF24]">PRO</span>
                          )}
                        </div>
                        <p className="text-xs text-[#64748B] mt-0.5">Criada em {item.date}</p>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center justify-center min-w-[2rem] px-2 py-1 rounded-lg bg-white/5 text-sm font-medium text-white">
                          {item.applicants}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-[#94A3B8]">{item.views}</td>
                      <td className="px-6 py-4">
                        <StatusBadge status={item.status} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-2 rounded-lg hover:bg-white/10 text-[#64748B] hover:text-white transition-colors">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Candidatos Recentes */}
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold text-white">Últimos Candidatos</h2>
            <a href="/empresa/candidatos" className="text-sm font-medium text-[#06B6D4] hover:text-[#22D3EE] transition-colors">Ver todos</a>
          </div>
          
          <div className="glass-card rounded-2xl p-5 space-y-5">
            {CANDIDATOS_RECENTES.map((candidato, index) => (
              <motion.div
                key={candidato.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#06B6D4]/30 to-[#6366F1]/30 flex flex-shrink-0 items-center justify-center text-white font-bold text-sm border border-white/10">
                  {candidato.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-bold text-white truncate">{candidato.name}</p>
                    <span className="text-xs text-[#94A3B8] whitespace-nowrap">{candidato.date}</span>
                  </div>
                  <p className="text-xs text-[#06B6D4] truncate">{candidato.role}</p>
                  
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-medium">
                      {candidato.match}% Match
                    </span>
                    <StatusBadge status={candidato.status} />
                  </div>
                </div>
              </motion.div>
            ))}
            
            <button className="w-full py-2.5 rounded-xl border border-white/10 text-sm font-medium text-[#94A3B8] hover:text-white hover:bg-white/5 transition-colors mt-2">
              Ver lista completa
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
