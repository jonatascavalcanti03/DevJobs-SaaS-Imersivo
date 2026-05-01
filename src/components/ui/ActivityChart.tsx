"use client";

import { motion } from "framer-motion";

interface ChartData {
  day: string;
  value: number;
}

const MOCK_DATA: ChartData[] = [
  { day: "Seg", value: 40 },
  { day: "Ter", value: 65 },
  { day: "Qua", value: 45 },
  { day: "Qui", value: 80 },
  { day: "Sex", value: 55 },
  { day: "Sáb", value: 30 },
  { day: "Dom", value: 20 },
];

export default function ActivityChart() {
  const maxVal = Math.max(...MOCK_DATA.map((d) => d.value));

  return (
    <div className="glass-card p-6 rounded-2xl border border-border/30 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-sm font-semibold text-text-primary">Atividade Semanal</h3>
          <p className="text-xs text-text-secondary">Visualizações de perfil</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#6366F1]" />
          <span className="text-[10px] text-text-secondary">Últimos 7 dias</span>
        </div>
      </div>

      <div className="flex-1 flex items-end justify-between gap-2 h-32 px-2">
        {MOCK_DATA.map((data, i) => (
          <div key={data.day} className="flex-1 flex flex-col items-center gap-2 group">
            <div className="relative w-full flex flex-col items-center justify-end h-full">
              {/* Tooltip */}
              <motion.div 
                initial={{ opacity: 0, y: 0 }}
                whileHover={{ opacity: 1, y: -5 }}
                className="absolute -top-8 bg-surface text-text-primary text-[10px] px-2 py-1 rounded border border-border shadow-xl pointer-events-none"
              >
                {data.value}
              </motion.div>
              
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${(data.value / maxVal) * 100}%` }}
                transition={{ duration: 1, delay: i * 0.1, ease: "easeOut" }}
                className="w-full max-w-[32px] rounded-t-lg bg-gradient-to-t from-[#6366F1]/20 to-[#6366F1] group-hover:to-[#818CF8] transition-colors relative"
              >
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-lg" />
              </motion.div>
            </div>
            <span className="text-[10px] text-text-secondary font-medium">{data.day}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
