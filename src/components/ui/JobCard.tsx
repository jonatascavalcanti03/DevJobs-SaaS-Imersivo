"use client";

import { motion } from "framer-motion";
import {
  MapPin,
  Briefcase,
  Clock,
  TrendingUp,
  DollarSign,
  Crown,
  ExternalLink,
  Building2,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────

export interface JobData {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  location: string;
  type: "REMOTE" | "HYBRID" | "ONSITE";
  level: "INTERN" | "JUNIOR" | "MID" | "SENIOR" | "LEAD";
  salaryMin?: number;
  salaryMax?: number;
  tags: string[];
  isPremium: boolean;
  createdAt: string;
}

// ─── Helpers ─────────────────────────────────────────────────

const typeLabels: Record<string, string> = {
  REMOTE: "Remoto",
  HYBRID: "Híbrido",
  ONSITE: "Presencial",
};

const levelLabels: Record<string, string> = {
  INTERN: "Estágio",
  JUNIOR: "Júnior",
  MID: "Pleno",
  SENIOR: "Sênior",
  LEAD: "Lead",
};

const levelColors: Record<string, string> = {
  INTERN: "from-cyan-500/20 to-cyan-500/5 text-cyan-400 border-cyan-500/20",
  JUNIOR: "from-emerald-500/20 to-emerald-500/5 text-emerald-400 border-emerald-500/20",
  MID: "from-blue-500/20 to-blue-500/5 text-blue-400 border-blue-500/20",
  SENIOR: "from-purple-500/20 to-purple-500/5 text-purple-400 border-purple-500/20",
  LEAD: "from-amber-500/20 to-amber-500/5 text-amber-400 border-amber-500/20",
};

const tagColors = [
  "bg-[#6366F1]/15 text-[#818CF8] border-[#6366F1]/20",
  "bg-[#06B6D4]/15 text-[#22D3EE] border-[#06B6D4]/20",
  "bg-[#8B5CF6]/15 text-[#A78BFA] border-[#8B5CF6]/20",
  "bg-[#EC4899]/15 text-[#F472B6] border-[#EC4899]/20",
  "bg-[#10B981]/15 text-[#34D399] border-[#10B981]/20",
  "bg-[#F59E0B]/15 text-[#FBBF24] border-[#F59E0B]/20",
];

function formatSalary(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Hoje";
  if (diffDays === 1) return "Ontem";
  if (diffDays < 7) return `${diffDays} dias atrás`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} sem. atrás`;
  return `${Math.floor(diffDays / 30)} mês(es) atrás`;
}

// ─── Component ───────────────────────────────────────────────

interface JobCardProps {
  job: JobData;
  index?: number;
}

export default function JobCard({ job, index = 0 }: JobCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 15,
        delay: index * 0.08,
      }}
      whileHover={{ y: -4, scale: 1.01 }}
      className={`group relative rounded-2xl overflow-hidden cursor-pointer ${
        job.isPremium ? "premium-card" : ""
      }`}
    >
      {/* ── Hover Border Glow ── */}
      <div
        className={`absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
          job.isPremium
            ? "bg-gradient-to-r from-[#F59E0B]/50 via-[#F59E0B]/20 to-[#F59E0B]/50"
            : "bg-gradient-to-r from-[#6366F1]/40 via-[#06B6D4]/20 to-[#8B5CF6]/40"
        }`}
      />

      {/* ── Card Body ── */}
      <div className="relative glass-card rounded-2xl p-5 sm:p-6">
        {/* ── Header ── */}
        <div className="flex items-start gap-4">
          {/* Company Logo */}
          <motion.div
            whileHover={{ rotate: [0, -5, 5, 0] }}
            transition={{ duration: 0.5 }}
            className={`flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center ${
              job.isPremium
                ? "bg-gradient-to-br from-[#F59E0B]/20 to-[#F59E0B]/5 border border-[#F59E0B]/20"
                : "bg-gradient-to-br from-[#6366F1]/20 to-[#6366F1]/5 border border-[#6366F1]/20"
            }`}
          >
            {job.companyLogo ? (
              <img
                src={job.companyLogo}
                alt={job.company}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg object-contain"
              />
            ) : (
              <Building2
                className={`w-6 h-6 ${
                  job.isPremium ? "text-[#FBBF24]" : "text-[#818CF8]"
                }`}
              />
            )}
          </motion.div>

          {/* Title & Company */}
          <div className="flex-1 min-w-0">
            <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-[#818CF8] transition-colors duration-300 truncate">
              {job.title}
            </h3>
            <p className="text-sm text-[#94A3B8] mt-0.5 truncate">
              {job.company}
            </p>
          </div>

          {/* Premium Badge (in flow, no overlap) */}
          {job.isPremium && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex-shrink-0"
            >
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#F59E0B]/20 to-[#F59E0B]/10 border border-[#F59E0B]/30">
                <Crown className="w-3.5 h-3.5 text-[#FBBF24]" />
                <span className="text-xs font-bold text-[#FBBF24] uppercase tracking-wider">
                  Premium
                </span>
              </div>
            </motion.div>
          )}
        </div>

        {/* ── Meta Info ── */}
        <div className="flex flex-wrap items-center gap-3 mt-4">
          <span className="flex items-center gap-1.5 text-xs text-[#94A3B8]">
            <MapPin className="w-3.5 h-3.5 text-[#06B6D4]" />
            {job.location}
          </span>
          <span className="flex items-center gap-1.5 text-xs text-[#94A3B8]">
            <Briefcase className="w-3.5 h-3.5 text-[#8B5CF6]" />
            {typeLabels[job.type]}
          </span>
          <span
            className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-gradient-to-r border ${
              levelColors[job.level]
            }`}
          >
            <TrendingUp className="w-3 h-3" />
            {levelLabels[job.level]}
          </span>
        </div>

        {/* ── Salary ── */}
        {(job.salaryMin || job.salaryMax) && (
          <div className="flex items-center gap-1.5 mt-3">
            <DollarSign className="w-4 h-4 text-[#10B981]" />
            <span className="text-sm font-semibold text-[#10B981]">
              {job.salaryMin && job.salaryMax
                ? `${formatSalary(job.salaryMin)} - ${formatSalary(job.salaryMax)}`
                : job.salaryMin
                ? `A partir de ${formatSalary(job.salaryMin)}`
                : `Até ${formatSalary(job.salaryMax!)}`}
            </span>
          </div>
        )}

        {/* ── Tags ── */}
        <div className="flex flex-wrap gap-2 mt-4">
          {job.tags.slice(0, 5).map((tag, i) => (
            <motion.span
              key={tag}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg border ${
                tagColors[i % tagColors.length]
              } transition-all duration-300 hover:scale-105`}
            >
              {tag}
            </motion.span>
          ))}
          {job.tags.length > 5 && (
            <span className="px-2.5 py-1 text-xs text-[#64748B] bg-white/5 rounded-lg border border-white/5">
              +{job.tags.length - 5}
            </span>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="flex items-center justify-between mt-5 pt-4 border-t border-white/5">
          <span className="flex items-center gap-1.5 text-xs text-[#64748B]">
            <Clock className="w-3.5 h-3.5" />
            {timeAgo(job.createdAt)}
          </span>

          <motion.span
            className="flex items-center gap-1.5 text-xs font-medium text-[#818CF8] opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0"
            whileHover={{ x: 3 }}
          >
            Ver vaga
            <ExternalLink className="w-3.5 h-3.5" />
          </motion.span>
        </div>
      </div>
    </motion.article>
  );
}
