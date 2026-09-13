'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { useRef, useEffect, useState } from 'react';

export function DevJobsChat() {
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
  });
  const [input, setInput] = useState('');
  const isLoading = status === 'submitted' || status === 'streaming';
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-[500px] w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-zinc-50 dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white">
          <Bot size={18} />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Assistente DevJobs</h2>
          <p className="text-xs text-zinc-500">Online e pronto para ajudar</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-3 opacity-50">
            <Bot size={48} className="text-zinc-400" />
            <p className="text-sm text-zinc-500 max-w-[200px]">
              Olá! Como posso ajudar você a encontrar a sua próxima vaga?
            </p>
          </div>
        )}
        
        {messages.map(m => (
          <div key={m.id} className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {m.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0 text-blue-600 dark:text-blue-400">
                <Bot size={16} />
              </div>
            )}
            
            <div className={`px-4 py-2 rounded-2xl max-w-[80%] text-sm ${
              m.role === 'user' 
                ? 'bg-blue-600 text-white rounded-tr-none' 
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-tl-none'
            }`}>
              {m.parts?.map((part, index) =>
                part.type === 'text' ? <span key={index}>{part.text}</span> : null,
              )}
            </div>

            {m.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center flex-shrink-0 text-zinc-600 dark:text-zinc-300">
                <User size={16} />
              </div>
            )}
          </div>
        ))}
        {isLoading && (
           <div className="flex gap-3 justify-start">
             <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0 text-blue-600 dark:text-blue-400">
                <Bot size={16} />
              </div>
              <div className="px-4 py-2 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-tl-none flex items-center gap-2">
                <Loader2 size={14} className="animate-spin" />
                <span className="text-xs">Pensando...</span>
              </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (!input.trim() || isLoading) return;
          void sendMessage({ text: input.trim() });
          setInput('');
        }}
        className="p-3 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950"
      >
        <div className="relative flex items-center">
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Digite sua mensagem..."
            className="w-full pl-4 pr-12 py-3 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all dark:text-white"
          />
          <button
            type="submit"
            disabled={isLoading || !(input || '').trim()}
            className="absolute right-1.5 flex items-center justify-center w-9 h-9 rounded-full bg-blue-600 text-white disabled:bg-zinc-300 disabled:dark:bg-zinc-700 disabled:text-zinc-500 transition-all hover:bg-blue-700"
          >
            <Send size={16} className={(input || '').trim() ? "ml-0.5" : ""} />
          </button>
        </div>
      </form>
    </div>
  );
}
