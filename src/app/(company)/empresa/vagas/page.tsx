"use client";

import { motion } from "framer-motion";
import { PlusCircle, Search, MoreVertical, Edit, Users, Eye, Trash2 } from "lucide-react";
import StatusBadge from "@/components/ui/StatusBadge";
import { useState } from "react";

const MINHAS_VAGAS = [
  { id: "1", title: "Desenvolvedor(a) Full-Stack Senior", applicants: 45, views: 1200, status: "ACTIVE", isPremium: true, date: "10 Abr 2026", type: "REMOTE" },
  { id: "2", title: "UX/UI Designer Pleno", applicants: 12, views: 350, status: "ACTIVE", isPremium: false, date: "15 Abr 2026", type: "HYBRID" },
  { id: "3", title: "Engenheiro(a) de Dados", applicants: 0, views: 89, status: "DRAFT", isPremium: false, date: "Hoje", type: "REMOTE" },
  { id: "4", title: "Product Manager Pleno", applicants: 120, views: 3200, status: "CLOSED", isPremium: false, date: "01 Mar 2026", type: "ONSITE" },
];

export default function EmpresaVagasPage() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Minhas Vagas
          </motion.h1>
          <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="text-[#94A3B8]">
            Gerencie todas as vagas publicadas pela sua empresa.
          </motion.p>
        </div>
        <motion.a
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          href="/empresa/nova-vaga"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#06B6D4] to-[#6366F1] text-white text-sm font-semibold shadow-lg shadow-[#06B6D4]/25 hover:shadow-[#06B6D4]/40 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <PlusCircle className="w-4 h-4" /> Nova Vaga
        </motion.a>
      </div>

      {/* Filters & Search */}
      <div className="glass-card rounded-2xl p-4 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
          <input 
            type="text" 
            placeholder="Buscar nas minhas vagas..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg text-white placeholder-[#64748B] pl-10 pr-4 py-2 text-sm focus:bg-white/10 focus:border-[#06B6D4]/50 transition-all outline-none"
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <select className="bg-white/5 border border-white/10 rounded-lg text-white px-4 py-2 text-sm focus:border-[#06B6D4]/50 outline-none w-full sm:w-auto appearance-none">
            <option value="ALL">Todos os Status</option>
            <option value="ACTIVE">Ativas</option>
            <option value="DRAFT">Rascunhos</option>
            <option value="CLOSED">Fechadas</option>
          </select>
        </div>
      </div>

      {/* Vagas List */}
      <div className="grid gap-4">
        {MINHAS_VAGAS.map((vaga, index) => (
          <motion.div
            key={vaga.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card rounded-2xl p-5 sm:p-6 flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between group hover:border-white/20 transition-colors"
          >
            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-bold text-white group-hover:text-[#22D3EE] transition-colors truncate">
                  {vaga.title}
                </h3>
                {vaga.isPremium && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#F59E0B]/20 text-[#FBBF24] border border-[#F59E0B]/30 flex-shrink-0">
                    PREMIUM
                  </span>
                )}
                <StatusBadge status={vaga.status} />
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[#94A3B8]">
                <span>Criada em: {vaga.date}</span>
                <span className="w-1 h-1 rounded-full bg-white/20 hidden sm:block" />
                <span>Modelo: {vaga.type}</span>
              </div>
            </div>

            {/* Metrics */}
            <div className="flex gap-6 lg:border-l lg:border-white/10 lg:pl-6 w-full lg:w-auto">
              <div className="text-center">
                <p className="text-2xl font-bold text-white mb-1 flex items-center justify-center gap-2">
                  <Users className="w-4 h-4 text-[#06B6D4]" /> {vaga.applicants}
                </p>
                <p className="text-xs text-[#64748B] uppercase tracking-wider">Candidatos</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-white mb-1 flex items-center justify-center gap-2">
                  <Eye className="w-4 h-4 text-[#8B5CF6]" /> {vaga.views}
                </p>
                <p className="text-xs text-[#64748B] uppercase tracking-wider">Visualizações</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 w-full lg:w-auto lg:border-l lg:border-white/10 lg:pl-6 justify-end">
              <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors" title="Ver Candidatos">
                <Users className="w-4 h-4" />
              </button>
              <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors" title="Editar Vaga">
                <Edit className="w-4 h-4" />
              </button>
              <button className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors" title="Fechar Vaga">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
