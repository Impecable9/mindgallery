import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Sparkles, Loader2 } from 'lucide-react';
import { CategoryType, Language } from '../types';
import { UI_TRANSLATIONS } from '../constants';

interface AddThoughtModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  isNegativeMode: boolean;
  onSuccess: () => void;
}

const AddThoughtModal: React.FC<AddThoughtModalProps> = ({ isOpen, onClose, language, isNegativeMode, onSuccess }) => {
  const [limiting, setLimiting] = useState('');
  const [expansive, setExpansive] = useState('');
  const [category, setCategory] = useState<CategoryType>(CategoryType.SELF_ESTEEM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const t = UI_TRANSLATIONS[language];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!limiting || !expansive || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/thoughts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          content: {
            en: { limiting, expansive },
            es: { limiting, expansive },
            de: { limiting, expansive },
          },
          limitingBelief: limiting,
          expansiveThought: expansive,
        }),
      });

      if (res.ok) {
        onSuccess();
        setLimiting('');
        setExpansive('');
      }
    } catch (error) {
      console.error("Failed to add thought", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-2xl"
      />
      
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className={`relative w-full max-w-lg rounded-[2.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.8)] overflow-hidden border backdrop-blur-3xl transition-all duration-500 ${
          isNegativeMode 
            ? 'bg-[#090909]/60 border-[rgba(255,255,255,0.08)]' 
            : 'bg-white/70 border-white/60'
        }`}
      >
        <div className={`p-8 border-b flex items-center justify-between ${isNegativeMode ? 'border-[rgba(255,255,255,0.08)] bg-white/5' : 'border-black/5 bg-black/5'}`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg ${isNegativeMode ? 'bg-[#ff462e]' : 'bg-[#ff462e]'}`}>
              <Plus className="text-white" size={20} />
            </div>
            <div>
              <h3 className={`text-xl font-serif font-bold ${isNegativeMode ? 'text-white' : 'text-slate-900'}`}>
                {t.lblAddThoughtTitle}
              </h3>
              <p className={`text-[10px] uppercase tracking-[2px] font-bold opacity-50 ${isNegativeMode ? 'text-white' : 'text-slate-900'}`}>New Creation</p>
            </div>
          </div>
          <button onClick={onClose} className={`p-2 rounded-full transition-all group ${isNegativeMode ? 'hover:bg-white/10' : 'hover:bg-black/5'}`}>
            <X size={20} className={`transition-transform group-hover:rotate-90 ${isNegativeMode ? 'text-gray-400' : 'text-slate-500'}`} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className={`block text-xs font-bold uppercase tracking-widest mb-2 opacity-60 ${isNegativeMode ? 'text-white' : 'text-slate-900'}`}>
              {t.lblAddThoughtCategory}
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as CategoryType)}
              className={`w-full px-5 py-4 rounded-2xl border focus:ring-2 focus:ring-[#ff462e]/30 focus:outline-none transition-all backdrop-blur-md appearance-none ${
                isNegativeMode ? 'bg-white/5 border-[rgba(255,255,255,0.08)] text-white' : 'bg-black/5 border-black/10 text-slate-800'
              }`}
            >
              {Object.values(CategoryType).map(cat => (
                <option key={cat} value={cat}>{t.cat[cat]}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={`block text-xs font-bold uppercase tracking-widest mb-2 opacity-60 ${isNegativeMode ? 'text-white' : 'text-slate-900'}`}>
              {t.lblAddThoughtLimiting}
            </label>
            <textarea
              value={limiting}
              onChange={(e) => setLimiting(e.target.value)}
              placeholder="e.g. I am not good enough..."
              className={`w-full px-5 py-4 rounded-2xl border focus:ring-2 focus:ring-[#ff462e]/30 focus:outline-none transition-all min-h-[100px] shadow-inner backdrop-blur-md ${
                isNegativeMode ? 'bg-white/5 border-[rgba(255,255,255,0.08)] text-white' : 'bg-black/5 border-black/10 text-slate-800'
              }`}
            />
          </div>

          <div>
            <label className={`block text-xs font-bold uppercase tracking-widest mb-2 opacity-60 ${isNegativeMode ? 'text-white' : 'text-slate-900'}`}>
              {t.lblAddThoughtExpansive}
            </label>
            <textarea
              value={expansive}
              onChange={(e) => setExpansive(e.target.value)}
              placeholder="e.g. I am worthy of all good things..."
              className={`w-full px-5 py-4 rounded-2xl border focus:ring-2 focus:ring-[#ff462e]/30 focus:outline-none transition-all min-h-[100px] shadow-inner backdrop-blur-md ${
                isNegativeMode ? 'bg-white/5 border-[rgba(255,255,255,0.08)] text-white' : 'bg-black/5 border-black/10 text-slate-800'
              }`}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !limiting || !expansive}
            className={`w-full py-5 rounded-2xl font-bold uppercase tracking-[3px] text-xs flex items-center justify-center gap-2 transition-all shadow-xl hover:scale-[1.02] active:scale-[0.98] ${
              isSubmitting || !limiting || !expansive
                ? 'bg-gray-500/20 text-gray-400 cursor-not-allowed border border-white/5'
                : 'bg-[#ff462e] hover:bg-[#c4321e] text-white shadow-[#ff462e]/20 hover:shadow-[#ff462e]/40'
            }`}
          >
            {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={18} />}
            {t.btnSave}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default AddThoughtModal;
