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
  const [socialLoading, setSocialLoading] = useState<string | null>(null);

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
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: "google" | "linkedin") => {
    setSocialLoading(provider);
    setError("");
    try {
      // O NextAuth redireciona automaticamente para a página do provedor.
      // Após autenticar, o callback redireciona para /candidato por padrão.
      await signIn(provider, { callbackUrl: "/candidato" });
    } catch {
      setError("Erro ao conectar com o provedor. Tente novamente.");
      setSocialLoading(null);
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
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
          Bem-vindo de volta
        </h1>
        <p className="text-[#94A3B8] text-sm">
          Faça login para acessar seu painel
        </p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm mb-6 text-center">
          {error}
        </div>
      )}

      {/* Social Login Buttons */}
      <div className="space-y-3 mb-6">
        {/* Google */}
        <button
          type="button"
          id="btn-login-google"
          onClick={() => handleSocialLogin("google")}
          disabled={!!socialLoading}
          className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-medium transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {socialLoading === "google" ? (
            <svg className="w-5 h-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
          )}
          Continuar com Google
        </button>

        {/* LinkedIn */}
        <button
          type="button"
          id="btn-login-linkedin"
          onClick={() => handleSocialLogin("linkedin")}
          disabled={!!socialLoading}
          className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-medium transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {socialLoading === "linkedin" ? (
            <svg className="w-5 h-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
              <rect width="24" height="24" rx="4" fill="#0A66C2" />
              <path d="M7.75 10H5.5v8h2.25v-8zm-1.125-3.5a1.375 1.375 0 110 2.75 1.375 1.375 0 010-2.75zM18.5 14.25c0-2.5-1.25-4.5-3.5-4.5-1 0-2 .5-2.5 1.25V10H10.25v8H12.5v-4.5c0-1 .75-2 1.75-2s1.75 1 1.75 2V18H18.5v-3.75z" fill="white" />
            </svg>
          )}
          Continuar com LinkedIn
        </button>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 h-px bg-white/10" />
        <span className="text-xs text-[#64748B] uppercase tracking-wider font-medium">
          Ou use seu email
        </span>
        <div className="flex-1 h-px bg-white/10" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
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
            <label className="block text-sm font-medium text-[#94A3B8]">
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
              className="block w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-[#64748B] focus:bg-white/10 focus:border-[#6366F1]/50 focus:ring-1 focus:ring-[#6366F1]/50 transition-all outline-none"
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
              ? "bg-gradient-to-r from-[#6366F1] to-[#06B6D4] text-white shadow-[#6366F1]/25 hover:shadow-[#6366F1]/40 hover:scale-[1.02] active:scale-[0.98]"
              : "bg-white/5 text-[#64748B] cursor-not-allowed"
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

      <p className="mt-8 text-center text-sm text-[#94A3B8]">
        Ainda não tem uma conta?{" "}
        <a
          href="/cadastro"
          className="text-white font-medium hover:text-[#06B6D4] transition-colors"
        >
          Cadastre-se grátis
        </a>
      </p>
    </motion.div>
  );
}
