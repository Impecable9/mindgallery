import React from 'react';
import { CategoryType, Thought, ThemeConfig, TextColor, FrameColor, LogoStyle, ArtStyle, Language } from './types';
import { Heart, DollarSign, Zap, Crown, Star, Infinity, Feather, CircleOff, BookOpen, Cpu, Shield, Users, Scale } from 'lucide-react';
import { ADDITIONAL_THOUGHTS } from './src/data/thoughts';
import { ADDITIONAL_THOUGHTS_2 } from './src/data/thoughts_2';
import { POLITICAL_AI_THOUGHTS } from './src/data/political_ai_thoughts';
import { BULK_THOUGHTS_1 } from './src/data/bulk_thoughts_1';
import { BULK_THOUGHTS_2 } from './src/data/bulk_thoughts_2';
import { BULK_THOUGHTS_3 } from './src/data/bulk_thoughts_3';
import { EMOTIONS_THOUGHTS } from './src/data/emotions_thoughts';

export const UI_TRANSLATIONS = {
  en: {
    navTitle: "MindGallery",
    navGuide: "Guide",
    navGallery: "Gallery",
    navRoulette: "Oracle",
    heroTitlePos: "Expand Your Horizon",
    heroTitleNeg: "Confront Your Limits",
    heroSubPos: "Visualize the Light",
    heroSubNeg: "Visualize the Shadow",
    heroDescPos: "See how your thoughts transform your space. MindGallery allows you to collect and customize affirmations.",
    heroDescNeg: "Acknowledge the shadow to bring in the light. See how limiting beliefs look before you transform them.",
    filterAll: "All",
    emptyState: "No thoughts found in this dimension.",
    modalTitle: "Studio Editor",
    modalCustomize: "Customize",
    lblPhrase: "Your Phrase",
    lblDim: "Dimensions",
    lblFrame: "Frame Material",
    lblFont: "Font & Size",
    lblColor: "Color",
    lblBg: "Background & Lettering (AI)",
    lblAi: "AI Generator",
    lblLogo: "Signature Logo",
    lblShowAuthor: "Show Author",
    lblShowText: "Show Text",
    lblAiMode: "Mode",
    aiModeBg: "Background",
    aiModeFull: "Full Image",
    lblFormat: "Download Format",
    btnDownload: "Download",
    btnPremium: "Purchase & Download",
    btnSaved: "Downloading...",
    aiPlaceholder: "Describe mood, art, or 'Neon Lettering'...",
    aiBtn: "Generate",
    rouletteTitle: "The Daily Oracle",
    rouletteSub: "Let fate decide your focus today. Will you face the Shadow or embrace the Light?",
    rouletteSpin: "Spin the Wheel",
    rouletteSpinning: "Divining...",
    rouletteResultShadow: "Shadow Work",
    rouletteResultLight: "Expansive Light",
    rouletteOpen: "Open in Studio",
    cat: {
      [CategoryType.SELF_ESTEEM]: "Self-Esteem",
      [CategoryType.ABUNDANCE]: "Abundance",
      [CategoryType.RELATIONSHIPS]: "Relationships",
      [CategoryType.PRODUCTIVITY]: "Productivity",
      [CategoryType.BIBLICAL]: "Biblical Wisdom",
      [CategoryType.EMOTIONS]: "Emotions",
      [CategoryType.AI]: "AI Thought",
      [CategoryType.RIGHT]: "Right-wing",
      [CategoryType.LEFT]: "Left-wing",
      [CategoryType.NEUTRAL]: "Neutral",
    },
    demoThoughtPos: "I am complete exactly as I am.",
    demoThoughtNeg: "I am not enough.",
    demoSubPos: "Expansive Thought",
    demoSubNeg: "Limiting Belief",
    navSearch: "Search",
    navChat: "Oracle Chat",
    navLogin: "Login with Google",
    navLogout: "Logout",
    navAddThought: "Add Thought",
    lblSearchPlaceholder: "Search thoughts...",
    lblChatPlaceholder: "Ask the Oracle...",
    lblAddThoughtTitle: "Add Your Thought",
    lblAddThoughtLimiting: "Limiting Belief",
    lblAddThoughtExpansive: "Expansive Thought",
    lblAddThoughtCategory: "Category",
    btnSave: "Save",
    msgLoginRequired: "Please login to add thoughts.",
    chatWelcome: "Welcome to the Oracle Chat. Ask me anything about your thoughts and transformation.",
    heroSlides: [
      { title: "Oracle Chat", desc: "Talk to the Oracle and transform your limiting beliefs." },
      { title: "Smart Search", desc: "Find thoughts that resonate with your current state." },
      { title: "The Oracle", desc: "Let fate decide your focus with our daily oracle." },
      { title: "Save Progress", desc: "Login with Google to save your own thoughts and progress." },
      { title: "Concept Guide", desc: "Master the art of thought transformation with our guide." }
    ],
  },
  es: {
    navTitle: "GaleríaMental",
    navGuide: "Guía",
    navGallery: "Galería",
    navRoulette: "Oráculo",
    heroTitlePos: "Expande tu Horizonte",
    heroTitleNeg: "Enfronta tus Límites",
    heroSubPos: "Visualiza la Luz",
    heroSubNeg: "Visualiza la Sombra",
    heroDescPos: "Mira cómo tus pensamientos transforman tu espacio. Colecciona y personaliza afirmaciones.",
    heroDescNeg: "Reconoce la sombra para traer la luz. Observa las creencias limitantes antes de transformarlas.",
    filterAll: "Todos",
    emptyState: "No se encontraron pensamientos en esta dimensión.",
    modalTitle: "Estudio de Edición",
    modalCustomize: "Personalizar",
    lblPhrase: "Tu Frase",
    lblDim: "Dimensiones",
    lblFrame: "Material del Marco",
    lblFont: "Tipografía y Tamaño",
    lblColor: "Color",
    lblBg: "Fondo y Arte (IA)",
    lblAi: "Generador IA",
    lblLogo: "Logo Firma",
    lblShowAuthor: "Mostrar Autor",
    lblShowText: "Mostrar Texto",
    lblAiMode: "Modo",
    aiModeBg: "Fondo",
    aiModeFull: "Imagen Completa",
    lblFormat: "Formato de Descarga",
    btnDownload: "Descargar",
    btnPremium: "Comprar y Descargar",
    btnSaved: "Descargando...",
    aiPlaceholder: "Describe el arte o 'Texto Neón'...",
    aiBtn: "Generar",
    rouletteTitle: "El Oráculo Diario",
    rouletteSub: "Deja que el destino decida. ¿Enfrentarás la Sombra o abrazarás la Luz?",
    rouletteSpin: "Girar la Rueda",
    rouletteSpinning: "Adivinando...",
    rouletteResultShadow: "Trabajo de Sombra",
    rouletteResultLight: "Luz Expansiva",
    rouletteOpen: "Abrir en Estudio",
    cat: {
      [CategoryType.SELF_ESTEEM]: "Autoestima",
      [CategoryType.ABUNDANCE]: "Abundancia",
      [CategoryType.RELATIONSHIPS]: "Relaciones",
      [CategoryType.PRODUCTIVITY]: "Productividad",
      [CategoryType.BIBLICAL]: "Sabiduría Bíblica",
      [CategoryType.EMOTIONS]: "Emociones",
      [CategoryType.AI]: "Pensamiento IA",
      [CategoryType.RIGHT]: "Derecha",
      [CategoryType.LEFT]: "Izquierda",
      [CategoryType.NEUTRAL]: "Neutral",
    },
    demoThoughtPos: "Soy completo exactamente como soy.",
    demoThoughtNeg: "No soy suficiente.",
    demoSubPos: "Pensamiento Expansivo",
    demoSubNeg: "Creencia Limitante",
    navSearch: "Buscar",
    navChat: "Chat del Oráculo",
    navLogin: "Iniciar sesión con Google",
    navLogout: "Cerrar sesión",
    navAddThought: "Añadir Pensamiento",
    lblSearchPlaceholder: "Buscar pensamientos...",
    lblChatPlaceholder: "Pregunta al Oráculo...",
    lblAddThoughtTitle: "Añade tu Pensamiento",
    lblAddThoughtLimiting: "Creencia Limitante",
    lblAddThoughtExpansive: "Pensamiento Expansivo",
    lblAddThoughtCategory: "Categoría",
    btnSave: "Guardar",
    msgLoginRequired: "Por favor, inicia sesión para añadir pensamientos.",
    chatWelcome: "Bienvenido al Chat del Oráculo. Pregúntame cualquier cosa sobre tus pensamientos y transformación.",
    heroSlides: [
      { title: "Chat del Oráculo", desc: "Habla con el Oráculo y transforma tus creencias limitantes." },
      { title: "Búsqueda Inteligente", desc: "Encuentra pensamientos que resuenen con tu estado actual." },
      { title: "El Oráculo", desc: "Deja que el destino decida tu enfoque con nuestro oráculo diario." },
      { title: "Guarda tu Progreso", desc: "Inicia sesión con Google para guardar tus propios pensamientos." },
      { title: "Guía de Conceptos", desc: "Domina el arte de la transformación del pensamiento con nuestra guía." }
    ],
  },
  de: {
    navTitle: "Gedankengalerie",
    navGuide: "Anleitung",
    navGallery: "Galerie",
    navRoulette: "Orakel",
    heroTitlePos: "Erweitere deinen Horizont",
    heroTitleNeg: "Konfrontiere deine Grenzen",
    heroSubPos: "Visualisiere das Licht",
    heroSubNeg: "Visualisiere den Schatten",
    heroDescPos: "Sieh, wie deine Gedanken deinen Raum verändern. MindGallery ermöglicht es dir, Affirmationen zu sammeln.",
    heroDescNeg: "Erkenne den Schatten an, um das Licht hereinzulassen. Betrachte limitierende Glaubenssätze.",
    filterAll: "Alle",
    emptyState: "Keine Gedanken in dieser Dimension gefunden.",
    modalTitle: "Atelier-Editor",
    modalCustomize: "Anpassen",
    lblPhrase: "Dein Satz",
    lblDim: "Abmessungen",
    lblFrame: "Rahmenmaterial",
    lblFont: "Schriftart & Größe",
    lblColor: "Farbe",
    lblBg: "Hintergrund & Kunst (KI)",
    lblAi: "KI-Generator",
    lblLogo: "Signatur-Logo",
    lblShowAuthor: "Autor anzeigen",
    lblShowText: "Text anzeigen",
    lblAiMode: "Modus",
    aiModeBg: "Hintergrund",
    aiModeFull: "Vollbild",
    lblFormat: "Download-Format",
    btnDownload: "Herunterladen",
    btnPremium: "Kaufen & Laden",
    btnSaved: "Wird geladen...",
    aiPlaceholder: "Beschreibe Stimmung, Kunst...",
    aiBtn: "Generieren",
    rouletteTitle: "Das Tägliche Orakel",
    rouletteSub: "Lass das Schicksal entscheiden. Schatten oder Licht?",
    rouletteSpin: "Rad drehen",
    rouletteSpinning: "Wahrsagen...",
    rouletteResultShadow: "Schattenarbeit",
    rouletteResultLight: "Expansives Licht",
    rouletteOpen: "Im Atelier öffnen",
    cat: {
      [CategoryType.SELF_ESTEEM]: "Selbstwertgefühl",
      [CategoryType.ABUNDANCE]: "Reichtum",
      [CategoryType.RELATIONSHIPS]: "Beziehungen",
      [CategoryType.PRODUCTIVITY]: "Produktivität",
      [CategoryType.BIBLICAL]: "Biblische Weisheit",
      [CategoryType.EMOTIONS]: "Emotionen",
      [CategoryType.AI]: "KI-Gedanke",
      [CategoryType.RIGHT]: "Rechts",
      [CategoryType.LEFT]: "Links",
      [CategoryType.NEUTRAL]: "Neutral",
    },
    demoThoughtPos: "Ich bin vollkommen, genau wie ich bin.",
    demoThoughtNeg: "Ich bin nicht gut genug.",
    demoSubPos: "Expansiver Gedanke",
    demoSubNeg: "Limitierender Glaube",
    navSearch: "Suche",
    navChat: "Orakel-Chat",
    navLogin: "Mit Google anmelden",
    navLogout: "Abmelden",
    navAddThought: "Gedanken hinzufügen",
    lblSearchPlaceholder: "Gedanken suchen...",
    lblChatPlaceholder: "Frag das Orakel...",
    lblAddThoughtTitle: "Füge deinen Gedanken hinzu",
    lblAddThoughtLimiting: "Limitierender Glaube",
    lblAddThoughtExpansive: "Expansiver Gedanke",
    lblAddThoughtCategory: "Kategorie",
    btnSave: "Speichern",
    msgLoginRequired: "Bitte melden Sie sich an, um Gedanken hinzuzufügen.",
    chatWelcome: "Willkommen beim Orakel-Chat. Fragen Sie mich alles über Ihre Gedanken und Transformation.",
    heroSlides: [
      { title: "Orakel-Chat", desc: "Sprechen Sie mit dem Orakel und transformieren Sie Ihre Überzeugungen." },
      { title: "Intelligente Suche", desc: "Finden Sie Gedanken, die Ihren aktuellen Zustand widerspiegeln." },
      { title: "Das Orakel", desc: "Lassen Sie das Schicksal mit unserem täglichen Orakel entscheiden." },
      { title: "Fortschritt speichern", desc: "Melden Sie sich mit Google an, um Ihre Gedanken zu speichern." },
      { title: "Konzept-Leitfaden", desc: "Meistern Sie die Kunst der Gedankentransformation mit unserem Guide." }
    ],
  }
};

