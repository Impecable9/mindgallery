import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Language } from '../types';
import { UI_TRANSLATIONS } from '../constants';
import { ShoppingBag, Sparkles, MessageSquare, Grid, ArrowRight, Zap, Target, Heart } from 'lucide-react';

interface HeroSectionProps {
  isNegativeMode: boolean;
  language: Language;
  onShopClick?: () => void;
  onManifestClick?: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ isNegativeMode, language, onShopClick, onManifestClick }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: language === 'es' ? 'Transforma tus Creencias' : 'Transform Your Beliefs',
      desc: language === 'es' ? 'Convierte pensamientos limitantes en arte expansivo que reprograma tu entorno.' : 'Turn limiting thoughts into expansive art that rewires your environment.',
      image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2000&auto=format&fit=crop", // Abstract 3D
      icon: <Grid size={24} />,
      cta: language === 'es' ? 'Explorar Galería' : 'Explore Gallery',
      action: onShopClick
    },
    {
      title: language === 'es' ? 'Consulta al Oráculo' : 'Consult the Oracle',
      desc: language === 'es' ? 'Nuestra IA entrenada en neuroestética te guía para encontrar el ancla perfecta.' : 'Our AI trained in neuroaesthetics guides you to find the perfect anchor.',
      image: "https://images.unsplash.com/photo-1675271591211-126ad94e495d?q=80&w=2000&auto=format&fit=crop", // Ethereal / AI
      icon: <MessageSquare size={24} />,
      cta: language === 'es' ? 'Hablar con la IA' : 'Talk with AI',
      secondaryCta: true
    },
    {
      title: language === 'es' ? 'Crea tu Abundancia' : 'Create Your Abundance',
      desc: language === 'es' ? 'Diseña tu propio pensamiento de poder y conviértelo en una pieza física.' : 'Design your own power thought and turn it into a physical piece.',
      image: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=2000&auto=format&fit=crop", // Golden / Light
      icon: <Sparkles size={24} />,
      cta: language === 'es' ? 'Manifestar Ahora' : 'Manifest Now',
      isManifest: true
    },
    {
      title: language === 'es' ? 'Lleva tu Intención' : 'Wear Your Intent',
      desc: language === 'es' ? 'Desde láminas hasta ropa premium. Haz que tu mensaje te acompañe.' : 'From prints to premium clothing. Let your message accompany you.',
      image: "https://images.unsplash.com/photo-1556906781-9a412961c28c?q=80&w=2000&auto=format&fit=crop", // Clothing / Minimal
      icon: <ShoppingBag size={24} />,
      cta: language === 'es' ? 'Ver Productos' : 'View Products',
      action: onShopClick
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="relative w-full h-[75vh] min-h-[600px] overflow-hidden rounded-[3rem] mb-20 group shadow-[0_50px_100px_rgba(0,0,0,0.6)] border border-white/5 bg-[#050505]">
      
      {/* Background Animated Gradients */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
         <motion.div 
           animate={{ rotate: 360 }}
           transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
           className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-conic from-[#ff462e]/40 via-transparent to-[#ff462e]/10 blur-[100px]"
         />
      </div>

      <div className="relative h-full flex flex-col md:flex-row">
        
        {/* Left Content Side */}
        <div className="flex-1 flex flex-col justify-center px-10 md:px-20 z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 rounded-2xl bg-[#ff462e]/10 border border-[#ff462e]/20 text-[#ff462e]">
                  {slides[currentSlide].icon}
                </div>
                <div className="h-[1px] w-12 bg-[#ff462e]/30" />
              </div>

              <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-8 leading-[1.1] tracking-tighter">
                {slides[currentSlide].title}
              </h1>

              <p className="text-xl text-slate-400 font-serif max-w-lg leading-relaxed mb-12 opacity-80">
                {slides[currentSlide].desc}
              </p>

              <div className="flex flex-wrap gap-4">
                <button
                  onClick={slides[currentSlide].isManifest ? onManifestClick : slides[currentSlide].action}
                  className="px-8 py-5 rounded-2xl bg-[#ff462e] text-white text-xs font-bold uppercase tracking-[0.2em] flex items-center gap-3 hover:bg-[#c4321e] transition-all transform hover:scale-[1.05] active:scale-95 shadow-xl group"
                >
                  {slides[currentSlide].cta}
                  <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                </button>
                
                {slides[currentSlide].secondaryCta && (
                  <button className="px-8 py-5 rounded-2xl bg-white/5 border border-white/10 text-white text-xs font-bold uppercase tracking-[0.2em] backdrop-blur-xl hover:bg-white/10 transition-all">
                    Explorar Más
                  </button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Indicators */}
          <div className="mt-20 flex gap-3">
             {slides.map((_, i) => (
               <button 
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`h-1.5 rounded-full transition-all duration-700 ${i === currentSlide ? 'w-12 bg-[#ff462e]' : 'w-4 bg-white/10 hover:bg-white/20'}`}
               />
             ))}
          </div>
        </div>

        {/* Right Image Side */}
        <div className="flex-1 relative overflow-hidden hidden md:block">
           <AnimatePresence mode="wait">
             <motion.div
               key={currentSlide}
               initial={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
               animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
               exit={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
               transition={{ duration: 1.2, ease: "easeOut" }}
               className="absolute inset-0"
             >
                <div 
                  className="w-full h-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${slides[currentSlide].image})` }}
                >
                  {/* Overlay Gradient to blend with left side */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-transparent to-transparent" />
                  
                  {/* Subtle float animation for the image container */}
                  <motion.div 
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0"
                  />
                </div>
             </motion.div>
           </AnimatePresence>

           {/* Decorative elements */}
           <div className="absolute top-10 right-10 p-4 border border-white/10 rounded-2xl backdrop-blur-3xl bg-black/20 text-white/40 text-[10px] uppercase font-bold tracking-[0.3em]">
              Phoenix Wall · Brand Archive
           </div>
        </div>

      </div>
    </div>
  );
};

export default HeroSection;