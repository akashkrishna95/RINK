// C:\Users\Akash Krishna\Downloads\RINK KSUM Website\app\RomiPortal\RomiPortalFeatures\viz\RomiGauge.tsx

'use client';

import { motion } from 'framer-motion';

interface RomiGaugeProps {
  title?: string;
  percent: number;          // 0–100
  caption?: string;
}

export default function RomiGauge({ title = 'Score', percent, caption }: RomiGaugeProps) {
  const p = Math.max(0, Math.min(100, Math.round(percent)));
  const C = 2 * Math.PI * 40; // r=40
  const color = p >= 70 ? '#10b981' : p >= 40 ? '#1b60bb' : '#f59e0b';

  return (
    <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 shadow-sm rounded-2xl p-3.5 sm:p-5 w-full flex flex-col items-center">
      <h4 className="font-helios font-bold text-gray-800 dark:text-zinc-100 text-xs sm:text-sm w-full text-left mb-2">{title}</h4>
      <div className="relative w-24 h-24 sm:w-32 sm:h-32">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f3f4f6" strokeWidth="12" className="dark:stroke-zinc-800" />
          <motion.circle
            cx="50" cy="50" r="40" fill="transparent"
            stroke={color} strokeWidth="12" strokeLinecap="round"
            strokeDasharray={C}
            initial={{ strokeDashoffset: C }}
            animate={{ strokeDashoffset: C * (1 - p / 100) }}
            transition={{ duration: 1.1, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-helios font-bold text-2xl sm:text-3xl text-gray-800 dark:text-zinc-100">{p}%</span>
        </div>
      </div>
      {caption && (
        <p className="font-montserrat text-[10px] sm:text-xs text-gray-500 dark:text-zinc-400 mt-2 sm:mt-3 text-center leading-relaxed">{caption}</p>
      )}
    </div>
  );
}
