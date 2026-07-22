
// C:\Users\Akash Krishna\Downloads\RINK KSUM Website\app\RomiPortal\RomiPortalFeatures\viz\RomiRadarChart.tsx

// RomiRadarChart — spider chart for multi-axis comparison (up to 2 series):
// IP strength, cost advantage, scalability.
// Rendered by VizRenderer from:
// [VIZ:RADAR]{"title":"Feasibility Profile","axes":["Readiness","Market fit","IP strength","Cost","Scalability"],
//   "series":[{"name":"Your innovation","values":[6,8,5,7,6]},{"name":"Incumbents","values":[9,7,8,4,8]}],"max":10}
'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';

interface Series { name: string; values: number[] }
interface RomiRadarChartProps {
  title?: string;
  axes: string[];        // 3–8 axis labels
  series: Series[];      // 1–2 series
  max?: number;          // axis maximum (default 10)
}

const COLORS = ['#1b60bb', '#219653'];

export default function RomiRadarChart({ title = 'Comparison Profile', axes, series, max = 10 }: RomiRadarChartProps) {
  const [active, setActive] = useState<number | null>(null);
  const n = axes.length;
  const cx = 100, cy = 92, R = 62;

  const point = (axisIdx: number, value: number) => {
    const angle = (Math.PI * 2 * axisIdx) / n - Math.PI / 2;
    const r = (Math.max(0, Math.min(value, max)) / max) * R;
    return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)] as const;
  };

  const rings = useMemo(() => [0.33, 0.66, 1].map((f) =>
    Array.from({ length: n }, (_, i) => point(i, max * f)).map(([x, y]) => `${x},${y}`).join(' ')
  ), [n, max]);

  const polys = series.slice(0, 2).map((s) =>
    Array.from({ length: n }, (_, i) => point(i, s.values[i] ?? 0)).map(([x, y]) => `${x},${y}`).join(' ')
  );

  return (
    <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 shadow-sm rounded-2xl p-3.5 sm:p-5 w-full">
      <h4 className="font-helios font-bold text-gray-800 dark:text-zinc-100 text-xs sm:text-sm mb-2">{title}</h4>
      <svg viewBox="0 0 200 184" className="w-full max-w-[220px] sm:max-w-xs mx-auto">
        {rings.map((pts, i) => (
          <polygon key={i} points={pts} fill="none" stroke="#e5e7eb" strokeWidth="0.8" className="dark:stroke-zinc-800" />
        ))}
        {Array.from({ length: n }, (_, i) => {
          const [x, y] = point(i, max);
          return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="#eef1f5" strokeWidth="0.8" className="dark:stroke-zinc-800" />;
        })}
        {polys.map((pts, si) => (
          <motion.polygon key={si} points={pts}
            fill={COLORS[si]} fillOpacity={active === null || active === si ? 0.18 : 0.05}
            stroke={COLORS[si]} strokeWidth="1.6"
            initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: si * 0.2 }}
            style={{ transformOrigin: `${cx}px ${cy}px` }}
          />
        ))}
        {axes.map((label, i) => {
          const [x, y] = point(i, max * 1.22);
          return (
            <text key={i} x={x} y={y} textAnchor="middle" dominantBaseline="middle"
              className="fill-gray-500 dark:fill-zinc-400" style={{ fontSize: 7, fontWeight: 600 }}>
              {label.length > 14 ? label.slice(0, 13) + '…' : label}
            </text>
          );
        })}
      </svg>
      <div className="flex justify-center gap-3 sm:gap-4 mt-2 flex-wrap">
        {series.slice(0, 2).map((s, si) => (
          <button key={si}
            onMouseEnter={() => setActive(si)} onMouseLeave={() => setActive(null)}
            className="flex items-center gap-1.5 text-[9px] sm:text-[10px] font-montserrat font-semibold text-gray-600 dark:text-zinc-300">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[si] }} />
            {s.name}
          </button>
        ))}
      </div>
    </div>
  );
}
