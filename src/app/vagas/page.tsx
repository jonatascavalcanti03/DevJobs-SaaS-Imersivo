"use client";

import { useState, useEffect } from "react";
import { Search, MapPin, Filter, Loader2 } from "lucide-react";
import JobCard, { type JobData } from "@/components/ui/JobCard";
import { motion } from "framer-motion";

export default function SearchJobsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [vagas, setVagas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPublicJobs() {
      try {
        const res = await fetch("/api/jobs?status=ACTIVE");
        if (res.ok) {
          const data = await res.json();
          setVagas(data);
        }
      } catch (error) {
        console.error("Erro ao buscar vagas públicas:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPublicJobs();
  }, []);

  const filteredVagas = vagas.filter(vaga => 
    vaga.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vaga.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#050510] pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Search Header */}
        <div className="text-center space-y-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
            Encontre sua próxima <span className="text-gradient">vaga em tech</span>
          </h1>
          
          <div className="glass-strong p-2 rounded-2xl flex flex-col sm:flex-row gap-2 max-w-3xl mx-auto border border-white/10">
            <div className="relative flex-1 flex items-center">
              <Search className="absolute left-4 w-5 h-5 text-[#64748B]" />
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por cargo, tecnologia ou empresa..." 
                className="w-full bg-transparent text-white placeholder-[#64748B] pl-12 pr-4 py-3 outline-none"
              />
            </div>
            <div className="w-px h-8 bg-white/10 hidden sm:block self-center" />
            <div className="relative flex-1 flex items-center">
              <MapPin className="absolute left-4 w-5 h-5 text-[#64748B]" />
              <input 
                type="text" 
                placeholder="Localização ou Remoto" 
                className="w-full bg-transparent text-white placeholder-[#64748B] pl-12 pr-4 py-3 outline-none"
              />
            </div>
            <button className="bg-gradient-to-r from-[#6366F1] to-[#06B6D4] hover:opacity-90 text-white px-8 py-3 rounded-xl font-semibold transition-all">
              Buscar
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-3">
            <button className="px-4 py-2 rounded-lg bg-white/10 text-white text-sm font-medium hover:bg-white/15 transition-colors flex items-center gap-2 border border-white/5">
              <Filter className="w-4 h-4" /> Filtros Avançados
            </button>
            <button className="px-4 py-2 rounded-lg bg-[#6366F1]/20 text-[#818CF8] text-sm font-medium border border-[#6366F1]/30">
              Todos
            </button>
            <button className="px-4 py-2 rounded-lg bg-white/5 text-[#94A3B8] text-sm font-medium hover:bg-white/10 hover:text-white transition-colors">
              Remoto
            </button>
            <button className="px-4 py-2 rounded-lg bg-white/5 text-[#94A3B8] text-sm font-medium hover:bg-white/10 hover:text-white transition-colors">
              Estágio
            </button>
            <button className="px-4 py-2 rounded-lg bg-white/5 text-[#94A3B8] text-sm font-medium hover:bg-white/10 hover:text-white transition-colors">
              Júnior
            </button>
          </div>
        </div>

        {/* Results List */}
        <div className="pt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Resultados da busca</h2>
            <span className="text-[#94A3B8] text-sm">Mostrando {filteredVagas.length} vagas</span>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-10 h-10 text-[#06B6D4] animate-spin" />
            </div>
          ) : filteredVagas.length === 0 ? (
            <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10">
              <h3 className="text-xl font-bold text-white mb-2">Nenhuma vaga encontrada</h3>
              <p className="text-[#94A3B8]">Tente ajustar os filtros ou os termos da busca.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredVagas.map((job, index) => {
                let tagsArray = [];
                try {
                  tagsArray = JSON.parse(job.tags);
                } catch {
                  tagsArray = [];
                }
                
                const jobData: JobData = {
                  id: job.id,
                  title: job.title,
                  company: job.company,
                  location: job.location,
                  type: job.type,
                  level: job.level,
                  salaryMin: job.salaryMin,
                  salaryMax: job.salaryMax,
                  tags: tagsArray,
                  isPremium: job.isPremium,
                  createdAt: job.createdAt,
                  companyLogo: job.companyLogo
                };
                
                return <JobCard key={job.id} job={jobData} index={index} />;
              })}
            </div>
          )}

          {!loading && filteredVagas.length > 0 && (
            <div className="mt-12 flex justify-center">
              <button className="px-6 py-3 rounded-xl bg-white/5 text-white font-medium hover:bg-white/10 transition-colors">
                Carregar mais vagas
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
