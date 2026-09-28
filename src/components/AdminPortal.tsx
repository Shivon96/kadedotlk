import React, { useState, useRef } from 'react';
import { Product, Order, ProductCategory } from '../types';
import { CATEGORIES_LIST } from '../data/initialProducts';
import { formatLKR, exportProductsAsJSON, setAdminPIN, getAdminPIN } from '../utils/storage';
import { 
  PackagePlus, 
  Boxes, 
  ShoppingBag, 
  Globe, 
  Upload, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  Download, 
  RefreshCw, 
  ShieldCheck, 
  Key, 
  ExternalLink,
  MessageCircle,
  Eye,
  Plus
} from 'lucide-react';

interface AdminPortalProps {
  products: Product[];
  orders: Order[];
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onUpdateOrderStatus: (orderId: string, status: Order['status']) => void;
  onImportProducts: (imported: Product[]) => void;
  onResetProducts: () => void;
  onExitAdmin: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  products,
  orders,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onUpdateOrderStatus,
  onImportProducts,
  onResetProducts,
  onExitAdmin,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'inventory' | 'orders' | 'netlify'>('upload');
  
  // Product Form State
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [sinhalaName, setSinhalaName] = useState('');
  const [category, setCategory] = useState<Product['category']>('kitchen_appliances');
  const [brand, setBrand] = useState('');
  const [modelNumber, setModelNumber] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [originalPrice, setOriginalPrice] = useState<number | ''>('');
  const [stockQuantity, setStockQuantity] = useState<number>(5);
  const [inStock, setInStock] = useState(true);
  const [warrantyYears, setWarrantyYears] = useState<number>(2);
  const [warrantyDetails, setWarrantyDetails] = useState('');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [sinhalaDescription, setSinhalaDescription] = useState('');
  const [badge, setBadge] = useState<Product['badge'] | ''>('Bestseller');
  const [isFeatured, setIsFeatured] = useState(true);

  // Dynamic specs and features
  const [specKey, setSpecKey] = useState('');
  const [specVal, setSpecVal] = useState('');
  const [specs, setSpecs] = useState<Record<string, string>>({
    'Capacity': '450L',
    'Energy Efficiency': '5 Star Inverter',
    'Voltage': '230V / 50Hz'
  });

  const [featureInput, setFeatureInput] = useState('');
  const [features, setFeatures] = useState<string[]>([
    'High efficiency inverter motor with 10-year warranty',
    'Digital touch temperature control panel'
  ]);

  const [saveSuccess, setSaveSuccess] = useState(false);
  const [newPin, setNewPin] = useState('');
  const [pinChangeStatus, setPinChangeStatus] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const jsonImportRef = useRef<HTMLInputElement>(null);

  // Handle image upload from user device
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Image is larger than 2MB. Please select a smaller photo or compress it.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddSpec = () => {
    if (specKey.trim() && specVal.trim()) {
      setSpecs(prev => ({ ...prev, [specKey.trim()]: specVal.trim() }));
      setSpecKey('');
      setSpecVal('');
    }
  };

  const handleRemoveSpec = (key: string) => {
    const next = { ...specs };
    delete next[key];
    setSpecs(next);
  };

  const handleAddFeature = () => {
    if (featureInput.trim()) {
      setFeatures(prev => [...prev, featureInput.trim()]);
      setFeatureInput('');
    }
  };

  const handleRemoveFeature = (index: number) => {
    setFeatures(prev => prev.filter((_, i) => i !== index));
  };

  const handleResetForm = () => {
    setEditingProductId(null);
    setName('');
    setSinhalaName('');
    setCategory('kitchen_appliances');
    setBrand('');
    setModelNumber('');
    setPrice('');
    setOriginalPrice('');
    setStockQuantity(5);
    setInStock(true);
    setWarrantyYears(2);
    setWarrantyDetails('');
    setImage('');
    setDescription('');
    setSinhalaDescription('');
    setBadge('Bestseller');
    setIsFeatured(true);
    setSpecs({
      'Capacity': '450L',
      'Power': '1500W',
      'Voltage': '230V'
    });
    setFeatures([
      'Advanced digital temperature control',
      'Energy saving smart inverter technology'
    ]);
  };

