"use client";

import { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import { Check, Star, Crown, ArrowRight, Building2, Loader2, BadgeCheck, Zap, Gift } from "lucide-react";
import { useSearchParams } from "next/navigation";

const PLANS = [
  {
    name: "Essencial",
    description: "Ideal para empresas que contratam esporadicamente.",
    priceMonthly: "297",
    priceAnnual: "237",
    icon: Building2,
    highlight: false,
    buttonText: "Assinar Essencial",
    monthlyFeatures: [
      "Até 3 Vagas Destaque por mês",
      "Acesso ao Banco de Currículos",
      "Página da Empresa Básica",
      "Match de Habilidades (candidatos ordenados por fit)",
      "Suporte por E-mail (resposta em 48h)",
    ],
    annualExtras: [
      "4 Vagas Destaque/mês (bônus +1)",
      "Relatório mensal de desempenho PDF",
    ],
  },
  {
    name: "Corporativo PRO",
    description: "Para empresas que precisam atrair os melhores talentos rápido.",
    priceMonthly: "897",
    priceAnnual: "717",
    icon: Crown,
    highlight: true,
    buttonText: "Começar com o PRO",
    monthlyFeatures: [
      "Vagas Destaque Ilimitadas",
      "Acesso ao Banco de Currículos",
      "Match com IA dos melhores candidatos",
      "Selo de 'Empresa Verificada' ✓",
      "Candidatos PRO exibidos no topo",
      "Página da Empresa Personalizada",
      "Suporte Prioritário 24/7 (resposta em 2h)",
    ],
    annualExtras: [
      "Gerente de conta dedicado",
      "Acesso antecipado a novos recursos",
      "Disparo na Newsletter mensal (≥ 10k assinantes)",
    ],
  },
];

function PlanosContent() {
  const [isAnnual, setIsAnnual] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [activatingPlan, setActivatingPlan] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const success = searchParams.get("success");
  const plan = searchParams.get("plan");
  const annual = searchParams.get("annual");
  const canceled = searchParams.get("canceled");

  // Ativa o plano no banco após retorno do Stripe
  useEffect(() => {
    if (success === "true" && plan) {
      setActivatingPlan(plan);
      const activatePlan = async () => {
        try {
          await fetch("/api/checkout", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ plan, isAnnual: annual === "true" }),
          });
        } catch (error) {
          console.error("Erro ao ativar plano:", error);
        } finally {
          setActivatingPlan(null);
        }
      };
      activatePlan();
    }
  }, [success, plan, annual]);

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

  return (
    <div className="max-w-5xl mx-auto py-8 pb-20 space-y-12">
      {/* Feedback de sucesso */}
      {success && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-emerald-500/10 border border-emerald-500 text-emerald-400 p-5 rounded-2xl text-center">
          <p className="text-lg font-bold">🎉 Pagamento aprovado!</p>
          {activatingPlan ? (
            <p className="text-sm mt-1 flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" /> Ativando seu plano...
            </p>
          ) : (
            <p className="text-sm mt-1">Seu plano <strong>{plan}</strong> foi ativado com sucesso{annual === "true" ? " (Anual — 12 meses)" : " (Mensal — 30 dias)"}.</p>
          )}
        </motion.div>
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
          className="text-3xl md:text-5xl font-bold text-text-primary tracking-tight"
        >
          Acelere suas contratações com{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#06B6D4] to-[#6366F1]">planos exclusivos</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-text-secondary text-lg max-w-2xl mx-auto"
        >
          Candidatos PRO aparecem no topo. Match de habilidades real. Vagas em destaque que convertem.
        </motion.p>
      </div>

      {/* Toggle Mensal / Anual */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col items-center gap-3"
      >
        <div className="flex items-center gap-4">
          <span className={`text-sm font-medium transition-colors ${!isAnnual ? "text-text-primary" : "text-text-secondary"}`}>Mensal</span>
          <button
            onClick={() => setIsAnnual(!isAnnual)}
            className="relative inline-flex h-7 w-14 items-center rounded-full bg-surface border border-border transition-colors focus:outline-none"
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full transition-transform ${
                isAnnual ? "translate-x-8 bg-gradient-to-r from-[#06B6D4] to-[#6366F1]" : "translate-x-1 bg-[#94A3B8]"
              }`}
            />
          </button>
          <span className={`text-sm font-medium transition-colors ${isAnnual ? "text-text-primary" : "text-text-secondary"}`}>
            Anual
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold">Economize 20%</span>
          </span>
        </div>

        {isAnnual && (
          <motion.p initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="text-sm text-[#06B6D4] flex items-center gap-1.5">
            <Gift className="w-4 h-4" />
            Assinantes anuais recebem benefícios exclusivos em cada plano
          </motion.p>
        )}
      </motion.div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mt-10">
        {PLANS.map((plan, index) => {
          const Icon = plan.icon;
          return (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className={`relative rounded-3xl p-[1px] ${plan.highlight ? "shadow-2xl shadow-[#6366F1]/20 mt-4 md:mt-0" : ""}`}
            >
              {plan.highlight && (
                <div className="absolute inset-0 bg-gradient-to-br from-[#06B6D4] via-[#6366F1] to-[#8B5CF6] opacity-100 rounded-3xl" />
              )}
              {!plan.highlight && (
                <div className="absolute inset-0 bg-border/20 rounded-3xl" />
              )}

              <div className={`relative h-full rounded-[23px] flex flex-col p-8 ${plan.highlight ? "bg-surface/95 backdrop-blur-xl border border-[#6366F1]/30 shadow-2xl shadow-[#6366F1]/10" : "bg-surface border border-border shadow-lg"}`}>
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
                  <h3 className="text-2xl font-bold text-text-primary mb-2">{plan.name}</h3>
                  <p className="text-sm text-text-secondary">{plan.description}</p>
                </div>

                {/* Preço */}
                <div className="mb-6">
                  <div className="flex items-end gap-1">
                    <span className="text-4xl font-extrabold text-text-primary">
                      R$ {isAnnual ? plan.priceAnnual : plan.priceMonthly}
                    </span>
                    <span className="text-text-secondary mb-1">/ mês</span>
                  </div>
                  {isAnnual && (
                    <p className="text-xs text-emerald-400 mt-1.5 font-medium">
                      Cobrado R$ {Number(plan.priceAnnual) * 12} anualmente — você economiza R$ {(Number(plan.priceMonthly) - Number(plan.priceAnnual)) * 12}/ano
                    </p>
                  )}
                </div>

                {/* Features mensais */}
                <div className="flex-1 space-y-3 mb-5">
                  {plan.monthlyFeatures.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className={`mt-0.5 rounded-full p-0.5 flex-shrink-0 ${plan.highlight ? "bg-emerald-500/20 text-emerald-400" : "bg-surface-hover text-text-primary"}`}>
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-sm text-text-primary">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Extras anuais */}
                {isAnnual && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mb-6 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 space-y-2"
                  >
                    <p className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 mb-3">
                      <Gift className="w-3.5 h-3.5" /> Bônus exclusivos do plano anual
                    </p>
                    {plan.annualExtras.map((extra, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <Zap className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span className="text-xs text-emerald-300">{extra}</span>
                      </div>
                    ))}
                  </motion.div>
                )}

                {/* Botão */}
                <button
                  onClick={() => handleCheckout(plan.name)}
                  disabled={loadingPlan === plan.name}
                  className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 ${
                    plan.highlight
                      ? "bg-gradient-to-r from-[#06B6D4] to-[#6366F1] text-white hover:shadow-[0_0_20px_rgba(99,102,241,0.5)] hover:scale-[1.02]"
                      : "bg-surface text-text-primary hover:bg-surface/80 border border-border"
                  } ${loadingPlan === plan.name ? "opacity-70 cursor-not-allowed" : ""}`}
                >
                  {loadingPlan === plan.name ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      {plan.buttonText} <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Comparativo de diferença entre planos */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="max-w-3xl mx-auto glass-card rounded-3xl p-8"
      >
        <h3 className="text-xl font-bold text-text-primary mb-6 text-center">Por que o Corporativo PRO vale mais?</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div className="space-y-2">
            <div className="w-12 h-12 rounded-xl bg-[#06B6D4]/10 border border-[#06B6D4]/20 flex items-center justify-center mx-auto">
              <BadgeCheck className="w-6 h-6 text-[#06B6D4]" />
            </div>
            <h4 className="text-text-primary font-bold text-sm">Empresa Verificada</h4>
            <p className="text-text-secondary text-xs">Selo azul de verificação nas suas vagas — mais credibilidade para candidatos</p>
          </div>
          <div className="space-y-2">
            <div className="w-12 h-12 rounded-xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 flex items-center justify-center mx-auto">
              <Star className="w-6 h-6 text-[#8B5CF6]" />
            </div>
            <h4 className="text-text-primary font-bold text-sm">Candidatos PRO Primeiro</h4>
            <p className="text-text-secondary text-xs">Perfis PRO são priorizados no topo da fila — acesse os melhores talentos antes</p>
          </div>
          <div className="space-y-2">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto">
              <Zap className="w-6 h-6 text-emerald-400" />
            </div>
            <h4 className="text-text-primary font-bold text-sm">Vagas Ilimitadas</h4>
            <p className="text-text-secondary text-xs">Sem limite de vagas em destaque — publique o quanto precisar</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function PlanosPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-[#06B6D4]" /></div>}>
      <PlanosContent />
    </Suspense>
  );
}
