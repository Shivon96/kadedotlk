import { Product, Order } from '../types';
import { INITIAL_PRODUCTS } from '../data/initialProducts';

const PRODUCTS_KEY = 'kade_dot_lk_products_v1';
const ORDERS_KEY = 'kade_dot_lk_orders_v1';
const ADMIN_PIN_KEY = 'kade_dot_lk_admin_pin';

export const getStoredProducts = (): Product[] => {
  try {
    const raw = localStorage.getItem(PRODUCTS_KEY);
    if (!raw) {
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(INITIAL_PRODUCTS));
      return INITIAL_PRODUCTS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_PRODUCTS;
  } catch (e) {
    console.error('Failed to load products from localStorage', e);
    return INITIAL_PRODUCTS;
  }
};

export const saveStoredProducts = (products: Product[]) => {
  try {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  } catch (e) {
    console.error('Failed to save products to localStorage', e);
  }
};

export const resetStoredProducts = (): Product[] => {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(INITIAL_PRODUCTS));
  return INITIAL_PRODUCTS;
};

export const getStoredOrders = (): Order[] => {
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
};

export const saveOrder = (order: Order) => {
  try {
    const orders = getStoredOrders();
    const updated = [order, ...orders];
    localStorage.setItem(ORDERS_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to save order', e);
    return [];
  }
};

export const updateOrderStatus = (orderId: string, status: Order['status']) => {
  const orders = getStoredOrders();
  const updated = orders.map(o => o.id === orderId ? { ...o, status } : o);
  localStorage.setItem(ORDERS_KEY, JSON.stringify(updated));
  return updated;
};

export const getAdminPIN = (): string => {
  return localStorage.getItem(ADMIN_PIN_KEY) || '1234';
};

export const setAdminPIN = (newPin: string): boolean => {
  if (!newPin || newPin.length < 4) return false;
  localStorage.setItem(ADMIN_PIN_KEY, newPin);
  return true;
};

export const formatLKR = (amount: number): string => {
  return 'Rs. ' + amount.toLocaleString('en-LK');
};

export const exportProductsAsJSON = (products: Product[]) => {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(products, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `kade_dot_lk_products_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
};
