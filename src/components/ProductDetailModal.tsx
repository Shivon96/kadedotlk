import React, { useState } from 'react';
import { Product } from '../types';
import { formatLKR } from '../utils/storage';
import { X, ShieldCheck, Truck, MessageCircle, ShoppingBag, Check, CheckCircle2 } from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeTab, setActiveTab] = useState<'specs' | 'features'>('specs');

  if (!product) return null;

  const handleAdd = () => {
    onAddToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleWhatsAppOrder = () => {
    const text = encodeURIComponent(
      `Hello Kade.lk! 🛍️\nI would like to inquire about ordering:\n\n*Product:* ${product.name}\n*Model:* ${product.modelNumber}\n*Price:* ${formatLKR(product.price)}\n*Quantity:* ${quantity}\n\nCould you please let me know delivery timeframe and payment options? Thank you!`
    );
    window.open(`https://wa.me/94771234567?text=${text}`, '_blank');
  };

  const discountPercent = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-sm overflow-y-auto animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          aria-label="Close details"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 max-h-[85vh] overflow-y-auto">
          
          {/* Left Column: Image & Highlights (md:col-span-6) */}
          <div className="md:col-span-6 bg-slate-50 p-6 sm:p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-200">
            <div className="relative aspect-[4/3] w-full flex items-center justify-center overflow-hidden rounded-2xl bg-white p-4 shadow-sm border border-slate-100">
              <img
                src={product.image}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain mix-blend-multiply"
              />
              {product.badge && (
                <span className="absolute top-3 left-3 bg-slate-900 text-white text-xs font-semibold px-3 py-1 rounded-md uppercase tracking-wider">
                  {product.badge}
                </span>
              )}
            </div>

            {/* Warranty Guarantee Box */}
            <div className="mt-6 p-4 rounded-xl bg-amber-50/80 border border-amber-200/80 text-amber-900 text-xs space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-amber-950">
                <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Sri Lanka Official Agent Warranty Guaranteed</span>
              </div>
              <p className="text-amber-800 leading-relaxed">
                {product.warrantyDetails || `${product.warrantyYears} Years Comprehensive Warranty covered with genuine spare parts.`}
              </p>
            </div>

            <div className="mt-4 flex items-center justify-between text-xs text-slate-500 font-medium px-1">
              <span className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-slate-700" />
                <span>Colombo: 24-48 hrs</span>
              </span>
              <span>·</span>
              <span>Outstation: 2-3 business days</span>
            </div>
          </div>

          {/* Right Column: Contiguous Purchase Module & Specs (md:col-span-6) */}
          <div className="md:col-span-6 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div>
              {/* Brand and Model */}
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                <span className="font-bold uppercase tracking-wider text-slate-700">
                  {product.brand}
                </span>
                <span className="font-mono text-slate-400">
                  Model: {product.modelNumber}
                </span>
              </div>

              {/* Product Title */}
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
                {product.name}
              </h2>

              {product.sinhalaName && (
                <div className="text-xs text-slate-500 font-sinhala mt-1">
                  {product.sinhalaName}
                </div>
              )}

              {/* Pricing Display */}
              <div className="mt-4 flex items-baseline gap-3">
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-950 font-mono tabular-nums">
                  {formatLKR(product.price)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <>
                    <span className="text-sm text-slate-400 line-through font-mono tabular-nums">
                      {formatLKR(product.originalPrice)}
                    </span>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      Save {formatLKR(product.originalPrice - product.price)} ({discountPercent}% OFF)
                    </span>
                  </>
                )}
              </div>

              {/* Stock Status */}
              <div className="mt-2 text-xs font-semibold flex items-center gap-2">
                {product.inStock ? (
                  <span className="text-emerald-700 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>In Stock ({product.stockQuantity} units available)</span>
                  </span>
                ) : (
                  <span className="text-red-600">Currently Out of Stock</span>
                )}
              </div>

              {/* Description */}
              <p className="mt-4 text-sm text-slate-600 leading-relaxed">
                {product.description}
              </p>

              {/* Specs & Features Tab Control */}
              <div className="mt-6 border-b border-slate-200 flex gap-4 text-xs font-semibold">
                <button
                  onClick={() => setActiveTab('specs')}
                  className={`pb-2 transition-colors ${activeTab === 'specs' ? 'text-amber-600 border-b-2 border-amber-500' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  Technical Specifications
                </button>
                <button
                  onClick={() => setActiveTab('features')}
                  className={`pb-2 transition-colors ${activeTab === 'features' ? 'text-amber-600 border-b-2 border-amber-500' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  Key Highlights
                </button>
              </div>

              {/* Tab Content */}
              <div className="mt-3">
                {activeTab === 'specs' ? (
                  <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                    {Object.entries(product.specs || {}).map(([key, val]) => (
                      <div key={key} className="py-1 border-b border-slate-100">
                        <dt className="text-slate-400 font-medium">{key}</dt>
                        <dd className="font-semibold text-slate-800 font-mono">{val}</dd>
                      </div>
                    ))}
                  </dl>
                ) : (
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {product.features?.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Contiguous Purchase Action Module */}
            <div className="pt-6 border-t border-slate-200 space-y-3">
              <div className="flex items-center gap-3">
                {/* Quantity selector */}
                <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden bg-slate-50">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-slate-700 hover:bg-slate-200 transition-colors font-bold text-sm"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="px-3 py-2 text-sm font-semibold font-mono tabular-nums text-slate-900 min-w-[36px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 text-slate-700 hover:bg-slate-200 transition-colors font-bold text-sm"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart button */}
                <button
                  onClick={handleAdd}
                  disabled={!product.inStock}
                  className={`flex-1 py-3 px-5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md ${
                    added
                      ? 'bg-emerald-600 text-white'
                      : product.inStock
                      ? 'bg-slate-900 hover:bg-slate-800 text-white'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {added ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Bag!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4 text-amber-400" />
                      <span>Add to Shopping Cart</span>
                    </>
                  )}
                </button>
              </div>

              {/* Direct WhatsApp Order Button */}
              <button
                onClick={handleWhatsAppOrder}
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Order Direct on WhatsApp (කඩේ Quick Chat)</span>
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
