"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, MapPin, Zap, Users, Building2, ArrowRight, Shield, Star, ChevronRight, GraduationCap, Rocket } from "lucide-react";
import Navbar from "@/components/ui/Navbar";
import JobCard, { type JobData } from "@/components/ui/JobCard";
import Footer from "@/components/ui/Footer";

// ─── Mock Data ───────────────────────────────────────────────

const MOCK_JOBS: JobData[] = [
  { id: "1", title: "Engenheiro(a) Frontend React", company: "Google Brasil", location: "São Paulo, SP", type: "HYBRID", level: "SENIOR", salaryMin: 18000, salaryMax: 28000, tags: ["React", "TypeScript", "Next.js", "GraphQL", "Tailwind"], isPremium: true, createdAt: new Date().toISOString() },
  { id: "2", title: "Desenvolvedor(a) Full-Stack", company: "Meta", location: "Remoto", type: "REMOTE", level: "MID", salaryMin: 12000, salaryMax: 20000, tags: ["Node.js", "React", "PostgreSQL", "Docker"], isPremium: true, createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: "3", title: "Backend Developer Python", company: "Nubank", location: "São Paulo, SP", type: "REMOTE", level: "SENIOR", salaryMin: 20000, salaryMax: 32000, tags: ["Python", "FastAPI", "AWS", "Kubernetes", "Redis"], isPremium: false, createdAt: new Date(Date.now() - 172800000).toISOString() },
  { id: "4", title: "Mobile Developer React Native", company: "iFood", location: "Campinas, SP", type: "HYBRID", level: "MID", salaryMin: 10000, salaryMax: 16000, tags: ["React Native", "TypeScript", "Firebase"], isPremium: false, createdAt: new Date(Date.now() - 259200000).toISOString() },
  { id: "5", title: "DevOps Engineer", company: "Mercado Livre", location: "Remoto", type: "REMOTE", level: "SENIOR", salaryMin: 22000, salaryMax: 35000, tags: ["AWS", "Terraform", "Docker", "CI/CD", "Linux"], isPremium: true, createdAt: new Date(Date.now() - 345600000).toISOString() },
  { id: "6", title: "Desenvolvedor(a) Java", company: "PagSeguro", location: "São Paulo, SP", type: "ONSITE", level: "JUNIOR", salaryMin: 5000, salaryMax: 8000, tags: ["Java", "Spring Boot", "MySQL"], isPremium: false, createdAt: new Date(Date.now() - 432000000).toISOString() },
];

const MOCK_INTERNSHIPS: JobData[] = [
  { id: "i1", title: "Estágio em Desenvolvimento Web", company: "TOTVS", location: "São Paulo, SP", type: "HYBRID", level: "INTERN", salaryMin: 1800, salaryMax: 2500, tags: ["HTML", "CSS", "JavaScript", "React"], isPremium: false, createdAt: new Date().toISOString() },
  { id: "i2", title: "Estágio em Data Science", company: "Itaú", location: "São Paulo, SP", type: "ONSITE", level: "INTERN", salaryMin: 2000, salaryMax: 3000, tags: ["Python", "SQL", "Pandas", "Machine Learning"], isPremium: true, createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: "i3", title: "Estágio Backend Java", company: "Bradesco", location: "Osasco, SP", type: "HYBRID", level: "INTERN", salaryMin: 1600, salaryMax: 2200, tags: ["Java", "Spring", "SQL", "Git"], isPremium: false, createdAt: new Date(Date.now() - 172800000).toISOString() },
  { id: "i4", title: "Estágio em DevOps", company: "Globo", location: "Remoto", type: "REMOTE", level: "INTERN", salaryMin: 2000, salaryMax: 2800, tags: ["Linux", "Docker", "AWS", "CI/CD"], isPremium: false, createdAt: new Date(Date.now() - 259200000).toISOString() },
];

const LOGO_COMPANIES = ["Google", "Meta", "Nubank", "iFood", "Mercado Livre", "PagSeguro", "Spotify", "Amazon", "Microsoft", "Apple", "Netflix", "Uber"];

const STATS = [
  { icon: Zap, value: "2.500+", label: "Vagas Ativas" },
  { icon: Users, value: "45.000+", label: "Desenvolvedores" },
  { icon: Building2, value: "800+", label: "Empresas" },
];

const FILTERS = ["Todos", "Remoto", "Híbrido", "Presencial"];

// ─── Page Component ──────────────────────────────────────────

