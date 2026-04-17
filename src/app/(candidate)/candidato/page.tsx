"use client";

import { motion } from "framer-motion";
import { Briefcase, Eye, Bookmark, ExternalLink, ArrowRight, Star } from "lucide-react";
import StatsCard from "@/components/ui/StatsCard";
import StatusBadge from "@/components/ui/StatusBadge";
import JobCard from "@/components/ui/JobCard";
import { type JobData } from "@/components/ui/JobCard";

import { useSession } from "next-auth/react";

// Mock Data
const CANDIDATURAS_RECENTES = [
  { id: "1", vaga: "Engenheiro(a) Frontend React", empresa: "Google Brasil", data: "15 Abr 2026", status: "REVIEWED" },
  { id: "2", vaga: "Desenvolvedor(a) Full-Stack", empresa: "Meta", data: "12 Abr 2026", status: "PENDING" },
  { id: "3", vaga: "Backend Developer Python", empresa: "Nubank", data: "05 Abr 2026", status: "REJECTED" },
  { id: "4", vaga: "Mobile Developer React Native", empresa: "iFood", data: "20 Mar 2026", status: "ACCEPTED" },
];

const VAGAS_RECOMENDADAS: JobData[] = [
  { id: "r1", title: "Frontend Developer (Vue.js)", company: "Spotify", location: "Remoto", type: "REMOTE", level: "MID", salaryMin: 14000, salaryMax: 18000, tags: ["Vue.js", "TypeScript", "Tailwind"], isPremium: true, createdAt: new Date().toISOString() },
  { id: "r2", title: "React Native Engineer", company: "Uber", location: "São Paulo, SP", type: "HYBRID", level: "SENIOR", salaryMin: 18000, salaryMax: 25000, tags: ["React Native", "TypeScript", "GraphQL"], isPremium: false, createdAt: new Date(Date.now() - 86400000).toISOString() },
];

export default function CandidateDashboard() {
  const { data: session } = useSession();
  const firstName = session?.user?.name?.split(" ")[0] || "Visitante";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-2xl sm:text-3xl font-bold text-white mb-1">
            Olá, {firstName}! 👋
          </motion.h1>
          <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="text-[#94A3B8]">
            Aqui está o resumo da sua carreira hoje.
          </motion.p>
        </div>
        <motion.a
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          href="/vagas"
          className="px-5 py-2.5 rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] text-white text-sm font-semibold shadow-lg shadow-[#6366F1]/25 transition-colors"
        >
          Encontrar Vagas
        </motion.a>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <StatsCard icon={Briefcase} label="Candidaturas Ativas" value="12" trend={{ value: 15, positive: true }} index={0} />
        <StatsCard icon={Eye} label="Visualizações do Perfil" value="48" trend={{ value: 8, positive: true }} index={1} />
        <StatsCard icon={Bookmark} label="Vagas Salvas" value="5" index={2} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Minhas Candidaturas */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold text-white">Candidaturas Recentes</h2>
            <a href="/candidato/candidaturas" className="text-sm font-medium text-[#6366F1] hover:text-[#818CF8] transition-colors">Ver todas</a>
          </div>
          
          <div className="glass-card rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 bg-white/5">
                    <th className="px-6 py-4 text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">Vaga</th>
                    <th className="px-6 py-4 text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">Data</th>
                    <th className="px-6 py-4 text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-semibold text-[#94A3B8] uppercase tracking-wider text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {CANDIDATURAS_RECENTES.map((item, index) => (
                    <motion.tr 
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="hover:bg-white/5 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <p className="text-sm font-semibold text-white group-hover:text-[#818CF8] transition-colors">{item.vaga}</p>
                        <p className="text-xs text-[#64748B] mt-0.5">{item.empresa}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#94A3B8]">{item.data}</td>
                      <td className="px-6 py-4">
                        <StatusBadge status={item.status} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-2 rounded-lg hover:bg-white/10 text-[#64748B] hover:text-white transition-colors">
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Vagas Recomendadas */}
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold text-white">Recomendadas para você</h2>
          </div>
          <div className="space-y-4">
            {VAGAS_RECOMENDADAS.map((job, index) => (
              <JobCard key={job.id} job={job} index={index} />
            ))}
          </div>

          {/* Banner Plano PRO */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-6 rounded-2xl p-6 relative overflow-hidden group cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#F59E0B]/20 to-[#F59E0B]/5 border border-[#F59E0B]/20 rounded-2xl group-hover:border-[#F59E0B]/40 transition-colors" />
            <div className="relative z-10">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F59E0B] to-[#F97316] flex items-center justify-center mb-4 shadow-lg shadow-[#F59E0B]/25">
                <Star className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Destaque seu perfil</h3>
              <p className="text-sm text-[#94A3B8] mb-4">Assine o plano PRO e apareça no topo das buscas dos recrutadores.</p>
              <span className="text-sm font-bold text-[#FBBF24] flex items-center gap-1 group-hover:gap-2 transition-all">
                Conhecer benefícios <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
