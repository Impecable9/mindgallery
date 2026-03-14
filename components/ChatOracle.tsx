import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Sparkles, Loader2, ExternalLink } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
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
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      // Prepare a small context of available thoughts for the AI
      const thoughtContext = thoughts.slice(0, 50).map(th => ({
        id: th.id,
        limiting: th.content[language].limiting,
        expansive: th.content[language].expansive
      }));

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [...messages, userMsg].map(m => ({
          role: m.role,
          parts: [{ text: m.text }]
        })),
        config: {
          systemInstruction: `You are the Oracle of MindGallery, a wise and compassionate guide. 
          Your purpose is to help users transform limiting beliefs into expansive thoughts. 
          Respond in ${language === 'es' ? 'Spanish' : language === 'de' ? 'German' : 'English'}.
          Keep responses concise, poetic, and encouraging. 
          
          AVAILABLE THOUGHTS IN GALLERY:
          ${JSON.stringify(thoughtContext)}

          If you find a thought in the list that matches the user's situation, include its ID at the very end of your response in the format: [RECOMMEND: id]. 
          Only recommend if it's a very strong match.`,
        }
      });

      const fullText = response.text || "The Oracle is silent for now...";
      
      // Parse recommendation
      const recommendMatch = fullText.match(/\[RECOMMEND:\s*([^\]]+)\]/);
      const recommendedId = recommendMatch ? recommendMatch[1].trim() : undefined;
      const cleanText = fullText.replace(/\[RECOMMEND:\s*[^\]]+\]/, '').trim();

      setMessages(prev => [...prev, { 
        role: 'model', 
        text: cleanText,
        recommendedThoughtId: recommendedId
      }]);
    } catch (error) {
      console.error("Chat failed", error);
      setMessages(prev => [...prev, { role: 'model', text: "The connection to the Oracle was interrupted." }]);
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
        className={`flex-1 overflow-y-auto p-6 rounded-3xl border mb-6 space-y-4 no-scrollbar ${
          isNegativeMode ? 'bg-black/40 border-white/10' : 'bg-white/40 border-white/40 shadow-inner'
        }`}
      >
        <AnimatePresence initial={false}>
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] p-4 rounded-2xl flex flex-col gap-3 ${
                m.role === 'user'
                  ? isNegativeMode ? 'bg-purple-600 text-white' : 'bg-slate-900 text-white'
                  : isNegativeMode ? 'bg-white/10 text-gray-200' : 'bg-white text-slate-800 shadow-md'
              }`}>
                <div className="flex gap-3">
                  <div className="mt-1">
                    {m.role === 'user' ? <User size={16} /> : <Bot size={16} className="text-rose-500" />}
                  </div>
                  <p className="text-sm leading-relaxed">{m.text}</p>
                </div>

                {m.recommendedThoughtId && (
                  <button
                    onClick={() => {
                      const thought = thoughts.find(t => t.id === m.recommendedThoughtId);
                      if (thought) onSelectThought(thought);
                    }}
                    className={`mt-2 flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                      isNegativeMode ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    <ExternalLink size={14} />
                    {language === 'es' ? 'Ver pensamiento recomendado' : language === 'de' ? 'Empfohlenen Gedanken ansehen' : 'View recommended thought'}
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isLoading && (
          <div className="flex justify-start">
            <div className={`p-4 rounded-2xl flex gap-3 ${isNegativeMode ? 'bg-white/5' : 'bg-white'}`}>
              <Loader2 size={16} className="animate-spin text-rose-500" />
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
          className={`w-full pl-6 pr-14 py-4 rounded-2xl border focus:ring-2 focus:outline-none transition-all ${
            isNegativeMode 
              ? 'bg-white/5 border-white/10 text-white focus:ring-purple-500/30' 
              : 'bg-white border-white/40 text-slate-800 focus:ring-rose-500/30 shadow-lg'
          }`}
        />
        <button
          onClick={handleSend}
          disabled={isLoading}
          className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl transition-all ${
            isNegativeMode 
              ? 'bg-purple-600 text-white hover:bg-purple-500' 
              : 'bg-slate-900 text-white hover:bg-slate-800'
          }`}
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default ChatOracle;
