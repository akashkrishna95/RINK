// C:\Users\Akash Krishna\Downloads\RINK KSUM Website\HomePage\InstitutionsGrid.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight, X, Maximize2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const InteractiveMap = dynamic(() => import('./InteractiveMap'), {
  ssr: false,
});

import institutionLogosBaseline from '@/data/institutions_mapped.json';
import { getProxiedImageUrl } from '@/lib/utils';

export interface Institution {
  id: number;
  name: string;
  location: string;
  district: string;
  website: string;
  logo_url: string;
  partnered: boolean;
  lat: number;
  lng: number;
  techCount: number;
}

interface InstitutionsGridProps {
  initialInstitutions?: Institution[];
}

export default function InstitutionsGrid({ initialInstitutions }: InstitutionsGridProps) {
  const institutionLogos = initialInstitutions && initialInstitutions.length > 0 
    ? initialInstitutions 
    : institutionLogosBaseline;

  const [activeDistrict, setActiveDistrict] = useState<string | null>(null);
  const [activeInstitution, setActiveInstitution] = useState<number | null>(null);
  const [isLocked, setIsLocked] = useState<number | null>(null);
  const [showMore, setShowMore] = useState(false);
  const [isMapExpanded, setIsMapExpanded] = useState(false);
  const [expandedDistricts, setExpandedDistricts] = useState<Record<string, boolean>>({});

  const gridRef = useRef<HTMLDivElement>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ top: number; left: number } | null>(null);

  const updateTooltipPosition = () => {
    if (activeInstitution === null) {
      setTooltipPosition(null);
      return;
    }
    const activeEl = document.getElementById(`logo-item-${activeInstitution}`);
    const parentCardEl = gridRef.current?.closest('.parent-card');
    if (activeEl && parentCardEl) {
      const rect = activeEl.getBoundingClientRect();
      const parentRect = parentCardEl.getBoundingClientRect();
      setTooltipPosition({
        top: rect.top - parentRect.top,
        left: rect.left - parentRect.left + rect.width / 2,
      });
    } else {
      setTooltipPosition(null);
    }
  };

  useEffect(() => {
    updateTooltipPosition();
  }, [activeInstitution]);

  const handleGridScroll = () => {
    if (activeInstitution !== null) {
      setActiveInstitution(null);
    }
  };

  // Auto-scroll left panel to selected institution
  useEffect(() => {
    if (isMapExpanded && activeInstitution) {
      const element = document.getElementById(`inst-list-${activeInstitution}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [activeInstitution, isMapExpanded]);

  // Click outside listener to reset active logo state
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      if (isMapExpanded) return;
      const target = e.target as HTMLElement;
      // If clicked inside a logo item or its tooltip, do not reset
      if (target.closest('.logo-grid-item')) {
        return;
      }
      setIsLocked(null);
      resetInteractions();
    };

    document.addEventListener('click', handleDocumentClick);
    return () => document.removeEventListener('click', handleDocumentClick);
  }, [isMapExpanded]);

  // Reset interactions and lock state when modal state changes
  useEffect(() => {
    setIsLocked(null);
    resetInteractions();
  }, [isMapExpanded]);

  const handleLogoHover = (id: number, district: string) => {
    setActiveInstitution(id);
    setActiveDistrict(district);
  };

  const handleMapHover = (district: string) => {
    setActiveDistrict(district);
    setActiveInstitution(null);
  };

  const resetInteractions = () => {
    setActiveDistrict(null);
    setActiveInstitution(null);
  };

  const visibleLogos = showMore ? institutionLogos : institutionLogos.slice(0, 15);

  return (
    <div className="w-full py-8 md:py-16 px-4 md:px-8 bg-[#eff9ff] min-h-screen font-sans relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto">

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-12 lg:items-stretch">

          {/* --- MOBILE TITLE --- */}
          <div className="flex lg:hidden items-center gap-3 order-1 px-2">
            <h2
              className="font-helios font-bold text-4xl sm:text-5xl md:text-7xl text-[#1b60bb] leading-none tracking-tight"
            >
              Institutions Grid
            </h2>
            <ArrowDownRight className="w-[40px] h-[40px] sm:w-[44px] sm:h-[44px] text-[#1b60bb]" strokeWidth={2.5} />
          </div>

          {/* --- MOBILE DESCRIPTION --- */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex lg:hidden order-4 bg-white rounded-[20px] p-5 md:p-7 shadow-[0_4px_20px_rgb(0,0,0,0.04)] border border-white/60"
          >
            <p className="text-[#1A365D] text-[14px] md:text-[15px] leading-relaxed font-medium">
              Partner with Kerala&apos;s leading research hubs. Access the labs, experts, and tech
              you need to bring your startup&apos;s vision to life.
            </p>
          </motion.div>

          {/* --- MAP SECTION --- */}
          <div className="order-2 lg:order-2 lg:w-[35%] xl:w-[40%] flex flex-col justify-stretch h-[450px] lg:h-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.6 }}
              className="relative w-full h-full flex-1 flex flex-col items-stretch justify-stretch"
            >
              <div 
                className="relative w-full h-full flex-1 group cursor-pointer shadow-[0_8px_32px_rgba(0,0,0,0.12)] rounded-3xl overflow-hidden ring-1 ring-black/5"
                onClick={() => setIsMapExpanded(true)}
              >
                <div className="absolute inset-0 bg-black/5 rounded-3xl transition-all duration-300 group-hover:bg-black/0 z-20 pointer-events-none" />
                
                {/* Zoom button - Always visible on mobile, reveals on hover on desktop */}
                <div 
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMapExpanded(true);
                  }}
                  className="absolute top-4 right-4 bg-white/95 backdrop-blur shadow-md p-2.5 rounded-full z-30 md:opacity-0 md:group-hover:opacity-100 transition-opacity cursor-pointer border border-[#daf1ff] active:scale-95 flex items-center justify-center"
                >
                  <Maximize2 size={16} className="text-[#1b60bb]" strokeWidth={2.5} />
                </div>
                {!isMapExpanded && (
                  <InteractiveMap 
                    activeDistrict={activeDistrict}
                    activeInstitution={activeInstitution}
                    onDistrictHover={handleMapHover}
                    onDistrictLeave={resetInteractions}
                    onInstitutionHover={setActiveInstitution}
                    isExpanded={false}
                    institutions={institutionLogos}
                  />
                )}
              </div>
            </motion.div>
          </div>

          {/* Full Screen Map Modal */}
          <AnimatePresence>
            {isMapExpanded && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[999] flex items-center justify-center bg-[#153156]/60 backdrop-blur-md p-4 md:p-8"
              >
                <div className="relative w-full h-full max-w-7xl bg-[#eff9ff] rounded-3xl overflow-hidden shadow-2xl flex flex-col-reverse md:flex-row ring-1 ring-[#1b60bb]/15">
                  {/* Left Side Panel - Institutions info */}
                  <div className="w-full md:w-[380px] flex-1 md:flex-initial bg-white border-b md:border-b-0 md:border-r border-[#daf1ff] p-6 flex flex-col z-40 overflow-y-auto shrink-0 animate-in fade-in slide-in-from-left duration-300 shadow-sm">
                    <h3 className="text-xl font-helios text-[#1b60bb]">Kerala Innovation Hubs</h3>
                    <p className="text-slate-500 text-xs mt-1">Select a location to explore</p>
                    
                    {activeInstitution ? (
                      // Detailed View of Selected Institution
                      (() => {
                        const inst = institutionLogos.find(i => i.id === activeInstitution);
                        if (!inst) return null;
                        return (
                          <div className="flex-1 flex flex-col justify-between h-full pt-4">
                            <div className="space-y-6">
                              {/* Back Button */}
                              <button 
                                onClick={() => {
                                  setActiveInstitution(null);
                                  setActiveDistrict(null);
                                }}
                                className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-[#1b60bb] font-semibold transition-colors"
                              >
                                ← Back to list
                              </button>

                              {/* Institution Logo */}
                              <div className="relative w-full h-32 bg-white rounded-2xl border border-[#daf1ff] p-4 flex items-center justify-center overflow-hidden shadow-sm">
                                  {inst.logo_url ? (
                                    <Image
                                      src={getProxiedImageUrl(inst.logo_url)}
                                      alt={inst.name}
                                      fill
                                      className="object-contain p-3"
                                      sizes="300px"
                                    />
                                ) : (
                                  <div className="text-[#1b60bb]/40 font-bold text-lg">LOGO</div>
                                )}
                              </div>

                              {/* Details */}
                              <div className="space-y-4">
                                <div>
                                  <span 
                                    className="text-[10px] bg-[#daf1ff] text-[#1b60bb] px-2 py-0.5 rounded font-semibold uppercase tracking-wider"
                                    style={{ fontFamily: "var(--font-helios), sans-serif" }}
                                  >
                                    {inst.district}
                                  </span>
                                  <h4 
                                    className="text-lg font-bold text-[#153156] mt-2 leading-snug"
                                    style={{ fontFamily: "var(--font-helios), sans-serif" }}
                                  >
                                    {inst.name}
                                  </h4>
                                </div>

                                <div className="space-y-1 text-slate-600 text-xs">
                                  <div className="font-bold text-[#1b4f8d] uppercase tracking-wide text-[10px] mt-2">Address</div>
                                  <p className="leading-relaxed">{inst.location}</p>
                                </div>

                                <div className="bg-[#eff9ff] rounded-xl p-4 border border-[#bde7ff] flex items-center justify-between">
                                  <div>
                                    <div className="text-[11px] text-[#1b60bb] font-semibold">Innovation Output</div>
                                    <div className="text-xl font-normal text-[#153156] mt-0.5">
                                      {inst.techCount} Technologies
                                    </div>
                                  </div>
                                  <div className="text-xs bg-[#1b60bb] text-white px-2.5 py-1 rounded-lg font-medium">
                                    Active
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Buttons */}
                            <div className="space-y-2 mt-8">
                              {inst.website && (
                                <a 
                                  href={inst.website.startsWith('http') ? inst.website : `https://${inst.website}`} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="w-full text-center block text-sm font-semibold text-white bg-[#1b60bb] hover:bg-[#1872dd] py-3 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
                                >
                                  Visit Website
                                </a>
                              )}
                              <a 
                                href={`https://www.google.com/maps/search/?api=1&query=${inst.lat},${inst.lng}`}
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="w-full text-center flex items-center justify-center gap-1.5 text-sm font-semibold text-[#1b60bb] bg-white border border-[#bde7ff] hover:bg-slate-50 py-3 rounded-xl transition-all active:scale-[0.98]"
                              >
                                View on Google Maps
                                <ArrowUpRight size={16} />
                              </a>
                            </div>
                          </div>
                        );
                      })()
                    ) : (
                      // List View
                      <div className="mt-6 flex-1 space-y-6">
                        {Array.from(new Set(institutionLogos.map(i => i.district))).map((district) => {
                          const districtInstitutions = institutionLogos.filter(inst => inst.district === district);
                          const isDistrictActive = activeDistrict === district;
                          const isExpanded = expandedDistricts[district] ?? isDistrictActive;
                          return (
                            <div key={district} className="space-y-3">
                              <div 
                                className="flex items-center justify-between border-b border-[#daf1ff] pb-2 cursor-pointer group"
                                onClick={() => {
                                  setExpandedDistricts(prev => ({
                                    ...prev,
                                    [district]: !prev[district]
                                  }));
                                  setActiveDistrict(district);
                                  setActiveInstitution(null);
                                }}
                              >
                                <div className="flex items-center gap-2">
                                  <svg 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    width="14" 
                                    height="14" 
                                    viewBox="0 0 24 24" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    strokeWidth="2.5" 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    className={`text-slate-400 group-hover:text-[#1b60bb] transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                                  >
                                    <polyline points="6 9 12 15 18 9"></polyline>
                                  </svg>
                                  <h4 
                                    className={`text-base md:text-lg font-bold transition-colors ${isDistrictActive ? 'text-[#1b60bb]' : 'text-slate-700 group-hover:text-[#36a8fb]'}`}
                                    style={{ fontFamily: "var(--font-helios), sans-serif" }}
                                  >
                                    {district}
                                  </h4>
                                </div>
                                <span className="text-[10px] bg-[#daf1ff] text-[#1b60bb] px-2 py-0.5 rounded font-mono font-semibold">
                                  {districtInstitutions.length}
                                </span>
                              </div>
                              
                              <div className="pl-4">
                                {isExpanded && (
                                  <div className="space-y-2 mt-2">
                                    {districtInstitutions.map(inst => {
                                      const isActive = activeInstitution === inst.id;
                                      return (
                                        <div
                                          key={inst.id} 
                                          id={`inst-list-${inst.id}`}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setActiveInstitution(inst.id);
                                            setActiveDistrict(inst.district);
                                          }}
                                          className={`flex items-center justify-between p-3 rounded-xl border transition-all duration-300 cursor-pointer ${
                                            isActive 
                                              ? 'bg-[#eff9ff] border-[#90daff] shadow-sm scale-[1.01]' 
                                              : 'bg-white border-slate-100 hover:border-[#bde7ff] hover:bg-slate-50'
                                          }`}
                                        >
                                          <div className="flex-1 pr-3">
                                            <div className={`font-medium text-[13px] leading-tight ${isActive ? 'text-[#1b60bb]' : 'text-slate-700'}`}>
                                              {inst.name}
                                            </div>
                                            <div className="text-[11px] text-[#5cc4fe] font-semibold mt-1">
                                              {inst.techCount} Technologies
                                            </div>
                                          </div>
                                          
                                          {inst.logo_url && (
                                            <div className="h-10 w-10 shrink-0 rounded-lg border border-slate-100 bg-white flex items-center justify-center p-0.5 shadow-sm relative overflow-hidden">
                                              <Image
                                                src={getProxiedImageUrl(inst.logo_url)}
                                                alt={inst.name}
                                                fill
                                                className="object-contain p-0.5"
                                                sizes="40px"
                                              />
                                            </div>
                                          )}
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Right Side Map */}
                  <div className="flex-1 relative h-[50vh] md:h-full bg-[#eff9ff]">
                    <div className="absolute top-4 right-4 z-50">
                      <button 
                        onClick={() => setIsMapExpanded(false)}
                        className="bg-white/80 hover:bg-white text-[#1b60bb] p-2 rounded-full backdrop-blur shadow-sm border border-[#daf1ff] transition-all hover:scale-105"
                      >
                        <X size={24} />
                      </button>
                    </div>
                    <InteractiveMap 
                      activeDistrict={activeDistrict}
                      activeInstitution={activeInstitution}
                      onDistrictHover={handleMapHover}
                      onDistrictLeave={resetInteractions}
                      onInstitutionHover={setActiveInstitution}
                      isExpanded={true}
                      institutions={institutionLogos}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

                            {/* --- CONTENT SECTION --- */}
                            <div className="order-3 lg:order-1 lg:w-[60%] xl:w-[55%] flex flex-col gap-4 md:gap-5">

                              {/* DESKTOP TITLE */}
                              <div className="hidden lg:flex items-center gap-3 mb-2">
                                <h2
                                  className="font-helios font-bold text-4xl sm:text-5xl md:text-7xl text-[#1b60bb] leading-none tracking-tight"
                                >
                                  Institutions Grid
                                </h2>
                                <ArrowDownRight className="w-[52px] h-[52px] xl:w-[60px] xl:h-[60px] text-[#1b60bb]" strokeWidth={2.5} />
                              </div>

                              <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.15 }}
                                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                                className="hidden lg:flex bg-white rounded-[20px] p-5 md:p-7 shadow-[0_4px_20px_rgb(0,0,0,0.04)] border border-white/60"
                              >
                                <p className="text-[#1A365D] text-[14px] md:text-[15px] leading-relaxed font-medium">
                                  Partner with Kerala&apos;s leading research hubs. Access the labs, experts,
                                  and tech you need to bring your startup&apos;s vision to life.
                                </p>
                              </motion.div>

                              {/* Logos Grid Card */}
                              <motion.div
                                layout
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.15 }}
                                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                                className="relative bg-white rounded-[24px] p-5 md:p-8 shadow-[0_4px_20px_rgb(0,0,0,0.04)] border border-white/60 parent-card"
                              >
                                {/* Smooth Expansion Container */}
                                <div className="flex gap-4 items-stretch relative overflow-visible py-2">
                                  <motion.div 
                                    layout 
                                    ref={gridRef}
                                    onScroll={handleGridScroll}
                                    className={`relative flex-1 custom-scrollbar-grid ${showMore ? 'max-h-[260px] md:max-h-[340px] overflow-y-auto pr-3' : 'overflow-visible'}`}
                                  >
                                    <motion.div
                                      layout
                                      className={`grid grid-cols-4 md:grid-cols-5 gap-y-6 md:gap-y-10 gap-x-2 md:gap-x-4 ${!showMore ? 'pb-12 md:pb-16' : 'pb-2'}`}
                                    >
                                  <AnimatePresence>
                    {visibleLogos.map((institution, index) => {
                      const isActiveLogo = activeInstitution === institution.id;
                      const isActiveDistrict = activeDistrict === institution.district;
                      const isDimmed = activeDistrict !== null && !isActiveDistrict && !isActiveLogo;

                      return (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          key={institution.id}
                          id={`logo-item-${institution.id}`}
                          onMouseEnter={() => {
                            if (isLocked === null) {
                              handleLogoHover(institution.id, institution.district);
                            }
                          }}
                          onMouseLeave={() => {
                            if (isLocked !== institution.id) {
                              resetInteractions();
                            }
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (isLocked === institution.id) {
                              setIsLocked(null);
                              resetInteractions();
                            } else {
                              setIsLocked(institution.id);
                              handleLogoHover(institution.id, institution.district);
                            }
                          }}
                          onDoubleClick={(e) => {
                            e.stopPropagation();
                            if (institution.website) {
                              const url = institution.website.startsWith('http') 
                                ? institution.website 
                                : `https://${institution.website}`;
                              window.open(url, '_blank');
                            }
                          }}
                          animate={{
                            scale: isActiveDistrict || isActiveLogo ? 1.05 : 1,
                            opacity: isDimmed ? 0.3 : 1,
                            zIndex: isActiveLogo ? 100 : 1, // Boosted z-index
                          }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.2 }}
                          className="relative group flex items-center justify-center cursor-pointer logo-grid-item"
                        >
                           {/* Logo Image / Placeholder */}
                           <div className="h-12 w-12 md:h-16 md:w-16 rounded-full bg-white border border-slate-100 flex items-center justify-center p-1 shadow-sm relative overflow-hidden">
                             {institution.logo_url ? (
                               <Image
                                 src={getProxiedImageUrl(institution.logo_url)}
                                 alt={institution.name}
                                 fill
                                 className="object-contain p-1"
                                 sizes="(max-width: 768px) 48px, 64px"
                               />
                             ) : (
                               <div className="text-center text-slate-400 text-[9px] md:text-[10px] font-medium leading-tight">
                                 Logo<br />{institution.id}
                               </div>
                             )}
                           </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </motion.div>
              </motion.div>

            </div>

              {/* Show More Gradient Overlay */}
              {!showMore && (
                <div className="absolute bottom-0 left-0 w-full h-24 md:h-28 bg-gradient-to-t from-white via-white/95 to-transparent rounded-b-[24px] flex items-end justify-between p-5 md:p-8 pointer-events-none z-10">
                  <button
                    onClick={() => setShowMore(true)}
                    className="text-slate-400 font-sans text-[15px] hover:text-[#1b60bb] transition-colors pointer-events-auto font-medium cursor-pointer"
                  >
                    See More...
                  </button>
                  <span className="text-slate-400 font-sans text-xs md:text-sm font-medium">
                    Click logos to interact
                  </span>
                </div>
              )}

              {/* Show Less Control */}
              {showMore && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center"
                >
                  <button
                    onClick={() => setShowMore(false)}
                    className="text-slate-400 font-sans text-[15px] hover:text-[#1b60bb] transition-colors font-medium cursor-pointer"
                  >
                    See Less...
                  </button>
                  <span className="text-slate-400 font-sans text-xs md:text-sm font-medium">
                    Click logos to interact
                  </span>
                </motion.div>
              )}

              {/* Floating Tooltip overlayed over parent card */}
              <AnimatePresence>
                {activeInstitution !== null && tooltipPosition !== null && (
                  (() => {
                    const inst = institutionLogos.find(i => i.id === activeInstitution);
                    if (!inst) return null;
                    
                    const index = visibleLogos.findIndex(i => i.id === activeInstitution);
                    const isTopRowClipped = showMore && index < 5;

                    return (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        style={{
                          top: `${tooltipPosition.top}px`,
                          left: `${tooltipPosition.left}px`,
                        }}
                        className={`absolute transform w-44 shadow-[0_8px_32px_0_rgba(27,96,187,0.15)] backdrop-blur-md bg-white/95 border border-white text-center z-[100] p-3 rounded-xl pointer-events-auto -translate-x-1/2
                          ${isTopRowClipped ? "mt-16" : "-translate-y-full -mt-2"}
                        `}
                      >
                        <div className="font-semibold text-[#1A365D] text-sm mb-0.5">
                          {inst.name}
                        </div>
                        <div className="text-[11px] text-[#1b60bb] font-medium mb-2">
                          {inst.techCount} Technologies
                        </div>
                        {inst.website && (
                          <a 
                            href={inst.website.startsWith('http') ? inst.website : `https://${inst.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-xs text-[#1b60bb] hover:text-[#1872dd] font-semibold inline-flex items-center gap-1 hover:underline cursor-pointer"
                          >
                            Visit Website <ArrowUpRight size={12} />
                          </a>
                        )}
                      </motion.div>
                    );
                  })()
                )}
              </AnimatePresence>
            </motion.div>

          </div>
        </div>
      </div>
      {/* Custom Scrollbar for grid */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar-grid {
          -webkit-overflow-scrolling: touch;
          scroll-behavior: smooth;
          will-change: scroll-position, transform;
        }
        .custom-scrollbar-grid::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar-grid::-webkit-scrollbar-track {
          background: rgba(27, 96, 187, 0.05);
          border-radius: 8px;
        }
        .custom-scrollbar-grid::-webkit-scrollbar-thumb {
          background: rgba(27, 96, 187, 0.25);
          border-radius: 8px;
        }
        .custom-scrollbar-grid::-webkit-scrollbar-thumb:hover {
          background: rgba(27, 96, 187, 0.45);
        }
        .logo-grid-item {
          will-change: transform, opacity;
          transform: translate3d(0, 0, 0);
        }
      `}} />
    </div>
  );
}