//C:\Users\Akash Krishna\Downloads\RINK KSUM Website\app\RomiPortal\RomiPortalFeatures\RomiTreeMap.tsx

'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

interface SectorNode {
  name: string;
  size: string;
  share: number;
  colorClass: string;
  details: string;
}

interface RomiTreeMapProps {
  title?: string;
  subtitle?: string;
  sectors?: SectorNode[];
}

export default function RomiTreeMap({
  title = "Market Sector Distribution Map",
  subtitle = "Interactive size segments based on current patent indices",
  sectors = [
    { name: "Agritech Solutions", size: "col-span-2 row-span-2", share: 42, colorClass: "bg-emerald-500/10 border-emerald-500/20 text-emerald-800", details: "Highest YoY growth of 18%. Guided by KSUM programs." },
    { name: "DeepTech AI Platforms", size: "col-span-1 row-span-2", share: 26, colorClass: "bg-blue-500/10 border-blue-500/20 text-blue-800", details: "Covers 1,200+ indexed university research papers." },
    { name: "HealthTech & Biotech", size: "col-span-1 row-span-1", share: 18, colorClass: "bg-purple-500/10 border-purple-500/20 text-purple-800", details: "Active research files under state IPR support programs." },
    { name: "FinTech Infrastructures", size: "col-span-2 row-span-1", share: 14, colorClass: "bg-amber-500/10 border-amber-500/20 text-amber-800", details: "High incubation and early seed investment traction." }
  ]
}: RomiTreeMapProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-5 w-full flex flex-col justify-between">
      <div className="flex flex-col mb-4">
        <h4 className="font-helios font-bold text-gray-800 text-sm leading-tight">{title}</h4>
        {subtitle && <span className="text-[10px] text-gray-400 font-montserrat mt-0.5">{subtitle}</span>}
      </div>

      <div className="grid grid-cols-3 grid-rows-3 gap-3 h-64 mt-2">
        {sectors.map((sector, idx) => {
          const isHovered = hoveredIdx === idx;
          return (
            <motion.div
              key={idx}
              className={`rounded-xl border p-4 flex flex-col justify-between cursor-pointer transition-all duration-300 relative overflow-hidden ${sector.size} ${sector.colorClass}`}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              whileHover={{ scale: 0.99, translateY: -2 }}
            >
              {/* Highlight background shine */}
              <div className="absolute inset-0 bg-white opacity-0 hover:opacity-10 transition-opacity pointer-events-none" />

              <div className="flex justify-between items-start w-full relative z-10">
                <span className="font-helios font-bold text-xs leading-tight pr-2">
                  {sector.name}
                </span>
                <span className="font-helios font-extrabold text-sm opacity-90 leading-none shrink-0">
                  {sector.share}%
                </span>
              </div>

              {/* Dynamic text showing detailed info on hover or as default bottom alignment */}
              <div className="mt-2 relative z-10">
                <p className={`text-[10px] font-montserrat leading-snug transition-all duration-300 ${isHovered ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                  {isHovered ? sector.details : (sector.details.length > 50 ? `${sector.details.substring(0, 50)}...` : sector.details)}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
