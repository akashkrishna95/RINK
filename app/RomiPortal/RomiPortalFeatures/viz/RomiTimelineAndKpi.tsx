
// RomiTimeline + RomiKpiCards — two small visuals in one module.
// C:\Users\Akash Krishna\Downloads\RINK KSUM Website\app\RomiPortal\RomiPortalFeatures\viz\RomiTimelineAndKpi.tsx
// RomiTimeline — vertical milestone roadmap, perfect for the concept note's
// "Next Steps" section and commercialisation pathways.
// Tag: [VIZ:TIMELINE]{"title":"Your Roadmap","items":[
//        {"label":"Prototype v2","when":"Month 1-2","status":"active"},
//        {"label":"Pilot with 2 labs","when":"Month 3-5","status":"pending"}]}
//
// RomiKpiCards — headline stat strip (CAGR, TAM, competitors found, TRL...).
// Tag: [VIZ:KPI]{"items":[{"label":"TAM","value":"$43.4B","trend":"up"},
//        {"label":"CAGR","value":"10.2%","trend":"up"},{"label":"Competitors","value":"4"}]}
'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Flag, TrendingUp, TrendingDown, Minus } from 'lucide-react';

// ---------------------------------------------------------------------------
interface TimelineItem { label: string; when?: string; status?: 'complete' | 'active' | 'pending' }

export function RomiTimeline({ title = 'Roadmap', items }: { title?: string; items: TimelineItem[] }) {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 shadow-sm rounded-2xl p-3.5 sm:p-5 w-full">
      <h4 className="font-helios font-bold text-gray-800 dark:text-zinc-100 text-xs sm:text-sm mb-3 sm:mb-4">{title}</h4>
      <div className="flex flex-col">
        {items.slice(0, 8).map((it, i) => {
          const isLast = i === items.length - 1;
          const status = it.status ?? 'pending';
          return (
            <motion.div key={i} className="flex gap-2.5 sm:gap-3"
              initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.12 }}>
              <div className="flex flex-col items-center">
                {status === 'complete' && <CheckCircle2 size={16} className="text-green-500 shrink-0 mt-0.5" />}
                {status === 'active' && <Flag size={16} className="text-[#1b60bb] dark:text-blue-400 shrink-0 animate-pulse mt-0.5" />}
                {status === 'pending' && <Circle size={16} className="text-gray-300 dark:text-zinc-600 shrink-0 mt-0.5" />}
                {!isLast && <div className={`w-px flex-1 min-h-[22px] sm:min-h-[26px] ${status === 'complete' ? 'bg-green-200 dark:bg-green-900/40' : 'bg-gray-200 dark:bg-zinc-800'}`} />}
              </div>
              <div className="pb-4 sm:pb-5 -mt-0.5">
                <p className={`font-montserrat text-xs font-bold ${status === 'pending' ? 'text-gray-400 dark:text-zinc-500' : 'text-gray-800 dark:text-zinc-200'}`}>
                  {it.label}
                </p>
                {it.when && <p className="font-montserrat text-[9px] sm:text-[10px] text-gray-400 dark:text-zinc-500 mt-0.5">{it.when}</p>}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
interface KpiItem { label: string; value: string; trend?: 'up' | 'down' | 'flat'; sub?: string }

export function RomiKpiCards({ items }: { items: KpiItem[] }) {
  const TrendIcon = ({ t }: { t?: string }) =>
    t === 'up' ? <TrendingUp size={12} className="text-emerald-500" />
      : t === 'down' ? <TrendingDown size={12} className="text-red-500" />
        : t === 'flat' ? <Minus size={12} className="text-gray-400" /> : null;

  return (
    <div className="grid gap-2.5 sm:gap-3 w-full" style={{ gridTemplateColumns: `repeat(auto-fit, minmax(95px, 1fr))` }}>
      {items.slice(0, 4).map((k, i) => (
        <motion.div key={i}
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
          className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 shadow-sm rounded-xl sm:rounded-2xl p-3 sm:p-4">
          <div className="flex items-center gap-1 text-gray-400 dark:text-zinc-500 mb-1">
            <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-wider font-helios truncate">{k.label}</span>
            <TrendIcon t={k.trend} />
          </div>
          <p className="text-base sm:text-lg font-bold font-helios text-gray-800 dark:text-zinc-100 leading-none">{k.value}</p>
          {k.sub && <p className="text-[8px] sm:text-[9px] text-gray-400 dark:text-zinc-500 font-montserrat mt-1">{k.sub}</p>}
        </motion.div>
      ))}
    </div>
  );
}
