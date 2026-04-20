"use client";

import { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import { Check, Star, Zap, Shield, Crown, ArrowRight, Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";

function ProContent() {
  const benefits = [
    {
      title: "Prioridade nas Candidaturas",
      description: "Seu currículo aparece sempre no topo da lista para os recrutadores.",
      icon: Zap,
    },
    {
      title: "Selo de Perfil Verificado",
      description: "Ganhe uma coroa dourada no perfil que transmite mais credibilidade.",
      icon: Shield,
    },
    {
      title: "Vagas Exclusivas",
      description: "Acesse oportunidades premium antes dos usuários gratuitos.",
      icon: Star,
    },
    {
      title: "Análise de Concorrência",
      description: "Veja como seu perfil se compara com outros candidatos da mesma vaga.",
      icon: Crown,
    },
  ];

  const searchParams = useSearchParams();
  const successUrl = searchParams.get("success");
  const canceled = searchParams.get("canceled");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (successUrl === "true" && !success) {
      // Ativar o plano PRO do usuário chamando o método PUT
      const activatePro = async () => {
        try {
          const res = await fetch("/api/checkout/pro", { method: "PUT" });
          if (res.ok) {
            setSuccess(true);
            setTimeout(() => window.location.href = "/candidato", 3000);
          }
        } catch (error) {
          console.error("Erro ao ativar", error);
        }
      };
      activatePro();
    }
  }, [successUrl, success]);

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout/pro", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Erro: " + data.message);
        setLoading(false);
      }
    } catch (error) {
      console.error("Erro no checkout", error);
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
          Pagamento Aprovado! 🎉
        </motion.h2>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[#94A3B8]">
          Seu perfil agora é PRO. Redirecionando para o Dashboard...
        </motion.p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-12">
      {canceled && (
        <div className="bg-red-500/10 border border-red-500 text-red-400 p-4 rounded-xl text-center font-bold">
          O pagamento foi cancelado. Nenhuma cobrança foi feita.
        </div>
      )}

      {/* Header */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#F59E0B]/20 to-[#F59E0B]/5 border border-[#F59E0B]/20 mb-4 shadow-lg shadow-[#F59E0B]/10"
        >
          <Crown className="w-8 h-8 text-[#FBBF24]" />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-white"
        >
          Destaque-se com o <span className="text-[#FBBF24]">DevJobs PRO</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-[#94A3B8] max-w-2xl mx-auto"
        >
          Aumente suas chances de contratação em até 4x aparecendo no topo das buscas dos recrutadores das maiores empresas tech.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Pricing Card */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="relative rounded-3xl overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#F59E0B]/30 via-[#6366F1]/10 to-[#F59E0B]/30" style={{ animation: "gradient-shift 8s ease infinite", backgroundSize: "200% 200%" }} />
          <div className="absolute inset-0 bg-[#050510]/80 backdrop-blur-xl" />
          <div className="absolute inset-[1px] rounded-[23px] bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
          
          <div className="relative p-8 sm:p-10 z-10 text-center">
            <h3 className="text-xl font-bold text-white mb-2">Assinatura Mensal</h3>
            <p className="text-[#94A3B8] text-sm mb-6">Cancele quando quiser, sem fidelidade.</p>
            
            <div className="flex items-end justify-center gap-1 mb-8">
              <span className="text-2xl font-semibold text-[#FBBF24]">R$</span>
              <span className="text-6xl font-extrabold text-white leading-none">29</span>
              <span className="text-lg text-[#94A3B8] mb-1">/mês</span>
            </div>

            <button 
              onClick={handleSubscribe}
              disabled={loading}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${
                loading 
                  ? "bg-white/10 text-[#64748B] cursor-not-allowed" 
                  : "bg-gradient-to-r from-[#F59E0B] to-[#F97316] text-black shadow-xl shadow-[#F59E0B]/25 hover:shadow-[#F59E0B]/40 hover:scale-[1.02] active:scale-[0.98]"
              }`}
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Assinar Agora <ArrowRight className="w-5 h-5" /></>}
            </button>
            
            <p className="mt-4 text-xs text-[#64748B] flex items-center justify-center gap-1.5">
              <Lock className="w-3.5 h-3.5" /> Pagamento 100% seguro via Stripe
            </p>
          </div>
        </motion.div>

        {/* Benefits List */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-6"
        >
          {benefits.map((benefit, i) => (
            <div key={i} className="flex items-start gap-4 p-4 rounded-2xl hover:bg-white/5 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#F59E0B]/20 to-[#F59E0B]/5 border border-[#F59E0B]/20 flex items-center justify-center flex-shrink-0">
                <benefit.icon className="w-6 h-6 text-[#FBBF24]" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white mb-1">{benefit.title}</h4>
                <p className="text-sm text-[#94A3B8] leading-relaxed">{benefit.description}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* FAQ ou Garantia */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-center p-8 rounded-2xl glass-card border border-[#F59E0B]/10 max-w-3xl mx-auto mt-12"
      >
        <h4 className="text-xl font-bold text-white mb-2">Garantia de 7 dias</h4>
        <p className="text-[#94A3B8] text-sm">
          Se você não gostar dos benefícios ou não receber mais contatos de recrutadores, devolvemos 100% do seu dinheiro nos primeiros 7 dias. Sem perguntas.
        </p>
      </motion.div>
    </div>
  );
}

export default function CandidateProPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-[#06B6D4]" /></div>}>
      <ProContent />
    </Suspense>
  );
}

// Lock icon local para não quebrar imports
function Lock(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  );
}
