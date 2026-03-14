import React, { useState, useRef } from 'react';
import { X, ShoppingBag, Package, ChevronRight, Loader2, AlertCircle, Check, Globe } from 'lucide-react';
import { Thought, Language } from '../types';

// ── Types ──────────────────────────────────────────────────
interface PurchaseModalProps {
  thought: Thought;
  imageUrl?: string;
  onClose: () => void;
  language: Language;
}

// ── Product Catalog (local, no API needed) ─────────────────
interface Product {
  id: string;
  name: string;
  desc: string;
  price: number;
  sku: string;
  mockupimg: string;   // background photo of the product
  mockupStyle: React.CSSProperties; // where to place the text overlay
  textColor: string;
}

const PRODUCTS: Record<string, Product[]> = {
  'Wall Prints': [
    {
      id: 'poster-a4', name: 'A4 Fine Art Print', desc: '210×297 mm · Archival paper', price: 35, sku: 'GLOBAL-FAP-A4',
      mockupimg: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=700&q=80',
      mockupStyle: { top: '12%', left: '22%', width: '56%', height: '66%' },
      textColor: '#1e293b',
    },
    {
      id: 'poster-a3', name: 'A3 Art Print', desc: '297×420 mm · Museum quality', price: 49, sku: 'GLOBAL-FAP-A3',
      mockupimg: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=700&q=80',
      mockupStyle: { top: '8%', left: '18%', width: '64%', height: '75%' },
      textColor: '#1e293b',
    },
    {
      id: 'poster-a2', name: 'A2 Premium Print', desc: '420×594 mm · Gallery grade', price: 65, sku: 'GLOBAL-FAP-A2',
      mockupimg: 'https://images.unsplash.com/photo-1565372933718-e28f64f8099a?w=700&q=80',
      mockupStyle: { top: '10%', left: '20%', width: '60%', height: '72%' },
      textColor: '#1e293b',
    },
  ],
  'Framed Art': [
    {
      id: 'frame-black-a4', name: 'A4 Framed – Black', desc: 'Ready to hang · Glass front', price: 55, sku: 'GLOBAL-FFAP-A4',
      mockupimg: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=700&q=80',
      mockupStyle: { top: '15%', left: '25%', width: '50%', height: '58%' },
      textColor: '#1e293b',
    },
    {
      id: 'frame-oak-a3', name: 'A3 Framed – Oak', desc: 'Solid wood · Warm tone', price: 89, sku: 'GLOBAL-FFAP-A3-OAK',
      mockupimg: 'https://images.unsplash.com/photo-1576514419083-5e8e2bbd42b4?w=700&q=80',
      mockupStyle: { top: '10%', left: '20%', width: '60%', height: '72%' },
      textColor: '#1e293b',
    },
  ],
  'Canvas': [
    {
      id: 'canvas-30', name: 'Canvas 30×30 cm', desc: 'Stretched · 38mm gallery wrap', price: 75, sku: 'GLOBAL-CAN-30',
      mockupimg: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=700&q=80',
      mockupStyle: { top: '8%', left: '12%', width: '76%', height: '76%' },
      textColor: '#fff',
    },
    {
      id: 'canvas-50', name: 'Canvas 50×50 cm', desc: 'Stretched · 38mm gallery wrap', price: 110, sku: 'GLOBAL-CAN-50',
      mockupimg: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=700&q=80',
      mockupStyle: { top: '5%', left: '8%', width: '84%', height: '84%' },
      textColor: '#fff',
    },
  ],
  'Clothing': [
    {
      id: 'tshirt', name: 'Organic T-Shirt', desc: 'S / M / L / XL · 100% organic', price: 32, sku: 'GLOBAL-TEE-PREM',
      mockupimg: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=700&q=80',
      mockupStyle: { top: '22%', left: '30%', width: '40%', height: '35%' },
      textColor: '#1e293b',
    },
    {
      id: 'hoodie', name: 'Premium Hoodie', desc: 'S / M / L / XL · Heavyweight', price: 55, sku: 'GLOBAL-HUD-PREM',
      mockupimg: 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=700&q=80',
      mockupStyle: { top: '25%', left: '28%', width: '44%', height: '32%' },
      textColor: '#fff',
    },
  ],
  'Mugs': [
    {
      id: 'mug-11', name: 'Classic Mug 11oz', desc: '330 ml · Ceramic glossy', price: 18, sku: 'GLOBAL-MUG-11',
      mockupimg: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=700&q=80',
      mockupStyle: { top: '20%', left: '22%', width: '56%', height: '50%' },
      textColor: '#1e293b',
    },
    {
      id: 'mug-15', name: 'Large Mug 15oz', desc: '444 ml · Extra roomy', price: 22, sku: 'GLOBAL-MUG-15',
      mockupimg: 'https://images.unsplash.com/photo-1510972527921-ce03766a1cf1?w=700&q=80',
      mockupStyle: { top: '18%', left: '20%', width: '60%', height: '52%' },
      textColor: '#1e293b',
    },
  ],
  'Phone Cases': [
    {
      id: 'case-iphone', name: 'iPhone Case', desc: 'Tough · All modern models', price: 28, sku: 'GLOBAL-CASE-IP',
      mockupimg: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=700&q=80',
      mockupStyle: { top: '12%', left: '30%', width: '40%', height: '64%' },
      textColor: '#fff',
    },
    {
      id: 'case-android', name: 'Samsung Case', desc: 'S-Series · Drop protection', price: 28, sku: 'GLOBAL-CASE-SM',
      mockupimg: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=700&q=80',
      mockupStyle: { top: '10%', left: '28%', width: '44%', height: '70%' },
      textColor: '#fff',
    },
  ],
  'Stickers': [
    {
      id: 'sticker-single', name: 'Vinyl Sticker', desc: '10×10 cm ·Waterproof matte', price: 6, sku: 'GLOBAL-STK-S',
      mockupimg: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=700&q=80',
      mockupStyle: { top: '20%', left: '20%', width: '60%', height: '55%' },
      textColor: '#1e293b',
    },
    {
      id: 'sticker-pack', name: 'Sticker Pack ×5', desc: '8×8 cm each · Mixed finish', price: 18, sku: 'GLOBAL-STK-P',
      mockupimg: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=700&q=80',
      mockupStyle: { top: '15%', left: '15%', width: '70%', height: '60%' },
      textColor: '#1e293b',
    },
  ],
  'Notebooks': [
    {
      id: 'notebook-a5', name: 'Hardback Notebook A5', desc: '128 pages · Lined', price: 24, sku: 'GLOBAL-NB-A5',
      mockupimg: 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=700&q=80',
      mockupStyle: { top: '15%', left: '18%', width: '64%', height: '70%' },
      textColor: '#1e293b',
    },
  ],
  'Postcards': [
    {
      id: 'postcard', name: 'Art Postcard A6', desc: '10.5×14.8 cm · 350gsm', price: 5, sku: 'GLOBAL-PC-S',
      mockupimg: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=700&q=80',
      mockupStyle: { top: '10%', left: '10%', width: '80%', height: '75%' },
      textColor: '#1e293b',
    },
  ],
};

