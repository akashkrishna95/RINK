'use client';
// InstrumentMapPanel.tsx — Kerala map panel with rounded 3xl edges & tile toggle.

import { useEffect, useRef, useState } from 'react';
import { X, MapPin, Layers } from 'lucide-react';

export interface InstLocation {
  id: string;
  name: string;
  kind: string;
  district: string;
  facility?: string;
  lat: number;
  lng: number;
  url: string;
  email?: string;
  phone?: string;
  address?: string;
}

interface Props {
  locations: InstLocation[];
  selectedId?: string | null;
  onClose: () => void;
  onSelect?: (id: string) => void;
  isInline?: boolean;
}

const LEAFLET_CSS = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
const LEAFLET_JS = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';

function ensureLeaflet(): Promise<any> {
  return new Promise((resolve, reject) => {
    const w = window as any;
    if (w.L) return resolve(w.L);
    if (!document.querySelector(`link[href="${LEAFLET_CSS}"]`)) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = LEAFLET_CSS;
      document.head.appendChild(link);
    }
    const existing = document.querySelector(`script[src="${LEAFLET_JS}"]`) as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener('load', () => resolve((window as any).L));
      existing.addEventListener('error', reject);
      return;
    }
    const s = document.createElement('script');
    s.src = LEAFLET_JS;
    s.onload = () => resolve((window as any).L);
    s.onerror = reject;
    document.body.appendChild(s);
  });
}

