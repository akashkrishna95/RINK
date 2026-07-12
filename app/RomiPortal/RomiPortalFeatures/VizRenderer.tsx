'use client';
// C:\Users\Akash Krishna\Downloads\RINK KSUM Website\app\RomiPortal\RomiPortalFeatures\VizRenderer.tsx
// PURPOSE: Structured-tag visualisation renderer for Romi messages — v2.
// The backend prompts instruct Llama to emit tags with REAL data only:
//   [VIZ:BAR]      {"title":"...","data":[{"label":"2024","value":150,"display":"$150B"}]}
//   [VIZ:LINE]     {"title":"...","points":[{"label":"Yr 1","value":12,"display":"$12M"}]}
//   [VIZ:PIE]      {"title":"...","segments":[{"label":"Incumbents","percentage":55}]}
//   [VIZ:DONUT]    (alias of PIE)
//   [VIZ:FUNNEL]   {"tam":{"value":43400,"label":"$43.4B"},"sam":{...},"som":{...}}
//   [VIZ:PROGRESS] {"percent":44,"stages":[{"name":"Problem","status":"complete"}]}
//   [VIZ:GAUGE]    {"title":"Market Match","percent":78,"caption":"..."}          (NEW)
//   [VIZ:RADAR]    {"title":"...","axes":[...],"series":[{"name":"...","values":[...]}],"max":10}  (NEW)
//   [VIZ:TIMELINE] {"title":"Roadmap","items":[{"label":"...","when":"Month 1-2","status":"active"}]} (NEW)
//   [VIZ:KPI]      {"items":[{"label":"TAM","value":"$43.4B","trend":"up"}]}      (NEW)
//   [VIZ:TREEMAP]  {"title":"...","sectors":[{"name":"Agritech","share":42,"details":"..."}]} (NEW)
//   [SRC:url|title] → clickable link icon inline in text
// This module strips the tags from display text, renders each chart with the
// real numbers, and never crashes on malformed JSON (tag silently dropped).

import React from 'react';
import { ExternalLink } from 'lucide-react';
import RomiBarChart from './RomiBarChart';
import RomiLineChart from './RomiLineChart';
import RomiPieChart from './RomiPieChart';
import RomiProgressBar from './RomiProgressBar';
import RomiTreeMap from './RomiTreeMap';
import RomiGauge from './viz/RomiGauge';
import RomiRadarChart from './viz/RomiRadarChart';
import { RomiTimeline, RomiKpiCards } from './viz/RomiTimelineAndKpi';

