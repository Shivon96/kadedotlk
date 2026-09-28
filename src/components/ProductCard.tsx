import React, { useState } from 'react';
import { Product } from '../types';
import { formatLKR } from '../utils/storage';
import { Plus, Eye, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  onAddToCart,
}) => {
  const [addedRecently, setAddedRecently] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product);
    setAddedRecently(true);
    setTimeout(() => setAddedRecently(false), 1200);
  };

  const discountPercent = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <article
      onClick={() => onSelect(product)}
      className="group relative flex flex-col bg-white border border-slate-200/90 rounded-2xl overflow-hidden hover:border-slate-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-200 cursor-pointer"
    >
      {/* Product Image Slot (65%-70% of card visual presence) on clean neutral surface */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F8F9FA] flex items-center justify-center p-3 border-b border-slate-100">
        {!imageError && product.image ? (
          <img
            src={product.image}
            alt={product.name}
            onError={() => setImageError(true)}
            referrerPolicy="no-referrer"
            className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300 ease-out"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-400 p-4 text-center">
            <span className="text-2xl font-bold font-display text-slate-300">{product.brand}</span>
            <span className="text-xs text-slate-500 mt-1">{product.category.replace('_', ' ')}</span>
          </div>
        )}

        {/* Max 1 subtle text tag: e.g. Bestseller or Inverter Tech (Clean unboxed text tag) */}
        {product.badge && (
          <div className="absolute top-3 left-3 bg-slate-900/90 text-white text-[11px] font-semibold px-2.5 py-1 rounded-md tracking-wider uppercase backdrop-blur-sm">
            {product.badge}
          </div>
        )}

        {discountPercent && (
          <div className="absolute top-3 right-3 bg-red-600 text-white text-[11px] font-bold px-2 py-0.5 rounded font-mono">
            -{discountPercent}%
          </div>
        )}

        {/* Quick View hover affordance */}
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="bg-white/95 text-slate-900 text-xs font-semibold px-3 py-1.5 rounded-lg shadow-md flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform">
            <Eye className="w-3.5 h-3.5" />
            <span>View Specs</span>
          </span>
        </div>
      </div>

      {/* Product Card Details */}
      <div className="flex flex-col flex-1 p-4 sm:p-5 justify-between gap-3">
        <div>
          {/* Brand & Model metadata (clean, unboxed text) */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
            <span className="font-semibold uppercase tracking-wider text-slate-600">
              {product.brand}
            </span>
            <span className="font-mono text-[11px]">
              {product.modelNumber}
            </span>
          </div>

          {/* Product Title */}
          <h3 className="text-sm sm:text-base font-semibold text-slate-900 line-clamp-2 leading-snug group-hover:text-amber-700 transition-colors">
            {product.name}
          </h3>

          {/* Warranty tag */}
          <div className="mt-1.5 text-xs text-emerald-700 font-medium flex items-center gap-1">
            <span>🛡️ {product.warrantyYears}-Year Agent Warranty</span>
          </div>
        </div>

        {/* Price & Action Row */}
        <div className="pt-2 border-t border-slate-100 flex items-end justify-between gap-2">
          <div>
            <div className="text-xs text-slate-400 font-medium">Price</div>
            <div className="flex items-baseline gap-2">
              <span className="text-base sm:text-lg font-bold text-slate-900 font-mono tabular-nums tracking-tight">
                {formatLKR(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xs text-slate-400 line-through font-mono tabular-nums">
                  {formatLKR(product.originalPrice)}
                </span>
              )}
            </div>
          </div>

          {/* Quick Add to Cart button */}
          <button
            onClick={handleAdd}
            disabled={!product.inStock}
            className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150 flex items-center gap-1.5 shrink-0 active:scale-95 ${
              addedRecently
                ? 'bg-emerald-600 text-white'
                : product.inStock
                ? 'bg-slate-900 text-white hover:bg-amber-500 hover:text-slate-950'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
            aria-label={`Add ${product.name} to cart`}
          >
            {addedRecently ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added</span>
              </>
            ) : product.inStock ? (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Add</span>
              </>
            ) : (
              <span>Out of Stock</span>
            )}
          </button>
        </div>
      </div>
    </article>
  );
};
