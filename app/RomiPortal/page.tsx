//C:\Users\Akash Krishna\Downloads\RINK KSUM Website\app\RomiPortal\page.tsx

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp, Mic, BarChart3, Search, Lightbulb, Zap, Filter, Database, TrendingUp, User, Check, X as CloseIcon, ArrowRight, Scale, Users, Shield, Plus, Cpu, Wrench } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect, Fragment } from 'react';
import RomiPortalLayout from './RomiPortalLayout';
import Navbar from '@/HomePage/Navbar';
import Footer from '@/HomePage/Footer';
import TechnologiesFeatureShowcase from './technologies/TechnologiesFeatureShowcase';
import InstrumentationStoryShowcase from './instrumentation/InstrumentationStoryShowcase';

const tabs = ['search', 'technologies', 'instrumentation', 'researchpreneurship'];



// Dynamic Placeholders tied to tabs
const tabPlaceholders: Record<string, string> = {
  search: "Say Hi to explore more...",
  technologies: "Find ready-to-license drone mapping and IoT technologies...",
  instrumentation: "Find ready-to-use high-precision scientific instrumentation...",
  researchpreneurship: "Assess my robotics research idea for commercialization..."
};

const comparisonRows = [
  {
    feature: "IP Search",
    romi: "Indexes 160+ university tech libraries dynamically.",
    other: "Offline static training data; no local library access."
  },
  {
    feature: "Market Value",
    romi: "Generates live TAM/SAM/SOM charts with web sources.",
    other: "Static general estimates prone to hallucinations."
  },
  {
    feature: "Patent Scan",
    romi: "Semantic screening of research abstracts vs global patents.",
    other: "Frequent citation errors and history hallucinations."
  },
  {
    feature: "KSUM Link",
    romi: "Auto-routes concepts directly to incubation programs.",
    other: "Isolated text box; no connection to local networks."
  },
  {
    feature: "IP Privacy",
    romi: "Keeps ideas secure with zero-trust local storage.",
    other: "Uploads inputs to public clouds, risking leaks."
  },
  {
    feature: "Incubator Docs",
    romi: "Single-click export of KSUM Word diagnostics (.docx).",
    other: "Outputs unformatted raw text requiring manual layout."
  }
];

// Animation Variants for Staggered Children
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 100, damping: 20 }
  }
};

