//C:\Users\Akash Krishna\Downloads\RINK KSUM Website\app\RomiPortal\RomiPortalFeatures\RomiPieChart.tsx

'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

interface PieSegment {
  label: string;
  percentage: number;
  color: string;
  hoverColor?: string;
}

interface RomiPieChartProps {
  title?: string;
  subtitle?: string;
  segments?: PieSegment[];
}

export default function RomiPieChart({
  title = "Market Share Distribution",
  subtitle = "Global segmentation analysis",
  segments = [
    { label: "Top Competitors", percentage: 55, color: "#1b60bb" },
    { label: "RINK Startups", percentage: 30, color: "#219653" },
    { label: "Other Segments", percentage: 15, color: "#cbd5e1" }
  ]
}: RomiPieChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Circumference of our SVG circle (radius = 40)
  const radius = 40;
  const circumference = 2 * Math.PI * radius; // ~251.32

  // Keep track of accumulated percentage offsets
  let accumulatedPercent = 0;

  return (
    <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-5 flex flex-col items-center justify-center relative overflow-hidden w-full">
      <div className="flex flex-col mb-4 w-full align-left">
        <h4 className="font-helios font-bold text-gray-800 text-sm leading-tight">{title}</h4>
        {subtitle && <span className="text-[10px] text-gray-400 font-montserrat mt-0.5">{subtitle}</span>}
      </div>

      <div className="relative w-36 h-36 mt-2">
        <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
          {/* Background Ring */}
          <circle 
            cx="50" cy="50" r={radius} 
            fill="transparent" 
            stroke="#f9fafb" 
            strokeWidth="14" 
          />

          {segments.map((slice, idx) => {
            const strokeDashoffset = circumference - (circumference * slice.percentage) / 100;
            const rotationDegree = (accumulatedPercent * 360) / 100;
            accumulatedPercent += slice.percentage;

            const isHovered = activeIndex === idx;

            return (
              <motion.circle 
                key={idx}
                cx="50" 
                cy="50" 
                r={radius} 
                fill="transparent" 
                stroke={slice.color} 
                strokeWidth={isHovered ? 17 : 14} 
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                style={{ 
                  transformOrigin: '50px 50px',
                  transform: `rotate(${rotationDegree}deg)`
                }}
                transition={{ 
                  strokeDashoffset: { duration: 1.2, ease: "easeOut", delay: idx * 0.2 },
                  strokeWidth: { duration: 0.2 }
                }}
                className="cursor-pointer transition-all"
                onMouseEnter={() => setActiveIndex(idx)}
                onMouseLeave={() => setActiveIndex(null)}
              />
            );
          })}
        </svg>

        {/* Center Text inside Donut */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-xl font-bold font-helios text-gray-800">
            {activeIndex !== null ? `${segments[activeIndex].percentage}%` : '100%'}
          </span>
          <span className="text-[7px] uppercase tracking-wider text-gray-400 font-bold font-helios mt-0.5 text-center px-2 truncate max-w-full">
            {activeIndex !== null ? segments[activeIndex].label : 'Total Analyzed'}
          </span>
        </div>
      </div>

      {/* Legend Wrap */}
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-2.5 mt-5 w-full text-[10px] font-montserrat font-semibold text-gray-600 border-t border-gray-50 pt-4">
        {segments.map((slice, idx) => (
          <div 
            key={idx} 
            className={`flex items-center gap-2 cursor-pointer transition-colors p-1.5 rounded-lg shrink-0 ${activeIndex === idx ? 'bg-gray-50 text-gray-900' : 'text-gray-500'}`}
            onMouseEnter={() => setActiveIndex(idx)}
            onMouseLeave={() => setActiveIndex(null)}
          >
            <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: slice.color }}></div>
            <span className="leading-none whitespace-nowrap">{slice.label} ({slice.percentage}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
}
