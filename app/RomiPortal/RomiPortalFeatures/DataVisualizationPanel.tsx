//C:\Users\Akash Krishna\Downloads\RINK KSUM Website\app\RomiPortal\RomiPortalFeatures\DataVisualizationPanel.tsx

'use client';

import { motion } from 'framer-motion';
import { BarChart3, PieChart, Activity, ExternalLink, Info } from 'lucide-react';

export default function DataVisualizationPanel() {
  return (
    <motion.div 
      initial={{ width: 0, opacity: 0 }}
      animate={{ width: 340, opacity: 1 }}
      className="h-full bg-white border-l border-gray-100 flex flex-col shrink-0"
    >
      <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
        <h3 className="font-helios font-semibold text-gray-800 flex items-center gap-2">
          <Activity size={16} className="text-[#1b60bb]" />
          Market Data
        </h3>
        <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 bg-gray-100 px-2 py-1 rounded">Live</span>
      </div>

      <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-6">
        
        {/* TAM SAM SOM */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <h4 className="font-helios text-sm font-semibold text-gray-700 flex justify-between mb-4">
            Market Potential
            <a href="https://duckduckgo.com" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-blue-500">
              <ExternalLink size={14} />
            </a>
          </h4>
          <div className="flex flex-col gap-1.5 items-center w-full mt-2 select-none relative z-10">
            {/* SOM (Top) */}
            <div className="w-[50%] bg-[#1b60bb] text-white text-[10px] font-bold py-2.5 rounded-t-xl text-center shadow-sm relative group hover:brightness-105 transition-all">
              <span className="font-helios">SOM: $50B</span>
              <div className="absolute opacity-0 group-hover:opacity-100 bg-gray-900 text-white text-[9px] px-2 py-1 rounded shadow-lg -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-none transition-opacity font-montserrat z-30">
                Serviceable Obtainable Market
              </div>
            </div>
            {/* SAM (Middle) */}
            <div className="w-[75%] bg-blue-400 text-white text-[10px] font-bold py-2.5 text-center shadow-sm relative group hover:brightness-105 transition-all">
              <span className="font-helios">SAM: $400B</span>
              <div className="absolute opacity-0 group-hover:opacity-100 bg-gray-900 text-white text-[9px] px-2 py-1 rounded shadow-lg -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-none transition-opacity font-montserrat z-30">
                Serviceable Available Market
              </div>
            </div>
            {/* TAM (Bottom) */}
            <div className="w-full bg-blue-100 text-blue-900 text-[10px] font-bold py-2.5 rounded-b-xl text-center border border-blue-200/50 shadow-sm relative group hover:brightness-105 transition-all">
              <span className="font-helios">TAM: $1.2T</span>
              <div className="absolute opacity-0 group-hover:opacity-100 bg-gray-900 text-white text-[9px] px-2 py-1 rounded shadow-lg -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-none transition-opacity font-montserrat z-30">
                Total Addressable Market
              </div>
            </div>
          </div>
          <p className="text-[10px] text-gray-400 mt-3 flex items-center gap-1 font-montserrat">
            <Info size={12} /> Source: Industry Reports 2024
          </p>
        </div>

        {/* Market Size Bar */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <h4 className="font-helios text-sm font-semibold text-gray-700 flex justify-between mb-3">
            Growth Projection
            <a href="https://duckduckgo.com" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-blue-500">
              <ExternalLink size={14} />
            </a>
          </h4>
          <div className="flex items-end gap-2 h-24 mb-2">
            <div className="w-1/3 bg-gray-100 rounded-t-sm h-[40%] relative group">
              <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">2022</span>
            </div>
            <div className="w-1/3 bg-blue-200 rounded-t-sm h-[60%] relative group">
              <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">2024</span>
            </div>
            <div className="w-1/3 bg-[#1b60bb] rounded-t-sm h-[90%] relative group">
              <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-xs font-bold text-[#1b60bb]">2026</span>
            </div>
          </div>
          <div className="flex justify-between text-xs text-gray-400 font-montserrat mt-2">
            <span>Past</span>
            <span>Current</span>
            <span className="text-[#1b60bb] font-semibold">Forecast</span>
          </div>
        </div>

        {/* Competitor Map */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <h4 className="font-helios text-sm font-semibold text-gray-700 flex justify-between mb-3">
            Competitor Landscape
            <a href="https://duckduckgo.com" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-blue-500">
              <ExternalLink size={14} />
            </a>
          </h4>
          <div className="relative h-32 border-l-2 border-b-2 border-gray-200 bg-gray-50">
            <span className="absolute -left-2 -top-4 text-[10px] text-gray-400">Niche</span>
            <span className="absolute -right-4 -bottom-4 text-[10px] text-gray-400">Broad</span>
            
            <div className="absolute bottom-4 left-4 w-4 h-4 bg-red-400 rounded-full flex items-center justify-center group cursor-pointer">
              <div className="opacity-0 group-hover:opacity-100 absolute -top-6 bg-black text-white text-[10px] px-2 py-1 rounded whitespace-nowrap transition-opacity">Startup A</div>
            </div>
            <div className="absolute top-1/2 right-1/4 w-8 h-8 bg-[#1b60bb] rounded-full flex items-center justify-center opacity-80 group cursor-pointer">
              <div className="opacity-0 group-hover:opacity-100 absolute -top-6 bg-black text-white text-[10px] px-2 py-1 rounded whitespace-nowrap transition-opacity">Incumbent</div>
            </div>
            <div className="absolute top-1/4 left-1/3 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center opacity-70 group cursor-pointer">
              <div className="opacity-0 group-hover:opacity-100 absolute -top-6 bg-black text-white text-[10px] px-2 py-1 rounded whitespace-nowrap transition-opacity">Challenger</div>
            </div>
          </div>
          <p className="text-[10px] text-gray-500 mt-6 text-center font-montserrat">
            X: Product Scope | Y: Market Share
          </p>
        </div>

      </div>
    </motion.div>
  );
}
