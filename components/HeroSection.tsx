import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Language } from '../types';
import { UI_TRANSLATIONS } from '../constants';
import { Crown, MessageSquare, Search, Dices, ShoppingBag, BookOpen, Package, Shirt, Coffee, Smartphone, Star } from 'lucide-react';

interface HeroSectionProps {
  isNegativeMode: boolean;
  language: Language;
  globalConfig?: any;
  onShopClick?: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ isNegativeMode, language, globalConfig, onShopClick }) => {
  const t = UI_TRANSLATIONS[language];
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = t.heroSlides || [];
  const icons = [
    <MessageSquare size={20} className="text-[#ff462e]" />,
    <Search size={20} className="text-[#ff462e]" />,
    <Dices size={20} className="text-[#ff462e]" />,
    <ShoppingBag size={20} className="text-[#ff462e]" />,
    <BookOpen size={20} className="text-[#ff462e]" />
  ];

  const PRODUCT_PILLS = [
    { icon: <Package size={14} />, label: 'Prints' },
    { icon: <Shirt size={14} />, label: 'Clothing' },
    { icon: <Coffee size={14} />, label: 'Mugs' },
    { icon: <Smartphone size={14} />, label: 'Cases' },
    { icon: <Star size={14} />, label: 'Stickers' },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  // Images chosen for clear wall space to hang a frame
  let roomImage = isNegativeMode 
    ? "https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=2000&auto=format&fit=crop" // Moody dark room
    : "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=2000&auto=format&fit=crop"; // Bright living room with flat wall

  if (globalConfig) {
    if (isNegativeMode && globalConfig.heroImageNeg) roomImage = globalConfig.heroImageNeg;
    if (!isNegativeMode && globalConfig.heroImagePos) roomImage = globalConfig.heroImagePos;
  }

  const defaultThought = isNegativeMode 
    ? { text: t.demoThoughtNeg, sub: t.demoSubNeg }
    : { text: t.demoThoughtPos, sub: t.demoSubPos };

  const demoThought = {
    text: isNegativeMode ? (globalConfig?.heroTitleNeg || defaultThought.text) : (globalConfig?.heroTitlePos || defaultThought.text),
    sub: isNegativeMode ? (globalConfig?.heroDescNeg || defaultThought.sub) : (globalConfig?.heroDescPos || defaultThought.sub)
  };

  return (
    <div className="relative w-full h-[60vh] min-h-[500px] overflow-hidden mb-12 group rounded-xl shadow-2xl">
      {/* Background Room Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 transform scale-105 group-hover:scale-100"
        style={{ backgroundImage: `url(${roomImage})` }}
      >
        <div className={`absolute inset-0 ${isNegativeMode ? 'bg-black/40' : 'bg-white/10'}`} />
      </div>

      {/* Realistic Floating Frame */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          key={`frame-${language}-${isNegativeMode}`}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
          style={{
            top: isNegativeMode ? '25%' : '15%',
            left: isNegativeMode ? '50%' : '50%',
            transform: isNegativeMode 
               ? 'translate(-50%, 0) perspective(1000px) rotateY(0deg)' 
               : 'translate(-50%, 0) perspective(1000px)',
            width: '280px',
            maxWidth: '30%',
          }}
          className={`aspect-[3/4] absolute shadow-[10px_20px_40px_rgba(0,0,0,0.5)] bg-white p-6 flex flex-col items-center justify-center text-center
            ${isNegativeMode ? 'border-[12px] border-[#222]' : 'border-[12px] border-white'}
          `}
        >
            <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.15)] pointer-events-none" />
            
            <Crown size={20} className={`mb-3 ${isNegativeMode ? 'text-slate-500' : 'text-amber-500'}`} />
            
            <h1 className={`font-outfit text-2xl md:text-3xl font-extrabold leading-tight tracking-tight ${isNegativeMode ? 'text-slate-800' : 'text-slate-900'}`}>
              {demoThought.text}
            </h1>
            
            <p className="mt-4 text-[10px] uppercase tracking-[0.2em] text-slate-400 font-sans">
              {demoThought.sub}
            </p>

            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent pointer-events-none" />
        </motion.div>
      </div>

      {/* Hero Text Overlay - Rotating Slides */}
      <div className="absolute bottom-8 left-6 md:left-12 max-w-lg z-10 pointer-events-auto">
        <AnimatePresence mode="wait">
          <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.5 }}
              className={`p-8 backdrop-blur-3xl rounded-[2rem] border shadow-[0_20px_60px_rgba(0,0,0,0.5)] transition-all duration-500 ${isNegativeMode ? 'bg-[#090909]/60 border-[rgba(255,255,255,0.08)] text-white' : 'bg-white/70 border-white/60 text-slate-900'}`}
          >
              <div className="flex items-center gap-3 mb-2">
                {icons[currentSlide]}
                <h2 className="text-2xl font-serif font-bold">
                    {slides[currentSlide]?.title}
                </h2>
              </div>
              <p className="text-sm opacity-90 leading-relaxed mb-3">
                  {slides[currentSlide]?.desc}
              </p>
              <div className="flex gap-1">
                {slides.map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-1.5 rounded-full transition-all duration-700 ${i === currentSlide ? 'w-12 bg-[#ff462e]' : 'w-3 bg-white/20'}`} 
                  />
                ))}
              </div>
          </motion.div>
        </AnimatePresence>
      </div>
      {/* Shop CTA — bottom right */}
      <div className="absolute bottom-8 right-6 md:right-12 z-10 max-w-xs">
        <div className={`p-6 rounded-[2rem] border backdrop-blur-3xl shadow-[0_20px_60px_rgba(0,0,0,0.5)] transition-all duration-500 ${
          isNegativeMode ? 'bg-[#090909]/60 border-[rgba(255,255,255,0.08)]' : 'bg-white/70 border-white/60'
        }`}>
          <p className={`text-xs font-bold uppercase tracking-widest mb-2 ${
            isNegativeMode ? 'text-slate-400' : 'text-slate-500'
          }`}>🛒 Wear Your Thoughts</p>
          <div className="flex flex-wrap gap-2 mb-3">
            {PRODUCT_PILLS.map(p => (
              <span key={p.label} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] uppercase font-bold tracking-wider border transition-all ${
                isNegativeMode ? 'bg-white/5 border-white/10 text-white/70' : 'bg-black/5 border-black/10 text-slate-700'
              }`}>
                {p.icon}{p.label}
              </span>
            ))}
          </div>
          <button
            onClick={onShopClick}
            className="w-full py-4 rounded-2xl text-xs uppercase tracking-[3px] font-bold text-white bg-[#ff462e] hover:bg-[#c4321e] transition-all flex items-center justify-center gap-3 shadow-2xl hover:scale-[1.02] active:scale-[0.95]"
          >
            <ShoppingBag size={18} />
            Explore Products
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;