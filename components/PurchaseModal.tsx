import React, { useState, useEffect, useCallback, useRef } from 'react';
import { X, ShoppingBag, Package, ChevronRight, Loader2, AlertCircle, Check, Globe, Image as ImageIcon } from 'lucide-react';
import { Thought } from '../types';

// ────────────────────────────────────────────────────────────
//  Types
// ────────────────────────────────────────────────────────────
interface ProdigiProduct {
  sku: string;
  name: string;
  description?: string;
  price?: number;
  images?: string[];
  attributes?: Record<string, string>;
}

interface MockupResult {
  mockupUrl?: string;
  status?: string;
}

// ────────────────────────────────────────────────────────────
//  Category definitions (ordered)
// ────────────────────────────────────────────────────────────
const CATEGORIES = [
  { id: 'wall-art',  label: 'Wall Art',   icon: '🖼️',  query: 'fine-art' },
  { id: 'canvas',   label: 'Canvas',     icon: '🎨',  query: 'canvas' },
  { id: 'frames',   label: 'Framed',     icon: '🪞',  query: 'framed' },
  { id: 'apparel',  label: 'Clothing',   icon: '👕',  query: 'apparel' },
  { id: 'mugs',     label: 'Mugs',       icon: '☕',  query: 'mugs' },
  { id: 'cases',    label: 'Phone Cases',icon: '📱',  query: 'phone-cases' },
  { id: 'stickers', label: 'Stickers',   icon: '🎯',  query: 'stickers' },
  { id: 'notebooks',label: 'Notebooks',  icon: '📓',  query: 'notebooks' },
  { id: 'postcards',label: 'Postcards',  icon: '✉️',  query: 'postcards' },
];

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

interface PurchaseModalProps {
  thought: Thought;
  imageUrl: string;
  onClose: () => void;
  language: string;
}