export const CATEGORY_THEMES: Record<CategoryType, ThemeConfig> = {
  [CategoryType.SELF_ESTEEM]: {
    gradient: 'from-rose-500/20 to-orange-500/20',
    accent: 'text-rose-600',
    icon: <Crown className="w-5 h-5" />,
  },
  [CategoryType.ABUNDANCE]: {
    gradient: 'from-emerald-500/20 to-teal-500/20',
    accent: 'text-emerald-600',
    icon: <DollarSign className="w-5 h-5" />,
  },
  [CategoryType.RELATIONSHIPS]: {
    gradient: 'from-violet-500/20 to-fuchsia-500/20',
    accent: 'text-violet-600',
    icon: <Heart className="w-5 h-5" />,
  },
  [CategoryType.PRODUCTIVITY]: {
    gradient: 'from-blue-500/20 to-cyan-500/20',
    accent: 'text-blue-600',
    icon: <Zap className="w-5 h-5" />,
  },
  [CategoryType.BIBLICAL]: {
    gradient: 'from-amber-200/20 to-yellow-600/20',
    accent: 'text-amber-700',
    icon: <BookOpen className="w-5 h-5" />,
  },
  [CategoryType.EMOTIONS]: {
    gradient: 'from-pink-300/20 to-purple-400/20',
    accent: 'text-pink-600',
    icon: <Heart className="w-5 h-5" />,
  },
  [CategoryType.AI]: {
    gradient: 'from-cyan-500/20 to-blue-500/20',
    accent: 'text-cyan-600',
    icon: <Cpu className="w-5 h-5" />,
  },
  [CategoryType.RIGHT]: {
    gradient: 'from-blue-700/20 to-blue-900/20',
    accent: 'text-blue-800',
    icon: <Shield className="w-5 h-5" />,
  },
  [CategoryType.LEFT]: {
    gradient: 'from-red-500/20 to-red-700/20',
    accent: 'text-red-600',
    icon: <Users className="w-5 h-5" />,
  },
  [CategoryType.NEUTRAL]: {
    gradient: 'from-gray-400/20 to-gray-600/20',
    accent: 'text-gray-600',
    icon: <Scale className="w-5 h-5" />,
  },
};

