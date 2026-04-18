"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Briefcase, ExternalLink, Filter, Loader2, Building2, MapPin, Calendar, CheckCircle2, XCircle, Clock } from "lucide-react";
import StatusBadge from "@/components/ui/StatusBadge";
import Link from "next/link";

export default function CandidaturasPage() {
  const [candidaturas, setCandidaturas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchApplications() {
      try {
        const res = await fetch("/api/applications");
        if (res.ok) {
          const data = await res.json();
          setCandidaturas(data);
        }
      } catch (error) {
        console.error("Erro ao buscar candidaturas:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchApplications();
  }, []);

  return (
    <div className="space-y-8 pb-20 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-3xl sm:text-4xl font-extrabold text-white mb-2 tracking-tight">
            Minhas Candidaturas
          </motion.h1>
          <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="text-[#94A3B8] text-lg">
            Acompanhe o status dos processos seletivos que você participa.
          </motion.p>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex gap-2"
        >
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-sm font-bold border border-white/10 transition-colors">
            <Filter className="w-4 h-4" /> Filtrar Status
          </button>
        </motion.div>
      </div>

      <div className="min-h-[400px]">
        {loading ? (
          <div className="flex items-center justify-center h-full min-h-[300px]">
            <Loader2 className="w-10 h-10 text-[#06B6D4] animate-spin" />
          </div>
        ) : candidaturas.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-center glass-card rounded-3xl p-10">
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
              <Briefcase className="w-8 h-8 text-[#64748B]" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Nenhuma candidatura ainda</h2>
            <p className="text-[#94A3B8] mb-6 max-w-md">Você ainda não se candidatou a nenhuma vaga. Explore nossa plataforma e encontre a oportunidade perfeita para você.</p>
            <Link href="/vagas" className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#06B6D4] to-[#6366F1] text-white font-bold hover:scale-105 transition-transform shadow-lg shadow-[#6366F1]/25">
              Explorar vagas agora
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {candidaturas.map((item, index) => {
              const isAccepted = item.status === 'ACCEPTED';
              const isRejected = item.status === 'REJECTED';
              const isPending = item.status === 'PENDING';

              return (
                <motion.div 
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative rounded-3xl p-[1px] ${isAccepted ? 'shadow-2xl shadow-emerald-500/20' : isRejected ? 'opacity-80' : 'hover:shadow-xl hover:shadow-[#06B6D4]/5 transition-shadow'}`}
                >
                  {/* Borda Condicional */}
                  {isAccepted && <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 via-teal-500 to-emerald-600 rounded-3xl opacity-100" />}
                  {isRejected && <div className="absolute inset-0 bg-red-500/30 rounded-3xl" />}
                  {isPending && <div className="absolute inset-0 bg-white/10 rounded-3xl" />}

                  <div className={`relative h-full rounded-[23px] flex flex-col p-6 sm:p-8 ${isAccepted ? "bg-[#061F1A]" : isRejected ? "bg-[#1A0B0E]" : "bg-[#0F172A]"}`}>
                    
                    {/* Cabeçalho do Card */}
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center p-2 shadow-inner flex-shrink-0">
                          {item.job.companyLogo ? (
                            <img src={item.job.companyLogo} alt={item.job.company} className="w-full h-full object-contain" />
                          ) : (
                            <Building2 className="w-6 h-6 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white line-clamp-1">{item.job.title}</h3>
                          <p className="text-[#06B6D4] font-medium mt-0.5">{item.job.company}</p>
                        </div>
                      </div>
                      <StatusBadge status={item.status} />
                    </div>

                    {/* Detalhes da Vaga */}
                    <div className="grid grid-cols-2 gap-y-3 mb-6">
                      <div className="flex items-center gap-2 text-sm text-[#94A3B8]">
                        <MapPin className="w-4 h-4 text-[#64748B]" />
                        <span className="truncate">{item.job.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-[#94A3B8]">
                        <Briefcase className="w-4 h-4 text-[#64748B]" />
                        <span>{item.job.type === 'REMOTE' ? 'Remoto' : item.job.type === 'HYBRID' ? 'Híbrido' : 'Presencial'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-[#94A3B8] col-span-2">
                        <Calendar className="w-4 h-4 text-[#64748B]" />
                        <span>Aplicado em: <strong className="text-[#E2E8F0]">{new Date(item.appliedAt).toLocaleDateString("pt-BR")}</strong></span>
                      </div>
                    </div>

                    {/* Feedback Visual Baseado no Status */}
                    <div className="flex-1">
                      {isAccepted && (
                        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-bold text-emerald-400 mb-1">Parabéns! Seu perfil foi Aprovado.</p>
                            <p className="text-xs text-emerald-400/80">A empresa entrará em contato com você em breve pelo e-mail cadastrado para os próximos passos.</p>
                          </div>
                        </div>
                      )}
                      {isRejected && (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3">
                          <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-bold text-red-400 mb-1">Processo encerrado.</p>
                            <p className="text-xs text-red-400/80">A empresa optou por seguir com outros candidatos no momento. Continue buscando, sua vaga ideal está te esperando!</p>
                          </div>
                        </div>
                      )}
                      {isPending && (
                        <div className="bg-blue-500/5 border border-blue-500/10 rounded-xl p-4 flex items-start gap-3">
                          <Clock className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-bold text-blue-400 mb-1">Currículo em análise</p>
                            <p className="text-xs text-blue-400/80">Seu currículo foi enviado com sucesso e está na fila para ser analisado pelos recrutadores da {item.job.company}.</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Footer / Botão */}
                    <div className="mt-6 pt-6 border-t border-white/5 flex justify-end">
                      <Link href={`/vagas/${item.jobId}`}>
                        <button className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-sm font-bold transition-colors flex items-center gap-2">
                          Detalhes da Vaga <ExternalLink className="w-4 h-4" />
                        </button>
                      </Link>
                    </div>

                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
