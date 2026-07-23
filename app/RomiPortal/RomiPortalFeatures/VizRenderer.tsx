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

import React, { useState } from 'react';
import * as Popover from '@radix-ui/react-popover';
import { ExternalLink } from 'lucide-react';
import RomiBarChart from './RomiBarChart';
export { RomiBarChart };
import RomiLineChart from './RomiLineChart';
import RomiProgressBar from './RomiProgressBar';
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
  return (
    <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 shadow-sm rounded-2xl p-4 sm:p-6 w-full max-w-full sm:max-w-md mx-auto flex flex-col items-center">
      <div className="w-full text-left mb-4 sm:mb-6">
        <h4 className="text-[11px] sm:text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest font-montserrat">
          TAM / SAM / SOM Breakdown
        </h4>
      </div>
      
      <div className="flex flex-col items-center w-full gap-2 sm:gap-2.5 mt-1 sm:mt-2">
        {/* SOM - Top of Pyramid */}
        <div className="w-[55%] sm:w-[50%] max-w-[200px] min-h-[36px] sm:h-12 py-1.5 px-2 bg-[#0060c0] text-white flex items-center justify-center font-bold text-[10px] sm:text-xs tracking-wider rounded-t-xl sm:rounded-t-2xl rounded-b-md shadow-sm transition-all hover:scale-[1.02] hover:brightness-105 select-none text-center truncate">
          SOM {som.label}
        </div>
        
        {/* SAM - Middle of Pyramid */}
        <div className="w-[75%] sm:w-[70%] max-w-[270px] min-h-[36px] sm:h-12 py-1.5 px-2 bg-[#82c2ff] dark:bg-sky-900/60 text-[#004b93] dark:text-sky-200 flex items-center justify-center font-bold text-[10px] sm:text-xs tracking-wider rounded-lg sm:rounded-xl shadow-sm transition-all hover:scale-[1.02] hover:brightness-105 select-none text-center truncate">
          SAM {sam.label}
        </div>
        
        {/* TAM - Bottom of Pyramid */}
        <div className="w-[95%] sm:w-[90%] max-w-[340px] min-h-[36px] sm:h-12 py-1.5 px-2 bg-gradient-to-b from-[#e6f4ff] to-[#d0ebff] dark:from-blue-950/40 dark:to-blue-900/30 text-[#0060c0] dark:text-blue-300 border border-blue-100/50 dark:border-blue-900/20 flex items-center justify-center font-bold text-[10px] sm:text-xs tracking-wider rounded-b-xl sm:rounded-b-2xl rounded-t-md shadow-sm transition-all hover:scale-[1.02] hover:brightness-105 select-none text-center truncate">
          TAM {tam.label}
        </div>
      </div>
      
      <span className="text-[9px] sm:text-[10px] text-gray-400 dark:text-zinc-500 font-montserrat mt-4 sm:mt-5 text-center">
        Estimates from live web sources — verify via linked references
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tag parsing
// ---------------------------------------------------------------------------
const VIZ_TAG_RE = /\[VIZ:(PROGRESS|FUNNEL|BAR|LINE|PIE|DONUT|GAUGE|RADAR|TIMELINE|KPI|TREEMAP)\]\s*(\{[^\n]*\})/g;

const BAR_COLORS = ['bg-blue-100', 'bg-blue-200', 'bg-blue-300', 'bg-blue-500', 'bg-indigo-600', 'bg-indigo-800'];
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
          // RomiTreeMap component is deleted, drop tag silently
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
// Support flexible whitespace matching around the pipes | and handle optional parameters for backward compatibility
const SRC_TAG_RE = /\[SRC:\s*([^\|\]\s]+)\s*\|\s*([^\|\]]*?)(?:\s*\|\s*([^\|\]]*?)\s*\|\s*([^\|\]]*?))?\s*\]/g;

export function extractSourcesFromText(text: string): any[] {
  const sources: any[] = [];
  const matches = [...text.matchAll(SRC_TAG_RE)];
  for (const match of matches) {
    const [_, url, org, title, year] = match;
    const cleanUrl = url.trim();
    const cleanOrg = (org || '').trim();
    const cleanTitle = (title || '').trim();
    const cleanYear = (year || '').trim();
    
    sources.push({
      url: cleanUrl,
      domain: cleanOrg || getHostName(cleanUrl),
      title: cleanTitle || cleanOrg || getHostName(cleanUrl),
      snippet: cleanYear ? `Published: ${cleanYear}` : '',
      isParsed: true
    });
  }
  return sources;
}

export function renderSourceLinks(text: string): string {
  return text.replace(SRC_TAG_RE, (_m, url, org, title, year) => {
    const parts = [org || '', title || '', year || ''].map(s => s.trim()).filter(Boolean).join('|');
    return `[SRC_CHIP:${parts}](${url.trim()})`;
  });
}

