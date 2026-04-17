"use client";

import { motion } from "framer-motion";
import { Briefcase, ExternalLink, Filter } from "lucide-react";
import StatusBadge from "@/components/ui/StatusBadge";

const MINHAS_CANDIDATURAS = [
  { id: "1", vaga: "Engenheiro(a) Frontend React", empresa: "Google Brasil", data: "15 Abr 2026", status: "REVIEWED", type: "REMOTE", salary: "R$ 15.000" },
  { id: "2", vaga: "Desenvolvedor(a) Full-Stack", empresa: "Meta", data: "12 Abr 2026", status: "PENDING", type: "HYBRID", salary: "A combinar" },
  { id: "3", vaga: "Backend Developer Python", empresa: "Nubank", data: "05 Abr 2026", status: "REJECTED", type: "REMOTE", salary: "R$ 14.000" },
  { id: "4", vaga: "Mobile Developer React Native", empresa: "iFood", data: "20 Mar 2026", status: "ACCEPTED", type: "ONSITE", salary: "R$ 16.500" },
  { id: "5", vaga: "UX/UI Engineer", empresa: "Spotify", data: "10 Mar 2026", status: "PENDING", type: "REMOTE", salary: "R$ 12.000" },
];

export default function CandidaturasPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Minhas Candidaturas
          </motion.h1>
          <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="text-[#94A3B8]">
            Acompanhe o status dos processos seletivos que você participa.
          </motion.p>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex gap-2"
        >
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-sm font-medium border border-white/10 transition-colors">
            <Filter className="w-4 h-4" /> Filtrar
          </button>
        </motion.div>
      </div>

      <div className="glass-card rounded-3xl p-6 sm:p-8">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10">
                <th className="px-6 py-4 text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">Vaga / Empresa</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">Modelo / Salário</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">Data da Aplicação</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#94A3B8] uppercase tracking-wider text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {MINHAS_CANDIDATURAS.map((item, index) => (
                <motion.tr 
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="hover:bg-white/5 transition-colors group"
                >
                  <td className="px-6 py-5">
                    <p className="text-base font-bold text-white group-hover:text-[#818CF8] transition-colors">{item.vaga}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-[#94A3B8]">{item.empresa}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-sm text-white">{item.type}</p>
                    <p className="text-xs text-[#64748B] mt-1">{item.salary}</p>
                  </td>
                  <td className="px-6 py-5 text-sm text-[#94A3B8]">{item.data}</td>
                  <td className="px-6 py-5">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white text-sm font-medium transition-colors flex items-center gap-2 ml-auto">
                      Ver detalhes <ExternalLink className="w-4 h-4" />
                    </button>
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
