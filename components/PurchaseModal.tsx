import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Truck, Globe, Info, CreditCard, ChevronRight, Loader2 } from 'lucide-react';
import { Thought, Language } from '../types';
import { UI_TRANSLATIONS } from '../constants';

interface PurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  thought: Thought | null;
  language: Language;
}

const PRINTS_CONFIG = [
  { id: 'GLOBAL-FAP-A4', size: 'A4 (21 x 29.7 cm)', price: 29.00 },
  { id: 'GLOBAL-FAP-A3', size: 'A3 (29.7 x 42 cm)', price: 39.00 },
  { id: 'GLOBAL-FAP-A2', size: 'A2 (42 x 59.4 cm)', price: 55.00 },
  { id: 'GLOBAL-FAP-A1', size: 'A1 (59.4 x 84.1 cm)', price: 79.00 },
];

const COUNTRIES = [
  { code: 'ES', name: 'España' },
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'MX', name: 'México' },
  { code: 'DE', name: 'Deutschland' },
  { code: 'FR', name: 'France' },
  { code: 'IT', name: 'Italia' },
  { code: 'AR', name: 'Argentina' },
  { code: 'CL', name: 'Chile' },
  { code: 'CO', name: 'Colombia' },
];

const PurchaseModal: React.FC<PurchaseModalProps> = ({ isOpen, onClose, thought, language }) => {
  const [selectedSku, setSelectedSku] = useState(PRINTS_CONFIG[1].id);
  const [selectedCountry, setSelectedCountry] = useState('ES');
  const [shippingQuote, setShippingQuote] = useState<any>(null);
  const [loadingQuote, setLoadingQuote] = useState(false);
  const [loadingCheckout, setLoadingCheckout] = useState(false);

  const t = UI_TRANSLATIONS[language];
  const selectedProduct = PRINTS_CONFIG.find(p => p.id === selectedSku) || PRINTS_CONFIG[1];

  useEffect(() => {
    if (isOpen && selectedSku && selectedCountry) {
      fetchQuote();
    }
  }, [isOpen, selectedSku, selectedCountry]);

  const fetchQuote = async () => {
    setLoadingQuote(true);
    try {
      const res = await fetch('/api/shipping/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ countryCode: selectedCountry, sku: selectedSku }),
      });
      if (res.ok) {
        const data = await res.json();
        // Prodigi returns multiple options, we take the standard one
        const quote = data.quotes[0];
        setShippingQuote(quote);
      }
    } catch (e) {
      console.error("Quote fetch failed", e);
    } finally {
      setLoadingQuote(false);
    }
  };

  const handleCheckout = async () => {
    if (!thought || !shippingQuote) return;
    setLoadingCheckout(true);
    try {
      // For demo purposes, we'll use a snapshot of the current canvas or a placeholder
      // In a real app, you'd generate the high-res image here or pass a specific URL
      const res = await fetch('/api/checkout/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          thoughtId: thought.id,
          sku: selectedSku,
          price: selectedProduct.price,
          shippingPrice: parseFloat(shippingQuote.costValue),
          countryCode: selectedCountry,
          imageUrl: 'https://via.placeholder.com/1200x1200.png?text=Mind+Gallery+Print', // Placeholder
        }),
      });
      if (res.ok) {
        const { url } = await res.json();
        window.location.href = url;
      }
    } catch (e) {
      console.error("Checkout failed", e);
    } finally {
      setLoadingCheckout(false);
    }
  };

  if (!thought) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row"
          >
            {/* Left Side: Preview */}
            <div className="w-full md:w-1/2 bg-slate-50 p-8 flex flex-center justify-center items-center border-b md:border-b-0 md:border-r border-slate-200">
               <div className="relative w-full aspect-[3/4] bg-white shadow-xl border-8 border-slate-900 overflow-hidden flex flex-col items-center justify-center p-6 text-center">
                  <div className="text-slate-400 text-[10px] uppercase tracking-widest mb-4 font-bold">Prodigi Fine Art</div>
                  <h3 className="text-lg font-serif text-slate-900 leading-tight mb-2">
                    {thought.content[language].expansive}
                  </h3>
                  <div className="w-8 h-px bg-slate-200 my-4" />
                  <p className="text-[10px] text-slate-400 italic">{thought.author}</p>
               </div>
            </div>

            {/* Right Side: Configuration */}
            <div className="w-full md:w-1/2 p-8 flex flex-col">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                    <ShoppingCart size={24} className="text-rose-500" />
                    Fine Art Print
                  </h2>
                  <p className="text-slate-500 text-sm">Giclée print on archival paper</p>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                  <X size={20} className="text-slate-400" />
                </button>
              </div>

              {/* Size Selection */}
              <div className="mb-6">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 block">Choose Size</label>
                <div className="grid grid-cols-2 gap-2">
                  {PRINTS_CONFIG.map(p => (
                    <button
                      key={p.id}
                      onClick={() => setSelectedSku(p.id)}
                      className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
                        selectedSku === p.id 
                          ? 'bg-slate-900 text-white border-slate-900 shadow-lg' 
                          : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
                      }`}
                    >
                      {p.size.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Shipping Destination */}
              <div className="mb-6">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 block flex items-center gap-1">
                  <Globe size={12} /> Shipping Destination
                </label>
                <select 
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:ring-2 focus:ring-rose-500/20 focus:outline-none"
                >
                  {COUNTRIES.map(c => (
                    <option key={c.code} value={c.code}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Pricing Breakdown */}
              <div className="mt-auto bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-500">Print ({selectedProduct.size.split(' ')[0]})</span>
                  <span className="font-medium text-slate-900">€{selectedProduct.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm mb-4">
                  <span className="text-slate-500 flex items-center gap-1"><Truck size={14} /> Shipping</span>
                  <span className="font-medium text-slate-900">
                    {loadingQuote ? <Loader2 size={14} className="animate-spin" /> : shippingQuote ? `€${parseFloat(shippingQuote.costValue).toFixed(2)}` : '--'}
                  </span>
                </div>
                <div className="h-px bg-slate-200 mb-4" />
                <div className="flex justify-between items-end">
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase">Total</span>
                    <div className="text-2xl font-bold text-slate-900">
                      €{(selectedProduct.price + (shippingQuote ? parseFloat(shippingQuote.costValue) : 0)).toFixed(2)}
                    </div>
                  </div>
                  <button
                    disabled={!shippingQuote || loadingCheckout}
                    onClick={handleCheckout}
                    className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${
                      !shippingQuote || loadingCheckout
                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        : 'bg-rose-500 text-white hover:bg-rose-600 shadow-lg shadow-rose-500/30'
                    }`}
                  >
                    {loadingCheckout ? <Loader2 size={20} className="animate-spin" /> : <CreditCard size={20} />}
                    Checkout
                  </button>
                </div>
              </div>

              {/* Info Tips */}
              <div className="mt-4 flex items-center gap-2 text-[10px] text-slate-400">
                <Info size={12} />
                <span>Orders are fulfilled from the nearest facility to reduce carbon footprint.</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PurchaseModal;
