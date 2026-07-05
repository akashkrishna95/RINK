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
    <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-5 w-full">
      <div className="flex flex-col mb-4">
        <h4 className="font-helios font-bold text-gray-800 text-sm leading-tight">{title}</h4>
        {subtitle && <span className="text-[10px] text-gray-400 font-montserrat mt-0.5">{subtitle}</span>}
      </div>

      <div className={`relative ${heightClass} flex items-end gap-3 px-2 pb-6 border-b border-l border-gray-200 mt-2`}>
        {/* Y Axis Guides */}
        <div className="absolute left-2 top-0 text-[8px] text-gray-400 font-medium font-montserrat">
          ${maxValue}B
        </div>
        <div className="absolute left-2 bottom-6 text-[8px] text-gray-400 font-medium font-montserrat">
          $0B
        </div>

        {data.map((item, i) => {
          const percentage = (item.value / maxValue) * 100;
          return (
            <div 
              key={i} 
              className="flex flex-col items-center flex-1 relative group cursor-pointer"
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
                className="pointer-events-none absolute left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded shadow-lg whitespace-nowrap z-30 font-montserrat font-medium"
              >
                {item.displayValue || `${item.value}`}
              </motion.div>

              {/* Bar */}
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${percentage}%` }}
                transition={{ duration: 0.8, ease: "easeOut", delay: i * 0.1 }}
                className={`w-full max-w-[40px] rounded-t-lg ${item.color || 'bg-[#1b60bb]'} shadow-sm relative group-hover:brightness-95 transition-all`}
              />

              {/* Label */}
              <span className="text-[10px] font-montserrat text-gray-500 absolute -bottom-5 font-semibold">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
