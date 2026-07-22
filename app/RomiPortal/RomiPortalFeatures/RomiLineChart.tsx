//C:\Users\Akash Krishna\Downloads\RINK KSUM Website\app\RomiPortal\RomiPortalFeatures\RomiLineChart.tsx

'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

interface DataPoint {
  x: number;
  y: number;
  label: string;
  value: string;
}

interface RomiLineChartProps {
  title?: string;
  subtitle?: string;
  points?: DataPoint[];
}

export default function RomiLineChart({
  title = "Revenue & Growth Projection",
  subtitle = "5-Year projected growth vector",
  points = [
    { x: 10, y: 80, label: 'Yr 1', value: '$12M' },
    { x: 30, y: 65, label: 'Yr 2', value: '$28M' },
    { x: 50, y: 55, label: 'Yr 3', value: '$45M' },
    { x: 70, y: 30, label: 'Yr 4', value: '$85M' },
    { x: 90, y: 15, label: 'Yr 5', value: '$160M' }
  ]
}: RomiLineChartProps) {
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  // Generate SVG path coordinate strings
  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  
  // Area path string (goes to bottom edge to fill gradient)
  const areaD = `${pathD} L 90 95 L 10 95 Z`;

  return (
    <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 shadow-sm rounded-2xl p-3.5 sm:p-5 w-full">
      <div className="flex flex-col mb-3 sm:mb-4">
        <h4 className="font-helios font-bold text-gray-800 dark:text-zinc-100 text-xs sm:text-sm leading-tight">{title}</h4>
        {subtitle && <span className="text-[9px] sm:text-[10px] text-gray-400 dark:text-zinc-500 font-montserrat mt-0.5">{subtitle}</span>}
      </div>

      <div className="relative h-36 sm:h-44 w-full mt-2 border-b border-l border-gray-200 dark:border-zinc-800">
        {/* Y-axis labels */}
        <div className="absolute left-1 top-0 text-[8px] font-semibold text-gray-400 dark:text-zinc-500 font-montserrat">$200M</div>
        <div className="absolute left-1 bottom-1 text-[8px] font-semibold text-gray-400 dark:text-zinc-500 font-montserrat">$0M</div>

        <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1b60bb" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#1b60bb" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[20, 40, 60, 80].map((yVal, i) => (
            <line 
              key={i} 
              x1="0" y1={yVal} x2="100" y2={yVal} 
              stroke="#f3f4f6" strokeWidth="0.5" strokeDasharray="1 1"
              className="dark:stroke-zinc-800"
            />
          ))}

          {/* Area Fill under the line */}
          <motion.path 
            d={areaD} 
            fill="url(#chartGradient)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          />

          {/* Main animated line */}
          <motion.path 
            d={pathD} 
            fill="none" 
            stroke="#1b60bb" 
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
          />

          {/* Interactive coordinates points */}
          {points.map((pt, i) => (
            <g key={i}>
              {/* Pulse effect on hover */}
              {hoveredPoint === i && (
                <circle 
                  cx={pt.x} cy={pt.y} r="5" 
                  fill="#1b60bb" opacity="0.15" className="animate-ping" 
                />
              )}
              {/* Outer stroke circle */}
              <circle 
                cx={pt.x} cy={pt.y} r="2" 
                fill="#ffffff" stroke="#1b60bb" strokeWidth="1" 
                className="cursor-pointer transition-transform duration-200 hover:scale-125"
                onMouseEnter={() => setHoveredPoint(i)}
                onMouseLeave={() => setHoveredPoint(null)}
              />
            </g>
          ))}
        </svg>

        {/* Labels positioned underneath */}
        <div className="absolute inset-x-0 -bottom-5 sm:-bottom-6 flex justify-between px-2 text-[8px] sm:text-[10px] text-gray-500 dark:text-zinc-400 font-semibold font-montserrat">
          {points.map((p, i) => (
            <span key={i} style={{ left: `${p.x}%`, transform: 'translateX(-50%)', position: 'absolute' }}>
              {p.label}
            </span>
          ))}
        </div>

        {/* Floating details overlay on point hover */}
        {hoveredPoint !== null && (
          <div 
            className="absolute bg-gray-900 dark:bg-zinc-800 text-white text-[9px] sm:text-[10px] px-2 py-1 rounded-lg shadow-lg z-20 font-montserrat font-medium"
            style={{ 
              left: `${points[hoveredPoint].x}%`, 
              top: `${points[hoveredPoint].y - 22}%`,
              transform: 'translateX(-50%)'
            }}
          >
            {points[hoveredPoint].value}
          </div>
        )}
      </div>
    </div>
  );
}
