// C:\Users\Akash Krishna\Downloads\RINK KSUM Website\app\RomiPortal\RomiPortalFeatures\DataVisualizationPanel.tsx
// PURPOSE: Market Intelligence right-panel — v2.
// FIXED vs v1: the old panel read data.tam_value / data.top_competitors which the
// backend NEVER returned, so it ALWAYS showed hardcoded fake data (Abbott/Roche).
// This version consumes the real structured contract from POST /api/market-research
// ({status, data:{tam_musd, sam_musd, som_musd, cagr, figures[], sources[], ...}})
// plus /api/competitor-scan, shows honest "data unavailable" states instead of
// fabricated numbers, and links every figure to its source with an icon.

import { useState } from 'react';
import {
  BarChart3, TrendingUp, Users, RefreshCw, X, ExternalLink, Info,
} from 'lucide-react';

interface DataVisualizationPanelProps {
  market?: any;
  messageContent: string;
  onRefresh?: () => Promise<void> | void;
  onClose?: () => void;
}

function SourceChip({ url, title }: { url: string; title: string }) {
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" title={title}
      className="inline-flex items-center p-0.5 ml-1 rounded bg-blue-50 border border-blue-100 text-[#1b60bb] hover:bg-blue-100 transition-colors align-middle">
      <ExternalLink size={10} />
    </a>
  );
}

