"use client";

const statusConfig: Record<string, { label: string; classes: string }> = {
  PENDING: { label: "Pendente", classes: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
  REVIEWED: { label: "Em análise", classes: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  ACCEPTED: { label: "Aceito", classes: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  REJECTED: { label: "Rejeitado", classes: "bg-red-500/10 text-red-400 border-red-500/20" },
  ACTIVE: { label: "Ativa", classes: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  CLOSED: { label: "Fechada", classes: "bg-[#64748B]/10 text-[#64748B] border-[#64748B]/20" },
  DRAFT: { label: "Rascunho", classes: "bg-purple-500/10 text-purple-400 border-purple-500/20" },
};

interface StatusBadgeProps {
  status: string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status] || { label: status, classes: "bg-white/5 text-[#94A3B8] border-white/10" };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border ${config.classes}`}>
      {config.label}
    </span>
  );
}
