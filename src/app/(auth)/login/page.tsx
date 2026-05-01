"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { signIn } from "next-auth/react";
import { toast } from "sonner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        throw new Error("E-mail ou senha incorretos.");
      }

      // Busca a sessão para redirecionar pela role
      const sessionRes = await fetch("/api/auth/session");
      const session = await sessionRes.json();

      if (session?.user?.role === "COMPANY") {
        window.location.href = "/empresa";
      } else {
        window.location.href = "/candidato";
      }
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message || "Erro ao fazer login");
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
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#6366F1] via-[#06B6D4] to-[#8B5CF6]" />

      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary mb-2">
          Bem-vindo de volta
        </h1>
        <p className="text-text-secondary text-sm">
          Faça login para acessar seu painel
        </p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm mb-6 text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1.5 ml-1">
            Email
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-[#64748B] group-focus-within:text-[#6366F1] transition-colors" />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="block w-full pl-11 pr-4 py-3 bg-surface border border-border rounded-xl text-text-primary placeholder-[#64748B] focus:bg-white/10 focus:border-[#6366F1]/50 focus:ring-1 focus:ring-[#6366F1]/50 transition-all outline-none"
              placeholder="seu@email.com"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5 ml-1 pr-1">
            <label className="block text-sm font-medium text-text-secondary">
              Senha
            </label>
            <a
              href="#"
              className="text-xs text-[#6366F1] hover:text-[#818CF8] transition-colors"
            >
              Esqueceu a senha?
            </a>
          </div>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-[#64748B] group-focus-within:text-[#6366F1] transition-colors" />
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="block w-full pl-11 pr-4 py-3 bg-surface border border-border rounded-xl text-text-primary placeholder-[#64748B] focus:bg-white/10 focus:border-[#6366F1]/50 focus:ring-1 focus:ring-[#6366F1]/50 transition-all outline-none"
              placeholder="••••••••"
            />
          </div>
        </div>

        <button
          type="submit"
          id="btn-login-submit"
          disabled={loading}
          className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold shadow-lg transition-all mt-6 ${
            !loading
              ? "bg-gradient-to-r from-[#6366F1] to-[#06B6D4] text-text-primary shadow-[#6366F1]/25 hover:shadow-[#6366F1]/40 hover:scale-[1.02] active:scale-[0.98]"
              : "bg-surface text-[#64748B] cursor-not-allowed"
          }`}
        >
          {loading ? (
            "Entrando..."
          ) : (
            <>
              Entrar na plataforma <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-text-secondary">
        Ainda não tem uma conta?{" "}
        <a
          href="/cadastro"
          className="text-text-primary font-medium hover:text-[#06B6D4] transition-colors"
        >
          Cadastre-se grátis
        </a>
      </p>
    </motion.div>
  );
}