export const COLOR_MAP: Record<TextColor, string> = {
  black: 'text-slate-900',
  slate: 'text-slate-600',
  rose: 'text-rose-700',
  emerald: 'text-emerald-800',
  violet: 'text-violet-800',
  amber: 'text-amber-700',
  white: 'text-white',
};

export const FRAME_STYLES: Record<FrameColor, string> = {
  black: 'border-slate-900 bg-slate-900',
  white: 'border-white bg-white',
  oak: 'border-[#8B4513] bg-[#8B4513]',
  gold: 'border-[#D4AF37] bg-[#D4AF37]',
  silver: 'border-[#C0C0C0] bg-[#C0C0C0]',
  none: 'border-transparent bg-transparent',
};

export const LOGO_COMPONENTS: Record<LogoStyle, React.ReactNode> = {
  crown: <Crown size={20} strokeWidth={1.5} />,
  star: <Star size={20} strokeWidth={1.5} />,
  heart: <Heart size={20} strokeWidth={1.5} />,
  infinity: <Infinity size={20} strokeWidth={1.5} />,
  feather: <Feather size={20} strokeWidth={1.5} />,
  none: <CircleOff size={20} strokeWidth={1.5} className="opacity-20" />,
};

export const ART_STYLES_CSS: Record<ArtStyle, string> = {
  none: 'bg-white',
  vangogh: 'bg-[radial-gradient(circle_at_center,_#1e3a8a,_#fbbf24,_#1e3a8a)] bg-[length:20px_20px] backdrop-blur-[1px]',
  monet: 'bg-gradient-to-br from-green-200 via-blue-200 to-pink-200 opacity-80',
  warhol: 'bg-gradient-to-r from-yellow-300 via-pink-500 to-cyan-400 opacity-50 contrast-125',
  abstract: 'bg-[url("https://www.transparenttextures.com/patterns/cubes.png")] bg-slate-100',
  ai_generated: '', 
};