export default function InstrumentMapPanel({ locations, selectedId, onClose, onSelect, isInline = false }: Props) {
  const mapDivRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<Record<string, any>>({});
  const layerRef = useRef<any>(null);
  const tileLayerRef = useRef<any>(null);
  const [tileType, setTileType] = useState<'default' | 'satellite'>('default');

  // Init map once
  useEffect(() => {
    let cancelled = false;
    ensureLeaflet().then((L) => {
      if (cancelled || !mapDivRef.current || mapRef.current) return;
      const map = L.map(mapDivRef.current, { zoomControl: false, attributionControl: false })
        .setView([10.35, 76.3], 7); // Kerala
      
      const defaultUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
      tileLayerRef.current = L.tileLayer(defaultUrl, { maxZoom: 18 }).addTo(map);

      layerRef.current = L.layerGroup().addTo(map);
      mapRef.current = map;
      renderMarkers(L);
    }).catch(() => { /* CDN fallback */ });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Switch tiles when tileType changes
  useEffect(() => {
    const L = (window as any).L;
    if (!L || !mapRef.current) return;
    if (tileLayerRef.current) {
      mapRef.current.removeLayer(tileLayerRef.current);
    }
    const url = tileType === 'satellite'
      ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
      : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    tileLayerRef.current = L.tileLayer(url, { maxZoom: 18 }).addTo(mapRef.current);
  }, [tileType]);

  const renderMarkers = (L: any) => {
    if (!mapRef.current || !layerRef.current) return;
    layerRef.current.clearLayers();
    markersRef.current = {};
    const pts: [number, number][] = [];
    locations.forEach((loc) => {
      const isSel = loc.id === selectedId;
      const size = isSel ? 36 : 26;
      const color = isSel ? '#dc2626' : loc.kind === 'service' ? '#7c3aed' : '#1b60bb';
      const icon = L.divIcon({
        className: '',
        html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${size}" height="${size}" style="filter: drop-shadow(0 3px 5px rgba(0,0,0,0.35)); display: block;">
                 <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="${color}" stroke="white" stroke-width="1.5" stroke-linejoin="round" />
                 <circle cx="12" cy="9" r="3" fill="white" />
               </svg>`,
        iconSize: [size, size],
        iconAnchor: [size / 2, size],
      });

      const cleanAddress = loc.address || (loc as any).location || (loc.facility ? loc.facility + ', ' : '') + loc.district + ', Kerala, India';
      const websiteDomain = loc.url ? loc.url.replace(/^https?:\/\/(www\.)?/, '').split('/')[0] : 'rink.kerala.gov.in';
      const cleanEmail = loc.email || `info@${websiteDomain.toLowerCase()}`;
      const cleanPhone = loc.phone || (loc as any).phoneNumber || '+91 471 270 0270';

      const popupHtml = `
        <div class="p-1 min-w-[230px] max-w-[280px] flex flex-col gap-2.5 text-gray-700 dark:text-zinc-300 font-sans leading-snug">
          <div class="font-bold text-sm leading-snug text-[#1b60bb] dark:text-blue-400 font-helios">
            ${loc.name}
          </div>
          <div class="flex flex-wrap items-center gap-1.5 mt-0.5 text-[10px] font-helios font-bold">
            <span class="text-[#1b4f8d] dark:text-blue-300 bg-[#eff9ff] dark:bg-blue-950/50 px-2 py-0.5 rounded border border-blue-100/50 dark:border-blue-900/30">
              ${loc.district}
            </span>
            <span class="bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 px-2 py-0.5 rounded font-mono font-bold uppercase tracking-wider scale-95 border border-gray-200/50 dark:border-zinc-700/30">
              ${loc.kind}
            </span>
          </div>
          
          <div class="text-[11px] text-gray-650 dark:text-zinc-300 font-sans mt-1.5 leading-relaxed border-t border-gray-100 dark:border-zinc-800 pt-1.5">
            <span class="font-bold text-[#1b4f8d] dark:text-blue-400">Address: </span>
            <span class="text-gray-600 dark:text-zinc-400">${cleanAddress}</span>
          </div>

          <div class="text-[11px] text-gray-650 dark:text-zinc-300 font-sans mt-0.5">
            <span class="font-bold text-[#1b4f8d] dark:text-blue-400">Email: </span>
            <a href="mailto:${cleanEmail}" class="text-[#1b60bb] dark:text-blue-400 hover:underline hover:text-[#1872dd] font-semibold">
              ${cleanEmail}
            </a>
          </div>

          <div class="text-[11px] text-gray-650 dark:text-zinc-300 font-sans mt-0.5">
            <span class="font-bold text-[#1b4f8d] dark:text-blue-400">Phone: </span>
            <span class="text-gray-600 dark:text-zinc-400 font-semibold">${cleanPhone}</span>
          </div>

          <a 
            href="${loc.url ? (loc.url.startsWith('http') ? loc.url : `https://${loc.url}`) : `https://rink-ui.vercel.app/instrument/${loc.id}`}" 
            target="_blank" 
            rel="noopener noreferrer" 
            class="mt-2 text-center text-xs font-bold bg-[#1b60bb] hover:bg-[#1872dd] text-white py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-sm font-sans"
            style="color: white !important; text-decoration: none;"
          >
            Visit Website
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="7" y1="17" x2="17" y2="7"></line>
              <polyline points="7 7 17 7 17 17"></polyline>
            </svg>
          </a>
        </div>
      `;

      const m = L.marker([loc.lat, loc.lng], { icon }).addTo(layerRef.current);
      m.bindPopup(popupHtml, {
        closeButton: true,
        className: 'custom-popup',
        offset: [0, -size + 12]
      });

      // Show popup on hover
      m.on('mouseover', () => {
        m.openPopup();
      });

      m.on('click', () => onSelect && onSelect(loc.id));
      m.on('dblclick', () => window.open(loc.url, '_blank'));
      markersRef.current[loc.id] = m;
      pts.push([loc.lat, loc.lng]);
    });
    if (pts.length > 0) {
      try { mapRef.current.fitBounds(pts, { padding: [30, 30], maxZoom: 11 }); } catch { /* noop */ }
    }
  };

  // Re-render markers when locations change
  useEffect(() => {
    const L = (window as any).L;
    if (L && mapRef.current) renderMarkers(L);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locations]);

  // Spotlight the selected pin
  useEffect(() => {
    const L = (window as any).L;
    if (!L || !mapRef.current) return;
    
    if (selectedId) {
      const loc = locations.find((l) => l.id === selectedId);
      if (loc) {
        mapRef.current.setView([loc.lat, loc.lng], 12, { animate: true });
        const mk = markersRef.current[selectedId];
        if (mk) {
          setTimeout(() => {
            if (mk && mapRef.current) mk.openPopup();
          }, 350);
        }
      }
    }

    locations.forEach((loc) => {
      const mk = markersRef.current[loc.id];
      if (!mk) return;

      const isSel = loc.id === selectedId;
      const size = isSel ? 36 : 26;
      const color = isSel ? '#dc2626' : loc.kind === 'service' ? '#7c3aed' : '#1b60bb';

      const icon = L.divIcon({
        className: '',
        html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${size}" height="${size}" style="filter: drop-shadow(0 3px 5px rgba(0,0,0,0.35)); display: block;">
                 <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="${color}" stroke="white" stroke-width="1.5" stroke-linejoin="round" />
                 <circle cx="12" cy="9" r="3" fill="white" />
               </svg>`,
        iconSize: [size, size],
        iconAnchor: [size / 2, size],
      });

      mk.setIcon(icon);
      if (isSel) {
        mk.setZIndexOffset(1000);
      } else {
        mk.setZIndexOffset(0);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  const containerClasses = isInline
    ? "w-full my-3 rounded-3xl border border-gray-200/80 dark:border-white/[0.1] bg-white/95 dark:bg-[#1a1a1a]/95 overflow-hidden shrink-0 flex flex-col shadow-xl p-3 sm:p-4"
    : "w-full sm:w-[360px] lg:w-[420px] xl:w-96 border border-gray-200/80 dark:border-white/[0.1] bg-white/95 dark:bg-[#1a1a1a]/95 overflow-hidden shrink-0 flex flex-col h-full shadow-2xl rounded-3xl p-3 sm:p-4";

  return (
    <div className={containerClasses}>
      <style>{`
        .custom-popup .leaflet-popup-content-wrapper {
          background: rgba(255, 255, 255, 0.98) !important;
          border: 1px solid rgba(27, 96, 187, 0.15) !important;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12) !important;
          backdrop-filter: blur(12px) !important;
          border-radius: 1.25rem !important;
          padding: 4px !important;
        }
        .dark .custom-popup .leaflet-popup-content-wrapper {
          background: rgba(24, 24, 27, 0.98) !important;
          color: #f4f4f5 !important;
          border: 1px solid rgba(255, 255, 255, 0.08) !important;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5) !important;
        }
        .custom-popup .leaflet-popup-tip {
          background: rgba(255, 255, 255, 0.98) !important;
          border-left: 1px solid rgba(27, 96, 187, 0.15) !important;
          border-bottom: 1px solid rgba(27, 96, 187, 0.15) !important;
        }
        .dark .custom-popup .leaflet-popup-tip {
          background: rgba(24, 24, 27, 0.98) !important;
          border-left: 1px solid rgba(255, 255, 255, 0.08) !important;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08) !important;
        }
        .custom-popup .leaflet-popup-content {
          margin: 12px !important;
        }
        .custom-popup .leaflet-popup-close-button {
          color: rgba(27, 96, 187, 0.6) !important;
          padding: 8px 8px 0 0 !important;
        }
        .dark .custom-popup .leaflet-popup-close-button {
          color: rgba(255, 255, 255, 0.4) !important;
        }
        .custom-popup .leaflet-popup-close-button:hover {
          color: #1b60bb !important;
        }
        .dark .custom-popup .leaflet-popup-close-button:hover {
          color: white !important;
        }
      `}</style>
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-2 border-b border-gray-150 dark:border-white/[0.08] shrink-0">
        <div className="flex items-center gap-2">
          <MapPin size={16} className="text-[#1b60bb] dark:text-[#7dd3fc]" />
          <span className="text-xs font-bold uppercase tracking-widest text-gray-800 dark:text-gray-100 font-montserrat">
            Facility Map
          </span>
          <span className="text-[10px] bg-blue-50 dark:bg-[#272727] text-[#1b60bb] dark:text-[#7dd3fc] px-2 py-0.5 rounded-full font-mono font-bold border border-blue-100 dark:border-white/[0.1]">
            {locations.length} pins
          </span>
        </div>
        <button
          onClick={onClose}
          type="button"
          className="p-1.5 hover:bg-gray-100 dark:hover:bg-[#272727] text-gray-500 hover:text-red-500 rounded-full transition-colors cursor-pointer"
          title="Hide map"
        >
          <X size={15} />
        </button>
      </div>

      {/* Map view container with rounded 2xl corners */}
      <div className="relative flex-1 min-h-[300px] sm:min-h-[340px] rounded-2xl overflow-hidden border border-gray-200/70 dark:border-white/[0.08] shadow-inner">
        {/* Tile toggle (Default vs Satellite) matching reference design */}
        <div className="absolute top-3 left-3 z-[1000] flex items-center bg-white/90 dark:bg-[#272727]/90 backdrop-blur-md p-1 rounded-full border border-gray-200/80 dark:border-white/[0.12] shadow-md select-none">
          <button
            type="button"
            onClick={() => setTileType('default')}
            className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all ${
              tileType === 'default'
                ? 'bg-[#1b60bb] text-white shadow-xs'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Default
          </button>
          <button
            type="button"
            onClick={() => setTileType('satellite')}
            className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all ${
              tileType === 'satellite'
                ? 'bg-[#1b60bb] text-white shadow-xs'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Satellite
          </button>
        </div>

        <div ref={mapDivRef} className="w-full h-full min-h-[300px]" />
      </div>

      <div className="pt-2 text-[10px] text-gray-500 dark:text-gray-400 font-montserrat shrink-0 text-center">
        Click a pin or card to spotlight • double-click to open full details
      </div>
    </div>
  );
}
