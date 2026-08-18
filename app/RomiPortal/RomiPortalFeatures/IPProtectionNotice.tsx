//C:\Users\Akash Krishna\Downloads\RINK KSUM Website\app\RomiPortal\RomiPortalFeatures\IPProtectionNotice.tsx

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Check, X } from 'lucide-react';

export default function IPProtectionNotice({ onClose }: { onClose: () => void }) {
  const [isVisible, setIsVisible] = useState(true);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => {
      // If consent is enabled, save dismissal in local storage so it never prompts again
      const savedConsent = typeof window !== 'undefined' && localStorage.getItem('romi-consent') === 'true';
      if (savedConsent) {
        localStorage.setItem('romi-ipr-dismissed', 'true');
      }
      onClose();
    }, 300);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 200 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 200 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 sm:left-auto sm:right-6 sm:translate-x-0 z-40 w-[90%] sm:max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-gray-100 flex flex-col items-start"
        >
          <div className="flex justify-between items-center w-full mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-[#1b60bb]">
                <ShieldCheck size={18} />
              </div>
              <h3 className="font-helios font-bold text-sm text-gray-900">IP Protection Advisory</h3>
            </div>
            <button
              onClick={handleDismiss}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1"
            >
              <X size={16} />
            </button>
          </div>

          <p className="font-montserrat text-[11px] text-gray-600 leading-relaxed mb-4">
            You are discussing deep technical concepts. Please ensure your core intellectual property has been documented or filed for patent protection before discussing deep technical implementations.
          </p>

          <button
            onClick={handleDismiss}
            className="w-full py-2 bg-[#1b60bb] hover:bg-[#154d96] text-white rounded-xl font-helios font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
          >
            <Check size={14} /> I understand and acknowledge
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

