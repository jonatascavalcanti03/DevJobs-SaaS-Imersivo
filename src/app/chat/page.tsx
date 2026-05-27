import { Bot, Wrench } from "lucide-react";

export default function ChatPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-100 dark:bg-zinc-950 p-4">
      <div className="w-full max-w-md text-center">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">DevJobs AI</h1>
          <p className="text-zinc-500 dark:text-zinc-400">
            Assistente virtual inteligente para encontrar vagas.
          </p>
        </div>

        {/* Chat Inativo - Em Manutenção */}
        <div className="flex flex-col h-[500px] w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 bg-zinc-50 dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-500 text-white">
              <Bot size={18} />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Assistente DevJobs</h2>
              <p className="text-xs text-amber-500 font-medium">⏸ Temporariamente inativo</p>
            </div>
          </div>

          {/* Corpo - Mensagem de manutenção */}
          <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-5">
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-amber-100 dark:bg-amber-900/20">
              <Wrench size={40} className="text-amber-500" />
            </div>
            <div className="space-y-2 max-w-[280px]">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                Em atualização
              </h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Nosso assistente com IA está passando por melhorias e estará de volta em breve com novos recursos!
              </p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              <span className="text-xs font-medium text-amber-600 dark:text-amber-400">Previsão: em breve</span>
            </div>
          </div>

          {/* Input desabilitado */}
          <div className="p-3 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950">
            <div className="relative flex items-center">
              <input
                disabled
                placeholder="Chat temporariamente indisponível..."
                className="w-full pl-4 pr-12 py-3 bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-full text-sm text-zinc-400 cursor-not-allowed"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
