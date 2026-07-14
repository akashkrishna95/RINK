// C:\Users\Akash Krishna\Downloads\RINK KSUM Website\HomePage\RomiAI\RomiRedirectWidget.tsx
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

export default function RomiRedirectWidget() {
  const pathname = usePathname();
  const [showTooltip, setShowTooltip] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const accentColor = '#1b60bb';

  // Do not render the floating widget if the user is on the RomiPortal page
  if (pathname?.startsWith('/RomiPortal')) {
    return null;
  }

  return (
    <div className="fixed bottom-8 left-4 right-4 md:left-auto md:right-8 md:bottom-10 z-[100] flex flex-col items-end">
      <div className="relative flex flex-col items-end z-10">
        <AnimatePresence>
          {showTooltip && !isMinimized && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              className="bg-white font-bold text-[10px] md:text-[11px] px-3.5 py-1.5 rounded-t-xl rounded-bl-xl rounded-br-sm shadow-md mb-2 relative mr-3 select-none"
              style={{ color: accentColor }}
            >
              Don't know where to start?
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowTooltip(false);
                }}
                className="absolute -top-2 -right-2 text-white rounded-full p-0.5 shadow-md cursor-pointer flex items-center justify-center"
                style={{ background: accentColor, width: '14px', height: '14px' }}
              >
                <svg viewBox="0 0 24 24" width="8" height="8" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.1}
          onDragEnd={(_e, info) => {
            if (info.offset.x > 30) {
              setIsMinimized(true);
              setShowTooltip(false);
            } else if (info.offset.x < -30) {
              setIsMinimized(false);
            }
          }}
          animate={{ x: isMinimized ? 'calc(100% - 28px)' : 0, scale: 1 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            if (isMinimized) {
              setIsMinimized(false);
            } else {
              if (typeof window !== 'undefined') {
                window.location.href = '/RomiPortal';
              }
            }
          }}
          className="relative bg-white text-[#2c3e50] rounded-full pl-[58px] md:pl-[68px] pr-6 py-2.5 md:py-3 shadow-xl hover:shadow-2xl transition-all border border-gray-100 flex items-center h-[52px] md:h-[58px] cursor-pointer"
        >
          <div className="absolute -left-6 md:-left-7 bottom-0 w-[82px] h-[105px] md:w-[100px] md:h-[125px] pointer-events-none">
            <img src="/images/romi-avatar.png" alt="Romi AI Avatar" className="w-full h-full object-contain object-bottom drop-shadow-md" />
          </div>
          <span className="text-[18px] md:text-[20px] font-medium tracking-wide whitespace-nowrap ml-2">
            Try our <span className="font-bold" style={{ color: accentColor }}>Romi</span>
          </span>
        </motion.button>
      </div>
    </div>
  );
}
