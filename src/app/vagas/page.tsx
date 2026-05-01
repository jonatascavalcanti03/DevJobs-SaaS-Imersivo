"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Search, MapPin, Filter, Loader2, Zap, Building2, Globe, X, ChevronDown } from "lucide-react";
import JobCard, { type JobData } from "@/components/ui/JobCard";
import { motion, AnimatePresence } from "framer-motion";
import { JobCardSkeleton } from "@/components/ui/Skeleton";
import { toast } from "sonner";

// ─── Filtros de nível e tipo ─────────────────────────────────
const LEVEL_OPTIONS = [
  { value: "ALL", label: "Todos os níveis" },
  { value: "INTERN", label: "Estágio" },
  { value: "JUNIOR", label: "Júnior" },
  { value: "MID", label: "Pleno" },
  { value: "SENIOR", label: "Sênior" },
  { value: "LEAD", label: "Lead" },
];

const TYPE_OPTIONS = [
  { value: "ALL", label: "Todos os modelos" },
  { value: "REMOTE", label: "🌐 Remoto" },
  { value: "HYBRID", label: "🏠 Híbrido" },
  { value: "ONSITE", label: "🏢 Presencial" },
];

const TECH_SHORTCUTS = [
  "React", "Node.js", "Python", "TypeScript", "Java", "DevOps", "AWS", "Flutter", "Vue", "Angular",
];

const BR_STATES = [
  { value: "", label: "Brasil (Todo)" },
  { value: "AC", label: "Acre" }, { value: "AL", label: "Alagoas" }, { value: "AP", label: "Amapá" },
  { value: "AM", label: "Amazonas" }, { value: "BA", label: "Bahia" }, { value: "CE", label: "Ceará" },
  { value: "DF", label: "Distrito Federal" }, { value: "ES", label: "Espírito Santo" }, { value: "GO", label: "Goiás" },
  { value: "MA", label: "Maranhão" }, { value: "MT", label: "Mato Grosso" }, { value: "MS", label: "Mato Grosso do Sul" },
  { value: "MG", label: "Minas Gerais" }, { value: "PA", label: "Pará" }, { value: "PB", label: "Paraíba" },
  { value: "PR", label: "Paraná" }, { value: "PE", label: "Pernambuco" }, { value: "PI", label: "Piauí" },
  { value: "RJ", label: "Rio de Janeiro" }, { value: "RN", label: "Rio Grande do Norte" }, { value: "RS", label: "Rio Grande do Sul" },
  { value: "RO", label: "Rondônia" }, { value: "RR", label: "Roraima" }, { value: "SC", label: "Santa Catarina" },
  { value: "SP", label: "São Paulo" }, { value: "SE", label: "Sergipe" }, { value: "TO", label: "Tocantins" },
];


// ─── Seção separadora ────────────────────────────────────────
function SectionDivider({ icon: Icon, label }: { icon: any; label: string }) {
  return (
    <div className="flex items-center gap-4 py-2">
      <div className="flex-1 h-px bg-white/5" />
      <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-border text-xs text-[#64748B] font-medium">
        <Icon className="w-3.5 h-3.5" />
        {label}
      </div>
      <div className="flex-1 h-px bg-white/5" />
    </div>
  );
}

// ─── Normalize job from DB to JobData ───────────────────────
function normalizeInternalJob(job: any): JobData {
  let tagsArray: string[] = [];
  try { tagsArray = JSON.parse(job.tags); } catch { tagsArray = []; }
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
    source: "INTERNAL",
  };
}

