// C:\Users\Akash Krishna\Downloads\RINK KSUM Website\HomePage\InteractiveMap.tsx
'use client';

import { MapContainer, TileLayer, Marker, Popup, useMap, GeoJSON, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect, useState } from 'react';

const createCustomIcon = (isActive: boolean) => {
  const size = isActive ? 26 : 18;
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `<div class="relative flex items-center justify-center">
             <div class="absolute w-[32px] h-[32px] rounded-full bg-[#1b60bb]/20 animate-ping" style="animation-duration: 2s; ${isActive ? 'display: block;' : 'display: none;'}"></div>
             <svg 
               xmlns="http://www.w3.org/2000/svg" 
               viewBox="0 0 24 24" 
               width="${size}" 
               height="${size}" 
               fill="${isActive ? '#1b60bb' : '#5cc4fe'}" 
               stroke="white" 
               stroke-width="${isActive ? '2' : '1.5'}" 
               stroke-linecap="round" 
               stroke-linejoin="round" 
               class="drop-shadow-md transition-all duration-300 transform ${isActive ? 'scale-110 -translate-y-1' : ''}"
             >
               <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
               <circle cx="12" cy="10" r="3" fill="white" stroke="none" />
             </svg>
           </div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
  });
};

import { Institution } from '@/lib/pocketbase';

interface InteractiveMapProps {
  onDistrictHover?: (district: string) => void;
  onDistrictLeave?: () => void;
  onInstitutionHover?: (id: string | null) => void;
  activeDistrict?: string | null;
  activeInstitution?: string | null;
  className?: string;
  isExpanded?: boolean;
  institutions: Institution[];
}

function MapController({ 
  activeDistrict, 
  activeInstitution, 
  institutions, 
  isExpanded 
}: { 
  activeDistrict?: string | null, 
  activeInstitution?: string | null, 
  institutions: Institution[], 
  isExpanded?: boolean 
}) {
  const map = useMap();
  useEffect(() => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

    if (activeInstitution) {
      const inst = institutions.find(i => i.id === activeInstitution);
      if (inst) {
        if (isMobile) {
          map.setView([inst.lat, inst.lng], isExpanded ? 11.5 : 9.5);
        } else {
          map.flyTo([inst.lat, inst.lng], isExpanded ? 11.5 : 9.5, { duration: 1 });
        }
      }
    } else if (activeDistrict) {
      const insts = institutions.filter(i => i.district === activeDistrict);
      if (insts.length > 0) {
        const avgLat = insts.reduce((sum, i) => sum + i.lat, 0) / insts.length;
        const avgLng = insts.reduce((sum, i) => sum + i.lng, 0) / insts.length;
        if (isMobile) {
          map.setView([avgLat, avgLng], isExpanded ? 10 : 8);
        } else {
          map.flyTo([avgLat, avgLng], isExpanded ? 10 : 8, { duration: 1 });
        }
      }
    } else {
      // Center of Kerala
      if (isMobile) {
        map.setView([10.5, 76.3], isExpanded ? 7 : 6.5);
      } else {
        map.flyTo([10.5, 76.3], isExpanded ? 7 : 6.5, { duration: 1 });
      }
    }
  }, [activeDistrict, activeInstitution, map, isExpanded, institutions]);

  useEffect(() => {
    if (isExpanded) {
      map.dragging.enable();
      map.scrollWheelZoom.enable();
      map.doubleClickZoom.enable();
      if (map.touchZoom) map.touchZoom.enable();
    } else {
      map.dragging.disable();
      map.scrollWheelZoom.disable();
      map.doubleClickZoom.disable();
      if (map.touchZoom) map.touchZoom.disable();
    }
  }, [isExpanded, map]);
  
  useEffect(() => {
    const container = map.getContainer();
    if (!container) return;

    const resizeObserver = new ResizeObserver(() => {
      // Safely invalidate map size on any container resize (like toggling See More)
      map.invalidateSize();
    });

    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, [map]);

  return null;
}

export default function InteractiveMap({ 
  onDistrictHover, 
  onDistrictLeave, 
  onInstitutionHover,
  activeDistrict, 
  activeInstitution,
  className = '', 
  isExpanded = false,
  institutions
}: InteractiveMapProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [districtsGeoJSON, setDistrictsGeoJSON] = useState<any>(null);
  const [stateGeoJSON, setStateGeoJSON] = useState<any>(null);
  const [mapType, setMapType] = useState<'default' | 'satellite'>(isExpanded ? 'satellite' : 'default');

  useEffect(() => {
    setIsMounted(true);
    // Fetch District boundaries
    fetch('/geojson/kerala.geojson')
      .then((res) => res.json())
      .then((data) => setDistrictsGeoJSON(data))
      .catch((err) => console.error('Error loading Districts GeoJSON:', err));

    // Fetch State boundary
    fetch('/geojson/kerala_state.geojson')
      .then((res) => res.json())
      .then((data) => setStateGeoJSON(data))
      .catch((err) => console.error('Error loading State GeoJSON:', err));
  }, []);

  if (!isMounted) {
    return <div className={`w-full h-full bg-[#eff9ff] rounded-2xl ${className}`} />;
  }

  // Center of Kerala roughly
  const center: [number, number] = [10.5, 76.3];
  
  return (
    <div className={`w-full h-full relative z-10 ${className}`}>
      <style>{`
        .leaflet-container { background: #eff9ff !important; outline: none !important; }
        .custom-popup .leaflet-popup-content-wrapper {
          background: rgba(255, 255, 255, 0.95) !important;
          border: 1px solid rgba(27, 96, 187, 0.15) !important;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08) !important;
          backdrop-filter: blur(12px) !important;
          border-radius: 1rem !important;
          padding: 4px !important;
        }
        .custom-popup .leaflet-popup-tip {
          background: rgba(255, 255, 255, 0.95) !important;
          border-left: 1px solid rgba(27, 96, 187, 0.15) !important;
          border-bottom: 1px solid rgba(27, 96, 187, 0.15) !important;
        }
        .custom-popup .leaflet-popup-content {
          margin: 12px !important;
        }
        .custom-popup .leaflet-popup-close-button {
          color: rgba(27, 96, 187, 0.6) !important;
          padding: 8px 8px 0 0 !important;
        }
        .custom-popup .leaflet-popup-close-button:hover {
          color: #1b60bb !important;
        }
      `}</style>
      
      {/* Floating Layer Toggle */}
      <div 
        onClick={(e) => e.stopPropagation()}
        className="absolute top-4 left-4 z-[1000] bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-[#daf1ff] p-1 flex gap-1"
      >
        <button 
          onClick={() => setMapType('default')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 active:scale-95 ${
            mapType === 'default' 
              ? 'bg-[#1b60bb] text-white shadow-sm' 
              : 'text-slate-600 hover:bg-[#eff9ff] hover:text-[#1b60bb]'
          }`}
        >
          Default
        </button>
        <button 
          onClick={() => setMapType('satellite')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 active:scale-95 ${
            mapType === 'satellite' 
              ? 'bg-[#1b60bb] text-white shadow-sm' 
              : 'text-slate-600 hover:bg-[#eff9ff] hover:text-[#1b60bb]'
          }`}
        >
          Satellite
        </button>
      </div>

      <MapContainer 
        key={isExpanded ? 'expanded' : 'collapsed'}
        center={center} 
        zoom={6.5} 
        scrollWheelZoom={false}
        dragging={false}
        touchZoom={false}
        doubleClickZoom={false}
        zoomControl={false}
        attributionControl={false}
        className="w-full h-full overflow-hidden"
        style={{ borderRadius: isExpanded ? '0' : '1.5rem' }}
      >
        {isExpanded && <ZoomControl position="topright" />}
        <TileLayer
          key={mapType}
          url={
            mapType === 'satellite'
              ? "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          }
        />
        {/* District boundaries (thin outlines) */}
        {districtsGeoJSON && (
          <GeoJSON 
            key={`kerala-districts-${mapType}`}
            data={districtsGeoJSON} 
            style={{
              color: mapType === 'satellite' ? '#5cc4fe' : '#1b60bb',
              weight: 0.8,
              fillColor: mapType === 'satellite' ? '#bde7ff' : '#90daff',
              fillOpacity: mapType === 'satellite' ? 0.02 : 0.05,
            }}
          />
        )}
        {/* Outer State boundary (thick border) */}
        {stateGeoJSON && (
          <GeoJSON 
            key={`kerala-state-border-${mapType}`}
            data={stateGeoJSON} 
            style={{
              color: mapType === 'satellite' ? '#bde7ff' : '#1b60bb',
              weight: 2.5,
              fillOpacity: 0,
            }}
          />
        )}
        {institutions.map((inst) => {
          const isActive = activeInstitution === inst.id || (activeDistrict === inst.district && !activeInstitution);
          return (
            <Marker 
              key={inst.id} 
              position={[inst.lat, inst.lng]} 
              icon={createCustomIcon(isActive)}
              eventHandlers={{
                click: () => {
                  if (isExpanded) {
                    onDistrictHover?.(inst.district);
                    onInstitutionHover?.(inst.id);
                  }
                },
              }}
            >
              {isExpanded && (
                <Popup className="custom-popup">
                  <div className="p-1 min-w-[220px] max-w-[280px] flex flex-col gap-2 text-[#153156]">
                    <div 
                      className="font-bold text-sm leading-snug text-[#1b60bb]"
                      style={{ fontFamily: "var(--font-helios), sans-serif" }}
                    >
                      {inst.name}
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5 mt-1 text-[10px]">
                      <span 
                        className="text-[#1b4f8d] font-semibold bg-[#eff9ff] px-2 py-0.5 rounded"
                        style={{ fontFamily: "var(--font-helios), sans-serif" }}
                      >
                        {inst.district}
                      </span>
                      <span className="bg-[#daf1ff] text-[#1b60bb] px-2 py-0.5 rounded font-mono font-semibold">
                        {inst.techCount} Techs
                      </span>
                      {inst.isPartnered && (
                        <span className="bg-emerald-600 text-white px-2.5 py-0.5 rounded font-bold text-[9px] shadow-sm">
                          Partnered
                        </span>
                      )}
                    </div>
                                        
                    {inst.location && (
                      <div className="text-[11px] text-slate-600 font-sans mt-0.5 leading-relaxed">
                        <span className="font-semibold text-[#1b4f8d]">Address: </span>
                        {inst.location}
                      </div>
                    )}

                    {inst.website && (
                      <div className="text-[11px] text-slate-600 font-sans mt-0.5">
                        <span className="font-semibold text-[#1b4f8d]">Website: </span>
                        <a 
                          href={inst.website.startsWith('http') ? inst.website : `https://${inst.website}`}
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-[#1b60bb] hover:underline hover:text-[#1872dd] font-semibold"
                        >
                          {inst.website.replace(/^https?:\/\/(www\.)?/, '')}
                        </a>
                      </div>
                    )}

                    <a 
                      href={`https://www.google.com/maps/search/?api=1&query=${inst.lat},${inst.lng}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="mt-2 text-center text-xs font-semibold bg-[#1b60bb] hover:bg-[#1872dd] py-2 rounded-lg transition-colors flex items-center justify-center gap-1 shadow-sm font-sans"
                      style={{ color: '#eff9ff' }}
                    >
                      View on Google Maps
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="7" y1="17" x2="17" y2="7"></line>
                        <polyline points="7 7 17 7 17 17"></polyline>
                      </svg>
                    </a>
                  </div>
                </Popup>
              )}
            </Marker>
          );
        })}
        <MapController activeDistrict={activeDistrict} activeInstitution={activeInstitution} institutions={institutions} isExpanded={isExpanded} />
      </MapContainer>
      
      {/* Overlay to prevent map drag/zoom interactions when not expanded, simulating currentundo.com's clickable image feel */}
      {!isExpanded && (
        <div className="absolute inset-0 z-[400] cursor-pointer" />
      )}
    </div>
  );
}
