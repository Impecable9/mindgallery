import React from 'react';
import { motion } from 'framer-motion';
import { AspectRatio, Thought, StyleConfig, FontFamily, TextAlign, TextColor, Language } from '../types';
import { CATEGORY_THEMES, COLOR_MAP } from '../constants';
import { Heart, AlertCircle, Search, ShoppingCart, Lock } from 'lucide-react';
import { GlowingEffect } from './GlowingEffect';

interface ThoughtCardProps {
  thought: Thought;
  aspectRatio: AspectRatio;
  styleConfig: StyleConfig;
  onLike: (id: string) => void;
  onClick: () => void;
  liked: boolean;
  currentLikes: number;
  isNegativeMode: boolean;
  language: Language;
  onSearch?: (query: string) => void;
  onPurchase?: (thought: Thought) => void;
}

const ThoughtCard: React.FC<ThoughtCardProps> = ({ 
  thought, 
  aspectRatio, 
  styleConfig, 
  onLike, 
  onClick, 
  liked,
  currentLikes,
  isNegativeMode,
  language,
  onSearch,
  onPurchase
}) => {
  const theme = CATEGORY_THEMES[thought.category];
  
  // Get text content based on current language
  const textContent = thought.content[language];
  const displayText = isNegativeMode ? textContent.limiting : textContent.expansive;

  const getDimensions = () => {
    switch (aspectRatio) {
      case AspectRatio.SQUARE: return 'aspect-square';
      case AspectRatio.POSTER_2_3: return 'aspect-[2/3]';
      case AspectRatio.GALLERY_3_4: return 'aspect-[3/4]';
      case AspectRatio.ISO_5_7: return 'aspect-[5/7]';
      case AspectRatio.STORY: return 'aspect-[9/16]';
      case AspectRatio.CINEMA: return 'aspect-[16/9]';
      default: return 'aspect-square';
    }
  };

  const getFontClass = (font: FontFamily) => {
    switch(font) {
      case 'sans': return 'font-sans';
      case 'serif': return 'font-serif';
      case 'classic': return 'font-classic';
      case 'hand': return 'font-hand';
      case 'outfit': return 'font-outfit';
      default: return 'font-outfit';
    }
  };

  const getAlignClass = (align: TextAlign) => {
    switch(align) {
      case 'left': return 'text-left items-start';
      case 'center': return 'text-center items-center';
      case 'right': return 'text-right items-end';
      default: return 'text-center items-center';
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -8, scale: 1.02, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`relative group ${getDimensions()} flex items-center justify-center p-2 rounded-xl`}
    >
      {/* Glow Effect from Phoenix Wall */}
      <GlowingEffect spread={40} glow={false} disabled={false} proximity={80} inactiveZone={0.01} borderWidth={2} />

      {/* Physical Frame Simulation */}
      <div 
        onClick={onClick}
        className={`absolute inset-0 rounded transform transition-transform duration-300 cursor-pointer ${isNegativeMode ? 'bg-[#1a1a1a] border border-gray-800' : 'bg-[#0f172a] border border-[rgba(255,255,255,0.15)] shadow-[0_0_30px_rgba(255,255,255,0.03)]'}`}
      ></div>
      
      {/* Matting & Canvas */}
      <div
        onClick={onClick}
        className={`relative w-full h-full flex flex-col justify-center p-8 z-10 overflow-hidden shadow-inner-matte cursor-pointer ${getAlignClass(styleConfig.align)}`}
        style={{ background: isNegativeMode ? '#111111' : '#f5f4f3', color: isNegativeMode ? '#f9f9f9' : '#090909' }}
      >
        
        {/* Subtle Paper Texture */}
        <div className={`absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/cardboard.png')] pointer-events-none ${isNegativeMode ? 'invert' : ''}`} />

        {/* Mode Indicator / Badge */}
        {isNegativeMode && (
           <div className="absolute top-4 right-4 z-20 opacity-50">
              <AlertCircle size={12} className="text-red-500" />
           </div>
        )}
        
        {/* Premium Badge (Positive Mode Only) */}
        {!isNegativeMode && thought.isPremium && (
          <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
             <div className="bg-amber-100 text-amber-700 p-1 rounded-full">
                <Lock size={10} />
             </div>
          </div>
        )}

        {/* Content */}
        <div className="relative z-20 flex flex-col gap-4 w-full h-full justify-center">
          
          <h3 className={`text-xl md:text-2xl leading-snug font-bold transition-all duration-300 
            ${getFontClass(styleConfig.font)} 
            ${isNegativeMode ? 'text-gray-100 tracking-tight' : `${COLOR_MAP[styleConfig.color]} tracking-tight`}`}
          >
            {displayText}
          </h3>

          {!isNegativeMode && thought.author && (
            <p className="text-[10px] uppercase tracking-widest mt-2" style={{ color: '#7f7f80', fontFamily: "'Comfortaa', sans-serif", letterSpacing: '0.15em' }}>
               — {thought.author}
            </p>
          )}
        </div>

        {/* Hover Actions / Interactions */}
        <div className="absolute bottom-4 right-4 z-30 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2 items-center">
           {onSearch && (
             <button
               onClick={(e) => { e.stopPropagation(); onSearch(thought.category); }}
               className="p-1.5 rounded-full transition-all"
               style={{ background: 'rgba(9,9,9,0.5)', border: '1px solid rgba(234,234,234,0.15)', color: '#7f7f80', backdropFilter: 'blur(8px)' }}
               title="Find similar thoughts"
             >
               <Search size={14} />
             </button>
           )}
            {onPurchase && (
              <button
                onClick={(e) => { e.stopPropagation(); onPurchase(thought); }}
                className="p-1.5 rounded-full transition-all"
                style={{ background: 'rgba(255,70,46,0.15)', border: '1px solid rgba(255,70,46,0.35)', color: '#ff462e', backdropFilter: 'blur(8px)' }}
                title="Buy physical print"
              >
                <ShoppingCart size={14} />
              </button>
            )}
           <button
             onClick={(e) => { e.stopPropagation(); onLike(thought.id); }}
             className="flex items-center gap-1 px-2 py-1 rounded-full transition-all"
             style={{
               background: liked ? 'rgba(255,70,46,0.15)' : 'rgba(9,9,9,0.5)',
               border: liked ? '1px solid rgba(255,70,46,0.35)' : '1px solid rgba(234,234,234,0.15)',
               color: liked ? '#ff462e' : '#7f7f80',
               backdropFilter: 'blur(8px)',
             }}
           >
             <Heart size={14} fill={liked ? "currentColor" : "none"} />
             <span className="text-[10px] font-bold">{currentLikes}</span>
           </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ThoughtCard;