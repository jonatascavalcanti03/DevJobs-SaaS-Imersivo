"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Lock,
  User,
  Building2,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { signIn } from "next-auth/react";

type Role = "CANDIDATE" | "COMPANY";

export default function RegisterPage() {
  const [role, setRole] = useState<Role>("CANDIDATE");
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Formulário Candidato
  const [candName, setCandName] = useState("");
  const [candEmail, setCandEmail] = useState("");
  const [candPassword, setCandPassword] = useState("");

  // Formulário Empresa
  const [compName, setCompName] = useState("");
  const [compEmail, setCompEmail] = useState("");
  const [compPassword, setCompPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) return;

    setLoading(true);
    setError("");

    const name = role === "COMPANY" ? compName : candName;
    const email = role === "COMPANY" ? compEmail : candEmail;
    const password = role === "COMPANY" ? compPassword : candPassword;

    try {
      // 1. Cadastra no banco
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Erro ao criar conta.");
      }

      // 2. Faz login automático após o cadastro
      const loginRes = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (loginRes?.error) {
        throw new Error(loginRes.error);
      }

      // 3. Redireciona pelo tipo de conta
      window.location.href = role === "COMPANY" ? "/empresa" : "/candidato";
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-strong rounded-3xl p-8 sm:p-10 w-full relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#06B6D4] via-[#6366F1] to-[#8B5CF6]" />

      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
          Crie sua conta
        </h1>
        <p className="text-[#94A3B8] text-sm">
          Junte-se à maior plataforma tech do Brasil
        </p>
      </div>

      {/* Role Toggle */}
      <div className="flex p-1 bg-white/5 rounded-xl mb-8 relative">
        <div
          className={`absolute inset-y-1 w-[calc(50%-4px)] bg-[#6366F1] rounded-lg transition-all duration-300 ease-out ${
            role === "CANDIDATE" ? "left-1" : "left-[calc(50%+2px)]"
          }`}
        />
        <button
          type="button"
          id="toggle-candidate"
          onClick={() => setRole("CANDIDATE")}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg relative z-10 transition-colors ${
            role === "CANDIDATE" ? "text-white" : "text-[#94A3B8] hover:text-white"
          }`}
        >
          <User className="w-4 h-4" /> Sou Candidato
        </button>
        <button
          type="button"
          id="toggle-company"
          onClick={() => setRole("COMPANY")}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg relative z-10 transition-colors ${
            role === "COMPANY" ? "text-white" : "text-[#94A3B8] hover:text-white"
          }`}
        >
          <Building2 className="w-4 h-4" /> Sou Empresa
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm mb-6 text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <AnimatePresence mode="wait">
          {role === "CANDIDATE" ? (
            <motion.div
              key="candidate"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="space-y-5"
            >
              <div>
                <label className="block text-sm font-medium text-[#94A3B8] mb-1.5 ml-1">
                  Nome completo
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-[#64748B] group-focus-within:text-[#6366F1] transition-colors" />
                  </div>
                  <input
                    type="text"
                    value={candName}
                    onChange={(e) => setCandName(e.target.value)}
                    required
                    minLength={2}
                    className="block w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-[#64748B] focus:bg-white/10 focus:border-[#6366F1]/50 focus:ring-1 focus:ring-[#6366F1]/50 transition-all outline-none"
                    placeholder="João Silva"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#94A3B8] mb-1.5 ml-1">
                  Email
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-[#64748B] group-focus-within:text-[#6366F1] transition-colors" />
                  </div>
                  <input
                    type="email"
                    value={candEmail}
                    onChange={(e) => setCandEmail(e.target.value)}
                    required
                    className="block w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-[#64748B] focus:bg-white/10 focus:border-[#6366F1]/50 focus:ring-1 focus:ring-[#6366F1]/50 transition-all outline-none"
                    placeholder="joao@email.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#94A3B8] mb-1.5 ml-1">
                  Senha
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-[#64748B] group-focus-within:text-[#6366F1] transition-colors" />
                  </div>
                  <input
                    type="password"
                    value={candPassword}
                    onChange={(e) => setCandPassword(e.target.value)}
                    required
                    minLength={6}
                    className="block w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-[#64748B] focus:bg-white/10 focus:border-[#6366F1]/50 focus:ring-1 focus:ring-[#6366F1]/50 transition-all outline-none"
                    placeholder="Mínimo 6 caracteres"
                  />
                </div>
                {/* Password Strength Indicator */}
                {candPassword.length > 0 && (
                  <div className="mt-2 flex gap-1 h-1.5">
                    <div className={`flex-1 rounded-full ${candPassword.length > 0 ? "bg-red-500" : "bg-white/10"}`} />
                    <div className={`flex-1 rounded-full ${candPassword.length >= 6 ? "bg-amber-500" : "bg-white/10"}`} />
                    <div className={`flex-1 rounded-full ${candPassword.length >= 10 ? "bg-emerald-500" : "bg-white/10"}`} />
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="company"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-5"
            >
              <div>
                <label className="block text-sm font-medium text-[#94A3B8] mb-1.5 ml-1">
                  Nome da Empresa
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Building2 className="h-5 w-5 text-[#64748B] group-focus-within:text-[#6366F1] transition-colors" />
                  </div>
                  <input
                    type="text"
                    value={compName}
                    onChange={(e) => setCompName(e.target.value)}
                    required
                    minLength={2}
                    className="block w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-[#64748B] focus:bg-white/10 focus:border-[#6366F1]/50 focus:ring-1 focus:ring-[#6366F1]/50 transition-all outline-none"
                    placeholder="Tech Corp Brasil"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#94A3B8] mb-1.5 ml-1">
                  Email Corporativo
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-[#64748B] group-focus-within:text-[#6366F1] transition-colors" />
                  </div>
                  <input
                    type="email"
                    value={compEmail}
                    onChange={(e) => setCompEmail(e.target.value)}
                    required
                    className="block w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-[#64748B] focus:bg-white/10 focus:border-[#6366F1]/50 focus:ring-1 focus:ring-[#6366F1]/50 transition-all outline-none"
                    placeholder="vagas@empresa.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#94A3B8] mb-1.5 ml-1">
                  Senha
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-[#64748B] group-focus-within:text-[#6366F1] transition-colors" />
                  </div>
                  <input
                    type="password"
                    value={compPassword}
                    onChange={(e) => setCompPassword(e.target.value)}
                    required
                    minLength={6}
                    className="block w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-[#64748B] focus:bg-white/10 focus:border-[#6366F1]/50 focus:ring-1 focus:ring-[#6366F1]/50 transition-all outline-none"
                    placeholder="Mínimo 6 caracteres"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Termos e LGPD */}
        <label className="flex items-start gap-3 cursor-pointer group mt-6">
          <div className="relative flex items-center justify-center mt-0.5">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="peer sr-only"
            />
            <div className="w-5 h-5 rounded border-2 border-white/20 peer-checked:bg-[#6366F1] peer-checked:border-[#6366F1] transition-colors flex items-center justify-center">
              <CheckCircle2
                className={`w-3.5 h-3.5 text-white ${agreed ? "opacity-100" : "opacity-0"} transition-opacity`}
              />
            </div>
          </div>
          <span className="text-sm text-[#94A3B8] group-hover:text-white transition-colors">
            Li e concordo com os{" "}
            <a href="#" className="text-[#6366F1] hover:underline">
              Termos de Uso
            </a>{" "}
            e a{" "}
            <a href="#" className="text-[#6366F1] hover:underline">
              Política de Privacidade
            </a>
            , autorizando o tratamento dos meus dados conforme a LGPD.
          </span>
        </label>

        <button
          type="submit"
          id="btn-register-submit"
          disabled={!agreed || loading}
          className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold shadow-lg transition-all mt-6 ${
            agreed && !loading
              ? "bg-gradient-to-r from-[#06B6D4] to-[#6366F1] text-white shadow-[#6366F1]/25 hover:shadow-[#6366F1]/40 hover:scale-[1.02] active:scale-[0.98]"
              : "bg-white/5 text-[#64748B] cursor-not-allowed"
          }`}
        >
          {loading ? (
            "Criando conta..."
          ) : (
            <>
              Criar conta grátis <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-[#94A3B8]">
        Já tem uma conta?{" "}
        <a
          href="/login"
          className="text-white font-medium hover:text-[#06B6D4] transition-colors"
        >
          Faça login
        </a>
      </p>
    </motion.div>
  );
}
