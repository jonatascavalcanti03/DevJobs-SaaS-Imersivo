"use client";

import { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import { Check, Star, Zap, Shield, Crown, ArrowRight, Loader2, Calendar, AlertTriangle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";

const BENEFITS = [
  {
    title: "Prioridade nas Candidaturas",
    description: "Seu perfil aparece no TOPO da lista para os recrutadores — antes de todos os candidatos gratuitos.",
    icon: Zap,
  },
  {
    title: "Selo de Perfil PRO",
    description: "Badge dourado ⭐ visível na sua candidatura que transmite mais credibilidade aos recrutadores.",
    icon: Shield,
  },
  {
    title: "Match de Habilidades Priorizado",
    description: "Mesmo com match igual, candidatos PRO sempre aparecem na frente na triagem das empresas.",
    icon: Star,
  },
  {
    title: "Garantia de Visibilidade",
    description: "Enquanto seu plano estiver ativo, você é sempre exibido no topo — sem algoritmos que te enterrem.",
    icon: Crown,
  },
];

function Lock(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function ProContent() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const successUrl = searchParams.get("success");
  const canceled = searchParams.get("canceled");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [proStatus, setProStatus] = useState<{ isPro: boolean; expiresAt: string | null } | null>(null);
  const [loadingStatus, setLoadingStatus] = useState(true);

  // Busca o status PRO atual do usuário
  useEffect(() => {
    async function fetchProStatus() {
      try {
        const res = await fetch("/api/user/profile");
        if (res.ok) {
          const data = await res.json();
          const now = new Date();
          const expires = data.proExpiresAt ? new Date(data.proExpiresAt) : null;
          const activelyPro = data.isPro && (!expires || expires > now);
          setProStatus({
            isPro: activelyPro,
            expiresAt: data.proExpiresAt || null,
          });
        }
      } catch {
        /* silently fail */
      } finally {
        setLoadingStatus(false);
      }
    }
    if (session?.user) fetchProStatus();
    else setLoadingStatus(false);
  }, [session]);

  // Ativa PRO após redirect do Stripe
  useEffect(() => {
    if (successUrl === "true" && !success) {
      const activatePro = async () => {
        try {
          const res = await fetch("/api/checkout/pro", { method: "PUT" });
          if (res.ok) {
            setSuccess(true);
            setTimeout(() => (window.location.href = "/candidato"), 3000);
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
        <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-3xl md:text-4xl font-bold text-text-primary">
          Pagamento Aprovado! 🎉
        </motion.h2>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-text-secondary">
          Seu perfil agora é PRO. Redirecionando para o Dashboard...
        </motion.p>
      </div>
    );
  }

  const isActive = proStatus?.isPro;
  const expiresAt = proStatus?.expiresAt ? new Date(proStatus.expiresAt) : null;
  const daysLeft = expiresAt ? Math.ceil((expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : null;
  const expiringSoon = daysLeft !== null && daysLeft <= 7 && daysLeft > 0;

  return (
    <div className="max-w-5xl mx-auto space-y-12">
      {canceled && (
        <div className="bg-red-500/10 border border-red-500 text-red-400 p-4 rounded-xl text-center font-bold">
          O pagamento foi cancelado. Nenhuma cobrança foi feita.
        </div>
      )}

      {/* Status atual do plano PRO */}
      {!loadingStatus && isActive && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className={`rounded-2xl p-5 flex items-start gap-4 ${expiringSoon ? "bg-[#F59E0B]/10 border border-[#F59E0B]/30" : "bg-emerald-500/10 border border-emerald-500/30"}`}>
          {expiringSoon ? <AlertTriangle className="w-6 h-6 text-[#FBBF24] flex-shrink-0 mt-0.5" /> : <Check className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-0.5" />}
          <div>
            <p className={`font-bold ${expiringSoon ? "text-[#FBBF24]" : "text-emerald-400"}`}>
              {expiringSoon ? `⚠️ Seu PRO expira em ${daysLeft} dia${daysLeft > 1 ? "s" : ""}!` : "✅ Você já é PRO!"}
            </p>
            {expiresAt && (
              <p className="text-sm text-text-secondary mt-0.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {expiringSoon ? "Renove agora para não perder sua prioridade." : `Plano ativo até ${expiresAt.toLocaleDateString("pt-BR")}`}
              </p>
            )}
          </div>
        </motion.div>
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
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-text-primary"
        >
          Destaque-se com o <span className="text-[#FBBF24]">Match.js PRO</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-text-secondary max-w-2xl mx-auto"
        >
          Candidatos PRO aparecem <strong className="text-text-primary">no topo da lista</strong> de todas as empresas — sua candidatura é vista primeiro, sempre.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        {/* Pricing Card */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="relative rounded-3xl overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#F59E0B]/30 via-[#6366F1]/10 to-[#F59E0B]/30" style={{ animation: "gradient-shift 8s ease infinite", backgroundSize: "200% 200%" }} />
          <div className="absolute inset-0 bg-surface/90 backdrop-blur-xl border border-border" />
          <div className="absolute inset-[1px] rounded-[23px] bg-gradient-to-br from-border to-transparent pointer-events-none" />

          <div className="relative p-8 sm:p-10 z-10 text-center">
            <h3 className="text-xl font-bold text-text-primary mb-2">Assinatura Mensal</h3>
            <p className="text-text-secondary text-sm mb-6">Cancele quando quiser, sem fidelidade.</p>

            <div className="flex items-end justify-center gap-1 mb-3">
              <span className="text-2xl font-semibold text-[#FBBF24]">R$</span>
              <span className="text-6xl font-extrabold text-text-primary leading-none">29</span>
              <span className="text-lg text-text-secondary mb-1">/mês</span>
            </div>
            <p className="text-xs text-text-secondary mb-8">Equivale a menos de R$ 1/dia</p>

            {/* O que está incluso */}
            <div className="text-left space-y-2.5 mb-8">
              {["Perfil PRO no topo por 30 dias", "Badge dourado ⭐ visível nas candidaturas", "Prioridade em todas as vagas", "Cancelamento a qualquer momento"].map((item, i) => (
                <div key={i} className="flex items-center gap-2.5 text-sm text-text-primary">
                  <div className="w-5 h-5 rounded-full bg-[#F59E0B]/20 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-[#FBBF24]" />
                  </div>
                  {item}
                </div>
              ))}
            </div>

            <button
              onClick={handleSubscribe}
              disabled={loading}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${
                loading
                  ? "bg-surface text-text-secondary cursor-not-allowed"
                  : "bg-gradient-to-r from-[#F59E0B] to-[#F97316] text-black shadow-xl shadow-[#F59E0B]/25 hover:shadow-[#F59E0B]/40 hover:scale-[1.02] active:scale-[0.98]"
              }`}
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>{isActive ? "Renovar PRO" : "Assinar Agora"} <ArrowRight className="w-5 h-5" /></>}
            </button>

            <p className="mt-4 text-xs text-text-secondary flex items-center justify-center gap-1.5">
              <Lock className="w-3.5 h-3.5" /> Pagamento 100% seguro via Stripe
            </p>
          </div>
        </motion.div>

        {/* Benefits List */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-5"
        >
          {BENEFITS.map((benefit, i) => (
            <div key={i} className="flex items-start gap-4 p-5 rounded-2xl hover:bg-surface transition-colors border border-transparent hover:border-border/50">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#F59E0B]/20 to-[#F59E0B]/5 border border-[#F59E0B]/20 flex items-center justify-center flex-shrink-0">
                <benefit.icon className="w-6 h-6 text-[#FBBF24]" />
              </div>
              <div>
                <h4 className="text-base font-bold text-text-primary mb-1">{benefit.title}</h4>
                <p className="text-sm text-text-secondary leading-relaxed">{benefit.description}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Garantia */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-center p-8 rounded-2xl glass-card border border-[#F59E0B]/10 max-w-3xl mx-auto"
      >
        <h4 className="text-xl font-bold text-text-primary mb-2">Garantia de 7 dias</h4>
        <p className="text-text-secondary text-sm">
          Se você não gostar dos benefícios ou não receber mais atenção dos recrutadores, devolvemos 100% do seu dinheiro nos primeiros 7 dias. Sem perguntas.
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
