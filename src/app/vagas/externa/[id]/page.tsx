"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  Building2, 
  MapPin, 
  Briefcase, 
  TrendingUp, 
  DollarSign, 
  Clock, 
  ChevronLeft, 
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Loader2,
  Globe,
  Bookmark,
  BookmarkCheck
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Footer from "@/components/ui/Footer";
import { useSession } from "next-auth/react";
import Navbar from "@/components/ui/Navbar";


// ─── Helpers ─────────────────────────────────────────────────

function formatSalary(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function timeAgo(dateStr: string): string {
  if (!dateStr) return "Postada recentemente";
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Hoje";
  if (diffDays === 1) return "Ontem";
  if (diffDays < 7) return `${diffDays} dias atrás`;
  return `${Math.floor(diffDays / 7)} sem. atrás`;
}

export default function ExternalJobDetailsPage() {
  const { data: session } = useSession();
  const params = useParams();
  const router = useRouter();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);

  // O ID vem como adzuna_12345
  const adzunaId = (params.id as string)?.replace("adzuna_", "");

  const handleToggleSave = async () => {
    if (!session) {
      if (confirm("Você precisa estar logado para salvar vagas. Ir para login?")) {
        window.location.href = "/login";
      }
      return;
    }

    try {
      setLoadingSave(true);
      const res = await fetch("/api/user/saved-jobs", {
        method: "POST",
        body: JSON.stringify({ jobId: `adzuna_${adzunaId}`, isExternal: true }),
        headers: { "Content-Type": "application/json" }
      });
      const data = await res.json();
      if (res.ok) {
        setIsSaved(data.saved);
      }
    } catch (err) {
      console.error("Erro ao salvar vaga:", err);
    } finally {
      setLoadingSave(false);
    }
  };

  useEffect(() => {
    async function fetchJobDetails() {
      if (!adzunaId) return;
      try {
        setLoading(true);
        // Usamos nossa própria API de busca externa para pegar os dados
        // mas filtramos pelo ID (Adzuna permite isso na busca)
        const res = await fetch(`/api/jobs/external?q=${adzunaId}&per_page=1`);
        if (res.ok) {
          const data = await res.json();
          if (data.jobs && data.jobs.length > 0) {
            setJob(data.jobs[0]);
          } else {
            setError(true);
          }
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Erro ao carregar detalhes da vaga externa:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchJobDetails();
  }, [adzunaId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-[#6366F1] animate-spin" />
        <p className="text-text-secondary animate-pulse">Carregando detalhes da vaga...</p>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-bg flex flex-col items-center justify-center p-6 text-center">
        <AlertCircle className="w-16 h-16 text-red-500/50 mb-4" />
        <h1 className="text-2xl font-bold text-white mb-2">Vaga não encontrada</h1>
        <p className="text-text-secondary mb-8 max-w-md">
          Não conseguimos localizar os detalhes desta vaga externa. Ela pode ter sido removida ou expirado no site parceiro.
        </p>
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 text-white border border-white/10 hover:bg-white/10 transition-all"
        >
          <ChevronLeft className="w-4 h-4" /> Voltar para busca
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg text-text-primary">
      <Navbar />
      {/* ── Navbar Spacer ── */}
      <div className="h-20" />

      <main className="max-w-5xl mx-auto px-4 py-8">
        
        {/* Back Button */}
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-text-secondary hover:text-text-primary mb-8 group transition-colors"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Voltar para as vagas
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content (Left) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Header Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6 sm:p-8 rounded-3xl border border-white/5 relative overflow-hidden"
            >
              {/* Badge Parceiro */}
              <div className="absolute top-0 right-0 px-6 py-2 bg-white/5 border-l border-b border-white/10 rounded-bl-3xl flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#64748B]" />
                <span className="text-xs font-semibold text-[#64748B] uppercase">Vaga via Parceiro</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                  {job.companyLogo ? (
                    <img src={job.companyLogo} alt={job.company} className="w-12 h-12 object-contain" />
                  ) : (
                    <Building2 className="w-10 h-10 text-[#6366F1]/50" />
                  )}
                </div>

                <div className="flex-1 space-y-2">
                  <h1 className="text-2xl sm:text-3xl font-bold text-text-primary leading-tight">
                    {job.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-4 text-text-secondary">
                    <span className="flex items-center gap-1.5">
                      <Building2 className="w-4 h-4 text-[#6366F1]" />
                      {job.company}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-[#06B6D4]" />
                      {job.location}
                    </span>
                  </div>
                </div>
              </div>

              {/* Meta Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-8 border-t border-white/5">
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-wider text-[#64748B] font-bold">Modelo</p>
                  <p className="text-sm font-medium flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4 text-[#8B5CF6]" />
                    {job.type}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-wider text-[#64748B] font-bold">Nível</p>
                  <p className="text-sm font-medium flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-[#10B981]" />
                    {job.level}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-wider text-[#64748B] font-bold">Publicada</p>
                  <p className="text-sm font-medium flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-[#6366F1]" />
                    {timeAgo(job.createdAt)}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-wider text-[#64748B] font-bold">Salário</p>
                  <p className="text-sm font-medium text-[#10B981]">
                    {job.salaryMin ? formatSalary(job.salaryMin) : "A combinar"}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Description */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card p-6 sm:p-8 rounded-3xl border border-white/5"
            >
              <h2 className="text-xl font-bold text-text-primary mb-6 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-[#6366F1]" />
                Descrição da Vaga
              </h2>
              
              <div className="prose max-w-none text-text-secondary leading-relaxed space-y-4">
                <p>{(job.description || "").replace(/<[^>]*>/g, "")}</p>
              </div>

              <div className="mt-10 p-6 rounded-2xl bg-[#6366F1]/5 border border-[#6366F1]/10 flex flex-col sm:flex-row items-center gap-6">
                <div className="p-3 rounded-full bg-[#6366F1]/20">
                  <ShieldCheck className="w-8 h-8 text-[#6366F1]" />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h4 className="font-bold text-text-primary mb-1">Candidatura Segura</h4>
                  <p className="text-sm text-text-secondary">
                    Esta vaga é gerenciada pelo nosso parceiro. Ao clicar em "Candidatar-se", você será redirecionado para o site oficial da vaga.
                  </p>
                </div>
                <a 
                  href={job.externalUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white font-bold flex items-center justify-center gap-2 hover:scale-105 transition-all shadow-lg shadow-[#6366F1]/20"
                >
                  Candidatar-se agora <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          </div>

          {/* Sidebar (Right) */}
          <div className="space-y-6">
            {/* Quick Apply Card */}
            <div className="glass-card p-6 rounded-3xl border border-white/5 sticky top-24">
              <h3 className="font-bold text-text-primary mb-4">Interessado?</h3>
              <p className="text-sm text-text-secondary mb-6">
                Esta vaga está aberta no momento. Recomendamos que você se candidate o quanto antes.
              </p>
              
              <a 
                href={job.externalUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full px-6 py-4 rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] text-white font-bold flex items-center justify-center gap-2 mb-3 transition-all"
              >
                Candidatar-se <ExternalLink className="w-4 h-4" />
              </a>

              <button 
                onClick={handleToggleSave}
                disabled={loadingSave}
                className={`w-full px-6 py-4 rounded-xl border font-bold flex items-center justify-center gap-2 mb-4 transition-all ${
                  isSaved 
                    ? "bg-[#6366F1]/20 border-[#6366F1]/30 text-[#818CF8]" 
                    : "bg-white/5 border-white/10 text-text-primary hover:bg-white/10"
                }`}
              >
                {isSaved ? (
                  <> <BookmarkCheck className="w-4 h-4" /> Vaga Salva </>
                ) : (
                  <> <Bookmark className="w-4 h-4" /> Salvar esta Vaga </>
                )}
              </button>

              <div className="pt-4 border-t border-white/5 space-y-3">
                <div className="flex items-center gap-2 text-xs text-[#64748B]">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  Link verificado por Adzuna
                </div>
                <div className="flex items-center gap-2 text-xs text-[#64748B]">
                  <DollarSign className="w-4 h-4 text-emerald-500" />
                  Estimativa salarial inclusa
                </div>
              </div>
            </div>

            {/* Why Match.js Badge */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-[#6366F1]/10 to-transparent border border-[#6366F1]/20">
              <h4 className="font-bold text-[#818CF8] mb-2 flex items-center gap-2">
                <Zap className="w-4 h-4" /> Match.js PRO
              </h4>
              <p className="text-xs text-text-secondary">
                Seja um candidato PRO para ter prioridade e match de skills em vagas verificadas.
              </p>
              <Link href="/candidato/pro" className="inline-block mt-4 text-xs font-bold text-text-primary hover:underline">
                Saiba mais →
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function Zap({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  );
}