export default function HomePage() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("Todos");

  const filteredJobs = useMemo(() => {
    return MOCK_JOBS.filter((job) => {
      const matchesSearch = search === "" ||
        job.title.toLowerCase().includes(search.toLowerCase()) ||
        job.company.toLowerCase().includes(search.toLowerCase()) ||
        job.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
      const filterMap: Record<string, string | undefined> = { Remoto: "REMOTE", Híbrido: "HYBRID", Presencial: "ONSITE" };
      const matchesFilter = activeFilter === "Todos" || job.type === filterMap[activeFilter];
      return matchesSearch && matchesFilter;
    });
  }, [search, activeFilter]);

  return (
    <>
      <Navbar />

      {/* ════════════════ HERO SECTION ════════════════ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Mesh Gradient Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[#050510]" />
          <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-[#6366F1]/20 blur-[120px]" style={{ animation: "mesh-move-1 15s ease-in-out infinite" }} />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#06B6D4]/15 blur-[120px]" style={{ animation: "mesh-move-2 20s ease-in-out infinite" }} />
          <div className="absolute top-[30%] right-[20%] w-[40%] h-[40%] rounded-full bg-[#8B5CF6]/10 blur-[100px]" style={{ animation: "mesh-move-3 18s ease-in-out infinite" }} />
        </div>

        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center pt-32 pb-20">
          {/* Badge */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-[#6366F1]/20 mb-8">
            <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75" /><span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]" /></span>
            <span className="text-sm text-[#94A3B8]">+120 novas vagas esta semana</span>
          </motion.div>

          {/* Headline */}
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }} className="text-4xl sm:text-5xl md:text-7xl font-extrabold leading-tight mb-6">
            <span className="text-white">Encontre sua </span>
            <span className="text-gradient">vaga dos sonhos</span>
            <br />
            <span className="text-white">em tecnologia</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }} className="text-lg sm:text-xl text-[#94A3B8] max-w-2xl mx-auto mb-10 leading-relaxed">
            Conectamos os melhores desenvolvedores às empresas mais inovadoras do Brasil.{" "}
            <span className="text-[#818CF8]">Sua próxima oportunidade está aqui.</span>
          </motion.p>

          {/* Search Bar */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }} className="max-w-2xl mx-auto mb-8">
            <div className="relative group">
              <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-[#6366F1]/40 via-[#06B6D4]/20 to-[#8B5CF6]/40 opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
              <div className="relative flex items-center glass-strong rounded-2xl px-5 py-4">
                <Search className="w-5 h-5 text-[#64748B] flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Buscar por cargo, empresa ou tecnologia..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-1 bg-transparent border-none outline-none text-white placeholder-[#64748B] px-4 text-sm sm:text-base"
                  id="search-input"
                />
                <a href="/vagas" className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#06B6D4] text-white text-sm font-semibold hover:shadow-lg hover:shadow-[#6366F1]/25 transition-all duration-300 flex-shrink-0">
                  <SlidersHorizontal className="w-4 h-4" />
                  <span className="hidden sm:inline">Buscar</span>
                </a>
              </div>
            </div>
          </motion.div>

          {/* Quick Filters */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} className="flex items-center justify-center gap-2 flex-wrap mb-16">
            {FILTERS.map((filter) => (
              <button key={filter} onClick={() => setActiveFilter(filter)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${activeFilter === filter ? "bg-[#6366F1] text-white shadow-lg shadow-[#6366F1]/25" : "glass text-[#94A3B8] hover:text-white hover:bg-white/10"}`}>
                {filter}
              </button>
            ))}
          </motion.div>

          {/* Stats */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.5 }} className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
            {STATS.map((stat, i) => (
              <motion.div key={i} whileHover={{ y: -4, scale: 1.05 }} className="glass rounded-xl p-4 text-center group cursor-default">
                <stat.icon className="w-5 h-5 mx-auto mb-2 text-[#6366F1] group-hover:text-[#06B6D4] transition-colors duration-300" />
                <div className="text-xl sm:text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-xs text-[#64748B] mt-0.5">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
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
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Vagas em <span className="text-gradient">Destaque</span>
            </h2>
            <p className="text-[#94A3B8] max-w-xl mx-auto">As melhores oportunidades das empresas mais inovadoras do mercado tech brasileiro</p>
          </motion.div>

          {filteredJobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredJobs.map((job, i) => (
                <JobCard key={job.id} job={job} index={i} />
              ))}
            </div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
              <Search className="w-12 h-12 text-[#64748B] mx-auto mb-4" />
              <p className="text-[#94A3B8] text-lg">Nenhuma vaga encontrada para sua busca.</p>
              <button onClick={() => { setSearch(""); setActiveFilter("Todos"); }} className="mt-4 text-[#6366F1] hover:text-[#818CF8] text-sm font-medium transition-colors">Limpar filtros</button>
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
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Vagas de <span className="text-[#22D3EE]">Estágio</span>
            </h2>
            <p className="text-[#94A3B8] max-w-xl mx-auto">Oportunidades exclusivas para quem está começando. Grandes empresas buscando novos talentos para formar.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {MOCK_INTERNSHIPS.map((job, i) => (
              <JobCard key={job.id} job={job} index={i} />
            ))}
          </div>

          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mt-10 rounded-2xl glass border border-[#06B6D4]/10 p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6">
            <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-[#06B6D4]/20 to-[#06B6D4]/5 border border-[#06B6D4]/20 flex items-center justify-center">
              <Rocket className="w-7 h-7 text-[#22D3EE]" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-lg font-bold text-white mb-1">Primeiro emprego em tech?</h3>
              <p className="text-sm text-[#94A3B8]">Crie seu perfil gratuitamente e receba alertas de novas vagas de estágio diretamente no seu e-mail.</p>
            </div>
            <motion.a href="/cadastro" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-shrink-0 px-6 py-3 rounded-xl bg-gradient-to-r from-[#06B6D4] to-[#0891B2] text-white font-semibold text-sm shadow-lg shadow-[#06B6D4]/25 hover:shadow-[#06B6D4]/40 transition-shadow">
              Criar Perfil Grátis
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* ════════════════ LOGO CAROUSEL ════════════════ */}
      <section className="relative py-16 border-y border-white/5 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 text-center">
          <p className="text-sm text-[#64748B] uppercase tracking-widest font-medium">Empresas que confiam no DevJobs.br</p>
        </div>
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#050510] to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#050510] to-transparent z-10" />
          <div className="logo-carousel">
            {[...LOGO_COMPANIES, ...LOGO_COMPANIES].map((name, i) => (
              <div key={`${name}-${i}`} className="flex-shrink-0 mx-8 sm:mx-12 flex items-center justify-center h-12 opacity-40 hover:opacity-80 transition-opacity duration-500 cursor-pointer">
                <span className="text-lg sm:text-xl font-bold text-[#94A3B8] whitespace-nowrap tracking-wide">{name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════ PRO SECTION ════════════════ */}
      <section id="pro" className="relative py-20 sm:py-28">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#F59E0B]/5 rounded-full blur-[150px] pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ type: "spring", stiffness: 80, damping: 15 }} className="relative rounded-3xl overflow-hidden">
            <div className="absolute -inset-[1px] rounded-3xl bg-gradient-to-r from-[#F59E0B]/50 via-[#6366F1]/30 to-[#F59E0B]/50" style={{ animation: "gradient-shift 4s ease infinite", backgroundSize: "200% 200%" }} />
            <div className="relative glass-strong rounded-3xl p-8 sm:p-12 text-center">
              <motion.div whileHover={{ rotate: [0, -10, 10, 0] }} transition={{ duration: 0.5 }} className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#F59E0B]/20 to-[#F59E0B]/5 border border-[#F59E0B]/20 mb-6">
                <Star className="w-8 h-8 text-[#FBBF24]" />
              </motion.div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Seja <span className="text-[#FBBF24]">PRO</span></h2>
              <p className="text-[#94A3B8] max-w-lg mx-auto mb-8 leading-relaxed">Destaque-se para os recrutadores. Candidatos PRO aparecem no topo das listas e ganham acesso a vagas exclusivas.</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                {[
                  { icon: Zap, text: "Prioridade para recrutadores" },
                  { icon: Shield, text: "Perfil verificado e selo PRO" },
                  { icon: Star, text: "Acesso a vagas exclusivas" },
                ].map((item, i) => (
                  <div key={i} className="glass rounded-xl p-4 flex flex-col items-center gap-2">
                    <item.icon className="w-5 h-5 text-[#FBBF24]" />
                    <span className="text-sm text-[#94A3B8]">{item.text}</span>
                  </div>
                ))}
              </div>
              <motion.a href="/candidato/pro" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-[#F59E0B] to-[#F97316] text-black font-bold text-lg shadow-lg shadow-[#F59E0B]/25 hover:shadow-[#F59E0B]/40 transition-shadow duration-300">
                Assinar PRO — R$29/mês <ChevronRight className="w-5 h-5" />
              </motion.a>
              <p className="text-xs text-[#64748B] mt-4">Cancele a qualquer momento. Pagamento seguro via Stripe.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ════════════════ CTA EMPRESAS ════════════════ */}
      <section id="empresas" className="relative py-20 sm:py-28 border-t border-white/5">
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#06B6D4]/5 rounded-full blur-[150px] pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ type: "spring", stiffness: 80, damping: 15 }}>
            <Building2 className="w-12 h-12 text-[#06B6D4] mx-auto mb-6" />
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Contrate os melhores <span className="text-gradient">talentos tech</span>
            </h2>
            <p className="text-[#94A3B8] max-w-lg mx-auto mb-8 leading-relaxed">Publique vagas gratuitamente ou destaque-as com o selo Premium para atrair mais candidatos qualificados.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.a href="/empresa/nova-vaga" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#06B6D4] text-white font-semibold shadow-lg shadow-[#6366F1]/25 hover:shadow-[#6366F1]/40 transition-shadow">
                Publicar Vaga Grátis
              </motion.a>
              <motion.a href="/empresa/premium" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-8 py-3.5 rounded-xl glass border border-white/10 text-[#94A3B8] hover:text-white hover:border-[#6366F1]/30 font-medium transition-all">
                Saiba mais
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </>
  );
}
