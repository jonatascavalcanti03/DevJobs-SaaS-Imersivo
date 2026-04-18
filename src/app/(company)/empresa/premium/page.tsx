"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, Star, Zap, Crown, ArrowRight, Building2, Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";

export default function PlanosPage() {
  const [isAnnual, setIsAnnual] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const success = searchParams.get("success");
  const canceled = searchParams.get("canceled");

  const handleCheckout = async (planName: string) => {
    setLoadingPlan(planName);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planName, isAnnual }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Erro ao iniciar checkout: " + data.message);
        setLoadingPlan(null);
      }
    } catch (error) {
      console.error(error);
      alert("Erro ao processar o pagamento.");
      setLoadingPlan(null);
    }
  };

  const plans = [
    {
      name: "Essencial",
      description: "Ideal para empresas que contratam esporadicamente.",
      priceMonthly: "297",
      priceAnnual: "237", // Equivalente a 20% desconto (R$ 2.844 / ano)
      icon: Building2,
      features: [
        "Até 3 Vagas Destaque por mês",
        "Acesso ao Banco de Currículos",
        "Página da Empresa Básica",
        "Suporte por E-mail",
      ],
      highlight: false,
      buttonText: "Assinar Essencial",
    },
    {
      name: "Corporativo PRO",
      description: "Para empresas que precisam atrair os melhores talentos rápido.",
      priceMonthly: "897",
      priceAnnual: "717", // Equivalente a 20% desconto (R$ 8.604 / ano)
      icon: Crown,
      features: [
        "Vagas Destaque Ilimitadas",
        "Disparo Automático na Newsletter",
        "Match com IA dos melhores candidatos",
        "Selo de 'Empresa Verificada'",
        "Página da Empresa Personalizada",
        "Suporte Prioritário 24/7",
      ],
      highlight: true,
      buttonText: "Começar com o PRO",
    }
  ];

  return (
    <div className="max-w-5xl mx-auto py-8 pb-20 space-y-12">
      {success && (
        <div className="bg-emerald-500/10 border border-emerald-500 text-emerald-400 p-4 rounded-xl text-center font-bold">
          Pagamento aprovado com sucesso! 🎉 Seu plano foi ativado.
        </div>
      )}
      {canceled && (
        <div className="bg-red-500/10 border border-red-500 text-red-400 p-4 rounded-xl text-center font-bold">
          O pagamento foi cancelado. Nenhuma cobrança foi feita.
        </div>
      )}

      {/* Header */}
      <div className="text-center space-y-4">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="text-3xl md:text-5xl font-bold text-white tracking-tight"
        >
          Acelere suas contratações com <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#06B6D4] to-[#6366F1]">planos exclusivos</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.1 }}
          className="text-[#94A3B8] text-lg max-w-2xl mx-auto"
        >
          Escolha o plano ideal para as necessidades da sua empresa e encontre os talentos certos em tempo recorde.
        </motion.p>
      </div>

      {/* Toggle Mensal / Anual */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} 
        animate={{ opacity: 1, scale: 1 }} 
        transition={{ delay: 0.2 }}
        className="flex items-center justify-center gap-4"
      >
        <span className={`text-sm font-medium transition-colors ${!isAnnual ? "text-white" : "text-[#64748B]"}`}>Mensal</span>
        
        <button 
          onClick={() => setIsAnnual(!isAnnual)}
          className="relative inline-flex h-7 w-14 items-center rounded-full bg-white/10 transition-colors focus:outline-none"
        >
          <span 
            className={`inline-block h-5 w-5 transform rounded-full transition-transform ${isAnnual ? "translate-x-8 bg-gradient-to-r from-[#06B6D4] to-[#6366F1]" : "translate-x-1 bg-[#94A3B8]"}`} 
          />
        </button>
        
        <span className={`text-sm font-medium transition-colors flex items-center gap-2 ${isAnnual ? "text-white" : "text-[#64748B]"}`}>
          Anual
          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold">Economize 20%</span>
        </span>
      </motion.div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mt-10">
        {plans.map((plan, index) => {
          const Icon = plan.icon;
          return (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className={`relative rounded-3xl p-[1px] ${plan.highlight ? "shadow-2xl shadow-[#6366F1]/20 mt-4 md:mt-0" : ""}`}
            >
              {/* Borda Gradiente Animada (apenas pro Highlight) */}
              {plan.highlight && (
                <div className="absolute inset-0 bg-gradient-to-br from-[#06B6D4] via-[#6366F1] to-[#8B5CF6] opacity-100 rounded-3xl" />
              )}
              {!plan.highlight && (
                <div className="absolute inset-0 bg-white/10 rounded-3xl" />
              )}

              {/* Corpo do Card */}
              <div className={`relative h-full rounded-[23px] flex flex-col p-8 ${plan.highlight ? "bg-[#0B1121]/95 backdrop-blur-xl" : "bg-[#0F172A]"}`}>
                
                {/* Badge Mais Popular */}
                {plan.highlight && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                    <span className="bg-gradient-to-r from-[#06B6D4] to-[#6366F1] text-white text-[10px] md:text-xs font-bold uppercase tracking-wider py-1.5 px-4 rounded-full flex items-center gap-1.5 shadow-lg whitespace-nowrap">
                      <Star className="w-3.5 h-3.5 fill-current" /> Mais Popular
                    </span>
                  </div>
                )}

                {/* Header do Plano */}
                <div className="mb-6">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${plan.highlight ? "bg-gradient-to-br from-[#06B6D4]/20 to-[#6366F1]/20 text-[#22D3EE]" : "bg-white/5 text-[#94A3B8]"}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-sm text-[#94A3B8] h-10">{plan.description}</p>
                </div>

                {/* Preço */}
                <div className="mb-8">
                  <div className="flex items-end gap-1">
                    <span className="text-4xl font-extrabold text-white">
                      R$ {isAnnual ? plan.priceAnnual : plan.priceMonthly}
                    </span>
                    <span className="text-[#64748B] mb-1">/ mês</span>
                  </div>
                  {isAnnual && (
                    <p className="text-xs text-emerald-400 mt-2 font-medium">
                      Cobrado R$ {Number(plan.priceAnnual) * 12} anualmente
                    </p>
                  )}
                </div>

                {/* Features */}
                <div className="flex-1 space-y-4 mb-8">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className={`mt-0.5 rounded-full p-0.5 flex-shrink-0 ${plan.highlight ? "bg-emerald-500/20 text-emerald-400" : "bg-white/10 text-white"}`}>
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-sm text-[#E2E8F0]">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Botão */}
                <button
                  onClick={() => handleCheckout(plan.name)}
                  disabled={loadingPlan === plan.name}
                  className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 ${
                    plan.highlight
                      ? "bg-gradient-to-r from-[#06B6D4] to-[#6366F1] text-white hover:shadow-[0_0_20px_rgba(99,102,241,0.5)] hover:scale-[1.02]"
                      : "bg-white/5 text-white hover:bg-white/10 border border-white/10"
                  } ${loadingPlan === plan.name ? "opacity-70 cursor-not-allowed" : ""}`}
                >
                  {loadingPlan === plan.name ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      {plan.buttonText}
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
