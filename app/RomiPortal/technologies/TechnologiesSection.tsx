//C:\Users\Akash Krishna\Downloads\RINK KSUM Website\app\RomiPortal\technologies\TechnologiesSection.tsx

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Zap, BarChart3, Database, Layers, TrendingUp, ExternalLink, ArrowUp } from 'lucide-react';
import { useState } from 'react';

interface TechnologiesSectionProps {
  setHasEntered: (val: boolean) => void;
}

export default function TechnologiesSection({ setHasEntered }: TechnologiesSectionProps) {
  const [sec1Mode, setSec1Mode] = useState<'chat' | 'compare' | 'market'>('chat');

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

          {/* L: Copy */}
          <div className="lg:col-span-5 flex flex-col items-start text-left">
            <div className="bg-blue-50/80 px-4 py-2 rounded-xl mb-6 flex items-center gap-2.5 border border-blue-200/50 shadow-sm">
              <Cpu size={16} className="text-blue-700" />
              <span className="text-xs font-bold tracking-wider text-blue-800 uppercase font-helios">01 &bull; Discover</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold font-helios text-slate-900 leading-tight mb-5">
              Ask like a person, <br />
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
              <div className="bg-white px-3 sm:px-5 py-3 sm:py-4 border-b border-slate-200 flex flex-row flex-wrap justify-between items-center z-10 shadow-sm gap-2">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold font-helios text-xs shadow-md shrink-0">R</div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs sm:text-sm font-helios leading-none whitespace-nowrap">ROMI AI</h4>
                    <span className="text-[9px] sm:text-[10px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-1 mt-0.5 sm:mt-1 whitespace-nowrap">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Active
                    </span>
                  </div>
                </div>
                <div className="flex gap-1 sm:gap-2">
                  <button onClick={() => setSec1Mode('chat')} className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl text-[10px] sm:text-xs font-bold transition-all whitespace-nowrap ${sec1Mode === 'chat' ? 'bg-blue-100 text-blue-800 border border-blue-200 shadow-inner' : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'}`}>Chat</button>
                  <button onClick={() => setSec1Mode('compare')} className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl text-[10px] sm:text-xs font-bold transition-all whitespace-nowrap ${sec1Mode === 'compare' ? 'bg-blue-100 text-blue-800 border border-blue-200 shadow-inner' : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'}`}>Compare</button>
                  <button onClick={() => setSec1Mode('market')} className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl text-[10px] sm:text-xs font-bold transition-all whitespace-nowrap ${sec1Mode === 'market' ? 'bg-blue-100 text-blue-800 border border-blue-200 shadow-inner' : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'}`}>Market</button>
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
                        <h4 className="font-bold text-slate-900 font-helios mb-4 flex items-center gap-2"><Layers size={18} className="text-blue-600" /> Patent Specification Matrix</h4>
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
                        <h4 className="font-bold text-slate-900 font-helios mb-6 flex items-center gap-2"><TrendingUp size={18} className="text-emerald-600" /> Bio-Ethanol Market Sizing</h4>

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
  );
}
