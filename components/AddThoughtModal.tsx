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
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className={`relative w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border ${
          isNegativeMode ? 'bg-slate-900 border-white/10' : 'bg-white border-white/20'
        }`}
      >
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
              <Plus className="text-white" size={18} />
            </div>
            <h3 className={`text-xl font-serif font-bold ${isNegativeMode ? 'text-white' : 'text-slate-800'}`}>
              {t.lblAddThoughtTitle}
            </h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X size={20} className={isNegativeMode ? 'text-gray-400' : 'text-slate-400'} />
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
              className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:outline-none transition-all ${
                isNegativeMode ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
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
              className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:outline-none transition-all min-h-[80px] ${
                isNegativeMode ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
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
              className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:outline-none transition-all min-h-[80px] ${
                isNegativeMode ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !limiting || !expansive}
            className={`w-full py-4 rounded-xl font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
              isSubmitting || !limiting || !expansive
                ? 'bg-gray-500/20 text-gray-500 cursor-not-allowed'
                : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20'
            }`}
          >
            {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
            {t.btnSave}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default AddThoughtModal;
