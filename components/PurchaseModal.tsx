import React, { useState, useEffect } from 'react';
import {
  X, ShoppingBag, ChevronRight, Loader2, AlertCircle, Globe,
  Image as ImageIcon, Shirt, Coffee, Smartphone, Star, Book,
  Mail, Upload, Check, Package,
} from 'lucide-react';
import { Thought, Language } from '../types';

interface PurchaseModalProps {
  thought: Thought;
  imageUrl?: string;        // base64 data URI from Studio, or empty if coming from nav
  onClose: () => void;
  language: Language;
}

// ── Catalog ─────────────────────────────────────────────────
interface Product {
  id: string;
  name: string;
  desc: string;
  price: number;
  sku: string;        // may contain {SIZE} placeholder for clothing
  hasSizes?: boolean;
}

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const PRODUCTS: Record<string, Product[]> = {
  'Wall Prints': [
    { id: 'fap-a4', name: 'A4 Fine Art Print', desc: '210×297 mm · Archival paper', price: 35, sku: 'GLOBAL-FAP-A4' },
    { id: 'fap-a3', name: 'A3 Art Print',      desc: '297×420 mm · Museum quality', price: 49, sku: 'GLOBAL-FAP-A3' },
    { id: 'fap-a2', name: 'A2 Premium Print',  desc: '420×594 mm · Gallery grade',  price: 65, sku: 'GLOBAL-FAP-A2' },
  ],
  'Framed Art': [
    { id: 'hcf-blk-a4', name: 'A4 Framed – Black', desc: 'Ready to hang · Glass front', price: 55, sku: 'GLOBAL-HCF-BLK-A4' },
    { id: 'hcf-nat-a3', name: 'A3 Framed – Oak',   desc: 'Solid wood · Warm tone',    price: 89, sku: 'GLOBAL-HCF-NAT-A3' },
  ],
  'Canvas': [
    { id: 'can-12', name: 'Small Canvas 12×12"',   desc: 'Stretched · 38mm wrap', price: 75,  sku: 'GLOBAL-CAN-12x12' },
    { id: 'can-20', name: 'Gallery Canvas 20×20"', desc: 'Stretched · 38mm wrap', price: 110, sku: 'GLOBAL-CAN-20x20' },
  ],
  'Clothing': [
    { id: 'tshirt', name: 'Classic T-Shirt',  desc: 'Unisex · 100% organic cotton', price: 32, sku: 'GLOBAL-APPAREL-TSHIRT-{SIZE}-BLK', hasSizes: true },
    { id: 'hoodie', name: 'Premium Hoodie',   desc: 'Unisex · Heavyweight blend',   price: 55, sku: 'GLOBAL-APPAREL-HOODIE-{SIZE}-BLK', hasSizes: true },
  ],
  'Mugs': [
    { id: 'mug-11', name: 'Classic Mug 11oz', desc: '330 ml · Ceramic glossy', price: 18, sku: 'GLOBAL-MUG-11' },
    { id: 'mug-15', name: 'Large Mug 15oz',   desc: '444 ml · Extra roomy',    price: 22, sku: 'GLOBAL-MUG-15' },
  ],
  'Phone Cases': [
    { id: 'case-ip14', name: 'Tough Case · iPhone',  desc: 'iPhone 14 · Dual-layer', price: 28, sku: 'GLOBAL-CASE-SC-IP14' },
    { id: 'case-s23',  name: 'Tough Case · Samsung', desc: 'Galaxy S23 · Dual-layer', price: 28, sku: 'GLOBAL-CASE-SC-S23' },
  ],
  'Stickers': [
    { id: 'stk', name: 'Kiss-Cut Sticker', desc: '10×10 cm · Custom shape', price: 6, sku: 'GLOBAL-STK-KISS' },
  ],
  'Notebooks': [
    { id: 'nb-a5', name: 'Hardback Notebook A5', desc: '128 pages · Lined', price: 24, sku: 'GLOBAL-NB-HB-A5' },
  ],
};

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'Wall Prints':  <ImageIcon   size={16} />,
  'Framed Art':   <Package     size={16} />,
  'Canvas':       <ImageIcon   size={16} />,
  'Clothing':     <Shirt       size={16} />,
  'Mugs':         <Coffee      size={16} />,
  'Phone Cases':  <Smartphone  size={16} />,
  'Stickers':     <Star        size={16} />,
  'Notebooks':    <Book        size={16} />,
  'Postcards':    <Mail        size={16} />,
};

