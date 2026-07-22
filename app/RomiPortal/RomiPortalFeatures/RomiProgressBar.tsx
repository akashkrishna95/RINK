//C:\Users\Akash Krishna\Downloads\RINK KSUM Website\app\RomiPortal\RomiPortalFeatures\RomiProgressBar.tsx

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, AlertCircle } from 'lucide-react';

interface Stage {
  name: string;
  desc: string;
  status: 'complete' | 'active' | 'pending';
}

interface RomiProgressBarProps {
  title?: string;
  subtitle?: string;
  stages?: Stage[];
  overallProgressPercent?: number;
}

export default function RomiProgressBar({
  title = "ResearchPreneurship Assessment Progress",
  subtitle = "Stage alignment workflow checklist",
  stages = [
    { name: "Ideation & Setup", desc: "Core concepts validated", status: "complete" },
    { name: "IP & Patency Check", desc: "Conflict screening & search", status: "complete" },
    { name: "Market Analysis", desc: "TAM/SAM/SOM evaluation", status: "active" },
    { name: "Venture Roadmapping", desc: "Milestones draft structure", status: "pending" }
  ],
  overallProgressPercent = 65
}: RomiProgressBarProps) {
  const [selectedStage, setSelectedStage] = useState<number | null>(null);

  const activeIndex = stages.findIndex(s => s.status === 'active');
  const defaultIndex = activeIndex !== -1 ? activeIndex : 0;
  const displayIndex = selectedStage !== null ? selectedStage : defaultIndex;
  const currentStage = stages[displayIndex] || stages[0];

  return (
    <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 shadow-sm rounded-2xl p-4 sm:p-5 w-full">
      <div className="flex flex-col mb-3">
        <h4 className="font-helios font-bold text-gray-800 dark:text-zinc-100 text-xs sm:text-sm leading-tight">{title}</h4>
        {subtitle && <span className="text-[9px] sm:text-[10px] text-gray-400 dark:text-zinc-500 font-montserrat mt-0.5">{subtitle}</span>}
      </div>

      {/* Main Bar */}
      <div className="relative h-4 bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden mb-4 sm:mb-6 mt-1.5 border border-gray-250 dark:border-zinc-700">
        <motion.div 
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-[#1b60bb] rounded-full shadow-inner"
          initial={{ width: 0 }}
          animate={{ width: `${overallProgressPercent}%` }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-bold text-[#1b60bb] dark:text-blue-400 font-helios">
          {overallProgressPercent}% Complete
        </div>
      </div>

      {/* Desktop view (md and up) - Horizontal Scrollable Cards */}
      <div className="hidden md:flex justify-between gap-4 mt-2 overflow-x-auto pb-1 scrollbar-thin">
        {stages.map((stage, i) => (
          <div 
            key={i} 
            className={`flex-1 min-w-[160px] p-3 rounded-xl border transition-all duration-300 ${
              stage.status === 'complete' ? 'bg-green-50/40 dark:bg-green-950/20 border-green-100 dark:border-green-900/40 text-green-900 dark:text-green-300' :
              stage.status === 'active' ? 'bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/40 text-blue-900 dark:text-blue-300 shadow-sm animate-pulse' :
              'bg-gray-50/50 dark:bg-zinc-950/40 border-gray-100 dark:border-zinc-800/85 text-gray-400 dark:text-zinc-500'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              {stage.status === 'complete' && <CheckCircle2 size={14} className="text-green-600 shrink-0" />}
              {stage.status === 'active' && <AlertCircle size={14} className="text-[#1b60bb] dark:text-blue-400 shrink-0" />}
              {stage.status === 'pending' && <Circle size={14} className="text-gray-300 dark:text-zinc-600 shrink-0" />}
              
              <span className="font-helios text-xs font-bold truncate">{stage.name}</span>
            </div>
            {stage.desc && (
              <p className="text-[10px] font-montserrat opacity-80 leading-snug">
                {stage.desc}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Mobile view (below md) - Clickable status icons with details card */}
      <div className="flex md:hidden flex-col gap-3 mt-2">
        <div className="flex items-center justify-between px-2 overflow-x-auto pb-2 scrollbar-none gap-2">
          {stages.map((stage, i) => {
            const isSelected = displayIndex === i;
            return (
              <button
                key={i}
                type="button"
                onClick={() => setSelectedStage(i)}
                className={`flex items-center justify-center p-2 rounded-xl border transition-all shrink-0 cursor-pointer ${
                  isSelected 
                    ? 'bg-blue-100/50 dark:bg-blue-950/40 border-blue-400 ring-2 ring-blue-400/20' 
                    : stage.status === 'complete' 
                    ? 'bg-green-50/20 dark:bg-green-950/10 border-green-200 dark:border-green-900/30' 
                    : stage.status === 'active'
                    ? 'bg-blue-50/20 dark:bg-blue-950/10 border-blue-100 dark:border-blue-900/20'
                    : 'bg-gray-50/30 dark:bg-zinc-950/20 border-gray-150 dark:border-zinc-800'
                }`}
                title={stage.name}
              >
                {stage.status === 'complete' && <CheckCircle2 size={18} className="text-green-600 dark:text-green-400" />}
                {stage.status === 'active' && <AlertCircle size={18} className="text-[#1b60bb] dark:text-blue-400 animate-pulse" />}
                {stage.status === 'pending' && <Circle size={18} className="text-gray-400 dark:text-zinc-500" />}
              </button>
            );
          })}
        </div>

        {/* Selected Stage Detail Panel */}
        {currentStage && (
          <div className="p-3 bg-gray-50/60 dark:bg-zinc-850/30 border border-gray-200/80 dark:border-zinc-800/80 rounded-xl">
            <h5 className="font-helios text-xs font-bold text-gray-900 dark:text-zinc-150 flex items-center gap-1.5">
              <span className="text-[10px] bg-gray-200 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400 px-1.5 py-0.5 rounded font-mono">
                Stage {displayIndex + 1}
              </span>
              {currentStage.name}
            </h5>
            {currentStage.desc && (
              <p className="text-[10px] font-montserrat text-gray-500 dark:text-zinc-400 mt-1 leading-snug">
                {currentStage.desc}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
