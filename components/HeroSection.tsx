import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Language } from '../types';
import { UI_TRANSLATIONS } from '../constants';
import { Crown, MessageSquare, Search, Dices, ShoppingBag, BookOpen, Package, Shirt, Coffee, Smartphone, Star, ArrowRight, Sparkles } from 'lucide-react';

interface HeroSectionProps {
  isNegativeMode: boolean;
  language: Language;
  onShopClick?: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ isNegativeMode, language, onShopClick }) => {
  const t = UI_TRANSLATIONS[language];
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = t.heroSlides || [];
  const icons = [
    <MessageSquare size={24} className="text-[#ff462e]" />,
    <Search size={24} className="text-[#ff462e]" />,
    <Dices size={24} className="text-[#ff462e]" />,
    <ShoppingBag size={24} className="text-[#ff462e]" />,
    <BookOpen size={24} className="text-[#ff462e]" />
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="relative w-full h-[85vh] min-h-[700px] overflow-hidden rounded-[3rem] mb-20 group shadow-[0_50px_100px_rgba(0,0,0,0.6)] border border-white/5">
      {/* Premium Cinematic Background Layer */}
      <div className="absolute inset-0 bg-black">
        {/* Animated Orbs for Depth */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[20%] -left-[10%] w-[80%] h-[80%] bg-[#ff462e]/10 rounded-full blur-[150px] mix-blend-screen"
        />
        <motion.div
          animate={{ scale: [1.3, 1, 1.3], x: [0, -40, 0], y: [0, -20, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] bg-[#ff462e]/5 rounded-full blur-[120px] mix-blend-screen"
        />
        
        {/* Abstract Dynamic Texture / Noise Overlay */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-30 pointer-events-none" />
        
        {/* Core Focal Point - Ambient Light */}
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black via-black/40 to-transparent z-0" />
      </div>

      {/* Main Content Content Container */}
      <div className="relative h-full container mx-auto px-6 md:px-12 flex flex-col justify-center items-center text-center z-10 pt-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.95 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-4xl"
          >
            <div className="flex justify-center mb-10">
              <div className="p-4 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-3xl shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:scale-110 transition-transform duration-500">
                {icons[currentSlide]}
              </div>
            </div>

            <motion.h1 
              className="text-6xl md:text-8xl font-serif font-bold text-white mb-8 leading-[1.05] tracking-tighter"
            >
              {slides[currentSlide]?.title} <br/>
              <span className="text-[#ff462e]"> {language === 'es' ? 'con Intención' : 'with Intent'}</span>
            </motion.h1>

            <p className="text-xl md:text-2xl text-slate-400 font-serif max-w-2xl mx-auto leading-relaxed mb-12 opacity-80">
              {slides[currentSlide]?.desc}
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <button
                onClick={onShopClick}
                className="px-10 py-6 rounded-[2.5rem] bg-[#ff462e] text-white text-sm font-bold uppercase tracking-[0.3em] flex items-center gap-4 hover:bg-[#c4321e] hover:shadow-[0_0_40px_rgba(255,70,46,0.4)] transition-all transform hover:scale-[1.05] active:scale-95 group shadow-2xl"
              >
                <ShoppingBag size={20} />
                {t.heroCTA || (language === 'es' ? 'Explorar Productos' : 'Explore Products')}
                <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
              </button>
              
              <button className="px-10 py-6 rounded-[2.5rem] bg-white/5 border border-white/10 text-white text-sm font-bold uppercase tracking-[0.3em] flex items-center gap-4 hover:bg-white/10 transition-all backdrop-blur-3xl">
                <Crown size={20} className="text-[#ff462e]" />
                {language === 'es' ? 'Ver Colección' : 'View Collection'}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Progress Bar Indicators */}
        <div className="absolute bottom-12 flex gap-4">
          {slides.map((_, i) => (
            <button 
              key={i} 
              onClick={() => setCurrentSlide(i)}
              className={`h-1.5 rounded-full transition-all duration-700 ${i === currentSlide ? 'w-16 bg-[#ff462e]' : 'w-4 bg-white/20'}`} 
            />
          ))}
        </div>

        {/* Floating Brand Badges (Micro-animations) */}
        <div className="hidden lg:block">
           <motion.div 
             animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
             transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
             className="absolute top-[20%] right-[10%] p-6 bg-white/5 border border-white/10 backdrop-blur-3xl rounded-[2.5rem] shadow-2xl"
           >
              <Smartphone size={24} className="text-slate-500" />
           </motion.div>
           <motion.div 
             animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
             transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
             className="absolute bottom-[20%] left-[10%] p-6 bg-white/5 border border-white/10 backdrop-blur-3xl rounded-[2.5rem] shadow-2xl"
           >
              <Shirt size={24} className="text-[#ff462e]" />
           </motion.div>
        </div>
      </div>
      
      {/* Elegant Glass Overlays */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-black to-transparent z-20" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-black to-transparent z-20" />
    </div>
  );
};

export default HeroSection;