const CATEGORY_ICONS: Record<string, string> = {
  'Wall Prints': '🖼️',
  'Framed Art': '🪞',
  'Canvas': '🎨',
  'Clothing': '👕',
  'Mugs': '☕',
  'Phone Cases': '📱',
  'Stickers': '🎯',
  'Notebooks': '📓',
  'Postcards': '✉️',
};

const COUNTRIES = [
  { code: 'ES', name: 'Spain' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'IT', name: 'Italy' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'US', name: 'United States' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'PT', name: 'Portugal' },
  { code: 'BE', name: 'Belgium' },
  { code: 'AT', name: 'Austria' },
  { code: 'CH', name: 'Switzerland' },
];

// ── Component ──────────────────────────────────────────────
const PurchaseModal: React.FC<PurchaseModalProps> = ({ thought, onClose, language }) => {
  const categories = Object.keys(PRODUCTS);
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [countryCode, setCountryCode] = useState('ES');
  const [checkingOut, setCheckingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const thoughtText = thought.content[language]?.expansive || thought.content['en'].expansive;
  const products = PRODUCTS[activeCategory] || [];

  // Shipping cost estimate by category
  const shippingCost = (() => {
    const cat = activeCategory;
    if (cat === 'Postcards' || cat === 'Stickers') return 3.5;
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
          imageUrl: `https://mindgallery.vercel.app/api/render-thought?id=${thought.id}`,
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
    <div className="purchase-modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="purchase-modal">

        {/* ── Header ── */}
        <div className="purchase-modal-header">
          <div>
            <h2 className="purchase-modal-title">
              <ShoppingBag size={20} />
              Customize Your Order
            </h2>
            <p className="purchase-modal-subtitle">
              "{thoughtText.substring(0, 65)}{thoughtText.length > 65 ? '…' : ''}"
            </p>
          </div>
          <button className="purchase-modal-close" onClick={onClose}><X size={20} /></button>
        </div>

        {/* ── Body ── */}
        <div className="purchase-modal-body">

          {/* Left: Categories + Products */}
          <div className="purchase-modal-panel purchase-modal-left">
            <div className="prodigi-categories">
              {categories.map(cat => (
                <button
                  key={cat}
                  className={`prodigi-cat-btn ${activeCategory === cat ? 'active' : ''}`}
                  onClick={() => { setActiveCategory(cat); setSelectedProduct(null); }}
                >
                  <span className="prodigi-cat-icon">{CATEGORY_ICONS[cat]}</span>
                  <span className="prodigi-cat-label">{cat}</span>
                  {activeCategory === cat && <ChevronRight size={14} className="prodigi-cat-arrow" />}
                </button>
              ))}
            </div>

            <div className="prodigi-product-list">
              {products.map(product => (
                <button
                  key={product.id}
                  className={`prodigi-product-card ${selectedProduct?.id === product.id ? 'selected' : ''}`}
                  onClick={() => setSelectedProduct(product)}
                >
                  <div className="prodigi-product-info">
                    <span className="prodigi-product-name">{product.name}</span>
                    <span className="prodigi-product-desc">{product.desc}</span>
                  </div>
                  <div className="prodigi-product-price">
                    €{product.price}
                    {selectedProduct?.id === product.id && <Check size={14} className="prodigi-check" />}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right: Live Mockup + Checkout */}
          <div className="purchase-modal-panel purchase-modal-right">

            {/* Live Mockup Preview */}
            <div className="prodigi-mockup-area">
              {selectedProduct ? (
                <div className="prodigi-live-mockup">
                  {/* Product background image */}
                  <img
                    src={selectedProduct.mockupimg}
                    alt={selectedProduct.name}
                    className="prodigi-mockup-bg"
                    crossOrigin="anonymous"
                  />
                  {/* Text overlay on the product */}
                  <div
                    className="prodigi-text-overlay"
                    style={{
                      ...selectedProduct.mockupStyle,
                      color: selectedProduct.textColor,
                    }}
                  >
                    <p className="prodigi-overlay-text">{thoughtText}</p>
                    <p className="prodigi-overlay-brand">— Mind Gallery</p>
                  </div>
                </div>
              ) : (
                <div className="prodigi-mockup-placeholder">
                  <span style={{ fontSize: 48 }}>{CATEGORY_ICONS[activeCategory]}</span>
                  <p>Select a product<br />to preview your thought on it</p>
                </div>
              )}
            </div>

            {/* Shipping + Checkout */}
            {selectedProduct && (
              <div className="prodigi-shipping-section">
                <div className="prodigi-country-row">
                  <Globe size={16} />
                  <select
                    value={countryCode}
                    onChange={e => setCountryCode(e.target.value)}
                    className="prodigi-country-select"
                  >
                    {COUNTRIES.map(c => (
                      <option key={c.code} value={c.code}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="prodigi-price-breakdown">
                  <div className="prodigi-price-row">
                    <span>{selectedProduct.name}</span>
                    <span>€{selectedProduct.price.toFixed(2)}</span>
                  </div>
                  <div className="prodigi-price-row">
                    <span>Shipping to {COUNTRIES.find(c => c.code === countryCode)?.name}</span>
                    <span>€{shippingCost.toFixed(2)}</span>
                  </div>
                  <div className="prodigi-price-row prodigi-price-total">
                    <span>Total</span>
                    <span>€{totalPrice.toFixed(2)}</span>
                  </div>
                </div>

                {error && (
                  <div className="prodigi-error">
                    <AlertCircle size={14} /> {error}
                  </div>
                )}

                <button
                  className="prodigi-checkout-btn"
                  onClick={handleCheckout}
                  disabled={checkingOut}
                >
                  {checkingOut ? (
                    <><Loader2 className="spin" size={16} /> Processing…</>
                  ) : (
                    <><Package size={16} /> Order Now · €{totalPrice.toFixed(2)}</>
                  )}
                </button>

                <p className="prodigi-legal">
                  Fulfilled by Prodigi. Ships worldwide. Free returns within 30 days.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseModal;
