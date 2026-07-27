'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wrench, Search, MapPin, School, Phone, Mail, ArrowUpRight, ArrowUp, 
  Check, Layers, ExternalLink, RefreshCw, Play, Pause, RotateCw, Sparkles, User, Lightbulb, Compass, Filter, X
} from 'lucide-react';
import Link from 'next/link';
import MiniCard from '../RomiPortalFeatures/MiniCard';

// LEAFLET LOADER FOR INLINE MAP
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

// Typing Text component with pulsing blinking cursor indicator
function TypingText({ text, speed = 25, onComplete }: { text: string; speed?: number; onComplete?: () => void }) {
  const [displayedText, setDisplayedText] = useState('');
  
  useEffect(() => {
    setDisplayedText('');
  }, [text]);

  useEffect(() => {
    if (!text) return;
    if (displayedText.length > 0 && !text.startsWith(displayedText)) {
      return;
    }
    
    if (displayedText.length >= text.length) {
      if (onComplete) onComplete();
      return;
    }
    
    const timeout = setTimeout(() => {
      setDisplayedText(text.slice(0, displayedText.length + 1));
    }, speed);
    
    return () => clearTimeout(timeout);
  }, [displayedText, text, speed, onComplete]);

  return (
    <span className="inline-flex items-center">
      {displayedText}
      {displayedText.length < text.length && (
        <span className="w-1.5 h-4 ml-0.5 bg-[#1b60bb] dark:bg-blue-400 animate-pulse inline-block" />
      )}
    </span>
  );
}

// 4 Story Stages matching the screenshots
const storySteps = [
  {
    id: 0,
    num: "01",
    title: "1. Search & Clarify",
    desc: "Tell Romi what you need. Romi clarifies acronyms and displays regional availability with 8 matching pins."
  },
  {
    id: 1,
    num: "02",
    title: "2. Selected Instrument Results",
    desc: "User selects 'Fourier Transform Infrared Spectrometer'. Romi lists the 6 matching facilities in Kerala."
  },
  {
    id: 2,
    num: "03",
    title: "3. Scroll & Quick Actions",
    desc: "Browsing detailed facility cards down to regional options and quick-action filters."
  },
  {
    id: 3,
    num: "04",
    title: "4. Map Spotlight Card",
    desc: "Hovering over a map pin displays the facility details, direct booking links, and contact options."
  }
];

// Sample Instrument Cards Data matching screenshots
const sampleInstruments = [
  {
    id: "INST_100011",
    name: "FTIR spectrometer",
    facility: "Sophisticated Test and Instrumentation Center (STIC)",
    institution: "Cochin University of Science and Technology (CUSAT)",
    location: "Kochi, Kerala",
    email: "saif@sticindia.com",
    contact: "91 484 2575908",
    lat: 10.0284,
    lng: 76.3285,
    district: "Ernakulam",
    description: "Sophisticated Test and Instrumentation Center (STIC) — Cochin University of Science and Technology — CUSAT, Cochin - 682 022, Kerala, India."
  },
  {
    id: "INST_100017",
    name: "Ftir",
    facility: "Central Laboratory for Instrumentation and Facilitation (CLIF)",
    institution: "Kerala University Campus, Kariavattom",
    location: "Thiruvananthapuram, Kerala",
    email: "clifanalyses@keralauniversity.ac.in",
    contact: "0471-2306566",
    lat: 8.5486,
    lng: 76.9038,
    district: "Thiruvananthapuram",
    description: "Central Laboratory for Instrumentation and Facilitation (CLIF) — Kerala University — University Campus, Kariavattom 695581."
  },
  {
    id: "INST_100115",
    name: "Fourier Transform Infrared (FTIR) Spectrometer",
    facility: "Sophisticated Analytical Instrument Facilities (SAIF)",
    institution: "ICAR-Central Institute of Fisheries Technology (CIFT)",
    location: "Kochi, Kerala",
    email: "src.cift@gmail.com",
    contact: "0484-2412300",
    lat: 9.9674,
    lng: 76.2625,
    district: "Ernakulam",
    description: "Sophisticated analytical instrument facilities (SAIF) — ICAR-Central Institute of Fisheries Technology — ICAR-CIFT, Willingdon Island, Cochin, Kerala-682029."
  },
  {
    id: "INST_100226",
    name: "Ft-Ir",
    facility: "CENTRE FOR ANALYTICAL INSTRUMENTATION - KERALA (CAIK)",
    institution: "Kerala Forest Research Institute (KSCSTE-KFRI)",
    location: "Thrissur, Kerala",
    email: "caik@kfri.res.in",
    contact: "0487-2690100",
    lat: 10.5434,
    lng: 76.2798,
    district: "Thrissur",
    description: "CENTRE FOR ANALYTICAL INSTRUMENTATION - KERALA (CAIK) — Kerala Forest Research Institute, Peechi, Thrissur - 680653, Kerala, India."
  },
  {
    id: "INST_100627",
    name: "FT/IR Spectrometer",
    facility: "Bio-NEST, Dr. Moopen's iNEST",
    institution: "Naseera Nagar, Meppadi, Wayanad",
    location: "Wayanad, Kerala",
    email: "Contact@drmoopensinest.com",
    contact: "81120 80451",
    lat: 11.6854,
    lng: 76.1320,
    district: "Wayanad",
    description: "Bio-NEST — Dr. Moopen's iNEST — Naseera Nagar, Meppadi, Meppadi (P.O), Wayanad, Kerala, India."
  },
  {
    id: "INST_100886",
    name: "Ftir",
    facility: "CEPCI Laboratory & Research Institute",
    institution: "Cashew Bhavan, Mundakkal, Kollam",
    location: "Kollam, Kerala",
    email: "cepci@cashewindia.org",
    contact: "0474-2742713",
    lat: 8.8932,
    lng: 76.6141,
    district: "Kollam",
    description: "CEPCI Laboratory & Research Institute — Cashew Bhavan, Mundakkal, Kollam - 691 001, Kerala, India."
  }
];

