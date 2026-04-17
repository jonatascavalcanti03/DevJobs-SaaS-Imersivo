"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Star, Zap, Users, Building2, ArrowRight, Eye, Mail, Loader2 } from "lucide-react";

export default function CompanyPremiumPage() {
  const benefits = [
    {
      title: "Vagas em Destaque",
      description: "Suas vagas ganham o selo PREMIUM e ficam fixadas no topo das buscas.",
      icon: Star,
    },
    {
      title: "Disparo na Newsletter",
      description: "Sua vaga é enviada por e-mail para nossa base de +45.000 desenvolvedores ativos.",
      icon: Mail,
    },
    {
      title: "Busca Ativa (Banco de Talentos)",
      description: "Busque e convide candidatos diretamente, mesmo antes deles se aplicarem.",
      icon: Users,
    },
    {
      title: "Página da Empresa Customizada",
      description: "Adicione vídeos, fotos do escritório e depoimentos para fortalecer seu Employer Branding.",
      icon: Building2,
    },
  ];

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout/premium", { method: "POST" });
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => window.location.href = "/empresa", 3000);
      }
    } catch (error) {
      console.error("Erro no checkout", error);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center border border-emerald-500/30">
          <Check className="w-12 h-12 text-emerald-400" />
        </motion.div>
        <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-3xl md:text-4xl font-bold text-white">
          Pagamento Aprovado! 🚀
        </motion.h2>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[#94A3B8]">
          1 Crédito Premium adicionado à sua conta. Redirecionando...
        </motion.p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#06B6D4]/20 to-[#6366F1]/20 border border-[#06B6D4]/20 mb-4 shadow-lg shadow-[#06B6D4]/10"
        >
          <Zap className="w-8 h-8 text-[#22D3EE]" />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-white"
        >
          Feche vagas 3x mais rápido com o <span className="text-[#22D3EE]">Premium</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-[#94A3B8] max-w-2xl mx-auto"
        >
          Atraia os melhores desenvolvedores do Brasil destacando suas oportunidades e fortalecendo a marca empregadora da sua empresa.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Benefits List */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6 order-2 md:order-1"
        >
          {benefits.map((benefit, i) => (
            <div key={i} className="flex items-start gap-4 p-4 rounded-2xl hover:bg-white/5 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#06B6D4]/20 to-[#6366F1]/20 border border-[#06B6D4]/20 flex items-center justify-center flex-shrink-0">
                <benefit.icon className="w-6 h-6 text-[#22D3EE]" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white mb-1">{benefit.title}</h4>
                <p className="text-sm text-[#94A3B8] leading-relaxed">{benefit.description}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Pricing Card */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="relative rounded-3xl overflow-hidden group order-1 md:order-2"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#06B6D4]/30 via-[#6366F1]/30 to-[#8B5CF6]/30" style={{ animation: "gradient-shift 8s ease infinite", backgroundSize: "200% 200%" }} />
          <div className="absolute inset-0 bg-[#050510]/80 backdrop-blur-xl" />
          <div className="absolute inset-[1px] rounded-[23px] bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
          
          <div className="relative p-8 sm:p-10 z-10 text-center">
            <h3 className="text-xl font-bold text-white mb-2">Vaga Destaque (Única)</h3>
            <p className="text-[#94A3B8] text-sm mb-6">Destaque por 30 dias + Disparo de e-mail.</p>
            
            <div className="flex items-end justify-center gap-1 mb-8">
              <span className="text-2xl font-semibold text-[#22D3EE]">R$</span>
              <span className="text-6xl font-extrabold text-white leading-none">199</span>
              <span className="text-lg text-[#94A3B8] mb-1">/vaga</span>
            </div>

            <button 
              onClick={handleCheckout}
              disabled={loading}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${
                loading 
                  ? "bg-white/10 text-[#64748B] cursor-not-allowed" 
                  : "bg-gradient-to-r from-[#06B6D4] to-[#6366F1] text-white shadow-xl shadow-[#06B6D4]/25 hover:shadow-[#06B6D4]/40 hover:scale-[1.02] active:scale-[0.98]"
              }`}
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Comprar Crédito <ArrowRight className="w-5 h-5" /></>}
            </button>
            
            <div className="mt-6 pt-6 border-t border-white/10">
              <p className="text-sm text-[#94A3B8] mb-4">Contrata muito? Conheça nossos pacotes:</p>
              <button className="w-full py-3 rounded-xl glass border border-white/10 text-white font-medium hover:bg-white/5 transition-all">
                Falar com Vendas (Pacotes Corporativos)
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
