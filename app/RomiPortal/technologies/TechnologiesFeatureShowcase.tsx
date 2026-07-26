'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Search, MessageSquare, BarChart3, ArrowRight, CheckCircle2, 
  ShieldCheck, Database, Layers, ExternalLink, Zap, RefreshCw, Cpu, 
  Check, ArrowUpRight, Scale, TrendingUp, BookOpen, Lightbulb, Users, Globe, Lock, Plus, ArrowUp, User, RotateCw
} from 'lucide-react';

export default function TechnologiesFeatureShowcase() {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [flippedCardId, setFlippedCardId] = useState<number | null>(null);
  
  // Sequential Animation Flags
  const [userText, setUserText] = useState<string>('');
  const [aiText, setAiText] = useState<string>('');
  const [isTypingUser, setIsTypingUser] = useState<boolean>(false);
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const [isTypingAi, setIsTypingAi] = useState<boolean>(false);
  const [aiDone, setAiDone] = useState<boolean>(false);
  const [showPyramid, setShowPyramid] = useState<boolean>(false);
  const [showBarGraph, setShowBarGraph] = useState<boolean>(false);

  // Autoplay States
  const [autoplayState, setAutoplayState] = useState<'playing' | 'done'>('playing');
  const [isStepComplete, setIsStepComplete] = useState<boolean>(false);
  // Helper to render text with highlighter formatting on **text**
  const highlightStyles = [
    "bg-amber-100/80 dark:bg-amber-950/40 text-amber-950 dark:text-amber-200",       // Yellow/Amber
    "bg-emerald-100/80 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200", // Emerald/Green
    "bg-rose-100/80 dark:bg-rose-950/40 text-rose-950 dark:text-rose-200",             // Rose/Pink
    "bg-blue-100/80 dark:bg-blue-950/40 text-blue-950 dark:text-blue-200",             // Blue
    "bg-violet-100/80 dark:bg-violet-950/40 text-violet-950 dark:text-violet-200"       // Violet/Purple
  ];

  const renderDescWithHighlights = (desc: string, colorIndex: number) => {
    const styleClass = highlightStyles[colorIndex % highlightStyles.length];
    const parts = desc.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <span 
            key={index} 
            className={`${styleClass} px-1 py-0.5 rounded font-semibold`}
          >
            {part.slice(2, -2)}
          </span>
        );
      }
      return part;
    });
  };


  // Dynamic prompts based on active step
  const stepPrompts = [
    {
      prompt: "I have a lot of jaggery waste from my sugar unit, is there anything that can turn it into something useful?",
      response: "Based on your query, ROMI AI retrieved verified bio-waste commercial technologies from Kerala's live catalogue. Top solutions include chemical-free liquid jaggery (RINK-100065) and organic powder jaggery (RINK-100066)."
    },
    {
      prompt: "can you compare all jaggery related technologies",
      response: "Here is the comprehensive side-by-side comparison table generated for all jaggery-related commercial technologies retrieved from ICAR repositories:"
    },
    {
      prompt: "Show me market analysis of jaggery production technologies in India ?",
      response: "The national jaggery production market is expected to reach $10.6B by 2025, growing at a CAGR of 11.4% from 2020 to 2025 "
    }
  ];

  const currentPromptObj = stepPrompts[activeStep] || stepPrompts[0];

  // Strict Sequential Animation Timeline:
  // 1. User prompt auto-types -> 2. Thinking indicator pulses -> 3. AI response auto-types -> 4. Cards/Pyramid/Table fade in -> 5. 5-Year Bar Chart grows sequentially
  useEffect(() => {
    let userTimer: NodeJS.Timeout;
    let aiTimer: NodeJS.Timeout;
    let thinkingTimeout: NodeJS.Timeout;
    let pyramidTimeout: NodeJS.Timeout;
    let barGraphTimeout: NodeJS.Timeout;
    let completionTimeout: NodeJS.Timeout;

    let userIdx = 0;
    let aiIdx = 0;
    
    // Reset all flags on step change
    setUserText('');
    setAiText('');
    setIsTypingUser(true);
    setIsThinking(false);
    setIsTypingAi(false);
    setAiDone(false);
    setShowPyramid(false);
    setShowBarGraph(false);
    setIsStepComplete(false);

    const targetPrompt = currentPromptObj.prompt;
    const targetResponse = currentPromptObj.response;

    // Phase 1: Type User Prompt
    userTimer = setInterval(() => {
      if (userIdx < targetPrompt.length) {
        setUserText(targetPrompt.slice(0, userIdx + 1));
        userIdx++;
      } else {
        clearInterval(userTimer);
        setIsTypingUser(false);
        setIsThinking(true);

        // Phase 2: Thinking state (600ms)
        thinkingTimeout = setTimeout(() => {
          setIsThinking(false);
          setIsTypingAi(true);

          // Phase 3: Type AI Response
          aiTimer = setInterval(() => {
            if (aiIdx < targetResponse.length) {
              setAiText(targetResponse.slice(0, aiIdx + 1));
              aiIdx += 2;
            } else {
              clearInterval(aiTimer);
              setIsTypingAi(false);
              setAiDone(true); // AI text finish signal!

              // Phase 4: Reveal Pyramid / Cards / Table after 200ms
              pyramidTimeout = setTimeout(() => {
                setShowPyramid(true);

                // Phase 5: Reveal 5-Year Bar Graph after 500ms (for Step 2)
                barGraphTimeout = setTimeout(() => {
                  setShowBarGraph(true);
                  
                  // Let the visual animation finish before marking step as completed
                  const completionDelay = activeStep === 2 ? 1100 : 0;
                  completionTimeout = setTimeout(() => {
                    setIsStepComplete(true);
                  }, completionDelay);
                }, 500);
              }, 200);
            }
          }, 18);
        }, 600);
      }
    }, 22);

    return () => {
      clearInterval(userTimer);
      if (aiTimer) clearInterval(aiTimer);
      if (thinkingTimeout) clearTimeout(thinkingTimeout);
      if (pyramidTimeout) clearTimeout(pyramidTimeout);
      if (barGraphTimeout) clearTimeout(barGraphTimeout);
      if (completionTimeout) clearTimeout(completionTimeout);
    };
  }, [activeStep]);

  // Autoplay transition logic
  useEffect(() => {
    if (autoplayState !== 'playing' || !isStepComplete) return;

    const transitionTimeout = setTimeout(() => {
      if (activeStep < 2) {
        setActiveStep((prev) => prev + 1);
      } else {
        // Go back to the beginning position
        setActiveStep(0);
        // Stop autoplay
        setAutoplayState('done');
      }
    }, 1500); // 1.5 seconds extra delay

    return () => {
      clearTimeout(transitionTimeout);
    };
  }, [isStepComplete, activeStep, autoplayState]);

  // STRICTLY 3 SUBCARDS TOTAL
  const steps = [
    { id: 0, num: "01", title: "1. Plain English Input", shortDesc: "Auto-typing query & natural search" },
    { id: 1, num: "02", title: "2. One-Tap Comparisons", shortDesc: "Apples-to-apples 10-criteria comparison table" },
    { id: 2, num: "03", title: "3. Live Market Intelligence", shortDesc: "TAM/SAM/SOM breakdown & 5-year graph" },
  ];

  // Comparison Data (Top 4 Jaggery Technologies)
  const comparisonData = [
    {
      id: "RINK-100065",
      name: "Liquid Jaggery Processing Without Any Chemical Additives",
      institution: "ICAR-Sugarcane Breeding Institute Research Centre, Kannur",
      sector: "Food Technology",
      type: "Process Technology",
      problem: "Liquid Jaggery Processing Without Any Chemical Additives"
    },
    {
      id: "RINK-100066",
      name: "Powder Jaggery Processing from Sugarcane Juice with Organic Clarificants",
      institution: "ICAR-Sugarcane Breeding Institute Research Centre, Kannur",
      sector: "Food Technology",
      type: "Process Technology",
      problem: "Need for stable and high-quality powdered jaggery products"
    },
    {
      id: "RINK-100068",
      name: "Ice Cream Preparation Using Sugarcane Syrup and Powder Jaggery",
      institution: "ICAR-Sugarcane Breeding Institute Research Centre, Kannur",
      sector: "Food Technology",
      type: "Value Added Food Product",
      problem: "Dependence on refined sugar in ice cream production"
    },
    {
      id: "RINK-100070",
      name: "Powder Jaggery-Based Fortified Cookies and Cakes",
      institution: "ICAR-Sugarcane Breeding Institute Research Centre, Kannur",
      sector: "Food Technology",
      type: "Functional Food Product",
      problem: "Dependence on refined sugar in bakery products"
    }
  ];

  // High-impact feature list with eye-capturing highlights
  const featuresRow1 = [
    {
      id: 1,
      icon: MessageSquare,
      title: "Understands Plain English",
      frontDesc: "No forms or rigid dropdowns — describe your need using **natural everyday language**.",
      backDesc: "ROMI's NLP interprets colloquial queries, extracts commercial intent, and maps directly to university indexes without manual tags.",
      badge: "NATURAL LANGUAGE"
    },
    {
      id: 2,
      icon: Database,
      title: "Live Institutional Search",
      frontDesc: "Indexes **160+ university technology libraries** & KSUM's **live database** in real-time.",
      backDesc: "Real-time search engine querying university IP catalogues, CUSAT, KAU, NIT Calicut, and KSUM research repositories.",
      badge: "REAL-TIME INDEX"
    },
    {
      id: 3,
      icon: ShieldCheck,
      title: "Zero Hallucinations",
      frontDesc: "Confirms ambiguous queries before answering, ensuring **verified, real-world data** only.",
      backDesc: "Strict verification logic checks catalog match scores before outputting IDs. If confidence is low, ROMI asks for clarification.",
      badge: "VERIFIED DATA"
    },
    {
      id: 4,
      icon: Zap,
      title: "Plain-Language TRL",
      frontDesc: "Translates TRL 1-9 into plain terms: **'Market-ready now'** vs. **'Early research phase'**.",
      backDesc: "Demystifies NASA/DoD Technology Readiness Levels into clear commercial terms so non-engineers grasp market timeline.",
      badge: "TRL TRANSLATED"
    },
    {
      id: 5,
      icon: Layers,
      title: "Clean Card Results",
      frontDesc: "Displays **5 initial cards**, expandable up to **10 without clutter** or endless scrolling.",
      backDesc: "Structured mini-card layouts presenting primary problem solved, developer institution, TRL status, and direct contact leads.",
      badge: "5 TO 10 CARDS"
    },
    {
      id: 6,
      icon: TrendingUp,
      title: "Live Market Intelligence",
      frontDesc: "Calculates real-world **TAM/SAM/SOM** figures with **clickable source citations** attached.",
      backDesc: "Dynamic market pyramid modeling addressable volume for Kerala, India, and global sectors, backed by real-time web citations.",
      badge: "SOURCE-LINKED"
    }
  ];

  const featuresRow2 = [
    {
      id: 7,
      icon: Scale,
      title: "One-Tap Comparison Tables",
      frontDesc: "Generates **side-by-side tables** comparing **10 criteria instantly** upon request.",
      backDesc: "Automatically standardizes criteria across multiple selected technologies into unified side-by-side matrices.",
      badge: "INSTANT TABLES"
    },
    {
      id: 8,
      icon: RefreshCw,
      title: "Conversational Memory",
      frontDesc: "Remembers previous turns so you can refer back to **'the second option'** seamlessly.",
      backDesc: "Persists contextual session memory in local IndexedDB so follow-up queries reference previous choices without re-explaining.",
      badge: "CONTEXT AWARE"
    },
    {
      id: 9,
      icon: Lightbulb,
      title: "Smart Sector Browsing",
      frontDesc: "Suggests **real sub-categories** pulled from the catalogue when exploring broad topics.",
      backDesc: "Analyzes catalogue density to offer verified sub-topic directions (e.g. Bio-polymers vs. Food Tech) instead of guesswork.",
      badge: "SMART BROWSING"
    },
    {
      id: 10,
      icon: Lock,
      title: "Confidential & IP Safe",
      frontDesc: "Respects **patent boundaries** and connects you **directly to licensing institution** leads.",
      backDesc: "Filters out sensitive unfiled patent disclosures while providing direct institutional liaison routing for NDA requests.",
      badge: "IP PROTECTED"
    },
    {
      id: 11,
      icon: Globe,
      title: "Always-Current Catalogue",
      frontDesc: "Periodically synced with **Kerala Startup Mission's** live database schedule.",
      backDesc: "Automated cron sync maintains up-to-the-minute alignment with KSUM's RINK licensing portal and institutional additions.",
      badge: "LIVE SYNC"
    },
    {
      id: 12,
      icon: CheckCircle2,
      title: "One-Tap Follow-Ups",
      frontDesc: "Suggests **natural next questions** at every turn so your research **never stalls**.",
      backDesc: "Context-aware prompt pills generated after every assistant turn enable effortless 1-tap navigation.",
      badge: "INSTANT NEXT STEPS"
    }
  ];

  return (
    <section className="py-16 px-1 sm:px-4 md:px-8 max-w-7xl mx-auto w-full flex flex-col items-center">
      {/* PURE CSS GPU-ACCELERATED MARQUEE STYLES (0-JIGGLE SMOOTH FOR 4GB/6GB MOBILE PHONES) */}
      <style>{`
        @keyframes smoothMarqueeLeft {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        @keyframes smoothMarqueeRight {
          0% { transform: translate3d(-50%, 0, 0); }
          100% { transform: translate3d(0, 0, 0); }
        }
        .gpu-marquee-left {
          display: flex;
          gap: 1rem;
          width: max-content;
          animation: smoothMarqueeLeft 40s linear infinite;
          will-change: transform;
          transform: translate3d(0, 0, 0);
          backface-visibility: hidden;
          perspective: 1000px;
        }
        .gpu-marquee-right {
          display: flex;
          gap: 1rem;
          width: max-content;
          animation: smoothMarqueeRight 40s linear infinite;
          will-change: transform;
          transform: translate3d(0, 0, 0);
          backface-visibility: hidden;
          perspective: 1000px;
        }
        .gpu-marquee-container:hover .gpu-marquee-left,
        .gpu-marquee-container:hover .gpu-marquee-right {
          animation-play-state: paused !important;
        }
      `}</style>

      {/* SECTION HEADER */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-10 max-w-3xl mx-auto"
      >
        <h2 className="text-center text-[24px] xs:text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-helios text-gray-900 dark:text-zinc-100 mb-4 tracking-tight leading-tight">
          <span className="block">Describe your idea.</span>
          <span className="block text-[#1b60bb] dark:text-[#7dd3fc] whitespace-nowrap">ROMI does the digging.</span>
        </h2>
        <p className="text-gray-600 dark:text-zinc-400 font-montserrat text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
          Just type what's on your mind. ROMI AI instantly matches your query against university catalogues, market size data, and patent filings.
        </p>
      </motion.div>

      {/* INTERACTIVE CHAT SHOWCASE WORKSPACE */}
      <div className="w-full bg-[#eae7dc]/40 dark:bg-zinc-900/60 border border-gray-200/80 dark:border-zinc-800 rounded-3xl p-2 sm:p-4 md:p-6 shadow-xl mb-14 overflow-hidden relative">
        
        {/* TOP TAB CONTROLS (EXACTLY 3 SUBCARDS TOTAL) */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 mb-5">
          {steps.map((step, index) => {
            const isActive = activeStep === step.id;
            return (
              <button
                key={step.id}
                type="button"
                onClick={() => {
                  setAutoplayState('done');
                  setActiveStep(step.id);
                }}
                className={`p-3 rounded-xl border text-left transition-all duration-300 cursor-pointer relative overflow-hidden ${
                  index === 2 ? 'col-span-2 md:col-span-1' : 'col-span-1'
                } ${
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

        {/* CHAT WINDOW SIMULATION */}
        <div className="bg-white/90 dark:bg-zinc-950/90 border border-gray-200/80 dark:border-zinc-800 rounded-2xl p-2.5 sm:p-4 md:p-5 shadow-inner min-h-[340px] sm:min-h-[370px] flex flex-col justify-between relative backdrop-blur-md">
          
          {/* HEADER BAR INSIDE CHAT */}
          <div className="flex flex-row flex-wrap items-center justify-between pb-2.5 border-b border-gray-100 dark:border-zinc-800/80 mb-3 gap-2">
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <span className="text-xs font-bold text-gray-700 dark:text-zinc-300 font-helios flex items-center gap-1.5 whitespace-nowrap">
                ROMI AI
              </span>
              <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-wider bg-blue-50 dark:bg-blue-950/50 text-[#1b60bb] dark:text-blue-400 border border-blue-200/60 dark:border-blue-900/40 px-1.5 sm:px-2 py-0.5 rounded-full flex items-center gap-1 whitespace-nowrap">
                <Lightbulb size={9} /> TECHNOLOGIES
              </span>
            </div>
            <span className="text-[9px] sm:text-[10px] font-mono text-gray-400 whitespace-nowrap">Live Indexing Mode</span>
          </div>

          {/* CHAT MESSAGES STREAM */}
          <div className="flex flex-col gap-3.5 flex-1 overflow-y-auto mb-3 pr-1">
            
            {/* PHASE 1: USER MESSAGE BUBBLE */}
            <div className="flex gap-2 max-w-3xl ml-auto flex-row-reverse items-start">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#1b60bb] text-white flex items-center justify-center shrink-0 shadow-xs">
                <User size={14} />
              </div>
              <div className="p-2.5 sm:p-3.5 rounded-2xl rounded-tr-xs bg-[#1b60bb] text-white dark:bg-[#1b60bb] shadow-md text-[11px] sm:text-xs leading-relaxed font-sans relative">
                <span>{userText}</span>
                {isTypingUser && <span className="inline-block w-1.5 h-3.5 bg-white ml-1 animate-pulse" />}
              </div>
            </div>

            {/* PHASE 2: THINKING INDICATOR */}
            {isThinking && (
              <div className="flex gap-2.5 max-w-3xl mr-auto items-center">
                <img src="/romi-avatar.png" alt="Romi" className="w-7 h-7 object-contain shrink-0" />
                <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-full px-3.5 py-1.5 shadow-sm flex items-center gap-2 text-[10px] sm:text-xs text-gray-600 dark:text-zinc-400 font-sans">
                  <div className="w-2 h-2 rounded-full bg-[#1b60bb] animate-ping" />
                  <span>Romi is searching Kerala's live technology catalogue...</span>
                </div>
              </div>
            )}

            {/* PHASE 3: AI ASSISTANT MESSAGE STREAM WITH HIGHLIGHTED TERMS */}
            {(aiText || isTypingAi || aiDone) && (
              <div className={`flex gap-2.5 mr-auto items-start w-full ${activeStep === 0 ? 'max-w-3xl' : 'w-full'}`}>
                <img src="/romi-avatar.png" alt="Romi" className="w-7 h-7 sm:w-9 sm:h-9 object-contain shrink-0 mt-0.5" />
                <div className="text-[11px] sm:text-xs text-gray-800 dark:text-zinc-200 flex-1 min-w-0 font-sans leading-relaxed w-full">
                  
                  {/* Clean Text Stream */}
                  <div className="whitespace-pre-line mb-3 font-normal text-gray-800 dark:text-zinc-200 leading-relaxed text-[11px] sm:text-xs">
                    {aiText}
                    {isTypingAi && <span className="inline-block w-1.5 h-3.5 bg-[#1b60bb] dark:bg-blue-400 ml-1 animate-pulse" />}
                  </div>

                  {/* PHASE 4: STEP 0 MINI CARDS (WITH EYE-CAPTURING KEYWORD HIGHLIGHTS) */}
                  {activeStep === 0 && showPyramid && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                      className="flex flex-col gap-2.5 my-2.5"
                    >
                      {/* CARD 1 */}
                      <div className="border border-emerald-500/70 dark:border-emerald-400/60 bg-emerald-50/10 dark:bg-emerald-950/20 rounded-lg sm:rounded-2xl p-2 sm:p-3.5 shadow-xs flex flex-row gap-2 sm:gap-3.5 items-start relative group hover:shadow-md transition-all">
                        <div className="w-11 h-11 sm:w-20 sm:h-20 rounded-md sm:rounded-xl overflow-hidden shrink-0 bg-gray-100 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700">
                          <img 
                            src="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=80" 
                            alt="Liquid Jaggery Processing" 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-1 sm:gap-1.5 mb-0.5">
                            <h4 className="font-helios font-bold text-[11px] sm:text-[13px] text-gray-900 dark:text-zinc-100 group-hover:text-[#1b60bb] dark:group-hover:text-[#7dd3fc] transition-colors leading-snug">
                              Liquid Jaggery Processing Without Any Chemical Additives
                            </h4>
                            <ArrowUpRight size={11} className="text-gray-400 shrink-0 group-hover:text-[#1b60bb] group-hover:translate-x-0.5 transition-transform mt-0.5" />
                          </div>
                          <span className="text-[8.5px] sm:text-[10px] text-gray-500 dark:text-zinc-400 font-semibold block mb-0.5 sm:mb-1 flex items-center gap-1">
                            🏛️ ICAR-Sugarcane Breeding Institute Research Centre, Kannur
                          </span>
                          <p className="text-[9.5px] sm:text-[11px] text-gray-600 dark:text-zinc-400 font-sans leading-snug line-clamp-2 mb-1.5 sm:mb-2">
                            This process enables the production of <strong className="text-[#1b60bb] dark:text-blue-400 font-semibold bg-blue-50/80 dark:bg-blue-950/40 px-1 py-0.5 rounded">liquid jaggery</strong> without <strong className="text-emerald-700 dark:text-emerald-400 font-semibold">chemical additives</strong> or preservatives.
                          </p>
                          <div className="flex flex-wrap items-center gap-1 font-mono text-[7.5px] sm:text-[9px]">
                            <span className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200/50 px-1.5 py-0.5 rounded-sm sm:rounded font-bold">
                              ID: RINK-100065
                            </span>
                            <span className="bg-green-500/10 text-green-600 dark:text-green-400 border border-green-200/50 px-1.5 py-0.5 rounded-sm sm:rounded font-bold">
                              TRL 7: Market Ready
                            </span>
                            <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200/50 px-1.5 py-0.5 rounded-sm sm:rounded font-bold">
                              Patent: Filed
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* CARD 2 */}
                      <div className="border border-emerald-500/70 dark:border-emerald-400/60 bg-emerald-50/10 dark:bg-emerald-950/20 rounded-lg sm:rounded-2xl p-2 sm:p-3.5 shadow-xs flex flex-row gap-2 sm:gap-3.5 items-start relative group hover:shadow-md transition-all">
                        <div className="w-11 h-11 sm:w-20 sm:h-20 rounded-md sm:rounded-xl overflow-hidden shrink-0 bg-gray-100 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700">
                          <img 
                            src="https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=300&auto=format&fit=crop&q=80" 
                            alt="Powder Jaggery Processing" 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-1 sm:gap-1.5 mb-0.5">
                            <h4 className="font-helios font-bold text-[11px] sm:text-[13px] text-gray-900 dark:text-zinc-100 group-hover:text-[#1b60bb] dark:group-hover:text-[#7dd3fc] transition-colors leading-snug">
                              Powder Jaggery Processing from Sugarcane Juice with Organic Clarificants
                            </h4>
                            <ArrowUpRight size={11} className="text-gray-400 shrink-0 group-hover:text-[#1b60bb] group-hover:translate-x-0.5 transition-transform mt-0.5" />
                          </div>
                          <span className="text-[8.5px] sm:text-[10px] text-gray-500 dark:text-zinc-400 font-semibold block mb-0.5 sm:mb-1 flex items-center gap-1">
                            🏛️ ICAR-Sugarcane Breeding Institute Research Centre, Kannur
                          </span>
                          <p className="text-[9.5px] sm:text-[11px] text-gray-600 dark:text-zinc-400 font-sans leading-snug line-clamp-2 mb-1.5 sm:mb-2">
                            This technology produces <strong className="text-[#1b60bb] dark:text-blue-400 font-semibold bg-blue-50/80 dark:bg-blue-950/40 px-1 py-0.5 rounded">powder jaggery</strong> by reducing water content using <strong className="text-emerald-700 dark:text-emerald-400 font-semibold">organic clarificants</strong>.
                          </p>
                          <div className="flex flex-wrap items-center gap-1 font-mono text-[7.5px] sm:text-[9px]">
                            <span className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200/50 px-1.5 py-0.5 rounded-sm sm:rounded font-bold">
                              ID: RINK-100066
                            </span>
                            <span className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200/50 px-1.5 py-0.5 rounded-sm sm:rounded font-bold">
                              TRL 8: Production Ready
                            </span>
                            <span className="bg-green-500/10 text-green-600 dark:text-green-400 border border-green-200/50 px-1.5 py-0.5 rounded-sm sm:rounded font-bold">
                              Patent: Open License
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* PHASE 4 & 5: STEP 2 LIVE MARKET INTELLIGENCE */}
                  {activeStep === 2 && (
                    <div className="mt-3 flex flex-col gap-4">
                      
                      {/* MINI SOURCES CITATIONS BLOCK */}
                      {showPyramid && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4 }}
                          className="bg-white/80 dark:bg-zinc-900/80 border border-gray-200/80 dark:border-zinc-800 rounded-2xl p-3 shadow-xs flex flex-col gap-2 font-mono text-[10px] sm:text-[11px]"
                        >
                          {/* SEARCH QUERY CAPTION */}
                          <div className="flex items-start gap-1.5 leading-relaxed text-gray-500 dark:text-zinc-400 bg-gray-50/70 dark:bg-zinc-950/60 p-2 rounded-xl border border-gray-150 dark:border-zinc-800">
                            <Search size={12} className="shrink-0 mt-0.5 text-gray-400" />
                            <span>
                              Results for: &quot;<strong className="text-gray-800 dark:text-zinc-200 font-semibold">market analysis jaggery waste sugarcane processing market size India CAGR</strong>, sugarcane jaggery bio-waste market size India CAGR&quot;
                            </span>
                          </div>

                          {/* HORIZONTAL SOURCE PILLS */}
                          <div className="flex flex-wrap items-center gap-2 pt-0.5">
                            <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 px-3 py-1 rounded-full shadow-2xs flex items-center gap-1.5 font-sans font-bold text-gray-700 dark:text-zinc-200 text-xs">
                              <div className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[9px] font-mono">m</div>
                              <span>moneycontrol.com</span>
                            </div>
                            <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 px-3 py-1 rounded-full shadow-2xs flex items-center gap-1.5 font-sans font-bold text-gray-700 dark:text-zinc-200 text-xs">
                              <div className="w-4 h-4 rounded-full bg-purple-600 text-white flex items-center justify-center text-[9px] font-mono">m</div>
                              <span>marketsmithindia...</span>
                            </div>
                            <button
                              type="button"
                              className="bg-gray-100/90 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-[#1b60bb] dark:text-blue-400 px-3 py-1 rounded-full shadow-2xs flex items-center gap-1.5 font-sans font-bold text-xs hover:bg-gray-200/80 transition-colors"
                            >
                              <BookOpen size={12} />
                              <span>View all (6)</span>
                            </button>
                          </div>
                        </motion.div>
                      )}

                      {/* PYRAMID BREAKDOWN */}
                      {showPyramid && (
                        <motion.div
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5 }}
                          className="bg-white dark:bg-zinc-900 border border-gray-200/80 dark:border-zinc-800 rounded-3xl p-4 sm:p-6 shadow-sm flex flex-col gap-5"
                        >
                          {/* HEADER ROW */}
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-gray-100 dark:border-zinc-800">
                            <div className="flex items-center gap-2">
                              <span className="bg-blue-50 dark:bg-blue-950/60 text-[#1b60bb] dark:text-blue-400 border border-blue-100 dark:border-blue-900/50 text-[11px] font-bold px-2.5 py-1 rounded-md font-helios">
                                ROMI's Analysis
                              </span>
                              <span className="text-xs text-gray-500 font-sans">Analyzed <strong className="text-gray-800 dark:text-zinc-200 font-semibold">3 Full Pages</strong></span>
                            </div>
                            <span className="text-[10px] text-gray-400 font-montserrat">
                              KSUM is not liable for your decisions based on AI responses.
                            </span>
                          </div>

                          {/* MARKET SIZING BREAKDOWN */}
                          <div className="bg-[#FAF9F5]/80 dark:bg-zinc-950/50 border border-gray-150 dark:border-zinc-800 rounded-3xl p-4 sm:p-6 flex flex-col items-center gap-3 w-full">
                            <h4 className="text-xs font-bold font-helios uppercase tracking-wider text-gray-400 dark:text-zinc-500 text-center mb-1">
                              MARKET SIZING BREAKDOWN
                            </h4>

                            {/* Stacked Proportional Chart Blocks */}
                            <div className="relative w-full max-w-[180px] sm:max-w-[240px] flex flex-col items-center justify-end group cursor-pointer my-3">
                              {/* SOM */}
                              <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: 0.1 }}
                                className="w-1/2 h-9 sm:h-11 bg-[#1b60bb] rounded-t-lg sm:rounded-t-xl border-b border-white/20 flex items-center justify-center text-white font-medium text-[10px] sm:text-xs tracking-wide transition-all hover:bg-indigo-700 shadow-sm z-30 relative"
                              >
                                SOM $233M
                              </motion.div>

                              {/* SAM */}
                              <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: 0.2 }}
                                className="w-3/4 h-9 sm:h-11 bg-blue-300 rounded-t-md sm:rounded-t-lg border-b border-white/40 flex items-center justify-center text-blue-900 font-medium text-[10px] sm:text-xs tracking-wide transition-all hover:bg-blue-400 shadow-sm z-20 relative"
                              >
                                SAM $1.40B
                              </motion.div>

                              {/* TAM */}
                              <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: 0.3 }}
                                className="w-full h-9 sm:h-11 bg-blue-100 rounded-b-lg sm:rounded-b-xl border border-blue-200/40 flex items-center justify-center text-blue-800 font-medium text-[10px] sm:text-xs tracking-wide transition-all hover:bg-blue-200 shadow-sm z-10 relative"
                              >
                                TAM $4.15T
                              </motion.div>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* 5-YEAR BAR GRAPH */}
                      {showBarGraph && (
                        <motion.div
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5 }}
                          className="bg-white dark:bg-zinc-900 border border-gray-200/80 dark:border-zinc-800 rounded-3xl p-4 sm:p-6 shadow-sm flex flex-col items-center w-full"
                        >
                          <h4 className="text-xs font-bold font-helios uppercase tracking-wider text-gray-400 dark:text-zinc-500 text-center mb-6">
                            MARKET GROWTH PROJECTION
                          </h4>

                          <div className="w-full max-w-xl mx-auto flex flex-col gap-2">
                            <div className="h-44 sm:h-52 w-full flex items-end justify-between gap-1 sm:gap-4 px-1 sm:px-6">
                              
                              {/* YEAR 1: 2022 */}
                              <div className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                                <motion.span 
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ delay: 0.1 }}
                                  className="font-helios font-bold text-[9px] sm:text-xs text-[#1b60bb] dark:text-blue-400"
                                >
                                  $1.40B
                                </motion.span>
                                <motion.div 
                                  initial={{ height: 0 }}
                                  animate={{ height: '70%' }}
                                  transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
                                  className="w-full bg-[#68a3e5] dark:bg-blue-500 rounded-t-xl hover:brightness-110 shadow-xs" 
                                />
                              </div>

                              {/* YEAR 2: 2023 */}
                              <div className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                                <motion.span 
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ delay: 0.2 }}
                                  className="font-helios font-bold text-[9px] sm:text-xs text-[#1b60bb] dark:text-blue-400"
                                >
                                  $1.42B
                                </motion.span>
                                <motion.div 
                                  initial={{ height: 0 }}
                                  animate={{ height: '76%' }}
                                  transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
                                  className="w-full bg-[#5295ff] dark:bg-blue-500 rounded-t-xl hover:brightness-110 shadow-xs" 
                                />
                              </div>

                              {/* YEAR 3: 2024 */}
                              <div className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                                <motion.span 
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ delay: 0.3 }}
                                  className="font-helios font-bold text-[9px] sm:text-xs text-[#1b60bb] dark:text-blue-400"
                                >
                                  $1.44B
                                </motion.span>
                                <motion.div 
                                  initial={{ height: 0 }}
                                  animate={{ height: '82%' }}
                                  transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
                                  className="w-full bg-[#3684ff] dark:bg-blue-600 rounded-t-xl hover:brightness-110 shadow-xs" 
                                />
                              </div>

                              {/* YEAR 4: 2025 */}
                              <div className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                                <motion.span 
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ delay: 0.4 }}
                                  className="font-helios font-bold text-[9px] sm:text-xs text-[#1b60bb] dark:text-blue-400"
                                >
                                  $1.46B
                                </motion.span>
                                <motion.div 
                                  initial={{ height: 0 }}
                                  animate={{ height: '89%' }}
                                  transition={{ duration: 0.6, delay: 0.4, ease: 'easeOut' }}
                                  className="w-full bg-[#1b60bb] dark:bg-blue-600 rounded-t-xl hover:brightness-110 shadow-xs" 
                                />
                              </div>

                              {/* YEAR 5: 2026 */}
                              <div className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                                <motion.span 
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ delay: 0.5 }}
                                  className="font-helios font-bold text-[9px] sm:text-xs text-[#0052cc] dark:text-blue-300"
                                >
                                  $1.48B
                                </motion.span>
                                <motion.div 
                                  initial={{ height: 0 }}
                                  animate={{ height: '96%' }}
                                  transition={{ duration: 0.6, delay: 0.5, ease: 'easeOut' }}
                                  className="w-full bg-[#0052cc] dark:bg-blue-500 rounded-t-xl hover:brightness-110 shadow-md" 
                                />
                              </div>

                            </div>

                            <div className="w-full border-t border-gray-200 dark:border-zinc-700 pt-2 flex justify-between px-1 sm:px-6">
                              <span className="flex-1 text-center font-montserrat text-[9px] sm:text-xs text-gray-500 font-semibold">2022</span>
                              <span className="flex-1 text-center font-montserrat text-[9px] sm:text-xs text-gray-500 font-semibold">2023</span>
                              <span className="flex-1 text-center font-montserrat text-[9px] sm:text-xs text-gray-500 font-semibold">2024</span>
                              <span className="flex-1 text-center font-montserrat text-[9px] sm:text-xs text-gray-500 font-semibold">2025</span>
                              <span className="flex-1 text-center font-montserrat text-[9px] sm:text-xs font-bold text-gray-800 dark:text-zinc-200">2026</span>
                            </div>
                          </div>
                        </motion.div>
                      )}

                    </div>
                  )}

                  {/* PHASE 4: STEP 1 ONE-TAP COMPARISONS */}
                  {activeStep === 1 && showPyramid && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                      className="mt-3 overflow-x-auto rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm w-full"
                    >
                      <table className="w-full min-w-[760px] text-left text-xs font-sans border-collapse">
                        <thead>
                          <tr className="bg-[#f4f7fa] dark:bg-zinc-800 text-[#1b60bb] dark:text-blue-400 font-helios font-bold text-[11px] sm:text-xs">
                            <th className="p-3.5 border-b border-gray-200 dark:border-zinc-700 whitespace-nowrap min-w-[110px]">Technology ID</th>
                            <th className="p-3.5 border-b border-gray-200 dark:border-zinc-700 min-w-[220px]">Technology Name</th>
                            <th className="p-3.5 border-b border-gray-200 dark:border-zinc-700 min-w-[200px]">Institution</th>
                            <th className="p-3.5 border-b border-gray-200 dark:border-zinc-700 whitespace-nowrap min-w-[130px]">Primary Sector</th>
                            <th className="p-3.5 border-b border-gray-200 dark:border-zinc-700 whitespace-nowrap min-w-[150px]">Technology Type</th>
                            <th className="p-3.5 border-b border-gray-200 dark:border-zinc-700 min-w-[220px]">Problem Solved</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-zinc-800 text-[11px] sm:text-xs text-gray-700 dark:text-zinc-300">
                          {comparisonData.map((item, idx) => (
                            <tr key={idx} className="hover:bg-blue-50/40 dark:hover:bg-zinc-800/50 transition-colors">
                              <td className="p-3.5 font-mono font-bold text-[#1b60bb] dark:text-blue-400 whitespace-nowrap">{item.id}</td>
                              <td className="p-3.5 font-semibold text-gray-900 dark:text-zinc-100">{item.name}</td>
                              <td className="p-3.5 text-gray-600 dark:text-zinc-400">{item.institution}</td>
                              <td className="p-3.5 whitespace-nowrap">{item.sector}</td>
                              <td className="p-3.5 whitespace-nowrap">{item.type}</td>
                              <td className="p-3.5 text-gray-600 dark:text-zinc-400">{item.problem}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </motion.div>
                  )}

                </div>
              </div>
            )}

          </div>

        </div>
      </div>

      {/* SPACE-CONSERVING 0-JIGGLE GPU-ACCELERATED DUAL MARQUEE CAROUSEL WITH 3D FLIP CARDS */}
      <div className="w-full">
        <div className="text-center mb-8">
          <h3 className="text-2xl md:text-4xl font-bold font-helios text-gray-900 dark:text-zinc-100 mb-2">
            Everything Technologies Can Do For You
          </h3>
          <p className="text-gray-500 dark:text-zinc-400 font-montserrat text-xs sm:text-sm max-w-xl mx-auto flex items-center justify-center gap-1.5">
            <span>Discover verified capabilities built directly into Kerala's technology catalog</span>
          </p>
        </div>

        {/* DUAL-ROW GPU MARQUEE CAROUSEL CONTAINER (HARDWARE ACCELERATED 60FPS) */}
        <div 
          className={`flex flex-col gap-4 overflow-hidden py-2 relative gpu-marquee-container ${isPaused ? 'marquee-paused' : ''}`}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* FADE GRADIENT OVERLAYS */}
          <div className="absolute top-0 bottom-0 left-0 w-12 sm:w-20 bg-gradient-to-r from-white dark:from-zinc-950 to-transparent z-10 pointer-events-none" />
          <div className="absolute top-0 bottom-0 right-0 w-12 sm:w-20 bg-gradient-to-l from-white dark:from-zinc-950 to-transparent z-10 pointer-events-none" />

          {/* ROW 1: GPU-ACCELERATED MARQUEE MOVING LEFT */}
          <div className="gpu-marquee-left">
            {[...featuresRow1, ...featuresRow1].map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={`r1-${idx}`}
                  className="w-[280px] sm:w-[320px] h-[155px] bg-white dark:bg-zinc-900 border border-gray-200/80 dark:border-zinc-800 rounded-2xl p-4 flex flex-col justify-between shadow-sm hover:shadow-md transition-all shrink-0 cursor-default group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-[#1b60bb] dark:text-blue-400 flex items-center justify-center border border-blue-100 dark:border-blue-900/30 group-hover:scale-105 transition-transform">
                        <Icon size={18} />
                      </div>
                      <span className="text-[9px] font-bold font-mono uppercase tracking-wider text-gray-400 dark:text-zinc-500 bg-gray-50 dark:bg-zinc-800 px-2 py-0.5 rounded border border-gray-150 dark:border-zinc-700">
                        {feat.badge}
                      </span>
                    </div>
                    <h4 className="font-helios font-bold text-xs sm:text-sm text-gray-900 dark:text-zinc-100 mb-1.5 group-hover:text-[#1b60bb] dark:group-hover:text-blue-400 transition-colors">
                      {feat.title}
                    </h4>
                    <p className="text-[11px] text-gray-600 dark:text-zinc-400 font-sans leading-relaxed">
                      {renderDescWithHighlights(feat.frontDesc, feat.id - 1)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ROW 2: GPU-ACCELERATED MARQUEE MOVING RIGHT */}
          <div className="gpu-marquee-right">
            {[...featuresRow2, ...featuresRow2].map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={`r2-${idx}`}
                  className="w-[280px] sm:w-[320px] h-[155px] bg-white dark:bg-zinc-900 border border-gray-200/80 dark:border-zinc-800 rounded-2xl p-4 flex flex-col justify-between shadow-sm hover:shadow-md transition-all shrink-0 cursor-default group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-[#1b60bb] dark:text-blue-400 flex items-center justify-center border border-blue-100 dark:border-blue-900/30 group-hover:scale-105 transition-transform">
                        <Icon size={18} />
                      </div>
                      <span className="text-[9px] font-bold font-mono uppercase tracking-wider text-gray-400 dark:text-zinc-500 bg-gray-50 dark:bg-zinc-800 px-2 py-0.5 rounded border border-gray-150 dark:border-zinc-700">
                        {feat.badge}
                      </span>
                    </div>
                    <h4 className="font-helios font-bold text-xs sm:text-sm text-gray-900 dark:text-zinc-100 mb-1.5 group-hover:text-[#1b60bb] dark:group-hover:text-blue-400 transition-colors">
                      {feat.title}
                    </h4>
                    <p className="text-[11px] text-gray-600 dark:text-zinc-400 font-sans leading-relaxed">
                      {renderDescWithHighlights(feat.frontDesc, feat.id - 1)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
