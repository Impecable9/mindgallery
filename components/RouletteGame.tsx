import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Dices, Sparkles, Moon, Sun, ArrowRight, Loader2, BookOpen } from 'lucide-react';
import { Thought, Language } from '../types';
import { THOUGHTS_DATA, UI_TRANSLATIONS } from '../constants';
import { GoogleGenAI } from "@google/genai";

interface RouletteGameProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectThought: (thought: Thought, isNegative: boolean) => void;
  language: Language;
}

const RouletteGame: React.FC<RouletteGameProps> = ({ isOpen, onClose, onSelectThought, language }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<{ thought: Thought; isNegative: boolean } | null>(null);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [guideContent, setGuideContent] = useState('');
  const [isGeneratingGuide, setIsGeneratingGuide] = useState(false);
  
  const t = UI_TRANSLATIONS[language];

  // Reset guide when result changes
  useEffect(() => {
     if (!result) setGuideContent('');
  }, [result]);

  // Animation loop for the spinner
  useEffect(() => {
    let interval: any;
    if (isSpinning) {
      interval = setInterval(() => {
        setPreviewIndex(Math.floor(Math.random() * THOUGHTS_DATA.length));
      }, 80);
    }
    return () => clearInterval(interval);
  }, [isSpinning]);

  const handleSpin = () => {
    setIsSpinning(true);
    setResult(null);

    // Spin duration
    setTimeout(() => {
      setIsSpinning(false);
      const randomThought = THOUGHTS_DATA[Math.floor(Math.random() * THOUGHTS_DATA.length)];
      const randomPolarity = Math.random() > 0.5; // True = Negative/Shadow, False = Positive/Light
      setResult({ thought: randomThought, isNegative: randomPolarity });
    }, 2500);
  };

  const handleAccept = () => {
    if (result) {
      onSelectThought(result.thought, result.isNegative);
      onClose();
      // Reset after closing
      setTimeout(() => setResult(null), 500); 
    }
  };

  const handleGenerateGuide = async () => {
    if (!result || !process.env.API_KEY) return;
    setIsGeneratingGuide(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const text = result.isNegative ? result.thought.content[language].limiting : result.thought.content[language].expansive;
      const prompt = `
        Act as a wise mentor.
        For the thought: "${text}" (${result.isNegative ? 'Limiting' : 'Expansive'}),
        provide a VERY BRIEF (max 2 sentences) interpretation and 1 quick actionable tip.
        Language: ${language === 'es' ? 'Spanish' : language === 'de' ? 'German' : 'English'}.
      `;
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [{ text: prompt }] }
      });
      
      if (response.text) {
        setGuideContent(response.text);
      }
    } catch (error) {
      console.error("Guide generation failed:", error);
    } finally {
      setIsGeneratingGuide(false);
    }
  };

  if (!isOpen) return null;

  const currentPreview = THOUGHTS_DATA[previewIndex];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-2xl p-4"
      >
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors z-50"
        >
          <X size={32} />
        </button>

        <div className="max-w-md w-full flex flex-col items-center text-center relative z-10">
          
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mb-8"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-[2rem] bg-gradient-to-br from-[#ff462e] to-[#4a1208] shadow-[0_10px_40px_rgba(255,70,46,0.3)] mb-6 border border-white/10 group-hover:scale-110 transition-transform duration-500">
               <Dices className="text-white w-10 h-10" />
            </div>
            <h2 className="text-4xl font-serif text-white font-bold mb-2 tracking-tight">{t.rouletteTitle}</h2>
            <p className="text-slate-400 text-sm max-w-xs mx-auto font-medium opacity-80">{t.rouletteSub}</p>
          </motion.div>

          <div className="relative w-full min-h-[350px] bg-[#090909]/40 backdrop-blur-3xl rounded-[3rem] border border-[rgba(255,255,255,0.08)] shadow-[0_40px_100px_rgba(0,0,0,0.8)] flex flex-col items-center justify-center p-8 mb-8 group overflow-hidden">
             
             {/* Background Decoration */}
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none rounded-3xl" />
             
             {/* Spinning State */}
             {isSpinning && (
                <div className="flex flex-col items-center gap-4 w-full py-8">
                   <div className="relative h-32 overflow-hidden w-full text-center mask-linear-gradient">
                      <motion.div
                        animate={{ y: [0, -500] }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        className="flex flex-col gap-8"
                      >
                        {THOUGHTS_DATA.slice(0, 10).map((t, i) => (
                           <h3 key={i} className="text-xl font-serif text-white/30 blur-[1px] whitespace-nowrap overflow-hidden text-ellipsis px-4">
                              {t.content[language].expansive}
                           </h3>
                        ))}
                      </motion.div>
                   </div>
                   <Loader2 className="animate-spin text-[#ff462e]" size={32} />
                   <p className="text-xs uppercase tracking-[3px] text-[#ff462e] font-bold opacity-80">{t.rouletteSpinning}</p>
                </div>
             )}

             {/* Idle State */}
             {!isSpinning && !result && (
                <div className="flex flex-col items-center gap-4 py-8">
                   <motion.div
                     animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                     transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                   >
                      <Sparkles className="text-yellow-400 w-12 h-12 opacity-80" />
                   </motion.div>
                   <p className="text-slate-500 text-sm">Ready to reveal your destiny?</p>
                </div>
             )}

             {/* Result State */}
             {!isSpinning && result && (
                <motion.div 
                   initial={{ scale: 0.8, opacity: 0 }}
                   animate={{ scale: 1, opacity: 1 }}
                   transition={{ type: "spring", stiffness: 200 }}
                   className="flex flex-col items-center gap-4 relative z-10 w-full"
                >
                   <div className={`p-4 rounded-3xl border shadow-2xl transition-all duration-500 ${result.isNegative ? 'bg-[#090909]/80 border-[#ff462e]/30 text-[#ff462e] shadow-[#ff462e]/10' : 'bg-white/10 border-[#ff462e]/50 text-[#ff462e] shadow-[#ff462e]/10'}`}>
                      {result.isNegative ? <Moon size={32} /> : <Sun size={32} />}
                   </div>
                   
                   <div className={`text-[10px] font-bold uppercase tracking-[3px] px-4 py-1.5 rounded-full border backdrop-blur-md transition-all ${
                      result.isNegative 
                        ? 'bg-black/40 border-white/10 text-white/60' 
                        : 'bg-[#ff462e]/10 border-[#ff462e]/30 text-[#ff462e]'
                   }`}>
                      {result.isNegative ? t.rouletteResultShadow : t.rouletteResultLight}
                   </div>

                   <h3 className={`text-xl md:text-2xl font-serif font-bold leading-tight text-center ${result.isNegative ? 'text-indigo-100' : 'text-amber-100'}`}>
                      "{result.isNegative ? result.thought.content[language].limiting : result.thought.content[language].expansive}"
                   </h3>

                   <p className="text-slate-500 text-xs font-sans mt-2 mb-4">— {result.thought.author || 'Unknown'}</p>

                   {/* Quick Guide Section */}
                   <div className="w-full bg-slate-800/50 rounded-xl p-3 border border-slate-700/50">
                      {!guideContent ? (
                         <button 
                            onClick={handleGenerateGuide}
                            disabled={isGeneratingGuide}
                            className="w-full flex items-center justify-center gap-2 text-xs font-bold text-violet-300 hover:text-violet-200 py-1"
                         >
                            {isGeneratingGuide ? <Loader2 size={14} className="animate-spin" /> : <BookOpen size={14} />}
                            Reveal Interpretation Guide
                         </button>
                      ) : (
                         <div className="text-left">
                            <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#ff462e] mb-1 flex items-center gap-1">
                               <Sparkles size={10} /> Wisdom Guide
                            </h4>
                            <p className="text-xs text-slate-300 leading-relaxed">
                               {guideContent}
                            </p>
                         </div>
                      )}
                   </div>

                </motion.div>
             )}

             {/* Dynamic Border Glow */}
             <div className={`absolute inset-0 border-4 rounded-[3rem] pointer-events-none transition-all duration-700 ${
                isSpinning ? 'border-[#ff462e]/30 shadow-[0_0_80px_rgba(255,70,46,0.1)]' : 
                result ? 'border-[#ff462e]/40 shadow-[inset_0_0_80px_rgba(255,70,46,0.15)]' : 
                'border-white/5'
             }`} />
          </div>

          <div className="w-full pb-8">
             {!result && (
                <button
                  onClick={handleSpin}
                  disabled={isSpinning}
                  className={`w-full py-5 rounded-2xl font-bold text-xs uppercase tracking-[3px] shadow-2xl transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]
                    ${isSpinning 
                      ? 'bg-white/5 text-white/20 cursor-not-allowed border border-white/5' 
                      : 'bg-[#ff462e] text-white hover:bg-[#c4321e]'}
                  `}
                >
                  {isSpinning ? t.rouletteSpinning : t.rouletteSpin}
                </button>
             )}

             {result && (
                <div className="flex gap-3">
                   <button
                     onClick={handleSpin}
                     className="flex-1 py-5 rounded-2xl font-bold text-xs uppercase tracking-[2px] backdrop-blur-md bg-white/5 text-white/60 hover:bg-white/10 transition-all border border-white/10"
                   >
                     {t.rouletteSpin}
                   </button>
                   <button
                     onClick={handleAccept}
                     className={`flex-[2] py-5 rounded-2xl font-bold text-xs uppercase tracking-[2px] shadow-2xl transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 ${result.isNegative ? 'bg-[#ff462e] text-white hover:bg-[#c4321e]' : 'bg-[#ff462e] text-white hover:bg-[#c4321e]'}`}
                   >
                     {t.rouletteOpen} <ArrowRight size={18} />
                   </button>
                </div>
             )}
          </div>

        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default RouletteGame;