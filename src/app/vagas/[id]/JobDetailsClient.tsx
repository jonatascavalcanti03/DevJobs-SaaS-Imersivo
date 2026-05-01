"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Building2, MapPin, Briefcase, TrendingUp, DollarSign, ArrowLeft, Send, CheckCircle2, Loader2, Crown } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Navbar from "@/components/ui/Navbar";

function formatSalary(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

const typeLabels: Record<string, string> = {
  REMOTE: "Remoto",
  HYBRID: "Híbrido",
  ONSITE: "Presencial",
};

const levelLabels: Record<string, string> = {
  INTERN: "Estágio",
  JUNIOR: "Júnior",
  MID: "Pleno",
  SENIOR: "Sênior",
  LEAD: "Lead",
};

export default function JobDetailsClient({ job }: { job: any }) {
  const { data: session } = useSession();
  const router = useRouter();
  
  const [isApplying, setIsApplying] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);
  const [error, setError] = useState("");
  const [coverLetter, setCoverLetter] = useState("");

  const handleApply = async () => {
    if (!session) {
      router.push("/login");
      return;
    }

    if ((session.user as any).role !== "CANDIDATE") {
      setError("Apenas candidatos podem se aplicar a vagas.");
      return;
    }

    setIsApplying(true);
    setError("");

    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId: job.id, coverLetter }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Erro ao se candidatar");
      }

      setApplySuccess(true);
      toast.success("Candidatura enviada com sucesso!");
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message || "Erro ao enviar candidatura");
    } finally {
      setIsApplying(false);
    }
  };

  let tagsArray = [];
  try {
    tagsArray = JSON.parse(job.tags);
  } catch {
    tagsArray = [];
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-bg pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Voltar */}
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Voltar para vagas
          </button>

          {/* Header da Vaga */}
          <div className="glass-card rounded-3xl p-8 relative overflow-hidden">
            {job.isPremium && (
              <div className="absolute top-0 right-0 p-4">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F59E0B]/20 border border-[#F59E0B]/30">
                  <Crown className="w-4 h-4 text-[#FBBF24]" />
                  <span className="text-xs font-bold text-[#FBBF24] uppercase">Premium</span>
                </div>
              </div>
            )}

            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
              <div className="w-20 h-20 rounded-2xl bg-surface border border-border flex flex-shrink-0 items-center justify-center p-2">
                {job.companyLogo ? (
                  <img src={job.companyLogo} alt={job.company} className="w-full h-full object-contain" />
                ) : (
                  <Building2 className="w-8 h-8 text-text-muted" />
                )}
              </div>
              
              <div className="flex-1">
                <h1 className="text-2xl md:text-3xl font-bold text-text-primary mb-2">{job.title}</h1>
                <p className="text-lg text-text-secondary mb-4">{job.company}</p>
                
                <div className="flex flex-wrap gap-4">
                  <span className="flex items-center gap-2 text-sm text-text-primary bg-surface px-3 py-1.5 rounded-lg border border-border">
                    <MapPin className="w-4 h-4 text-[#06B6D4]" /> {job.location}
                  </span>
                  <span className="flex items-center gap-2 text-sm text-text-primary bg-surface px-3 py-1.5 rounded-lg border border-border">
                    <Briefcase className="w-4 h-4 text-[#8B5CF6]" /> {typeLabels[job.type]}
                  </span>
                  <span className="flex items-center gap-2 text-sm text-text-primary bg-surface px-3 py-1.5 rounded-lg border border-border">
                    <TrendingUp className="w-4 h-4 text-[#10B981]" /> {levelLabels[job.level]}
                  </span>
                  {(job.salaryMin || job.salaryMax) && (
                    <span className="flex items-center gap-2 text-sm text-text-primary bg-surface px-3 py-1.5 rounded-lg border border-border">
                      <DollarSign className="w-4 h-4 text-[#F59E0B]" /> 
                      {job.salaryMin && job.salaryMax
                        ? `${formatSalary(job.salaryMin)} - ${formatSalary(job.salaryMax)}`
                        : job.salaryMin
                        ? `A partir de ${formatSalary(job.salaryMin)}`
                        : `Até ${formatSalary(job.salaryMax!)}`}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Conteúdo Principal */}
            <div className="lg:col-span-2 space-y-8">
              <div className="glass-card rounded-3xl p-8">
                <h2 className="text-xl font-bold text-text-primary mb-6">Descrição da Vaga</h2>
                <div className="text-text-secondary leading-relaxed whitespace-pre-wrap">
                  {(job.description || "").replace(/<[^>]*>/g, "")}
                </div>
                
                <div className="mt-8 pt-8 border-t border-border">
                  <h3 className="text-lg font-bold text-text-primary mb-4">Tecnologias e Requisitos</h3>
                  <div className="flex flex-wrap gap-2">
                    {tagsArray.map((tag: string) => (
                      <span key={tag} className="px-3 py-1.5 rounded-xl bg-[#6366F1]/10 text-[#818CF8] border border-[#6366F1]/20 text-sm font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar / Apply Form */}
            <div className="space-y-6">
              <div className="glass-card rounded-3xl p-6 sticky top-24">
                {applySuccess ? (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                    </div>
                    <h3 className="text-xl font-bold text-text-primary mb-2">Candidatura Enviada!</h3>
                    <p className="text-text-secondary text-sm">O recrutador da {job.company} já tem acesso ao seu perfil.</p>
                    <button onClick={() => router.push("/candidato/candidaturas")} className="mt-6 w-full py-3 rounded-xl border border-border text-text-primary font-semibold hover:bg-surface-hover transition-colors">
                      Ver minhas candidaturas
                    </button>
                  </motion.div>
                ) : (
                  <>
                    <h3 className="text-xl font-bold text-text-primary mb-4">Candidatar-se</h3>
                    
                    {error && (
                      <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-4">
                        {error}
                      </div>
                    )}

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-text-secondary mb-2">Carta de Apresentação (Opcional)</label>
                        <textarea
                          value={coverLetter}
                          onChange={(e) => setCoverLetter(e.target.value)}
                          placeholder="Diga por que você é a pessoa certa para esta vaga..."
                          rows={4}
                          className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-text-primary placeholder-text-muted outline-none focus:border-[#6366F1]/50 focus:bg-surface-hover transition-all resize-none"
                        />
                      </div>

                      <button
                        onClick={handleApply}
                        disabled={isApplying}
                        className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#06B6D4] text-white font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {isApplying ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                        {isApplying ? "Enviando..." : "Enviar Candidatura"}
                      </button>
                      
                      <p className="text-xs text-text-muted text-center mt-4">
                        Ao se candidatar, seu perfil completo será compartilhado com a empresa.
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
