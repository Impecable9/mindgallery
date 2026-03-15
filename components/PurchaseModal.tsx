import React, { useState, useEffect } from 'react';
import { X, ShoppingBag, Package, ChevronRight, Loader2, AlertCircle, Check, Globe, Image as ImageIcon, Shirt, Coffee, Smartphone, Star, Book, Mail } from 'lucide-react';
import { Thought, Language } from '../types';

interface PurchaseModalProps {
  thought: Thought;
  imageUrl?: string;
  onClose: () => void;
  language: Language;
}

// ── Curated Premium Catalog (Prodigi SKUs) ─────────────────
interface Product {
  id: string;
  name: string;
  desc: string;
  price: number;
  sku: string;
}

const PRODUCTS: Record<string, Product[]> = {
  'Wall Prints': [
    { id: 'poster-a4', name: 'A4 Fine Art Print', desc: '210×297 mm · Archival paper', price: 35, sku: 'GLOBAL-FAP-A4' },
    { id: 'poster-a3', name: 'A3 Art Print', desc: '297×420 mm · Museum quality', price: 49, sku: 'GLOBAL-FAP-A3' },
    { id: 'poster-a2', name: 'A2 Premium Print', desc: '420×594 mm · Gallery grade', price: 65, sku: 'GLOBAL-FAP-A2' },
  ],
  'Framed Art': [
    { id: 'frame-black-a4', name: 'A4 Framed – Black', desc: 'Ready to hang · Glass front', price: 55, sku: 'GLOBAL-HCF-BLK-A4' },
    { id: 'frame-oak-a3', name: 'A3 Framed – Oak', desc: 'Solid wood · Warm tone', price: 89, sku: 'GLOBAL-HCF-NAT-A3' },
  ],
  'Canvas': [
    { id: 'canvas-12', name: 'Small Canvas 12×12"', desc: 'Stretched · 38mm wrap', price: 75, sku: 'GLOBAL-CAN-12x12' },
    { id: 'canvas-20', name: 'Gallery Canvas 20×20"', desc: 'Stretched · 38mm wrap', price: 110, sku: 'GLOBAL-CAN-20x20' },
  ],
  'Clothing': [
    { id: 'tshirt', name: 'Classic T-Shirt', desc: 'Unisex · 100% organic cotton', price: 32, sku: 'GLOBAL-APPAREL-TSHIRT-M-BLK' },
    { id: 'hoodie', name: 'Premium Hoodie', desc: 'Unisex · Heavyweight blend', price: 55, sku: 'GLOBAL-APPAREL-HOODIE-M-BLK' },
  ],
  'Mugs': [
    { id: 'mug-11', name: 'Classic Mug 11oz', desc: '330 ml · Ceramic glossy', price: 18, sku: 'GLOBAL-MUG-11' },
    { id: 'mug-15', name: 'Large Mug 15oz', desc: '444 ml · Extra roomy', price: 22, sku: 'GLOBAL-MUG-15' },
  ],
  'Phone Cases': [
    { id: 'case-iphone', name: 'Tough Case · Apple', desc: 'Dual-layer protection', price: 28, sku: 'GLOBAL-CASE-SC-IP14' },
    { id: 'case-android', name: 'Tough Case · Samsung', desc: 'Dual-layer protection', price: 28, sku: 'GLOBAL-CASE-SC-S23' },
  ],
  'Stickers': [
    { id: 'sticker-single', name: 'Kiss-Cut Sticker', desc: '10×10 cm · Custom shape', price: 6, sku: 'GLOBAL-STK-KISS' },
  ],
  'Notebooks': [
    { id: 'notebook-a5', name: 'Hardback Notebook A5', desc: '128 pages · Lined', price: 24, sku: 'GLOBAL-NB-HB-A5' },
  ],
};

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'Wall Prints': <ImageIcon size={18} />,
  'Framed Art': <ImageIcon size={18} />,
  'Canvas': <ImageIcon size={18} />,
  'Clothing': <Shirt size={18} />,
  'Mugs': <Coffee size={18} />,
  'Phone Cases': <Smartphone size={18} />,
  'Stickers': <Star size={18} />,
  'Notebooks': <Book size={18} />,
  'Postcards': <Mail size={18} />,
};

const COUNTRIES = [
  { code: 'ES', name: 'Spain' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'IT', name: 'Italy' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'US', name: 'United States' },
];

