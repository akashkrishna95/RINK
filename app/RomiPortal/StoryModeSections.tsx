'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { 
  Cpu, Wrench, Lightbulb, ShieldCheck, Zap, BarChart3, Database, 
  MapPin, CheckCircle2, Lock, ArrowRight, ExternalLink, 
  Layers, Globe, TrendingUp, Download, ArrowUp
} from 'lucide-react';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const InteractiveMap = dynamic(() => import('@/HomePage/InteractiveMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-slate-100/50 rounded-2xl animate-pulse flex items-center justify-center text-slate-600 font-sans text-sm font-bold border border-slate-200">
      Initializing Radar Matrix...
    </div>
  )
});

const mockInstitutions = [
  {
    id: 1,
    name: 'CUSAT Advanced Technology Centre',
    website: 'cusat.ac.in',
    district: 'Ernakulam',
    techCount: 24,
    lat: 10.0284,
    lng: 76.3285,
    location: 'Kalamassery, Kochi, Kerala 682022',
    partnered: true
  },
  {
    id: 2,
    name: 'Kerala Agricultural University (KAU)',
    website: 'kau.in',
    district: 'Thrissur',
    techCount: 18,
    lat: 10.5434,
    lng: 76.2798,
    location: 'Vellanikkara, Thrissur, Kerala 680656',
    partnered: true
  },
  {
    id: 3,
    name: 'IISERT R&D Hub',
    website: 'iisertvm.ac.in',
    district: 'Thiruvananthapuram',
    techCount: 31,
    lat: 8.5486,
    lng: 76.9038,
    location: 'Vithura, Thiruvananthapuram, Kerala 695551',
    partnered: true
  }
];

