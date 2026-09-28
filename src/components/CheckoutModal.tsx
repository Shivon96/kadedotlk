import React, { useState } from 'react';
import { CartItem, Order, PaymentMethod } from '../types';
import { formatLKR, saveOrder } from '../utils/storage';
import { SRI_LANKA_DISTRICTS } from '../data/initialProducts';
import { X, CheckCircle2, ShieldCheck, Truck, CreditCard, Banknote, Building2, MessageCircle, Copy, Check } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onOrderSuccess: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  onOrderSuccess,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [secondaryPhone, setSecondaryPhone] = useState('');
  const [address, setAddress] = useState('');
  const [district, setDistrict] = useState('Colombo');
  const [city, setCity] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [copiedBank, setCopiedBank] = useState(false);

  if (!isOpen) return null;

  const subtotal = items.reduce((acc, i) => acc + i.product.price * i.quantity, 0);
  const deliveryFee = subtotal >= 50000 ? 0 : 650;
  const total = subtotal + deliveryFee;

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !phone.trim() || !address.trim() || !city.trim()) {
      alert('Please fill in your name, contact phone, delivery address and city.');
      return;
    }

    setIsSubmitting(true);

    const orderId = 'KDLK-' + Math.floor(100000 + Math.random() * 900000);
    const newOrder: Order = {
      id: orderId,
      customerName,
      phone,
      secondaryPhone,
      address,
      district,
      city,
      paymentMethod,
      notes,
      items: [...items],
      subtotal,
      deliveryFee,
      discount: 0,
      total,
      status: 'Pending',
      createdAt: new Date().toISOString()
    };

    setTimeout(() => {
      saveOrder(newOrder);
      setCompletedOrder(newOrder);
      setIsSubmitting(false);
      onOrderSuccess(newOrder);
    }, 600);
  };

  const handleCopyBank = () => {
    const bankDetails = `Bank: Commercial Bank PLC\nAccount Name: KADE DOT LK (PVT) LTD\nAccount No: 1000 4892 3841\nBranch: Maharagama Branch`;
    navigator.clipboard.writeText(bankDetails);
    setCopiedBank(true);
    setTimeout(() => setCopiedBank(false), 2000);
  };

  const handleWhatsAppNotify = (order: Order) => {
    const itemList = order.items.map(i => `• ${i.product.name} (x${i.quantity}) - ${formatLKR(i.product.price * i.quantity)}`).join('\n');
    const msg = `*NEW ORDER NOTIFICATION - කඩේ ඩොට්LK*\n\n*Order ID:* ${order.id}\n*Customer:* ${order.customerName}\n*Phone:* ${order.phone}\n*Delivery Address:* ${order.address}, ${order.city} (${order.district})\n*Payment Method:* ${order.paymentMethod.toUpperCase()}\n\n*Items Ordered:*\n${itemList}\n\n*Delivery Fee:* ${order.deliveryFee === 0 ? 'FREE' : formatLKR(order.deliveryFee)}\n*Total Amount:* ${formatLKR(order.total)}`;
    window.open(`https://wa.me/94771234567?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 my-auto">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h2 className="text-xl font-bold text-slate-900 font-display">
              {completedOrder ? 'Order Confirmed' : 'Checkout & Delivery Details'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {completedOrder ? 'Your order has been recorded successfully' : 'Provide your delivery details for courier dispatch'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {completedOrder ? (
            /* Order Success State */
            <div className="space-y-6 text-center py-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h3 className="text-2xl font-bold text-slate-900 font-display">
                  ස්තූතියි! Thank you for your order
                </h3>
                <p className="text-sm text-slate-600 mt-1">
                  Your order reference number is: <span className="font-mono font-bold text-amber-600">{completedOrder.id}</span>
                </p>
              </div>

              {/* Order Receipt Box */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-left text-xs space-y-3">
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Customer Name:</span>
                  <span className="font-semibold text-slate-900">{completedOrder.customerName}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Contact Phone:</span>
                  <span className="font-semibold text-slate-900 font-mono">{completedOrder.phone}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Delivery Destination:</span>
                  <span className="font-semibold text-slate-900 text-right max-w-xs">{completedOrder.address}, {completedOrder.city} ({completedOrder.district})</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Payment Option:</span>
                  <span className="font-semibold uppercase text-slate-900">{completedOrder.paymentMethod}</span>
                </div>
                <div className="flex justify-between pt-1 text-sm font-bold text-slate-900">
                  <span>Grand Total:</span>
                  <span className="font-mono text-amber-600">{formatLKR(completedOrder.total)}</span>
                </div>
              </div>

              {/* If Bank Transfer, show bank instruction */}
              {completedOrder.paymentMethod === 'bank_transfer' && (
                <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-left text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-blue-900">Commercial Bank Account Details</span>
                    <button
                      onClick={handleCopyBank}
                      className="text-blue-700 hover:text-blue-900 flex items-center gap-1 font-semibold"
                    >
                      {copiedBank ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedBank ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <div className="font-mono text-blue-800 space-y-0.5">
                    <div>Commercial Bank PLC · Maharagama Branch</div>
                    <div>Account No: 1000 4892 3841</div>
                    <div>Account Name: KADE DOT LK (PVT) LTD</div>
                  </div>
                  <p className="text-blue-700 text-[11px]">
                    Please share your transfer receipt on WhatsApp with your Order ID.
                  </p>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => handleWhatsAppNotify(completedOrder)}
                  className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Send Confirmation via WhatsApp</span>
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm"
                >
                  Back to Store
                </button>
              </div>
            </div>
          ) : (
            /* Checkout Form */
            <form onSubmit={handleSubmitOrder} className="space-y-6">
              
              {/* Personal & Shipping Details */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                  <Truck className="w-4 h-4 text-amber-500" />
                  <span>1. Delivery Destination (Sri Lanka)</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Kasun Perera"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Phone Number (Mobile) *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 077 123 4567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      District *
                    </label>
                    <select
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
                    >
                      {SRI_LANKA_DISTRICTS.map((dist) => (
                        <option key={dist} value={dist}>{dist}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      City / Town *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Maharagama / Kandy"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Street Address & House / Apartment No. *
                  </label>
                  <textarea
                    required
                    rows={2}
                    placeholder="e.g. No. 45/2, Temple Road"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Special Delivery Instructions (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Call before delivery, deliver on weekend"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-amber-500" />
                  <span>2. Payment Option</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* COD */}
                  <label 
                    className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'cod'
                        ? 'border-amber-500 bg-amber-50/50 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="mt-1 text-amber-500 focus:ring-amber-500"
                    />
                    <div>
                      <div className="font-semibold text-xs text-slate-900 flex items-center gap-1.5">
                        <Banknote className="w-4 h-4 text-amber-600" />
                        <span>Cash on Delivery (COD)</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Pay cash directly to the courier agent upon receiving your devices.
                      </p>
                    </div>
                  </label>

                  {/* Bank Transfer */}
                  <label 
                    className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'bank_transfer'
                        ? 'border-amber-500 bg-amber-50/50 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bank_transfer"
                      checked={paymentMethod === 'bank_transfer'}
                      onChange={() => setPaymentMethod('bank_transfer')}
                      className="mt-1 text-amber-500 focus:ring-amber-500"
                    />
                    <div>
                      <div className="font-semibold text-xs text-slate-900 flex items-center gap-1.5">
                        <Building2 className="w-4 h-4 text-amber-600" />
                        <span>Direct Bank Transfer</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Transfer to Commercial Bank or Sampath Bank and send receipt.
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Order Summary & Submit */}
              <div className="pt-4 border-t border-slate-200 bg-slate-50 -mx-6 -mb-6 p-6 space-y-4">
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Items Total ({items.length} appliances)</span>
                    <span className="font-mono font-semibold text-slate-900">{formatLKR(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Courier Islandwide Delivery</span>
                    <span className="font-mono">
                      {deliveryFee === 0 ? <span className="text-emerald-700 font-bold">FREE DELIVERY</span> : formatLKR(deliveryFee)}
                    </span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-slate-900 pt-2 border-t border-slate-200">
                    <span>Payable Total</span>
                    <span className="font-mono text-amber-600 text-lg">{formatLKR(total)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition-all duration-150 flex items-center justify-center gap-2 shadow-md"
                >
                  {isSubmitting ? (
                    <span>Placing Your Order...</span>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4 text-amber-400" />
                      <span>Confirm & Place Order ({formatLKR(total)})</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          )}
        </div>

      </div>
    </div>
  );
};
