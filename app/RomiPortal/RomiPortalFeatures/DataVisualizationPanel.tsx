'use client';
// C:\Users\Akash Krishna\Downloads\RINK KSUM Website\app\RomiPortal\RomiPortalFeatures\DataVisualizationPanel.tsx
// PURPOSE: Market Intelligence right-panel — v2.
// FIXED vs v1: the old panel read data.tam_value / data.top_competitors which the
// backend NEVER returned, so it ALWAYS showed hardcoded fake data (Abbott/Roche).
// This version consumes the real structured contract from POST /api/market-research
// ({status, data:{tam_musd, sam_musd, som_musd, cagr, figures[], sources[], ...}})
// plus /api/competitor-scan, shows honest "data unavailable" states instead of
// fabricated numbers, and links every figure to its source with an icon.

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  BarChart3, TrendingUp, Users, RefreshCw, AlertTriangle, X, ExternalLink, Info,
} from 'lucide-react';

interface DataVisualizationPanelProps {
  latestUserQuery: string;
  onClose?: () => void;
}

interface Figure {
  value_musd: number; display: string; year?: string | null;
  source_url: string; source_title: string;
}
interface Source { title: string; url: string; snippet: string }
interface Competitor { name: string; url: string; snippet: string }

interface MarketData {
  tam_musd: number | null; sam_musd: number | null; som_musd: number | null;
  tam_display: string | null; sam_display: string | null; som_display: string | null;
  cagr: string | null;
  figures: Figure[]; sources: Source[]; sources_count: number;
  data_quality: 'high' | 'medium' | 'low' | 'unavailable';
  method_note?: string;
}

function SourceChip({ url, title }: { url: string; title: string }) {
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" title={title}
      className="inline-flex items-center p-0.5 ml-1 rounded bg-blue-50 border border-blue-100 text-[#1b60bb] hover:bg-blue-100 transition-colors align-middle">
      <ExternalLink size={10} />
    </a>
  );
}

