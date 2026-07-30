// app/RomiPortal/instrumentation/InstrumentMapPanel.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, MapPin, Maximize2, ArrowUpRight, ChevronDown, Wrench, Plus, Minus } from 'lucide-react';
import { fetchInstrumentsJson, InstrumentItem } from '@/lib/getInstrumentsJson';

export interface InstLocation {
  id: string;
  name: string;
  kind?: string;
  district: string;
  facility?: string;
  institution_name?: string;
  acronym?: string;
  lat: number;
  lng: number;
  url: string;
  email?: string;
  phone?: string;
  address?: string;
  image_link?: string;
  original_image_link?: string;
  techCount?: number;
  logo_url?: string;
}

interface Props {
  locations: InstLocation[];
  selectedId?: string | null;
  onClose: () => void;
  onSelect?: (id: string) => void;
  isInline?: boolean;
}

const LEAFLET_CSS = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css';
const LEAFLET_JS = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js';

let cachedKeralaGeoJson: any = null;

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

export default function InstrumentMapPanel({ locations, selectedId: propSelectedId, onClose, onSelect, isInline = false }: Props) {
  const mapDivRef = useRef<HTMLDivElement>(null);
  const enlargedMapDivRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const enlargedMapRef = useRef<any>(null);
  const markersRef = useRef<Record<string, any>>({});
  const enlargedMarkersRef = useRef<Record<string, any>>({});
  const layerRef = useRef<any>(null);
  const enlargedLayerRef = useRef<any>(null);
  const tileLayerRef = useRef<any>(null);
  const enlargedTileLayerRef = useRef<any>(null);

  const [tileType, setTileType] = useState<'default' | 'satellite'>('default');
  const [isMaximized, setIsMaximized] = useState(false);
  const [allInstruments, setAllInstruments] = useState<InstrumentItem[]>([]);
  const [selectedInstId, setSelectedInstId] = useState<string | null>(propSelectedId || null);
  const [expandedDistricts, setExpandedDistricts] = useState<Record<string, boolean>>({});

  // Sync propSelectedId
  useEffect(() => {
    if (propSelectedId) setSelectedInstId(propSelectedId);
  }, [propSelectedId]);

  // Fetch full instrument.json from .env URL dynamically
  useEffect(() => {
    fetchInstrumentsJson().then((data) => {
      if (data && data.length > 0) {
        setAllInstruments(data);
        const firstDist = data[0]?.district || 'Ernakulam';
        setExpandedDistricts({ [firstDist]: true });
      }
    });
  }, []);

  // Use prop locations if they exist, otherwise fallback to all instruments from instrument.json
  const combinedLocations: InstLocation[] = (() => {
    if (locations && locations.length > 0) {
      return locations.map((l) => {
        const dbItem = allInstruments.find((item) => {
          const cleanDbId = String(item.id || '').replace(/^inst_/, '').trim();
          const cleanLId = String(l.id || '').replace(/^inst_/, '').trim();
          return cleanDbId === cleanLId;
        });

        if (dbItem) {
          const logoUrl = dbItem.image_link || dbItem.original_image_link || l.logo_url || l.image_link || l.original_image_link;
          return {
            ...l,
            logo_url: logoUrl,
            techCount: l.techCount || 1,
            institution_name: dbItem.institution_name,
            phone: dbItem.phone,
            email: dbItem.email,
            facility: dbItem.facility,
            address: dbItem.address,
            lat: dbItem.lat,
            lng: dbItem.lng,
          };
        }

        const logoUrl = l.logo_url || l.image_link || l.original_image_link;
        return {
          ...l,
          logo_url: logoUrl,
          techCount: l.techCount || 1,
        };
      });
    }

    const list: InstLocation[] = [];
    allInstruments.forEach((item) => {
      list.push({
        id: item.id,
        name: item.name,
        kind: item.acronym || 'instrument',
        district: item.district,
        facility: item.facility,
        institution_name: item.institution_name,
        acronym: item.acronym,
        lat: item.lat,
        lng: item.lng,
        url: item.url,
        email: item.email,
        phone: item.phone,
        address: item.address,
        image_link: item.image_link,
        original_image_link: item.original_image_link,
        logo_url: item.image_link || item.original_image_link,
        techCount: 1,
      });
    });
    return list;
  })();

  // Group by District
  const districtsMap = combinedLocations.reduce((acc, loc) => {
    const dist = loc.district || 'Ernakulam';
    if (!acc[dist]) acc[dist] = [];
    acc[dist].push(loc);
    return acc;
  }, {} as Record<string, InstLocation[]>);

  const districtNames = Object.keys(districtsMap).sort();

  // Active selected instrument item
  const selectedInstrument = combinedLocations.find((l) => l.id === selectedInstId);

  // Initialize main map
  useEffect(() => {
    let cancelled = false;
    ensureLeaflet().then((L) => {
      if (cancelled || !mapDivRef.current || mapRef.current) return;
      const map = L.map(mapDivRef.current, { zoomControl: false, attributionControl: false }).setView([10.35, 76.3], 7);

      const defaultUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
      tileLayerRef.current = L.tileLayer(defaultUrl, { maxZoom: 18 }).addTo(map);
      layerRef.current = L.layerGroup().addTo(map);
      mapRef.current = map;
      
      map.on('click', () => {
        setIsMaximized(true);
      });

      setTimeout(() => {
        map.invalidateSize();
      }, 200);
      renderMarkers(L, mapRef.current, layerRef.current, markersRef, locations);
    }).catch(() => {});
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Initialize enlarged map when maximized
  useEffect(() => {
    if (!isMaximized) return;
    setTileType('satellite');
    let cancelled = false;
    const timer = setTimeout(() => {
      ensureLeaflet().then((L) => {
        if (cancelled || !enlargedMapDivRef.current || enlargedMapRef.current) return;
        const map = L.map(enlargedMapDivRef.current, { zoomControl: false, attributionControl: false }).setView([10.35, 76.3], 7.5);

        const url = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
        enlargedTileLayerRef.current = L.tileLayer(url, { maxZoom: 18 }).addTo(map);
        enlargedLayerRef.current = L.layerGroup().addTo(map);
        enlargedMapRef.current = map;

        // Fetch GeoJSON boundaries (uses global memory cache)
        if (cachedKeralaGeoJson && enlargedMapRef.current) {
          L.geoJSON(cachedKeralaGeoJson, {
            style: {
              color: '#5cc4fe',
              weight: 1,
              fillColor: '#bde7ff',
              fillOpacity: 0.04,
            },
          }).addTo(enlargedMapRef.current);
        } else {
          fetch('/geojson/kerala.geojson')
            .then((res) => res.json())
            .then((geojson) => {
              cachedKeralaGeoJson = geojson;
              if (enlargedMapRef.current) {
                L.geoJSON(geojson, {
                  style: {
                    color: '#5cc4fe',
                    weight: 1,
                    fillColor: '#bde7ff',
                    fillOpacity: 0.04,
                  },
                }).addTo(enlargedMapRef.current);
              }
            })
            .catch(() => {});
        }

        setTimeout(() => {
          map.invalidateSize();
        }, 200);

        const locsToRender = selectedInstId ? combinedLocations.filter(l => l.id === selectedInstId) : combinedLocations;
        renderMarkers(L, enlargedMapRef.current, enlargedLayerRef.current, enlargedMarkersRef, locsToRender);
      }).catch(() => {});
    }, 100);
    return () => { cancelled = true; clearTimeout(timer); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMaximized]);

  // Keys derived from locations to trigger map updates only when the actual active pins list changes
  const locationsKey = (locations || []).map(l => l?.id || '').join(',');
  const combinedLocsKey = (combinedLocations || []).map(l => l?.id || '').join(',');

  // Effect to re-render main map markers when locations change (matching standard chat sync)
  useEffect(() => {
    if (mapRef.current && layerRef.current) {
      const L = (window as any).L;
      if (!L) return;
      renderMarkers(L, mapRef.current, layerRef.current, markersRef, locations);
    }
  }, [locationsKey]);

  // Effect to re-render enlarged markers when selection changes
  useEffect(() => {
    if (isMaximized && enlargedMapRef.current && enlargedLayerRef.current) {
      const L = (window as any).L;
      if (!L) return;
      const locsToRender = selectedInstId ? combinedLocations.filter(l => l.id === selectedInstId) : combinedLocations;
      renderMarkers(L, enlargedMapRef.current, enlargedLayerRef.current, enlargedMarkersRef, locsToRender);
    }
  }, [selectedInstId, isMaximized, combinedLocsKey]);

  // Effect to auto-expand the first district of the new combinedLocations
  useEffect(() => {
    if (combinedLocations.length > 0) {
      const firstDist = combinedLocations[0].district || 'Ernakulam';
      setExpandedDistricts({ [firstDist]: true });
    }
  }, [combinedLocsKey]);

  // Update map tile layers
  useEffect(() => {
    const L = (window as any).L;
    if (!L) return;
    const url = tileType === 'satellite'
      ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
      : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

    if (enlargedMapRef.current && enlargedTileLayerRef.current) {
      enlargedMapRef.current.removeLayer(enlargedTileLayerRef.current);
      enlargedTileLayerRef.current = L.tileLayer(url, { maxZoom: 18 }).addTo(enlargedMapRef.current);
    }
  }, [tileType]);

  // Render map markers
  const renderMarkers = (
    L: any,
    targetMap: any,
    targetLayer: any,
    targetMarkersRef: React.MutableRefObject<Record<string, any>>,
    locsList: InstLocation[]
  ) => {
    if (!targetMap || !targetLayer) return;
    targetLayer.clearLayers();
    targetMarkersRef.current = {};
    const pts: [number, number][] = [];

    locsList.forEach((loc) => {
      const isSel = loc.id === selectedInstId;
      const size = isSel ? 32 : 22;
      const fillColor = isSel ? '#1b60bb' : '#5cc4fe';

      const icon = L.divIcon({
        className: 'custom-leaflet-marker',
        html: `<div class="relative flex items-center justify-center" style="cursor: pointer;">
                 ${isSel ? '<div class="absolute w-[36px] h-[36px] rounded-full bg-[#1b60bb]/30 animate-ping"></div>' : ''}
                 <svg 
                   xmlns="http://www.w3.org/2000/svg" 
                   viewBox="0 0 24 24" 
                   width="${size}" 
                   height="${size}" 
                   fill="${fillColor}" 
                   stroke="white" 
                   stroke-width="${isSel ? '2' : '1.5'}" 
                   stroke-linecap="round" 
                   stroke-linejoin="round" 
                   class="drop-shadow-md transition-all duration-300 transform ${isSel ? 'scale-110 -translate-y-1' : ''}"
                 >
                   <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                   <circle cx="12" cy="10" r="3" fill="white" stroke="none" />
                 </svg>
               </div>`,
        iconSize: [size, size],
        iconAnchor: [size / 2, size],
      });

      const cleanAddress = loc.address || (loc.facility ? `${loc.facility}, ` : '') + `${loc.district}, Kerala, India`;
      const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${loc.lat},${loc.lng}`;

      const popupHtml = `
        <div class="p-1 min-w-[230px] max-w-[280px] flex flex-col gap-2 text-[#153156] font-sans">
          <div class="font-bold text-sm leading-snug text-[#1b60bb] font-helios">
            ${loc.name}
          </div>
          ${loc.institution_name ? `
          <div class="text-[11px] text-slate-500 font-semibold mt-0.5 leading-tight">
            <span class="text-[#1b60bb]">Institution:</span> ${loc.institution_name}
          </div>
          ` : ''}
          <div class="flex flex-wrap items-center gap-1.5 mt-0.5 text-[10px]">
            <span class="text-[#1b4f8d] font-semibold bg-[#eff9ff] px-2 py-0.5 rounded font-helios">
              ${loc.district}
            </span>
            <span class="bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono font-semibold">ID: ${loc.id}</span>
            ${loc.acronym ? `<span class="bg-[#daf1ff] text-[#1b60bb] px-2 py-0.5 rounded font-mono font-semibold">${loc.acronym}</span>` : ''}
          </div>

          ${loc.phone || loc.email ? `
          <div class="text-[10px] text-slate-650 font-sans leading-relaxed border-t border-slate-100 pt-1.5 mt-1 flex flex-col gap-0.5">
            ${loc.phone ? `<div><span class="font-semibold text-[#1b4f8d]">Phone:</span> ${loc.phone}</div>` : ''}
            ${loc.email ? `<div><span class="font-semibold text-[#1b4f8d]">Email:</span> ${loc.email}</div>` : ''}
          </div>
          ` : ''}

          <div class="text-[11px] text-slate-600 font-sans leading-relaxed border-t border-slate-100 pt-1.5 mt-1">
            <span class="font-semibold text-[#1b4f8d]">Address: </span>${cleanAddress}
          </div>

          <div class="flex items-center gap-2 mt-2">
            <a 
              href="https://rink-ui.vercel.app/instruments/${loc.id}" 
              target="_blank" 
              rel="noopener noreferrer" 
              class="flex-1 text-center text-xs font-semibold bg-[#1b60bb] hover:bg-[#1872dd] text-white py-1.5 rounded-lg transition-colors shadow-sm"
              style="color: white !important; text-decoration: none;"
            >
              Visit Website
            </a>
            <a 
              href="${googleMapsUrl}" 
              target="_blank" 
              rel="noopener noreferrer" 
              class="flex-1 text-center text-xs font-semibold bg-white border border-[#bde7ff] text-[#1b60bb] hover:bg-slate-50 py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1 shadow-sm"
              style="text-decoration: none;"
            >
              Google Maps ↗
            </a>
          </div>
        </div>
      `;

      const m = L.marker([loc.lat, loc.lng], { icon }).addTo(targetLayer);
      m.bindPopup(popupHtml, { closeButton: true, className: 'custom-popup', offset: [0, -size + 8] });

      m.on('click', () => {
        setSelectedInstId(loc.id);
        if (onSelect) onSelect(loc.id);
      });
      targetMarkersRef.current[loc.id] = m;
      pts.push([loc.lat, loc.lng]);
    });

    if (pts.length > 0 && targetMap) {
      try { targetMap.fitBounds(pts, { padding: [30, 30], maxZoom: 11 }); } catch {}
    }
  };

  // Selection spotlight handler
  const handleSelectInstrument = (id: string) => {
    setSelectedInstId(id);
    if (onSelect) onSelect(id);

    const loc = combinedLocations.find((l) => l.id === id);
    if (!loc) return;

    if (enlargedMapRef.current) {
      enlargedMapRef.current.flyTo([loc.lat, loc.lng], 11, { duration: 1 });
      const mk = enlargedMarkersRef.current[id];
      if (mk) setTimeout(() => mk.openPopup(), 400);
    } else if (mapRef.current) {
      mapRef.current.setView([loc.lat, loc.lng], 11, { animate: true });
      const mk = markersRef.current[id];
      if (mk) setTimeout(() => mk.openPopup(), 300);
    }
  };

  const containerClasses = isInline
    ? "w-full my-3 rounded-3xl border border-gray-200/80 dark:border-white/[0.1] bg-white/95 dark:bg-[#1a1a1a]/95 overflow-hidden shrink-0 flex flex-col shadow-xl p-3 sm:p-4 group"
    : "w-full sm:w-[360px] lg:w-[420px] xl:w-96 border border-gray-200/80 dark:border-white/[0.1] bg-white/95 dark:bg-[#1a1a1a]/95 overflow-hidden shrink-0 flex flex-col h-full shadow-2xl rounded-3xl p-3 sm:p-4 group";

  return (
    <>
      <div className={containerClasses}>
        <style>{`
          .custom-popup .leaflet-popup-content-wrapper {
            background: rgba(255, 255, 255, 0.95) !important;
            border: 1px solid rgba(27, 96, 187, 0.15) !important;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08) !important;
            backdrop-filter: blur(12px) !important;
            border-radius: 1rem !important;
            padding: 4px !important;
          }
          .custom-popup .leaflet-popup-close-button {
            top: 12px !important;
            right: 12px !important;
            color: #64748b !important;
            font-size: 16px !important;
            font-weight: bold !important;
            transition: color 0.2s !important;
          }
          .custom-popup .leaflet-popup-close-button:hover {
            color: #ef4444 !important;
          }
          .custom-popup .leaflet-popup-tip {
            background: rgba(255, 255, 255, 0.95) !important;
            border-left: 1px solid rgba(27, 96, 187, 0.15) !important;
            border-bottom: 1px solid rgba(27, 96, 187, 0.15) !important;
          }
          .custom-popup .leaflet-popup-content {
            margin: 12px !important;
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
              {combinedLocations.length} pins
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={onClose}
              type="button"
              className="p-1.5 hover:bg-gray-100 dark:hover:bg-[#272727] text-gray-500 hover:text-red-500 rounded-full transition-colors cursor-pointer"
              title="Hide map"
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Map View Container with Floating Enlarge Button on Top Right Hover */}
        <div className="relative flex-1 min-h-[300px] sm:min-h-[340px] rounded-2xl overflow-hidden border border-gray-200/70 dark:border-white/[0.08] shadow-inner group/map">

          {/* FLOATING TOP RIGHT CIRCULAR ENLARGE BUTTON (Image 1 design) */}
          <button
            type="button"
            onClick={() => setIsMaximized(true)}
            className="absolute top-3 right-3 z-[1000] w-10 h-10 bg-white/95 hover:bg-white text-[#1b60bb] rounded-full shadow-[0_6px_20px_rgba(0,0,0,0.15)] border border-white flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer opacity-90 group-hover/map:opacity-100"
            title="Enlarge Facility Map"
          >
            <Maximize2 size={18} strokeWidth={2.5} />
          </button>

          <div ref={mapDivRef} className="w-full h-full min-h-[300px]" />
        </div>

        <div className="pt-2 text-[10px] text-gray-500 dark:text-gray-400 font-montserrat shrink-0 text-center flex items-center justify-between">
          <span>Click pin to view info</span>
          <button
            onClick={() => setIsMaximized(true)}
            className="text-[#1b60bb] dark:text-[#7dd3fc] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
          >
            Enlarge Map <ArrowUpRight size={11} />
          </button>
        </div>
      </div>

      {/* FULLSCREEN ENLARGED MODAL VIEW (Matching UI of Images 2, 3, 4) */}
      {isMaximized && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[99999] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 lg:p-8 font-sans animate-in fade-in duration-200">
          
          <div className="relative w-full max-w-[1000px] h-[90vh] md:h-[85vh] max-h-[700px] bg-white rounded-[28px] overflow-hidden shadow-2xl flex flex-col-reverse md:flex-row ring-1 ring-[#1b60bb]/15">
            
            {/* LEFT PANEL (Width ~360px - 400px) */}
            <div className="w-full md:w-[360px] lg:w-[400px] bg-white md:border-r border-t md:border-t-0 border-slate-100 flex flex-col h-1/2 md:h-full overflow-hidden p-5 sm:p-6 shrink-0 z-20">
              
              {selectedInstrument ? (
                /* --- IMAGE 4 DESIGN: INSTRUMENT DETAIL VIEW --- */
                <div className="flex-1 flex flex-col space-y-4 animate-in fade-in duration-200 overflow-y-auto pr-1">
                  <div className="space-y-4">
                    {/* Title Header */}
                    <div>
                      <h3 className="text-xl font-bold text-[#1b60bb] font-helios leading-tight">
                        Instrumentations & Services
                      </h3>
                      <p className="text-xs text-slate-500 font-medium mt-1">
                        Select a location to explore
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedInstId(null)}
                      className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-[#1b60bb] font-semibold transition-colors cursor-pointer pt-1"
                    >
                      ← Back to list
                    </button>

                    {/* Logo Container Box */}
                    <div className="relative w-full h-36 bg-white rounded-2xl border border-slate-200/80 flex items-center justify-center overflow-hidden shadow-sm">
                      {selectedInstrument.logo_url || selectedInstrument.original_image_link || selectedInstrument.image_link ? (
                        <img
                          src={selectedInstrument.logo_url || selectedInstrument.original_image_link || selectedInstrument.image_link}
                          alt={selectedInstrument.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex flex-col items-center gap-1 text-[#1b60bb]/40 p-4">
                          <Wrench size={32} />
                          <span className="text-sm font-bold font-helios">RINK HUB</span>
                        </div>
                      )}
                    </div>

                    {/* District Pill & Name */}
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] bg-[#eff9ff] text-[#1b60bb] px-2.5 py-1 rounded font-bold uppercase tracking-wider font-helios">
                          {selectedInstrument.district}
                        </span>
                        <span className="text-[10px] bg-slate-100 text-slate-650 px-2.5 py-1 rounded font-mono font-bold">
                          ID: {selectedInstrument.id}
                        </span>
                      </div>
                      <h4 className="text-lg font-bold text-[#153156] mt-2 leading-snug font-helios">
                        {selectedInstrument.name}
                      </h4>
                      {selectedInstrument.institution_name && (
                        <div className="text-xs text-slate-500 font-semibold mt-1 flex items-center gap-1 font-sans">
                          <span className="text-[#1b60bb]">Institution:</span>
                          <span className="text-slate-700">{selectedInstrument.institution_name}</span>
                        </div>
                      )}
                    </div>

                    {/* Facility */}
                    {selectedInstrument.facility && (
                      <div className="space-y-1 text-slate-600 text-xs font-sans">
                        <div className="font-bold text-[#1b4f8d] uppercase tracking-wide text-[10px]">
                          FACILITY
                        </div>
                        <p className="leading-relaxed text-slate-600 font-medium">
                          {selectedInstrument.facility}
                        </p>
                      </div>
                    )}

                    {/* Address Block */}
                    <div className="space-y-1 text-slate-600 text-xs font-sans">
                      <div className="font-bold text-[#1b4f8d] uppercase tracking-wide text-[10px]">
                        ADDRESS
                      </div>
                      <p className="leading-relaxed text-slate-600 font-medium">
                        {selectedInstrument.address || (selectedInstrument.facility ? `${selectedInstrument.facility}, ` : '') + `${selectedInstrument.district}, Kerala, India`}
                      </p>
                    </div>

                    {/* Contact Details Block */}
                    {(selectedInstrument.phone || selectedInstrument.email) && (
                      <div className="space-y-2 text-slate-600 text-xs font-sans border-t border-slate-100 pt-3">
                        <div className="font-bold text-[#1b4f8d] uppercase tracking-wide text-[10px]">
                          CONTACT DETAILS
                        </div>
                        {selectedInstrument.phone && (
                          <div className="flex items-center gap-1.5 text-slate-750 font-medium">
                            <span className="text-slate-500">Phone:</span>
                            <span className="text-slate-800">{selectedInstrument.phone}</span>
                          </div>
                        )}
                        {selectedInstrument.email && (
                          <div className="flex items-center gap-1.5 text-slate-750 font-medium">
                            <span className="text-slate-500">Email:</span>
                            <span className="text-slate-800 break-all">{selectedInstrument.email}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Innovation Output Box */}
                    <div className="bg-[#eff9ff] rounded-2xl p-4 border border-[#bde7ff] flex items-center justify-between">
                      <div>
                        <div className="text-[11px] text-[#1b60bb] font-semibold">
                          Innovation Output
                        </div>
                        <div className="text-xl font-black text-[#153156] mt-0.5 font-sans">
                          {selectedInstrument.techCount || 1} {selectedInstrument.kind === 'instrument' ? 'Instruments' : 'Technologies'}
                        </div>
                      </div>
                      <div className="text-xs bg-[#1b60bb] text-white px-3 py-1 rounded-lg font-bold">
                        Active
                      </div>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="space-y-2 pt-2 mt-auto shrink-0">
                    <a
                      href={`https://rink-ui.vercel.app/instruments/${selectedInstrument.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full text-center block text-sm font-semibold text-white bg-[#1b60bb] hover:bg-[#1872dd] py-3 rounded-xl transition-all shadow-md active:scale-[0.98]"
                      style={{ color: 'white !important', textDecoration: 'none' }}
                    >
                      Visit Website
                    </a>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${selectedInstrument.lat},${selectedInstrument.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full text-center flex items-center justify-center gap-1.5 text-sm font-semibold text-[#1b60bb] bg-white border border-[#bde7ff] hover:bg-slate-50 py-3 rounded-xl transition-all active:scale-[0.98]"
                      style={{ textDecoration: 'none' }}
                    >
                      View on Google Maps
                      <ArrowUpRight size={16} />
                    </a>
                  </div>
                </div>
              ) : (
                /* --- IMAGES 2 & 3 DESIGN: DISTRICT ACCORDIONS LIST --- */
                <div className="flex-1 flex flex-col overflow-hidden">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-[#1b60bb] font-helios leading-tight">
                      Instrumentations & Services
                    </h3>
                    <p className="text-xs text-slate-500 font-medium mt-1">
                      Select a location to explore
                    </p>
                  </div>

                  <div className="flex-1 overflow-y-auto pr-1 space-y-3 font-sans">
                    {districtNames.map((district) => {
                      const districtItems = districtsMap[district];
                      const isExpanded = expandedDistricts[district] ?? false;

                      return (
                        <div key={district} className="space-y-2">
                          {/* Accordion Row */}
                          <div
                            onClick={() =>
                              setExpandedDistricts((prev) => ({
                                ...prev,
                                [district]: !prev[district],
                              }))
                            }
                            className="flex items-center justify-between py-2.5 px-1 border-b border-[#daf1ff] cursor-pointer group select-none"
                          >
                            <div className="flex items-center gap-2">
                              <ChevronDown
                                size={14}
                                className={`text-slate-400 group-hover:text-[#1b60bb] transition-transform duration-200 ${
                                  isExpanded ? '' : '-rotate-90'
                                }`}
                              />
                              <h4
                                className={`text-sm font-bold font-helios transition-colors ${
                                  isExpanded ? 'text-[#1b60bb]' : 'text-slate-700 group-hover:text-[#1b60bb]'
                                }`}
                              >
                                {district}
                              </h4>
                            </div>
                            <span className="text-xs font-semibold bg-[#eff9ff] text-[#1b60bb] px-2.5 py-0.5 rounded-md font-mono">
                              {districtItems.length}
                            </span>
                          </div>

                          {/* Expanded Items (Image 3) */}
                          {isExpanded && (
                            <div className="space-y-2 pl-4 pt-1">
                              {districtItems.map((item) => {
                                const isSelected = item.id === selectedInstId;
                                return (
                                  <div
                                    key={item.id}
                                    onClick={() => handleSelectInstrument(item.id)}
                                    className={`p-3 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all duration-200 ${
                                      isSelected
                                        ? 'bg-[#eff9ff] border-[#90daff] shadow-sm scale-[1.01]'
                                        : 'bg-slate-50/75 border-slate-100 hover:border-[#bde7ff] hover:bg-slate-100/50'
                                    }`}
                                  >
                                    <div className="flex-1 min-w-0">
                                      <div className={`font-helios font-semibold text-xs leading-tight ${isSelected ? 'text-[#1b60bb]' : 'text-slate-800'}`}>
                                        {item.name}
                                      </div>
                                    </div>

                                    <div className="w-14 h-14 rounded-xl border border-slate-100 bg-white shrink-0 flex items-center justify-center overflow-hidden shadow-md">
                                      {item.logo_url || item.image_link ? (
                                        <img
                                          src={item.logo_url || item.image_link}
                                          alt={item.name}
                                          className="w-full h-full object-cover"
                                        />
                                      ) : (
                                        <div className="flex items-center justify-center text-[#1b60bb]/30 w-full h-full bg-[#eff9ff]">
                                          <Wrench size={20} />
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT PANEL (MAP VIEW) */}
            <div className="w-full md:flex-1 relative h-1/2 md:h-full bg-[#eff9ff]">
              
              {/* TOP LEFT ZOOM CONTROLS (+ / -) */}
              <div className="absolute top-4 left-4 z-[1000] flex flex-col bg-white rounded-lg border border-slate-200 shadow-md overflow-hidden select-none">
                <button
                  type="button"
                  onClick={() => enlargedMapRef.current?.zoomIn()}
                  className="p-2 hover:bg-slate-50 text-slate-700 font-bold border-b border-slate-100 flex items-center justify-center cursor-pointer"
                  title="Zoom In"
                >
                  <Plus size={16} />
                </button>
                 <button
                  type="button"
                  onClick={() => enlargedMapRef.current?.zoomOut()}
                  className="p-2 hover:bg-slate-50 text-slate-700 font-bold flex items-center justify-center cursor-pointer"
                  title="Zoom Out"
                >
                  <Minus size={16} />
                </button>
              </div>

              {/* TILE SWITCHER (Default / Satellite) */}
              <div className="absolute top-4 left-16 z-[1000] bg-white/95 backdrop-blur-md rounded-xl shadow-md border border-[#daf1ff] p-1 flex gap-1 select-none">
                <button
                  type="button"
                  onClick={() => setTileType('default')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer ${
                    tileType === 'default'
                      ? 'bg-[#1b60bb] text-white shadow-sm'
                      : 'text-slate-600 hover:bg-[#eff9ff] hover:text-[#1b60bb]'
                  }`}
                >
                  Default
                </button>
                <button
                  type="button"
                  onClick={() => setTileType('satellite')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer ${
                    tileType === 'satellite'
                      ? 'bg-[#1b60bb] text-white shadow-sm'
                      : 'text-slate-600 hover:bg-[#eff9ff] hover:text-[#1b60bb]'
                  }`}
                >
                  Satellite
                </button>
              </div>

              {/* TOP RIGHT FLOATING CLOSE BUTTON (X) */}
              <button
                type="button"
                onClick={() => {
                  setIsMaximized(false);
                  onClose();
                }}
                className="absolute top-4 right-4 z-[1000] w-10 h-10 bg-white/90 hover:bg-white text-slate-700 hover:text-[#1b60bb] rounded-full backdrop-blur-md shadow-md border border-white flex items-center justify-center transition-all duration-200 hover:scale-105 cursor-pointer"
                title="Close Enlarged View"
              >
                <X size={20} />
              </button>

              <div ref={enlargedMapDivRef} className="w-full h-full md:min-h-[400px]" />
            </div>

          </div>
        </div>,
        document.body
      )}
    </>
  );
}
