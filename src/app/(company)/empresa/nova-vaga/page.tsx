"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Briefcase, MapPin, DollarSign, Tag, AlignLeft, CheckCircle2, ArrowRight } from "lucide-react";

export default function NewJobPage() {
  const [isPremium, setIsPremium] = useState(false);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-2xl sm:text-3xl font-bold text-white mb-2">
          Publicar Nova Vaga
        </motion.h1>
        <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="text-[#94A3B8]">
          Preencha os detalhes da oportunidade para atrair os melhores talentos.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-6">
            <h2 className="text-xl font-bold text-white border-b border-white/10 pb-4">Informações Principais</h2>
            
            {/* Título */}
            <div>
              <label className="block text-sm font-medium text-[#94A3B8] mb-1.5 ml-1">Título da Vaga *</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Briefcase className="h-5 w-5 text-[#64748B] group-focus-within:text-[#06B6D4] transition-colors" />
                </div>
                <input
                  type="text"
                  required
                  className="block w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-[#64748B] focus:bg-white/10 focus:border-[#06B6D4]/50 focus:ring-1 focus:ring-[#06B6D4]/50 transition-all outline-none"
                  placeholder="Ex: Desenvolvedor Front-end Senior (React)"
                />
              </div>
            </div>

            {/* Tipo e Nível */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-[#94A3B8] mb-1.5 ml-1">Modelo de Trabalho *</label>
                <select className="block w-full px-4 py-3 bg-[#0A0A1E] border border-white/10 rounded-xl text-white focus:bg-white/10 focus:border-[#06B6D4]/50 focus:ring-1 focus:ring-[#06B6D4]/50 transition-all outline-none appearance-none">
                  <option value="REMOTE">100% Remoto</option>
                  <option value="HYBRID">Híbrido</option>
                  <option value="ONSITE">Presencial</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#94A3B8] mb-1.5 ml-1">Nível *</label>
                <select className="block w-full px-4 py-3 bg-[#0A0A1E] border border-white/10 rounded-xl text-white focus:bg-white/10 focus:border-[#06B6D4]/50 focus:ring-1 focus:ring-[#06B6D4]/50 transition-all outline-none appearance-none">
                  <option value="INTERN">Estágio</option>
                  <option value="JUNIOR">Júnior</option>
                  <option value="MID">Pleno</option>
                  <option value="SENIOR">Sênior</option>
                  <option value="LEAD">Especialista / Tech Lead</option>
                </select>
              </div>
            </div>

            {/* Localização e Salário */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-[#94A3B8] mb-1.5 ml-1">Localização</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-[#64748B] group-focus-within:text-[#06B6D4] transition-colors" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-[#64748B] focus:bg-white/10 focus:border-[#06B6D4]/50 focus:ring-1 focus:ring-[#06B6D4]/50 transition-all outline-none"
                    placeholder="Ex: São Paulo, SP (ou Remoto)"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#94A3B8] mb-1.5 ml-1">Faixa Salarial (R$)</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <DollarSign className="h-5 w-5 text-[#64748B] group-focus-within:text-[#06B6D4] transition-colors" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-[#64748B] focus:bg-white/10 focus:border-[#06B6D4]/50 focus:ring-1 focus:ring-[#06B6D4]/50 transition-all outline-none"
                    placeholder="Ex: 8.000 - 12.000"
                  />
                </div>
              </div>
            </div>
            
            {/* Tags/Tecnologias */}
            <div>
              <label className="block text-sm font-medium text-[#94A3B8] mb-1.5 ml-1">Tecnologias (Tags)</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Tag className="h-5 w-5 text-[#64748B] group-focus-within:text-[#06B6D4] transition-colors" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-[#64748B] focus:bg-white/10 focus:border-[#06B6D4]/50 focus:ring-1 focus:ring-[#06B6D4]/50 transition-all outline-none"
                  placeholder="Ex: React, Node.js, TypeScript (separado por vírgula)"
                />
              </div>
            </div>

            {/* Descrição */}
            <div>
              <label className="block text-sm font-medium text-[#94A3B8] mb-1.5 ml-1">Descrição da Vaga *</label>
              <div className="relative group">
                <div className="absolute top-3 left-4 pointer-events-none">
                  <AlignLeft className="h-5 w-5 text-[#64748B] group-focus-within:text-[#06B6D4] transition-colors" />
                </div>
                <textarea
                  required
                  rows={6}
                  className="block w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-[#64748B] focus:bg-white/10 focus:border-[#06B6D4]/50 focus:ring-1 focus:ring-[#06B6D4]/50 transition-all outline-none resize-none"
                  placeholder="Descreva as responsabilidades, requisitos e benefícios da vaga..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Options & Publish */}
        <div className="space-y-6">
          {/* Upsell Premium */}
          <div className="glass-card rounded-3xl p-6 relative overflow-hidden">
            <div className={`absolute inset-0 border-2 rounded-3xl transition-colors ${isPremium ? "border-[#22D3EE] bg-[#06B6D4]/5" : "border-transparent"}`} />
            
            <div className="relative z-10">
              <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                Destaque sua Vaga 🚀
              </h3>
              <p className="text-sm text-[#94A3B8] mb-5">
                Vagas Premium recebem até 5x mais candidaturas qualificadas e são enviadas na nossa newsletter.
              </p>
              
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="relative flex items-center justify-center mt-0.5">
                  <input
                    type="checkbox"
                    checked={isPremium}
                    onChange={(e) => setIsPremium(e.target.checked)}
                    className="peer sr-only"
                  />
                  <div className="w-5 h-5 rounded border-2 border-white/20 peer-checked:bg-[#06B6D4] peer-checked:border-[#06B6D4] transition-colors flex items-center justify-center">
                    <CheckCircle2 className={`w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity`} />
                  </div>
                </div>
                <div>
                  <span className="text-sm font-bold text-white group-hover:text-[#22D3EE] transition-colors block">
                    Publicar como PREMIUM
                  </span>
                  <span className="text-xs text-[#06B6D4] font-medium">+ R$ 199,00 por vaga</span>
                </div>
              </label>
            </div>
          </div>

          {/* Publish Action */}
          <div className="glass-card rounded-3xl p-6">
            <p className="text-xs text-[#64748B] text-center mb-4">
              Ao publicar, você concorda com nossos Termos de Uso para Recrutadores.
            </p>
            <button className="w-full py-4 rounded-xl bg-gradient-to-r from-[#06B6D4] to-[#6366F1] text-white font-bold text-lg shadow-xl shadow-[#06B6D4]/25 hover:shadow-[#06B6D4]/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2">
              {isPremium ? "Ir para Pagamento" : "Publicar Vaga Grátis"} <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