export const AI_PROMPTS = [
  "Dreamy clouds at sunset in pastel colors",
  "Cyberpunk city neon lights reflection",
  "Zen garden with flowing water textures",
  "Golden geometric patterns on black marble"
];

// --- CONTENT GENERATION ---

const createThoughts = (category: CategoryType, rawData: [string, string, string][], translations?: any[]): Thought[] => {
  return rawData.map((item, index) => {
    // Check if we have a specific manual translation for this index
    const manualTrans = translations ? translations[index] : null;

    return {
      id: `${category.substring(0, 3).toLowerCase()}-${index}`,
      category,
      // Structure holding all languages
      content: {
        en: { limiting: item[0], expansive: item[1] },
        // Fallback to English if translation is missing, instead of appending (ES)/(DE)
        es: manualTrans ? manualTrans.es : { limiting: item[0], expansive: item[1] },
        de: manualTrans ? manualTrans.de : { limiting: item[0], expansive: item[1] }
      },
      // Keep backwards compatibility helpers
      limitingBelief: item[0],
      expansiveThought: item[1],
      
      author: item[2],
      visualDescription: "Abstract art representing transformation.",
      isPremium: index % 3 === 0, 
      likes: Math.floor(Math.random() * 5000) + 100
    };
  });
};

// --- DATA & TRANSLATIONS ---

