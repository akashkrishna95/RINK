// app/RomiPortal/researchpreneurship/RomiProgressBar.tsx


'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, ShieldCheck, BarChart3, Flag, Check } from 'lucide-react';

interface Stage {
  name: string;
  desc?: string;
  status: 'complete' | 'active' | 'pending';
  number?: string;
  questions_total?: number;
  questions_answered?: number;
}

interface RomiProgressBarProps {
  title?: string;
  subtitle?: string;
  stages?: Stage[];
  overallProgressPercent?: number;
}

const getStageIcon = (index: number) => {
  const icons = [Lightbulb, ShieldCheck, BarChart3, Flag];
  return icons[index % icons.length];
};

const getStageDescription = (stageName: string, index: number, existingDesc?: string) => {
  if (existingDesc && existingDesc.trim().length > 0) return existingDesc;

  const defaultDescriptions = [
    "Applicant & institute info",
    "Core problem & domain",
    "Technology & approach",
    "Novelty & technical edge",
    "Key benefits & impact",
    "Readiness & validation stage",
    "TAM, SAM & target users",
    "Commercialization & revenue",
    "Funding & cost estimate",
    "Team expertise & roadmap"
  ];

  const lower = (stageName || '').toLowerCase();
  if (lower.includes("participant") || lower.includes("detail")) return "Applicant & institute info";
  if (lower.includes("project") || lower.includes("overview") || lower.includes("problem")) return "Core problem & domain";
  if (lower.includes("solution")) return "Technology & approach";
  if (lower.includes("innovat") || lower.includes("r&d") || lower.includes("patency") || lower.includes("ip ")) return "Novelty & technical edge";
  if (lower.includes("value") || lower.includes("prop")) return "Key benefits & impact";
  if (lower.includes("trl") || lower.includes("readiness")) return "Readiness & validation stage";
  if (lower.includes("market")) return "TAM, SAM & target users";
  if (lower.includes("business") || lower.includes("model")) return "Commercialization & revenue";
  if (lower.includes("financial") || lower.includes("budget") || lower.includes("cost")) return "Funding & cost estimate";
  if (lower.includes("team") || lower.includes("roadmap") || lower.includes("venture")) return "Team expertise & roadmap";

  return defaultDescriptions[index % defaultDescriptions.length];
};

const renderSubProgressBar = (status: 'complete' | 'active' | 'pending', currentProgress: number = 0, answered?: number, total?: number) => {
  let percent = 0;
  if (status === 'complete') {
    percent = 100;
  } else if (status === 'active') {
    if (total && total > 0) {
      percent = Math.round(((answered || 0) / total) * 100);
    } else {
      percent = currentProgress > 0 ? 50 : 0;
    }
  }

  const barColor = status === 'complete' ? 'bg-green-500 dark:bg-green-400' : status === 'active' ? 'bg-blue-500 dark:bg-blue-400' : 'bg-gray-200 dark:bg-zinc-800';
  return (
    <div className="w-full h-1 bg-gray-100 dark:bg-zinc-800/80 rounded-full overflow-hidden my-1.5 border border-gray-200/10">
      <div 
        className={`h-full ${barColor} rounded-full transition-all duration-500`}
        style={{ width: `${percent}%` }}
      />
    </div>
  );
};