export default function SearchJobsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [locationTerm, setLocationTerm] = useState("");
  const [activeLevel, setActiveLevel] = useState("ALL");
  const [activeType, setActiveType] = useState("ALL");
  const [showFilters, setShowFilters] = useState(false);

  const [internalJobs, setInternalJobs] = useState<JobData[]>([]);
  const [externalJobs, setExternalJobs] = useState<JobData[]>([]);
  const [loadingInternal, setLoadingInternal] = useState(true);
  const [loadingExternal, setLoadingExternal] = useState(false);

  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  // ── Busca vagas internas ───────────────────────────────────
  const fetchInternalJobs = useCallback(async () => {
    setLoadingInternal(true);
    try {
      const res = await fetch("/api/jobs?status=ACTIVE", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setInternalJobs(data.map(normalizeInternalJob));
      }
    } catch (error) {
      console.error("Erro ao buscar vagas internas:", error);
    } finally {
      setLoadingInternal(false);
    }
  }, []);

  // ── Busca vagas Adzuna ─────────────────────────────────────
  const fetchExternalJobs = useCallback(async (q: string, loc: string) => {
    setLoadingExternal(true);
    try {
      const params = new URLSearchParams({
        q: q || "desenvolvedor",
        location: loc,
        per_page: "15",
      });

      const res = await fetch(`/api/jobs/external?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setExternalJobs(data.jobs || []);
      }
    } catch (error) {
      console.error("Erro ao buscar vagas externas:", error);
    } finally {
      setLoadingExternal(false);
    }
  }, []);

  // ── Carrega tudo na inicialização ─────────────────────────
  useEffect(() => {
    fetchInternalJobs();
    fetchExternalJobs("desenvolvedor", "");
  }, [fetchInternalJobs, fetchExternalJobs]);


  // ── Debounce na busca ──────────────────────────────────────
  const handleSearch = () => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      fetchExternalJobs(searchTerm || "desenvolvedor", locationTerm);
    }, 600);
  };

  // ── Aplica filtros client-side nas vagas internas ──────────
  const filteredInternal = internalJobs.filter((job) => {
    const matchText =
      !searchTerm ||
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchLocation =
      !locationTerm ||
      job.location.toLowerCase().includes(locationTerm.toLowerCase());
    const matchLevel = activeLevel === "ALL" || job.level === activeLevel;
    const matchType = activeType === "ALL" || job.type === activeType;
    return matchText && matchLocation && matchLevel && matchType;
  });

  // ── Aplica filtros client-side nas vagas externas ──────────
  const filteredExternal = externalJobs.filter((job) => {
    const matchLevel = activeLevel === "ALL" || job.level === activeLevel;
    const matchType = activeType === "ALL" || job.type === activeType;
    return matchLevel && matchType;
  });

  const premiumJobs = filteredInternal.filter((j) => j.isPremium);
  const normalJobs = filteredInternal.filter((j) => !j.isPremium);
  const totalResults = filteredInternal.length + filteredExternal.length;

  return (
    <div className="min-h-screen bg-bg pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* ── Hero Search ── */}
        <div className="text-center space-y-6">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-text-primary"
          >
            Encontre sua próxima{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6366F1] to-[#06B6D4]">
              vaga em tech
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-text-secondary text-base max-w-xl mx-auto"
          >
            Vagas verificadas da plataforma + vagas parceiras do Brasil — tudo em um só lugar.
          </motion.p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="glass-strong p-2 rounded-2xl flex flex-col sm:flex-row gap-2 max-w-3xl mx-auto border border-border"
          >
            <div className="relative flex-1 flex items-center">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748B]" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Cargo, tecnologia ou empresa..."
                className="w-full bg-transparent text-text-primary placeholder-[#64748B] pl-12 pr-4 py-3 outline-none"
              />
              {searchTerm && (
                <button onClick={() => { setSearchTerm(""); fetchExternalJobs("desenvolvedor", locationTerm); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-text-primary transition-colors">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="w-px h-8 bg-white/10 hidden sm:block self-center" />
            <div className="relative flex-1 flex items-center">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748B]" />
              <select
                value={locationTerm}
                onChange={(e) => {
                  const val = e.target.value;
                  setLocationTerm(val);
                  fetchExternalJobs(searchTerm, val);
                }}
                className="w-full bg-transparent text-text-primary placeholder-[#64748B] pl-12 pr-10 py-3 outline-none appearance-none cursor-pointer"
              >
                {BR_STATES.map((state) => (
                  <option key={state.value} value={state.value} className="bg-bg-secondary text-text-primary">
                    {state.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B] pointer-events-none" />
            </div>


            <button
              onClick={handleSearch}
              className="bg-gradient-to-r from-[#6366F1] to-[#06B6D4] hover:opacity-90 text-text-primary px-8 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 justify-center"
            >
              <Search className="w-4 h-4" /> Buscar
            </button>
          </motion.div>

          {/* Tech shortcuts */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-2"
          >
            {TECH_SHORTCUTS.map((tech) => (
              <button
                key={tech}
                onClick={() => { setSearchTerm(tech); fetchExternalJobs(tech, locationTerm); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                  searchTerm === tech
                    ? "bg-[#6366F1]/20 text-[#818CF8] border-[#6366F1]/40"
                    : "bg-white/5 text-text-secondary border-border hover:bg-white/10 hover:text-text-primary"
                }`}
              >
                {tech}
              </button>
            ))}
          </motion.div>

          {/* Job Alert Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="pt-4"
          >
            <button 
              onClick={async () => {
                try {
                  const res = await fetch("/api/user/alerts", {
                    method: "POST",
                    body: JSON.stringify({ query: searchTerm || "Desenvolvedor", location: locationTerm }),
                    headers: { "Content-Type": "application/json" }
                  });
                  const data = await res.json();
                  if (res.ok) {
                    toast.success(data.message);
                  } else {
                    if (data.requiresUpgrade) {
                      if (confirm("👑 Esta é uma função PRO. Deseja conhecer o plano Candidato PRO?")) {
                        window.location.href = "/candidato/pro";
                      }
                    } else {
                      toast.error(data.error || "Erro ao criar alerta");
                    }
                  }
                } catch (err) {
                  toast.error("Erro ao conectar com o servidor.");
                }
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#10B981]/10 text-[#34D399] border border-[#10B981]/20 text-xs font-bold hover:bg-[#10B981]/20 transition-all cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5" />
              Me avisar de novas vagas para esta busca
            </button>
          </motion.div>

        </div>


        {/* ── Filters Bar ── */}
        <div className="flex flex-wrap items-center gap-3 justify-between">
          <div className="flex flex-wrap gap-2">
            {/* Tipo de Trabalho */}
            {TYPE_OPTIONS.filter((t) => t.value !== "ALL").map((option) => (
              <button
                key={option.value}
                onClick={() => setActiveType(activeType === option.value ? "ALL" : option.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                  activeType === option.value
                    ? "bg-[#06B6D4]/20 text-[#22D3EE] border-[#06B6D4]/40"
                    : "bg-white/5 text-text-secondary border-border hover:bg-white/10 hover:text-text-primary"
                }`}
              >
                {option.label}
              </button>
            ))}
            
            {/* Nível — dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-border bg-surface text-text-secondary hover:bg-surface/80 hover:text-text-primary transition-all"
              >
                <Filter className="w-3.5 h-3.5" />
                {activeLevel === "ALL" ? "Nível" : LEVEL_OPTIONS.find((l) => l.value === activeLevel)?.label}
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showFilters ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="absolute top-full mt-1 left-0 z-20 bg-[#0F172A] border border-border rounded-xl shadow-xl overflow-hidden"
                  >
                    {LEVEL_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => { setActiveLevel(opt.value); setShowFilters(false); }}
                        className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                          activeLevel === opt.value
                            ? "text-[#818CF8] bg-[#6366F1]/10"
                            : "text-text-secondary hover:bg-white/5 hover:text-text-primary"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Contador */}
          <span className="text-[#64748B] text-sm">
            {loadingInternal && loadingExternal ? (
              <span className="flex items-center gap-1.5"><Loader2 className="w-3.5 h-3.5 animate-spin" /> Buscando...</span>
            ) : (
              <span><strong className="text-text-primary">{totalResults}</strong> vagas encontradas</span>
            )}
          </span>
        </div>

        {/* ── Results ── */}
        <div className="space-y-3">

          {/* Premium Internas */}
          {premiumJobs.length > 0 && (
            <div className="space-y-3">
              {premiumJobs.map((job, i) => (
                <JobCard key={job.id} job={job} index={i} />
              ))}
            </div>
          )}

          {/* Vagas Internas Normais */}
          {loadingInternal ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <JobCardSkeleton key={i} />
              ))}
            </div>
          ) : normalJobs.length > 0 ? (
            <div className="space-y-3">
              {premiumJobs.length > 0 && (
                <SectionDivider icon={Building2} label="Vagas verificadas Match.js" />
              )}
              {normalJobs.map((job, i) => (
                <JobCard key={job.id} job={job} index={i} />
              ))}
            </div>
          ) : null}

          {/* Divisor para vagas externas */}
          {filteredExternal.length > 0 && (
            <SectionDivider icon={Globe} label="Mais vagas tech no Brasil — Via Parceiro" />
          )}

          {/* Vagas Adzuna */}
          {loadingExternal ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <JobCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredExternal.length > 0 ? (
            <div className="space-y-3">
              {filteredExternal.map((job, i) => (
                <JobCard key={job.id} job={job} index={i} />
              ))}
            </div>
          ) : null}

          {/* Empty state */}
          {!loadingInternal && !loadingExternal && totalResults === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 bg-white/5 rounded-3xl border border-border"
            >
              <Zap className="w-12 h-12 text-[#64748B] mx-auto mb-4" />
              <h3 className="text-xl font-bold text-text-primary mb-2">Nenhuma vaga encontrada</h3>
              <p className="text-text-secondary mb-4">Tente ajustar os filtros ou buscar por outra tecnologia.</p>
              <button
                onClick={() => { setSearchTerm(""); setActiveLevel("ALL"); setActiveType("ALL"); fetchExternalJobs("desenvolvedor", ""); }}
                className="px-5 py-2.5 rounded-xl bg-[#6366F1]/20 text-[#818CF8] border border-[#6366F1]/30 text-sm font-medium hover:bg-[#6366F1]/30 transition-colors"
              >
                Limpar filtros
              </button>
            </motion.div>
          )}
        </div>

      </div>
    </div>
  );
}
