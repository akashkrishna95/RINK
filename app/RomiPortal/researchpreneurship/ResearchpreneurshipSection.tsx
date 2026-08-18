// C:\Users\Akash Krishna\Downloads\RINK KSUM Website\app\RomiPortal\researchpreneurship\ResearchpreneurshipSection.tsx

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, ShieldCheck, Lock, CheckCircle2, Download } from 'lucide-react';
import { useState, useEffect } from 'react';

interface ResearchpreneurshipSectionProps {
  setHasEntered: (val: boolean) => void;
}

export default function ResearchpreneurshipSection({ setHasEntered }: ResearchpreneurshipSectionProps) {
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
  }, [totalSteps]);

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

          {/* L: Copy & IP Zero Leakage */}
          <div className="lg:col-span-5 flex flex-col items-start text-left">
            <div className="bg-purple-50/80 px-4 py-2 rounded-xl mb-6 flex items-center gap-2.5 border border-purple-200/50 shadow-sm">
              <Lightbulb size={16} className="text-purple-700" />
              <span className="text-xs font-bold tracking-wider text-purple-800 uppercase font-helios">03 &bull; Scale</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold font-helios text-slate-900 leading-tight mb-5">
              Turn a rough idea into a <br />
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
  );
}
