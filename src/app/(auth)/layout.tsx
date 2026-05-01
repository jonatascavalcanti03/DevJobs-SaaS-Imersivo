"use client";

import { motion } from "framer-motion";
import { Code2, Shield, Lock } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Left Panel — Branding (desktop only) */}
      <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden">
        {/* Mesh Background */}
        <div className="absolute inset-0 bg-bg" />
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full bg-[#6366F1]/20 blur-[120px]" style={{ animation: "mesh-move-1 15s ease-in-out infinite" }} />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-[#06B6D4]/15 blur-[120px]" style={{ animation: "mesh-move-2 20s ease-in-out infinite" }} />
        <div className="absolute top-[40%] right-[10%] w-[40%] h-[40%] rounded-full bg-[#8B5CF6]/10 blur-[100px]" style={{ animation: "mesh-move-3 18s ease-in-out infinite" }} />
        
        {/* Grid */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-10 w-full">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6366F1] to-[#06B6D4] flex items-center justify-center shadow-lg shadow-[#6366F1]/25">
              <Code2 className="w-5 h-5 text-text-primary" />
            </div>
            <span className="text-xl font-bold">
              <span className="text-gradient">Match</span><span className="text-[#06B6D4]">.js</span>
            </span>
          </a>

          {/* Main Message */}
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-4xl xl:text-5xl font-extrabold leading-tight mb-6"
            >
              <span className="text-text-primary">Sua carreira em tech </span>
              <span className="text-gradient">começa aqui</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-text-secondary text-lg leading-relaxed max-w-md"
            >
              Conecte-se com as melhores empresas de tecnologia do Brasil. Mais de 2.500 vagas disponíveis.
            </motion.p>
          </div>

          {/* Security Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex items-center gap-6"
          >
            <div className="flex items-center gap-2 text-[#64748B]">
              <Shield className="w-4 h-4 text-[#10B981]" />
              <span className="text-xs">Dados protegidos pela LGPD</span>
            </div>
            <div className="flex items-center gap-2 text-[#64748B]">
              <Lock className="w-4 h-4 text-[#10B981]" />
              <span className="text-xs">Conexão criptografada</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Panel — Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 bg-bg lg:bg-bg/50 backdrop-blur-3xl">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <a href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6366F1] to-[#06B6D4] flex items-center justify-center">
                <Code2 className="w-5 h-5 text-text-primary" />
              </div>
              <span className="text-xl font-bold">
                <span className="text-gradient">Match</span><span className="text-[#06B6D4]">.js</span>
              </span>
            </a>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}