export default function DataVisualizationPanel({ market, messageContent, onRefresh, onClose }: DataVisualizationPanelProps) {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefreshClick = async () => {
    if (!onRefresh) return;
    setRefreshing(true);
    try {
      await onRefresh();
    } catch (e) {
      console.error(e);
    } finally {
      setRefreshing(false);
    }
  };

  const bar = (musd: number | null) =>
    market?.tam_musd && musd ? Math.max(4, Math.round((musd / market.tam_musd) * 100)) : 0;

  const sizingRows = market ? [
    { label: 'TAM (Total Addressable Market)', display: market.tam_display, pct: 100, bg: 'bg-blue-50/30 border-blue-100/50', barCls: 'bg-[#1b60bb]', txt: 'text-[#1b60bb]' },
    { label: 'SAM (Serviceable Addressable)', display: market.sam_display, pct: bar(market.sam_musd), bg: 'bg-indigo-50/30 border-indigo-100/50', barCls: 'bg-indigo-500', txt: 'text-indigo-600' },
    { label: 'SOM (Serviceable Obtainable)', display: market.som_display, pct: bar(market.som_musd), bg: 'bg-emerald-50/30 border-emerald-100/50', barCls: 'bg-emerald-500', txt: 'text-emerald-600' },
  ] : [];

  return (
    <div className="w-full bg-white/80 dark:bg-zinc-900/60 backdrop-blur-md border border-gray-200/80 dark:border-zinc-800/80 flex flex-col overflow-hidden rounded-2xl shadow-xs transition-all">
      {/* Header */}
      <div className="p-4 border-b border-gray-150 dark:border-zinc-800 flex items-center justify-between bg-gray-50/50 dark:bg-zinc-900/50">
        <div className="flex items-center gap-2">
          <BarChart3 size={16} className="text-[#1b60bb] dark:text-sky-300" />
          <span className="font-helios font-bold text-xs text-gray-700 dark:text-zinc-300 uppercase tracking-wider">
            Market Intelligence Visuals
          </span>
        </div>
        <div className="flex items-center gap-1">
          {onRefresh && (
            <button onClick={handleRefreshClick} disabled={refreshing}
              className="p-1.5 hover:bg-gray-200 dark:hover:bg-zinc-800 text-gray-500 dark:text-zinc-400 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
              title="Refresh live data">
              <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
            </button>
          )}
          {onClose && (
            <button onClick={onClose} className="lg:hidden p-1.5 hover:bg-gray-200 dark:hover:bg-zinc-800 text-gray-500 rounded-lg cursor-pointer" title="Close">
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      <div className="p-3.5 sm:p-5 space-y-4 sm:space-y-6 max-h-[70vh] sm:max-h-[480px] overflow-y-auto">
        {market ? (
          <>
            {(!market.tam_musd || market.data_quality === 'unavailable') ? (
              <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 rounded-xl flex gap-3 text-amber-800 dark:text-amber-400 text-xs font-montserrat">
                <Info size={16} className="shrink-0 mt-0.5" />
                <p>
                  No reliable market-size figures were found in web sources for this query.
                  Try a more specific sector name (e.g. "agritech drone" instead of a full sentence).
                </p>
              </div>
            ) : (
              <>
                {/* TAM / SAM / SOM */}
                {market.tam_musd !== null && market.tam_musd !== undefined && (market.sam_musd || 0) <= (market.tam_musd || 0) && (
                  <div className="space-y-3">
                    <h3 className="text-[11px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider font-helios">
                      Market Sizing (estimates, USD)
                    </h3>
                    {sizingRows.map((row) => (
                      <div key={row.label} className={`p-3.5 border rounded-xl ${row.bg} dark:bg-zinc-850/30 dark:border-zinc-800`}>
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-montserrat text-gray-500 dark:text-zinc-400">{row.label}</span>
                          <span className={`text-sm font-bold font-helios ${row.txt}`}>{row.display}</span>
                        </div>
                        <div className="w-full bg-gray-100 dark:bg-zinc-800 h-1.5 rounded-full mt-2 overflow-hidden">
                          <div className={`${row.barCls} h-full rounded-full transition-all duration-1000`}
                            style={{ width: `${row.pct}%` }} />
                        </div>
                      </div>
                    ))}
                    {market.method_note && (
                      <p className="text-[9px] text-gray-400 dark:text-zinc-500 font-montserrat leading-relaxed">{market.method_note}</p>
                    )}
                  </div>
                )}

                {/* CAGR + source count */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-gray-50 dark:bg-zinc-850/40 rounded-xl border border-gray-150 dark:border-zinc-800">
                    <div className="flex items-center gap-1.5 text-gray-500 dark:text-zinc-400 mb-1">
                      <TrendingUp size={14} className="text-emerald-500" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">CAGR</span>
                    </div>
                    <p className="text-lg font-bold font-helios text-gray-800 dark:text-zinc-200">{market.cagr ?? '—'}</p>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-zinc-850/40 rounded-xl border border-gray-150 dark:border-zinc-800">
                    <div className="flex items-center gap-1.5 text-gray-500 dark:text-zinc-400 mb-1">
                      <Users size={14} className="text-blue-500" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Sources</span>
                    </div>
                    <p className="text-lg font-bold font-helios text-gray-800 dark:text-zinc-200">{market.sources_count ?? 0}</p>
                  </div>
                </div>

                {/* Figures with per-figure source links */}
                {market.figures && market.figures.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-[11px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider font-helios">
                      Figures found (tap 🔗 to verify)
                    </h3>
                    <div className="flex flex-col gap-1.5">
                      {market.figures.slice(0, 5).map((f: any, i: number) => (
                        <div key={i} className="flex items-center justify-between text-[11px] font-montserrat bg-gray-50 dark:bg-zinc-850/30 border border-gray-150 dark:border-zinc-800 rounded-lg px-2.5 py-1.5 text-gray-650 dark:text-zinc-300">
                          <span className="truncate pr-2">
                            {f.display}{f.year ? ` (${f.year})` : ''}
                          </span>
                          <SourceChip url={f.source_url} title={f.source_title} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Competitors — real, from live scan, each with a link */}
            {market.competitors && market.competitors.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-[11px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider font-helios">
                  Existing solutions found
                </h3>
                <div className="flex flex-col gap-1.5">
                  {market.competitors.slice(0, 4).map((c: any, i: number) => (
                    <div key={i} className="text-[11px] font-montserrat bg-gray-100 dark:bg-zinc-850/40 text-gray-700 dark:text-zinc-300 px-2.5 py-1.5 rounded-lg border border-gray-200/50 dark:border-zinc-800 flex items-center justify-between">
                      <span className="font-bold truncate pr-2">{c.name}</span>
                      <SourceChip url={c.url} title={c.name} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 rounded-xl flex gap-3 text-amber-800 dark:text-amber-400 text-xs font-montserrat">
            <Info size={16} className="shrink-0 mt-0.5" />
            <p>No market data loaded yet.</p>
          </div>
        )}
      </div>

      <div className="p-3 bg-gray-50 dark:bg-zinc-900/80 border-t border-gray-150 dark:border-zinc-800 text-[9px] font-montserrat text-center text-gray-400 dark:text-zinc-500">
        Estimates from live web sources — verify via linked references.
      </div>
    </div>
  );
}
