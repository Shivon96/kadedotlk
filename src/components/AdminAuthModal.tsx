import React, { useState } from 'react';
import { getAdminPIN, setAdminPIN } from '../utils/storage';
import { Lock, KeyRound, X, ShieldAlert, CheckCircle } from 'lucide-react';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [showPinHint, setShowPinHint] = useState(false);

  if (!isOpen) return null;

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const storedPin = getAdminPIN();
    if (pin === storedPin) {
      setError(false);
      onSuccess();
      onClose();
    } else {
      setError(true);
      setPin('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <Lock className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-bold text-base font-display">Merchant & Admin Portal</h3>
              <p className="text-[11px] text-slate-400">Restricted Store Owner Access</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleVerify} className="p-6 space-y-5">
          <div className="text-center space-y-1">
            <p className="text-xs text-slate-600">
              Online customers cannot see your product upload portal. Please enter your Merchant Security PIN to continue.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 text-center">
              Security PIN Code
            </label>
            <div className="relative max-w-[200px] mx-auto">
              <input
                type="password"
                maxLength={6}
                autoFocus
                placeholder="••••"
                value={pin}
                onChange={(e) => {
                  setError(false);
                  setPin(e.target.value);
                }}
                className={`w-full text-center text-2xl tracking-[0.5em] font-mono py-2.5 px-3 border rounded-xl focus:outline-none focus:ring-2 ${
                  error 
                    ? 'border-red-500 focus:ring-red-400 bg-red-50' 
                    : 'border-slate-300 focus:ring-amber-500'
                }`}
              />
            </div>

            {error && (
              <p className="text-xs text-red-600 text-center mt-2 flex items-center justify-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Incorrect PIN. Please try again.</span>
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-98 shadow-sm"
          >
            <KeyRound className="w-4 h-4 text-amber-400" />
            <span>Unlock Merchant Mode</span>
          </button>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
            <button
              type="button"
              onClick={() => setShowPinHint(!showPinHint)}
              className="text-amber-700 hover:underline text-[11px]"
            >
              Default PIN hint
            </button>
            <span className="text-[11px] text-slate-400">Netlify Ready SPA</span>
          </div>

          {showPinHint && (
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900">
              Default merchant PIN code is <strong className="font-mono text-amber-950">1234</strong>. You can change this anytime inside the admin settings.
            </div>
          )}
        </form>

      </div>
    </div>
  );
};