// ---------------------------------------------------------------------------
// TAM/SAM/SOM funnel
// ---------------------------------------------------------------------------
function RomiMarketFunnel({ tam, sam, som }: {
  tam: { value: number; label: string };
  sam: { value: number; label: string };
  som: { value: number; label: string };
}) {
  const rows = [
    { name: 'TAM', d: tam, w: 'w-full', cls: 'bg-blue-100 text-blue-800 border-blue-200/60' },
    { name: 'SAM', d: sam, w: 'w-3/4', cls: 'bg-blue-300 text-blue-900' },
    { name: 'SOM', d: som, w: 'w-1/2', cls: 'bg-[#1b60bb] text-white' },
  ];
  return (
    <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-5 w-full">
      <h4 className="font-helios font-bold text-gray-800 text-sm mb-1">TAM / SAM / SOM Breakdown</h4>
      <span className="text-[10px] text-gray-400 font-montserrat">Estimates from live web sources — verify via linked references</span>
      <div className="flex flex-col-reverse items-center mt-4 gap-0.5">
        {rows.map((r) => (
          <div key={r.name}
            className={`${r.w} h-11 ${r.cls} border first:rounded-b-xl last:rounded-t-xl flex items-center justify-center font-bold text-[11px] tracking-wide shadow-sm transition-all hover:brightness-95`}>
            {r.name} {r.d.label}
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tag parsing
// ---------------------------------------------------------------------------
const VIZ_TAG_RE = /\[VIZ:(PROGRESS|FUNNEL|BAR|LINE|PIE|DONUT|GAUGE|RADAR|TIMELINE|KPI|TREEMAP)\]\s*(\{[^\n]*\})/g;

const BAR_COLORS = ['bg-blue-100', 'bg-blue-200', 'bg-blue-300', 'bg-blue-500', 'bg-indigo-600', 'bg-indigo-800'];
const PIE_COLORS = ['#1b60bb', '#219653', '#f59e0b', '#8b5cf6', '#cbd5e1'];
const TREE_CLASSES = [
  { size: 'col-span-2 row-span-2', cls: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-800' },
  { size: 'col-span-1 row-span-2', cls: 'bg-blue-500/10 border-blue-500/20 text-blue-800' },
  { size: 'col-span-1 row-span-1', cls: 'bg-purple-500/10 border-purple-500/20 text-purple-800' },
  { size: 'col-span-2 row-span-1', cls: 'bg-amber-500/10 border-amber-500/20 text-amber-800' },
];

export function parseRomiVisuals(text: string): { cleanText: string; charts: React.ReactNode[] } {
  const charts: React.ReactNode[] = [];
  let idx = 0;

  const cleanText = text.replace(VIZ_TAG_RE, (_match, kind: string, json: string) => {
    try {
      const cfg = JSON.parse(json);
      const key = `viz-${idx++}`;
      switch (kind) {
        case 'PROGRESS':
          charts.push(
            <RomiProgressBar key={key}
              overallProgressPercent={Number(cfg.percent) || 0}
              stages={(cfg.stages || []).slice(0, 10)} />);
          break;
        case 'FUNNEL':
          if (cfg.tam && cfg.sam && cfg.som) charts.push(<RomiMarketFunnel key={key} {...cfg} />);
          break;
        case 'BAR':
          charts.push(
            <RomiBarChart key={key} title={cfg.title} subtitle={cfg.subtitle}
              data={(cfg.data || []).map((d: any, i: number) => ({
                label: String(d.label), value: Number(d.value) || 0,
                displayValue: d.display || d.displayValue, color: BAR_COLORS[i % BAR_COLORS.length],
              }))} />);
          break;
        case 'LINE': {
          const pts = (cfg.points || []);
          const max = Math.max(...pts.map((p: any) => Number(p.value) || 0), 1);
          charts.push(
            <RomiLineChart key={key} title={cfg.title}
              points={pts.map((p: any, i: number) => ({
                x: 10 + (80 * i) / Math.max(pts.length - 1, 1),
                y: 90 - (75 * (Number(p.value) || 0)) / max,
                label: String(p.label), value: p.display || String(p.value),
              }))} />);
          break;
        }
        case 'PIE':
        case 'DONUT':
          charts.push(
            <RomiPieChart key={key} title={cfg.title}
              segments={(cfg.segments || []).map((s: any, i: number) => ({
                label: String(s.label), percentage: Number(s.percentage) || 0,
                color: s.color || PIE_COLORS[i % PIE_COLORS.length],
              }))} />);
          break;
        case 'GAUGE':
          charts.push(<RomiGauge key={key} title={cfg.title} percent={Number(cfg.percent) || 0} caption={cfg.caption} />);
          break;
        case 'RADAR':
          if (Array.isArray(cfg.axes) && cfg.axes.length >= 3 && Array.isArray(cfg.series)) {
            charts.push(<RomiRadarChart key={key} title={cfg.title} axes={cfg.axes} series={cfg.series} max={Number(cfg.max) || 10} />);
          }
          break;
        case 'TIMELINE':
          if (Array.isArray(cfg.items)) charts.push(<RomiTimeline key={key} title={cfg.title} items={cfg.items} />);
          break;
        case 'KPI':
          if (Array.isArray(cfg.items)) charts.push(<RomiKpiCards key={key} items={cfg.items} />);
          break;
        case 'TREEMAP':
          if (Array.isArray(cfg.sectors)) {
            charts.push(
              <RomiTreeMap key={key} title={cfg.title}
                sectors={cfg.sectors.slice(0, 4).map((s: any, i: number) => ({
                  name: String(s.name), share: Number(s.share) || 0,
                  details: String(s.details || ''), size: TREE_CLASSES[i].size, colorClass: TREE_CLASSES[i].cls,
                }))} />);
          }
          break;
      }
    } catch {
      // Malformed JSON from the LLM → drop the tag silently, keep chat stable
    }
    return '';
  });

  return { cleanText: cleanText.trim(), charts };
}

// ---------------------------------------------------------------------------
// [SRC:url|title] → inline clickable link icon (market-figure citations)
// ---------------------------------------------------------------------------
const SRC_TAG_RE = /\[SRC:(https?:\/\/[^\|\]\s]+)\|([^\]]*)\]/g;

export function renderSourceLinks(text: string): string {
  return text.replace(SRC_TAG_RE, (_m, url, title) => `[🔗](${url} "${(title || 'source').trim()}")`);
}

/** Anchor renderer for ReactMarkdown: components={{ a: SourceAnchor }} */
export function SourceAnchor({ href, title, children }: any) {
  const isSourceChip = String(children?.[0] ?? children) === '🔗';
  if (isSourceChip) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" title={title || href}
        className="inline-flex items-center align-text-bottom mx-0.5 p-0.5 rounded-md bg-blue-50 border border-blue-100 text-[#1b60bb] hover:bg-blue-100 transition-colors no-underline">
        <ExternalLink size={11} />
      </a>
    );
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer"
      className="text-[#1b60bb] font-semibold underline underline-offset-2">
      {children}
    </a>
  );
}

/** Grid wrapper: renders parsed charts under a message. */
export function VizGrid({ charts }: { charts: React.ReactNode[] }) {
  if (!charts.length) return null;
  return (
    <div className={`grid grid-cols-1 ${charts.length > 1 ? 'lg:grid-cols-2' : ''} gap-6 w-full mt-6`}>
      {charts}
    </div>
  );
}
