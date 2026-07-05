//C:\Users\Akash Krishna\Downloads\RINK KSUM Website\app\RomiPortal\RomiPortalFeatures\StorageConsentPopup.tsx

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';

interface StorageConsentPopupProps {
  onClose: () => void;
  isHighlighted?: boolean;
}

export default function StorageConsentPopup({ onClose, isHighlighted = false }: StorageConsentPopupProps) {
  const [agreed, setAgreed] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = (save: boolean) => {
    setIsVisible(false);
    setTimeout(() => {
      if (save) {
        localStorage.setItem('romi-consent', 'true');
      } else {
        localStorage.removeItem('romi-consent');
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('romi-consent-dismissed', 'true');
        }
      }
      onClose();
    }, 300);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-6 right-6 z-50 w-[90%] sm:w-[400px]"
        >
          {/* Inline styles for custom shake animation */}
          <style dangerouslySetInnerHTML={{ __html: `
            @keyframes custom-shake {
              0%, 100% { transform: translateX(0); }
              20%, 60% { transform: translateX(-8px); }
              40%, 80% { transform: translateX(8px); }
            }
            .shake-pulse {
              animation: custom-shake 0.35s ease-in-out;
            }
          `}} />

          <div className={`bg-white rounded-3xl overflow-hidden shadow-2xl border transition-all duration-300 ${
            isHighlighted 
              ? 'border-amber-500 scale-[1.03] ring-4 ring-amber-500/20 shake-pulse shadow-amber-100' 
              : 'border-gray-100'
          }`}>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 shrink-0 shadow-inner">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h2 className="font-helios font-bold text-sm text-gray-900 leading-tight">
                    Chat History & Device Storage
                  </h2>
                  <p className="text-[10px] text-gray-400 font-montserrat mt-0.5">Secure local-only storage</p>
                </div>
              </div>
              
              <p className="font-montserrat text-xs text-gray-600 leading-relaxed mb-4">
                Your chat history and conversations are stored directly inside your local device itself, ensuring maximum privacy, security, and offline resilience.
              </p>

              <label className="flex items-start gap-2.5 p-3 bg-gray-50 rounded-2xl cursor-pointer hover:bg-gray-100 transition-colors border border-gray-200 mb-4">
                <div className="pt-0.5 shrink-0">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="w-4 h-4 rounded text-[#1b60bb] border-gray-300 focus:ring-[#1b60bb] focus:ring-offset-0 cursor-pointer"
                  />
                </div>
                <span className="font-montserrat text-[11px] text-gray-700 leading-snug">
                  I agree to save conversation history in my browser's secure local storage.
                </span>
              </label>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleClose(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl font-montserrat text-xs font-semibold text-gray-500 hover:bg-gray-100 transition-colors border border-transparent text-center"
                >
                  Skip
                </button>
                <button
                  onClick={() => handleClose(true)}
                  disabled={!agreed}
                  className="flex-1 px-4 py-2.5 rounded-xl font-montserrat text-xs font-semibold bg-[#1b60bb] text-white hover:bg-[#154d96] disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm text-center"
                >
                  Save & Proceed
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

