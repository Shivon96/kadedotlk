import React from 'react';
import { ShieldCheck, Truck, PhoneCall, Mail, MapPin, Lock, MessageCircle } from 'lucide-react';

interface FooterProps {
  onOpenAdminAuth: () => void;
  isAdminLoggedIn: boolean;
  onToggleAdminView: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenAdminAuth,
  isAdminLoggedIn,
  onToggleAdminView,
}) => {
  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800">
      
      {/* 3-Pillar Guarantee Bar */}
      <div className="border-b border-slate-800/80 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-amber-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-white font-bold text-sm">100% Genuine Agent Warranty</div>
              <p className="text-slate-400 mt-1 leading-relaxed">
                Every appliance comes with official brand agent warranty and genuine parts guarantee across Sri Lanka.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-amber-400 shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-white font-bold text-sm">Islandwide Safe Transport</div>
              <p className="text-slate-400 mt-1 leading-relaxed">
                Specialized fragile electronics delivery fleet ensuring safe doorstep delivery to all 25 districts.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-amber-400 shrink-0">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-white font-bold text-sm">Sinhala & English Support</div>
              <p className="text-slate-400 mt-1 leading-relaxed">
                Talk directly with our technical advisors on WhatsApp or phone for installation and order assistance.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Main Footer Links */}
      <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Brand Col */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-baseline gap-1">
              <span className="font-sinhala text-2xl font-black text-white">
                කඩේ
              </span>
              <span className="text-xl font-black text-amber-500 font-display">
                .lk
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Sri Lanka's leading digital marketplace for high quality household devices, energy-efficient inverter appliances, and smart home technology.
            </p>
            <div className="text-xs text-slate-400 space-y-1.5 pt-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>High Level Road, Maharagama, Colombo, Sri Lanka</span>
              </div>
              <div className="flex items-center gap-2">
                <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
                <span>Hotline: 077 123 4567 / 011 289 9000</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                <span>support@kadedotlk.com</span>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Appliance Categories
            </h4>
            <ul className="text-xs text-slate-400 space-y-2">
              <li>Inverter Refrigerators & Freezers</li>
              <li>Front Load & Top Load Washers</li>
              <li>4K OLED & QLED Smart Televisions</li>
              <li>Kitchen Induction Hobs & Air Fryers</li>
              <li>Split Inverter Air Conditioners</li>
            </ul>
          </div>

          {/* Payment & Security */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Payment & Dispatch
            </h4>
            <ul className="text-xs text-slate-400 space-y-2">
              <li>Cash on Delivery (Islandwide)</li>
              <li>Commercial Bank Direct Transfer</li>
              <li>Sampath Vishwa & BOC Transfer</li>
              <li>Visa & MasterCard Accepted</li>
              <li>24 - 48 Hours Dispatch in Western Province</li>
            </ul>
          </div>

          {/* Merchant Affordance */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Store Owner
            </h4>
            <div>
              {isAdminLoggedIn ? (
                <button
                  onClick={onToggleAdminView}
                  className="px-3 py-2 rounded-lg bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 text-xs font-semibold flex items-center gap-2"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Merchant Portal</span>
                </button>
              ) : (
                <button
                  onClick={onOpenAdminAuth}
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
                >
                  <Lock className="w-3 h-3 text-slate-500" />
                  <span>Merchant Sign-in</span>
                </button>
              )}
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              Protected portal for product uploads and order tracking.
            </p>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 mt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-4">
          <div>
            © {new Date().getFullYear()} කඩේ ඩොට්LK (Pvt) Ltd. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span>Built for Sri Lankan Homes</span>
            <span>·</span>
            <span>Netlify Ready</span>
          </div>
        </div>
      </div>

    </footer>
  );
};
