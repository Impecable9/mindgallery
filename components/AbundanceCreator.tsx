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
    <div className="py-10 md:py-20 px-6 relative overflow-hidden bg-[#0a0a0a] rounded-[3rem] border border-white/10 shadow-2xl overflow-y-auto">
      {/* Background Orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#ff462e]/5 rounded-full blur-[120px] -z-10" />
      
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">
          
          {/* Editor Card */}
          <div className="flex-1 w-full order-2 lg:order-1">
            <motion.div 
               initial={{ opacity: 0, x: -30 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               className={`p-8 md:p-12 rounded-[3.5rem] border backdrop-blur-[50px] shadow-[0_60px_120px_rgba(0,0,0,0.5)] relative overflow-hidden group/editor ${
                 isNegativeMode ? 'bg-white/[0.03] border-white/[0.08]' : 'bg-white/70 border-white/80'
               }`}
            >
              {/* Refraction effect for the editor card */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.03] to-transparent -translate-x-full group-hover/editor:translate-x-full transition-transform duration-[1500ms]" />

              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-10 flex items-center gap-5 relative z-10">
                <div className="p-3 bg-[#ff462e]/10 rounded-2xl border border-[#ff462e]/20">
                  <Sparkles className="text-[#ff462e]" size={28} />
                </div>
                {language === 'es' ? 'Ancla tu Abundancia' : 'Anchor Your Abundance'}
              </h2>

              <div className="space-y-8 relative z-10">
                <div>
                  <label className={`block text-[11px] uppercase tracking-[6px] font-bold mb-5 ${isNegativeMode ? 'text-white/30' : 'text-slate-400'}`}>
                    {language === 'es' ? 'Escribe tu nueva realidad' : 'Write your new reality'}
                  </label>
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className={`w-full p-8 md:p-10 rounded-[2.5rem] border min-h-[220px] md:min-h-[280px] text-xl md:text-2xl font-serif leading-relaxed focus:ring-2 focus:ring-[#ff462e]/40 outline-none transition-all resize-none shadow-2xl ${
                      isNegativeMode ? 'bg-black/60 border-white/[0.05] text-white placeholder:text-white/10' : 'bg-white/90 border-slate-200 text-slate-800'
                    }`}
                    placeholder="..."
                  />
                </div>

                <button
                  onClick={handleCreate}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  className="w-full py-6 md:py-8 rounded-[2rem] bg-gradient-to-r from-[#ff462e] to-[#c4321e] text-white flex items-center justify-center gap-5 text-sm md:text-base font-bold uppercase tracking-[6px] shadow-[0_25px_60px_rgba(255,70,46,0.3)] hover:shadow-[0_30px_70px_rgba(255,70,46,0.4)] transition-all relative overflow-hidden group/btn"
                >
                  <motion.div
                    animate={{ x: isHovered ? 8 : 0 }}
                    className="flex items-center gap-5"
                  >
                    {language === 'es' ? 'Manifestar Ahora' : 'Manifest Now'}
                    <ArrowRight size={24} />
                  </motion.div>
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500" />
                </button>
              </div>
            </motion.div>
          </div>

          {/* Advice Side */}
          <div className="flex-1 w-full space-y-8 order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#ff462e]/10 border border-[#ff462e]/20 text-[#ff462e] text-[10px] font-bold uppercase tracking-widest mb-6">
                <Info size={14} />
                Guía de Manifestación
              </div>
              <h3 className="text-2xl md:text-4xl font-serif font-bold text-white mb-6 leading-tight">
                {language === 'es' ? 'Cómo diseñar un pensamiento de poder' : 'How to design a power thought'}
              </h3>
              
              <div className="grid gap-4 md:gap-6">
                {tips.map((tip, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className={`group p-4 md:p-8 rounded-[3rem] transition-all duration-700 hover:translate-x-3 glass-premium glass-noise shadow-[0_30px_60px_rgba(0,0,0,0.5)] border-white/20`}
                  >
                    <div className="p-4 bg-gradient-to-br from-[#ff462e]/20 to-[#ff462e]/5 rounded-2xl border border-[#ff462e]/20 shrink-0 group-hover:scale-110 transition-transform">
                      {tip.icon}
                    </div>
                    <div>
                      <h4 className="text-white font-serif font-bold mb-1 text-base md:text-lg tracking-tight group-hover:text-[#ff462e] transition-colors">{tip.title}</h4>
                      <p className="text-slate-400 text-xs md:text-sm leading-relaxed opacity-80">{tip.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className={`mt-8 md:mt-12 p-10 rounded-[4rem] relative overflow-hidden group transition-all duration-1000 glass-premium glass-noise border-white/10`}>
                {/* Refraction Effect Overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.03] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                
                <p className="text-slate-200 italic text-sm md:text-base leading-relaxed relative z-10 font-serif">
                  {language === 'es' 
                    ? '"La palabra tiene poder creativo. El pensamiento de abundancia es la instrucción que le das a tu campo de energía."'
                    : '"Words hold creative power. An abundance thought is the instruction you give to your energy field."'}
                </p>
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#ff462e]" />
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AbundanceCreator;
