export type ProductCategory = 
  | 'all'
  | 'refrigerators'
  | 'washing_machines'
  | 'smart_tvs'
  | 'kitchen_appliances'
  | 'cooling_air'
  | 'home_electronics';

export interface Product {
  id: string;
  name: string;
  sinhalaName?: string;
  category: 'refrigerators' | 'washing_machines' | 'smart_tvs' | 'kitchen_appliances' | 'cooling_air' | 'home_electronics';
  brand: string;
  modelNumber: string;
  price: number;
  originalPrice?: number;
  inStock: boolean;
  stockQuantity: number;
  warrantyYears: number;
  warrantyDetails: string;
  rating: number;
  reviewCount: number;
  image: string;
  description: string;
  sinhalaDescription?: string;
  features: string[];
  specs: Record<string, string>;
  isFeatured?: boolean;
  badge?: 'Bestseller' | 'New Arrival' | 'Inverter Tech' | 'Agent Warranty' | 'Hot Deal';
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type PaymentMethod = 'cod' | 'bank_transfer' | 'card_online' | 'whatsapp';

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  secondaryPhone?: string;
  address: string;
  district: string;
  city: string;
  postalCode?: string;
  paymentMethod: PaymentMethod;
  notes?: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  status: 'Pending' | 'Confirmed' | 'Processing' | 'Delivered' | 'Cancelled';
  createdAt: string;
}

export interface StoreInfo {
  name: string;
  sinhalaName: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  currency: string;
  freeDeliveryThreshold: number;
  standardDeliveryFee: number;
}
