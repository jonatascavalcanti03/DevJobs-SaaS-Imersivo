"use client";

import { motion } from "framer-motion";
import { type LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  trend?: { value: number; positive: boolean };
  index?: number;
}

export default function StatsCard({ icon: Icon, label, value, trend, index = 0 }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 15, delay: index * 0.1 }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="glass-card rounded-2xl p-5 sm:p-6 group cursor-default relative overflow-hidden"
    >
      {/* Hover Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#6366F1]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#6366F1]/20 to-[#6366F1]/5 border border-[#6366F1]/20 flex items-center justify-center group-hover:from-[#06B6D4]/20 group-hover:to-[#06B6D4]/5 group-hover:border-[#06B6D4]/20 transition-all duration-500 shadow-lg shadow-[#6366F1]/5">
            <Icon className="w-5 h-5 text-[#818CF8] group-hover:text-[#22D3EE] transition-colors duration-500" />
          </div>
          {trend && (
            <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${trend.positive ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>
              {trend.positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {trend.value}%
            </div>
          )}
        </div>
        <div className="text-2xl sm:text-3xl font-bold text-text-primary mb-1">{value}</div>
        <div className="text-sm text-[#64748B] font-medium tracking-tight">{label}</div>
      </div>
    </motion.div>
  );
}
