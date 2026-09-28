import React from 'react';
import { ArrowRight, ShieldCheck, Truck, Headphones, Wrench } from 'lucide-react';
import heroImg from '../assets/images/hero_kade_appliances_1790632358395.jpg';

interface HeroProps {
  onExploreClick: () => void;
  onSelectCategory: (cat: any) => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreClick, onSelectCategory }) => {
  return (
    <section className="relative overflow-hidden bg-slate-950 text-white">
      {/* Decorative gradient scrims for maximum legibility */}
      <div className="absolute inset-0 z-0 opacity-40 mix-blend-screen pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-amber-500/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Brand Statement & CTA */}
          <div className="lg:col-span-6 space-y-6">
            {/* Quiet kicker */}
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
              <span>කඩේ ඩොට්LK</span>
              <span aria-hidden="true" className="text-slate-600">/</span>
              <span>Official Electronics & Appliances</span>
            </div>

            {/* Headline with balanced wrap */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-black font-display tracking-tight text-white leading-[1.1] max-w-xl">
              High Quality Household Devices for Sri Lankan Homes.
            </h1>

            {/* Natural editorial description */}
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-lg font-light">
              Experience power-saving Inverter refrigerators, stunning 4K OLED displays, front-load washers, and modern kitchen tech backed by official agent guarantees.
            </p>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onExploreClick}
                className="px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-all duration-200 active:scale-95 flex items-center gap-2 shadow-lg shadow-amber-500/20"
              >
                <span>Browse Appliances</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onSelectCategory('refrigerators')}
                className="px-5 py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-sm font-semibold border border-slate-700/60 transition-colors"
              >
                Inverter Refrigerators
              </button>
            </div>

            {/* Trust Markers - Unboxed clean layout */}
            <div className="pt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="leading-tight">10-Yr Agent Warranty</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="leading-tight">Islandwide Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <Wrench className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="leading-tight">Free Installation Support</span>
              </div>
              <div className="flex items-center gap-2">
                <Headphones className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="leading-tight">Sinhala & English Care</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Asset */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-900 group">
              <img
                src={heroImg}
                alt="Modern household electronics and appliances showcase"
                className="w-full h-[320px] sm:h-[420px] object-cover transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
              
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700/50 flex items-center justify-between text-xs">
                <div>
                  <div className="text-white font-semibold">2026 Energy Saver Series</div>
                  <div className="text-slate-400 text-[11px]">Save up to 55% on national electricity bills</div>
                </div>
                <div className="text-right font-mono text-amber-400 font-bold">
                  Inverter Grade A+++
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
