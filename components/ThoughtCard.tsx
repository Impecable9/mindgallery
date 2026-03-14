import React from 'react';
import { motion } from 'framer-motion';
import { AspectRatio, Thought, StyleConfig, FontFamily, TextAlign, TextColor, Language } from '../types';
import { CATEGORY_THEMES, COLOR_MAP } from '../constants';
import { Lock, Download, Crown, Heart, AlertCircle, Search, ShoppingCart } from 'lucide-react';

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
      className={`relative group ${getDimensions()} flex items-center justify-center p-2`}
    >
      {/* Physical Frame Simulation */}
      <div 
        onClick={onClick}
        className={`absolute inset-0 rounded shadow-frame transform transition-transform duration-300 cursor-pointer ${isNegativeMode ? 'bg-[#1a1a1a] border border-gray-800' : 'bg-[#0f172a]'}`}
      ></div>
      
      {/* Matting & Canvas */}
      <div 
        onClick={onClick}
        className={`relative w-full h-full flex flex-col justify-center p-8 z-10 overflow-hidden shadow-inner-matte cursor-pointer ${getAlignClass(styleConfig.align)} 
          ${isNegativeMode ? 'bg-zinc-900 text-gray-200' : 'bg-white text-slate-900'}`}
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
            <p className={`text-[10px] uppercase tracking-widest text-slate-400 font-sans mt-2`}>
               — {thought.author}
            </p>
          )}
        </div>

        {/* Hover Actions / Interactions */}
        <div className="absolute bottom-4 right-4 z-30 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2 items-center">
           {onSearch && (
             <button 
               onClick={(e) => { e.stopPropagation(); onSearch(thought.category); }}
               className={`p-1.5 rounded-full transition-all border ${
                 isNegativeMode 
                   ? 'bg-zinc-800 border-zinc-700 text-gray-400 hover:text-white'
                   : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-blue-500'
               }`}
               title="Find similar thoughts"
             >
               <Search size={14} />
             </button>
           )}
            {!isNegativeMode && onPurchase && (
              <button 
                onClick={(e) => { e.stopPropagation(); onPurchase(thought); }}
                className={`p-1.5 rounded-full transition-all border bg-slate-50 border-slate-200 text-slate-400 hover:text-rose-500`}
                title="Buy physical print"
              >
                <ShoppingCart size={14} />
              </button>
            )}
           <button 
             onClick={(e) => { e.stopPropagation(); onLike(thought.id); }}
             className={`flex items-center gap-1 px-2 py-1 rounded-full transition-all border ${
               liked 
                ? 'bg-rose-50 border-rose-200 text-rose-500' 
                : isNegativeMode 
                  ? 'bg-zinc-800 border-zinc-700 text-gray-400 hover:text-white'
                  : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-rose-500'
             }`}
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