const SELF_ESTEEM_RAW: [string, string, string][] = [
  ["I am not enough.", "I am complete exactly as I am.", "Marisa Peer"],
  ["I need to be perfect.", "Done is better than perfect.", "Sheryl Sandberg"],
  ["I am broken.", "There is a crack in everything, that's how the light gets in.", "Leonard Cohen"],
  ["I don't deserve happiness.", "I am worthy of all the good life has to offer.", "Louise Hay"],
  ["I am invisible.", "I have the power to be seen and heard.", "Malala Yousafzai"],
  ["My past defines me.", "I am not what happened to me, I am what I choose to become.", "Carl Jung"],
];
const SELF_ESTEEM_TRANS = [
  { es: { limiting: "No soy suficiente.", expansive: "Soy completo exactamente como soy." }, de: { limiting: "Ich bin nicht gut genug.", expansive: "Ich bin vollkommen, genau wie ich bin." } },
  { es: { limiting: "Necesito ser perfecto.", expansive: "Hecho es mejor que perfecto." }, de: { limiting: "Ich muss perfekt sein.", expansive: "Erledigt ist besser als perfekt." } },
  { es: { limiting: "Estoy roto.", expansive: "Hay una grieta en todo, así entra la luz." }, de: { limiting: "Ich bin zerbrochen.", expansive: "Es gibt in allem einen Riss, so kommt das Licht herein." } },
  { es: { limiting: "No merezco la felicidad.", expansive: "Soy digno de todo lo bueno." }, de: { limiting: "Ich verdiene kein Glück.", expansive: "Ich bin alles Gute wert." } },
  { es: { limiting: "Soy invisible.", expansive: "Tengo el poder de ser visto." }, de: { limiting: "Ich bin unsichtbar.", expansive: "Ich habe die Kraft, gesehen zu werden." } },
  { es: { limiting: "Mi pasado me define.", expansive: "Elijo en quién me convierto." }, de: { limiting: "Meine Vergangenheit definiert mich.", expansive: "Ich wähle, wer ich werde." } }
];