// ────────────────────────────────────────────────────────────
//  Component
// ────────────────────────────────────────────────────────────
const PurchaseModal: React.FC<PurchaseModalProps> = ({ thought, imageUrl, onClose, language }) => {
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0].id);
  const [products, setProducts] = useState<ProdigiProduct[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<ProdigiProduct | null>(null);
  const [countryCode, setCountryCode] = useState('ES');
  const [shippingPrice, setShippingPrice] = useState<number | null>(null);
  const [mockupUrl, setMockupUrl] = useState<string | null>(null);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingMockup, setLoadingMockup] = useState(false);
  const [loadingShipping, setLoadingShipping] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mockupTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  // Fallback product list keyed by category when Prodigi API returns nothing
  const FALLBACK_PRODUCTS: Record<string, ProdigiProduct[]> = {
    'wall-art': [
      { sku: 'GLOBAL-FAP-A4', name: 'Fine Art Print A4', description: '210 × 297 mm · Archival paper', price: 35 },
      { sku: 'GLOBAL-FAP-A3', name: 'Fine Art Print A3', description: '297 × 420 mm · Archival paper', price: 49 },
      { sku: 'GLOBAL-FAP-A2', name: 'Fine Art Print A2', description: '420 × 594 mm · Archival paper', price: 65 },
    ],
    'canvas': [
      { sku: 'GLOBAL-CAN-30', name: 'Canvas 30×30 cm', description: '38mm deep frame', price: 75 },
      { sku: 'GLOBAL-CAN-50', name: 'Canvas 50×50 cm', description: '38mm deep frame', price: 110 },
    ],
    'frames': [
      { sku: 'GLOBAL-FFAP-A4', name: 'A4 Framed (Black)', description: 'Ready to hang', price: 55 },
      { sku: 'GLOBAL-FFAP-A3', name: 'A3 Framed (Oak)', description: 'Solid wood · glass', price: 89 },
    ],
    'apparel': [
      { sku: 'GLOBAL-TEE-PREM', name: 'Premium T-Shirt', description: 'S / M / L / XL', price: 32 },
      { sku: 'GLOBAL-HUD-PREM', name: 'Luxury Hoodie', description: 'S / M / L / XL', price: 55 },
    ],
    'mugs': [
      { sku: 'GLOBAL-MUG-11', name: 'Classic Mug 11oz', description: '330 ml · White glossy', price: 18 },
      { sku: 'GLOBAL-MUG-15', name: 'Large Mug 15oz', description: '444 ml · White glossy', price: 22 },
    ],
    'cases': [
      { sku: 'GLOBAL-CASE-IP', name: 'iPhone Case', description: 'Tough · All models', price: 28 },
      { sku: 'GLOBAL-CASE-SM', name: 'Samsung Case', description: 'S-Series · Impact resistant', price: 28 },
    ],
    'stickers': [
      { sku: 'GLOBAL-STK-S', name: 'Single Sticker', description: '10×10 cm · Vinyl matte', price: 6 },
      { sku: 'GLOBAL-STK-P', name: 'Collector Pack ×5', description: '8×8 cm each · Vinyl matte', price: 18 },
    ],
    'notebooks': [
      { sku: 'GLOBAL-NB-A5', name: 'Hardback Notebook A5', description: '128 pages · Ruled', price: 24 },
    ],
    'postcards': [
      { sku: 'GLOBAL-PC-S', name: 'Art Postcard A6', description: '10.5 × 14.8 cm · 350gsm', price: 5 },
    ],
  };

  // ── Fetch product list when category changes ──
  useEffect(() => {
    const cat = CATEGORIES.find(c => c.id === activeCategory);
    if (!cat) return;

    setProducts([]);
    setSelectedProduct(null);
    setMockupUrl(null);
    setShippingPrice(null);
    setError(null);
    setLoadingProducts(true);

    fetch(`/api/products?category=${cat.query}`)
      .then(r => r.json())
      .then(data => {
        const list: ProdigiProduct[] = Array.isArray(data.products) && data.products.length
          ? data.products.slice(0, 12)
          : FALLBACK_PRODUCTS[activeCategory] || [];
        setProducts(list);
      })
      .catch(() => {
        setProducts(FALLBACK_PRODUCTS[activeCategory] || []);
      })
      .finally(() => setLoadingProducts(false));
  }, [activeCategory]);

  // ── Generate mockup when product selected ──
  const generateMockup = useCallback(async (product: ProdigiProduct) => {
    setMockupUrl(null);
    setLoadingMockup(true);
    clearTimeout(mockupTimeoutRef.current);

    try {
      const res = await fetch('/api/mockup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sku: product.sku, imageUrl }),
      });
      const data: MockupResult = await res.json();
      if (data.mockupUrl) {
        setMockupUrl(data.mockupUrl);
      } else {
        // Mockup generation may be async; poll after 3s
        mockupTimeoutRef.current = setTimeout(() => {
          setMockupUrl(imageUrl); // fallback to original image
          setLoadingMockup(false);
        }, 3000);
        return;
      }
    } catch {
      setMockupUrl(imageUrl); // graceful fallback
    } finally {
      setLoadingMockup(false);
    }
  }, [imageUrl]);

  // ── Fetch shipping quote ──
  const fetchShipping = useCallback(async (sku: string, country: string) => {
    setLoadingShipping(true);
    setShippingPrice(null);
    try {
      const res = await fetch('/api/shipping/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sku, countryCode: country }),
      });
      const data = await res.json();
      const cost = data?.quotes?.[0]?.shipments?.[0]?.cost?.amount;
      setShippingPrice(cost != null ? parseFloat(cost) : 0);
    } catch {
      setShippingPrice(0);
    } finally {
      setLoadingShipping(false);
    }
  }, []);

  // Select product handler
  const handleSelectProduct = (product: ProdigiProduct) => {
    setSelectedProduct(product);
    generateMockup(product);
    fetchShipping(product.sku, countryCode);
  };

  // Country change refreshes shipping
  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = e.target.value;
    setCountryCode(code);
    if (selectedProduct) fetchShipping(selectedProduct.sku, code);
  };

  // Checkout
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
          price: selectedProduct.price ?? 0,
          shippingPrice: shippingPrice ?? 0,
          countryCode,
          imageUrl,
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

  const totalPrice = (selectedProduct?.price ?? 0) + (shippingPrice ?? 0);

  // ────────────────────────────────────────────────────────────
  //  Render
  // ────────────────────────────────────────────────────────────
  return (
    <div className="purchase-modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="purchase-modal">
        {/* Header */}
        <div className="purchase-modal-header">
          <div>
            <h2 className="purchase-modal-title">
              <ShoppingBag size={20} style={{ display: 'inline', marginRight: 8 }} />
              Customize Your Order
            </h2>
            <p className="purchase-modal-subtitle" style={{ opacity: 0.6, fontSize: 13, marginTop: 4 }}>
              "{thought.text.substring(0, 60)}{thought.text.length > 60 ? '...' : ''}"
            </p>
          </div>
          <button className="purchase-modal-close" onClick={onClose}><X size={20} /></button>
        </div>

        <div className="purchase-modal-body">
          {/* Left: Categories + Products */}
          <div className="purchase-modal-panel purchase-modal-left">
            {/* Category tabs */}
            <div className="prodigi-categories">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  className={`prodigi-cat-btn ${activeCategory === cat.id ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat.id)}
                >
                  <span className="prodigi-cat-icon">{cat.icon}</span>
                  <span className="prodigi-cat-label">{cat.label}</span>
                  {activeCategory === cat.id && <ChevronRight size={14} className="prodigi-cat-arrow" />}
                </button>
              ))}
            </div>

            {/* Product list */}
            <div className="prodigi-product-list">
              {loadingProducts ? (
                <div className="prodigi-loading">
                  <Loader2 className="spin" size={24} />
                  <span>Loading products…</span>
                </div>
              ) : products.length === 0 ? (
                <p className="prodigi-empty">No products found for this category.</p>
              ) : (
                products.map(product => (
                  <button
                    key={product.sku}
                    className={`prodigi-product-card ${selectedProduct?.sku === product.sku ? 'selected' : ''}`}
                    onClick={() => handleSelectProduct(product)}
                  >
                    <div className="prodigi-product-info">
                      <span className="prodigi-product-name">{product.name}</span>
                      <span className="prodigi-product-desc">{product.description}</span>
                    </div>
                    <div className="prodigi-product-price">
                      {product.price != null ? `€${product.price}` : '—'}
                      {selectedProduct?.sku === product.sku && <Check size={14} className="prodigi-check" />}
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Right: Preview + Shipping + Checkout */}
          <div className="purchase-modal-panel purchase-modal-right">
            {/* Mockup preview */}
            <div className="prodigi-mockup-area">
              {selectedProduct ? (
                loadingMockup ? (
                  <div className="prodigi-mockup-loading">
                    <Loader2 className="spin" size={32} />
                    <p>Generating preview…</p>
                  </div>
                ) : mockupUrl ? (
                  <img src={mockupUrl} alt="Product mockup" className="prodigi-mockup-img" />
                ) : (
                  <img src={imageUrl} alt="Art preview" className="prodigi-mockup-img" />
                )
              ) : (
                <div className="prodigi-mockup-placeholder">
                  <ImageIcon size={48} style={{ opacity: 0.3 }} />
                  <p>Select a product<br />to see your art on it</p>
                </div>
              )}
            </div>

            {/* Shipping + Country */}
            {selectedProduct && (
              <div className="prodigi-shipping-section">
                <div className="prodigi-country-row">
                  <Globe size={16} />
                  <select
                    value={countryCode}
                    onChange={handleCountryChange}
                    className="prodigi-country-select"
                  >
                    {COUNTRIES.map(c => (
                      <option key={c.code} value={c.code}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="prodigi-price-breakdown">
                  <div className="prodigi-price-row">
                    <span>Product</span>
                    <span>€{selectedProduct.price?.toFixed(2) ?? '—'}</span>
                  </div>
                  <div className="prodigi-price-row">
                    <span>Shipping</span>
                    <span>
                      {loadingShipping ? <Loader2 size={14} className="spin" /> : shippingPrice != null ? `€${shippingPrice.toFixed(2)}` : '—'}
                    </span>
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
                  disabled={checkingOut || loadingShipping}
                >
                  {checkingOut ? (
                    <><Loader2 className="spin" size={16} /> Processing…</>
                  ) : (
                    <><Package size={16} /> Order Now · €{totalPrice.toFixed(2)}</>
                  )}
                </button>

                <p className="prodigi-legal">
                  Fulfilled by Prodigi. Ships worldwide. 100% satisfaction guarantee.
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
