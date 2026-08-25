//C:\Users\Akash Krishna\Downloads\RINK KSUM Website\HomePage\PageLoader.tsx
'use client';

import { motion } from 'framer-motion';

export default function PageLoader() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-[#F4F7FB] z-[9999] flex items-center justify-center"
    >
      <div className="flex flex-col items-center gap-4">
        {/* Animated Logo */}
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-16 h-16 md:w-20 md:h-20"
        >
          <div className="w-full h-full rounded-full bg-gradient-to-br from-[#1b60bb] to-[#0f3a6d] flex items-center justify-center">
            <div className="w-12 h-12 md:w-16 md:h-16 border-4 border-[#cee3ef] border-t-white rounded-full animate-spin"></div>
          </div>
        </motion.div>

        {/* Loading Text */}
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-[#1b60bb] font-barlow text-sm md:text-base font-semibold"
        >
          Loading...
        </motion.div>

        {/* Animated Dots */}
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ y: [0, -8, 0] }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: i * 0.2,
              }}
              className="w-2 h-2 bg-[#1b60bb] rounded-full"
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