const ABUNDANCE_RAW: [string, string, string][] = [
  ["Money is evil.", "Money is a tool for doing good.", "Unknown"],
  ["Rich people are greedy.", "Abundance allows me to help others.", "Unknown"],
  ["I will never be rich.", "Wealth is a mindset.", "Unknown"],
  ["Money is hard to get.", "Opportunities are everywhere.", "Unknown"],
];
const ABUNDANCE_TRANS = [
  { es: { limiting: "El dinero es malo.", expansive: "El dinero es una herramienta para hacer el bien." }, de: { limiting: "Geld ist böse.", expansive: "Geld ist ein Werkzeug, um Gutes zu tun." } },
  { es: { limiting: "Los ricos son codiciosos.", expansive: "La abundancia me permite ayudar a otros." }, de: { limiting: "Reiche Leute sind gierig.", expansive: "Überfluss erlaubt es mir, anderen zu helfen." } },
  { es: { limiting: "Nunca seré rico.", expansive: "La riqueza es una mentalidad." }, de: { limiting: "Ich werde nie reich sein.", expansive: "Reichtum ist eine Einstellung." } },
  { es: { limiting: "El dinero es difícil.", expansive: "Las oportunidades están en todas partes." }, de: { limiting: "Geld ist schwer zu bekommen.", expansive: "Chancen sind überall." } }
];

const RELATIONSHIPS_RAW: [string, string, string][] = [
  ["I am unlovable.", "I am deserving of deep love.", "Unknown"],
  ["Everyone leaves.", "The right people stay.", "Unknown"],
  ["Trust no one.", "I choose to trust wisely.", "Unknown"],
  ["Love hurts.", "Love heals.", "Unknown"],
];
const RELATIONSHIPS_TRANS = [
  { es: { limiting: "No soy digno de amor.", expansive: "Merezco un amor profundo." }, de: { limiting: "Ich bin nicht liebenswert.", expansive: "Ich verdiene tiefe Liebe." } },
  { es: { limiting: "Todos se van.", expansive: "Las personas correctas se quedan." }, de: { limiting: "Alle gehen weg.", expansive: "Die richtigen Menschen bleiben." } },
  { es: { limiting: "No confíes en nadie.", expansive: "Elijo confiar sabiamente." }, de: { limiting: "Vertraue niemandem.", expansive: "Ich entscheide mich, weise zu vertrauen." } },
  { es: { limiting: "El amor duele.", expansive: "El amor sana." }, de: { limiting: "Liebe tut weh.", expansive: "Liebe heilt." } }
];