// Disambiguation Locations (8 pins total)
const disambiguationInstruments = [
  ...sampleInstruments,
  {
    id: "TEMP_1",
    name: "FTIR - Alappuzha Lab",
    lat: 9.4981,
    lng: 76.3388,
    district: "Alappuzha",
    facility: "Alappuzha Testing Lab",
    institution: "District Research Center",
    description: "District Research Center testing facilities."
  },
  {
    id: "TEMP_2",
    name: "FTIR - Malappuram Facility",
    lat: 11.0735,
    lng: 76.0740,
    district: "Malappuram",
    facility: "Malappuram Regional Lab",
    institution: "State Analytical Center",
    description: "State Analytical Center testing facilities."
  }
];

export default function InstrumentationStoryShowcase() {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [selectedInstId, setSelectedInstId] = useState<string>("INST_100011");
  const [tileType, setTileType] = useState<'default' | 'satellite'>('default');
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  // 'user-typing' -> 'ai-typing' -> 'showing-content' story phases
  const [animationPhase, setAnimationPhase] = useState<'user-typing' | 'ai-typing' | 'showing-content'>('user-typing');

  const containerRef = useRef<HTMLDivElement>(null);
  const mapDivRefDesktop = useRef<HTMLDivElement>(null);
  const mapDivRefMobile = useRef<HTMLDivElement>(null);
  const mapRefDesktop = useRef<any>(null);
  const mapRefMobile = useRef<any>(null);
  const layerRefDesktop = useRef<any>(null);
  const layerRefMobile = useRef<any>(null);
  const mapInitRefDesktop = useRef<boolean>(false);
  const mapInitRefMobile = useRef<boolean>(false);
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const prevStepRef = useRef<number>(0);

  // Monitor screen size dynamically (prevents rendering maps on unmounted sizes, saving memory & CPU)
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Control character typing sequential phases
  useEffect(() => {
    const prevStep = prevStepRef.current;
    prevStepRef.current = activeStep;

    // No longer destroy/recreate mobile map on step change — mobile map container is now persistent

    if (activeStep === 0) {
      setAnimationPhase('user-typing');
      const timer1 = setTimeout(() => {
        setAnimationPhase('ai-typing');
      }, 700);
      const timer2 = setTimeout(() => {
        setAnimationPhase('showing-content');
      }, 2200);
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    } else if (activeStep === 1) {
      setAnimationPhase('user-typing');
      const timer1 = setTimeout(() => {
        setAnimationPhase('ai-typing');
      }, 1400);
      const timer2 = setTimeout(() => {
        setAnimationPhase('showing-content');
      }, 4000);
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    } else {
      // Step 2 & 3 build on top of Step 1 context, so we bypass typing to display scrolling immediately
      setAnimationPhase('showing-content');
    }
  }, [activeStep]);

  // Cleanup maps on unmount
  useEffect(() => {
    return () => {
      if (mapRefDesktop.current) {
        try { mapRefDesktop.current.remove(); } catch(e){}
        mapRefDesktop.current = null;
      }
      if (mapRefMobile.current) {
        try { mapRefMobile.current.remove(); } catch(e){}
        mapRefMobile.current = null;
      }
    };
  }, []);

  // Initialize correct map on-demand based on layout size
  useEffect(() => {
    if (isMobile === null) return;
    let cancelled = false;

    ensureLeaflet().then((L) => {
      if (cancelled) return;

      if (isMobile) {
        // Destroy Desktop map if switching to mobile to conserve phone RAM
        if (mapRefDesktop.current) {
          try { mapRefDesktop.current.remove(); } catch(e){}
          mapRefDesktop.current = null;
          layerRefDesktop.current = null;
          mapInitRefDesktop.current = false;
        }

        // Destroy existing mobile map instance first before recreating it on the new DOM container
        if (mapRefMobile.current) {
          try { mapRefMobile.current.remove(); } catch(e){}
          mapRefMobile.current = null;
          layerRefMobile.current = null;
          mapInitRefMobile.current = false;
        }

        // Initialize mobile map if needed
        if (mapDivRefMobile.current && !mapInitRefMobile.current) {
          mapInitRefMobile.current = true;
          try {
            const mapM = L.map(mapDivRefMobile.current, { 
              zoomControl: false, 
              attributionControl: false,
              dragging: false,
              scrollWheelZoom: false,
              doubleClickZoom: false,
              boxZoom: false,
              touchZoom: false,
              keyboard: false
            }).setView([10.15, 76.45], 7.2);
            
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18 }).addTo(mapM);
            mapRefMobile.current = mapM;
            layerRefMobile.current = L.layerGroup().addTo(mapM);
            triggerPinRender(L);

            // Invalidate size immediately to resolve any size 0 rendering lag
            setTimeout(() => {
              mapM.invalidateSize();
            }, 100);
          } catch(e) {
            mapInitRefMobile.current = false;
          }
        }
      } else {
        // Destroy Mobile map if switching to desktop
        if (mapRefMobile.current) {
          try { mapRefMobile.current.remove(); } catch(e){}
          mapRefMobile.current = null;
          layerRefMobile.current = null;
          mapInitRefMobile.current = false;
        }

        // Initialize desktop map if needed
        if (mapDivRefDesktop.current && !mapInitRefDesktop.current) {
          mapInitRefDesktop.current = true;
          try {
            const mapD = L.map(mapDivRefDesktop.current, { 
              zoomControl: false, 
              attributionControl: false,
              dragging: false,
              scrollWheelZoom: false,
              doubleClickZoom: false,
              boxZoom: false,
              touchZoom: false,
              keyboard: false
            }).setView([10.15, 76.45], 7.2);
            
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18 }).addTo(mapD);
            mapRefDesktop.current = mapD;
            layerRefDesktop.current = L.layerGroup().addTo(mapD);
            triggerPinRender(L);

            setTimeout(() => {
              mapD.invalidateSize();
            }, 100);
          } catch(e) {
            mapInitRefDesktop.current = false;
          }
        }
      }
    }).catch(() => {});

    return () => { cancelled = true; };
  }, [isMobile, animationPhase, activeStep]); // Re-sync pins when showing-content turns active

  // Sync Leaflet tile layers for active maps
  useEffect(() => {
    const L = (window as any).L;
    if (!L) return;
    const url = tileType === 'satellite'
      ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
      : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

    if (mapRefDesktop.current) {
      mapRefDesktop.current.eachLayer((layer: any) => {
        if (layer instanceof L.TileLayer) {
          mapRefDesktop.current.removeLayer(layer);
        }
      });
      L.tileLayer(url, { maxZoom: 18 }).addTo(mapRefDesktop.current);
    }

    if (mapRefMobile.current) {
      mapRefMobile.current.eachLayer((layer: any) => {
        if (layer instanceof L.TileLayer) {
          mapRefMobile.current.removeLayer(layer);
        }
      });
      L.tileLayer(url, { maxZoom: 18 }).addTo(mapRefMobile.current);
    }
  }, [tileType]);

  // Render map pins on active maps (Only after typing finishes to preserve reveal sync)
  const triggerPinRender = (L: any) => {
    if (animationPhase !== 'showing-content') {
      if (layerRefDesktop.current) layerRefDesktop.current.clearLayers();
      if (layerRefMobile.current) layerRefMobile.current.clearLayers();
      return;
    }

    const currentPins = activeStep === 0 ? disambiguationInstruments : sampleInstruments;

    // Desktop map
    if (layerRefDesktop.current && mapRefDesktop.current) {
      layerRefDesktop.current.clearLayers();
      currentPins.forEach((inst) => {
        const isSelected = selectedInstId === inst.id && activeStep !== 0;
        const customIcon = L.divIcon({
          className: `custom-inst-pin ${isSelected ? 'selected-map-pin' : ''}`,
          html: `
            <div class="relative w-8 h-10 flex items-center justify-center transition-all duration-300 ${isSelected ? 'scale-125 z-50' : 'scale-100'}">
              ${isSelected ? '<div class="absolute w-8 h-8 rounded-full bg-emerald-500/30 animate-ping border border-emerald-400/40"></div>' : ''}
              <svg width="24" height="30" viewBox="0 0 24 30" fill="none" xmlns="http://www.w3.org/2000/svg" class="drop-shadow-md">
                <path d="M12 2C7.03 2 3 6.03 3 11c0 6.25 9 17 9 17s9-10.75 9-17c0-4.97-4.03-9-9-9z" fill="${isSelected ? '#10b981' : '#0052cc'}" stroke="white" stroke-width="2" stroke-linejoin="round"/>
                <circle cx="12" cy="11" r="3.5" fill="white"/>
              </svg>
            </div>
          `,
          iconSize: [32, 40],
          iconAnchor: [16, 32]
        });
        L.marker([inst.lat, inst.lng], { icon: customIcon }).addTo(layerRefDesktop.current);
      });

      if (activeStep === 0) {
        mapRefDesktop.current.setView([10.15, 76.45], 7.2);
      } else if (selectedInstId) {
        const selected = sampleInstruments.find(i => i.id === selectedInstId);
        if (selected) {
          mapRefDesktop.current.panTo([selected.lat, selected.lng], { animate: true, duration: 0.6 });
        }
      }
    }

    // Mobile map
    if (layerRefMobile.current && mapRefMobile.current) {
      layerRefMobile.current.clearLayers();
      currentPins.forEach((inst) => {
        const isSelected = selectedInstId === inst.id && activeStep !== 0;
        const customIcon = L.divIcon({
          className: `custom-inst-pin ${isSelected ? 'selected-map-pin' : ''}`,
          html: `
            <div class="relative w-8 h-10 flex items-center justify-center transition-all duration-300 ${isSelected ? 'scale-125 z-50' : 'scale-100'}">
              ${isSelected ? '<div class="absolute w-8 h-8 rounded-full bg-emerald-500/30 animate-ping border border-emerald-400/40"></div>' : ''}
              <svg width="24" height="30" viewBox="0 0 24 30" fill="none" xmlns="http://www.w3.org/2000/svg" class="drop-shadow-md">
                <path d="M12 2C7.03 2 3 6.03 3 11c0 6.25 9 17 9 17s9-10.75 9-17c0-4.97-4.03-9-9-9z" fill="${isSelected ? '#10b981' : '#0052cc'}" stroke="white" stroke-width="2" stroke-linejoin="round"/>
                <circle cx="12" cy="11" r="3.5" fill="white"/>
              </svg>
            </div>
          `,
          iconSize: [32, 40],
          iconAnchor: [16, 32]
        });
        L.marker([inst.lat, inst.lng], { icon: customIcon }).addTo(layerRefMobile.current);
      });

      if (activeStep === 0) {
        mapRefMobile.current.setView([10.15, 76.45], 7.2);
      } else if (selectedInstId) {
        const selected = sampleInstruments.find(i => i.id === selectedInstId);
        if (selected) {
          mapRefMobile.current.panTo([selected.lat, selected.lng], { animate: true, duration: 0.6 });
        }
      }
    }
  };

  // Re-trigger pin updates and invalidate mobile map size when becoming visible
  useEffect(() => {
    const L = (window as any).L;
    if (L) {
      triggerPinRender(L);
    }
    // When mobile map becomes visible again, invalidate its size so tiles render correctly
    if (animationPhase === 'showing-content' && mapRefMobile.current) {
      setTimeout(() => {
        if (mapRefMobile.current) {
          mapRefMobile.current.invalidateSize();
        }
      }, 450); // Wait for CSS max-h transition to complete
    }
  }, [activeStep, selectedInstId, animationPhase]);

  // Chat scrolling controller (optimizes view visibility)
  useEffect(() => {
    if (!chatScrollRef.current) return;
    if (animationPhase !== 'showing-content') return; // Wait until content finishes typing

    if (activeStep === 2 || activeStep === 3) {
      chatScrollRef.current.scrollTo({
        top: chatScrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    } else {
      chatScrollRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }, [activeStep, isMobile, animationPhase]);

  // Story step autoplay loop
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % storySteps.length);
    }, 6000); // 6s duration to align with typing transitions
    return () => clearInterval(interval);
  }, [isPlaying]);

  const renderMobileMapCard = () => {
    if (!isMobile) return null;
    return (
      <div
        id="mobile-map-card" 
        className={`block lg:hidden w-[calc(100%+44px)] -ml-[44px] bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl p-2 flex flex-col justify-between shadow-sm relative overflow-hidden my-3 transition-all duration-400 ${
          animationPhase === 'showing-content' ? 'opacity-100 max-h-[600px]' : 'opacity-0 max-h-0 overflow-hidden pointer-events-none !my-0 !p-0 !border-0'
        }`}
      >
        <div className="flex items-center justify-between pb-2 border-b border-gray-150 dark:border-zinc-800 mb-2 px-1">
          <div className="flex items-center gap-2">
            <span className="font-helios font-bold text-xs text-gray-900 dark:text-zinc-100 uppercase tracking-wider flex items-center gap-1">
              <MapPin size={12} className="text-[#1b60bb]" /> FACILITY MAP
            </span>
            <span className="bg-blue-50 dark:bg-blue-950/60 text-[#1b60bb] dark:text-blue-400 border border-blue-200/50 text-[9px] font-bold px-2 py-0.5 rounded-full font-mono">
              {activeStep === 0 ? '8 pins' : '6 pins'}
            </span>
          </div>
        </div>
        <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-zinc-800 relative h-[320px] shadow-inner bg-slate-100 pointer-events-none">
          <div ref={mapDivRefMobile} className="w-full h-full z-0" />
        </div>

        {/* Floating Overlay Popup in Mobile Inline Map */}
        <AnimatePresence>
          {activeStep === 3 && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 5, scale: 0.95 }}
              className="absolute top-10 left-2 right-2 max-w-[260px] mx-auto bg-white dark:bg-zinc-950 border border-gray-150 dark:border-zinc-800 rounded-2xl p-3 shadow-2xl z-30 font-sans pointer-events-auto"
            >
              <div className="flex justify-between items-start mb-1">
                <div>
                  <h4 className="text-[#0052cc] dark:text-blue-400 font-bold font-helios text-xs leading-snug">
                    FTIR spectrometer
                  </h4>
                  <div className="flex gap-1 mt-1">
                    <span className="px-1.5 py-0.5 text-[8px] font-bold border border-blue-300 bg-blue-50 text-blue-600 rounded">
                      Ernakulam
                    </span>
                    <span className="px-1.5 py-0.5 text-[8px] font-bold bg-gray-100 text-gray-600 rounded font-mono uppercase">
                      INSTRUMENT
                    </span>
                  </div>
                </div>
              </div>
              <div className="space-y-1 text-[9px] text-gray-600 dark:text-zinc-300 border-t border-gray-100 dark:border-zinc-900 pt-1.5 font-medium">
                <p>CUSAT, Cochin - 682 022, Kerala, India</p>
                <p><span className="text-[#0052cc] underline">saif@sticindia.com</span></p>
                <p>91 484 2575908</p>
              </div>
              <button
                type="button"
                className="w-full mt-2 bg-[#0052cc] text-white py-1.5 rounded-lg text-[10px] font-bold shadow-xs flex items-center justify-center gap-1"
              >
                Visit Website <ExternalLink size={10} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <p className="text-[9.5px] font-mono text-gray-400 text-center mt-2 px-1">
          Click a pin or card to spotlight &bull; double-click to open full details.
        </p>
      </div>
    );
  };

  return (
    <section className="py-16 px-2 sm:px-4 md:px-8 max-w-7xl mx-auto w-full flex flex-col items-center font-sans">
      
      {/* SECTION HEADER & HOOK */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-10 max-w-4xl mx-auto"
      >
        <h1 className="text-center text-[24px] xs:text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-helios text-gray-900 dark:text-zinc-100 mb-4 tracking-tight leading-tight">
          &quot;Find the machine, <span className="text-[#1b60bb] dark:text-[#7dd3fc]">not the manual.&quot;</span>
        </h1>
        
        <p className="text-gray-600 dark:text-zinc-300 font-montserrat text-xs sm:text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
          Kerala&apos;s research institutions are full of equipment most people never hear about until they need it — and by then it&apos;s too late to go hunting. Romi turns that hunt into a two-minute conversation.
        </p>
      </motion.div>

      {/* INTERACTIVE STORY PROGRESS BAR */}
      <div className="w-full mb-8">
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-400 font-mono">
            Interactive Story Walkthrough
          </span>
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-7 h-7 rounded-full flex items-center justify-center border border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800 text-gray-500 dark:text-zinc-400 transition-all cursor-pointer shadow-xs"
            title={isPlaying ? 'Pause walkthrough autoplay' : 'Resume walkthrough autoplay'}
          >
            {isPlaying ? <Pause size={11} /> : <Play size={11} className="ml-0.5" />}
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
          {storySteps.map((step) => {
            const isActive = activeStep === step.id;
            return (
              <button
                key={step.id}
                type="button"
                onClick={() => {
                  setActiveStep(step.id);
                  setIsPlaying(false);
                }}
                className={`p-3 rounded-xl border text-left transition-all duration-300 cursor-pointer relative overflow-hidden ${
                  isActive
                    ? 'bg-[#F1EFEB] dark:bg-[#1a1a1c] border-[#c8c2b0] dark:border-zinc-700 shadow-[inset_3px_3px_6px_rgba(135,130,110,0.5),inset_-3px_-3px_6px_rgba(255,255,255,0.95)] dark:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.75),inset_-3px_-3px_6px_rgba(255,255,255,0.04)]'
                    : 'bg-[#F1EFEB] dark:bg-zinc-950/40 border-gray-200/60 dark:border-zinc-800/80 shadow-[inset_1.5px_1.5px_3px_rgba(165,160,135,0.25),inset_-1.5px_-1.5px_3px_rgba(255,255,255,0.85)] dark:shadow-[inset_1.5px_1.5px_3px_rgba(0,0,0,0.55),inset_-1px_-1px_2px_rgba(255,255,255,0.02)] hover:bg-[#ebe9e1] dark:hover:bg-zinc-800/40 hover:shadow-[inset_1px_1px_3.5px_rgba(135,130,110,0.35)]'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-[9px] lg:text-[11px] font-mono font-bold px-1.5 lg:px-2 py-0.5 lg:py-1 rounded ${isActive ? 'bg-[#1b60bb] text-white' : 'bg-gray-100 dark:bg-zinc-800 text-gray-500'}`}>
                    {step.num}
                  </span>
                </div>
                <h4 className={`font-helios text-[11px] lg:text-sm font-bold leading-tight ${isActive ? 'text-[#1b60bb] dark:text-blue-400' : 'text-gray-800 dark:text-zinc-200'}`}>
                  {step.title}
                </h4>
              </button>
            );
          })}
        </div>
      </div>

      {/* SKEUOMORPHIC SIDE-BY-SIDE CONVERSATIONAL WORKSPACE */}
      <div ref={containerRef} className="w-full bg-[#F7F5F1] dark:bg-zinc-900/60 border border-[#e5e1d5] dark:border-zinc-800/85 rounded-[32px] p-2.5 sm:p-4 md:p-6 shadow-xl relative overflow-hidden backdrop-blur-xl">
        
        {/* WORKSPACE GRID: CONVERSATION AREA (LEFT) + LIVE FACILITY MAP (RIGHT) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch min-h-[580px]">
          
          {/* LEFT 7 COLS: SKEUOMORPHIC CHAT AREA */}
          <div className="lg:col-span-7 bg-white/95 dark:bg-zinc-900/40 border border-slate-200/90 dark:border-zinc-800/60 rounded-2xl p-3 sm:p-5 flex flex-col justify-between shadow-[0_12px_32px_-8px_rgba(0,0,0,0.08),0_2px_8px_-2px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.9)] relative">
            
            {/* CHAT HEADER BAR */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-150 dark:border-zinc-800 mb-3">
              <div className="flex items-center gap-2">
                <span className="font-helios font-bold text-xs text-gray-800 dark:text-zinc-200 whitespace-nowrap">ROMI AI</span>
                <span className="bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200/60 text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 font-mono uppercase">
                  <Wrench size={10} /> INSTRUMENTATION
                </span>
              </div>
            </div>



            {/* MESSAGES STREAM AREA */}
            <div id="chat-scroll-container" ref={chatScrollRef} className="flex-1 overflow-y-auto space-y-4 pr-1 max-h-[460px] scrollbar-thin font-sans">
              
              {/* USER MESSAGE BUBBLE WITH TYPING EFFECT */}
              <div className="flex gap-2 justify-end items-start font-sans">
                <div className="bg-[#1b60bb] text-white p-3.5 rounded-3xl rounded-tr-xs text-xs font-sans font-bold shadow-md">
                  {animationPhase === 'user-typing' ? (
                    <TypingText 
                      text={activeStep === 0 ? "FTIR" : "Fourier Transform Infrared Spectrometer"} 
                      speed={activeStep === 0 ? 40 : 20} 
                    />
                  ) : (
                    <span>{activeStep === 0 ? "FTIR" : "Fourier Transform Infrared Spectrometer"}</span>
                  )}
                </div>
                <div className="w-8 h-8 rounded-full bg-[#1b60bb] text-white flex items-center justify-center text-xs shrink-0 shadow-sm font-bold">
                  <User size={15} />
                </div>
              </div>

              {/* STEP 0: DISAMBIGUATION VIEW (Image 1) */}
              {activeStep === 0 ? (
                // Only render Romi's bubble if the user has finished typing
                animationPhase !== 'user-typing' && (
                  <div className="flex gap-3 items-start font-sans">
                    <img src="/romi-avatar.png" alt="Romi" className="w-8 h-8 object-contain shrink-0" />
                    <div className="flex-1 text-xs font-sans space-y-3 min-w-0">
                      
                      {animationPhase === 'ai-typing' ? (
                        <div className="bg-gray-50 dark:bg-zinc-800 p-3 rounded-2xl rounded-tl-xs shadow-sm max-w-md text-gray-800 dark:text-zinc-200 font-semibold leading-relaxed">
                          <TypingText text="Is this what you're referring to by 'FTIR'? Pick one:" speed={18} />
                        </div>
                      ) : (
                        // Phase: showing-content (renders full disambiguation content with sequential fade-in animations)
                        <>
                          {/* View Map Button (8 pins) */}
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            id="facility-map-badge" 
                            className="bg-blue-50 dark:bg-blue-950/40 text-[#1b60bb] dark:text-blue-400 border border-blue-200/60 dark:border-blue-900/40 px-3.5 py-1.5 rounded-full font-bold inline-flex items-center gap-1.5 text-[11px] shadow-2xs"
                          >
                            <MapPin size={12} /> View Facility Map (8 pins) <ArrowUpRight size={12} />
                          </motion.div>

                          {renderMobileMapCard()}

                          <motion.p 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                            className="font-semibold text-gray-800 dark:text-zinc-200"
                          >
                            Is this what you&apos;re referring to by <strong className="text-[#1b60bb] dark:text-blue-400">&quot;FTIR&quot;</strong>? Pick one:
                          </motion.p>

                          <div className="space-y-1.5 font-medium text-[11px] max-w-lg">
                            {[
                              "Fourier Transform Infrared Spectrometer",
                              "Attenuated Total Reflectance Fourier Transform Infrared Spectrometer (Shimadzu IR Prestige 21)",
                              "Fourier Transform Infrared Spectrometer (FTIR)",
                              "FTIR Spectrometer",
                              "None of the above"
                            ].map((option, idx) => (
                              <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -12 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: idx * 0.1 }}
                                id={idx === 0 ? "disambig-option-0" : undefined}
                                className={`p-2.5 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                                  idx === 0
                                    ? 'bg-blue-50/80 dark:bg-blue-950/60 border-blue-300 dark:border-blue-700 text-[#1b60bb] dark:text-blue-300 font-bold shadow-xs'
                                    : 'bg-gray-50 dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 hover:border-[#1b60bb] text-gray-700 dark:text-zinc-300'
                                }`}
                              >
                                <span>↪ {option}</span>
                              </motion.div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )
              ) : (
                /* STEPS 1, 2, 3: CARDS LIST (Images 2, 3, 4) */
                animationPhase !== 'user-typing' && (
                  <div className="flex gap-3 items-start font-sans">
                    <img src="/romi-avatar.png" alt="Romi" className="w-8 h-8 object-contain shrink-0" />
                    <div className="flex-1 text-xs font-sans space-y-3 min-w-0">
                      
                      {animationPhase === 'ai-typing' ? (
                        <div className="bg-gray-50 dark:bg-zinc-800 p-3 rounded-2xl rounded-tl-xs shadow-sm max-w-lg text-gray-800 dark:text-zinc-200 font-semibold leading-relaxed">
                          <TypingText text="Found 6 x Fourier Transform Infrared Spectrometer across 5 district(s) in Kerala. Locations are pinned on the map — click a card to spotlight it, double-click to open its full information page." speed={12} />
                        </div>
                      ) : (
                        // Phase: showing-content (renders full result content with progressive fade-in cards)
                        <>
                          {/* View Map Button (6 pins) */}
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            id="facility-map-badge" 
                            className="bg-blue-50 dark:bg-blue-950/40 text-[#1b60bb] dark:text-blue-400 border border-blue-200/60 dark:border-blue-900/40 px-3.5 py-1.5 rounded-full font-bold inline-flex items-center gap-1.5 text-[11px] shadow-2xs"
                          >
                            <MapPin size={12} /> View Facility Map (6 pins) <ArrowUpRight size={12} />
                          </motion.div>

                          {renderMobileMapCard()}

                          <motion.p 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                            className="text-gray-800 dark:text-zinc-200 leading-relaxed font-semibold"
                          >
                            Found <strong className="text-[#1b60bb] dark:text-blue-400 font-bold">6 x Fourier Transform Infrared Spectrometer</strong> across <strong className="text-gray-950 dark:text-zinc-100 font-bold">5 district(s)</strong> in Kerala. Locations are pinned on the map — click a card to spotlight it, double-click to open its full information page.
                          </motion.p>

                          {/* CARDS CONTAINER (RECTANGULAR DESIGN USING NATIVE MINICARD) */}
                          <div className="space-y-3.5 w-full">
                            {sampleInstruments.map((inst, index) => {
                              const isSelected = selectedInstId === inst.id && activeStep === 3;
                              const borderClass = isSelected
                                ? 'border-[#1b60bb] dark:border-blue-400 bg-blue-50/40 dark:bg-blue-955/40 shadow-[0_10px_25px_-5px_rgba(27,96,187,0.25)] ring-2 ring-[#1b60bb]/20'
                                : 'border-gray-200/90 dark:border-zinc-800 bg-white/90 dark:bg-zinc-900/60 shadow-[0_4px_14px_-2px_rgba(0,0,0,0.05),0_1px_4px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_28px_-5px_rgba(0,0,0,0.09),0_4px_10px_-2px_rgba(0,0,0,0.04)] hover:border-[#1b60bb]/50';

                              const techObject = {
                                technology_id: inst.id,
                                technology_name: inst.name,
                                institution: `${inst.facility} — ${inst.institution}`,
                                primary_sector: "Instrumentation",
                                brief_description_abstract: inst.description,
                                trl: "9",
                                startup_potential: "High",
                                patent_status: "Approved",
                                contact_person: inst.facility
                              };

                              return (
                                <motion.div
                                  key={inst.id}
                                  initial={{ opacity: 0, y: 15 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.35, delay: index * 0.12 }}
                                  onClick={() => setSelectedInstId(inst.id)}
                                  className="w-full"
                                >
                                  <MiniCard
                                    technology={techObject}
                                    isInstrumentation={true}
                                    contactNumber={inst.contact}
                                    email={inst.email}
                                    className={borderClass}
                                  />
                                </motion.div>
                              );
                            })}
                          </div>

                          {/* QUICK ACTION OPTIONS */}
                          {(activeStep === 2 || activeStep === 3) && (
                            <motion.div 
                              initial={{ opacity: 0 }} 
                              animate={{ opacity: 1 }} 
                              className="flex flex-col gap-1.5 pt-3 border-t border-gray-150 dark:border-zinc-800 space-y-1"
                            >
                              <span className="text-[10px] sm:text-xs font-bold text-[#1b60bb] hover:underline cursor-default flex items-center gap-1">
                                ↪ Filter by district
                              </span>
                              <span className="text-[10px] sm:text-xs font-bold text-[#1b60bb] hover:underline cursor-default flex items-center gap-1">
                                ↪ Search another instrument
                              </span>
                              <span className="text-[10px] sm:text-xs font-bold text-[#1b60bb] hover:underline cursor-default flex items-center gap-1">
                                ↪ Switch to Services
                              </span>
                            </motion.div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                )
              )}

            </div>

          </div>

          {/* DESKTOP-ONLY RIGHT 5 COLS: LIVE FACILITY MAP PANEL */}
          {!isMobile && (
            <div className="lg:col-span-5 hidden lg:flex flex-col justify-between bg-white/95 dark:bg-zinc-900/40 border border-slate-200/90 dark:border-zinc-800/60 rounded-2xl p-3 shadow-[0_12px_32px_-8px_rgba(0,0,0,0.08),0_2px_8px_-2px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.9)] relative overflow-hidden">
              
              {/* MAP HEADER */}
              <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-zinc-800 mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-helios font-bold text-xs text-gray-900 dark:text-zinc-100 uppercase tracking-wider flex items-center gap-1">
                    <MapPin size={12} className="text-[#1b60bb]" /> FACILITY MAP
                  </span>
                  <span className="bg-blue-50 dark:bg-blue-950/60 text-[#1b60bb] dark:text-blue-400 border border-blue-200/50 text-[9px] font-bold px-2 py-0.5 rounded-full font-mono">
                    {activeStep === 0 ? '8 pins' : '6 pins'}
                  </span>
                </div>

                <div className="flex items-center gap-1 bg-gray-100 dark:bg-zinc-800 p-0.5 rounded-lg text-[9px] font-bold font-mono">
                  <button
                    type="button"
                    onClick={() => setTileType('default')}
                    className={`px-2 py-0.5 rounded-md transition-colors ${tileType === 'default' ? 'bg-[#1b60bb] text-white shadow-xs' : 'text-gray-500 dark:text-zinc-400'}`}
                  >
                    Default
                  </button>
                  <button
                    type="button"
                    onClick={() => setTileType('satellite')}
                    className={`px-2 py-0.5 rounded-md transition-colors ${tileType === 'satellite' ? 'bg-[#1b60bb] text-white shadow-xs' : 'text-gray-500 dark:text-zinc-400'}`}
                  >
                    Satellite
                  </button>
                </div>
              </div>

              {/* MAP VIEWPORT */}
              <div className="flex-1 rounded-xl overflow-hidden border border-gray-200 dark:border-zinc-800 relative min-h-[360px] shadow-inner bg-slate-100 pointer-events-none">
                <div ref={mapDivRefDesktop} className="w-full h-full min-h-[360px] z-0" />
              </div>

              {/* FLOATING SKEUOMORPHIC POPUP OVERLAY ON DESKTOP */}
              <AnimatePresence>
                {activeStep === 3 && (
                  <motion.div
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-12 left-4 right-4 max-w-[280px] sm:max-w-[290px] mx-auto bg-white dark:bg-zinc-950 border border-blue-100 dark:border-zinc-800 rounded-2xl p-4 shadow-[0_20px_50px_-10px_rgba(0,82,204,0.18),0_10px_25px_-5px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.9)] z-30 font-sans pointer-events-auto"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="text-[#0052cc] dark:text-blue-400 font-bold font-helios text-sm sm:text-base leading-snug">
                          FTIR spectrometer
                        </h4>
                        <div className="flex gap-1.5 mt-1.5">
                          <span className="px-2 py-0.5 text-[8.5px] font-bold border border-blue-300 bg-blue-50 text-blue-600 rounded">
                            Ernakulam
                          </span>
                          <span className="px-2 py-0.5 text-[8.5px] font-bold bg-gray-100 text-gray-600 rounded font-mono uppercase">
                            INSTRUMENT
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-[10px] sm:text-xs text-gray-700 dark:text-zinc-300 border-t border-gray-100 dark:border-zinc-900 pt-2 font-medium">
                      <p>
                        <strong className="text-[#0052cc]">Address:</strong> CUSAT, Cochin - 682 022, Kerala, India
                      </p>
                      <p>
                        <strong className="text-[#0052cc]">Email:</strong> <span className="text-[#0052cc] underline">saif@sticindia.com</span>
                      </p>
                      <p>
                        <strong className="text-[#0052cc]">Phone:</strong> 91 484 2575908
                      </p>
                    </div>

                    <button
                      type="button"
                      className="w-full mt-3 bg-[#0052cc] hover:bg-[#0047b3] text-white py-2 rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5"
                    >
                      Visit Website <ExternalLink size={12} />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* MAP FOOTER */}
              <p className="text-[9.5px] font-mono text-gray-400 text-center mt-2">
                Click a pin or card to spotlight &bull; double-click to open full details.
              </p>

            </div>
          )}

        </div>
      </div>

    </section>
  );
}
