import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenAI } from "@google/genai";
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { AspectRatio, Thought, StyleConfig, FontFamily, TextAlign, TextColor, FrameColor, LogoStyle, ArtStyle, Language } from '../types';
import { X, Download, Palette, Maximize2, Type, Check, Sparkles, Image as ImageIcon, Frame, Stamp, Loader2, CircleOff, Pencil, Armchair, BedDouble, Briefcase, ZoomIn, Globe, Eye, EyeOff, User, UserMinus, FileImage, FileText, Sun, Moon, BookOpen, Zap, MoveRight, ArrowDown, Smartphone, Layers, ShoppingBag } from 'lucide-react';
import { COLOR_MAP, FRAME_STYLES, LOGO_COMPONENTS, ART_STYLES_CSS, AI_PROMPTS, UI_TRANSLATIONS } from '../constants';

interface ModalProps {
  thought: Thought | null;
  initialAspectRatio: AspectRatio; 
  onClose: () => void;
  language: Language;
  initialIsNegative?: boolean;
  allThoughts?: Thought[];
  onSelectThought?: (thought: Thought) => void;
  onSearch?: (query: string) => void;
  onOpenPurchase?: (thought: Thought, imageUrl: string) => void;
}

// Mockup backgrounds
const MOCKUPS = {
  studio: { label: 'Studio', img: '', css: 'bg-[#e2e8f0]' },
  living: { label: 'Living Room', img: 'https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?q=80&w=2070&auto=format&fit=crop', css: 'bg-cover bg-center' },
  bedroom: { label: 'Bedroom', img: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=2069&auto=format&fit=crop', css: 'bg-cover bg-center' },
  office: { label: 'Office', img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop', css: 'bg-cover bg-center' },
};

type ViewMode = keyof typeof MOCKUPS;

const Modal: React.FC<ModalProps> = ({ 
  thought, 
  initialAspectRatio, 
  onClose, 
  language: initialLanguage, 
  initialIsNegative = false,
  allThoughts,
  onSelectThought,
  onSearch,
  onOpenPurchase
}) => {
  const [localAspectRatio, setLocalAspectRatio] = useState<AspectRatio>(initialAspectRatio);
  const [viewMode, setViewMode] = useState<ViewMode>('studio');
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [localLanguage, setLocalLanguage] = useState<Language>(initialLanguage);
  const [isNegative, setIsNegative] = useState(initialIsNegative);
  
  // Content State
  const [customText, setCustomText] = useState('');
  const [showAuthor, setShowAuthor] = useState(true);
  const [showText, setShowText] = useState(true);
  const [fontSize, setFontSize] = useState(24); 
  const [downloadFormat, setDownloadFormat] = useState<'jpg' | 'pdf'>('jpg');

  // Customization States
  const [frameColor, setFrameColor] = useState<FrameColor>('black');
  const [logoStyle, setLogoStyle] = useState<LogoStyle>('crown');
  const [artStyle, setArtStyle] = useState<ArtStyle>('none');
  
  // AI States
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [generatedBg, setGeneratedBg] = useState(''); 
  const [aiMode, setAiMode] = useState<'background' | 'full'>('background');
  
  // Guide State
  const [guideContent, setGuideContent] = useState('');
  const [isGeneratingGuide, setIsGeneratingGuide] = useState(false);

  const relatedThoughts = useMemo(() => {
    if (!thought || !allThoughts) return [];
    return allThoughts
      .filter(t => t.category === thought.category && t.id !== thought.id)
      .slice(0, 4);
  }, [thought, allThoughts]);

  const [style, setStyle] = useState<StyleConfig>({
    font: 'serif',
    align: 'center',
    color: 'black'
  });

  const printRef = useRef<HTMLDivElement>(null);
  const t = UI_TRANSLATIONS[localLanguage];

  useEffect(() => {
    setLocalAspectRatio(initialAspectRatio);
    // Reset temporary states on open
    setGeneratedBg('');
    setArtStyle('none');
    setDownloadSuccess(false);
    setViewMode('studio');
    setLocalLanguage(initialLanguage);
    setShowAuthor(true);
    setShowText(true);
    setAiMode('background');
    setFontSize(24);
    setIsNegative(initialIsNegative);
    setGuideContent(''); // Reset guide on open
    if (thought) {
      const content = thought.content[initialLanguage];
      setCustomText(initialIsNegative ? content.limiting : content.expansive);
    }
  }, [initialAspectRatio, thought, initialLanguage, initialIsNegative]);

  // Effect to update text when user switches language or polarity inside the modal
  useEffect(() => {
    if (thought) {
      const currentContent = thought.content[localLanguage];
      setCustomText(isNegative ? currentContent.limiting : currentContent.expansive);
      setGuideContent(''); // Reset guide when text changes context
    }
  }, [localLanguage, isNegative, thought]);

  if (!thought) return null;

  const handleGenerateGuide = async () => {
    if (!customText || !process.env.API_KEY) return;
    setIsGeneratingGuide(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        Act as a wise mentor or therapist.
        For the following thought: "${customText}" (${isNegative ? 'Limiting/Negative' : 'Expansive/Positive'}),
        provide:
        1. A brief interpretation of what this thought means and its impact.
        2. A practical, actionable exercise (step-by-step) to work with this thought.
        
        Keep it concise (under 300 words total).
        Language: ${localLanguage === 'es' ? 'Spanish' : localLanguage === 'de' ? 'German' : 'English'}.
        Format: Plain text with clear headings.
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

  const handleDownload = async () => {
    if (!printRef.current) return;
    setIsDownloading(true);
    
    // Ensure we are in Studio mode for best capture
    const originalView = viewMode;
    setViewMode('studio');

    // Wait for state to settle/render
    setTimeout(async () => {
        try {
            const canvas = await html2canvas(printRef.current!, {
                useCORS: true,
                scale: 4, // Ultra High Res
                backgroundColor: null, 
            });
            
            // 1. Download the Image (JPG or PDF)
            if (downloadFormat === 'jpg') {
              const link = document.createElement('a');
              link.download = `mindgallery-${thought.id}.jpg`;
              link.href = canvas.toDataURL('image/jpeg', 0.9);
              link.click();
              
              // If guide exists, download it as a separate PDF
              if (guideContent) {
                 const guidePdf = new jsPDF();
                 guidePdf.setFontSize(16);
                 guidePdf.text("Interpretation Guide & Exercise", 20, 20);
                 guidePdf.setFontSize(12);
                 const splitText = guidePdf.splitTextToSize(guideContent, 170);
                 guidePdf.text(splitText, 20, 40);
                 guidePdf.save(`mindgallery-guide-${thought.id}.pdf`);
              }

            } else {
              // PDF Logic - Combined
              const imgData = canvas.toDataURL('image/jpeg', 0.9);
              const imgWidth = canvas.width;
              const imgHeight = canvas.height;
              
              // Create PDF with dimensions matching the image (in pixels)
              const pdf = new jsPDF({
                orientation: imgWidth > imgHeight ? 'l' : 'p',
                unit: 'px',
                format: [imgWidth, imgHeight]
              });
              
              pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);
              
              // Add Guide Page if exists
              if (guideContent) {
                 pdf.addPage([595, 842], 'p'); // A4 size for guide
                 pdf.setFontSize(16);
                 pdf.text("Interpretation Guide & Exercise", 20, 30);
                 pdf.setFontSize(12);
                 // Simple text wrapping
                 const splitText = pdf.splitTextToSize(guideContent, 550); // width - margins
                 pdf.text(splitText, 20, 50);
              }

              pdf.save(`mindgallery-${thought.id}.pdf`);
            }
            
            setDownloadSuccess(true);
            setTimeout(() => setDownloadSuccess(false), 3000);
        } catch (error) {
            console.error("Download failed:", error);
        } finally {
            setIsDownloading(false);
            setViewMode(originalView);
        }
    }, 500);
  };

  const mapRatioToApi = (ratio: AspectRatio): "1:1" | "3:4" | "4:3" | "9:16" | "16:9" => {
    switch(ratio) {
      case AspectRatio.SQUARE: return "1:1";
      case AspectRatio.POSTER_2_3: return "3:4";
      case AspectRatio.GALLERY_3_4: return "3:4";
      case AspectRatio.ISO_5_7: return "3:4";
      case AspectRatio.STORY: return "9:16";
      case AspectRatio.CINEMA: return "16:9";
      default: return "1:1";
    }
  };

  const handleAiGenerate = async () => {
    if (!aiPrompt || !process.env.API_KEY) return;
    setIsGeneratingAi(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const apiRatio = mapRatioToApi(localAspectRatio);

      let finalPrompt = aiPrompt;
      if (aiMode === 'full') {
         finalPrompt = `Create an artistic image that clearly features the text: "${customText}". The style should be: ${aiPrompt}. High quality typography, legible text, creative composition.`;
      }

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: finalPrompt }] },
        config: {
          imageConfig: {
            aspectRatio: apiRatio
          }
        }
      });

      let imageUrl = '';
      if (response.candidates && response.candidates.length > 0) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            imageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
            break;
          }
        }
      }

      if (imageUrl) {
        setGeneratedBg(imageUrl);
        setArtStyle('ai_generated');
      }
    } catch (error) {
      console.error("AI Generation failed:", error);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const getFontClass = (font: FontFamily) => {
    switch(font) {
      case 'sans': return 'font-sans';
      case 'serif': return 'font-serif';
      case 'classic': return 'font-classic';
      case 'hand': return 'font-hand';
      default: return 'font-serif';
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

  const getFrameStyles = () => {
    const aspectRatioClass = (() => {
      switch (localAspectRatio) {
        case AspectRatio.SQUARE: return 'aspect-square'; 
        case AspectRatio.POSTER_2_3: return 'aspect-[2/3]';
        case AspectRatio.GALLERY_3_4: return 'aspect-[3/4]';
        case AspectRatio.ISO_5_7: return 'aspect-[5/7]';
        case AspectRatio.STORY: return 'aspect-[9/16]';
        case AspectRatio.CINEMA: return 'aspect-[16/9]';
        default: return 'aspect-square';
      }
    })();

    const borderClass = frameColor === 'none' ? 'border-0' : (
       viewMode === 'studio' ? 'border-[16px]' : 
       viewMode === 'living' ? 'border-[8px]' : 
       'border-[6px]'
    );

    if (viewMode === 'studio') {
      return {
        container: `${aspectRatioClass} h-[50vh] max-h-[500px] ${borderClass} shadow-2xl`,
        wrapper: 'flex items-center justify-center p-8'
      };
    } else if (viewMode === 'living') {
      return {
        container: `${aspectRatioClass} w-[22%] absolute top-[30%] left-[50%] -translate-x-1/2 ${borderClass} shadow-[5px_10px_20px_rgba(0,0,0,0.5)]`,
        wrapper: 'relative w-full h-full'
      };
    } else if (viewMode === 'bedroom') {
       return {
        container: `${aspectRatioClass} w-[18%] absolute top-[25%] left-[50%] -translate-x-1/2 ${borderClass} shadow-[5px_10px_20px_rgba(0,0,0,0.5)]`,
        wrapper: 'relative w-full h-full'
      };
    } else { // Office
       return {
        container: `${aspectRatioClass} w-[20%] absolute top-[35%] left-[25%] ${borderClass} shadow-[5px_10px_20px_rgba(0,0,0,0.5)]`,
        wrapper: 'relative w-full h-full'
      };
    }
  };

  const cycleLanguage = () => {
     if (localLanguage === 'en') setLocalLanguage('es');
     else if (localLanguage === 'es') setLocalLanguage('de');
     else setLocalLanguage('en');
  };

  const frameStyles = getFrameStyles();

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-[#1e293b] w-full max-w-7xl h-[90vh] rounded-3xl overflow-hidden border border-slate-700 shadow-2xl flex flex-col md:flex-row"
        >
          {/* Preview Section */}
          <div 
            className={`flex-1 relative overflow-hidden group transition-all duration-500 ${viewMode === 'studio' ? MOCKUPS.studio.css : 'bg-cover bg-center bg-no-repeat'}`}
            style={viewMode !== 'studio' ? { backgroundImage: `url(${MOCKUPS[viewMode].img})` } : undefined}
          >
             {viewMode === 'studio' && (
               <>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-multiply" />
                <div className="absolute inset-0 bg-gradient-to-b from-white/50 to-slate-300/50 pointer-events-none" />
               </>
             )}
            
                <div className={frameStyles.wrapper}>
                    <motion.div 
                       layout
                       ref={printRef}
                       initial={false}
                       animate={{ 
                         rotateY: isNegative ? 180 : 0,
                         scale: isDownloading ? 1 : 1 // Keep scale 1 for download
                       }}
                       transition={{ 
                         type: "spring", 
                         stiffness: 150, 
                         damping: 20,
                         rotateY: { duration: 0.6 }
                       }}
                       style={{ transformStyle: "preserve-3d" }}
                       onClick={() => !isDownloading && setIsNegative(!isNegative)}
                       className={`relative z-10 flex flex-col transition-all duration-500 bg-white cursor-pointer group/card ${frameStyles.container} ${FRAME_STYLES[frameColor]}`}
                    >
                       <div className="absolute -inset-[1px] border border-white/20 rounded-sm pointer-events-none z-20"></div>

                       <div 
                         className="relative h-full w-full bg-white overflow-hidden flex flex-col"
                         style={{ 
                            backfaceVisibility: "hidden",
                            transform: isNegative ? "rotateY(180deg)" : "none"
                         }}
                       >
                          <div 
                            className={`absolute inset-0 z-0 transition-all duration-500 bg-cover bg-center ${artStyle !== 'ai_generated' ? ART_STYLES_CSS[artStyle] : ''}`} 
                            style={artStyle === 'ai_generated' ? { backgroundImage: `url(${generatedBg})` } : undefined}
                          />
                          {/* Overlay only if in Background mode */}
                          {artStyle !== 'none' && aiMode === 'background' && <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] z-0" />}
                          <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_40px_rgba(0,0,0,0.15)] z-10" />

                          <div className={`relative z-20 h-full w-full flex flex-col justify-center ${viewMode === 'studio' ? 'p-8 md:p-12' : 'p-2'} ${getAlignClass(style.align)}`}>
                              {showText && !(aiMode === 'full' && artStyle === 'ai_generated') && (
                                <h2 
                                  style={{ fontSize: viewMode === 'studio' ? `${fontSize}px` : `${fontSize / 3}px` }}
                                  className={`leading-snug break-words ${getFontClass(style.font)} ${COLOR_MAP[style.color]} drop-shadow-sm`}
                                >
                                  {customText}
                                </h2>
                              )}

                              {viewMode === 'studio' && showAuthor && !(aiMode === 'full' && artStyle === 'ai_generated') && (
                                <p className={`text-xs uppercase tracking-widest text-slate-500 font-sans mt-6 font-semibold ${style.align === 'center' ? 'mx-auto' : ''}`}>
                                    — {thought.author || 'Anonymous'}
                                </p>
                              )}

                              <div className={`absolute left-0 right-0 flex justify-center ${COLOR_MAP[style.color]} opacity-50
                                 ${viewMode === 'studio' ? 'bottom-6' : 'bottom-1'}
                              `}>
                                 {logoStyle !== 'none' && React.cloneElement(LOGO_COMPONENTS[logoStyle] as React.ReactElement, { size: viewMode === 'studio' ? 16 : 6 })}
                              </div>
                          </div>
                          
                          {/* Polarity Indicator Overlay on Hover - Simplified */}
                          <div className="absolute inset-0 bg-black/0 group-hover/card:bg-black/5 transition-colors flex items-center justify-center opacity-0 group-hover/card:opacity-100 pointer-events-none">
                          </div>
                       </div>
                    </motion.div>
                </div>

            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-black/60 backdrop-blur-md rounded-full p-1 flex gap-1 border border-white/10 z-30">
                <button onClick={() => setViewMode('studio')} className={`p-2 rounded-full transition-colors flex items-center gap-2 px-4 ${viewMode === 'studio' ? 'bg-white text-black font-bold' : 'text-slate-300 hover:text-white hover:bg-white/10'}`}>
                   <ZoomIn size={16} /> <span className="text-xs">Studio</span>
                </button>
                <div className="w-px bg-white/20 my-1 mx-1"></div>
                <button onClick={() => setViewMode('living')} title="Living Room" className={`p-2 rounded-full transition-colors ${viewMode === 'living' ? 'bg-white text-black' : 'text-slate-300 hover:text-white hover:bg-white/10'}`}><Armchair size={16} /></button>
                <button onClick={() => setViewMode('bedroom')} title="Bedroom" className={`p-2 rounded-full transition-colors ${viewMode === 'bedroom' ? 'bg-white text-black' : 'text-slate-300 hover:text-white hover:bg-white/10'}`}><BedDouble size={16} /></button>
                <button onClick={() => setViewMode('office')} title="Office" className={`p-2 rounded-full transition-colors ${viewMode === 'office' ? 'bg-white text-black' : 'text-slate-300 hover:text-white hover:bg-white/10'}`}><Briefcase size={16} /></button>
            </div>
          </div>

          {/* Controls Editor Section */}
          <div className="w-full md:w-[450px] bg-[#0f172a] border-l border-slate-800 flex flex-col h-full">
            
            <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-[#0f172a] z-20">
               <div>
                  <h3 className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">{t.modalCustomize}</h3>
                  <h1 className="text-xl font-serif text-white">{t.modalTitle}</h1>
               </div>
               <div className="flex items-center gap-2">
                 <button 
                    onClick={cycleLanguage}
                    className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors flex items-center gap-1 text-xs font-bold border border-transparent hover:border-slate-700"
                    title="Change Editor Language"
                 >
                    <Globe size={16} />
                    {localLanguage.toUpperCase()}
                 </button>
                 <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white">
                   <X size={24} />
                 </button>
               </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-8 custom-scrollbar">
              
              <section>
                <div className="flex items-center gap-2 mb-3 text-slate-300 text-sm font-medium">
                  <Pencil size={16} className="text-green-400" />
                  <span>{t.lblPhrase}</span>
                </div>
                <textarea
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-green-500 transition-colors font-serif resize-none"
                  placeholder="Type your own mantra here..."
                />
                <div className="flex gap-4 mt-3">
                   <button onClick={() => setShowText(!showText)} className="flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition-colors">
                      {showText ? <Eye size={14}/> : <EyeOff size={14}/>} {t.lblShowText}
                   </button>
                   <button onClick={() => setShowAuthor(!showAuthor)} className="flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition-colors">
                      {showAuthor ? <User size={14}/> : <UserMinus size={14}/>} {t.lblShowAuthor}
                   </button>
                   <button onClick={() => setIsNegative(!isNegative)} className="flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition-colors">
                      {isNegative ? <Sun size={14} className="text-amber-400"/> : <Moon size={14} className="text-indigo-400"/>} 
                      {isNegative ? 'Light Mode' : 'Shadow Mode'}
                   </button>
                </div>
              </section>

              {/* MOVED AI SECTION UP */}
              <section className="bg-slate-800/30 p-4 rounded-xl border border-slate-700/50">
                 <div className="flex items-center gap-2 mb-3 text-slate-200 text-sm font-medium">
                    <ImageIcon size={16} className="text-purple-400" />
                    <span>{t.lblBg}</span>
                 </div>
                 
                 <div className="grid grid-cols-4 gap-2 mb-4">
                    <button onClick={() => setArtStyle('none')} className={`h-16 rounded-md border text-[10px] flex flex-col items-center justify-center gap-1 ${artStyle === 'none' ? 'border-purple-500 bg-slate-800 text-white' : 'border-slate-700 text-slate-400'}`}><CircleOff size={14}/> Clean</button>
                    <button onClick={() => setArtStyle('vangogh')} className={`h-16 rounded-md border text-[10px] bg-gradient-to-br from-blue-900 to-yellow-600 border-slate-700 text-white shadow-sm hover:scale-105 transition-transform ${artStyle === 'vangogh' ? 'ring-2 ring-[#ff462e]' : ''}`}>Van Gogh</button>
                    <button onClick={() => setArtStyle('monet')} className={`h-16 rounded-md border text-[10px] bg-gradient-to-br from-green-300 to-pink-300 text-slate-900 border-slate-700 shadow-sm hover:scale-105 transition-transform ${artStyle === 'monet' ? 'ring-2 ring-[#ff462e]' : ''}`}>Monet</button>
                    <button onClick={() => setArtStyle('warhol')} className={`h-16 rounded-md border text-[10px] bg-gradient-to-r from-yellow-400 to-pink-500 text-slate-900 border-slate-700 shadow-sm hover:scale-105 transition-transform ${artStyle === 'warhol' ? 'ring-2 ring-[#ff462e]' : ''}`}>Pop Art</button>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1">
                      <Sparkles size={10} className="text-yellow-400" /> {t.lblAi}
                    </label>
                    <div className="flex gap-2 mb-2">
                       <button onClick={() => setAiMode('background')} className={`flex-1 text-[10px] py-1 rounded border transition-colors ${aiMode === 'background' ? 'text-white border-[rgba(255,70,46,0.7)]' : 'border-slate-700 text-slate-400 hover:text-white'}`} style={aiMode === 'background' ? { background: 'rgba(255,70,46,0.7)' } : {}}>{t.aiModeBg}</button>
                       <button onClick={() => setAiMode('full')} className={`flex-1 text-[10px] py-1 rounded border transition-colors ${aiMode === 'full' ? 'text-white border-[rgba(255,70,46,0.7)]' : 'border-slate-700 text-slate-400 hover:text-white'}`} style={aiMode === 'full' ? { background: 'rgba(255,70,46,0.7)' } : {}}>{t.aiModeFull}</button>
                    </div>
                    <div className="flex gap-2">
                       <input 
                          type="text" 
                          placeholder={t.aiPlaceholder}
                          value={aiPrompt}
                          onChange={(e) => setAiPrompt(e.target.value)}
                          className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                       />
                       <button 
                         onClick={handleAiGenerate}
                         disabled={isGeneratingAi || !aiPrompt}
                         className="disabled:opacity-50 disabled:cursor-not-allowed text-white px-3 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255,70,46,0.7)' }}
                       >
                         {isGeneratingAi ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                       </button>
                    </div>
                    <div className="flex flex-wrap gap-1">
                       {AI_PROMPTS.slice(0, 3).map(p => (
                          <button key={p} onClick={() => setAiPrompt(p)} className="text-[9px] bg-slate-900 text-slate-400 px-2 py-1 rounded-full hover:bg-slate-800 hover:text-white transition-colors border border-slate-700">
                             {p.split(' ')[0]}...
                          </button>
                       ))}
                       <button onClick={() => setAiPrompt("Elegant gold calligraphy saying 'Worthy'")} className="text-[9px] bg-slate-900 text-slate-400 px-2 py-1 rounded-full hover:bg-slate-800 hover:text-white transition-colors border border-slate-700">
                          Lettering
                       </button>
                    </div>
                 </div>
              </section>

              <section className="grid grid-cols-2 gap-4">
                 <div>
                    <div className="flex items-center gap-2 mb-2 text-slate-300 text-sm font-medium">
                       <Type size={16} className="text-slate-400" />
                       <span>{t.lblFont}</span>
                    </div>
                    <div className="flex gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 mb-2">
                      {(['serif', 'sans', 'classic', 'hand'] as FontFamily[]).map(f => (
                         <button key={f} onClick={() => setStyle({...style, font: f})} className={`flex-1 h-8 rounded flex items-center justify-center ${style.font === f ? 'bg-slate-700 text-white' : 'text-slate-500'}`}>Aa</button>
                      ))}
                    </div>
                    {/* FONT SIZE CONTROL */}
                    <div className="flex items-center gap-2 bg-slate-900 p-2 rounded-lg border border-slate-800">
                       <span className="text-[10px] text-slate-500">Size</span>
                       <input 
                         type="range" 
                         min="12" 
                         max="64" 
                         value={fontSize} 
                         onChange={(e) => setFontSize(Number(e.target.value))}
                         className="flex-1 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-slate-400"
                       />
                       <span className="text-[10px] text-slate-400 w-4 text-right">{fontSize}</span>
                    </div>
                 </div>
                 <div>
                    <div className="flex items-center gap-2 mb-2 text-slate-300 text-sm font-medium">
                       <Palette size={16} className="text-slate-400" />
                       <span>{t.lblColor}</span>
                    </div>
                    <div className="flex gap-1 justify-between bg-slate-900 p-1 rounded-lg border border-slate-800 items-center px-2 h-[42px] overflow-x-auto">
                       {(Object.keys(COLOR_MAP) as TextColor[]).map(c => (
                          <button key={c} onClick={() => setStyle({...style, color: c})} className={`w-4 h-4 rounded-full flex-shrink-0 ${style.color === c ? 'ring-2 ring-white' : ''}`} style={{ backgroundColor: c === 'black' ? '#0f172a' : c === 'slate' ? '#475569' : c === 'rose' ? '#be123c' : c === 'emerald' ? '#065f46' : c === 'violet' ? '#5b21b6' : c === 'amber' ? '#b45309' : '#ffffff' }} />
                       ))}
                    </div>
                 </div>
              </section>

              <section>
                <div className="flex items-center gap-2 mb-3 text-slate-300 text-sm font-medium">
                  <Maximize2 size={16} className="text-blue-400" />
                  <span>{t.lblDim}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {Object.values(AspectRatio).map((ratio) => (
                    <button
                      key={ratio}
                      onClick={() => setLocalAspectRatio(ratio)}
                      className={`py-2 px-1 rounded-lg text-[10px] font-medium border transition-all flex flex-col items-center justify-center gap-1
                        ${localAspectRatio === ratio 
                          ? 'bg-slate-800 text-white border-blue-500' 
                          : 'bg-slate-900/50 text-slate-400 border-slate-700 hover:border-slate-600'
                        }`}
                    >
                      {ratio === AspectRatio.STORY && <Smartphone size={12} />}
                      <span>{ratio}</span>
                    </button>
                  ))}
                </div>
              </section>

              <section>
                 <div className="flex items-center gap-2 mb-3 text-slate-300 text-sm font-medium">
                  <Frame size={16} className="text-amber-600" />
                  <span>{t.lblFrame}</span>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  <button
                    onClick={() => setFrameColor('none')}
                    className={`w-12 h-12 flex-shrink-0 rounded-full border-2 transition-all relative flex items-center justify-center ${frameColor === 'none' ? 'ring-2 ring-white scale-110' : 'opacity-70'}`}
                    style={{ backgroundColor: '#1e293b', borderColor: frameColor === 'none' ? 'white' : 'transparent' }}
                  >
                     <CircleOff size={20} className="text-slate-500" />
                  </button>
                  {(Object.keys(FRAME_STYLES).filter(f => f !== 'none') as FrameColor[]).map((fColor) => (
                    <button
                      key={fColor}
                      onClick={() => setFrameColor(fColor)}
                      className={`w-12 h-12 flex-shrink-0 rounded-full border-2 transition-all relative ${frameColor === fColor ? 'ring-2 ring-white scale-110' : 'opacity-70'}`}
                      style={{ 
                        backgroundColor: fColor === 'oak' ? '#8B4513' : fColor === 'gold' ? '#D4AF37' : fColor === 'silver' ? '#C0C0C0' : fColor === 'white' ? '#f8fafc' : '#0f172a',
                        borderColor: frameColor === fColor ? 'white' : 'transparent'
                      }}
                    />
                  ))}
                </div>
              </section>

              <section>
                 <div className="flex items-center gap-2 mb-3 text-slate-300 text-sm font-medium">
                  <Stamp size={16} className="text-rose-500" />
                  <span>{t.lblLogo}</span>
                </div>
                <div className="flex gap-2 flex-wrap">
                   {(Object.keys(LOGO_COMPONENTS) as LogoStyle[]).map(l => (
                      <button 
                        key={l}
                        onClick={() => setLogoStyle(l)}
                        className={`p-2 rounded-lg border transition-all ${logoStyle === l ? 'bg-slate-800 border-rose-500 text-white' : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-200'}`}
                      >
                         {React.cloneElement(LOGO_COMPONENTS[l] as React.ReactElement, { size: 16 })}
                      </button>
                   ))}
                </div>
              </section>

              {/* GUIDE SECTION */}
              <section className="p-4 rounded-xl" style={{ background: 'rgba(255,70,46,0.06)', border: '1px solid rgba(255,70,46,0.2)' }}>
                 <div className="flex items-center gap-2 mb-3 text-sm font-medium" style={{ color: 'rgba(255,130,100,0.9)' }}>
                    <BookOpen size={16} />
                    <span>Interpretation Guide</span>
                 </div>
                 
                 {!guideContent ? (
                    <div className="text-center py-4">
                       <p className="text-xs text-slate-400 mb-3">
                          Generate a personalized guide and practical exercise for this thought.
                       </p>
                       <button 
                          onClick={handleGenerateGuide}
                          disabled={isGeneratingGuide}
                          className="w-full py-2 text-white rounded-full text-xs font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50" style={{ background: 'rgba(255,70,46,0.6)', border: '1px solid rgba(255,70,46,0.4)' }}
                       >
                          {isGeneratingGuide ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                          Generate Guide
                       </button>
                    </div>
                 ) : (
                    <div className="space-y-3">
                       <div className="max-h-40 overflow-y-auto custom-scrollbar text-[10px] text-slate-300 leading-relaxed bg-slate-900/50 p-2 rounded border border-slate-700/50">
                          {guideContent.split('\n').map((line, i) => (
                             <p key={i} className="mb-1">{line}</p>
                          ))}
                       </div>
                       <button 
                          onClick={handleGenerateGuide}
                          disabled={isGeneratingGuide}
                          className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 text-[10px] flex items-center justify-center gap-2 transition-colors"
                       >
                          <Sparkles size={12} /> Regenerate
                       </button>
                    </div>
                 )}
              </section>

              {/* RELATED THOUGHTS */}
              {relatedThoughts.length > 0 && (
                <section className="border-t border-slate-800 pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-slate-300 text-sm font-medium">
                      <Layers size={16} className="text-blue-400" />
                      <span>{localLanguage === 'es' ? 'Pensamientos Similares' : localLanguage === 'de' ? 'Ähnliche Gedanken' : 'Similar Thoughts'}</span>
                    </div>
                    {onSearch && (
                      <button 
                        onClick={() => onSearch(thought.category)}
                        className="text-[10px] text-blue-400 hover:text-blue-300 font-bold uppercase tracking-wider"
                      >
                        {localLanguage === 'es' ? 'Ver todos' : localLanguage === 'de' ? 'Alle ansehen' : 'See all'}
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {relatedThoughts.map(th => (
                      <button
                        key={th.id}
                        onClick={() => onSelectThought?.(th)}
                        className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-600 transition-all text-left group"
                      >
                        <p className="text-[10px] text-slate-500 mb-1 font-bold uppercase tracking-tighter truncate">{th.author}</p>
                        <p className="text-[11px] text-slate-300 line-clamp-2 font-serif group-hover:text-white transition-colors">
                          {th.content[localLanguage].expansive}
                        </p>
                      </button>
                    ))}
                  </div>
                </section>
              )}

            </div>

            <div className="p-5 border-t border-slate-800 bg-[#0f172a] space-y-3">
              {/* DOWNLOAD FORMAT SELECTION */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">{t.lblFormat}</span>
                <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-800">
                   <button 
                     onClick={() => setDownloadFormat('jpg')} 
                     className={`px-3 py-1 rounded text-[10px] font-bold flex items-center gap-1 transition-colors ${downloadFormat === 'jpg' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-slate-300'}`}
                   >
                     <FileImage size={12} /> JPG
                   </button>
                   <button 
                     onClick={() => setDownloadFormat('pdf')} 
                     className={`px-3 py-1 rounded text-[10px] font-bold flex items-center gap-1 transition-colors ${downloadFormat === 'pdf' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-slate-300'}`}
                   >
                     <FileText size={12} /> PDF
                   </button>
                </div>
              </div>

              {downloadSuccess ? (
                <div className="w-full py-4 rounded-xl bg-green-500/20 text-green-400 border border-green-500/50 flex items-center justify-center gap-2 font-bold text-sm animate-pulse">
                   <Check size={18} /> {t.btnSaved}
                </div>
              ) : (
                <div className="space-y-3">
                   <button 
                     onClick={handleDownload}
                     disabled={isDownloading}
                     className="w-full py-4 rounded-full font-bold text-sm tracking-wide uppercase shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 text-pw-text border border-pw-border hover:border-[rgba(234,234,234,0.3)]" style={{ background: 'rgba(249,249,249,0.08)', fontFamily: "'Comfortaa', sans-serif" }}
                   >
                     {isDownloading ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
                     {t.btnDownload} {downloadFormat.toUpperCase()}
                   </button>
                   
                   {/* BUY THIS THOUGHT */}
                   <button
                     onClick={async () => {
                       if (!onOpenPurchase || !thought || !printRef.current) return;
                       setIsDownloading(true);
                       try {
                         // Render the design div to a real canvas with html2canvas
                         const canvas = await html2canvas(printRef.current, {
                           useCORS: true,
                           scale: 3,           // high quality for print
                           backgroundColor: null,
                         });
                         const imageUrl = canvas.toDataURL('image/jpeg', 0.92);
                         onOpenPurchase(thought, imageUrl);
                         onClose();
                       } catch {
                         // fallback: open shop without image (shows "design first" message)
                         onOpenPurchase(thought, '');
                         onClose();
                       } finally {
                         setIsDownloading(false);
                       }
                     }}
                     disabled={isDownloading}
                     className="w-full py-4 rounded-full font-bold text-sm tracking-wide uppercase shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 text-white disabled:opacity-60"
                     style={{ background: 'rgba(255,70,46,0.15)', border: '1px solid rgba(255,70,46,0.45)', fontFamily: "'Comfortaa', sans-serif" }}
                   >
                     {isDownloading ? <Loader2 size={18} className="animate-spin" /> : <ShoppingBag size={18} />}
                     {isDownloading ? 'Preparing artwork…' : 'Order This on a Product'}
                   </button>

                   {/* Donation Button */}
                   <a 
                     href="https://ko-fi.com" // Placeholder
                     target="_blank"
                     rel="noopener noreferrer"
                     className="block w-full py-2 text-center text-xs text-slate-400 hover:text-white transition-colors border border-slate-800 rounded-lg hover:bg-slate-800"
                   >
                      ♥ Donate to support this project
                   </a>
                </div>
              )}
            </div>

          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Modal;