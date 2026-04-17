"use client";

import { useState } from "react";
import { Search, MapPin, Filter } from "lucide-react";
import JobCard, { type JobData } from "@/components/ui/JobCard";
import { motion } from "framer-motion";

const MOCK_VAGAS: JobData[] = [
  { id: "1", title: "Desenvolvedor(a) Full-Stack", company: "Meta", location: "Remoto", type: "REMOTE", level: "MID", salaryMin: 12000, salaryMax: 18000, tags: ["React", "Node.js", "AWS"], isPremium: true, createdAt: "2026-04-16T10:00:00Z" },
  { id: "2", title: "Frontend Engineer", company: "Google", location: "São Paulo, SP", type: "HYBRID", level: "SENIOR", salaryMin: 18000, salaryMax: 25000, tags: ["TypeScript", "Next.js", "Tailwind"], isPremium: false, createdAt: "2026-04-15T10:00:00Z" },
  { id: "3", title: "Estágio em Desenvolvimento", company: "Nubank", location: "Remoto", type: "REMOTE", level: "INTERN", salaryMin: 2000, salaryMax: 3000, tags: ["JavaScript", "React"], isPremium: true, createdAt: "2026-04-16T15:00:00Z" },
  { id: "4", title: "Backend Developer Python", company: "Spotify", location: "Remoto", type: "REMOTE", level: "MID", salaryMin: 14000, salaryMax: 17000, tags: ["Python", "Django", "PostgreSQL"], isPremium: false, createdAt: "2026-04-14T10:00:00Z" },
];

export default function SearchJobsPage() {
  const [searchTerm, setSearchTerm] = useState("");

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
            <span className="text-[#94A3B8] text-sm">Mostrando {MOCK_VAGAS.length} vagas</span>
          </div>

          <div className="space-y-4">
            {MOCK_VAGAS.map((job, index) => (
              <JobCard key={job.id} job={job} index={index} />
            ))}
          </div>

          <div className="mt-12 flex justify-center">
            <button className="px-6 py-3 rounded-xl bg-white/5 text-white font-medium hover:bg-white/10 transition-colors">
              Carregar mais vagas
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
