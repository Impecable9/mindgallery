import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Sparkles, Loader2, ExternalLink } from 'lucide-react';
import { Language, Thought } from '../types';
import { UI_TRANSLATIONS } from '../constants';

interface Message {
  role: 'user' | 'model';
  text: string;
  recommendedThoughtId?: string;
}

interface ChatOracleProps {
  language: Language;
  isNegativeMode: boolean;
  thoughts: Thought[];
  onSelectThought: (thought: Thought) => void;
}

const ChatOracle: React.FC<ChatOracleProps> = ({ language, isNegativeMode, thoughts, onSelectThought }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const t = UI_TRANSLATIONS[language];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Prepare a small context of available thoughts for the AI
      const thoughtContext = thoughts.slice(0, 50).map(th => ({
        id: th.id,
        limiting: th.content[language].limiting,
        expansive: th.content[language].expansive
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map(m => ({
            role: m.role === 'model' ? 'assistant' : 'user',
            content: m.text
          })),
          language,
          thoughtContext
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "The Oracle is momentarily silent.");
      
      const fullText = data.text || "The Oracle is silent for now...";
      
      // Parse recommendation
      const recommendMatch = fullText.match(/\[RECOMMEND:\s*([^\]]+)\]/);
      const recommendedId = recommendMatch ? recommendMatch[1].trim() : undefined;
      const cleanText = fullText.replace(/\[RECOMMEND:\s*[^\]]+\]/, '').trim();

      setMessages(prev => [...prev, { 
        role: 'model', 
        text: cleanText,
        recommendedThoughtId: recommendedId
      }]);
    } catch (error: any) {
      console.error("Chat failed", error);
      setMessages(prev => [...prev, { role: 'model', text: error.message || "The connection to the Oracle was interrupted." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[70vh] flex flex-col">
      <div className="text-center mb-8">
        <h2 className={`text-3xl font-serif mb-2 ${isNegativeMode ? 'text-white' : 'text-slate-800'}`}>
          {t.navChat}
        </h2>
        <p className={`text-sm ${isNegativeMode ? 'text-gray-400' : 'text-slate-500'}`}>
          {t.chatWelcome}
        </p>
      </div>

      <div 
        ref={scrollRef}
        className={`flex-1 overflow-y-auto p-4 md:p-10 rounded-[2.5rem] border mb-8 space-y-6 no-scrollbar backdrop-blur-[40px] transition-all duration-700 shadow-[0_50px_100px_rgba(0,0,0,0.4)] relative overflow-hidden ${
          isNegativeMode ? 'bg-white/[0.03] border-white/[0.08]' : 'bg-white/40 border-white/60'
        }`}
      >
        {/* Decorative background refraction */}
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#ff462e]/5 rounded-full blur-[100px] -z-10" />
        
        <AnimatePresence initial={false}>
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] p-5 md:p-8 rounded-[2rem] flex flex-col gap-4 shadow-2xl backdrop-blur-[30px] border transition-all hover:translate-y-[-2px] ${
                m.role === 'user'
                  ? 'bg-gradient-to-br from-[#ff462e] to-[#c4321e] text-white border-white/20'
                  : isNegativeMode ? 'bg-white/[0.05] text-gray-200 border-white/[0.05]' : 'bg-white/90 text-slate-800 border-white/60'
              }`}>
                <div className="flex gap-4">
                  <div className={`mt-1 p-2 rounded-xl ${m.role === 'user' ? 'bg-white/20' : 'bg-[#ff462e]/10'}`}>
                    {m.role === 'user' ? <User size={18} /> : <Bot size={18} className={isNegativeMode ? "text-[#ff462e]" : "text-[#ca331f]"} />}
                  </div>
                  <p className="text-sm md:text-base leading-relaxed font-serif">{m.text}</p>
                </div>

                {m.recommendedThoughtId && (
                  <button
                    onClick={() => {
                      const thought = thoughts.find(t => t.id === m.recommendedThoughtId);
                      if (thought) onSelectThought(thought);
                    }}
                    className={`mt-2 flex items-center gap-3 px-5 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all group/btn ${
                      isNegativeMode ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    <ExternalLink size={14} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                    {language === 'es' ? 'Ver pensamiento recomendado' : language === 'de' ? 'Empfohlenen Gedanken ansehen' : 'View recommended thought'}
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isLoading && (
          <div className="flex justify-start">
              <div className={`p-5 rounded-[2rem] flex gap-4 backdrop-blur-xl border ${isNegativeMode ? 'bg-white/[0.05] border-white/[0.05]' : 'bg-white/80 border-white/60'}`}>
              <Loader2 size={18} className={`animate-spin ${isNegativeMode ? 'text-[#ff462e]' : 'text-[#ca331f]'}`} />
              <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#ff462e]/80">Consultando al Oráculo...</span>
            </div>
          </div>
        )}
      </div>

      <div className="relative">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder={t.lblChatPlaceholder}
          className={`w-full pl-6 pr-14 py-4 rounded-2xl border focus:ring-2 focus:outline-none transition-all shadow-xl backdrop-blur-md ${
            isNegativeMode 
              ? 'bg-[#090909]/60 border-[rgba(255,255,255,0.08)] text-white focus:ring-[rgba(255,70,46,0.3)]' 
              : 'bg-white/60 border-white/60 text-slate-800 focus:ring-[rgba(255,70,46,0.3)]'
          }`}
        />
        <button
          onClick={handleSend}
          disabled={isLoading}
          className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl transition-all shadow-md ${
            isNegativeMode 
              ? 'bg-[#ff462e] text-white hover:bg-[#c4321e] hover:shadow-[0_0_15px_rgba(255,70,46,0.5)]' 
              : 'bg-[#ff462e] text-white hover:bg-[#c4321e] hover:shadow-[0_0_15px_rgba(255,70,46,0.4)]'
          }`}
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default ChatOracle;
