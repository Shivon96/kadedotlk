import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Product, CartItem, Order, ProductCategory } from './types';
import { 
  getStoredProducts, 
  saveStoredProducts, 
  resetStoredProducts, 
  getStoredOrders, 
  saveOrder, 
  updateOrderStatus 
} from './utils/storage';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { AdminAuthModal } from './components/AdminAuthModal';
import { AdminPortal } from './components/AdminPortal';
import { Footer } from './components/Footer';
import { CATEGORIES_LIST } from './data/initialProducts';
import { 
  SlidersHorizontal, 
  MessageCircle, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  RotateCcw,
  CheckCircle2,
  X
} from 'lucide-react';

export default function App() {
  // Store Data States
  const [products, setProducts] = useState<Product[]>(() => getStoredProducts());
  const [orders, setOrders] = useState<Order[]>(() => getStoredOrders());
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('kade_dot_lk_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Navigation & Filtering States
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price_low' | 'price_high' | 'rating'>('featured');
  const [onlyInStock, setOnlyInStock] = useState(false);

  // Modals & Drawers
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAdminAuthOpen, setIsAdminAuthOpen] = useState(false);
  
  // Admin & Merchant Modes
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return sessionStorage.getItem('kade_admin_authenticated') === 'true';
  });
  const [isAdminViewActive, setIsAdminViewActive] = useState(false);

  // Success Notification Banner
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const productGridRef = useRef<HTMLDivElement>(null);

  // Save Cart Changes
  useEffect(() => {
    try {
      localStorage.setItem('kade_dot_lk_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  // Toast Helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Cart operations
  const handleAddToCart = (product: Product, quantity: number = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    showToast(`Added ${product.name.slice(0, 28)}... to cart!`);
  };

  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveCartItem(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveCartItem = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleOrderSuccess = (order: Order) => {
    setOrders((prev) => [order, ...prev]);
    setCart([]); // Clear cart
  };

  // Merchant Actions
  const handleAddProduct = (newProd: Product) => {
    const updated = [newProd, ...products];
    setProducts(updated);
    saveStoredProducts(updated);
    showToast(`Product "${newProd.name.slice(0, 24)}..." successfully published!`);
  };

  const handleUpdateProduct = (updatedProd: Product) => {
    const updated = products.map((p) => p.id === updatedProd.id ? updatedProd : p);
    setProducts(updated);
    saveStoredProducts(updated);
    showToast('Product inventory updated!');
  };

  const handleDeleteProduct = (productId: string) => {
    const updated = products.filter((p) => p.id !== productId);
    setProducts(updated);
    saveStoredProducts(updated);
    showToast('Product removed from catalog.');
  };

  const handleUpdateOrderStatus = (orderId: string, status: Order['status']) => {
    const updated = updateOrderStatus(orderId, status);
    setOrders(updated);
  };

  const handleImportProducts = (imported: Product[]) => {
    setProducts(imported);
    saveStoredProducts(imported);
  };

  const handleResetProducts = () => {
    const defaults = resetStoredProducts();
    setProducts(defaults);
    showToast('Catalog restored to default appliances.');
  };

  const handleAdminAuthSuccess = () => {
    setIsAdminLoggedIn(true);
    sessionStorage.setItem('kade_admin_authenticated', 'true');
    setIsAdminViewActive(true);
    showToast('Welcome to Merchant Portal! You can now upload and manage products.');
  };

  // Distinct Brands for Filtering
  const availableBrands = useMemo(() => {
    const brands = new Set(products.map((p) => p.brand).filter(Boolean));
    return ['all', ...Array.from(brands)];
  }, [products]);

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category
        if (selectedCategory !== 'all' && p.category !== selectedCategory) {
          return false;
        }
        // In-Stock
        if (onlyInStock && !p.inStock) {
          return false;
        }
        // Brand
        if (selectedBrand !== 'all' && p.brand !== selectedBrand) {
          return false;
        }
        // Search
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchBrand = p.brand.toLowerCase().includes(q);
          const matchModel = p.modelNumber?.toLowerCase().includes(q);
          const matchDesc = p.description?.toLowerCase().includes(q);
          const matchSinhala = p.sinhalaName?.toLowerCase().includes(q);
          if (!matchName && !matchBrand && !matchModel && !matchDesc && !matchSinhala) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price_low') return a.price - b.price;
        if (sortBy === 'price_high') return b.price - a.price;
        if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
        // Featured default
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      });
  }, [products, selectedCategory, onlyInStock, selectedBrand, searchQuery, sortBy]);

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const scrollToGrid = () => {
    productGridRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA] text-slate-800 font-sans selection:bg-amber-400 selection:text-black">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs sm:text-sm font-semibold px-4 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-2.5 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
          <button 
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white ml-2"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main App Navigation */}
      <Header
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          if (isAdminViewActive) setIsAdminViewActive(false);
          scrollToGrid();
        }}
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          if (isAdminViewActive) setIsAdminViewActive(false);
        }}
        isAdminLoggedIn={isAdminLoggedIn}
        onOpenAdminAuth={() => setIsAdminAuthOpen(true)}
        onToggleAdminView={() => setIsAdminViewActive(!isAdminViewActive)}
        isAdminViewActive={isAdminViewActive}
      />

      {/* RENDER ADMIN PORTAL IF MERCHANT VIEW IS ACTIVE */}
      {isAdminViewActive ? (
        <AdminPortal
          products={products}
          orders={orders}
          onAddProduct={handleAddProduct}
          onUpdateProduct={handleUpdateProduct}
          onDeleteProduct={handleDeleteProduct}
          onUpdateOrderStatus={handleUpdateOrderStatus}
          onImportProducts={handleImportProducts}
          onResetProducts={handleResetProducts}
          onExitAdmin={() => setIsAdminViewActive(false)}
        />
      ) : (
        /* REGULAR ONLINE SHOPPER EXPERIENCE (Clean, Modern, No Upload Controls) */
        <main className="flex-1">
          
          {/* Hero Section */}
          <Hero
            onExploreClick={scrollToGrid}
            onSelectCategory={(cat) => {
              setSelectedCategory(cat);
              scrollToGrid();
            }}
          />

          {/* Interactive Category Segmented Tabs */}
          <section className="bg-white border-b border-slate-200 sticky top-16 sm:top-20 z-30 shadow-xs">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
                {CATEGORIES_LIST.map((cat) => {
                  const isActive = selectedCategory === cat.id;
                  const count = cat.id === 'all' 
                    ? products.length 
                    : products.filter(p => p.category === cat.id).length;

                  return (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategory(cat.id as ProductCategory);
                        scrollToGrid();
                      }}
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150 flex items-center gap-2 cursor-pointer ${
                        isActive
                          ? 'bg-slate-900 text-white shadow-sm'
                          : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                    >
                      <span>{cat.name}</span>
                      <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${isActive ? 'bg-amber-400 text-slate-950 font-bold' : 'bg-slate-200 text-slate-600'}`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Product Catalog Grid Section */}
          <section ref={productGridRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
            
            {/* Filter and Sorting Header Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-600 mb-1">
                  <span>කඩේ Genuine Collection</span>
                  <span aria-hidden="true">·</span>
                  <span>Sri Lanka Official Stock</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold font-display text-slate-900">
                  {selectedCategory === 'all'
                    ? 'All Household Electronics & Devices'
                    : CATEGORIES_LIST.find((c) => c.id === selectedCategory)?.name}
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Showing <span className="font-bold text-slate-800">{filteredProducts.length}</span> verified appliances
                </p>
              </div>

              {/* Filtering Controls */}
              <div className="flex flex-wrap items-center gap-3 text-xs">
                {/* Brand Selector */}
                {availableBrands.length > 2 && (
                  <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-2xs">
                    <span className="text-slate-400 font-medium">Brand:</span>
                    <select
                      value={selectedBrand}
                      onChange={(e) => setSelectedBrand(e.target.value)}
                      className="bg-transparent font-semibold text-slate-800 focus:outline-none cursor-pointer"
                    >
                      <option value="all">All Brands</option>
                      {availableBrands.filter(b => b !== 'all').map((b) => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Sort By */}
                <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-2xs">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-transparent font-semibold text-slate-800 focus:outline-none cursor-pointer"
                  >
                    <option value="featured">Featured First</option>
                    <option value="price_low">Price: Low to High</option>
                    <option value="price_high">Price: High to Low</option>
                    <option value="rating">Top Rated</option>
                  </select>
                </div>

                {/* In Stock toggle */}
                <label className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 cursor-pointer shadow-2xs">
                  <input
                    type="checkbox"
                    checked={onlyInStock}
                    onChange={(e) => setOnlyInStock(e.target.checked)}
                    className="w-3.5 h-3.5 rounded text-amber-500 focus:ring-amber-400"
                  />
                  <span className="font-medium text-slate-700">In Stock Only</span>
                </label>

                {/* Clear search or filters if active */}
                {(searchQuery || selectedBrand !== 'all' || selectedCategory !== 'all' || onlyInStock) && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedBrand('all');
                      setSelectedCategory('all');
                      setOnlyInStock(false);
                    }}
                    className="flex items-center gap-1 px-3 py-2 rounded-xl text-slate-500 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset</span>
                  </button>
                )}
              </div>
            </div>

            {/* Products Grid (3-column desktop baseline adhering to references/1_ecommerce_retail.md) */}
            {filteredProducts.length === 0 ? (
              <div className="py-20 text-center bg-white rounded-3xl border border-slate-200/80 my-8 p-8">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4 text-slate-400">
                  <SlidersHorizontal className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 font-display">No appliances found</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Try clearing your search query or adjusting your category and brand filters.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedBrand('all');
                    setSelectedCategory('all');
                    setOnlyInStock(false);
                  }}
                  className="mt-5 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800"
                >
                  View All Appliances
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 pt-8">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onSelect={(p) => setSelectedProduct(p)}
                    onAddToCart={(p) => handleAddToCart(p, 1)}
                  />
                ))}
              </div>
            )}
          </section>

          {/* Value Proposition & Inverter Energy Savings Banner */}
          <section className="bg-slate-900 text-white py-14 border-t border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                <div className="md:col-span-8 space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                    <Zap className="w-4 h-4" />
                    <span>Cut Down Sri Lanka Electricity Costs</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold font-display text-white">
                    Why Upgrade to Our Digital Inverter Appliances?
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed max-w-2xl font-light">
                    Modern inverter compressors and motors automatically modulate power according to daily household load. Unlike traditional on/off motors, inverter technology saves up to 55% electricity and runs with whisper-quiet durability guaranteed by 10-year motor warranties.
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 text-xs">
                    <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
                      <div className="font-bold text-amber-400 font-mono text-base">55% Less Power</div>
                      <div className="text-slate-400 mt-0.5">Tested under tropical ambient heat</div>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
                      <div className="font-bold text-amber-400 font-mono text-base">10-Yr Guarantee</div>
                      <div className="text-slate-400 mt-0.5">Authorised agent compressor protection</div>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
                      <div className="font-bold text-amber-400 font-mono text-base">Islandwide Care</div>
                      <div className="text-slate-400 mt-0.5">Doorstep technician diagnostics</div>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-4 flex flex-col justify-center items-start md:items-end">
                  <a
                    href="https://wa.me/94771234567?text=Hello%20Kade.lk!%20I%20would%20like%20guidance%20on%20choosing%20the%20best%20energy-saving%20appliance%20for%20my%20home."
                    target="_blank"
                    rel="noreferrer"
                    className="px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg transition-transform active:scale-95"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Talk to an Appliance Specialist</span>
                  </a>
                  <span className="text-[11px] text-slate-400 mt-2">
                    Direct WhatsApp response within 10 minutes
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Floating WhatsApp Quick Consultation Button for Sri Lankan shoppers */}
          <div className="fixed bottom-6 left-6 z-40">
            <a
              href="https://wa.me/94771234567?text=Hello%20Kade.lk!%20I%20have%20an%20inquiry%20about%20your%20products."
              target="_blank"
              rel="noreferrer"
              className="group flex items-center gap-2.5 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-3 rounded-full shadow-2xl transition-all duration-200 hover:scale-105 active:scale-95"
              aria-label="Chat on WhatsApp"
            >
              <MessageCircle className="w-5 h-5 text-white" />
              <span className="hidden sm:inline text-xs font-bold tracking-wide">
                කඩේ Support
              </span>
            </a>
          </div>

        </main>
      )}

      {/* Footer */}
      <Footer
        onOpenAdminAuth={() => setIsAdminAuthOpen(true)}
        isAdminLoggedIn={isAdminLoggedIn}
        onToggleAdminView={() => setIsAdminViewActive(!isAdminViewActive)}
      />

      {/* Modals & Slide-over Drawers */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={(prod, qty) => {
          handleAddToCart(prod, qty);
          setSelectedProduct(null);
        }}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onProceedToCheckout={handleProceedToCheckout}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cart}
        onOrderSuccess={handleOrderSuccess}
      />

      <AdminAuthModal
        isOpen={isAdminAuthOpen}
        onClose={() => setIsAdminAuthOpen(false)}
        onSuccess={handleAdminAuthSuccess}
      />

    </div>
  );
}