export default function RomiPortalPage() {
  const [hasEntered, setHasEntered] = useState(false);
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState('search');


  // Listen to custom reset event from Navbar clicks and preload hero images
  useEffect(() => {
    const handleReset = () => {
      setHasEntered(false);
      setQuery('');
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 50);
    };
    window.addEventListener('reset-romi-chat', handleReset);

    // Preload hero images while user is in the portal to speed up navigation
    if (typeof window !== 'undefined') {
      const homeHero = new Image();
      homeHero.src = '/images/home-hero-bg.webp';
      
      const techHero = new Image();
      techHero.src = '/images/tech-hero-bg.webp';
    }

    return () => window.removeEventListener('reset-romi-chat', handleReset);
  }, []);

  // Prevent background/outside conversational area scrolling when chat is active
  useEffect(() => {
    if (hasEntered) {
      const originalBodyOverflow = document.body.style.overflow;
      const originalBodyHeight = document.body.style.height;
      const originalHtmlOverflow = document.documentElement.style.overflow;
      const originalHtmlHeight = document.documentElement.style.height;

      document.body.style.overflow = 'hidden';
      document.body.style.height = '100dvh';
      document.documentElement.style.overflow = 'hidden';
      document.documentElement.style.height = '100dvh';

      return () => {
        document.body.style.overflow = originalBodyOverflow;
        document.body.style.height = originalBodyHeight;
        document.documentElement.style.overflow = originalHtmlOverflow;
        document.documentElement.style.height = originalHtmlHeight;
      };
    }
  }, [hasEntered]);

  // For Live Stats counting up
  const [stats, setStats] = useState({ tech: 0, inst: 0, sec: 0, found: 0 });
  const [activePipelineStep, setActivePipelineStep] = useState(0);
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);

  // Auto-close mobile dropdown on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsMobileDropdownOpen(false);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Animated placeholder state
  const [currentPlaceholder, setCurrentPlaceholder] = useState(tabPlaceholders['search']);

  useEffect(() => {
    setCurrentPlaceholder(tabPlaceholders[activeTab] || tabPlaceholders['search']);
  }, [activeTab]);

  useEffect(() => {
    if (!hasEntered) {
      const interval = setInterval(() => {
        setStats(prev => ({
          tech: Math.min(prev.tech + 5, 160),
          inst: Math.min(prev.inst + 1, 8),
          sec: Math.min(prev.sec + 1, 12),
          found: Math.min(prev.found + 12, 340)
        }));
      }, 50);
      return () => clearInterval(interval);
    }
  }, [hasEntered]);

  useEffect(() => {
    if (!hasEntered) {
      const interval = setInterval(() => {
        setActivePipelineStep((prev) => (prev + 1) % 6);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [hasEntered]);

  const handleSearch = () => {
    // Disabled to prevent entering active chat mode during STAY TUNED! phase
    /*
    if (query.trim()) {
      setHasEntered(true);
    } else {
      setQuery('');
      setHasEntered(true);
    }
    */
  };

  const handleSectorClick = (sector: string) => {
    // Disabled to prevent entering active chat mode during STAY TUNED! phase
    /*
    setQuery(`Show me ${sector} technologies`);
    setHasEntered(true);
    */
  };

  return (
    <main 
      className={`bg-[#FDFDF9] dark:bg-zinc-950 relative font-sans flex flex-col ${hasEntered ? 'h-screen h-[100dvh] max-h-[100dvh] overflow-hidden' : 'min-h-screen'} transition-colors duration-300`}
      style={hasEntered ? {
        backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.25)), url('/images/ROMI-PORTAL-BG.webp')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100dvh',
        maxHeight: '100dvh',
        overflow: 'hidden',
      } : undefined}
    >
      <Navbar />

      {/* Main Animated Container */}
      <div className={`w-full flex-1 relative flex flex-col ${hasEntered ? 'p-2 md:p-3 overflow-hidden' : 'p-4 md:p-8'}`}>
        {!hasEntered ? (
          <>
            {/* Hero Section Card */}
            <motion.div
              id="romi-hero"
              layoutId="main-container"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="w-full min-h-[70vh] md:min-h-[85vh] rounded-[40px] relative shadow-2xl border border-gray-100 flex flex-col items-center justify-center pt-24 pb-16 md:pt-32 md:pb-24 bg-cover bg-center shrink-0 mb-8 scroll-mt-20 gap-8 md:gap-12"
              style={{
                backgroundImage: "url('/images/ROMI-PORTAL-BG.webp')",
              }}
            >
              <div className="absolute inset-0 bg-white/20 pointer-events-none rounded-[40px]"></div>
              <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-[#fefcf5] to-transparent pointer-events-none rounded-t-[40px]"></div>

              <div className="z-20 flex flex-col items-center text-center max-w-4xl px-4 mt-0">
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="font-helios text-[32px] min-[360px]:text-4xl min-[400px]:text-5xl sm:text-7xl md:text-8xl text-black tracking-tight animate-fade-in whitespace-nowrap text-center"
                >
                  Meet <span className="text-[#219653]">ROMI AI</span>
                </motion.h1>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-4 flex flex-col items-center"
                >
                  <p className="text-gray-800 text-[10px] min-[360px]:text-xs sm:text-lg md:text-2xl font-base mb-3 whitespace-nowrap">
                    RINK's Advanced AI model that help you
                  </p>
                  <div className="bg-white/80 backdrop-blur-md px-4 sm:px-6 py-1.5 sm:py-2 rounded-full border border-white/50 text-[#219653] text-xs sm:text-base md:text-xl font-medium shadow-sm flex items-center gap-2 whitespace-nowrap">
                    Discover <span className="text-sm">➔</span> Analyze <span className="text-sm">➔</span> Scale.
                  </div>
                </motion.div>
              </div>

              {/* Search Bar Container - Fully visible but temporarily disabled for Stay Tuned preview */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="w-full max-w-4xl px-4 relative z-20"
              >
                <div className="relative rounded-[32px] p-1.5 md:p-2 shadow-2xl border border-white/40 bg-white/30 backdrop-blur-xl" style={{
                  boxShadow: '0 30px 60px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.8)'
                }}>
                  <div className="bg-white/95 backdrop-blur-md rounded-[26px] md:rounded-[24px] p-3 md:p-5 flex flex-col gap-4 shadow-xl border border-white/80 focus-within:shadow-[0_15px_40px_rgba(27,96,187,0.06)] focus-within:border-[#1b60bb]/30 transition-all duration-300">
                    <div className="flex items-center relative overflow-hidden">
                      <div className="relative w-full">
                        <AnimatePresence mode="wait">
                          <motion.input
                            key={currentPlaceholder}
                            initial={{ opacity: 0.5, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 5 }}
                            transition={{ duration: 0.2 }}
                            type="text"
                            placeholder={currentPlaceholder}
                            disabled={true}
                            className="w-full bg-transparent border-none outline-none text-black placeholder:text-gray-400 text-[10px] min-[360px]:text-xs min-[400px]:text-sm sm:text-lg md:text-2xl font-sans font-medium px-1 md:px-4 pt-1 md:pt-2 pb-3 md:pb-6 cursor-not-allowed"
                            value={query}
                            // onChange={(e) => setQuery(e.target.value)}
                            // onKeyDown={(e) => {
                            //   if (e.key === 'Enter') {
                            //     handleSearch();
                            //   }
                            // }}
                          />
                        </AnimatePresence>
                      </div>
                    </div>

                    <div className="flex items-center justify-between px-1 md:px-2 pb-1 gap-2">
                      <div className="flex md:hidden items-center gap-2 relative">
                        <button
                          onClick={() => setIsMobileDropdownOpen(!isMobileDropdownOpen)}
                          className="w-8 h-8 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-600 hover:bg-gray-50 active:scale-95 transition-all shrink-0 shadow-sm"
                        >
                          <span className="text-lg leading-none">+</span>
                        </button>
                        
                        <div className="bg-black text-white px-3.5 py-1.5 rounded-full text-xs font-semibold font-sans capitalize shadow-sm">
                          {activeTab === 'search' ? 'Explore' : activeTab}
                        </div>

                        <AnimatePresence>
                          {isMobileDropdownOpen && (
                            <motion.div
                              initial={{ opacity: 0, y: -10, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: -10, scale: 0.95 }}
                              transition={{ duration: 0.15 }}
                              className="absolute top-full mt-2.5 left-0 bg-white border border-gray-100 rounded-2xl shadow-xl p-2.5 z-30 w-48 flex flex-col gap-1"
                            >
                              {[
                                { id: 'search', label: 'Explore', icon: <Search size={14} /> },
                                { id: 'technologies', label: 'Technologies', icon: <Cpu size={14} /> },
                                { id: 'instrumentation', label: 'Instrumentation', icon: <Wrench size={14} /> },
                                { id: 'researchpreneurship', label: 'Researchpreneurship', icon: <Lightbulb size={14} /> }
                              ].map((option) => (
                                <button
                                  key={option.id}
                                  onClick={() => {
                                    setActiveTab(option.id);
                                    setQuery('');
                                    setIsMobileDropdownOpen(false);
                                  }}
                                  className={`w-full text-left px-3.5 py-2.5 text-xs rounded-xl transition-colors font-medium font-sans flex items-center gap-2.5 ${activeTab === option.id ? 'bg-black text-white' : 'text-gray-700 hover:bg-gray-50'}`}
                                >
                                  <span className={activeTab === option.id ? 'text-white' : 'text-gray-400'}>
                                    {option.icon}
                                  </span>
                                  <span className="capitalize">{option.label}</span>
                                </button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      <div className="hidden md:flex gap-2 overflow-x-auto flex-nowrap [&::-webkit-scrollbar]:hidden pb-1 -mb-1 relative">
                        {tabs.map((tab) => (
                          <button
                            key={tab}
                            onClick={() => {
                              setActiveTab(tab);
                              setQuery('');
                            }}
                            className={`relative px-4 md:px-5 py-1.5 md:py-2 text-[10px] md:text-xs rounded-full font-medium cursor-pointer transition-colors whitespace-nowrap shrink-0 ${activeTab === tab ? 'text-white' : 'text-black bg-[#FFF9E6] hover:bg-yellow-100'}`}
                          >
                            {activeTab === tab && (
                              <motion.div
                                layoutId="activeChip"
                                className="absolute inset-0 bg-black rounded-full"
                                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                              />
                            )}
                            <span className="relative z-10 capitalize">{tab === 'search' ? 'Explore' : tab}</span>
                          </button>
                        ))}
                      </div>
                      <button
                        onClick={handleSearch}
                        className="w-8 h-8 md:w-12 md:h-12 bg-black hover:bg-gray-800 rounded-full flex items-center justify-center text-white active:scale-95 transition-all shrink-0 z-10"
                      >
                        <ArrowUp className="text-white w-4 h-4 md:w-[22px] md:h-[22px]" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Bottom gradient overlay with STAY TUNED! text */}
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#FDFDF9] via-[#FDFDF9]/95 to-transparent dark:from-zinc-950 dark:via-zinc-950/95 rounded-b-[40px] flex flex-col items-center justify-end pb-8 z-20 pointer-events-none">
                <h2 className="font-helios text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-widest text-center select-none text-[#219653] filter drop-shadow-[0_2px_8px_rgba(33,150,83,0.25)]">
                  STAY TUNED!
                </h2>
              </div>
            </motion.div>

            {/* Second Section: White Card Container (wrapping Stats Bar and onwards) - Disabled for future enablement */}
            {false && (
              <div className="w-full bg-white rounded-[40px] shadow-2xl border border-gray-100 p-3 sm:p-6 md:p-12 flex flex-col gap-16 overflow-hidden">

                <div className="py-20 px-6 max-w-7xl mx-auto">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                  >
                    <h2 className="text-5xl md:text-6xl font-bold font-helios text-gray-900 mb-4">How Romi Works</h2>
                    <p className="text-gray-500 font-montserrat max-w-2xl mx-auto">Your AI copilot for technology discovery and market research.</p>
                  </motion.div>

                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-y-16 gap-x-8 relative"
                  >
                    {[
                      {
                        icon: <Search size={32} />,
                        title: '1. Tell Romi your idea',
                        desc: 'Input your sector, problem statement, or technology request.',
                        color: 'bg-blue-50 text-[#1b60bb]'
                      },
                      {
                        icon: <Zap size={32} />,
                        title: '2. Match & Analyze',
                        desc: 'Romi instantly finds matching IPs and runs deep market analysis.',
                        color: 'bg-indigo-50 text-indigo-600'
                      },
                      {
                        icon: <BarChart3 size={32} />,
                        title: '3. Get Full Assessment',
                        desc: 'Receive comprehensive licensing guidance and TAM/SAM/SOM charts.',
                        color: 'bg-green-50 text-[#219653]'
                      }
                    ].map((step, idx) => (
                      <motion.div
                        key={idx}
                        variants={itemVariants}
                        whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
                        className="flex flex-col items-center text-center relative z-10 bg-white p-6 rounded-2xl shadow-sm border border-gray-50 hover:shadow-md transition-shadow"
                      >
                        <div className={`w-16 h-16 ${step.color} rounded-2xl flex items-center justify-center mb-6 shadow-inner`}>
                          {step.icon}
                        </div>
                        <h3 className="font-bold font-helios text-xl mb-2 text-gray-900">{step.title}</h3>
                        <p className="text-gray-500 text-sm font-montserrat">{step.desc}</p>

                        {idx < 2 && (
                          <>
                            <div className="hidden md:block absolute top-1/2 -right-8 transform -translate-y-1/2 w-8 h-4 overflow-visible z-20">
                              <svg className="w-8 h-4 overflow-visible" viewBox="0 0 32 16">
                                <path d="M 0 8 L 32 8" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="3 3" />
                                <path d="M 12 4 L 16 8 L 12 12" stroke="#cbd5e1" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                                <circle r="2.5" fill="#ff7a00">
                                  <animateMotion dur="1.2s" repeatCount="indefinite" path="M 0 8 L 32 8" />
                                </circle>
                              </svg>
                            </div>
                            <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 md:hidden w-6 h-16 overflow-visible z-20">
                              <svg className="w-6 h-16 overflow-visible" viewBox="0 0 24 64">
                                <path d="M 12 0 L 12 64" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="3 3" />
                                <path d="M 8 28 L 12 32 L 16 28" stroke="#cbd5e1" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                                <circle r="2.5" fill="#ff7a00">
                                  <animateMotion dur="1.2s" repeatCount="indefinite" path="M 12 0 L 12 64" />
                                </circle>
                              </svg>
                            </div>
                          </>
                        )}
                      </motion.div>
                    ))}
                  </motion.div>
                </div>

                <TechnologiesFeatureShowcase />
                <InstrumentationStoryShowcase />

                <div className="py-24 px-4 md:px-8 max-w-7xl mx-auto w-full flex flex-col items-center">
                  <div className="text-center mb-16 w-full flex flex-col items-center">
                     <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-helios text-gray-900 mb-4 text-center">
                      Tailored for Every Stakeholder
                    </h2>
                    <p className="text-gray-500 font-montserrat max-w-2xl mx-auto text-center">
                      Whether you are building a venture or funding academic research, ROMI is optimized for your target goals.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                    {[
                      { title: 'For Entrepreneurs and Industries', desc: "Discover, compare, and analyse commercialisable technologies from Kerala's leading R&D institutes. Find instruments and specialised services from research institutions and startups to accelerate your R&D.", icon: <Users size={22} />, color: 'text-blue-600 bg-blue-50' },
                      { title: 'For Researchers and Innovators', desc: 'Refine your idea through AI-guided brainstorming, analyse market opportunities, and prepare your Researchpreneurship Program application for commercial potential validation.', icon: <Lightbulb size={22} />, color: 'text-amber-600 bg-amber-50' },
                      { title: 'For Institutions', desc: 'Transform institutional research into startup and industry opportunities through AI-powered technology profiling, collaboration discovery, and enhanced visibility of research infrastructure.', icon: <Scale size={22} />, color: 'text-green-600 bg-green-50' }
                    ].map((useCase, idx) => (
                      <div key={idx} className="bg-white border border-gray-100 rounded-3xl p-8 hover:shadow-lg transition-all duration-300 group flex flex-col justify-between w-full mx-auto">
                        <div>
                          <div className={`w-11 h-11 ${useCase.color} rounded-xl flex items-center justify-center mb-6`}>{useCase.icon}</div>
                          <h3 className="font-bold font-helios text-xl text-gray-900 mb-3">{useCase.title}</h3>
                          <p className="text-gray-500 text-sm font-montserrat leading-relaxed">{useCase.desc}</p>
                        </div>

                      </div>
                    ))}
                  </div>
                </div>

                <div className="py-20 bg-[#FCFAF8] relative overflow-hidden w-full flex items-center justify-center rounded-[40px] shadow-sm my-4">
                  <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center w-full relative z-10">

                    <div className="w-full flex flex-col justify-center">
                      <h2 className="text-4xl md:text-5xl font-bold font-helios text-gray-900 mb-4 text-left">
                        See Romi in action
                      </h2>
                      <p className="text-gray-500 font-montserrat mb-8 max-w-xl">
                        Instantly generate market intelligence reports, compare technologies, and evaluate startup potential with premium visualizations.
                      </p>

                      <div className="bg-gradient-to-br from-[#1b60bb] to-indigo-700 p-6 sm:p-8 rounded-3xl text-white shadow-xl relative overflow-hidden w-full max-w-xl">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
                        <h3 className="font-bold font-helios text-2xl mb-2 relative z-10">Have a research idea?</h3>
                        <p className="text-white/80 font-montserrat mb-6 relative z-10">Romi validates it and guides your ResearchPreneurship journey.</p>
                        <button
                          onClick={() => { setActiveTab('researchpreneurship'); setQuery('Assess my ResearchPreneurship idea '); setHasEntered(true); }}
                          className="bg-white text-[#1b60bb] px-6 py-3 rounded-full font-bold text-sm hover:scale-105 transition-transform relative z-10"
                        >
                          Start Assessment →
                        </button>
                      </div>
                    </div>

                    <div className="w-full max-w-xl mx-auto md:ml-auto md:mr-0">
                      <div className="bg-white p-5 sm:p-7 rounded-[32px] shadow-2xl shadow-blue-900/10 border border-gray-100 relative transform sm:rotate-1 hover:rotate-0 transition-all duration-500 overflow-hidden">

                        <div className="flex gap-3 items-center mb-6 border-b border-gray-100 pb-4">
                          <div className="w-8 h-8 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center shrink-0 shadow-sm">
                            <User size={16} className="text-gray-500" />
                          </div>
                          <div className="bg-gray-50 p-3 rounded-2xl rounded-tl-sm text-sm font-montserrat text-gray-700 w-full border border-gray-100">
                            Give Market Value of Agritech in 2026?
                          </div>
                        </div>

                        <div className="flex gap-3 items-start relative z-10">
                          <div className="shrink-0 flex items-center justify-center">
                            <img src="/romi-avatar.webp" alt="Romi" className="w-10 h-10 object-contain" />
                          </div>

                          <div className="flex flex-col gap-4 w-full">
                            <div className="bg-blue-50/50 p-4 rounded-2xl rounded-tr-sm border border-blue-100/50 text-sm font-montserrat text-gray-800 shadow-sm leading-relaxed">
                              The global Agritech market is projected to reach <strong className="text-[#1b60bb]">$43.37 Billion</strong> by 2030, growing at a CAGR of 10.2%.
                            </div>

                            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 flex flex-col items-center justify-center gap-5 shadow-inner">
                              <h4 className="font-helios font-bold text-xs text-gray-400 uppercase tracking-widest w-full text-left">
                                TAM / SAM / SOM Breakdown
                              </h4>

                              <div className="relative w-full max-w-[160px] sm:max-w-[200px] flex flex-col items-center justify-end group cursor-pointer">
                                <div className="w-1/2 h-8 sm:h-10 bg-[#1b60bb] rounded-t-lg sm:rounded-t-xl border-b border-white/20 flex items-center justify-center text-white font-bold text-[9px] sm:text-[11px] tracking-wide transition-all group-hover:bg-indigo-700 shadow-sm z-30 relative">
                                  SOM $2B
                                </div>

                                <div className="w-3/4 h-8 sm:h-10 bg-blue-300 rounded-t-md sm:rounded-t-lg border-b border-white/40 flex items-center justify-center text-blue-900 font-bold text-[9px] sm:text-[11px] tracking-wide transition-all group-hover:bg-blue-400 shadow-sm z-20 relative">
                                  SAM $15B
                                </div>

                                <div className="w-full h-8 sm:h-10 bg-blue-100 rounded-b-lg sm:rounded-b-xl border border-blue-200/40 flex items-center justify-center text-blue-800 font-bold text-[9px] sm:text-[11px] tracking-wide transition-all group-hover:bg-blue-200 shadow-sm z-10 relative">
                                  TAM $43B
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white via-white/90 to-transparent rounded-b-[32px] pointer-events-none z-20"></div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </>
        ) : (
          <>
            {/* Commented out chat container to prevent entry into active mode */}
            {false && (
              <motion.div
                layoutId="main-container"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="flex-1 w-full bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden shadow-[0_25px_80px_-15px_rgba(0,0,0,0.2)] dark:shadow-none border border-gray-100 dark:border-zinc-800 flex flex-col mx-auto"
              >
                <RomiPortalLayout 
                  query={query} 
                  activeMode={activeTab} 
                  onReset={() => { setHasEntered(false); setQuery(''); }} 
                />
              </motion.div>
            )}
          </>
        )}
      </div>
      {!hasEntered && <Footer />}
    </main>
  );
}