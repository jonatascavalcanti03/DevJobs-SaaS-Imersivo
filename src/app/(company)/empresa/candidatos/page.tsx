"use client";

import { motion } from "framer-motion";
import { Search, Filter, Mail, ExternalLink, Download, Star } from "lucide-react";
import StatusBadge from "@/components/ui/StatusBadge";
import { useState } from "react";

const CANDIDATOS = [
  { id: "c1", name: "Ana Beatriz", role: "Frontend Developer", email: "ana@email.com", appliedFor: "Desenvolvedor(a) Full-Stack Senior", match: 95, status: "PENDING", date: "Há 2 horas", isPro: true },
  { id: "c2", name: "Carlos Eduardo", role: "Full-Stack Dev", email: "carlos@email.com", appliedFor: "Desenvolvedor(a) Full-Stack Senior", match: 82, status: "REVIEWED", date: "Ontem", isPro: false },
  { id: "c3", name: "Mariana Silva", role: "Product Designer", email: "mariana@email.com", appliedFor: "UX/UI Designer Pleno", match: 88, status: "PENDING", date: "Ontem", isPro: true },
  { id: "c4", name: "Lucas Fernandes", role: "UX Researcher", email: "lucas@email.com", appliedFor: "UX/UI Designer Pleno", match: 75, status: "REJECTED", date: "Há 2 dias", isPro: false },
  { id: "c5", name: "Pedro Henrique", role: "Backend Developer", email: "pedro@email.com", appliedFor: "Engenheiro(a) de Dados", match: 90, status: "ACCEPTED", date: "Há 5 dias", isPro: false },
];

export default function EmpresaCandidatosPage() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Banco de Candidatos
          </motion.h1>
          <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="text-[#94A3B8]">
            Avalie os perfis que aplicaram para suas vagas.
          </motion.p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="glass-card rounded-2xl p-4 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
          <input 
            type="text" 
            placeholder="Buscar candidato por nome ou cargo..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg text-white placeholder-[#64748B] pl-10 pr-4 py-2 text-sm focus:bg-white/10 focus:border-[#06B6D4]/50 transition-all outline-none"
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white px-4 py-2 text-sm transition-colors w-full sm:w-auto justify-center">
            <Filter className="w-4 h-4" /> Filtrar por Vaga
          </button>
        </div>
      </div>

      {/* Candidatos List */}
      <div className="glass-card rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="px-6 py-4 text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">Candidato</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">Aplicou para</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#94A3B8] uppercase tracking-wider text-center">Match (IA)</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#94A3B8] uppercase tracking-wider text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {CANDIDATOS.map((candidato, index) => (
                <motion.tr 
                  key={candidato.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`transition-colors group ${candidato.isPro ? "bg-[#F59E0B]/5 hover:bg-[#F59E0B]/10" : "hover:bg-white/5"}`}
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#06B6D4]/30 to-[#6366F1]/30 flex flex-shrink-0 items-center justify-center text-white font-bold text-sm border border-white/10">
                        {candidato.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-white">{candidato.name}</p>
                          {candidato.isPro && (
                            <Star className="w-3.5 h-3.5 text-[#FBBF24] fill-[#FBBF24]" title="Candidato PRO" />
                          )}
                        </div>
                        <p className="text-xs text-[#06B6D4] mt-0.5">{candidato.role}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-sm text-white truncate max-w-[200px]">{candidato.appliedFor}</p>
                    <p className="text-xs text-[#64748B] mt-0.5">{candidato.date}</p>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full border-4 border-emerald-500/20 relative">
                      <span className="text-xs font-bold text-emerald-400">{candidato.match}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <StatusBadge status={candidato.status} />
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-[#64748B] hover:text-white transition-colors" title="Baixar CV">
                        <Download className="w-4 h-4" />
                      </button>
                      <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-[#64748B] hover:text-white transition-colors" title="Enviar E-mail">
                        <Mail className="w-4 h-4" />
                      </button>
                      <button className="px-3 py-1.5 rounded-lg bg-[#06B6D4]/10 hover:bg-[#06B6D4]/20 text-[#22D3EE] text-sm font-medium transition-colors" title="Ver Perfil Completo">
                        Analisar
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
