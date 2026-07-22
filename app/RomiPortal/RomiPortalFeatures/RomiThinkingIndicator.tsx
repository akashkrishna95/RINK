//C:\Users\Akash Krishna\Downloads\RINK KSUM Website\app\RomiPortal\RomiPortalFeatures\RomiThinkingIndicator.tsx

'use client';

import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

interface RomiThinkingIndicatorProps {
  query?: string;
}

export default function RomiThinkingIndicator({ query = '' }: RomiThinkingIndicatorProps) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const intervals = [1500, 2000, 2000]; // delay before transitioning to next step
    let timer: NodeJS.Timeout;

    const runNext = (currentStep: number) => {
      if (currentStep >= 3) return;
      timer = setTimeout(() => {
        setStep(currentStep + 1);
        runNext(currentStep + 1);
      }, intervals[currentStep]);
    };

    runNext(0);

    return () => clearTimeout(timer);
  }, []);

  const q = query.toLowerCase();
  const isMarket = q.includes('market') || 
                   q.includes('size') || 
                   q.includes('value') || 
                   q.includes('trend') || 
                   q.includes('news') || 
                   q.includes('global') || 
                   q.includes('recent') || 
                   q.includes('industry') ||
                   q.includes('duck');

  const generalSteps = [
    "Thinking...",
    "Analyzing your requirements...",
    "Filtering research databases...",
    "Synthesizing recommendations..."
  ];

  const marketSteps = [
    "Thinking...",
    "Analyzing market parameters...",
    "Gathering real-world market data...",
    "Synthesizing market intelligence..."
  ];

  const activeSteps = isMarket ? marketSteps : generalSteps;
  const currentMessage = activeSteps[step] || activeSteps[activeSteps.length - 1];

  return (
    <div className="flex items-center gap-2.5 sm:gap-3.5 bg-white dark:bg-zinc-900 p-2.5 sm:p-3.5 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-[0_4px_16px_rgba(0,0,0,0.04)] max-w-[260px] sm:max-w-sm font-sans">
      <div className="relative flex items-center justify-center w-6 h-6 sm:w-8.5 sm:h-8.5 shrink-0">
        
        {/* Clean, professional brand blue spinner */}
        <svg className="animate-spin h-6 w-6 sm:h-8 sm:w-8 text-[#1b60bb]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-15" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" />
          <path className="opacity-95" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        
        {/* Clean centered search icon in brand blue */}
        <div className="absolute flex items-center justify-center">
          <Search size={9} className="sm:hidden text-[#1b60bb] animate-pulse" />
          <Search size={11} className="hidden sm:block text-[#1b60bb] animate-pulse" />
        </div>
      </div>
      <div className="flex flex-col min-w-0">
        <span className="font-helios font-bold text-gray-900 dark:text-zinc-100 text-xs sm:text-sm tracking-tight truncate">
          Romi is thinking...
        </span>
        <span className="font-montserrat text-[10px] sm:text-xs text-gray-500 dark:text-zinc-400 min-h-[14px] sm:min-h-[16px] transition-all duration-300 font-medium mt-0.5 truncate">
          {currentMessage}
        </span>
      </div>
    </div>
  );
}
