//C:\Users\Akash Krishna\Downloads\RINK KSUM Website\app\RomiPortal\RomiPortalFeatures\RomiBarChart.tsx

'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

interface BarData {
  label: string;
  value: number;
  displayValue?: string;
  color?: string;
}

interface RomiBarChartProps {
  title?: string;
  subtitle?: string;
  data?: BarData[];
  heightClass?: string;
}

export default function RomiBarChart({ 
  title = "Market Size Estimation (YoY Growth)", 
  subtitle = "Projected valuation in USD", 
  data = [
    { label: '2024', value: 150, displayValue: '$150B', color: 'bg-blue-100' },
    { label: '2025', value: 220, displayValue: '$220B', color: 'bg-blue-200' },
    { label: '2026', value: 310, displayValue: '$310B', color: 'bg-blue-300' },
    { label: '2027', value: 450, displayValue: '$450B', color: 'bg-blue-500' },
    { label: '2028', value: 580, displayValue: '$580B', color: 'bg-indigo-600' },
    { label: '2029', value: 720, displayValue: '$720B', color: 'bg-indigo-800' }
  ],
  heightClass = "h-48"
}: RomiBarChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 shadow-sm rounded-2xl p-3.5 sm:p-5 w-full">
      <div className="flex flex-col mb-3 sm:mb-4">
        <h4 className="font-helios font-bold text-gray-800 dark:text-zinc-100 text-xs sm:text-sm leading-tight">{title}</h4>
        {subtitle && <span className="text-[9px] sm:text-[10px] text-gray-400 dark:text-zinc-500 font-montserrat mt-0.5">{subtitle}</span>}
      </div>

      <div className={`relative ${heightClass} flex items-end gap-1.5 sm:gap-3 px-1 sm:px-2 pb-5 sm:pb-6 border-b border-l border-gray-200 dark:border-zinc-800 mt-2`}>
        {/* Y Axis Guides */}
        <div className="absolute left-1 sm:left-2 top-0 text-[8px] text-gray-400 font-medium font-montserrat">
          ${maxValue}B
        </div>
        <div className="absolute left-1 sm:left-2 bottom-5 sm:bottom-6 text-[8px] text-gray-400 font-medium font-montserrat">
          $0B
        </div>

        {data.map((item, i) => {
          const percentage = (item.value / maxValue) * 100;
          return (
            <div 
              key={i} 
              className="flex flex-col items-center flex-1 min-w-0 relative group cursor-pointer"
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Tooltip */}
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ 
                  opacity: hoveredIndex === i ? 1 : 0, 
                  y: hoveredIndex === i ? -45 : -35,
                  scale: hoveredIndex === i ? 1 : 0.95 
                }}
                transition={{ duration: 0.15 }}
                className="pointer-events-none absolute left-1/2 -translate-x-1/2 bg-gray-900 dark:bg-zinc-800 text-white text-[9px] sm:text-[10px] px-1.5 py-0.5 sm:px-2 sm:py-1 rounded shadow-lg whitespace-nowrap z-30 font-montserrat font-medium"
              >
                {item.displayValue || `${item.value}`}
              </motion.div>

              {/* Bar */}
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${percentage}%` }}
                transition={{ duration: 0.8, ease: "easeOut", delay: i * 0.1 }}
                className={`w-full max-w-[32px] sm:max-w-[40px] rounded-t-md sm:rounded-t-lg ${item.color || 'bg-[#1b60bb]'} shadow-sm relative group-hover:brightness-95 transition-all`}
              />

              {/* Label */}
              <span className="text-[8px] sm:text-[10px] font-montserrat text-gray-500 dark:text-zinc-400 absolute -bottom-4 sm:-bottom-5 font-semibold truncate max-w-full text-center">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
