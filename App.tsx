import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, Grid, Info, Search, Type, Palette, AlignLeft, AlignCenter, AlignRight, Check, Moon, Sun, CloudLightning, Sparkles, ChevronDown, Globe, Dices, MessageSquare, ShoppingBag } from 'lucide-react';
import { CategoryType, AspectRatio, Thought, StyleConfig, FontFamily, TextColor, TextAlign, Language } from './types';
import { THOUGHTS_DATA, CATEGORY_THEMES, COLOR_MAP, UI_TRANSLATIONS } from './constants';
import ThoughtCard from './components/ThoughtCard';
import Modal from './components/Modal';
import ConceptGuide from './components/ConceptGuide';
import HeroSection from './components/HeroSection';
import AbundanceCreator from './components/AbundanceCreator';
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

  const [isAbundanceOpen, setIsAbundanceOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const t = UI_TRANSLATIONS[language];

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <div className="min-h-screen font-sans" style={{ background: '#090909', color: '#f9f9f9' }}>

      {/* Ambient glow blobs — always dark */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[10%] right-[5%] w-[45%] h-[45%] rounded-full blur-[180px] animate-pulse"
             style={{ background: 'rgba(255,70,46,0.08)' }} />
        <div className="absolute top-[40%] left-[-10%] w-[40%] h-[40%] rounded-full blur-[150px]"
             style={{ background: 'rgba(56,189,248,0.06)' }} />
        <div className="absolute bottom-[20%] right-[10%] w-[35%] h-[35%] rounded-full blur-[160px]"
             style={{ background: 'rgba(168,85,247,0.06)' }} />
        <div className="absolute bottom-[5%] left-[15%] w-[25%] h-[25%] rounded-full blur-[120px]"
             style={{ background: 'rgba(255,70,46,0.05)' }} />
        <ParticleBackground isNegativeMode={isNegativeMode} />
      </div>

      {/* ── Phoenix Wall Navbar ── */}
      <nav className="fixed top-0 w-full z-50 h-16 flex items-center px-6 md:px-10"
           style={{ background: 'rgba(9,9,9,0.72)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(234,234,234,0.07)' }}>

        {/* Logo / Brand */}
        <div className="flex items-center gap-3 cursor-pointer select-none" onClick={() => setViewMode('GALLERY')}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
               style={{ background: 'rgba(255,70,46,0.12)', border: '1px solid rgba(255,70,46,0.3)' }}>
            <Layers className="w-4 h-4" style={{ color: '#ff462e' }} />
          </div>
          <span className="text-lg font-display tracking-tight" style={{ color: '#f9f9f9', fontFamily: "'Yeseva One', serif" }}>
            Mind Gallery
          </span>
        </div>

        {/* Center pill nav */}
        <div className="hidden md:flex items-center gap-1 mx-auto rounded-full px-2 py-1.5"
             style={{ background: 'rgba(9,9,9,0.4)', border: '1px solid rgba(234,234,234,0.1)', backdropFilter: 'blur(12px)' }}>
          {([
            { id: 'GALLERY', label: t.navGallery, icon: <Grid size={14}/> },
            { id: 'GUIDE',   label: t.navGuide,   icon: <Info size={14}/> },
            { id: 'CHAT',    label: t.navChat,     icon: <MessageSquare size={14}/> },
          ] as const).map(item => (
            <button
              key={item.id}
              onClick={() => setViewMode(item.id)}
              className="flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all"
              style={{
                color: viewMode === item.id ? '#f9f9f9' : '#7f7f80',
                background: viewMode === item.id ? 'rgba(255,70,46,0.12)' : 'transparent',
                border: viewMode === item.id ? '1px solid rgba(255,70,46,0.3)' : '1px solid transparent',
                boxShadow: viewMode === item.id ? '0 0 12px rgba(255,70,46,0.15)' : 'none',
                fontFamily: "'Comfortaa', sans-serif",
              }}
            >
              {item.icon}{item.label}
            </button>
          ))}
          {/* Manifest Button */}
          <button
            onClick={() => setIsAbundanceOpen(true)}
            className="flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all text-[#ff462e] animate-pulse"
            style={{ fontFamily: "'Comfortaa', sans-serif" }}
          >
            <Sparkles size={14} />
            Manifest
          </button>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2 ml-auto md:ml-0">
          {/* Search */}
          <div className="hidden lg:flex items-center relative">
            <Search className="absolute left-3" size={14} style={{ color: '#7f7f80' }} />
            <input
              type="text"
              placeholder={t.lblSearchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 text-sm outline-none"
              style={{
                background: 'rgba(249,249,249,0.05)',
                border: '1px solid rgba(234,234,234,0.1)',
                borderRadius: '999px',
                color: '#f9f9f9',
                fontFamily: "'Comfortaa', sans-serif",
                width: 180,
              }}
            />
          </div>

          {/* Roulette */}
          <button
            onClick={() => setIsRouletteOpen(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all group"
            style={{ background: 'rgba(249,249,249,0.05)', border: '1px solid rgba(234,234,234,0.1)', color: '#7f7f80', fontFamily: "'Comfortaa', sans-serif" }}
          >
            <Dices size={16} className="group-hover:rotate-12 transition-transform" />
            <span className="hidden sm:inline">{t.navRoulette}</span>
          </button>

          {/* Shop CTA */}
          <button
            onClick={() => {
              const pool = THOUGHTS_DATA.filter(t => !t.isPremium);
              const pick = pool[Math.floor(Math.random() * pool.length)] || THOUGHTS_DATA[0];
              setViewMode('GALLERY');
              setSelectedThought(pick);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all"
            style={{
              background: 'rgba(255,70,46,0.12)',
              border: '1px solid rgba(255,70,46,0.4)',
              color: '#f9f9f9',
              fontFamily: "'Comfortaa', sans-serif",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,70,46,0.25)';
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,70,46,0.8)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,70,46,0.12)';
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,70,46,0.4)';
            }}
          >
            <ShoppingBag size={14} />
            <span className="hidden sm:inline">Shop</span>
          </button>

          {/* Mode toggle */}
          <button
            onClick={() => setIsNegativeMode(!isNegativeMode)}
            title={isNegativeMode ? "Expansive Mode" : "Limiting Beliefs Mode"}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-all"
            style={{ background: 'rgba(249,249,249,0.05)', border: '1px solid rgba(234,234,234,0.1)', color: isNegativeMode ? '#fde047' : '#7f7f80' }}
          >
            {isNegativeMode
              ? <Sun size={16} className="fill-current animate-[spin_10s_linear_infinite]" />
              : <Moon size={16} className="fill-current" />}
          </button>

          {/* Language */}
          <div className="relative">
            <button
              onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold transition-all"
              style={{ background: 'rgba(249,249,249,0.05)', border: '1px solid rgba(234,234,234,0.1)', color: '#7f7f80', fontFamily: "'Comfortaa', sans-serif" }}
            >
              <span className="text-base leading-none">{currentLang.flag}</span>
              <span className="hidden sm:inline">{currentLang.code.toUpperCase()}</span>
              <ChevronDown size={12} className={`transition-transform ${isLangMenuOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {isLangMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="absolute top-full right-0 mt-2 w-32 rounded-xl overflow-hidden"
                  style={{ background: '#1a1a1a', border: '1px solid rgba(234,234,234,0.1)', backdropFilter: 'blur(20px)', zIndex: 200 }}
                >
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => { setLanguage(l.code); setIsLangMenuOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-xs font-medium transition-colors"
                      style={{
                        color: language === l.code ? '#f9f9f9' : '#7f7f80',
                        background: language === l.code ? 'rgba(255,70,46,0.1)' : 'transparent',
                        fontFamily: "'Comfortaa', sans-serif",
                      }}
                    >
                      <span className="text-base leading-none">{l.flag}</span>{l.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </nav>

      {/* Design Toolbar - Appears on scroll */}
      <AnimatePresence>
        {viewMode === 'GALLERY' && scrollY > 500 && (
          <motion.div 
            initial={{ y: -20, opacity: 0, x: '-50%' }}
            animate={{ y: 0, opacity: 1, x: '-50%' }}
            exit={{ y: -20, opacity: 0, x: '-50%' }}
            className="fixed top-[74px] left-1/2 z-40 flex items-center gap-4 px-6 py-2.5 rounded-full overflow-x-auto max-w-[95vw] glass-premium glass-noise shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-white/20"
          >
            <div className="flex items-center gap-1.5 pr-4 border-r border-white/10">
              <Type size={12} className="text-white/40" />
              {(['serif', 'sans', 'classic', 'hand'] as FontFamily[]).map(f => (
                <button
                  key={f}
                  onClick={() => setGlobalStyle(s => ({...s, font: f}))}
                  className="w-7 h-7 rounded-xl flex items-center justify-center text-[10px] font-bold transition-all hover:scale-110 active:scale-95"
                  style={{
                    background: globalStyle.font === f ? '#ff462e' : 'rgba(255,255,255,0.05)',
                    color: globalStyle.font === f ? '#fff' : 'rgba(255,255,255,0.4)',
                    fontFamily: "'Comfortaa', sans-serif",
                  }}
                >Aa</button>
              ))}
            </div>
            
            <div className="flex items-center gap-1.5 pr-4 border-r border-white/10">
              <Palette size={12} className="text-white/40" />
              {(Object.keys(COLOR_MAP) as TextColor[]).map(c => (
                <button
                  key={c}
                  onClick={() => setGlobalStyle(s => ({...s, color: c}))}
                  className="w-5 h-5 rounded-full transition-all hover:scale-125 border border-white/10"
                  style={{
                    backgroundColor: c === 'black' ? '#f9f9f9' : c === 'slate' ? '#94a3b8' : c === 'rose' ? '#fb7185' : c === 'emerald' ? '#34d399' : c === 'violet' ? '#a78bfa' : '#fbbf24',
                    outline: globalStyle.color === c ? '2px solid #ff462e' : 'none',
                    outlineOffset: '2px',
                  }}
                />
              ))}
            </div>

            <div className="flex items-center gap-1 pr-4 border-r border-white/10">
               {[
                 { id: 'left', icon: <AlignLeft size={13}/> },
                 { id: 'center', icon: <AlignCenter size={13}/> },
                 { id: 'right', icon: <AlignRight size={13}/> }
               ].map(btn => (
                <button 
                  key={btn.id}
                  onClick={() => setGlobalStyle(s => ({...s, align: btn.id as TextAlign}))}
                  className="p-1.5 rounded-lg transition-all hover:bg-white/5"
                  style={{ color: globalStyle.align === btn.id ? '#ff462e' : 'rgba(255,255,255,0.3)' }}
                >
                  {btn.icon}
                </button>
               ))}
            </div>

             <div className="hidden md:flex items-center gap-2">
              <Search size={12} className="text-white/40" />
              <input
                type="text"
                placeholder={t.lblSearchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none text-[10px] text-white focus:outline-none w-20 md:w-32 placeholder:text-white/20 font-serif"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="pt-28 pb-20 px-4 md:px-10 z-10 relative max-w-[1600px] mx-auto">
        
        {viewMode === 'GALLERY' ? (
          <>
            <HeroSection
              isNegativeMode={isNegativeMode}
              language={language}
              onShopClick={() => {
                const pool = THOUGHTS_DATA.filter(t => !t.isPremium);
                const pick = pool[Math.floor(Math.random() * pool.length)] || THOUGHTS_DATA[0];
                setSelectedThought(pick);
              }}
              onManifestClick={() => setIsAbundanceOpen(true)}
            />



            {/* Context Header */}
            <div className="text-center mb-8">
               <motion.h2
                 key={isNegativeMode ? 'neg' : 'pos'}
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 className="text-3xl mb-2"
                 style={{ fontFamily: "'Yeseva One', serif", color: '#f9f9f9' }}
               >
                 {isNegativeMode ? t.heroTitleNeg : t.heroTitlePos}
               </motion.h2>
               <p className="text-sm" style={{ color: '#7f7f80', fontFamily: "'Comfortaa', sans-serif" }}>
                 {isNegativeMode ? t.heroDescNeg : t.heroDescPos}
               </p>
            </div>

            {/* Category Filter */}
            <div className="mb-6 flex flex-wrap gap-2 justify-center">
              {[{ id: 'ALL', label: t.filterAll }, ...Object.values(CategoryType).map(cat => ({ id: cat, label: t.cat[cat], icon: CATEGORY_THEMES[cat]?.icon }))].map(item => {
                const isSelected = selectedCategory === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => { setSelectedCategory(item.id as any); setSelectedEmotion('ALL'); }}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all"
                    style={{
                      fontFamily: "'Comfortaa', sans-serif",
                      background: isSelected ? 'rgba(255,70,46,0.12)' : 'rgba(249,249,249,0.04)',
                      border: isSelected ? '1px solid rgba(255,70,46,0.4)' : '1px solid rgba(234,234,234,0.1)',
                      color: isSelected ? '#f9f9f9' : '#7f7f80',
                      boxShadow: isSelected ? '0 0 12px rgba(255,70,46,0.15)' : 'none',
                    }}
                  >
                    {isSelected && (item as any).icon}
                    {item.label}
                  </button>
                );
              })}
            </div>

            {/* Emotion Sub-Filter */}
            {selectedCategory === CategoryType.EMOTIONS && (
               <div className="mb-10 max-w-4xl mx-auto">
                  <div className="p-4 rounded-xl" style={{ background: 'rgba(249,249,249,0.03)', border: '1px solid rgba(234,234,234,0.08)' }}>
                     <div className="flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-widest justify-center"
                          style={{ color: '#7f7f80', fontFamily: "'Comfortaa', sans-serif" }}>
                        <Sparkles size={12} /> Filter by Emotion
                     </div>
                     <div className="flex flex-wrap gap-2 justify-center">
                        {['ALL', ...emotionTags].map(tag => (
                           <button
                              key={tag as string}
                              onClick={() => setSelectedEmotion(tag === 'ALL' ? 'ALL' : tag as string)}
                              className="px-3 py-1 rounded-full text-xs font-medium transition-all"
                              style={{
                                fontFamily: "'Comfortaa', sans-serif",
                                background: selectedEmotion === tag ? 'rgba(255,70,46,0.15)' : 'rgba(249,249,249,0.04)',
                                border: selectedEmotion === tag ? '1px solid rgba(255,70,46,0.4)' : '1px solid rgba(234,234,234,0.08)',
                                color: selectedEmotion === tag ? '#f9f9f9' : '#7f7f80',
                              }}
                           >
                              {tag === 'ALL' ? 'All Emotions' : tag}
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
                      onPurchase={(t) => {
                        // Open Studio first so the user designs their piece;
                        // the Studio's "Collect" button then calls handleOpenPurchase
                        // with the generated high-quality artwork.
                        setRouletteInitialNegative(false);
                        setSelectedThought(t);
                      }}
                    />
                  );
                })}
              </AnimatePresence>
            </motion.div>

            {/* Empty State */}
            {filteredThoughts.length === 0 && (
               <div className="text-center py-20" style={{ color: '#7f7f80' }}>
                  <Search size={48} className="mx-auto mb-4 opacity-30" />
                  <p style={{ fontFamily: "'Comfortaa', sans-serif" }}>{t.emptyState}</p>
               </div>
            )}

            {/* ── Neuroesthetic Section ── */}
            <div className="mt-24 mb-8">
              <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(234,234,234,0.08)', background: 'rgba(17,17,17,0.6)' }}>
                {/* Top accent bar */}
                <div className="h-[2px] w-full" style={{ background: 'linear-gradient(90deg, transparent, #ff462e 40%, transparent)' }} />
                <div className="p-10 md:p-16">
                  <div className="text-xs font-bold uppercase tracking-[0.2em] mb-6" style={{ color: '#ff462e', fontFamily: "'Comfortaa', sans-serif" }}>
                    Neuroaesthetics
                  </div>
                  <h2 className="text-3xl md:text-5xl mb-6 leading-tight" style={{ fontFamily: "'Yeseva One', serif", color: '#f9f9f9', letterSpacing: '-0.5px' }}>
                    From thought to space.<br/>
                    <span style={{ color: '#ff462e' }}>The science of what you hang on your walls.</span>
                  </h2>
                  <div className="grid md:grid-cols-3 gap-8 mt-10">
                    {[
                      {
                        step: '01',
                        title: 'The Belief',
                        desc: 'Every thought carries an energetic signature. A limiting belief — "I am not enough" — contracts your nervous system. An expansive one expands it.'
                      },
                      {
                        step: '02',
                        title: 'The Visual',
                        desc: 'When you transform that belief into a visual piece, your brain processes it differently. You see it every day. It rewires the default narrative — slowly, quietly, powerfully.'
                      },
                      {
                        step: '03',
                        title: 'The Space',
                        desc: 'Your environment is your extended mind. Phoenix Wall pieces are designed to make the invisible visible — turning your walls into a neuroaesthetic practice.'
                      },
                    ].map(item => (
                      <div key={item.step} className="flex flex-col gap-3">
                        <div className="text-4xl font-bold" style={{ fontFamily: "'Yeseva One', serif", color: 'rgba(255,70,46,0.2)' }}>{item.step}</div>
                        <h3 className="text-lg font-semibold" style={{ fontFamily: "'Comfortaa', sans-serif", color: '#f9f9f9' }}>{item.title}</h3>
                        <p className="text-sm leading-relaxed" style={{ fontFamily: "'Comfortaa', sans-serif", color: '#7f7f80' }}>{item.desc}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-10">
                    <button
                      onClick={() => {
                        const pool = THOUGHTS_DATA.filter(t => !t.isPremium);
                        const pick = pool[Math.floor(Math.random() * pool.length)] || THOUGHTS_DATA[0];
                        setSelectedThought(pick);
                      }}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all"
                      style={{
                        background: 'rgba(255,70,46,0.12)',
                        border: '1px solid rgba(255,70,46,0.4)',
                        color: '#f9f9f9',
                        fontFamily: "'Comfortaa', sans-serif",
                      }}
                    >
                      <Sparkles size={14} style={{ color: '#ff462e' }} />
                      Design Your Piece
                    </button>
                  </div>
                </div>
              </div>
            </div>
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

      {/* ── Phoenix Wall Footer ── */}
      <footer style={{ background: '#050505', borderTop: '2px solid #ff462e' }}>
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-14 grid md:grid-cols-3 gap-10">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255,70,46,0.12)', border: '1px solid rgba(255,70,46,0.3)' }}>
                <Layers className="w-4 h-4" style={{ color: '#ff462e' }} />
              </div>
              <span className="text-lg" style={{ fontFamily: "'Yeseva One', serif", color: '#f9f9f9' }}>Mind Gallery</span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: '#7f7f80', fontFamily: "'Comfortaa', sans-serif" }}>
              Smart Art for Inspired Spaces.<br/>
              Transform your beliefs into wall art.
            </p>
            <p className="text-xs" style={{ color: 'rgba(249,249,249,0.3)', fontFamily: "'Comfortaa', sans-serif" }}>
              Part of <span style={{ color: '#ff462e' }}>Phoenix Wall®</span> · Spain & Europe
            </p>
          </div>

          {/* Navigation */}
          <div className="flex flex-col gap-3">
            <div className="text-xs font-bold uppercase tracking-[0.15em] mb-2" style={{ color: '#7f7f80', fontFamily: "'Comfortaa', sans-serif" }}>Explore</div>
            {[
              { label: 'Gallery', action: () => setViewMode('GALLERY') },
              { label: 'Concept Guide', action: () => setViewMode('GUIDE') },
              { label: 'AI Oracle', action: () => setViewMode('CHAT') },
              { label: 'Shop Prints', action: () => { const p = THOUGHTS_DATA[0]; setSelectedThought(p); } },
            ].map(item => (
              <button key={item.label} onClick={item.action}
                className="text-sm text-left transition-colors w-fit"
                style={{ color: '#7f7f80', fontFamily: "'Comfortaa', sans-serif" }}
                onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.color = '#f9f9f9'}
                onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.color = '#7f7f80'}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Products */}
          <div className="flex flex-col gap-3">
            <div className="text-xs font-bold uppercase tracking-[0.15em] mb-2" style={{ color: '#7f7f80', fontFamily: "'Comfortaa', sans-serif" }}>Products</div>
            {['Art Prints', 'Framed Art', 'Canvas', 'Clothing', 'Phone Cases', 'Mugs'].map(item => (
              <span key={item} className="text-sm" style={{ color: '#7f7f80', fontFamily: "'Comfortaa', sans-serif" }}>{item}</span>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="px-6 md:px-10 py-5" style={{ borderTop: '1px solid rgba(234,234,234,0.06)' }}>
          <p className="text-xs text-center" style={{ color: 'rgba(249,249,249,0.3)', fontFamily: "'Comfortaa', sans-serif" }}>
            © {new Date().getFullYear()} Phoenix Wall® · Mind Gallery · All rights reserved
          </p>
        </div>
      </footer>

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

      {isAbundanceOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsAbundanceOpen(false)}
            className="absolute inset-0 bg-black/80 backdrop-blur-xl"
          />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto"
          >
            <AbundanceCreator 
                isNegativeMode={isNegativeMode} 
                language={language}
                onSave={(thoughtContent) => {
                    const customThought: Thought = {
                        id: 'custom-' + Date.now(),
                        category: CategoryType.ABUNDANCE,
                        content: {
                            en: { limiting: '...', expansive: thoughtContent.expansive },
                            es: { limiting: '...', expansive: thoughtContent.expansive },
                            de: { limiting: '...', expansive: thoughtContent.expansive }
                        },
                        author: language === 'es' ? 'Tú (Arquitecto de Realidad)' : 'You (Reality Architect)',
                        likes: 0,
                        isPremium: false,
                        visualDescription: "Custom manifestation art"
                    };
                    setSelectedThought(customThought);
                    setIsAbundanceOpen(false);
                }}
            />
            <button 
              onClick={() => setIsAbundanceOpen(false)}
              className="absolute top-8 right-8 text-white/40 hover:text-white transition-colors"
            >
              <Grid size={32} className="rotate-45" />
            </button>
          </motion.div>
        </div>
      )}

    </div>
  );
};

export default App;