export default function DataVisualizationPanel({ latestUserQuery, onClose }: DataVisualizationPanelProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [market, setMarket] = useState<MarketData | null>(null);
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const abortRef = useRef<AbortController | null>(null);

  const fetchMarketIntelligence = useCallback(async () => {
    if (!latestUserQuery) return;

    // Cancel any in-flight request so a rapid follow-up query can't race an
    // older response and overwrite fresher data (fixes a v1 race condition).
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
      const [marketRes, compRes] = await Promise.allSettled([
        fetch(`${apiUrl}/api/market-research`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({ technology: latestUserQuery.slice(0, 100), sector: latestUserQuery.slice(0, 100) }),
        }),
        fetch(`${apiUrl}/api/competitor-scan`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({ technology: latestUserQuery.slice(0, 100), sector: '' }),
        }),
      ]);

      if (marketRes.status === 'fulfilled' && marketRes.value.ok) {
        const payload = await marketRes.value.json();
        setMarket(payload.data as MarketData);
      } else {
        setError('Market research service is unreachable right now.');
        setMarket(null);
      }

      if (compRes.status === 'fulfilled' && compRes.value.ok) {
        const payload = await compRes.value.json();
        setCompetitors(payload.data?.competitors ?? []);
      } else {
        setCompetitors([]);
      }
    } catch (err: any) {
      if (err?.name !== 'AbortError') {
        setError('Could not reach the market research backend.');
        setMarket(null);
      }
    } finally {
      if (abortRef.current === controller) setLoading(false);
    }
  }, [latestUserQuery]);

  useEffect(() => {
    fetchMarketIntelligence();
    return () => abortRef.current?.abort();
  }, [fetchMarketIntelligence]);

  const bar = (musd: number | null) =>
    market?.tam_musd && musd ? Math.max(4, Math.round((musd / market.tam_musd) * 100)) : 0;

  const sizingRows = market ? [
    { label: 'TAM (Total Addressable Market)', display: market.tam_display, pct: 100, bg: 'bg-blue-50/30 border-blue-100/50', barCls: 'bg-[#1b60bb]', txt: 'text-[#1b60bb]' },
    { label: 'SAM (Serviceable Addressable)', display: market.sam_display, pct: bar(market.sam_musd), bg: 'bg-indigo-50/30 border-indigo-100/50', barCls: 'bg-indigo-500', txt: 'text-indigo-600' },
    { label: 'SOM (Serviceable Obtainable)', display: market.som_display, pct: bar(market.som_musd), bg: 'bg-emerald-50/30 border-emerald-100/50', barCls: 'bg-emerald-500', txt: 'text-emerald-600' },
  ] : [];

  return (
    <div className="w-full h-full bg-white border-l border-gray-100 flex flex-col overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
        <div className="flex items-center gap-2">
          <BarChart3 size={16} className="text-[#1b60bb]" />
          <span className="font-helios font-bold text-xs text-gray-700 uppercase tracking-wider">
            Market Intelligence
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={fetchMarketIntelligence} disabled={loading}
            className="p-1.5 hover:bg-gray-200 text-gray-500 rounded-lg transition-colors disabled:opacity-50"
            title="Refresh live data">
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
          {onClose && (
            <button onClick={onClose} className="lg:hidden p-1.5 hover:bg-gray-200 text-gray-500 rounded-lg" title="Close">
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {loading ? (
          <div className="h-48 flex flex-col items-center justify-center gap-3">
            <div className="w-6 h-6 border-2 border-[#1b60bb] border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-montserrat text-gray-400 animate-pulse text-center px-4">
              Researching live market data for:<br />
              <span className="font-bold mt-1 block">"{latestUserQuery.substring(0, 40)}…"</span>
            </p>
          </div>
        ) : error ? (
          <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex gap-3 text-red-700 text-xs font-montserrat">
            <AlertTriangle size={16} className="shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Market data unavailable</p>
              <p className="opacity-80 mt-0.5">{error} Try refresh.</p>
            </div>
          </div>
        ) : market ? (
          <>
            {market.data_quality === 'unavailable' || market.tam_musd === null ? (
              <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl flex gap-3 text-amber-800 text-xs font-montserrat">
                <Info size={16} className="shrink-0 mt-0.5" />
                <p>
                  No reliable market-size figures were found in web sources for this query.
                  Try a more specific sector name (e.g. "agritech drone" instead of a full sentence).
                </p>
              </div>
            ) : (
              <>
                {/* TAM / SAM / SOM */}
                <div className="space-y-3">
                  <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider font-helios">
                    Market Sizing (estimates, USD)
                  </h3>
                  {sizingRows.map((row) => (
                    <div key={row.label} className={`p-3.5 border rounded-xl ${row.bg}`}>
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-montserrat text-gray-500">{row.label}</span>
                        <span className={`text-sm font-bold font-helios ${row.txt}`}>{row.display}</span>
                      </div>
                      <div className="w-full bg-gray-100 h-1.5 rounded-full mt-2 overflow-hidden">
                        <div className={`${row.barCls} h-full rounded-full transition-all duration-1000`}
                          style={{ width: `${row.pct}%` }} />
                      </div>
                    </div>
                  ))}
                  {market.method_note && (
                    <p className="text-[9px] text-gray-400 font-montserrat leading-relaxed">{market.method_note}</p>
                  )}
                </div>

                {/* CAGR + source count */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="flex items-center gap-1.5 text-gray-500 mb-1">
                      <TrendingUp size={14} className="text-emerald-500" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">CAGR</span>
                    </div>
                    <p className="text-lg font-bold font-helios text-gray-800">{market.cagr ?? '—'}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="flex items-center gap-1.5 text-gray-500 mb-1">
                      <Users size={14} className="text-blue-500" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Sources</span>
                    </div>
                    <p className="text-lg font-bold font-helios text-gray-800">{market.sources_count}</p>
                  </div>
                </div>

                {/* Figures with per-figure source links */}
                {market.figures.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider font-helios">
                      Figures found (tap 🔗 to verify)
                    </h3>
                    <div className="flex flex-col gap-1.5">
                      {market.figures.slice(0, 5).map((f, i) => (
                        <div key={i} className="flex items-center justify-between text-[11px] font-montserrat bg-gray-50 border border-gray-100 rounded-lg px-2.5 py-1.5">
                          <span className="text-gray-600 truncate pr-2">
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
            {competitors.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider font-helios">
                  Existing solutions found
                </h3>
                <div className="flex flex-col gap-1.5">
                  {competitors.slice(0, 4).map((c, i) => (
                    <div key={i} className="text-[11px] font-montserrat bg-gray-100 text-gray-600 px-2.5 py-1.5 rounded-lg border border-gray-200/40 flex items-center justify-between">
                      <span className="font-bold truncate pr-2">{c.name}</span>
                      <SourceChip url={c.url} title={c.name} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : null}
      </div>

      <div className="p-3 bg-gray-50 border-t border-gray-100 text-[9px] font-montserrat text-center text-gray-400">
        Estimates from live web sources. KSUM is not liable for financial decisions — verify via linked references.
      </div>
    </div>
  );
}
