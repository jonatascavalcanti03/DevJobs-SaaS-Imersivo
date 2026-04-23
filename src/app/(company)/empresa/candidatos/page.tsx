"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Filter, Download, Star, Loader2, X, FileText, Globe, Code2, ExternalLink, BadgeCheck, Zap } from "lucide-react";
import StatusBadge from "@/components/ui/StatusBadge";
import { AnimatePresence } from "framer-motion";

// Componente visual do medidor de match
function MatchMeter({ score }: { score: number }) {
  const color =
    score >= 80 ? "text-emerald-400 border-emerald-500/40" :
    score >= 60 ? "text-[#06B6D4] border-[#06B6D4]/40" :
    score >= 40 ? "text-[#FBBF24] border-[#FBBF24]/40" :
                  "text-[#94A3B8] border-white/20";

  return (
    <div className={`inline-flex flex-col items-center justify-center w-14 h-14 rounded-full border-4 ${color} relative`}>
      <span className="text-xs font-bold">{score}%</span>
    </div>
  );
}

export default function EmpresaCandidatosPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [candidatos, setCandidatos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProfile, setSelectedProfile] = useState<any>(null);

  useEffect(() => {
    async function fetchCandidates() {
      try {
        const res = await fetch("/api/applications");
        if (res.ok) {
          const data = await res.json();
          setCandidatos(data);
        }
      } catch (error) {
        console.error("Erro ao buscar candidatos:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchCandidates();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setCandidatos((prev) =>
          prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
        );
      }
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
    }
  };

  const filteredCandidatos = candidatos.filter((c) =>
    c.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.user?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.job?.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const proCount = filteredCandidatos.filter((c) => c.user?.isPro).length;

  return (
    <div className="space-y-8">
      {/* Modal de Perfil do Candidato */}
      <AnimatePresence>
        {selectedProfile && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedProfile(null)}
              className="absolute inset-0 bg-[#050510]/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-[#0F172A] border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl z-10 max-h-[90vh] overflow-y-auto"
            >
              <button onClick={() => setSelectedProfile(null)} className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-[#94A3B8] hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col md:flex-row gap-6 items-start md:items-center mb-8">
                <div className="relative w-24 h-24 flex-shrink-0">
                  <div className="w-24 h-24 rounded-full border-4 border-[#06B6D4]/20 flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#06B6D4]/30 to-[#6366F1]/30">
                    {selectedProfile.image ? (
                      <img src={selectedProfile.image} alt={selectedProfile.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-3xl font-bold text-white">{(selectedProfile.name || "U").charAt(0)}</span>
                    )}
                  </div>
                  {selectedProfile.isPro && (
                    <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-gradient-to-br from-[#F59E0B] to-[#F97316] flex items-center justify-center border-2 border-[#0F172A]" title="Candidato PRO">
                      <Star className="w-3.5 h-3.5 text-white fill-white" />
                    </div>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-2xl font-bold text-white">{selectedProfile.name}</h2>
                    {selectedProfile.isPro && (
                      <span className="px-2 py-0.5 rounded-full bg-[#F59E0B]/20 border border-[#F59E0B]/30 text-[#FBBF24] text-xs font-bold flex items-center gap-1">
                        <Star className="w-3 h-3 fill-current" /> PRO
                      </span>
                    )}
                  </div>
                  <p className="text-[#06B6D4] text-lg font-medium">{selectedProfile.title || "Desenvolvedor"}</p>
                  <p className="text-[#94A3B8] text-sm mt-1">{selectedProfile.email}</p>
                  {selectedProfile.matchScore && (
                    <p className="text-sm mt-1">
                      Match com a vaga: <strong className={selectedProfile.matchScore >= 70 ? "text-emerald-400" : "text-[#FBBF24]"}>{selectedProfile.matchScore}%</strong>
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                    <Code2 className="w-5 h-5 text-[#8B5CF6]" /> Habilidades
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProfile.skills ? (
                      (() => {
                        let skillList: string[] = [];
                        try { skillList = JSON.parse(selectedProfile.skills); } catch { skillList = selectedProfile.skills.split(","); }
                        return skillList.map((skill: string, idx: number) => (
                          <span key={idx} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[#E2E8F0] text-sm">{skill.trim()}</span>
                        ));
                      })()
                    ) : (
                      <span className="text-[#64748B] text-sm">Nenhuma habilidade informada.</span>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-[#10B981]" /> Links Profissionais
                  </h3>
                  <div className="flex flex-col gap-3">
                    {selectedProfile.linkedin && (
                      <a href={selectedProfile.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-[#94A3B8] hover:text-[#06B6D4] transition-colors bg-white/5 p-3 rounded-xl border border-white/5 w-fit">
                        <ExternalLink className="w-5 h-5" /> LinkedIn
                      </a>
                    )}
                    {selectedProfile.portfolio && (
                      <a href={selectedProfile.portfolio} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-[#94A3B8] hover:text-[#06B6D4] transition-colors bg-white/5 p-3 rounded-xl border border-white/5 w-fit">
                        <Globe className="w-5 h-5" /> Portfólio
                      </a>
                    )}
                    {!selectedProfile.linkedin && !selectedProfile.portfolio && (
                      <span className="text-[#64748B] text-sm">Nenhum link informado.</span>
                    )}
                  </div>
                </div>

                {selectedProfile.resume && (
                  <div className="pt-4 border-t border-white/5">
                    <a href={selectedProfile.resume} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#06B6D4] to-[#6366F1] text-white font-bold hover:opacity-90 transition-opacity">
                      <Download className="w-5 h-5" /> Baixar Currículo PDF
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Banco de Candidatos
          </motion.h1>
          <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="text-[#94A3B8]">
            Candidatos ordenados por <span className="text-[#FBBF24] font-medium">PRO</span> primeiro, depois por <span className="text-emerald-400 font-medium">match de habilidades</span>.
          </motion.p>
        </div>
        {proCount > 0 && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#F59E0B]/10 border border-[#F59E0B]/20">
            <Star className="w-4 h-4 text-[#FBBF24] fill-[#FBBF24]" />
            <span className="text-[#FBBF24] text-sm font-bold">{proCount} candidato{proCount > 1 ? "s" : ""} PRO</span>
          </motion.div>
        )}
      </div>

      {/* Legend */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-card rounded-2xl p-4 flex flex-wrap gap-5 text-sm text-[#94A3B8]">
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-400" />Match ≥ 80% — Excelente</div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#06B6D4]" />Match 60–79% — Bom</div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#FBBF24]" />Match 40–59% — Regular</div>
        <div className="flex items-center gap-2"><Star className="w-3 h-3 text-[#FBBF24] fill-[#FBBF24]" />Candidato PRO — Aparecem primeiro</div>
      </motion.div>

      {/* Filters & Search */}
      <div className="glass-card rounded-2xl p-4 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
          <input
            type="text"
            placeholder="Buscar candidato por nome ou vaga..."
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
      <div className="glass-card rounded-3xl overflow-hidden min-h-[400px]">
        {loading ? (
          <div className="flex items-center justify-center h-full min-h-[300px]">
            <Loader2 className="w-10 h-10 text-[#06B6D4] animate-spin" />
          </div>
        ) : filteredCandidatos.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-center p-6">
            <p className="text-[#94A3B8] mb-2">Nenhum candidato encontrado.</p>
            <p className="text-sm text-[#64748B]">Suas vagas ainda não receberam candidaturas ou os filtros não retornaram resultados.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="px-6 py-4 text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">Candidato</th>
                  <th className="px-6 py-4 text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">Aplicou para</th>
                  <th className="px-6 py-4 text-xs font-semibold text-[#94A3B8] uppercase tracking-wider text-center">
                    Match <span className="text-[#06B6D4] normal-case">(skills)</span>
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold text-[#94A3B8] uppercase tracking-wider text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredCandidatos.map((candidato, index) => (
                  <motion.tr
                    key={candidato.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`transition-colors group hover:bg-white/5 ${candidato.user?.isPro ? "bg-[#F59E0B]/5" : ""}`}
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="relative w-10 h-10 flex-shrink-0">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center border overflow-hidden bg-gradient-to-br ${candidato.user?.isPro ? "border-[#F59E0B]/40 from-[#F59E0B]/30 to-[#F97316]/30" : "border-white/10 from-[#06B6D4]/30 to-[#6366F1]/30"}`}>
                            {candidato.user.image ? (
                              <img src={candidato.user.image} alt={candidato.user.name} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-white font-bold text-sm">{(candidato.user.name || "U").charAt(0)}</span>
                            )}
                          </div>
                          {candidato.user?.isPro && (
                            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-gradient-to-br from-[#F59E0B] to-[#F97316] flex items-center justify-center border border-[#0F172A]">
                              <Star className="w-2.5 h-2.5 text-white fill-white" />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <p className="text-sm font-bold text-white">{candidato.user.name}</p>
                            {candidato.user?.isPro && (
                              <span className="px-1.5 py-0.5 rounded bg-[#F59E0B]/20 text-[#FBBF24] text-[10px] font-bold">PRO</span>
                            )}
                          </div>
                          <p className="text-xs text-[#06B6D4] mt-0.5">{candidato.user.title || "Desenvolvedor"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-sm text-white truncate max-w-[200px]">{candidato.job.title}</p>
                      <p className="text-xs text-[#64748B] mt-0.5">{new Date(candidato.appliedAt).toLocaleDateString("pt-BR")}</p>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <MatchMeter score={candidato.matchScore ?? 50} />
                    </td>
                    <td className="px-6 py-5">
                      <StatusBadge status={candidato.status} />
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedProfile({ ...candidato.user, matchScore: candidato.matchScore })}
                          className="px-3 py-1.5 rounded-lg bg-[#6366F1]/10 hover:bg-[#6366F1]/20 text-[#818CF8] text-sm font-medium transition-colors"
                        >
                          Ver Perfil
                        </button>

                        {candidato.status === "PENDING" ? (
                          <div className="flex gap-2 ml-2">
                            <button
                              onClick={() => handleUpdateStatus(candidato.id, "ACCEPTED")}
                              className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-sm font-medium transition-colors"
                            >
                              Aprovar
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(candidato.id, "REJECTED")}
                              className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm font-medium transition-colors"
                            >
                              Rejeitar
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleUpdateStatus(candidato.id, "PENDING")}
                            className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#94A3B8] text-sm font-medium transition-colors ml-2"
                          >
                            Desfazer
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