export default function RomiProgressBar({
  title = "ResearchPreneurship Assessment Progress",
  subtitle = "Stage alignment workflow checklist",
  stages = [
    { name: "Ideation & Setup", desc: "Applicant & core concepts", status: "active" },
    { name: "IP & Patency Check", desc: "Novelty & conflict check", status: "pending" },
    { name: "Market Analysis", desc: "TAM/SAM & target users", status: "pending" },
    { name: "Venture Roadmapping", desc: "Team expertise & roadmap", status: "pending" }
  ],
  overallProgressPercent = 0
}: RomiProgressBarProps) {
  const [selectedStage, setSelectedStage] = useState<number | null>(null);
  const itemsRef = useRef<(HTMLButtonElement | null)[]>([]);

  const completedCount = stages.filter(s => s.status === 'complete').length;
  const activeIndex = stages.findIndex(s => s.status === 'active');
  const totalCount = stages.length;
  
  const calculatedProgress = totalCount > 0 
    ? Math.round(((completedCount + (activeIndex !== -1 && completedCount > 0 ? 0.5 : 0)) / totalCount) * 100) 
    : 0;

  const dynamicProgress = overallProgressPercent !== undefined ? overallProgressPercent : calculatedProgress;

  const defaultIndex = activeIndex !== -1 ? activeIndex : 0;
  const displayIndex = selectedStage !== null ? selectedStage : defaultIndex;
  const currentStage = stages[displayIndex] || stages[0];

  useEffect(() => {
    if (overallProgressPercent === 0) {
      setSelectedStage(null);
    }
  }, [overallProgressPercent]);

  useEffect(() => {
    const activeEl = itemsRef.current[displayIndex];
    if (activeEl) {
      activeEl.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
  }, [displayIndex]);

  return (
    <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 shadow-md rounded-3xl p-4 sm:p-5 w-full pointer-events-auto">
      <div className="flex flex-col mb-2">
        <h4 className="font-helios font-bold text-gray-900 dark:text-zinc-100 text-sm sm:text-base leading-tight">{title}</h4>
        {subtitle && <span className="text-xs text-gray-400 dark:text-zinc-500 font-montserrat mt-0.5">{subtitle}</span>}
      </div>

      {/* Main Bar */}
      <div className="relative h-3.5 bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden my-3 border border-gray-200 dark:border-zinc-700">
        <motion.div 
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-[#1b60bb] rounded-full shadow-inner"
          initial={{ width: 0 }}
          animate={{ width: `${dynamicProgress}%` }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-bold text-[#1b60bb] dark:text-blue-400 font-helios tracking-tight">
          {dynamicProgress}% Complete
        </div>
      </div>

      {/* Desktop view (md and up) - Horizontal Scrollable Cards */}
      <div className="hidden md:flex gap-3 mt-1 overflow-x-auto pb-2 scrollbar-none">
        {stages.map((stage, i) => {
          const StageIcon = getStageIcon(i);
          const miniDesc = getStageDescription(stage.name, i, stage.desc);
          return (
            <div 
              key={i} 
              className={`shrink-0 min-w-[175px] max-w-[220px] p-3.5 rounded-2xl border transition-all duration-300 ${
                stage.status === 'complete' ? 'bg-green-50/50 dark:bg-green-950/20 border-green-400 dark:border-green-600/60 text-green-900 dark:text-green-300' :
                stage.status === 'active' ? 'bg-blue-50/50 dark:bg-blue-950/20 border-blue-400 dark:border-blue-500/60 text-[#1b60bb] dark:text-blue-300 shadow-sm' :
                'bg-gray-50/50 dark:bg-zinc-950/40 border-gray-200/80 dark:border-zinc-800 text-gray-400 dark:text-zinc-500'
              }`}
            >
              <div className="flex items-center gap-2 mb-1 min-w-0">
                {stage.number !== undefined && (
                  <span className="shrink-0 text-[11px] font-mono font-bold opacity-80">{stage.number}</span>
                )}
                <StageIcon size={14} className={
                  stage.status === 'complete' ? 'text-green-600 dark:text-green-400 shrink-0' :
                  stage.status === 'active' ? 'text-[#1b60bb] dark:text-blue-400 shrink-0 animate-pulse' :
                  'text-gray-400 dark:text-zinc-500 shrink-0'
                } />
                <span className="font-helios text-xs font-bold whitespace-nowrap truncate">{stage.name}</span>
                {(stage.questions_total || 0) > 0 && (
                  <span className="ml-auto shrink-0 text-[9px] font-mono opacity-60">
                    {stage.questions_answered || 0}/{stage.questions_total}
                  </span>
                )}
              </div>
              {renderSubProgressBar(stage.status, dynamicProgress, stage.questions_answered, stage.questions_total)}
              <p className="text-[10px] font-montserrat opacity-85 leading-tight whitespace-nowrap truncate mt-1">
                {miniDesc}
              </p>
            </div>
          );
        })}
      </div>

      {/* Mobile view (below md) - Clickable status icons with details card */}
      <div className="flex md:hidden flex-col gap-2 mt-1">
        <div className="flex items-center justify-between px-1 overflow-x-auto pb-1.5 scrollbar-none gap-2">
          {stages.map((stage, i) => {
            const isSelected = displayIndex === i;
            const StageIcon = getStageIcon(i);
            return (
              <button
                key={i}
                ref={(el) => {
                  itemsRef.current[i] = el;
                }}
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
                <StageIcon size={16} className={
                  stage.status === 'complete' ? 'text-green-600 dark:text-green-400' :
                  stage.status === 'active' ? 'text-[#1b60bb] dark:text-blue-400 animate-pulse' :
                  'text-gray-400 dark:text-zinc-500'
                } />
              </button>
            );
          })}
        </div>

        {/* Selected Stage Detail Panel */}
        {currentStage && (
          <div className="p-3 bg-gray-50/60 dark:bg-zinc-850/30 border border-gray-200/80 dark:border-zinc-800/80 rounded-2xl">
            <h5 className="font-helios text-xs font-bold text-gray-900 dark:text-zinc-150 flex items-center gap-1.5">
              {currentStage.status === 'complete' ? (
                <span className="text-[9px] bg-green-500/10 dark:bg-green-500/20 text-green-600 dark:text-green-400 border border-green-200/50 dark:border-green-800/40 px-1.5 py-0.5 rounded font-mono flex items-center gap-1">
                  <Check size={10} strokeWidth={3} className="shrink-0" />
                  Stage {displayIndex + 1}
                </span>
              ) : currentStage.status === 'active' ? (
                <span className="text-[9px] bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-800/40 px-1.5 py-0.5 rounded font-mono">
                  Stage {displayIndex + 1}
                </span>
              ) : (
                <span className="text-[9px] bg-gray-200 dark:bg-zinc-850 text-gray-500 dark:text-zinc-450 px-1.5 py-0.5 rounded font-mono">
                  Stage {displayIndex + 1}
                </span>
              )}
              {currentStage.name}
              {(currentStage.questions_total || 0) > 0 && (
                <span className="ml-auto shrink-0 text-[10px] font-mono opacity-60 font-normal">
                  {currentStage.questions_answered || 0}/{currentStage.questions_total}
                </span>
              )}
            </h5>
            {renderSubProgressBar(currentStage.status, dynamicProgress, currentStage.questions_answered, currentStage.questions_total)}
            <p className="text-[10px] font-montserrat text-gray-500 dark:text-zinc-400 mt-1 leading-snug">
              {getStageDescription(currentStage.name, displayIndex, currentStage.desc)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
