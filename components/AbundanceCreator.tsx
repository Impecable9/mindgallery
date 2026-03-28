import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart, Zap, CheckCircle2, Info, ArrowRight } from 'lucide-react';
import { Language } from '../types';

interface AbundanceCreatorProps {
  isNegativeMode: boolean;
  language: Language;
  onSave: (thought: { limiting: string; expansive: string }) => void;
}

const AbundanceCreator: React.FC<AbundanceCreatorProps> = ({ isNegativeMode, language, onSave }) => {
  const [text, setText] = useState('Estoy feliz y agradecido ahora que...');
  const [isHovered, setIsHovered] = useState(false);

  const tips = [
    {
      title: language === 'es' ? 'Habla en Presente' : 'Speak in Present',
      desc: language === 'es' ? 'Escribe como si ya estuviera sucediendo. No digas "seré", di "soy" o "tengo".' : 'Write as if it is already happening. Use "I am" or "I have" instead of "I will".',
      icon: <Zap size={18} className="text-[#ff462e]" />
    },
    {
      title: language === 'es' ? 'Enfoque Positivo' : 'Positive Focus',
      desc: language === 'es' ? 'Evita palabras negativas. Di "Tengo una salud vibrante" en lugar de "No estoy enfermo".' : 'Avoid negative words. "I have vibrant health" instead of "I am not sick".',
      icon: <Heart size={18} className="text-[#ff462e]" />
    },
    {
      title: language === 'es' ? 'Siente la Gratitud' : 'Feel the Gratitude',
      desc: language === 'es' ? 'Empieza con agradecimiento. La gratitud abre la puerta a la abundancia.' : 'Start with thanks. Gratitude opens the door to abundance.',
      icon: <Sparkles size={18} className="text-[#ff462e]" />
    }
  ];

  const handleCreate = () => {
    if (text.length > 30) {
      onSave({
          limiting: "...", // Placeholder since this is a positive creator
          expansive: text
      });
    }
  };

  return (
    <section className="py-20 px-6 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#ff462e]/5 rounded-full blur-[120px] -z-10" />
      
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          
          {/* Editor Card */}
          <div className="flex-1 w-full">
            <motion.div 
               initial={{ opacity: 0, x: -30 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               className={`p-10 rounded-[3rem] border backdrop-blur-3xl shadow-[0_40px_100px_rgba(0,0,0,0.6)] ${
                 isNegativeMode ? 'bg-[#090909]/60 border-white/10' : 'bg-white/70 border-white/80'
               }`}
            >
              <h2 className="text-3xl font-serif font-bold mb-8 flex items-center gap-4">
                <Sparkles className="text-[#ff462e]" />
                {language === 'es' ? 'Ancla tu Abundancia' : 'Anchor Your Abundance'}
              </h2>

              <div className="space-y-6">
                <div>
                  <label className={`block text-[10px] uppercase tracking-[4px] font-bold mb-4 ${isNegativeMode ? 'text-white/40' : 'text-slate-400'}`}>
                    {language === 'es' ? 'Escribe tu nueva realidad' : 'Write your new reality'}
                  </label>
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className={`w-full p-8 rounded-[2rem] border min-h-[220px] text-xl font-serif leading-relaxed focus:ring-2 focus:ring-[#ff462e]/30 outline-none transition-all resize-none shadow-inner ${
                      isNegativeMode ? 'bg-black/40 border-white/5 text-white' : 'bg-white/80 border-slate-200 text-slate-800'
                    }`}
                    placeholder="..."
                  />
                </div>

                <button
                  onClick={handleCreate}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  className="w-full py-6 rounded-2xl bg-[#ff462e] text-white flex items-center justify-center gap-4 text-sm font-bold uppercase tracking-[4px] shadow-[0_20px_40px_rgba(255,70,46,0.3)] hover:shadow-[0_25px_50px_rgba(255,70,46,0.4)] transition-all relative overflow-hidden group"
                >
                  <motion.div
                    animate={{ x: isHovered ? 5 : 0 }}
                    className="flex items-center gap-4"
                  >
                    {language === 'es' ? 'Manifestar Ahora' : 'Manifest Now'}
                    <ArrowRight size={20} />
                  </motion.div>
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                </button>
              </div>
            </motion.div>
          </div>

          {/* Advice Side */}
          <div className="flex-1 w-full space-y-8">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#ff462e]/10 border border-[#ff462e]/20 text-[#ff462e] text-[10px] font-bold uppercase tracking-widest mb-6">
                <Info size={14} />
                Guía de Manifestación
              </div>
              <h3 className="text-4xl font-serif font-bold text-white mb-8 leading-tight">
                {language === 'es' ? 'Cómo diseñar un pensamiento de poder' : 'How to design a power thought'}
              </h3>
              
              <div className="grid gap-6">
                {tips.map((tip, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className={`p-6 rounded-3xl border flex items-start gap-4 backdrop-blur-xl transition-all hover:translate-x-2 ${
                      isNegativeMode ? 'bg-[#111111]/40 border-white/5' : 'bg-white/40 border-slate-100'
                    }`}
                  >
                    <div className="p-3 bg-white/5 rounded-2xl border border-white/10 shrink-0">
                      {tip.icon}
                    </div>
                    <div>
                      <h4 className="text-white font-bold mb-1">{tip.title}</h4>
                      <p className="text-slate-400 text-sm leading-relaxed">{tip.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className={`mt-10 p-6 rounded-[2rem] border-l-4 border-[#ff462e] ${isNegativeMode ? 'bg-black/40 border-white/10' : 'bg-white/40 border-slate-100'}`}>
                <p className="text-slate-300 italic text-sm">
                  {language === 'es' 
                    ? '"La palabra tiene poder creativo. El pensamiento de abundancia es la instrucción que le das a tu campo de energía."'
                    : '"Words hold creative power. An abundance thought is the instruction you give to your energy field."'}
                </p>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AbundanceCreator;
