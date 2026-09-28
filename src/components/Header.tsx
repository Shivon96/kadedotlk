import React, { useState } from 'react';
import { ShoppingBag, Search, ShieldCheck, Lock, X, Menu, PhoneCall, Sparkles } from 'lucide-react';
import { ProductCategory } from '../types';
import { CATEGORIES_LIST } from '../data/initialProducts';

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  selectedCategory: ProductCategory;
  onSelectCategory: (cat: ProductCategory) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isAdminLoggedIn: boolean;
  onOpenAdminAuth: () => void;
  onToggleAdminView: () => void;
  isAdminViewActive: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  onOpenCart,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  isAdminLoggedIn,
  onOpenAdminAuth,
  onToggleAdminView,
  isAdminViewActive,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearchMobile, setShowSearchMobile] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Top micro announcement bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 text-amber-400 font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>කඩේ ඩොට්LK Official Store</span>
            </span>
            <span className="hidden sm:inline text-slate-500">·</span>
            <span className="hidden sm:inline">Islandwide Fast Delivery across Sri Lanka</span>
            <span className="hidden md:inline text-slate-500">·</span>
            <span className="hidden md:inline">100% Genuine Agent Warranty</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <a 
              href="tel:+94771234567" 
              className="hidden lg:flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors"
            >
              <PhoneCall className="w-3 h-3 text-emerald-400" />
              <span>077 123 4567</span>
            </a>
            
            {isAdminLoggedIn ? (
              <button
                onClick={onToggleAdminView}
                className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 text-[11px] font-sans font-semibold transition-colors"
              >
                <ShieldCheck className="w-3 h-3" />
                <span>{isAdminViewActive ? 'Exit Admin' : 'Admin Portal'}</span>
              </button>
            ) : (
              <button
                onClick={onOpenAdminAuth}
                title="Merchant & Product Upload Access"
                className="flex items-center gap-1 text-slate-400 hover:text-slate-200 transition-colors text-[11px] font-sans"
              >
                <Lock className="w-2.5 h-2.5" />
                <span>Merchant</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation (Strict Top Bar Contract: Zone 1 Wordmark, Zone 2 Nav, Zone 3 Actions) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          
          {/* Zone 1: Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button 
              onClick={() => {
                onSelectCategory('all');
                if (isAdminViewActive) onToggleAdminView();
              }}
              className="text-left group cursor-pointer focus-visible:outline-none"
            >
              <div className="flex items-baseline gap-1">
                <span className="font-sinhala text-2xl sm:text-3xl font-black tracking-tight text-slate-950 group-hover:text-amber-600 transition-colors">
                  කඩේ
                </span>
                <span className="text-xl sm:text-2xl font-black text-amber-500 font-display">
                  .lk
                </span>
              </div>
              <p className="text-[10px] uppercase tracking-widest font-semibold text-slate-500 -mt-1 hidden sm:block">
                Electronics & Appliances
              </p>
            </button>
          </div>

          {/* Search bar (Center for desktop) */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search TV, Refrigerator, Washing machine..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-full pl-9 pr-8 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Zone 2: Navigation Links for categories */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600">
            <button
              onClick={() => onSelectCategory('all')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap ${selectedCategory === 'all' ? 'text-amber-600 font-bold border-b-2 border-amber-500 pb-0.5' : ''}`}
            >
              All Items
            </button>
            <button
              onClick={() => onSelectCategory('refrigerators')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap ${selectedCategory === 'refrigerators' ? 'text-amber-600 font-bold border-b-2 border-amber-500 pb-0.5' : ''}`}
            >
              Refrigerators
            </button>
            <button
              onClick={() => onSelectCategory('washing_machines')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap ${selectedCategory === 'washing_machines' ? 'text-amber-600 font-bold border-b-2 border-amber-500 pb-0.5' : ''}`}
            >
              Washers
            </button>
            <button
              onClick={() => onSelectCategory('smart_tvs')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap ${selectedCategory === 'smart_tvs' ? 'text-amber-600 font-bold border-b-2 border-amber-500 pb-0.5' : ''}`}
            >
              Smart TVs
            </button>
            <button
              onClick={() => onSelectCategory('kitchen_appliances')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap ${selectedCategory === 'kitchen_appliances' ? 'text-amber-600 font-bold border-b-2 border-amber-500 pb-0.5' : ''}`}
            >
              Kitchen
            </button>
          </nav>

          {/* Zone 3: Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile search toggle */}
            <button
              onClick={() => setShowSearchMobile(!showSearchMobile)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
              aria-label="Toggle Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Shopping Cart button */}
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-colors active:scale-95 shadow-sm"
              aria-label="View Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline text-xs font-semibold">Cart</span>
              {cartCount > 0 ? (
                <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold text-slate-950 bg-amber-400 rounded-full tabular-nums">
                  {cartCount}
                </span>
              ) : (
                <span className="text-xs text-slate-400">0</span>
              )}
            </button>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
              aria-label="Open Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile search input field */}
        {showSearchMobile && (
          <div className="md:hidden pb-3 pt-1">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search TV, Inverter Refrigerator, Blender..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                autoFocus
                className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-8 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-slate-200 space-y-2">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-3 pb-1">
              Categories
            </div>
            {CATEGORIES_LIST.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  onSelectCategory(cat.id as ProductCategory);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors flex items-center justify-between ${selectedCategory === cat.id ? 'bg-amber-50 text-amber-700 font-semibold' : 'text-slate-700 hover:bg-slate-100'}`}
              >
                <span>{cat.name}</span>
                <span className="text-xs text-slate-400 font-sinhala">{cat.sinhala}</span>
              </button>
            ))}

            <div className="pt-3 border-t border-slate-100 px-3">
              {isAdminLoggedIn ? (
                <button
                  onClick={() => {
                    onToggleAdminView();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 px-3 bg-amber-500 text-slate-950 font-bold rounded-lg text-sm text-center"
                >
                  {isAdminViewActive ? 'Back to Customer Store' : 'Go to Merchant Dashboard'}
                </button>
              ) : (
                <button
                  onClick={() => {
                    onOpenAdminAuth();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2 px-3 text-slate-600 hover:bg-slate-100 rounded-lg text-xs flex items-center justify-center gap-1.5"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Store Owner / Merchant Login</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
