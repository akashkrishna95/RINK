// app\RomiPortal\instrumentation\InstrumentationSection.tsx

'use client';

import { motion } from 'framer-motion';
import { Wrench, MapPin, Globe, CheckCircle2 } from 'lucide-react';
import dynamic from 'next/dynamic';

const InteractiveMap = dynamic(() => import('@/HomePage/InteractiveMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-slate-100/50 rounded-2xl animate-pulse flex items-center justify-center text-slate-600 font-sans text-sm font-bold border border-slate-200">
      Initializing Radar Matrix...
    </div>
  )
});

import { Institution } from '@/lib/pocketbase';

const defaultInstitutions: Institution[] = [
  {
    id: '1',
    name: 'CUSAT Advanced Technology Centre',
    website: 'cusat.ac.in',
    district: 'Ernakulam',
    techCount: 24,
    lat: 10.0284,
    lng: 76.3285,
    location: 'Kalamassery, Kochi, Kerala 682022',
    logoUrl: '',
    isPartnered: true
  },
  {
    id: '2',
    name: 'Kerala Agricultural University (KAU)',
    website: 'kau.in',
    district: 'Thrissur',
    techCount: 18,
    lat: 10.5434,
    lng: 76.2798,
    location: 'Vellanikkara, Thrissur, Kerala 680656',
    logoUrl: '',
    isPartnered: true
  },
  {
    id: '3',
    name: 'IISERT R&D Hub',
    website: 'iisertvm.ac.in',
    district: 'Thiruvananthapuram',
    techCount: 31,
    lat: 8.5486,
    lng: 76.9038,
    location: 'Vithura, Thiruvananthapuram, Kerala 695551',
    logoUrl: '',
    isPartnered: true
  }
];

interface InstrumentationSectionProps {
  setHasEntered: (val: boolean) => void;
  institutions?: Institution[];
}

export default function InstrumentationSection({ setHasEntered, institutions = defaultInstitutions }: InstrumentationSectionProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7 }}
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
    >
      <div className="bg-white/70 backdrop-blur-xl rounded-[32px] p-6 sm:p-10 lg:p-14 relative overflow-hidden border border-slate-200/60 shadow-[10px_10px_30px_#e2e8f0,-10px_-10px_30px_#ffffff]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* L: Radar Map Container */}
          <div className="lg:col-span-7 order-2 lg:order-1 w-full">
            <div className="bg-slate-50 p-4 rounded-[32px] border border-slate-200 shadow-[inset_4px_4px_10px_#e2e8f0,inset_-4px_-4px_10px_#ffffff] h-[520px] flex flex-col relative">
              
              <div className="flex justify-between items-center mb-4 px-2">
                <div className="flex items-center gap-2">
                  <MapPin size={18} className="text-emerald-600" />
                  <h4 className="font-bold text-slate-900 font-helios text-sm">Kerala Hardware Radar</h4>
                </div>
                <div className="bg-white border border-slate-200 px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-sm">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></div>
                  <span className="text-[10px] font-bold font-mono text-slate-700">LIVE SYNC</span>
                </div>
              </div>

              <div className="flex-1 rounded-2xl overflow-hidden border border-slate-300 relative shadow-inner bg-slate-100">
                {/* Decorative Scanline Overlay */}
                <div className="absolute inset-0 pointer-events-none z-10 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.02)_50%)] bg-[length:100%_4px]"></div>
                
                <InteractiveMap 
                  institutions={institutions} 
                  className="w-full h-full z-0"
                />
                
                {/* Overlay Info Card */}
                <div className="absolute bottom-4 left-4 right-4 z-20 bg-white/90 backdrop-blur-md p-4 rounded-xl border border-white/50 shadow-lg flex justify-between items-center">
                  <div>
                    <h5 className="font-bold text-slate-900 text-sm font-helios">CUSAT Advanced Lab</h5>
                    <p className="text-xs text-slate-600 font-medium">Scanning 24 available instruments...</p>
                  </div>
                  <button onClick={() => setHasEntered(true)} className="bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 px-4 py-2 rounded-xl text-xs font-bold transition-colors">
                    View Lab Details
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* R: Copy */}
          <div className="lg:col-span-5 order-1 lg:order-2 flex flex-col items-start text-left">
            <div className="bg-emerald-50/80 px-4 py-2 rounded-xl mb-6 flex items-center gap-2.5 border border-emerald-200/50 shadow-sm">
              <Wrench size={16} className="text-emerald-700" />
              <span className="text-xs font-bold tracking-wider text-emerald-800 uppercase font-helios">02 &bull; Analyze</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold font-helios text-slate-900 leading-tight mb-5">
              Find the machine, <br/>
              <span className="text-emerald-600">not the manual.</span>
            </h2>
            <p className="text-slate-700 font-montserrat text-sm sm:text-base leading-relaxed mb-8 font-medium">
              Locate high-grade equipment instantly. Romi maps industry acronyms (XRD, SEM) directly to physical hardware nodes across the state.
            </p>
            
            <div className="grid grid-cols-1 gap-4 w-full">
              <div className="bg-white p-4 rounded-2xl flex items-center gap-4 border border-slate-100 shadow-sm hover:-translate-y-1 transition-transform">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0"><Globe size={20} /></div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm font-helios">Geospatial Intelligence</h4>
                  <p className="text-xs text-slate-600 font-medium">Interactive mapping of all active facilities.</p>
                </div>
              </div>
              <div className="bg-white p-4 rounded-2xl flex items-center gap-4 border border-slate-100 shadow-sm hover:-translate-y-1 transition-transform">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0"><CheckCircle2 size={20} /></div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm font-helios">Verified Availability</h4>
                  <p className="text-xs text-slate-600 font-medium">Live connection to institutional booking APIs.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </motion.div>
  );
}