const PRODUCTIVITY_RAW: [string, string, string][] = [
  ["I am lazy.", "I am taking necessary rest.", "Unknown"],
  ["I procrastinate.", "I take inspired action.", "Unknown"],
  ["I am disorganized.", "I create systems that work for me.", "Unknown"],
  ["I am overwhelmed.", "I take one step at a time.", "Unknown"],
];
const PRODUCTIVITY_TRANS = [
  { es: { limiting: "Soy perezoso.", expansive: "Estoy tomando el descanso necesario." }, de: { limiting: "Ich bin faul.", expansive: "Ich nehme mir die nötige Ruhe." } },
  { es: { limiting: "Procrastino.", expansive: "Tomo acción inspirada." }, de: { limiting: "Ich schiebe auf.", expansive: "Ich handle inspiriert." } },
  { es: { limiting: "Soy desorganizado.", expansive: "Creo sistemas que funcionan." }, de: { limiting: "Ich bin unorganisiert.", expansive: "Ich erstelle Systeme, die funktionieren." } },
  { es: { limiting: "Estoy abrumado.", expansive: "Doy un paso a la vez." }, de: { limiting: "Ich bin überfordert.", expansive: "Ich mache einen Schritt nach dem anderen." } }
];

const BIBLICAL_RAW: [string, string, string][] = [
  ["I am fearful.", "For God has not given us a spirit of fear, but of power and of love and of a sound mind.", "2 Timothy 1:7"],
  ["I am weak.", "I can do all things through Christ who strengthens me.", "Philippians 4:13"],
  ["I am alone.", "Be strong and courageous... for the Lord your God goes with you; he will never leave you nor forsake you.", "Deuteronomy 31:6"],
];
const BIBLICAL_TRANS = [
  { es: { limiting: "Tengo miedo.", expansive: "Porque no nos ha dado Dios espíritu de cobardía, sino de poder..." }, de: { limiting: "Ich habe Angst.", expansive: "Denn Gott hat uns nicht gegeben den Geist der Furcht..." } },
  { es: { limiting: "Soy débil.", expansive: "Todo lo puedo en Cristo que me fortalece." }, de: { limiting: "Ich bin schwach.", expansive: "Ich vermag alles durch den, der mich mächtig macht." } },
  { es: { limiting: "Estoy solo.", expansive: "Sé fuerte y valiente... el Señor va contigo." }, de: { limiting: "Ich bin allein.", expansive: "Sei stark und mutig... der Herr geht mit dir." } }
];

export const THOUGHTS_DATA: Thought[] = [
  ...createThoughts(CategoryType.SELF_ESTEEM, SELF_ESTEEM_RAW, SELF_ESTEEM_TRANS),
  ...createThoughts(CategoryType.ABUNDANCE, ABUNDANCE_RAW, ABUNDANCE_TRANS),
  ...createThoughts(CategoryType.RELATIONSHIPS, RELATIONSHIPS_RAW, RELATIONSHIPS_TRANS),
  ...createThoughts(CategoryType.PRODUCTIVITY, PRODUCTIVITY_RAW, PRODUCTIVITY_TRANS),
  ...createThoughts(CategoryType.BIBLICAL, BIBLICAL_RAW, BIBLICAL_TRANS),
  ...EMOTIONS_THOUGHTS,
  ...POLITICAL_AI_THOUGHTS,
  ...ADDITIONAL_THOUGHTS,
  ...ADDITIONAL_THOUGHTS_2,
  ...BULK_THOUGHTS_1,
  ...BULK_THOUGHTS_2,
  ...BULK_THOUGHTS_3,
];