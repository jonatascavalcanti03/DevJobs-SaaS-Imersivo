"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Briefcase, Eye, Bookmark, ExternalLink, ArrowRight, Star, Loader2, Bell } from "lucide-react";
import StatsCard from "@/components/ui/StatsCard";
import StatusBadge from "@/components/ui/StatusBadge";
import JobCard from "@/components/ui/JobCard";
import { type JobData } from "@/components/ui/JobCard";
import Link from "next/link";
import ActivityChart from "@/components/ui/ActivityChart";

import { useSession } from "next-auth/react";

export default function CandidateDashboard() {
  const { data: session } = useSession();
  const firstName = session?.user?.name?.split(" ")[0] || "Visitante";
  
  const [recommendedJobs, setRecommendedJobs] = useState<JobData[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  
  const [candidaturas, setCandidaturas] = useState<any[]>([]);
  const [totalApps, setTotalApps] = useState(0);
  const [loadingApps, setLoadingApps] = useState(true);
  
  const [savedJobsCount, setSavedJobsCount] = useState(0);
  const [alertsCount, setAlertsCount] = useState(0);

  useEffect(() => {
    async function fetchRecommendedJobs() {
      try {
        const res = await fetch("/api/jobs?status=ACTIVE", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          const parsedJobs = data.slice(0, 2).map((job: any) => {
            let tagsArray = [];
            try {
              tagsArray = JSON.parse(job.tags);
            } catch {
              tagsArray = [];
            }
            return {
              id: job.id,
              title: job.title,
              company: job.company,
              companyLogo: job.companyLogo,
              location: job.location,
              type: job.type,
              level: job.level,
              salaryMin: job.salaryMin,
              salaryMax: job.salaryMax,
              tags: tagsArray,
              isPremium: job.isPremium,
              createdAt: job.createdAt,
            };
          });
          setRecommendedJobs(parsedJobs);
        }
      } catch (error) {
        console.error("Erro ao buscar vagas recomendadas:", error);
      } finally {
        setLoadingJobs(false);
      }
    }
    fetchRecommendedJobs();
  }, []);

  useEffect(() => {
    async function fetchRecentApps() {
      try {
        const res = await fetch("/api/applications", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          setTotalApps(data.length);
          setCandidaturas(data.slice(0, 3)); // Pegar apenas as 3 mais recentes
        }
      } catch (error) {
        console.error("Erro ao buscar candidaturas recentes:", error);
      } finally {
        setLoadingApps(false);
      }
    }
    
    async function fetchAdditionalStats() {
      try {
        const [savedRes, alertsRes] = await Promise.all([
          fetch("/api/user/saved-jobs", { cache: "no-store" }),
          fetch("/api/user/alerts", { cache: "no-store" })
        ]);
        if (savedRes.ok) {
          const data = await savedRes.json();
          setSavedJobsCount(data.length || 0);
        }
        if (alertsRes.ok) {
           const data = await alertsRes.json();
           setAlertsCount(data.length || 0);
        }
      } catch (error) {
        console.error("Erro ao buscar stats adicionais:", error);
      }
    }

    if (session?.user) {
      fetchRecentApps();
      fetchAdditionalStats();
    }
  }, [session]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-2xl sm:text-3xl font-bold text-text-primary mb-1">
            Olá, {firstName}! 👋
          </motion.h1>
          <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="text-text-secondary">
            Aqui está o resumo da sua carreira hoje.
          </motion.p>
        </div>
        <motion.a
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          href="/vagas"
          className="px-5 py-2.5 rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] text-text-primary text-sm font-semibold shadow-lg shadow-[#6366F1]/25 transition-colors"
        >
          Encontrar Vagas
        </motion.a>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatsCard icon={Briefcase} label="Candidaturas" value={loadingApps ? "..." : totalApps.toString()} trend={{ value: 15, positive: true }} index={0} />
        <StatsCard icon={Bookmark} label="Vagas Salvas" value={savedJobsCount.toString()} index={1} />
        <StatsCard icon={Bell} label="Alertas" value={alertsCount.toString()} index={2} />
        <div className="lg:col-span-1">
           <ActivityChart />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Minhas Candidaturas */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold text-text-primary">Candidaturas Recentes</h2>
            <Link href="/candidato/candidaturas" className="text-sm font-medium text-[#6366F1] hover:text-[#818CF8] transition-colors">Ver todas</Link>
          </div>
          
          <div className="glass-card rounded-2xl overflow-hidden min-h-[200px]">
            {loadingApps ? (
              <div className="flex justify-center items-center h-full min-h-[200px]">
                <Loader2 className="w-8 h-8 text-[#6366F1] animate-spin" />
              </div>
            ) : candidaturas.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full min-h-[260px] text-center p-8">
                <div className="w-16 h-16 rounded-2xl bg-surface flex items-center justify-center mb-4 border border-border">
                  <Briefcase className="w-8 h-8 text-[#64748B]" />
                </div>
                <h3 className="text-lg font-bold text-text-primary mb-2">Sem candidaturas recentes</h3>
                <p className="text-text-secondary text-sm max-w-[280px] mb-6">
                  Você ainda não se candidatou a nenhuma vaga. Comece a explorar oportunidades agora!
                </p>
                <Link 
                  href="/vagas" 
                  className="px-6 py-2.5 rounded-xl bg-[#6366F1]/10 text-[#818CF8] border border-[#6366F1]/20 font-semibold hover:bg-[#6366F1]/20 transition-all"
                >
                  Explorar Vagas
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border bg-surface">
                      <th className="px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">Vaga</th>
                      <th className="px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">Data</th>
                      <th className="px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-wider text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {candidaturas.map((item, index) => (
                      <motion.tr 
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="hover:bg-surface transition-colors group"
                      >
                        <td className="px-6 py-4">
                          <p className="text-sm font-semibold text-text-primary group-hover:text-[#818CF8] transition-colors">{item.job.title}</p>
                          <p className="text-xs text-[#64748B] mt-0.5">{item.job.company}</p>
                        </td>
                        <td className="px-6 py-4 text-sm text-text-secondary">
                          {new Date(item.appliedAt).toLocaleDateString("pt-BR")}
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={item.status} />
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Link href={`/vagas/${item.jobId}`}>
                            <button className="p-2 rounded-lg hover:bg-white/10 text-[#64748B] hover:text-text-primary transition-colors">
                              <ExternalLink className="w-4 h-4" />
                            </button>
                          </Link>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Vagas Recomendadas */}
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold text-text-primary">Recomendadas para você</h2>
          </div>
          <div className="space-y-4">
            {loadingJobs ? (
              <div className="flex justify-center items-center py-10">
                <Loader2 className="w-8 h-8 text-[#6366F1] animate-spin" />
              </div>
            ) : recommendedJobs.length > 0 ? (
              recommendedJobs.map((job, index) => (
                <JobCard key={job.id} job={job} index={index} />
              ))
            ) : (
              <div className="text-center p-6 bg-surface rounded-2xl border border-border">
                <p className="text-sm text-text-secondary">Nenhuma vaga disponível no momento.</p>
              </div>
            )}
          </div>

          {/* Banner Plano PRO */}
          <Link href="/candidato/pro" className="block mt-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="rounded-2xl p-6 relative overflow-hidden group cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#F59E0B]/20 to-[#F59E0B]/5 border border-[#F59E0B]/20 rounded-2xl group-hover:border-[#F59E0B]/40 transition-colors" />
              <div className="relative z-10">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F59E0B] to-[#F97316] flex items-center justify-center mb-4 shadow-lg shadow-[#F59E0B]/25">
                  <Star className="w-5 h-5 text-text-primary" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Destaque seu perfil</h3>
                <p className="text-sm text-text-secondary mb-4">Assine o plano PRO e apareça no topo das buscas dos recrutadores.</p>
                <span className="text-sm font-bold text-[#FBBF24] flex items-center gap-1 group-hover:gap-2 transition-all">
                  Conhecer benefícios <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </motion.div>
          </Link>
        </div>
      </div>
    </div>
  );
}