function getHostName(urlStr: string) {
  try {
    return new URL(urlStr).hostname.replace(/^www\./, '');
  } catch {
    return 'source';
  }
}

// 1. Interactive Source Chip with Popover Preview
export function SourceChip({ source, labelText }: { source: any; labelText?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const rawLabel = (source.id && !source.id.startsWith('SRC_CHIP:')) ? source.id : labelText || source.domain || getHostName(source.url);
  const displayLabel = String(rawLabel).replace(/^SRC_CHIP:/, '').trim();

  return (
    <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
      <Popover.Trigger asChild>
        <span 
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
          className="inline-flex items-center gap-1 bg-gray-150 hover:bg-gray-250 dark:bg-zinc-800/80 dark:hover:bg-zinc-700 text-gray-700 dark:text-zinc-350 text-[11px] font-bold px-1.5 py-0.5 rounded-md mx-0.5 cursor-pointer select-none transition-colors border border-gray-200 dark:border-zinc-700 align-middle active:scale-95"
        >
          <img 
            src={`https://www.google.com/s2/favicons?domain=${source.domain}&sz=32`}
            alt=""
            className="w-3 h-3 rounded-xs pointer-events-none"
            onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
          />
          {displayLabel}
        </span>
      </Popover.Trigger>
      
      <Popover.Portal>
        <Popover.Content 
          side="top" 
          align="center" 
          sideOffset={6}
          className="z-[9999] w-72 bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 rounded-xl p-3.5 shadow-xl animate-in fade-in slide-in-from-bottom-2 duration-200 font-sans"
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
        >
          <div className="flex flex-col gap-1.5 text-xs text-gray-800 dark:text-zinc-200">
            <span className="text-xs font-bold text-[#1b60bb] dark:text-[#7dd3fc] truncate">
              {String(source.title || source.domain).replace(/^SRC_CHIP:/, '')}
            </span>
            <p className="text-[11px] text-gray-600 dark:text-zinc-400 leading-relaxed max-h-20 overflow-y-auto">
              {source.snippet}
            </p>
            <a 
              href={source.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[10px] font-semibold text-blue-500 dark:text-[#7dd3fc] hover:underline mt-1 self-start flex items-center gap-0.5"
            >
              Open link ↗
            </a>
          </div>
          <Popover.Arrow className="fill-white dark:fill-zinc-900 stroke-gray-150 dark:stroke-zinc-850 stroke-1" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

// 2. Custom TAM/SAM/SOM Pyramid Chart Component
export function MarketPyramid({ tam, sam, som }: { tam: string; sam: string; som: string }) {
  return (
    <div className="w-full max-w-full sm:max-w-md mx-auto my-3 sm:my-5 p-3.5 sm:p-5 bg-white/80 dark:bg-zinc-900/50 backdrop-blur-md border border-gray-150 dark:border-zinc-800/80 rounded-2xl sm:rounded-3xl shadow-xs flex flex-col gap-3 sm:gap-4 font-sans items-center">
      <h4 className="text-[11px] sm:text-xs font-bold text-gray-400 dark:text-zinc-400 uppercase tracking-widest text-center mb-1 sm:mb-2">
        Market Sizing Breakdown
      </h4>
      <div className="flex flex-col items-center w-full gap-1.5">
        {/* SOM Layer (Top of Pyramid - Smallest) */}
        <div className="w-[82%] sm:w-[75%] bg-emerald-500/10 border border-emerald-500/20 dark:bg-emerald-900/30 dark:border-emerald-700/40 rounded-t-xl sm:rounded-t-2xl rounded-b-md p-2.5 sm:p-3.5 flex justify-between items-center transition-all hover:scale-[1.02] hover:bg-emerald-500/15 dark:hover:bg-emerald-900/40 select-none shadow-xs gap-2">
          <div className="flex flex-col text-left min-w-0">
            <span className="text-[9px] sm:text-[10px] font-bold text-emerald-600 dark:text-emerald-300 uppercase tracking-wide truncate">
              SOM (Serviceable Obtainable)
            </span>
            <span className="text-[10px] sm:text-[11px] text-gray-500 dark:text-zinc-400 leading-normal line-clamp-1">
              Short term market share projection
            </span>
          </div>
          <span className="text-xs sm:text-sm font-black text-emerald-600 dark:text-emerald-300 ml-2 sm:ml-3 shrink-0">
            {som}
          </span>
        </div>

        {/* SAM Layer (Middle of Pyramid - Medium) */}
        <div className="w-[91%] sm:w-[88%] bg-blue-500/10 border border-blue-500/20 dark:bg-sky-900/30 dark:border-sky-700/40 rounded-lg p-2.5 sm:p-3.5 flex justify-between items-center transition-all hover:scale-[1.02] hover:bg-blue-500/15 dark:hover:bg-sky-900/40 select-none shadow-xs gap-2">
          <div className="flex flex-col text-left min-w-0">
            <span className="text-[9px] sm:text-[10px] font-bold text-blue-600 dark:text-[#7dd3fc] uppercase tracking-wide truncate">
              SAM (Serviceable Addressable)
            </span>
            <span className="text-[10px] sm:text-[11px] text-gray-500 dark:text-zinc-400 leading-normal line-clamp-1">
              Target reachable segment
            </span>
          </div>
          <span className="text-xs sm:text-sm font-black text-blue-600 dark:text-[#7dd3fc] ml-2 sm:ml-3 shrink-0">
            {sam}
          </span>
        </div>

        {/* TAM Layer (Bottom of Pyramid - Largest) */}
        <div className="w-full bg-[#1b60bb]/10 border border-[#1b60bb]/20 dark:bg-blue-900/30 dark:border-blue-700/40 rounded-b-xl sm:rounded-b-2xl rounded-t-md p-2.5 sm:p-3.5 flex justify-between items-center transition-all hover:scale-[1.02] hover:bg-[#1b60bb]/15 dark:hover:bg-blue-900/40 select-none shadow-xs gap-2">
          <div className="flex flex-col text-left min-w-0">
            <span className="text-[9px] sm:text-[10px] font-bold text-[#1b60bb] dark:text-[#7dd3fc] uppercase tracking-wide truncate">
              TAM (Total Addressable)
            </span>
            <span className="text-[10px] sm:text-[11px] text-gray-500 dark:text-zinc-400 leading-normal line-clamp-1">
              Global market potential scope
            </span>
          </div>
          <span className="text-xs sm:text-sm font-black text-[#1b60bb] dark:text-[#7dd3fc] ml-2 sm:ml-3 shrink-0">
            {tam}
          </span>
        </div>
      </div>
    </div>
  );
}

/** Anchor renderer for ReactMarkdown: components={{ a: SourceAnchor }} */
export function SourceAnchor({ href, children, sources }: any) {
  const textStr = String(children?.[0] ?? children ?? '');
  const isSourceChip = textStr.startsWith('SRC_CHIP:') || textStr === '🔗';
  
  if (isSourceChip) {
    const rawLabel = textStr.startsWith('SRC_CHIP:') ? textStr.replace(/^SRC_CHIP:/, '') : 'source';
    const parts = rawLabel.split('|');
    const labelText = (parts[0] || 'source').replace(/^SRC_CHIP:/, '').trim();
    const org = parts[0] || '';
    const pubTitle = parts[1] || '';
    const year = parts[2] || '';

    // Find in sources list by URL matching
    const matchingSource = sources?.find((s: any) => s.url === href || s.url?.replace(/https?:\/\/(www\.)?/, '') === href?.replace(/https?:\/\/(www\.)?/, ''));

    // Construct the final source object for the tooltip
    const sourceObj = matchingSource ? { ...matchingSource } : { url: href };
    
    // Dynamically populate fields if missing or override with parsed parameters
    sourceObj.domain = (sourceObj.domain || org || getHostName(href)).replace(/^SRC_CHIP:/, '').trim();
    sourceObj.title = (sourceObj.title || pubTitle || sourceObj.domain).replace(/^SRC_CHIP:/, '').trim();
    if (year) {
      if (sourceObj.snippet) {
        if (!sourceObj.snippet.includes(year)) {
          sourceObj.snippet = `${sourceObj.snippet} (Published: ${year})`;
        }
      } else {
        sourceObj.snippet = `Published: ${year}`;
      }
    }
    
    return <SourceChip source={sourceObj} labelText={labelText} />;
  }

  const cleanChildren = typeof children === 'string' ? children.replace(/^SRC_CHIP:/, '').trim() : children;
  const isUrl = href && (href.startsWith('http://') || href.startsWith('https://'));

  if (isUrl) {
    const domain = getHostName(href);
    return (
      <a 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 bg-[#eff9ff] hover:bg-[#dbeffd] dark:bg-sky-950/30 dark:hover:bg-sky-900/40 text-[#1b60bb] dark:text-[#7dd3fc] text-[11px] font-bold px-3 py-1 rounded-full mx-0.5 cursor-pointer select-none transition-colors border border-blue-200/50 dark:border-blue-800/30 align-middle active:scale-95 no-underline shadow-xs"
      >
        <img 
          src={`https://www.google.com/s2/favicons?domain=${domain}&sz=32`}
          alt=""
          className="w-3.5 h-3.5 rounded-xs pointer-events-none shrink-0"
          onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
        />
        <span className="truncate max-w-[150px] sm:max-w-[200px]">{domain}</span>
      </a>
    );
  }
  
  return (
    <a href={href} target="_blank" rel="noopener noreferrer"
      className="text-[#1b60bb] dark:text-[#7dd3fc] font-semibold underline underline-offset-2 hover:text-[#14498f] dark:hover:text-sky-200">
      {cleanChildren}
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