  const handleEditProductClick = (prod: Product) => {
    setEditingProductId(prod.id);
    setName(prod.name);
    setSinhalaName(prod.sinhalaName || '');
    setCategory(prod.category);
    setBrand(prod.brand);
    setModelNumber(prod.modelNumber);
    setPrice(prod.price);
    setOriginalPrice(prod.originalPrice || '');
    setStockQuantity(prod.stockQuantity);
    setInStock(prod.inStock);
    setWarrantyYears(prod.warrantyYears);
    setWarrantyDetails(prod.warrantyDetails);
    setImage(prod.image);
    setDescription(prod.description);
    setSinhalaDescription(prod.sinhalaDescription || '');
    setBadge(prod.badge || '');
    setIsFeatured(!!prod.isFeatured);
    setSpecs(prod.specs || {});
    setFeatures(prod.features || []);
    setActiveTab('upload');
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !brand.trim() || !price || !image.trim()) {
      alert('Please fill in Product Name, Brand, Price and provide a Product Image.');
      return;
    }

    const numericPrice = Number(price);
    const numericOriginalPrice = originalPrice ? Number(originalPrice) : undefined;

    if (editingProductId) {
      const updated: Product = {
        id: editingProductId,
        name,
        sinhalaName: sinhalaName || undefined,
        category,
        brand,
        modelNumber: modelNumber || 'KD-' + Math.floor(1000 + Math.random() * 9000),
        price: numericPrice,
        originalPrice: numericOriginalPrice,
        stockQuantity: Number(stockQuantity),
        inStock,
        warrantyYears: Number(warrantyYears),
        warrantyDetails: warrantyDetails || `${warrantyYears} Years Comprehensive Agent Warranty`,
        rating: 5.0,
        reviewCount: 1,
        image,
        description: description || `${name} by ${brand}. High-quality household appliance with full agent support.`,
        sinhalaDescription: sinhalaDescription || undefined,
        features: features.length > 0 ? features : ['Standard official agent features'],
        specs,
        badge: badge ? (badge as any) : undefined,
        isFeatured,
        createdAt: new Date().toISOString()
      };
      onUpdateProduct(updated);
    } else {
      const newProduct: Product = {
        id: 'kade-prod-' + Date.now(),
        name,
        sinhalaName: sinhalaName || undefined,
        category,
        brand,
        modelNumber: modelNumber || 'KD-' + Math.floor(1000 + Math.random() * 9000),
        price: numericPrice,
        originalPrice: numericOriginalPrice,
        stockQuantity: Number(stockQuantity),
        inStock,
        warrantyYears: Number(warrantyYears),
        warrantyDetails: warrantyDetails || `${warrantyYears} Years Comprehensive Agent Warranty`,
        rating: 5.0,
        reviewCount: 1,
        image,
        description: description || `${name} by ${brand}. High-quality household appliance with full agent support.`,
        sinhalaDescription: sinhalaDescription || undefined,
        features: features.length > 0 ? features : ['Standard official agent features'],
        specs,
        badge: badge ? (badge as any) : undefined,
        isFeatured,
        createdAt: new Date().toISOString()
      };
      onAddProduct(newProduct);
    }

    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      handleResetForm();
      setActiveTab('inventory');
    }, 1200);
  };

  const handleJsonUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (Array.isArray(parsed) && parsed.length > 0) {
            onImportProducts(parsed);
            alert(`Successfully imported ${parsed.length} products!`);
          } else {
            alert('Invalid product JSON file structure.');
          }
        } catch {
          alert('Failed to parse JSON file.');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleChangePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin.length < 4) {
      setPinChangeStatus('PIN must be at least 4 digits');
      return;
    }
    const ok = setAdminPIN(newPin);
    if (ok) {
      setPinChangeStatus('PIN updated successfully!');
      setNewPin('');
      setTimeout(() => setPinChangeStatus(null), 3000);
    }
  };

  return (
    <div className="bg-slate-100 min-h-screen pb-16">
      
      {/* Merchant Top Bar */}
      <div className="bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold">
              <Boxes className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold font-display">Merchant Portal (කඩේ ඩොට්LK)</h1>
                <span className="text-[10px] bg-amber-500 text-slate-950 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Store Owner Mode
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Hidden from online shoppers · Upload and manage electronics inventory
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onExitAdmin}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 transition-colors"
            >
              <Eye className="w-4 h-4 text-amber-400" />
              <span>View Customer Storefront</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3 mb-6">
          <button
            onClick={() => setActiveTab('upload')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'upload'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-200'
            }`}
          >
            <PackagePlus className="w-4 h-4 text-amber-400" />
            <span>{editingProductId ? 'Edit Product' : 'Upload New Product'}</span>
          </button>

          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'inventory'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Boxes className="w-4 h-4 text-amber-400" />
            <span>Product Inventory ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'orders'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-200'
            }`}
          >
            <ShoppingBag className="w-4 h-4 text-amber-400" />
            <span>Customer Orders ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('netlify')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'netlify'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Globe className="w-4 h-4 text-emerald-400" />
            <span>Netlify Deploy & Backup</span>
          </button>
        </div>

        {/* TAB 1: PRODUCT UPLOAD / EDIT FORM */}
        {activeTab === 'upload' && (
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900 font-display">
                  {editingProductId ? 'Edit Appliance Details' : 'Upload New Appliance or Electronic Device'}
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Add photos, brand, price, warranty and technical specs for your store catalog.
                </p>
              </div>
              {editingProductId && (
                <button
                  onClick={handleResetForm}
                  className="text-xs text-slate-500 hover:text-slate-800 underline"
                >
                  Cancel Edit (Create New)
                </button>
              )}
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-6">
              
              {/* Basic Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Product Title (English) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Samsung 450L Twin Cooling Plus Inverter Refrigerator"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Product Name (Sinhala - විකල්ප)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. සැම්සුන්ග් 450L ඉන්වර්ටර් ශීතකරණය"
                    value={sinhalaName}
                    onChange={(e) => setSinhalaName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none font-sinhala"
                  />
                </div>
              </div>

              {/* Category, Brand, Model */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
                  >
                    <option value="refrigerators">Refrigerators & Freezers</option>
                    <option value="washing_machines">Washing Machines & Dryers</option>
                    <option value="smart_tvs">Smart 4K TVs & Audio</option>
                    <option value="kitchen_appliances">Kitchen & Cooking</option>
                    <option value="cooling_air">Inverter Air Conditioners</option>
                    <option value="home_electronics">Home Electronics</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Brand *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Samsung, LG, Panasonic, Singer"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Model Number
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. RT45K6340SL"
                    value={modelNumber}
                    onChange={(e) => setModelNumber(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* Pricing & Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Selling Price (LKR) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    placeholder="e.g. 389900"
                    value={price}
                    onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Original / MRP Price (Optional)
                  </label>
                  <input
                    type="number"
                    min={1}
                    placeholder="e.g. 425000"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Stock Units Available
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={stockQuantity}
                    onChange={(e) => setStockQuantity(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono"
                  />
                </div>

                <div className="flex items-center gap-3 pt-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={inStock}
                      onChange={(e) => setInStock(e.target.checked)}
                      className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400"
                    />
                    <span className="text-xs font-bold text-slate-800">In Stock</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isFeatured}
                      onChange={(e) => setIsFeatured(e.target.checked)}
                      className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400"
                    />
                    <span className="text-xs font-bold text-slate-800">Featured</span>
                  </label>
                </div>
              </div>

              {/* Warranty & Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Warranty (Years)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={20}
                    value={warrantyYears}
                    onChange={(e) => setWarrantyYears(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Warranty Description
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 10 Years Inverter Motor + 2 Years Full Agent"
                    value={warrantyDetails}
                    onChange={(e) => setWarrantyDetails(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Product Badge
                  </label>
                  <select
                    value={badge}
                    onChange={(e) => setBadge(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
                  >
                    <option value="">None</option>
                    <option value="Bestseller">Bestseller</option>
                    <option value="New Arrival">New Arrival</option>
                    <option value="Inverter Tech">Inverter Tech</option>
                    <option value="Agent Warranty">Agent Warranty</option>
                    <option value="Hot Deal">Hot Deal</option>
                  </select>
                </div>
              </div>

              {/* Product Image Upload & Preview */}
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-800">
                    Product Image (Photo Upload or Image URL) *
                  </label>
                  <span className="text-[11px] text-slate-500">
                    Supports instant file upload from your device
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  <div className="md:col-span-8 space-y-3">
                    {/* Device File Input */}
                    <div className="flex items-center gap-3">
                      <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleImageFileUpload}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-2"
                      >
                        <Upload className="w-4 h-4 text-amber-400" />
                        <span>Upload Photo from Computer / Phone</span>
                      </button>
                      <span className="text-xs text-slate-400">or enter web link below</span>
                    </div>

                    {/* URL Input */}
                    <input
                      type="text"
                      placeholder="Paste Image URL (https://...)"
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono"
                    />
                  </div>

                  {/* Image Live Preview */}
                  <div className="md:col-span-4 flex items-center justify-center">
                    <div className="w-32 h-28 rounded-xl bg-white border border-slate-200 p-2 flex items-center justify-center overflow-hidden shadow-inner">
                      {image ? (
                        <img
                          src={image}
                          alt="Product preview"
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="text-[11px] text-slate-400 text-center">
                          Image preview will appear here
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Technical Specifications (Capacity, Dimensions, Power, etc.) */}
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-800">
                    Technical Specifications
                  </label>
                  <span className="text-[11px] text-slate-500">
                    e.g. Capacity, Dimensions, Power, Voltage
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 items-center">
                  <input
                    type="text"
                    placeholder="Spec Name (e.g. Capacity)"
                    value={specKey}
                    onChange={(e) => setSpecKey(e.target.value)}
                    className="px-3 py-1.5 text-xs border border-slate-300 rounded-lg flex-1 min-w-[120px]"
                  />
                  <input
                    type="text"
                    placeholder="Spec Value (e.g. 450 Liters)"
                    value={specVal}
                    onChange={(e) => setSpecVal(e.target.value)}
                    className="px-3 py-1.5 text-xs border border-slate-300 rounded-lg flex-1 min-w-[120px]"
                  />
                  <button
                    type="button"
                    onClick={handleAddSpec}
                    className="px-3 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Spec</span>
                  </button>
                </div>

                {/* Specs List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                  {Object.entries(specs).map(([k, v]) => (
                    <div key={k} className="flex items-center justify-between bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-xs">
                      <span className="text-slate-500 font-medium">{k}:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-800 font-mono">{v}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSpec(k)}
                          className="text-slate-400 hover:text-red-500"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Features Bullets */}
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-800">
                    Key Features & Bullet Points
                  </label>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. 5 conversion cooling modes for seasonal energy savings"
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    className="px-3 py-1.5 text-xs border border-slate-300 rounded-lg flex-1"
                  />
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="px-3 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>

                <ul className="space-y-1.5 pt-1">
                  {features.map((feat, idx) => (
                    <li key={idx} className="flex items-center justify-between bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-xs">
                      <span className="text-slate-700">{feat}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(idx)}
                        className="text-slate-400 hover:text-red-500 ml-2"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Product Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Detailed description of features, durability and genuine agent guarantee..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center gap-3 pt-4 border-t border-slate-200">
                <button
                  type="submit"
                  className="px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm flex items-center gap-2 shadow-md transition-all active:scale-95"
                >
                  {saveSuccess ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-900" />
                      <span>Saved Successfully!</span>
                    </>
                  ) : (
                    <>
                      <PackagePlus className="w-4 h-4" />
                      <span>{editingProductId ? 'Update Appliance' : 'Publish Product to Store'}</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleResetForm}
                  className="px-5 py-3.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-sm font-semibold transition-colors"
                >
                  Clear Form
                </button>
              </div>

            </form>
          </div>
        )}

        {/* TAB 2: INVENTORY LIST & ACTIONS */}
        {activeTab === 'inventory' && (
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 font-display">
                  Live Product Inventory ({products.length})
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Update pricing, toggle stock availability, edit details, or remove products.
                </p>
              </div>

              <button
                onClick={() => {
                  handleResetForm();
                  setActiveTab('upload');
                }}
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-2"
              >
                <Plus className="w-4 h-4 text-amber-400" />
                <span>Add Another Product</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Product</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Price (LKR)</th>
                    <th className="py-3 px-4">Stock</th>
                    <th className="py-3 px-4">Warranty</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 p-1 shrink-0 overflow-hidden">
                            <img
                              src={p.image}
                              alt={p.name}
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900 line-clamp-1">{p.name}</div>
                            <div className="text-[11px] text-slate-400 font-mono">{p.brand} · {p.modelNumber}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-600 capitalize">
                        {p.category.replace('_', ' ')}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-900 tabular-nums">
                        {formatLKR(p.price)}
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => {
                            onUpdateProduct({ ...p, inStock: !p.inStock });
                          }}
                          className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors ${
                            p.inStock
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-red-100 text-red-800 hover:bg-red-200'
                          }`}
                        >
                          {p.inStock ? `In Stock (${p.stockQuantity})` : 'Out of Stock'}
                        </button>
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {p.warrantyYears} Years
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEditProductClick(p)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors"
                            title="Edit Product"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete ${p.name}?`)) {
                                onDeleteProduct(p.id);
                              }
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: CUSTOMER ORDERS */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-xl font-bold text-slate-900 font-display">
                Customer Orders & Inquiries ({orders.length})
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Orders placed through the store checkout. Coordinate delivery with customers.
              </p>
            </div>

            {orders.length === 0 ? (
              <div className="p-12 text-center text-slate-400">
                <ShoppingBag className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                <p className="text-sm font-semibold text-slate-600">No customer orders recorded yet</p>
                <p className="text-xs text-slate-400 mt-1">
                  When a customer completes checkout on your store, the details appear here.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {orders.map((ord) => (
                  <div key={ord.id} className="p-6 hover:bg-slate-50/50 transition-colors space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-900 text-sm">#{ord.id}</span>
                          <span className="text-slate-400">·</span>
                          <span className="text-xs text-slate-500">
                            {new Date(ord.createdAt).toLocaleDateString()} at {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <div className="text-sm font-semibold text-slate-900 mt-0.5">
                          {ord.customerName}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <select
                          value={ord.status}
                          onChange={(e) => onUpdateOrderStatus(ord.id, e.target.value as any)}
                          className="px-3 py-1 text-xs font-semibold rounded-lg border border-slate-300 bg-white"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Processing">Processing</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>

                        <a
                          href={`https://wa.me/${ord.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(ord.customerName)},%20this%20is%20Kade.lk%20regarding%20your%20Order%20${ord.id}.`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </a>
                      </div>
                    </div>

                    {/* Order Details Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                      <div>
                        <div className="text-slate-400 font-medium">Contact Phone</div>
                        <div className="font-mono font-semibold text-slate-800">{ord.phone}</div>
                      </div>
                      <div>
                        <div className="text-slate-400 font-medium">Delivery Destination</div>
                        <div className="text-slate-800">{ord.address}, {ord.city} ({ord.district})</div>
                      </div>
                      <div>
                        <div className="text-slate-400 font-medium">Payment Option</div>
                        <div className="font-semibold uppercase text-slate-800">{ord.paymentMethod}</div>
                      </div>
                    </div>

                    {/* Items List */}
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1">
                      {ord.items.map((it, i) => (
                        <div key={i} className="flex justify-between text-xs text-slate-700">
                          <span>{it.product.name} × {it.quantity}</span>
                          <span className="font-mono font-semibold">{formatLKR(it.product.price * it.quantity)}</span>
                        </div>
                      ))}
                      <div className="border-t border-slate-200 pt-1 mt-1 flex justify-between font-bold text-xs text-slate-900">
                        <span>Total (Including Islandwide Delivery)</span>
                        <span className="font-mono text-amber-600">{formatLKR(ord.total)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: NETLIFY DEPLOYMENT & CATALOG DATA BACKUP */}
        {activeTab === 'netlify' && (
          <div className="space-y-6">
            
            {/* Netlify Guide Card */}
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-5">
                <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-600 flex items-center justify-center font-bold">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 font-display">
                    How to Publish "කඩේ ඩොට්LK" to Netlify
                  </h2>
                  <p className="text-xs text-slate-500">
                    Step-by-step instructions to take this online store live on Netlify for free.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-600">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs">1</span>
                    <span>Generate Production Build</span>
                  </div>
                  <p>Run the build command in your terminal:</p>
                  <pre className="bg-slate-900 text-amber-400 p-2.5 rounded-lg font-mono text-[11px] overflow-x-auto">
                    npm run build
                  </pre>
                  <p className="text-slate-500">This creates the optimized static <code className="font-mono text-slate-800">dist/</code> folder.</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs">2</span>
                    <span>Deploy to Netlify</span>
                  </div>
                  <p>Go to <a href="https://app.netlify.com/drop" target="_blank" rel="noreferrer" className="text-teal-600 font-bold underline">netlify.com/drop</a> and drag & drop the <code className="font-mono text-slate-800">dist</code> folder!</p>
                  <p className="text-slate-500">Or connect your GitHub repository and set build command to <code className="font-mono text-slate-800">npm run build</code> with publish directory <code className="font-mono text-slate-800">dist</code>.</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs">3</span>
                    <span>SPA Redirects Included</span>
                  </div>
                  <p>We already configured <code className="font-mono text-slate-800">public/_redirects</code> so all subpages and reloads route cleanly on Netlify without 404 errors!</p>
                </div>
              </div>
            </div>

            {/* Catalog JSON Backup & Restore */}
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8">
              <div className="border-b border-slate-100 pb-4 mb-5">
                <h3 className="text-base font-bold text-slate-900 font-display">
                  Catalog Backup & Migration (JSON)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Download a backup file of your uploaded products, or restore products on a new browser/device.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => exportProductsAsJSON(products)}
                  className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-2"
                >
                  <Download className="w-4 h-4 text-amber-400" />
                  <span>Download Catalog Backup (.json)</span>
                </button>

                <input
                  type="file"
                  accept=".json"
                  ref={jsonImportRef}
                  onChange={handleJsonUpload}
                  className="hidden"
                />

                <button
                  onClick={() => jsonImportRef.current?.click()}
                  className="px-4 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-2"
                >
                  <Upload className="w-4 h-4 text-slate-600" />
                  <span>Import Products from Backup (.json)</span>
                </button>

                <button
                  onClick={() => {
                    if (confirm('Reset to initial factory product catalog? Any custom uploaded items will be overwritten.')) {
                      onResetProducts();
                    }
                  }}
                  className="px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl text-xs font-semibold flex items-center gap-2 ml-auto"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Reset to Factory Catalog</span>
                </button>
              </div>
            </div>

            {/* Change Merchant Security PIN */}
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 max-w-lg">
              <div className="border-b border-slate-100 pb-4 mb-4">
                <h3 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
                  <Key className="w-4 h-4 text-amber-500" />
                  <span>Change Merchant Security PIN</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Protect your upload portal from unauthorized access. (Default PIN: 1234)
                </p>
              </div>

              <form onSubmit={handleChangePin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    New Security PIN (at least 4 digits)
                  </label>
                  <input
                    type="password"
                    maxLength={8}
                    placeholder="Enter new PIN"
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl font-mono focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                {pinChangeStatus && (
                  <p className="text-xs font-semibold text-emerald-600">
                    {pinChangeStatus}
                  </p>
                )}

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold"
                >
                  Update Security PIN
                </button>
              </form>
            </div>

          </div>
        )}

      </div>

    </div>
  );
};
