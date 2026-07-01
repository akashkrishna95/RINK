//components/InteractiveMap.tsx
'use client';

import { MapContainer, TileLayer, Marker, Popup, useMap, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect, useState } from 'react';

const createCustomIcon = (isActive: boolean) => {
  const size = isActive ? 22 : 14;
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `<div class="relative flex items-center justify-center">
             <div class="absolute w-[24px] h-[24px] rounded-full bg-[#ef4444]/20 animate-ping" style="animation-duration: 2s; ${isActive ? 'display: block;' : 'display: none;'}"></div>
             <svg 
               xmlns="http://www.w3.org/2000/svg" 
               viewBox="0 0 24 24" 
               width="${size}" 
               height="${size}" 
               fill="${isActive ? '#ef4444' : '#1b60bb'}" 
               stroke="white" 
               stroke-width="1.5" 
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

interface Institution {
  id: number;
  name: string;
  website: string;
  district: string;
  techCount: number;
  lat: number;
  lng: number;
}

interface InteractiveMapProps {
  onDistrictHover?: (district: string) => void;
  onDistrictLeave?: () => void;
  onInstitutionHover?: (id: number | null) => void;
  activeDistrict?: string | null;
  activeInstitution?: number | null;
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
  activeInstitution?: number | null, 
  institutions: Institution[], 
  isExpanded?: boolean 
}) {
  const map = useMap();
  useEffect(() => {
    if (activeInstitution) {
      const inst = institutions.find(i => i.id === activeInstitution);
      if (inst) {
        map.flyTo([inst.lat, inst.lng], isExpanded ? 11.5 : 9.5, { duration: 1 });
      }
    } else if (activeDistrict) {
      const insts = institutions.filter(i => i.district === activeDistrict);
      if (insts.length > 0) {
        const avgLat = insts.reduce((sum, i) => sum + i.lat, 0) / insts.length;
        const avgLng = insts.reduce((sum, i) => sum + i.lng, 0) / insts.length;
        map.flyTo([avgLat, avgLng], isExpanded ? 10 : 8, { duration: 1 });
      }
    } else {
      // Center of Kerala
      map.flyTo([10.5, 76.3], isExpanded ? 7 : 6.5, { duration: 1 });
    }
  }, [activeDistrict, activeInstitution, map, isExpanded, institutions]);
  
  useEffect(() => {
    // Invalidate size on expand to fix leaflet rendering
    setTimeout(() => {
      map.invalidateSize();
    }, 300);
  }, [isExpanded, map]);

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
    return <div className={`w-full h-full bg-[#0a0a0a] rounded-2xl ${className}`} />;
  }

  // Center of Kerala roughly
  const center: [number, number] = [10.5, 76.3];
  
  return (
    <div className={`w-full h-full relative z-10 ${className}`}>
      <style>{`
        ${!isExpanded ? '.leaflet-control-attribution { display: none !important; }' : ''}
        .leaflet-container { background: #0a0a0a !important; }
        .custom-popup .leaflet-popup-content-wrapper {
          background: rgba(10, 10, 10, 0.95) !important;
          border: 1px solid rgba(239, 68, 68, 0.3) !important;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5) !important;
          backdrop-filter: blur(8px) !important;
          border-radius: 1rem !important;
          padding: 4px !important;
        }
        .custom-popup .leaflet-popup-tip {
          background: rgba(10, 10, 10, 0.95) !important;
          border-left: 1px solid rgba(239, 68, 68, 0.3) !important;
          border-bottom: 1px solid rgba(239, 68, 68, 0.3) !important;
        }
        .custom-popup .leaflet-popup-content {
          margin: 12px !important;
        }
        .custom-popup .leaflet-popup-close-button {
          color: rgba(255, 255, 255, 0.6) !important;
          padding: 8px 8px 0 0 !important;
        }
        .custom-popup .leaflet-popup-close-button:hover {
          color: #ef4444 !important;
        }
      `}</style>
      <MapContainer 
        key={isExpanded ? 'expanded' : 'collapsed'}
        center={center} 
        zoom={isExpanded ? 7 : 6.5} 
        scrollWheelZoom={isExpanded}
        dragging={isExpanded}
        touchZoom={isExpanded}
        doubleClickZoom={isExpanded}
        zoomControl={isExpanded}
        className="w-full h-full overflow-hidden"
        style={{ borderRadius: isExpanded ? '0' : '1.5rem' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CartoDB</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        {/* District boundaries (thin outlines) */}
        {districtsGeoJSON && (
          <GeoJSON 
            key="kerala-districts"
            data={districtsGeoJSON} 
            style={{
              color: '#ef4444',
              weight: 0.6,
              fillColor: '#ef4444',
              fillOpacity: 0.04,
            }}
          />
        )}
        {/* Outer State boundary (thick border) */}
        {stateGeoJSON && (
          <GeoJSON 
            key="kerala-state-border"
            data={stateGeoJSON} 
            style={{
              color: '#ef4444',
              weight: 2.2,
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
                mouseover: () => {
                  onDistrictHover?.(inst.district);
                  onInstitutionHover?.(inst.id);
                },
                mouseout: () => {
                  onDistrictLeave?.();
                  onInstitutionHover?.(null);
                },
              }}
            >
              {isExpanded && (
                <Popup className="custom-popup">
                  <div className="p-1 min-w-[220px] max-w-[280px] flex flex-col gap-2 text-white">
                    <div className="font-bold text-sm leading-snug text-white font-sans">{inst.name}</div>
                    <div className="flex items-center justify-between mt-1 text-[11px]">
                      <span className="text-slate-400 font-medium font-sans">{inst.district}</span>
                      <span className="bg-[#ef4444] text-white px-2 py-0.5 rounded font-mono font-semibold">
                        {inst.techCount} Techs
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed font-sans border-t border-white/10 pt-2 mt-1">
                      A leading Innovation Hub helping transform research into scalable startup products and intellectual property.
                    </p>
                    <a 
                      href={inst.website} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="mt-2 text-center text-xs font-semibold text-white bg-[#ef4444] hover:bg-[#dc2626] py-2 rounded-lg transition-colors flex items-center justify-center gap-1 shadow-[0_2px_8px_rgba(239,68,68,0.3)] font-sans"
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