const SHIPPING: Record<string, number> = {
  'Stickers': 3.5,
  'Notebooks': 3.5,
  'Clothing': 8,
  'Wall Prints': 12,
  'Framed Art': 12,
  'Canvas': 12,
};
const DEFAULT_SHIPPING = 6;

const COUNTRIES = [
  { code: 'ES', name: '🇪🇸 Spain' },
  { code: 'DE', name: '🇩🇪 Germany' },
  { code: 'FR', name: '🇫🇷 France' },
  { code: 'IT', name: '🇮🇹 Italy' },
  { code: 'GB', name: '🇬🇧 United Kingdom' },
  { code: 'US', name: '🇺🇸 United States' },
  { code: 'NL', name: '🇳🇱 Netherlands' },
  { code: 'BE', name: '🇧🇪 Belgium' },
  { code: 'PT', name: '🇵🇹 Portugal' },
  { code: 'AT', name: '🇦🇹 Austria' },
  { code: 'CH', name: '🇨🇭 Switzerland' },
];

// ── Component ────────────────────────────────────────────────
const PurchaseModal: React.FC<PurchaseModalProps> = ({ thought, imageUrl, onClose, language }) => {
  const categories = Object.keys(PRODUCTS);
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const [selectedProduct, setSelectedProduct] = useState<Product>(PRODUCTS[categories[0]][0]);
  const [selectedSize, setSelectedSize] = useState('M');
  const [countryCode, setCountryCode] = useState('ES');
  const [checkingOut, setCheckingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Phase 1: upload base64 → public URL
  const [publicImageUrl, setPublicImageUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Phase 2: mockup generation
  const [mockupUrl, setMockupUrl] = useState<string | null>(null);
  const [isMockupLoading, setIsMockupLoading] = useState(false);
  const [mockupError, setMockupError] = useState<string | null>(null);

  const thoughtText = thought.content[language]?.expansive || thought.content['en'].expansive;
  const products = PRODUCTS[activeCategory] || [];
  const shippingCost = SHIPPING[activeCategory] ?? DEFAULT_SHIPPING;
  const totalPrice = selectedProduct ? selectedProduct.price + shippingCost : 0;

  // Resolve the effective SKU (replace {SIZE} for clothing)
  const effectiveSku = selectedProduct.hasSizes
    ? selectedProduct.sku.replace('{SIZE}', selectedSize)
    : selectedProduct.sku;

  // ── Phase 1: Upload base64 artwork to get a public URL ──
  useEffect(() => {
    if (!imageUrl) return;

    // If already a public URL (https://...), skip upload
    if (!imageUrl.startsWith('data:')) {
      setPublicImageUrl(imageUrl);
      return;
    }

    let active = true;
    setIsUploading(true);
    setUploadError(null);
    setPublicImageUrl(null);
    setMockupUrl(null);

    (async () => {
      try {
        const res = await fetch('/api/upload-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageBase64: imageUrl }),
        });
        const data = await res.json();
        if (!active) return;
        if (data.url) {
          setPublicImageUrl(data.url);
        } else {
          setUploadError(data.error || 'Could not upload artwork.');
        }
      } catch {
        if (active) setUploadError('Network error while uploading artwork.');
      } finally {
        if (active) setIsUploading(false);
      }
    })();

    return () => { active = false; };
  }, [imageUrl]);

  // ── Phase 2: Generate mockup once we have a public URL ──
  useEffect(() => {
    if (!publicImageUrl || !selectedProduct) return;

    let active = true;
    setIsMockupLoading(true);
    setMockupError(null);
    setMockupUrl(null);

    (async () => {
      try {
        const res = await fetch('/api/mockup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sku: effectiveSku, imageUrl: publicImageUrl }),
        });
        const data = await res.json();
        if (!active) return;
        if (res.ok && data.mockups?.length > 0) {
          setMockupUrl(data.mockups[0].url || data.mockups[0]);
        } else {
          setMockupError(data.error || 'Mockup unavailable for this product.');
        }
      } catch {
        if (active) setMockupError('Network error generating mockup.');
      } finally {
        if (active) setIsMockupLoading(false);
      }
    })();

    return () => { active = false; };
  }, [publicImageUrl, selectedProduct, effectiveSku]);

  const handleCheckout = async () => {
    if (!selectedProduct || !publicImageUrl) return;
    setCheckingOut(true);
    setError(null);
    try {
      const res = await fetch('/api/checkout/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          thoughtId: thought.id,
          sku: effectiveSku,
          productName: selectedProduct.name,
          price: selectedProduct.price,
          shippingPrice: shippingCost,
          countryCode,
          imageUrl: publicImageUrl,   // ✅ public URL — safe for Stripe metadata
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

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setSelectedProduct(PRODUCTS[cat][0]);
    setMockupUrl(null);
  };

  const noImage = !imageUrl;
  const isReady = !!publicImageUrl && !isUploading;

  return (
    <div className="premium-modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="premium-modal">

        {/* ── Header ── */}
        <div className="premium-modal-header">
          <div className="premium-modal-title">
            <h2><ShoppingBag size={20} /> Collect This Piece</h2>
            <p>"{thoughtText.substring(0, 60)}{thoughtText.length > 60 ? '…' : ''}"</p>
          </div>

          {/* Upload status indicator */}
          {imageUrl && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8rem', color: 'var(--text-secondary)', marginRight: 12 }}>
              {isUploading && <><Loader2 size={14} className="spin" /> Preparing artwork…</>}
              {!isUploading && publicImageUrl && <><Check size={14} style={{ color: '#10b981' }} /> Artwork ready</>}
              {uploadError && <><AlertCircle size={14} style={{ color: '#ef4444' }} /> Upload failed</>}
            </div>
          )}

          <button className="premium-modal-close" onClick={onClose}><X size={20} /></button>
        </div>

        {/* ── Body ── */}
        <div className="premium-modal-body">

          {/* LEFT: Category navigation */}
          <div className="premium-modal-nav">
            <p className="premium-nav-title">Categories</p>
            <div className="premium-categories">
              {categories.map(cat => (
                <button
                  key={cat}
                  className={`premium-cat-btn ${activeCategory === cat ? 'active' : ''}`}
                  onClick={() => handleCategoryChange(cat)}
                >
                  <span className="premium-cat-icon">{CATEGORY_ICONS[cat]}</span>
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* MIDDLE: Mockup preview */}
          <div className="premium-modal-display">
            <div className="premium-mockup-wrapper">
              {noImage ? (
                <div className="premium-mockup-placeholder">
                  <ImageIcon size={48} />
                  <p style={{ fontWeight: 600 }}>No artwork yet</p>
                  <p style={{ fontSize: '0.85rem', maxWidth: 240, lineHeight: 1.5 }}>
                    Close this window, open a thought in the <strong>Studio</strong> (click any card),
                    customise your design, then click <em>Collect</em> to come back here with your artwork.
                  </p>
                </div>
              ) : isUploading ? (
                <div className="premium-mockup-loading">
                  <Upload size={28} style={{ opacity: 0.5 }} />
                  <div className="spinner-ring" />
                  <p>Uploading artwork…</p>
                </div>
              ) : uploadError ? (
                <div className="premium-mockup-error">
                  <AlertCircle size={24} />
                  <p>Could not upload artwork</p>
                  <span style={{ fontSize: '0.78rem', opacity: 0.7 }}>{uploadError}</span>
                  <span style={{ fontSize: '0.78rem', opacity: 0.7 }}>
                    Check that <code>CLOUDINARY_CLOUD_NAME</code> and <code>CLOUDINARY_UPLOAD_PRESET</code> are set in <code>.env</code>.
                  </span>
                </div>
              ) : isMockupLoading ? (
                <div className="premium-mockup-loading">
                  <div className="spinner-ring" />
                  <p>Generating photorealistic mockup…</p>
                </div>
              ) : mockupError ? (
                <div className="premium-mockup-error">
                  <AlertCircle size={20} />
                  <p style={{ fontSize: '0.9rem' }}>{mockupError}</p>
                  {publicImageUrl && (
                    <img src={publicImageUrl} alt="Your design" className="premium-raw-fallback" style={{ marginTop: 12, maxHeight: 200 }} />
                  )}
                </div>
              ) : mockupUrl ? (
                <img src={mockupUrl} alt={selectedProduct.name} className="premium-mockup-image" />
              ) : (
                <div className="premium-mockup-placeholder">
                  <ImageIcon size={48} />
                  <p>Select a product to preview</p>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Options & checkout */}
          <div className="premium-modal-checkout">
            <h3 className="premium-checkout-title">Options</h3>

            {/* Product variants */}
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

            {/* Size selector — only for clothing */}
            {selectedProduct.hasSizes && (
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 8 }}>
                  Size
                </label>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {SIZES.map(s => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: 6,
                        border: `1.5px solid ${selectedSize === s ? 'var(--text-primary)' : 'var(--border-color)'}`,
                        background: selectedSize === s ? 'var(--text-primary)' : 'transparent',
                        color: selectedSize === s ? 'var(--bg-primary)' : 'var(--text-primary)',
                        fontSize: '0.82rem',
                        fontWeight: 500,
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Shipping destination */}
            <div className="premium-shipping-box">
              <label>Shipping Destination</label>
              <div className="premium-select-wrapper">
                <Globe size={16} />
                <select value={countryCode} onChange={e => setCountryCode(e.target.value)}>
                  {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                </select>
              </div>
            </div>

            {/* Price summary */}
            <div className="premium-summary">
              <div className="summary-row">
                <span>{selectedProduct?.name || 'Item'}{selectedProduct.hasSizes ? ` (${selectedSize})` : ''}</span>
                <span>€{selectedProduct?.price.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping to {COUNTRIES.find(c => c.code === countryCode)?.name.replace(/^.{1,4}\s/, '') || countryCode}</span>
                <span>€{shippingCost.toFixed(2)}</span>
              </div>
              <div className="summary-row total">
                <span>Total</span>
                <span>€{totalPrice.toFixed(2)}</span>
              </div>
            </div>

            {error && (
              <div className="premium-error">
                <AlertCircle size={14} /> {error}
              </div>
            )}

            <button
              className="premium-buy-btn"
              onClick={handleCheckout}
              disabled={checkingOut || !isReady || noImage}
              title={noImage ? 'Design your piece in the Studio first' : isUploading ? 'Uploading artwork…' : ''}
            >
              {checkingOut
                ? <><Loader2 className="spin" size={18} /> Processing…</>
                : noImage
                  ? <><ImageIcon size={18} /> Design First in Studio</>
                  : !isReady
                    ? <><Loader2 className="spin" size={18} /> Preparing…</>
                    : <>Checkout <ChevronsRight size={18} /></>
              }
            </button>

            <p className="premium-guarantee">
              Printed &amp; fulfilled globally by Prodigi.&nbsp;
              Secure payment via Stripe.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PurchaseModal;

const ChevronsRight = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m13 17 5-5-5-5"/><path d="m6 17 5-5-5-5"/>
  </svg>
);
