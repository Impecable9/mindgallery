import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, Grid, Info, Search, Type, Palette, AlignLeft, AlignCenter, AlignRight, Check, Moon, Sun, CloudLightning, Sparkles, ChevronDown, Globe, Dices, MessageSquare, ShoppingBag } from 'lucide-react';
import { CategoryType, AspectRatio, Thought, StyleConfig, FontFamily, TextColor, TextAlign, Language } from './types';
import { THOUGHTS_DATA, CATEGORY_THEMES, COLOR_MAP, UI_TRANSLATIONS } from './constants';
import ThoughtCard from './components/ThoughtCard';
import Modal from './components/Modal';
import ConceptGuide from './components/ConceptGuide';
import HeroSection from './components/HeroSection';
import RouletteGame from './components/RouletteGame';
import ChatOracle from './components/ChatOracle';
import AddThoughtModal from './components/AddThoughtModal';
import ParticleBackground from './components/ParticleBackground';
import ShineBorder from './components/ShineBorder';
import PurchaseModal from './components/PurchaseModal';
import Dashboard from './components/Dashboard';

const App: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | 'ALL'>('ALL');
  const [selectedEmotion, setSelectedEmotion] = useState<string | 'ALL'>('ALL');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(AspectRatio.SQUARE);
  const [selectedThought, setSelectedThought] = useState<Thought | null>(null);
  const [viewMode, setViewMode] = useState<'GALLERY' | 'GUIDE' | 'CHAT' | 'DASHBOARD'>('GALLERY');
  const [isNegativeMode, setIsNegativeMode] = useState(false);
  const [language, setLanguage] = useState<Language>('en');
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [thoughtToPurchase, setThoughtToPurchase] = useState<Thought | null>(null);
  const [purchaseImageUrl, setPurchaseImageUrl] = useState<string>('');
  
  // Roulette State
  const [isRouletteOpen, setIsRouletteOpen] = useState(false);
  const [rouletteInitialNegative, setRouletteInitialNegative] = useState(false);
  
  // Global Styles State
  const [globalStyle, setGlobalStyle] = useState<StyleConfig>({
    font: 'serif',
    align: 'center',
    color: 'black'
  });

  // Global Config from Backend (Hero overrides)
  const [globalConfig, setGlobalConfig] = useState<any>({});

  const t = UI_TRANSLATIONS[language];

  // Likes State (In-memory for demo)
  const [likes, setLikes] = useState<Record<string, number>>({});

  useEffect(() => {
    // No auth needed — public gallery
  }, []);

  const handleLike = (id: string) => {
    setLikes(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + 1
    }));
  };

  // Filter thoughts
  const filteredThoughts = useMemo(() => {
    let thoughts = [...THOUGHTS_DATA];
    
    if (selectedCategory !== 'ALL') {
      thoughts = thoughts.filter(t => t.category === selectedCategory);
    }

    if (selectedCategory === CategoryType.EMOTIONS && selectedEmotion !== 'ALL') {
      thoughts = thoughts.filter(t => t.tag === selectedEmotion);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      thoughts = thoughts.filter(t => 
        t.content[language].limiting.toLowerCase().includes(q) ||
        t.content[language].expansive.toLowerCase().includes(q) ||
        t.author.toLowerCase().includes(q)
      );
    }

    return thoughts;
  }, [selectedCategory, selectedEmotion, searchQuery, language]);

  // Derive unique emotions for the filter
  const emotionTags = useMemo(() => {
    const emotionThoughts = THOUGHTS_DATA.filter(t => t.category === CategoryType.EMOTIONS);
    const tags = new Set(emotionThoughts.map(t => t.tag).filter(Boolean));
    return Array.from(tags).sort();
  }, []);

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
    { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  ];

  const currentLang = languages.find(l => l.code === language) || languages[0];

  const handleRouletteSelection = (thought: Thought, isNegative: boolean) => {
     // Ensure we open the modal with the specific polarity found in the game
     setRouletteInitialNegative(isNegative);
     setSelectedThought(thought);
  };

  const handleOpenPurchase = (thought: Thought, imageUrl?: string) => {
    setThoughtToPurchase(thought);
    setPurchaseImageUrl(imageUrl || '');
    setIsPurchaseModalOpen(true);
  };

  return (
    <div className={`min-h-screen font-sans transition-colors duration-700 ${isNegativeMode ? 'text-gray-200' : 'text-slate-900'}`}>
      
      {/* Dynamic Animated Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Gradient Layer */}
        <div className={`absolute inset-0 animate-gradient-xy transition-opacity duration-1000 ${
          isNegativeMode 
            ? 'bg-gradient-to-br from-slate-950 via-gray-900 to-black opacity-100' 
            : 'bg-gradient-to-br from-rose-50 via-sky-50 to-white opacity-100'
        }`} />
        
        {/* Blob Overlay (Light Mode) */}
        {!isNegativeMode && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-200/40 rounded-full blur-[120px] mix-blend-multiply animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-200/40 rounded-full blur-[120px] mix-blend-multiply animate-pulse delay-1000" />
          </motion.div>
        )}

        {/* Blob Overlay (Dark Mode) */}
        {isNegativeMode && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
             <div className="absolute top-[20%] right-[20%] w-[60%] h-[60%] bg-purple-900/10 rounded-full blur-[150px]" />
             <div className="absolute bottom-[10%] left-[10%] w-[40%] h-[40%] bg-gray-800/20 rounded-full blur-[100px]" />
          </motion.div>
        )}
        
        {/* PRO MAX Particle System */}
        <ParticleBackground isNegativeMode={isNegativeMode} />
      </div>

      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 backdrop-blur-xl border-b transition-colors duration-500 shadow-sm ${
        isNegativeMode ? 'bg-black/40 border-white/5' : 'bg-white/40 border-white/20'
      }`}>
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer" 
            onClick={() => setViewMode('GALLERY')}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shadow-lg transition-colors ${
              isNegativeMode ? 'bg-gray-800 ring-1 ring-white/10' : 'bg-gradient-to-br from-rose-400 to-violet-500 ring-1 ring-white/20'
            }`}>
              <Layers className="text-white w-5 h-5" />
            </div>
            <span className={`font-serif text-xl font-bold tracking-tight ${isNegativeMode ? 'text-white' : 'text-slate-800'}`}>
              {t.navTitle}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
             {/* Search Bar */}
             <div className="hidden md:flex items-center relative">
                <Search className="absolute left-3 text-slate-400" size={16} />
                <input 
                  type="text"
                  placeholder={t.lblSearchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`pl-10 pr-4 py-2 rounded-full text-sm border transition-all focus:ring-2 focus:outline-none ${
                    isNegativeMode 
                      ? 'bg-white/5 border-white/10 text-white focus:ring-purple-500/30' 
                      : 'bg-white/50 border-white/40 text-slate-800 focus:ring-rose-500/30'
                  }`}
                />
             </div>

             {/* Chat Button */}
             <button
               onClick={() => setViewMode('CHAT')}
               className={`p-2 rounded-full transition-all border flex items-center gap-2 px-3 ${
                 viewMode === 'CHAT'
                   ? isNegativeMode ? 'bg-white text-black border-white' : 'bg-slate-900 text-white border-slate-900'
                   : isNegativeMode ? 'bg-white/10 text-white border-white/20' : 'bg-white/50 text-slate-600 border-white/40'
               }`}
             >
               <MessageSquare size={18} />
               <span className="hidden lg:inline text-xs font-bold uppercase tracking-wider">{t.navChat}</span>
             </button>

             {/* Shop Button */}
             <button
               onClick={() => {
                 const firstThought = THOUGHTS_DATA[0];
                 if (firstThought) handleOpenPurchase(firstThought, '');
               }}
               title="Open Shop"
               className={`p-2 rounded-full transition-all border flex items-center gap-2 px-3 ${
                 isNegativeMode ? 'bg-white/10 text-white border-white/20' : 'bg-white/50 text-slate-600 border-white/40'
               }`}
             >
               <ShoppingBag size={18} />
               <span className="hidden lg:inline text-xs font-bold uppercase tracking-wider">Shop</span>
             </button>

             {/* ROULETTE BUTTON - PRO MAX */}
             <div className="hidden sm:block">
               <ShineBorder>
                 <button
                   onClick={() => setIsRouletteOpen(true)}
                   className={`p-2 rounded-full transition-all border group items-center gap-2 px-3 ${
                     isNegativeMode 
                       ? 'bg-purple-950/40 text-purple-300 border-white/5 hover:bg-purple-900/40' 
                       : 'bg-white/80 text-violet-600 border-white/40 hover:bg-white'
                   }`}
                 >
                   <Dices size={20} className="group-hover:rotate-12 transition-transform" />
                   <span className="text-xs font-bold uppercase tracking-wider hidden md:inline">{t.navRoulette}</span>
                 </button>
               </ShineBorder>
             </div>

             {/* Language Dropdown */}
             <div className="relative">
                <button
                  onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                  className={`p-2 rounded-full transition-all flex items-center gap-2 text-xs font-bold border min-w-[50px] sm:min-w-[80px] justify-between ${
                    isNegativeMode 
                      ? 'bg-white/10 text-white border-white/20 hover:bg-white/20' 
                      : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-lg leading-none">{currentLang.flag}</span>
                    <span className="hidden sm:inline">{currentLang.code.toUpperCase()}</span>
                  </span>
                  <ChevronDown size={14} className={`transition-transform ${isLangMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isLangMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className={`absolute top-full right-0 mt-2 w-32 rounded-xl shadow-xl overflow-hidden border backdrop-blur-xl ${
                        isNegativeMode 
                          ? 'bg-black/80 border-white/10' 
                          : 'bg-white/90 border-white/20'
                      }`}
                    >
                      {languages.map((l) => (
                        <button
                          key={l.code}
                          onClick={() => {
                            setLanguage(l.code);
                            setIsLangMenuOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${
                            language === l.code
                              ? isNegativeMode ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-900'
                              : isNegativeMode ? 'text-gray-400 hover:bg-white/10 hover:text-white' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                          }`}
                        >
                          <span className="text-lg leading-none">{l.flag}</span>
                          {l.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
             </div>
            
             {/* Negative Mode Toggle (Sun/Moon) */}
             <button
               onClick={() => setIsNegativeMode(!isNegativeMode)}
               className={`p-2 rounded-full transition-all border group ${
                 isNegativeMode 
                   ? 'bg-white/10 text-yellow-300 border-white/20 hover:bg-white/20 hover:scale-110 shadow-[0_0_15px_rgba(253,224,71,0.2)]' 
                   : 'bg-indigo-950/5 text-indigo-900 border-indigo-900/10 hover:bg-indigo-950/10 hover:scale-110'
               }`}
               title={isNegativeMode ? "Switch to Expansive Mode" : "Switch to Limiting Beliefs Mode"}
             >
                {isNegativeMode ? (
                  <Sun size={20} className="fill-current animate-[spin_10s_linear_infinite]" />
                ) : (
                  <Moon size={20} className="fill-current group-hover:-rotate-12 transition-transform" />
                )}
             </button>

             {/* View Mode Toggle */}
             <button 
               onClick={() => setViewMode(viewMode === 'GALLERY' ? 'GUIDE' : 'GALLERY')}
               className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                 isNegativeMode
                   ? 'bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10'
                   : 'bg-white/50 hover:bg-white/80 text-slate-600 border border-white/40'
               }`}
             >
               {viewMode === 'GALLERY' ? <Info size={16} /> : <Grid size={16} />}
               <span className="hidden sm:inline">{viewMode === 'GALLERY' ? t.navGuide : t.navGallery}</span>
             </button>
          </div>
        </div>
      </nav>

      {/* Global Design Toolbar */}
      {viewMode === 'GALLERY' && !isNegativeMode && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-40 bg-white/70 backdrop-blur-xl border border-white/40 rounded-full px-6 py-2 shadow-xl flex items-center gap-6 overflow-x-auto max-w-[90vw]">
           <div className="flex items-center gap-2 border-r border-slate-200 pr-6">
             <Type size={14} className="text-slate-400" />
             <div className="flex gap-1">
               {(['serif', 'sans', 'classic', 'hand'] as FontFamily[]).map(f => (
                 <button 
                   key={f}
                   onClick={() => setGlobalStyle(s => ({...s, font: f}))}
                   className={`w-6 h-6 rounded flex items-center justify-center text-[10px] transition-all ${globalStyle.font === f ? 'bg-slate-900 text-white font-bold' : 'text-slate-400 hover:text-slate-900'}`}
                 >
                   Aa
                 </button>
               ))}
             </div>
           </div>

           <div className="flex items-center gap-2 border-r border-slate-200 pr-6">
             <Palette size={14} className="text-slate-400" />
             <div className="flex gap-2">
               {(Object.keys(COLOR_MAP) as TextColor[]).map(c => (
                 <button
                   key={c}
                   onClick={() => setGlobalStyle(s => ({...s, color: c}))}
                   className={`w-4 h-4 rounded-full transition-all ${globalStyle.color === c ? 'ring-2 ring-slate-400 scale-110' : 'opacity-50 hover:opacity-100'}`}
                   style={{ backgroundColor: c === 'black' ? '#0f172a' : c === 'slate' ? '#475569' : c === 'rose' ? '#be123c' : c === 'emerald' ? '#065f46' : c === 'violet' ? '#5b21b6' : '#b45309' }}
                 />
               ))}
             </div>
           </div>

           <div className="flex items-center gap-2">
              <button onClick={() => setGlobalStyle(s => ({...s, align: 'left'}))} className={`p-1 rounded ${globalStyle.align === 'left' ? 'text-slate-900 bg-slate-200' : 'text-slate-400 hover:text-slate-600'}`}><AlignLeft size={14}/></button>
              <button onClick={() => setGlobalStyle(s => ({...s, align: 'center'}))} className={`p-1 rounded ${globalStyle.align === 'center' ? 'text-slate-900 bg-slate-200' : 'text-slate-400 hover:text-slate-600'}`}><AlignCenter size={14}/></button>
              <button onClick={() => setGlobalStyle(s => ({...s, align: 'right'}))} className={`p-1 rounded ${globalStyle.align === 'right' ? 'text-slate-900 bg-slate-200' : 'text-slate-400 hover:text-slate-600'}`}><AlignRight size={14}/></button>
           </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="pt-24 pb-20 px-4 md:px-6 z-10 relative max-w-[1600px] mx-auto">
        
        {viewMode === 'GALLERY' ? (
          <>
            {/* New Hero Section showing mockups */}
            <HeroSection isNegativeMode={isNegativeMode} language={language} globalConfig={globalConfig} onShopClick={() => { const firstThought = THOUGHTS_DATA[0]; if (firstThought) handleOpenPurchase(firstThought, ''); }} />

            {/* Context Header */}
            <div className="text-center mb-8">
               <motion.h2 
                 key={isNegativeMode ? 'neg' : 'pos'}
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 className={`text-3xl font-serif mb-2 ${isNegativeMode ? 'text-white' : 'text-slate-800'}`}
               >
                 {isNegativeMode ? t.heroTitleNeg : t.heroTitlePos}
               </motion.h2>
               <p className={`text-sm ${isNegativeMode ? 'text-gray-400' : 'text-slate-500'}`}>
                 {isNegativeMode ? t.heroDescNeg : t.heroDescPos}
               </p>
            </div>

            {/* Category Filter */}
            <div className="mb-6 flex flex-wrap gap-2 justify-center">
              <button
                onClick={() => { setSelectedCategory('ALL'); setSelectedEmotion('ALL'); }}
                className={`px-4 py-2 rounded-full text-sm transition-all border backdrop-blur-sm ${
                  selectedCategory === 'ALL'
                    ? isNegativeMode ? 'bg-white text-black border-white' : 'bg-slate-900 text-white border-slate-900'
                    : isNegativeMode ? 'bg-white/5 text-gray-400 border-white/10 hover:border-white/30' : 'bg-white/40 text-slate-500 border-white/40 hover:bg-white/60'
                }`}
              >
                {t.filterAll}
              </button>
              {Object.values(CategoryType).map((cat) => {
                 const theme = CATEGORY_THEMES[cat];
                 const isSelected = selectedCategory === cat;
                 return (
                  <button
                    key={cat}
                    onClick={() => { setSelectedCategory(cat); setSelectedEmotion('ALL'); }}
                    className={`px-4 py-2 rounded-full text-sm transition-all border flex items-center gap-2 backdrop-blur-sm ${
                      isSelected
                        ? isNegativeMode ? 'bg-gray-800 text-white border-gray-600' : 'bg-white text-slate-900 border-slate-300 shadow-md'
                        : isNegativeMode ? 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10' : 'bg-white/40 text-slate-500 border-white/40 hover:bg-white/60'
                    }`}
                  >
                    {isSelected && theme.icon}
                    {t.cat[cat]}
                  </button>
                 );
              })}
            </div>

            {/* Emotion Sub-Filter */}
            {selectedCategory === CategoryType.EMOTIONS && (
               <div className="mb-10 max-w-4xl mx-auto">
                  <div className={`p-4 rounded-2xl border transition-colors ${isNegativeMode ? 'bg-white/5 border-white/10' : 'bg-white/40 border-white/40'}`}>
                     <div className="flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-widest opacity-50 justify-center">
                        <Sparkles size={12} /> Filter by Emotion
                     </div>
                     <div className="flex flex-wrap gap-2 justify-center">
                        <button
                           onClick={() => setSelectedEmotion('ALL')}
                           className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                              selectedEmotion === 'ALL'
                                 ? isNegativeMode ? 'bg-pink-500 text-white' : 'bg-pink-500 text-white'
                                 : isNegativeMode ? 'bg-white/10 text-gray-400 hover:bg-white/20' : 'bg-white/50 text-slate-600 hover:bg-white/80'
                           }`}
                        >
                           All Emotions
                        </button>
                        {emotionTags.map(tag => (
                           <button
                              key={tag as string}
                              onClick={() => setSelectedEmotion(tag as string)}
                              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                                 selectedEmotion === tag
                                    ? isNegativeMode ? 'bg-pink-500 text-white' : 'bg-pink-500 text-white'
                                    : isNegativeMode ? 'bg-white/10 text-gray-400 hover:bg-white/20' : 'bg-white/50 text-slate-600 hover:bg-white/80'
                              }`}
                           >
                              {tag}
                           </button>
                        ))}
                     </div>
                  </div>
               </div>
            )}

            {/* Gallery Grid */}
            <motion.div 
              layout
              className={`grid gap-6 ${
                aspectRatio === AspectRatio.POSTER_2_3 || aspectRatio === AspectRatio.ISO_5_7 || aspectRatio === AspectRatio.GALLERY_3_4
                  ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5' 
                  : aspectRatio === AspectRatio.CINEMA
                    ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                    : aspectRatio === AspectRatio.STORY
                    ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
                    : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
              }`}
            >
              <AnimatePresence>
                {filteredThoughts.map((thought) => {
                  const currentLikes = (thought.likes || 0) + (likes[thought.id] || 0);
                  const isLiked = (likes[thought.id] || 0) > 0;

                  return (
                    <ThoughtCard 
                      key={thought.id}
                      thought={thought}
                      aspectRatio={aspectRatio}
                      styleConfig={globalStyle}
                      onClick={() => {
                        setRouletteInitialNegative(false); // Normal clicks default to positive
                        setSelectedThought(thought);
                      }}
                      onLike={handleLike}
                      liked={isLiked}
                      currentLikes={currentLikes}
                      isNegativeMode={isNegativeMode}
                      language={language}
                      onSearch={(query) => setSearchQuery(query)}
                      onPurchase={handleOpenPurchase}
                    />
                  );
                })}
              </AnimatePresence>
            </motion.div>

            {/* Empty State */}
            {filteredThoughts.length === 0 && (
               <div className="text-center py-20 opacity-50">
                  <Search size={48} className="mx-auto mb-4" />
                  <p>{t.emptyState}</p>
               </div>
            )}
          </>
        ) : viewMode === 'GUIDE' ? (
          <ConceptGuide />
        ) : viewMode === 'CHAT' ? (
          <ChatOracle 
            language={language} 
            isNegativeMode={isNegativeMode} 
            thoughts={THOUGHTS_DATA}
            onSelectThought={(thought) => {
              setSelectedThought(thought);
              setViewMode('GALLERY');
            }}
          />
        ) : null}
      </main>

      {/* Editor Modal */}
      <Modal 
        thought={selectedThought} 
        initialAspectRatio={aspectRatio}
        onClose={() => setSelectedThought(null)} 
        language={language}
        initialIsNegative={rouletteInitialNegative}
        allThoughts={THOUGHTS_DATA}
        onSelectThought={(thought) => setSelectedThought(thought)}
        onSearch={(query) => {
          setSearchQuery(query);
          setSelectedThought(null);
          setViewMode('GALLERY');
        }}
        onOpenPurchase={handleOpenPurchase}
      />
      
      {/* Roulette Game Overlay */}
      <RouletteGame 
         isOpen={isRouletteOpen}
         onClose={() => setIsRouletteOpen(false)}
         onSelectThought={handleRouletteSelection}
         language={language}
      />

      {isPurchaseModalOpen && thoughtToPurchase && (
        <PurchaseModal
          thought={thoughtToPurchase}
          imageUrl={purchaseImageUrl}
          onClose={() => setIsPurchaseModalOpen(false)}
          language={language}
        />
      )}

    </div>
  );
};

export default App;