const PurchaseModal: React.FC<PurchaseModalProps> = ({ thought, imageUrl, onClose, language }) => {
  const categories = Object.keys(PRODUCTS);
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const [selectedProduct, setSelectedProduct] = useState<Product>(PRODUCTS[categories[0]][0]);
  
  const [countryCode, setCountryCode] = useState('ES');
  const [checkingOut, setCheckingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mockup generation state
  const [mockupResult, setMockupResult] = useState<string | null>(null);
  const [isGeneratingMockup, setIsGeneratingMockup] = useState(false);
  const [mockupError, setMockupError] = useState<string | null>(null);

  const thoughtText = thought.content[language]?.expansive || thought.content['en'].expansive;
  const products = PRODUCTS[activeCategory] || [];

  // When a product is selected, fetch the real mockup from our API
  useEffect(() => {
    if (!selectedProduct || !imageUrl) return;

    let isMounted = true;
    const generateMockup = async () => {
      setIsGeneratingMockup(true);
      setMockupError(null);
      
      try {
        const response = await fetch('/api/mockup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sku: selectedProduct.sku,
            imageUrl: imageUrl // This is the base64 we increased the Express limit for
          })
        });
        
        const data = await response.json();
        
        if (!isMounted) return;

        if (response.ok && data.mockups && data.mockups.length > 0) {
          // Prodigi v4 mockups return an array. We take the first one's URL.
          const url = data.mockups[0].url || data.mockups[0];
          setMockupResult(url);
        } else {
          setMockupError(data.error || 'Mockup generation failed for this SKU.');
          setMockupResult(null);
        }
      } catch (err) {
        if (isMounted) {
          setMockupError('Network error while generating mockup.');
          setMockupResult(null);
        }
      } finally {
        if (isMounted) setIsGeneratingMockup(false);
      }
    };

    generateMockup();

    return () => { isMounted = false; };
  }, [selectedProduct, imageUrl]);


  // Shipping cost estimate by category
  const shippingCost = (() => {
    const cat = activeCategory;
    if (cat === 'Stickers' || cat === 'Notebooks') return 3.5;
    if (cat === 'Clothing') return 8;
    if (cat === 'Wall Prints' || cat === 'Framed Art' || cat === 'Canvas') return 12;
    return 6;
  })();

  const totalPrice = selectedProduct ? selectedProduct.price + shippingCost : 0;

  const handleCheckout = async () => {
    if (!selectedProduct) return;
    setCheckingOut(true);
    setError(null);
    try {
      const res = await fetch('/api/checkout/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          thoughtId: thought.id,
          sku: selectedProduct.sku,
          productName: selectedProduct.name,
          price: selectedProduct.price,
          shippingPrice: shippingCost,
          countryCode,
          // We pass the generated mockup if it exists, otherwise fallback to the raw base64 artwork
          imageUrl: mockupResult || imageUrl,
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError('Could not start checkout. Please try again.');
      }
    } catch {
      setError('Connection error. Please try again.');
    } finally {
      setCheckingOut(false);
    }
  };

  return (
    <div className="premium-modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="premium-modal">

        {/* Header */}
        <div className="premium-modal-header">
          <div className="premium-modal-title">
            <h2><ShoppingBag size={20} /> Collect This Piece</h2>
            <p>"{thoughtText.substring(0, 50)}{thoughtText.length > 50 ? '…' : ''}"</p>
          </div>
          <button className="premium-modal-close" onClick={onClose}><X size={20} /></button>
        </div>

        {/* Body */}
        <div className="premium-modal-body">
          
          {/* LEFT: Categories */}
          <div className="premium-modal-nav">
            <h3 className="premium-nav-title">Categories</h3>
            <div className="premium-categories">
               {categories.map(cat => (
                 <button
                   key={cat}
                   className={`premium-cat-btn ${activeCategory === cat ? 'active' : ''}`}
                   onClick={() => { 
                     setActiveCategory(cat); 
                     setSelectedProduct(PRODUCTS[cat][0]); 
                   }}
                 >
                   <span className="premium-cat-icon">{CATEGORY_ICONS[cat]}</span>
                   {cat}
                 </button>
               ))}
            </div>
          </div>

          {/* MIDDLE: Product Display (Mockup) */}
          <div className="premium-modal-display">
             <div className="premium-mockup-wrapper">
                {isGeneratingMockup ? (
                  <div className="premium-mockup-loading">
                    <div className="spinner-ring"></div>
                    <p>Generating photorealistic mockup...</p>
                  </div>
                ) : mockupError ? (
                  <div className="premium-mockup-error">
                    <AlertCircle size={24} />
                    <p>{mockupError}</p>
                    <span className="text-xs opacity-70">Falling back to raw design preview.</span>
                    {/* Fallback to show raw thought image */}
                    <img src={imageUrl} alt="Raw Design" className="premium-raw-fallback" />
                  </div>
                ) : mockupResult ? (
                  <img src={mockupResult} alt={selectedProduct.name} className="premium-mockup-image" />
                ) : (
                  <div className="premium-mockup-placeholder">
                    <ImageIcon size={48} />
                    <p>Select a product to view</p>
                  </div>
                )}
             </div>
          </div>

          {/* RIGHT: Selection & Checkout */}
          <div className="premium-modal-checkout">
            <h3 className="premium-checkout-title">Options</h3>
            <div className="premium-variants">
              {products.map(product => (
                <button
                  key={product.id}
                  className={`premium-variant-btn ${selectedProduct?.id === product.id ? 'active' : ''}`}
                  onClick={() => setSelectedProduct(product)}
                >
                  <div className="variant-info">
                    <span className="variant-name">{product.name}</span>
                    <span className="variant-desc">{product.desc}</span>
                  </div>
                  <div className="variant-price">€{product.price}</div>
                </button>
              ))}
            </div>

            <div className="premium-shipping-box">
              <label>Shipping Destination</label>
              <div className="premium-select-wrapper">
                <Globe size={16} />
                <select value={countryCode} onChange={e => setCountryCode(e.target.value)}>
                  {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                </select>
              </div>
            </div>

            <div className="premium-summary">
              <div className="summary-row">
                <span>{selectedProduct?.name || 'Item'}</span>
                <span>€{selectedProduct?.price.toFixed(2) || '0.00'}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span>€{shippingCost.toFixed(2)}</span>
              </div>
              <div className="summary-row total">
                <span>Total</span>
                <span>€{totalPrice.toFixed(2)}</span>
              </div>
            </div>

            {error && <div className="premium-error"><AlertCircle size={14} /> {error}</div>}

            <button
              className="premium-buy-btn"
              onClick={handleCheckout}
              disabled={checkingOut || isGeneratingMockup}
            >
              {checkingOut ? <><Loader2 className="spin" size={18} /> Secure Checkout...</> : <>Checkout <ChevronsRight size={18} /></>}
            </button>
            <p className="premium-guarantee">Printed & fulfilled globally by Prodigi. Safe and encrypted payment.</p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PurchaseModal;

const ChevronsRight = ({size}: {size:number}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m13 17 5-5-5-5"/><path d="m6 17 5-5-5-5"/></svg>;
