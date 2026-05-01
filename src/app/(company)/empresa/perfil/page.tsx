"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { User, Mail, Globe, Building2, Users, FileText, CheckCircle2, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";

export default function CompanyProfilePage() {
  const { update } = useSession();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState("");
  const imageInputRef = useRef<HTMLInputElement>(null);

  // Profile Form States
  const [name, setName] = useState(""); // Representante da empresa
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companySite, setCompanySite] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [companyAbout, setCompanyAbout] = useState("");

  // Image State (Logo da empresa ou foto do representante, usado no Sidebar)
  const [image, setImage] = useState("");

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/user/profile");
        if (res.ok) {
          const data = await res.json();
          setName(data.name || "");
          setEmail(data.email || "");
          setCompanyName(data.companyName || "");
          setCompanySite(data.companySite || "");
          setCompanySize(data.companySize || "1-10");
          setCompanyAbout(data.companyAbout || "");
          if (data.image) setImage(data.image);
        }
      } catch (error) {
        console.error("Erro ao carregar perfil");
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaveSuccess(false);
    setSaveError("");
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name, 
          image: image || undefined,
          companyName,
          companySite,
          companySize,
          companyAbout
        })
      });
      if (res.ok) {
        await update(); // Atualiza a sessão no frontend para refletir a foto e nome novos na Sidebar
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        const errorData = await res.json();
        setSaveError(errorData.message || "Erro ao salvar perfil.");
      }
    } catch (error) {
      console.error("Erro ao salvar", error);
      setSaveError("Erro de conexão ao tentar salvar.");
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Por favor, selecione uma imagem válida (JPG, PNG).");
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        alert("A imagem não pode ter mais de 2MB.");
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 text-[#06B6D4] animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-2xl sm:text-3xl font-bold text-text-primary mb-2">
            Perfil da Empresa
          </motion.h1>
          <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="text-text-secondary">
            Configure os detalhes da sua empresa para os candidatos verem.
          </motion.p>
        </div>
        <motion.button
          onClick={handleSave}
          disabled={saving}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-text-primary text-sm font-semibold shadow-lg transition-all ${
            saveSuccess 
              ? "bg-emerald-500 shadow-emerald-500/25" 
              : "bg-gradient-to-r from-[#06B6D4] to-[#6366F1] shadow-[#06B6D4]/25 hover:shadow-[#06B6D4]/40 hover:scale-[1.02] active:scale-[0.98]"
          } ${saving ? "opacity-70 cursor-not-allowed" : ""}`}
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
          {saveSuccess ? "Salvo!" : saving ? "Salvando..." : "Salvar Alterações"}
        </motion.button>
      </div>

      {saveError && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm text-center">
          {saveError}
        </div>
      )}

      <div className="space-y-6">
        {/* Identidade da Empresa */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-6">
          <h2 className="text-xl font-bold text-text-primary border-b border-border pb-4">Identidade da Empresa</h2>
          
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
            <div 
              className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#06B6D4]/30 to-[#6366F1]/30 border-2 border-border flex items-center justify-center text-text-primary font-bold text-2xl flex-shrink-0 cursor-pointer hover:border-[#06B6D4]/50 transition-colors overflow-hidden"
              onClick={() => imageInputRef.current?.click()}
            >
              {image ? (
                <img src={image} alt="Logo da Empresa" className="w-full h-full object-cover" />
              ) : (
                companyName ? companyName.charAt(0).toUpperCase() : <Building2 className="w-8 h-8 text-text-primary/50" />
              )}
            </div>
            <div className="flex-1 space-y-2 w-full">
              <button 
                onClick={() => imageInputRef.current?.click()}
                className="px-4 py-2 bg-surface hover:bg-white/10 border border-border rounded-lg text-sm text-text-primary font-medium transition-colors"
              >
                Alterar Logo / Avatar
              </button>
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                ref={imageInputRef} 
                onChange={handleImageUpload} 
              />
              <p className="text-xs text-[#64748B]">Este avatar também aparecerá na sua barra lateral. JPG ou PNG. Máximo 2MB.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5 ml-1">Nome da Empresa</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Building2 className="h-5 w-5 text-[#64748B] group-focus-within:text-[#06B6D4] transition-colors" />
                </div>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Ex: Tech Solutions SA"
                  className="block w-full pl-11 pr-4 py-3 bg-surface border border-border rounded-xl text-text-primary placeholder-[#64748B] focus:bg-white/10 focus:border-[#06B6D4]/50 focus:ring-1 focus:ring-[#06B6D4]/50 transition-all outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5 ml-1">Website Oficial</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Globe className="h-5 w-5 text-[#64748B] group-focus-within:text-[#06B6D4] transition-colors" />
                </div>
                <input
                  type="url"
                  value={companySite}
                  onChange={(e) => setCompanySite(e.target.value)}
                  placeholder="https://suaempresa.com.br"
                  className="block w-full pl-11 pr-4 py-3 bg-surface border border-border rounded-xl text-text-primary placeholder-[#64748B] focus:bg-white/10 focus:border-[#06B6D4]/50 focus:ring-1 focus:ring-[#06B6D4]/50 transition-all outline-none"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5 ml-1">Tamanho da Empresa</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Users className="h-5 w-5 text-[#64748B] group-focus-within:text-[#06B6D4] transition-colors" />
              </div>
              <select
                value={companySize}
                onChange={(e) => setCompanySize(e.target.value)}
                className="block w-full pl-11 pr-4 py-3 bg-surface border border-border rounded-xl text-text-primary focus:bg-white/10 focus:border-[#06B6D4]/50 focus:ring-1 focus:ring-[#06B6D4]/50 transition-all outline-none appearance-none"
              >
                <option value="1-10">1-10 funcionários (Startup)</option>
                <option value="11-50">11-50 funcionários (Pequena)</option>
                <option value="51-200">51-200 funcionários (Média)</option>
                <option value="201-500">201-500 funcionários (Grande)</option>
                <option value="500+">Mais de 500 funcionários (Corporação)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5 ml-1">Sobre a Empresa</label>
            <textarea
              rows={4}
              value={companyAbout}
              onChange={(e) => setCompanyAbout(e.target.value)}
              placeholder="Descreva a missão, visão, cultura e o que a empresa faz..."
              className="block w-full p-4 bg-surface border border-border rounded-xl text-text-primary placeholder-[#64748B] focus:bg-white/10 focus:border-[#06B6D4]/50 focus:ring-1 focus:ring-[#06B6D4]/50 transition-all outline-none resize-none"
            />
          </div>
        </div>

        {/* Informações do Representante (Acesso) */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-6">
          <h2 className="text-xl font-bold text-text-primary border-b border-border pb-4">Dados do Representante (Conta)</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5 ml-1">Seu Nome</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-[#64748B] group-focus-within:text-[#06B6D4] transition-colors" />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nome do recrutador"
                  className="block w-full pl-11 pr-4 py-3 bg-surface border border-border rounded-xl text-text-primary placeholder-[#64748B] focus:bg-white/10 focus:border-[#06B6D4]/50 focus:ring-1 focus:ring-[#06B6D4]/50 transition-all outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5 ml-1">Email de Acesso</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-[#64748B] transition-colors" />
                </div>
                <input
                  type="email"
                  disabled
                  value={email}
                  className="block w-full pl-11 pr-4 py-3 bg-surface opacity-70 border border-border rounded-xl text-text-secondary cursor-not-allowed outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
