"use client";

import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, MapPin, Zap, Users, Building2, ArrowRight, Shield, Star, ChevronRight, GraduationCap, Rocket, Loader2 } from "lucide-react";
import Navbar from "@/components/ui/Navbar";
import JobCard, { type JobData } from "@/components/ui/JobCard";
import Footer from "@/components/ui/Footer";
import { useSession } from "next-auth/react";

const LOGO_COMPANIES = ["Google", "Meta", "Nubank", "iFood", "Mercado Livre", "PagSeguro", "Spotify", "Amazon", "Microsoft", "Apple", "Netflix", "Uber"];

// STATS removidos (dados fictícios)
const STATS: any[] = [];

const FILTERS = ["Todos", "Remoto", "Híbrido", "Presencial"];
const LEVEL_FILTERS = ["Qualquer Nível", "Estágio", "Júnior", "Pleno", "Sênior", "Lead"];
const TECH_FILTERS = ["Todas Techs", "React", "Node", "Python", "Java", "Mobile"];

// ─── Page Component ──────────────────────────────────────────

export default function HomePage() {
  const { status } = useSession();
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("Todos");
  const [activeLevelFilter, setActiveLevelFilter] = useState("Qualquer Nível");
  const [activeTechFilter, setActiveTechFilter] = useState("Todas Techs");
  const [jobs, setJobs] = useState<JobData[]>([]);
  const [internships, setInternships] = useState<JobData[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);

  useEffect(() => {
    async function fetchJobs() {
      try {
        const res = await fetch("/api/jobs?status=ACTIVE");
        if (res.ok) {
          const data = await res.json();
          const parsedJobs = data.map((job: any) => {
            let tagsArray = [];
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
            };
          });
          
          setJobs(parsedJobs.filter((j: any) => j.level !== "INTERN").slice(0, 6));
          setInternships(parsedJobs.filter((j: any) => j.level === "INTERN").slice(0, 4));
        }
      } catch (error) {
        console.error("Erro ao buscar vagas:", error);
      } finally {
        setLoadingJobs(false);
      }
    }
    fetchJobs();
  }, []);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      // Busca textual
      const matchesSearch = search === "" ||
        job.title.toLowerCase().includes(search.toLowerCase()) ||
        job.company.toLowerCase().includes(search.toLowerCase()) ||
        job.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
        
      // Filtro de Localidade / Tipo
      const filterMap: Record<string, string | undefined> = { Remoto: "REMOTE", Híbrido: "HYBRID", Presencial: "ONSITE" };
      const matchesFilter = activeFilter === "Todos" || job.type === filterMap[activeFilter];
      
      // Filtro de Nível
      const levelMap: Record<string, string | undefined> = { 
        "Estágio": "INTERN", "Júnior": "JUNIOR", "Pleno": "MID", "Sênior": "SENIOR", "Lead": "LEAD" 
      };
      const matchesLevel = activeLevelFilter === "Qualquer Nível" || job.level === levelMap[activeLevelFilter];
      
      // Filtro de Tecnologia
      const matchesTech = activeTechFilter === "Todas Techs" || 
        job.tags.some(t => t.toLowerCase().includes(activeTechFilter.toLowerCase())) ||
        job.title.toLowerCase().includes(activeTechFilter.toLowerCase());

      return matchesSearch && matchesFilter && matchesLevel && matchesTech;
    });
  }, [jobs, search, activeFilter, activeLevelFilter, activeTechFilter]);

  return (
    <>
      {status !== "authenticated" && <Navbar />}

      {/* ════════════════ HERO SECTION ════════════════ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Mesh Gradient Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-bg" />
          <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-[#6366F1]/10 dark:bg-[#6366F1]/20 blur-[120px]" style={{ animation: "mesh-move-1 15s ease-in-out infinite" }} />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#06B6D4]/10 dark:bg-[#06B6D4]/15 blur-[120px]" style={{ animation: "mesh-move-2 20s ease-in-out infinite" }} />
          <div className="absolute top-[30%] right-[20%] w-[40%] h-[40%] rounded-full bg-[#8B5CF6]/5 dark:bg-[#8B5CF6]/10 blur-[100px]" style={{ animation: "mesh-move-3 18s ease-in-out infinite" }} />
        </div>

        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" style={{ backgroundImage: "var(--grid-pattern)", backgroundSize: "60px 60px" }} />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center pt-32 pb-20">
          {/* Badge */}
          {/* Badge removido conforme solicitação */}


          {/* Headline */}
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }} className="text-4xl sm:text-5xl md:text-7xl font-extrabold leading-tight mb-6">
            <span className="text-text-primary">Encontre sua </span>
            <span className="text-gradient">vaga dos sonhos</span>
            <br />
            <span className="text-text-primary">em tecnologia</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }} className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed">
            Conectamos os melhores desenvolvedores às empresas mais inovadoras do Brasil.{" "}
            <span className="text-[#818CF8]">Sua próxima oportunidade está aqui.</span>
          </motion.p>

          {/* Search Bar */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }} className="max-w-2xl mx-auto mb-8">
            <div className="relative group">
              <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-[#6366F1]/40 via-[#06B6D4]/20 to-[#8B5CF6]/40 opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
              <div className="relative flex items-center glass-strong rounded-2xl px-5 py-4">
                <Search className="w-5 h-5 text-text-muted flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Buscar por cargo, empresa ou tecnologia..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-1 bg-transparent border-none outline-none text-text-primary placeholder-[#64748B] px-4 text-sm sm:text-base"
                  id="search-input"
                />
                <a href="/vagas" className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#06B6D4] text-text-primary text-sm font-semibold hover:shadow-lg hover:shadow-[#6366F1]/25 transition-all duration-300 flex-shrink-0">
                  <SlidersHorizontal className="w-4 h-4" />
                  <span className="hidden sm:inline">Buscar</span>
                </a>
              </div>
            </div>
          </motion.div>

          {/* Quick Filters */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} className="flex flex-col items-center justify-center gap-3 mb-16">
            <div className="flex flex-wrap items-center justify-center gap-2">
              {FILTERS.map((filter) => (
                <button key={filter} onClick={() => setActiveFilter(filter)} className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-all duration-300 ${activeFilter === filter ? "bg-[#6366F1] text-text-primary shadow-lg shadow-[#6366F1]/25" : "glass text-text-secondary hover:text-text-primary hover:bg-surface-hover"}`}>
                  {filter}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {LEVEL_FILTERS.map((filter) => (
                <button key={filter} onClick={() => setActiveLevelFilter(filter)} className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-all duration-300 ${activeLevelFilter === filter ? "bg-[#06B6D4] text-text-primary shadow-lg shadow-[#06B6D4]/25" : "glass text-text-secondary hover:text-text-primary hover:bg-surface-hover"}`}>
                  {filter}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {TECH_FILTERS.map((filter) => (
                <button key={filter} onClick={() => setActiveTechFilter(filter)} className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-all duration-300 ${activeTechFilter === filter ? "bg-[#8B5CF6] text-text-primary shadow-lg shadow-[#8B5CF6]/25" : "glass text-text-secondary hover:text-text-primary hover:bg-surface-hover"}`}>
                  {filter}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Stats */}
          {/* Stats removidos conforme solicitação */}

        </div>

        {/* Scroll Indicator */}
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }} className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-2">
            <motion.div animate={{ y: [0, 12, 0] }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }} className="w-1.5 h-1.5 rounded-full bg-[#6366F1]" />
          </div>
        </motion.div>
      </section>

      {/* ════════════════ JOBS SECTION ════════════════ */}
      <section id="vagas" className="relative py-20 sm:py-28">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#6366F1]/5 rounded-full blur-[150px] pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
              Vagas em <span className="text-gradient">Destaque</span>
            </h2>
            <p className="text-text-secondary max-w-xl mx-auto">As melhores oportunidades das empresas mais inovadoras do mercado tech brasileiro</p>
          </motion.div>

          {loadingJobs ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-10 h-10 text-[#6366F1] animate-spin" />
            </div>
          ) : filteredJobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredJobs.map((job, i) => (
                <JobCard key={job.id} job={job} index={i} />
              ))}
            </div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
              <Search className="w-12 h-12 text-text-muted mx-auto mb-4" />
              <p className="text-text-secondary text-lg">Nenhuma vaga encontrada para sua busca.</p>
              <button onClick={() => { setSearch(""); setActiveFilter("Todos"); setActiveLevelFilter("Qualquer Nível"); setActiveTechFilter("Todas Techs"); }} className="mt-4 text-[#6366F1] hover:text-[#818CF8] text-sm font-medium transition-colors">Limpar filtros</button>
            </motion.div>
          )}

          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mt-12">
            <motion.a href="/vagas" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl glass border border-[#6366F1]/20 text-[#818CF8] font-semibold hover:bg-[#6366F1]/10 transition-all duration-300">
              Ver todas as vagas <ArrowRight className="w-4 h-4" />
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* ════════════════ ESTÁGIO SECTION ════════════════ */}
      <section id="estagios" className="relative py-20 sm:py-28 border-t border-white/5">
        <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-[#06B6D4]/5 rounded-full blur-[150px] pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#06B6D4]/10 border border-[#06B6D4]/20 mb-6">
              <GraduationCap className="w-4 h-4 text-[#22D3EE]" />
              <span className="text-sm font-medium text-[#22D3EE]">Comece sua carreira em tech</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
              Vagas de <span className="text-[#22D3EE]">Estágio</span>
            </h2>
            <p className="text-text-secondary max-w-xl mx-auto">Oportunidades exclusivas para quem está começando. Grandes empresas buscando novos talentos para formar.</p>
          </motion.div>

          {loadingJobs ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="w-8 h-8 text-[#06B6D4] animate-spin" />
            </div>
          ) : internships.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {internships.map((job, i) => (
                <JobCard key={job.id} job={job} index={i} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 glass-card rounded-2xl border border-white/5">
              <p className="text-text-secondary">Nenhuma vaga de estágio disponível no momento.</p>
            </div>
          )}

          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mt-10 rounded-2xl glass border border-[#06B6D4]/10 p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6">
            <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-[#06B6D4]/20 to-[#06B6D4]/5 border border-[#06B6D4]/20 flex items-center justify-center">
              <Rocket className="w-7 h-7 text-[#22D3EE]" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-lg font-bold text-text-primary mb-1">Primeiro emprego em tech?</h3>
              <p className="text-sm text-text-secondary">Crie seu perfil gratuitamente e receba alertas de novas vagas de estágio diretamente no seu e-mail.</p>
            </div>
            <motion.a href="/cadastro" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-shrink-0 px-6 py-3 rounded-xl bg-gradient-to-r from-[#06B6D4] to-[#0891B2] text-text-primary font-semibold text-sm shadow-lg shadow-[#06B6D4]/25 hover:shadow-[#06B6D4]/40 transition-shadow">
              Criar Perfil Grátis
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* Seção de logos removida (dados fictícios) */}


      {/* ════════════════ PRO SECTION ════════════════ */}
      <section id="pro" className="relative py-20 sm:py-28">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#F59E0B]/5 rounded-full blur-[150px] pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ type: "spring", stiffness: 80, damping: 15 }} className="relative rounded-3xl overflow-hidden shadow-2xl shadow-[#6366F1]/5">
            <div className="absolute -inset-[1px] rounded-3xl bg-gradient-to-r from-[#F59E0B]/20 via-[#6366F1]/10 to-[#F59E0B]/20 dark:from-[#F59E0B]/50 dark:via-[#6366F1]/30 dark:to-[#F59E0B]/50" style={{ animation: "gradient-shift 4s ease infinite", backgroundSize: "200% 200%" }} />
            <div className="relative bg-surface/80 backdrop-blur-xl rounded-3xl p-8 sm:p-12 text-center border border-border/50 shadow-2xl">
              <motion.div whileHover={{ rotate: [0, -10, 10, 0] }} transition={{ duration: 0.5 }} className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#F59E0B]/20 to-[#F59E0B]/5 border border-[#F59E0B]/20 mb-6">
                <Star className="w-8 h-8 text-[#FBBF24]" />
              </motion.div>
              <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">Seja <span className="text-[#FBBF24]">PRO</span></h2>
              <p className="text-text-secondary max-w-lg mx-auto mb-8 leading-relaxed">Destaque-se para os recrutadores. Candidatos PRO aparecem no topo das listas e ganham acesso a vagas exclusivas.</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                {[
                  { icon: Zap, text: "Prioridade para recrutadores" },
                  { icon: Shield, text: "Perfil verificado e selo PRO" },
                  { icon: Star, text: "Acesso a vagas exclusivas" },
                ].map((item, i) => (
                  <div key={i} className="bg-bg-secondary dark:bg-white/5 rounded-xl p-4 flex flex-col items-center gap-2 border border-border/50">
                    <item.icon className="w-5 h-5 text-[#FBBF24]" />
                    <span className="text-sm text-text-secondary font-medium">{item.text}</span>
                  </div>
                ))}
              </div>
              <motion.a href="/candidato/pro" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-[#F59E0B] to-[#F97316] text-black font-bold text-lg shadow-lg shadow-[#F59E0B]/25 hover:shadow-[#F59E0B]/40 transition-shadow duration-300">
                Assinar PRO — R$29/mês <ChevronRight className="w-5 h-5" />
              </motion.a>
              <p className="text-xs text-text-muted mt-4">Cancele a qualquer momento. Pagamento seguro via Stripe.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ════════════════ CTA EMPRESAS ════════════════ */}
      <section id="empresas" className="relative py-20 sm:py-28 border-t border-border/50 bg-bg-secondary">
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#06B6D4]/5 rounded-full blur-[150px] pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ type: "spring", stiffness: 80, damping: 15 }}>
            <Building2 className="w-12 h-12 text-[#06B6D4] mx-auto mb-6" />
            <h2 className="text-3xl md:text-5xl font-bold text-text-primary mb-6">
              Contrate os melhores <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#06B6D4] to-[#6366F1]">talentos tech</span>
            </h2>
            <p className="text-lg text-text-secondary mb-10 leading-relaxed">
              Publique vagas gratuitamente ou destaque-as com o selo Premium para atrair mais candidatos qualificados.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.a href="/empresa/nova-vaga" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#06B6D4] text-text-primary font-semibold shadow-lg shadow-[#6366F1]/25 hover:shadow-[#6366F1]/40 transition-shadow">
                Publicar Vaga Grátis
              </motion.a>
              <motion.a href="/empresa/premium" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-8 py-3.5 rounded-xl glass border border-white/10 text-text-secondary hover:text-text-primary hover:border-[#6366F1]/30 font-medium transition-all">
                Saiba mais
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ════════════════ TECH STACK (Para o Professor) ════════════════ */}
      <section className="relative py-16 border-t border-border/50 bg-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-8">Arquitetura & Tecnologias Utilizadas</p>
          <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-12 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
            <div className="flex items-center gap-2 text-text-primary font-bold text-xl"><div className="w-8 h-8 bg-white text-black rounded-full flex items-center justify-center font-black">N</div> Next.js 16</div>
            <div className="flex items-center gap-2 text-[#3178C6] font-bold text-xl"><div className="w-8 h-8 bg-[#3178C6] text-text-primary rounded flex items-center justify-center font-black text-sm">TS</div> TypeScript</div>
            <div className="flex items-center gap-2 text-[#38BDF8] font-bold text-xl"><div className="w-8 h-8 flex items-center justify-center font-black text-2xl">〰️</div> Tailwind</div>
            <div className="flex items-center gap-2 text-text-primary font-bold text-xl"><div className="w-8 h-8 border border-white rounded-full flex items-center justify-center font-black text-sm">▲</div> Prisma</div>
            <div className="flex items-center gap-2 text-[#336791] font-bold text-xl"><div className="w-8 h-8 bg-[#336791] text-text-primary rounded-full flex items-center justify-center font-black text-sm">🐘</div> PostgreSQL</div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