export default function StoryModeSections({ setHasEntered }: { setHasEntered: (val: boolean) => void }) {
  // Section 1 State
  const [sec1Mode, setSec1Mode] = useState<'chat' | 'compare' | 'market'>('chat');
  
  // Section 3 State (Texting Onboarding)
  const [sec3Step, setSec3Step] = useState(0);
  const totalSteps = 5;

  useEffect(() => {
    // Auto-advance Section 3 texting flow for demo purposes
    const interval = setInterval(() => {
      setSec3Step((prev) => {
        if (prev < totalSteps - 1) return prev + 1;
        return 0; // loop back for demo
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full flex flex-col gap-16 md:gap-28 overflow-hidden relative pb-16 bg-[#fafcff]">

      {/* Continuity Banner */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 flex flex-col items-center">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-md px-6 py-3 rounded-2xl flex items-center gap-3 border border-slate-200 shadow-[4px_4px_15px_#e2e8f0,-4px_-4px_15px_#ffffff]"
        >
          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
          <span className="text-xs font-bold tracking-widest text-slate-900 uppercase font-helios">
            ROMI AI CONTINUOUS WORKFLOW &bull; DISCOVER &rarr; ANALYZE &rarr; SCALE
          </span>
        </motion.div>
      </div>

      {/* Ambient BG */}
      <div className="absolute top-[5%] left-[-5%] w-[40%] h-[500px] bg-blue-400/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-[40%] right-[-5%] w-[40%] h-[500px] bg-emerald-400/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-[5%] left-[10%] w-[40%] h-[500px] bg-purple-400/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* ========================================================================= */}
      {/* SECTION 1: TECHNOLOGIES (DISCOVER) - Messaging UI */}
      {/* ========================================================================= */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="bg-white/70 backdrop-blur-xl rounded-[32px] p-6 sm:p-10 lg:p-14 relative overflow-hidden border border-slate-200/60 shadow-[10px_10px_30px_#e2e8f0,-10px_-10px_30px_#ffffff]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* L: Copy */}
            <div className="lg:col-span-5 flex flex-col items-start text-left">
              <div className="bg-blue-50/80 px-4 py-2 rounded-xl mb-6 flex items-center gap-2.5 border border-blue-200/50 shadow-sm">
                <Cpu size={16} className="text-blue-700" />
                <span className="text-xs font-bold tracking-wider text-blue-800 uppercase font-helios">01 &bull; Discover</span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold font-helios text-slate-900 leading-tight mb-5">
                Ask like a person, <br/>
                <span className="text-blue-600">not a search bar.</span>
              </h2>
              <p className="text-slate-700 font-montserrat text-sm sm:text-base leading-relaxed mb-8 font-medium">
                Translate plain language problems into verified, market-ready deep-tech solutions from Kerala's top institutions instantly.
              </p>
              
              <div className="flex flex-col gap-4 w-full">
                <div className="bg-white p-4 rounded-2xl flex items-center gap-4 border border-slate-100 shadow-[4px_4px_10px_#f1f5f9,-4px_-4px_10px_#ffffff]">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0"><Database size={20} /></div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm font-helios">Semantic Tech Matching</h4>
                    <p className="text-xs text-slate-600 font-medium">Maps raw problems to patents instantly.</p>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-2xl flex items-center gap-4 border border-slate-100 shadow-[4px_4px_10px_#f1f5f9,-4px_-4px_10px_#ffffff]">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0"><BarChart3 size={20} /></div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm font-helios">Dynamic Visualizations</h4>
                    <p className="text-xs text-slate-600 font-medium">Live market data charts (TAM/SAM/SOM).</p>
                  </div>
                </div>
              </div>
            </div>

            {/* R: Interactive Messaging App */}
            <div className="lg:col-span-7 w-full">
              <div className="bg-slate-50/90 rounded-[28px] border border-slate-300 shadow-[inset_0_2px_10px_rgba(0,0,0,0.02),0_15px_35px_rgba(27,96,187,0.08)] flex flex-col overflow-hidden h-[500px]">
                
                {/* App Header */}
                <div className="bg-white px-5 py-4 border-b border-slate-200 flex justify-between items-center z-10 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold font-helios text-xs shadow-md">R</div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm font-helios">ROMI AI</h4>
                      <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Active
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setSec1Mode('chat')} className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${sec1Mode === 'chat' ? 'bg-blue-100 text-blue-800 border border-blue-200 shadow-inner' : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'}`}>Chat</button>
                    <button onClick={() => setSec1Mode('compare')} className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${sec1Mode === 'compare' ? 'bg-blue-100 text-blue-800 border border-blue-200 shadow-inner' : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'}`}>Compare</button>
                    <button onClick={() => setSec1Mode('market')} className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${sec1Mode === 'market' ? 'bg-blue-100 text-blue-800 border border-blue-200 shadow-inner' : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'}`}>Market</button>
                  </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 p-5 overflow-y-auto relative bg-[#f4f7fb]">
                  <AnimatePresence mode="wait">
                    {/* MODE: CHAT */}
                    {sec1Mode === 'chat' && (
                      <motion.div key="chat" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} transition={{ duration: 0.2 }} className="flex flex-col gap-4">
                        {/* User Msg */}
                        <div className="self-end max-w-[80%] bg-blue-600 text-white p-3.5 rounded-2xl rounded-tr-sm shadow-md">
                          <p className="text-sm font-medium font-montserrat leading-relaxed">I have sugarcane & jaggery waste from my processing unit. Can we produce bio-ethanol?</p>
                        </div>
                        {/* AI Msg */}
                        <div className="self-start w-full max-w-[90%] bg-white border border-slate-200 p-4 rounded-2xl rounded-tl-sm shadow-sm flex flex-col gap-3">
                          <div className="flex items-center gap-2 text-slate-900 font-bold font-helios text-sm">
                            <Zap size={16} className="text-blue-600" /> Found Technology Match
                          </div>
                          <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl">
                            <div className="flex justify-between items-start mb-1">
                              <h5 className="font-bold text-slate-900 text-sm">Bio-Ethanol Catalytic Conversion System</h5>
                              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-md border border-emerald-200">TRL 8</span>
                            </div>
                            <p className="text-xs text-slate-600 font-medium mb-3">CTCRI & KAU Joint R&D • Patent: IN-PAT-2024-8891</p>
                            
                            <div className="grid grid-cols-2 gap-2 mt-2">
                              <button onClick={() => setSec1Mode('compare')} className="w-full bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50 text-slate-700 hover:text-blue-700 py-2 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-sm">
                                <Layers size={14} /> Compare Specs
                              </button>
                              <button onClick={() => setSec1Mode('market')} className="w-full bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50 text-slate-700 hover:text-blue-700 py-2 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-sm">
                                <TrendingUp size={14} /> Market Analysis
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* MODE: COMPARE */}
                    {sec1Mode === 'compare' && (
                      <motion.div key="compare" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.2 }} className="w-full h-full flex flex-col">
                        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex-1 flex flex-col">
                          <h4 className="font-bold text-slate-900 font-helios mb-4 flex items-center gap-2"><Layers size={18} className="text-blue-600"/> Patent Specification Matrix</h4>
                          <div className="flex flex-col gap-2 flex-1">
                            {[
                              { label: 'Yield Efficiency', val: '88.4% Recovery Rate' },
                              { label: 'Feedstock', val: 'Molasses & Jaggery Scraps' },
                              { label: 'Licensing Stage', val: 'Non-Exclusive' },
                              { label: 'Development Time', val: '3 Months to Deploy' }
                            ].map((spec, i) => (
                              <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-slate-50/80 border border-slate-100">
                                <span className="text-xs font-semibold text-slate-600">{spec.label}</span>
                                <span className="text-xs font-bold text-slate-900 font-mono">{spec.val}</span>
                              </div>
                            ))}
                          </div>
                          <button onClick={() => setHasEntered(true)} className="mt-4 w-full py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors shadow-md">
                            Open Full Patent Details <ExternalLink size={14} />
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {/* MODE: MARKET (Custom animated bar chart) */}
                    {sec1Mode === 'market' && (
                      <motion.div key="market" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="w-full h-full flex flex-col">
                        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex-1 flex flex-col">
                          <h4 className="font-bold text-slate-900 font-helios mb-6 flex items-center gap-2"><TrendingUp size={18} className="text-emerald-600"/> Bio-Ethanol Market Sizing</h4>
                          
                          {/* Simulated Chart */}
                          <div className="flex-1 flex items-end justify-around gap-2 px-4 pb-6 border-b border-slate-100 relative">
                            {/* Grid Lines */}
                            <div className="absolute inset-0 flex flex-col justify-between pb-6 pointer-events-none">
                              <div className="w-full h-px bg-slate-100"></div>
                              <div className="w-full h-px bg-slate-100"></div>
                              <div className="w-full h-px bg-slate-100"></div>
                            </div>
                            
                            {/* Bars */}
                            <div className="relative flex flex-col items-center gap-2 z-10 w-full max-w-[80px]">
                              <span className="text-[10px] font-bold text-slate-600 bg-white px-1 relative z-20">SOM</span>
                              <motion.div initial={{ height: 0 }} animate={{ height: '30%' }} transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }} className="w-full bg-blue-400 rounded-t-lg shadow-sm" />
                              <span className="text-xs font-bold text-slate-900 font-mono absolute -bottom-6">$120M</span>
                            </div>
                            <div className="relative flex flex-col items-center gap-2 z-10 w-full max-w-[80px]">
                              <span className="text-[10px] font-bold text-slate-600 bg-white px-1 relative z-20">SAM</span>
                              <motion.div initial={{ height: 0 }} animate={{ height: '60%' }} transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }} className="w-full bg-blue-500 rounded-t-lg shadow-sm" />
                              <span className="text-xs font-bold text-slate-900 font-mono absolute -bottom-6">$480M</span>
                            </div>
                            <div className="relative flex flex-col items-center gap-2 z-10 w-full max-w-[80px]">
                              <span className="text-[10px] font-bold text-slate-600 bg-white px-1 relative z-20">TAM</span>
                              <motion.div initial={{ height: 0 }} animate={{ height: '95%' }} transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }} className="w-full bg-indigo-600 rounded-t-lg shadow-sm relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/20"></div>
                              </motion.div>
                              <span className="text-xs font-bold text-slate-900 font-mono absolute -bottom-6">$1.4B</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                {/* Chat Input Area */}
                {sec1Mode === 'chat' && (
                  <div className="bg-white p-4 border-t border-slate-200">
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-2 pl-4 flex items-center justify-between">
                      <span className="text-xs font-medium text-slate-400 font-montserrat">Type your next query...</span>
                      <button className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center hover:bg-blue-700 transition-colors">
                        <ArrowUp size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </motion.div>

      {/* ========================================================================= */}
      {/* SECTION 2: INSTRUMENTATION (ANALYZE) - Radar Map */}
      {/* ========================================================================= */}
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
                    institutions={mockInstitutions} 
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


      {/* ========================================================================= */}
      {/* SECTION 3: RESEARCHPRENEURSHIP (SCALE) - Texting Flow & Zero IP Leakage */}
      {/* ========================================================================= */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="bg-white/70 backdrop-blur-xl rounded-[32px] p-6 sm:p-10 lg:p-14 relative overflow-hidden border border-slate-200/60 shadow-[10px_10px_30px_#e2e8f0,-10px_-10px_30px_#ffffff]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* L: Copy & IP Zero Leakage */}
            <div className="lg:col-span-5 flex flex-col items-start text-left">
              <div className="bg-purple-50/80 px-4 py-2 rounded-xl mb-6 flex items-center gap-2.5 border border-purple-200/50 shadow-sm">
                <Lightbulb size={16} className="text-purple-700" />
                <span className="text-xs font-bold tracking-wider text-purple-800 uppercase font-helios">03 &bull; Scale</span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold font-helios text-slate-900 leading-tight mb-5">
                Turn a rough idea into a <br/>
                <span className="text-purple-600">real concept note.</span>
              </h2>
              <p className="text-slate-700 font-montserrat text-sm sm:text-base leading-relaxed mb-8 font-medium">
                Skip the blank documents. Have a guided conversation with Romi, and let it generate a complete, formatted application ready for KSUM incubation.
              </p>
              
              {/* HIGHLIGHT: Zero IP Leakage */}
              <div className="w-full p-6 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 text-white relative overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.2)] border border-slate-700">
                <div className="absolute top-0 right-0 p-4 opacity-10"><ShieldCheck size={100} /></div>
                <div className="flex items-center gap-3 mb-3 relative z-10">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 border border-emerald-500/30">
                    <ShieldCheck size={20} />
                  </div>
                  <h4 className="font-bold font-helios text-lg tracking-wide text-white">Zero IP Leakage</h4>
                </div>
                <p className="text-sm text-slate-300 font-montserrat leading-relaxed font-medium relative z-10">
                  Your ideas remain yours. 100% private local session memory. Pitch decks and draft proposals are never stored or trained on public LLMs.
                </p>
              </div>
            </div>

            {/* R: Texting Onboarding Flow */}
            <div className="lg:col-span-7 w-full">
              <div className="bg-slate-50/90 rounded-[28px] border border-slate-300 shadow-[inset_0_2px_10px_rgba(0,0,0,0.02),0_15px_35px_rgba(147,51,234,0.08)] flex flex-col overflow-hidden h-[500px]">
                
                {/* Onboarding Header & Progress Bar */}
                <div className="bg-white px-6 pt-5 pb-4 border-b border-slate-200 z-10 shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-bold text-slate-900 text-sm font-helios flex items-center gap-2">
                      <Lock size={16} className="text-purple-600" /> Proposal Builder
                    </h4>
                    <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200">
                      STEP {sec3Step + 1} OF {totalSteps}
                    </span>
                  </div>
                  {/* Sleek Progress Bar */}
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden flex gap-1">
                    {[...Array(totalSteps)].map((_, i) => (
                      <div key={i} className="flex-1 h-full rounded-full bg-slate-200 overflow-hidden relative">
                        <motion.div 
                          className="absolute inset-0 bg-purple-600"
                          initial={{ width: i < sec3Step ? '100%' : '0%' }}
                          animate={{ width: i <= sec3Step ? '100%' : '0%' }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Texting Flow Content */}
                <div className="flex-1 p-5 overflow-y-auto relative bg-[#f9fafc] flex flex-col justify-center">
                  <AnimatePresence mode="wait">
                    
                    {sec3Step === 0 && (
                      <motion.div key="step0" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col gap-4 w-full">
                        <div className="self-start max-w-[85%] bg-white border border-slate-200 p-4 rounded-2xl rounded-tl-sm shadow-sm">
                          <p className="text-sm font-semibold text-slate-800 font-montserrat">Let's build your pitch. First, what core problem are you solving?</p>
                        </div>
                        <div className="self-end max-w-[85%] bg-purple-600 text-white p-4 rounded-2xl rounded-tr-sm shadow-md">
                          <p className="text-sm font-medium font-montserrat leading-relaxed">Farmers lose 30% of pineapple yields to post-harvest rot. We need a way to upcycle this waste into something valuable.</p>
                        </div>
                      </motion.div>
                    )}

                    {sec3Step === 1 && (
                      <motion.div key="step1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col gap-4 w-full">
                        <div className="self-start max-w-[85%] bg-white border border-slate-200 p-4 rounded-2xl rounded-tl-sm shadow-sm">
                          <p className="text-sm font-semibold text-slate-800 font-montserrat">Great problem definition. What is your proprietary solution?</p>
                        </div>
                        <div className="self-end max-w-[85%] bg-purple-600 text-white p-4 rounded-2xl rounded-tr-sm shadow-md">
                          <p className="text-sm font-medium font-montserrat leading-relaxed">A low-cost enzymatic extraction process that produces commercial-grade bromelain with 94% purity.</p>
                        </div>
                      </motion.div>
                    )}

                    {sec3Step === 2 && (
                      <motion.div key="step2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col gap-4 w-full">
                        <div className="self-start max-w-[85%] bg-white border border-slate-200 p-4 rounded-2xl rounded-tl-sm shadow-sm">
                          <p className="text-sm font-semibold text-slate-800 font-montserrat">Noted. Who is the target market and how big is it?</p>
                        </div>
                        <div className="self-end max-w-[85%] bg-purple-600 text-white p-4 rounded-2xl rounded-tr-sm shadow-md">
                          <p className="text-sm font-medium font-montserrat leading-relaxed">Nutraceutical and cosmetic manufacturers in South India. The SAM is estimated at ₹480 Crores annually.</p>
                        </div>
                      </motion.div>
                    )}

                    {sec3Step === 3 && (
                      <motion.div key="step3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col gap-4 w-full">
                        <div className="self-start max-w-[85%] bg-white border border-slate-200 p-4 rounded-2xl rounded-tl-sm shadow-sm">
                          <p className="text-sm font-semibold text-slate-800 font-montserrat">Do you have any intellectual property or defensibility?</p>
                        </div>
                        <div className="self-end max-w-[85%] bg-purple-600 text-white p-4 rounded-2xl rounded-tr-sm shadow-md">
                          <p className="text-sm font-medium font-montserrat leading-relaxed">Yes, we filed a provisional patent for the temperature-stable extraction method last month.</p>
                        </div>
                      </motion.div>
                    )}

                    {/* Final Step: Export Button */}
                    {sec3Step === 4 && (
                      <motion.div key="step4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center h-full gap-6 w-full">
                        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shadow-inner relative">
                          <div className="absolute inset-0 rounded-full bg-emerald-400/20 animate-ping"></div>
                          <CheckCircle2 size={40} className="relative z-10" />
                        </div>
                        <div className="text-center">
                          <h3 className="font-bold text-xl text-slate-900 font-helios mb-2">Synthesis Complete</h3>
                          <p className="text-sm text-slate-600 font-medium font-montserrat max-w-xs mx-auto">Your KSUM incubation concept note has been generated and formatted perfectly.</p>
                        </div>
                        
                        <motion.button 
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setHasEntered(true)}
                          className="mt-4 bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold font-helios flex items-center gap-3 shadow-[0_10px_30px_rgba(0,0,0,0.2)] hover:bg-purple-700 transition-colors"
                        >
                          <Download size={20} />
                          Export KSUM Document (.docx)
                        </motion.button>
                      </motion.div>
                    )}

                  </AnimatePresence>
                </div>
              </div>
            </div>

          </div>
        </div>
      </motion.div>

    </div>
  );
}
