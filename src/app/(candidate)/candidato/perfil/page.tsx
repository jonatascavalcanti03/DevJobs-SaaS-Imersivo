"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { User, Mail, Link as LinkIcon, Code, Globe, Briefcase, FileText, CheckCircle2, Loader2 } from "lucide-react";

import { useSession } from "next-auth/react";

export default function CandidateProfilePage() {
  const { update } = useSession();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // Profile Form States
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [title, setTitle] = useState("");
  const [bio, setBio] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [github, setGithub] = useState("");
  const [portfolio, setPortfolio] = useState("");
  
  // Skills States
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");

  // Resume State (Base64)
  const [resumeFileName, setResumeFileName] = useState("");
  const [resumeBase64, setResumeBase64] = useState("");

  // Image State
  const [image, setImage] = useState("");

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/user/profile");
        if (res.ok) {
          const data = await res.json();
          setName(data.name || "");
          setEmail(data.email || "");
          setTitle(data.title || "");
          setBio(data.bio || "");
          setLinkedin(data.linkedin || "");
          setGithub(data.github || "");
          setPortfolio(data.portfolio || "");
          if (data.skills) setSkills(JSON.parse(data.skills));
          if (data.resume) setResumeFileName("Curriculo_Salvo.pdf");
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
          name, title, bio, linkedin, github, portfolio, skills, resume: resumeBase64 || undefined, image: image || undefined
        })
      });
      if (res.ok) {
        await update(); // Atualiza a sessão no frontend para refletir a foto e nome novos na Sidebar instantaneamente
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

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "application/pdf") {
        alert("Apenas arquivos PDF são aceitos.");
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        alert("O arquivo não pode ter mais de 2MB.");
        return;
      }
      
      setResumeFileName(file.name);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setResumeBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
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
            Meu Perfil
          </motion.h1>
          <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="text-text-secondary">
            Mantenha seu perfil atualizado para atrair melhores oportunidades.
          </motion.p>
        </div>
        <motion.button
          onClick={handleSave}
          disabled={saving}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold shadow-lg transition-all ${
            saveSuccess 
              ? "bg-emerald-500 shadow-emerald-500/25" 
              : "bg-gradient-to-r from-[#6366F1] to-[#06B6D4] shadow-[#6366F1]/25 hover:shadow-[#6366F1]/40 hover:scale-[1.02] active:scale-[0.98]"
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Info (Left Column) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-6">
            <h2 className="text-xl font-bold text-text-primary border-b border-border pb-4">Informações Básicas</h2>
            
            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
              <div 
                className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#6366F1]/30 to-[#06B6D4]/30 border-2 border-border flex items-center justify-center text-text-primary font-bold text-2xl flex-shrink-0 cursor-pointer hover:border-[#6366F1]/50 transition-colors overflow-hidden"
                onClick={() => imageInputRef.current?.click()}
              >
                {image ? (
                  <img src={image} alt="Perfil" className="w-full h-full object-cover" />
                ) : (
                  name ? name.charAt(0).toUpperCase() : "JS"
                )}
              </div>
              <div className="flex-1 space-y-2 w-full">
                <button 
                  onClick={() => imageInputRef.current?.click()}
                  className="px-4 py-2 bg-surface hover:bg-white/10 border border-border rounded-lg text-sm text-text-primary font-medium transition-colors"
                >
                  Alterar Foto
                </button>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  ref={imageInputRef} 
                  onChange={handleImageUpload} 
                />
                <p className="text-xs text-[#64748B]">JPG, GIF ou PNG. Máximo 2MB.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5 ml-1">Nome Completo</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-[#64748B] group-focus-within:text-[#6366F1] transition-colors" />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full pl-11 pr-4 py-3 bg-surface border border-border rounded-xl text-text-primary placeholder-[#64748B] focus:bg-white/10 focus:border-[#6366F1]/50 focus:ring-1 focus:ring-[#6366F1]/50 transition-all outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5 ml-1">Email</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-[#64748B] group-focus-within:text-[#6366F1] transition-colors" />
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

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5 ml-1">Cargo Atual / Titulo Profissional</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Briefcase className="h-5 w-5 text-[#64748B] group-focus-within:text-[#6366F1] transition-colors" />
                </div>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Desenvolvedor Frontend React"
                  className="block w-full pl-11 pr-4 py-3 bg-surface border border-border rounded-xl text-text-primary placeholder-[#64748B] focus:bg-white/10 focus:border-[#6366F1]/50 focus:ring-1 focus:ring-[#6366F1]/50 transition-all outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5 ml-1">Biografia (Bio)</label>
              <textarea
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Fale um pouco sobre você..."
                className="block w-full p-4 bg-surface border border-border rounded-xl text-text-primary placeholder-[#64748B] focus:bg-white/10 focus:border-[#6366F1]/50 focus:ring-1 focus:ring-[#6366F1]/50 transition-all outline-none resize-none"
              />
            </div>
          </div>

          {/* Social Links */}
          <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-6">
            <h2 className="text-xl font-bold text-text-primary border-b border-border pb-4">Links Profissionais</h2>
            
            <div className="space-y-4">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Globe className="h-5 w-5 text-[#64748B] group-focus-within:text-[#0A66C2] transition-colors" />
                </div>
                <input
                  type="url"
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  placeholder="Link do seu LinkedIn"
                  className="block w-full pl-11 pr-4 py-3 bg-surface border border-border rounded-xl text-text-primary placeholder-[#64748B] focus:bg-white/10 focus:border-[#0A66C2]/50 focus:ring-1 focus:ring-[#0A66C2]/50 transition-all outline-none"
                />
              </div>
              
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Code className="h-5 w-5 text-[#64748B] group-focus-within:text-text-primary transition-colors" />
                </div>
                <input
                  type="url"
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                  placeholder="Link do seu GitHub"
                  className="block w-full pl-11 pr-4 py-3 bg-surface border border-border rounded-xl text-text-primary placeholder-[#64748B] focus:bg-white/10 focus:border-white/50 focus:ring-1 focus:ring-white/50 transition-all outline-none"
                />
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <LinkIcon className="h-5 w-5 text-[#64748B] group-focus-within:text-[#6366F1] transition-colors" />
                </div>
                <input
                  type="url"
                  value={portfolio}
                  onChange={(e) => setPortfolio(e.target.value)}
                  placeholder="Link do seu Portfólio (Opcional)"
                  className="block w-full pl-11 pr-4 py-3 bg-surface border border-border rounded-xl text-text-primary placeholder-[#64748B] focus:bg-white/10 focus:border-[#6366F1]/50 focus:ring-1 focus:ring-[#6366F1]/50 transition-all outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar (Skills & Resume) */}
        <div className="space-y-6">
          {/* Resume Upload */}
          <div className="glass-card rounded-3xl p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-[#6366F1]/20 flex items-center justify-center mx-auto mb-4">
              <FileText className="w-6 h-6 text-[#818CF8]" />
            </div>
            <h3 className="text-lg font-bold text-text-primary mb-2">Currículo (PDF)</h3>
            <p className="text-xs text-text-secondary mb-4">Faça upload do seu CV para facilitar a aplicação nas vagas.</p>
            <div 
              className="border-2 border-dashed border-border rounded-xl p-4 hover:bg-surface hover:border-[#6366F1]/30 transition-all cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <span className="text-sm font-medium text-[#818CF8]">
                {resumeFileName ? resumeFileName : "Selecionar arquivo PDF"}
              </span>
            </div>
            <input 
              type="file" 
              accept=".pdf" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
            />
          </div>

          {/* Skills */}
          <div className="glass-card rounded-3xl p-6">
            <h3 className="text-lg font-bold text-text-primary mb-4">Principais Habilidades</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {skills.map((skill) => (
                <span key={skill} className="px-3 py-1 bg-white/10 border border-border rounded-lg text-sm text-text-primary flex items-center gap-2">
                  {skill}
                  <button onClick={() => handleRemoveSkill(skill)} className="text-[#64748B] hover:text-red-400 transition-colors">&times;</button>
                </span>
              ))}
              {skills.length === 0 && <span className="text-sm text-[#64748B]">Nenhuma habilidade adicionada.</span>}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
                placeholder="Ex: Node.js"
                className="block w-full px-3 py-2 bg-surface border border-border rounded-lg text-sm text-text-primary placeholder-[#64748B] focus:bg-white/10 focus:border-[#6366F1]/50 focus:outline-none transition-all"
              />
              <button onClick={handleAddSkill} className="px-3 py-2 bg-[#6366F1] text-white rounded-lg text-sm font-medium hover:bg-[#4F46E5] transition-colors">
                Add
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
