//C:\Users\Akash Krishna\Downloads\RINK KSUM Website\app\RomiPortal\RomiPortalFeatures\RomiThinkingIndicator.tsx

'use client';

import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

export default function RomiThinkingIndicator() {
  return (
    <div className="flex items-center gap-4 bg-white/80 p-4 rounded-2xl border border-blue-100 shadow-sm max-w-sm">
      <div className="relative flex items-center justify-center w-10 h-10">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          className="absolute inset-0 border-2 border-transparent border-t-[#1b60bb] border-l-[#1b60bb] rounded-full"
        />
        <motion.div 
          animate={{ scale: [0.8, 1.2, 0.8] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className="w-4 h-4 bg-[#1b60bb]/20 rounded-full flex items-center justify-center"
        >
          <Search size={10} className="text-[#1b60bb]" />
        </motion.div>
      </div>
      <div className="flex flex-col">
        <span className="font-helios font-bold text-gray-800 text-sm flex items-center gap-1">
          Romi is thinking
          <motion.span
            animate={{ opacity: [0, 1, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          >...</motion.span>
        </span>
        <span className="font-montserrat text-xs text-gray-500">Researching market data via DuckDuckGo</span>
      </div>
    </div>
  );
}
