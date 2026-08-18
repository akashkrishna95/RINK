//C:\Users\Akash Krishna\Downloads\RINK KSUM Website\HomePage\PremiumLoader.tsx

'use client';

import { motion } from 'framer-motion';

export default function PremiumLoader() {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="flex flex-col items-center gap-4">
        {/* Main Spinner */}
        <div className="relative w-16 h-16">
          {/* Outer rotating ring */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#1b60bb] border-r-[#36a8fb]"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          />

          {/* Middle rotating ring (opposite direction) */}
          <motion.div
            className="absolute inset-2 rounded-full border-2 border-transparent border-b-[#1872dd] border-l-[#90daff]"
            animate={{ rotate: -360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          />

          {/* Inner pulsing dot */}
          <motion.div
            className="absolute inset-4 rounded-full bg-gradient-to-r from-[#1b60bb] to-[#36a8fb]"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.6, 1, 0.6],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        {/* Loading Text */}
        <div className="text-center">
          <motion.p
            className="text-sm font-poppins font-semibold text-[#1b60bb]"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            Loading...
          </motion.p>
        </div>
      </div>
    </div>
  );
}
