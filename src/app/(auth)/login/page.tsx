"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { signIn } from "next-auth/react";

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
        password
      });

      if (res?.error) {
        throw new Error("E-mail ou senha incorretos.");
      }

      // Buscar a sessão para saber a role e redirecionar
      const sessionRes = await fetch("/api/auth/session");
      const session = await sessionRes.json();

      if (session?.user?.role === "COMPANY") {
        window.location.href = "/empresa";
      } else {
        window.location.href = "/candidato";
      }
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
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#6366F1] via-[#06B6D4] to-[#8B5CF6]" />
      
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Bem-vindo de volta</h1>
        <p className="text-[#94A3B8] text-sm">Faça login para acessar seu painel</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm mb-6 text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-[#94A3B8] mb-1.5 ml-1">Email</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-[#64748B] group-focus-within:text-[#6366F1] transition-colors" />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="block w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-[#64748B] focus:bg-white/10 focus:border-[#6366F1]/50 focus:ring-1 focus:ring-[#6366F1]/50 transition-all outline-none"
              placeholder="seu@email.com"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5 ml-1 pr-1">
            <label className="block text-sm font-medium text-[#94A3B8]">Senha</label>
            <a href="#" className="text-xs text-[#6366F1] hover:text-[#818CF8] transition-colors">Esqueceu a senha?</a>
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
              className="block w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-[#64748B] focus:bg-white/10 focus:border-[#6366F1]/50 focus:ring-1 focus:ring-[#6366F1]/50 transition-all outline-none"
              placeholder="••••••••"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold shadow-lg transition-all mt-6 ${
            !loading
              ? "bg-gradient-to-r from-[#6366F1] to-[#06B6D4] text-white shadow-[#6366F1]/25 hover:shadow-[#6366F1]/40 hover:scale-[1.02] active:scale-[0.98]" 
              : "bg-white/5 text-[#64748B] cursor-not-allowed"
          }`}
        >
          {loading ? "Entrando..." : (
            <>Entrar na plataforma <ArrowRight className="w-4 h-4" /></>
          )}
        </button>
      </form>

      <div className="mt-6 flex items-center gap-4">
        <div className="flex-1 h-px bg-white/10" />
        <span className="text-xs text-[#64748B] uppercase tracking-wider font-medium">Ou</span>
        <div className="flex-1 h-px bg-white/10" />
      </div>

      <div className="mt-6">
        <button
          type="button"
          onClick={() => {
            // Mock Google Login
            window.location.href = "/candidato";
          }}
          className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-medium transition-all"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Continuar com Google
        </button>
      </div>

      <p className="mt-8 text-center text-sm text-[#94A3B8]">
        Ainda não tem uma conta?{" "}
        <a href="/cadastro" className="text-white font-medium hover:text-[#06B6D4] transition-colors">
          Cadastre-se grátis
        </a>
      </p>
    </motion.div>
  );
}
