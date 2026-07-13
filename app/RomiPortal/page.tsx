//C:\Users\Akash Krishna\Downloads\RINK KSUM Website\app\RomiPortal\page.tsx

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp, Mic, BarChart3, Search, Lightbulb, Zap, Filter, Database, TrendingUp, User, Check, X as CloseIcon, ArrowRight, Scale, Users, Shield, Plus } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect, Fragment } from 'react';
import RomiPortalLayout from './RomiPortalLayout';
import StorageConsentPopup from './RomiPortalFeatures/StorageConsentPopup';
import Navbar from '@/HomePage/Navbar';
import MiniCard from './RomiPortalFeatures/MiniCard';
import Footer from '@/HomePage/Footer';

const tabs = ['search', 'analyze', 'compare', 'researchpreneurship'];

const mockTech = {
  technology_id: 'TECH-001',
  technology_name: 'AI Crop Yield Predictor',
  institution: 'Kerala Agricultural University',
  primary_sector: 'Agriculture',
  brief_description_abstract: 'Advanced ML model to predict crop yields based on weather patterns and soil health metrics.',
  trl: 'TRL 6',
  startup_potential: 'High',
  patent_status: 'Filed'
};

const sectors = ['Agriculture', 'Biotechnology', 'Food Processing', 'Electronics', 'Water Technology', 'Healthcare', 'Environment', 'Energy'];

// Dynamic Placeholders tied to tabs
const tabPlaceholders: Record<string, string> = {
  search: "Find ready-to-license Agritech AI models...",
  analyze: "Give Market Value of Agritech in 2026?",
  compare: "Compare drone mapping vs satellite IP yields...",
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
  const [showConsent, setShowConsent] = useState(false);
  const [isConsentHighlighted, setIsConsentHighlighted] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState('search');

  // Check consent on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const consent = localStorage.getItem('romi-consent');
      if (consent !== 'true') {
        setShowConsent(true);
      }
    }
  }, []);

  const handleInputClick = () => {
    if (showConsent) {
      setIsConsentHighlighted(true);
      setTimeout(() => setIsConsentHighlighted(false), 500);
    }
  };

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
    if (showConsent) {
      handleInputClick();
      return;
    }
    if (query.trim() || activeTab) {
      if (!query.trim()) {
        setQuery(activeTab + ' ');
      }
      setHasEntered(true);
    }
  };

  const handleSectorClick = (sector: string) => {
    if (showConsent) {
      handleInputClick();
      return;
    }
    setQuery(`Show me ${sector} technologies`);
    setHasEntered(true);
  };

  return (
    <main className={`bg-[#FDFDF9] relative font-sans flex flex-col ${hasEntered ? 'h-screen overflow-hidden' : 'min-h-screen'}`}>
      <Navbar />

      {!hasEntered && showConsent && (
        <StorageConsentPopup 
          onClose={() => setShowConsent(false)} 
          isHighlighted={isConsentHighlighted} 
        />
      )}

      {/* Main Animated Container */}
      <div className={`w-full flex-1 relative flex flex-col ${hasEntered ? 'p-4 md:p-6 overflow-hidden' : 'p-4 md:p-8'}`}>
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

              {/* Search Bar Container */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="w-full max-w-4xl px-4 relative z-20"
              >
                <div className="relative rounded-[32px] p-1.5 md:p-2 shadow-2xl border border-white/40 bg-white/30 backdrop-blur-xl" style={{
                  boxShadow: '0 30px 60px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.8)'
                }}>
                  <div className="bg-white/95 backdrop-blur-md rounded-3xl p-3 md:p-5 flex flex-col gap-4 shadow-xl border border-white/80 focus-within:shadow-[0_15px_40px_rgba(27,96,187,0.06)] focus-within:border-[#1b60bb]/30 transition-all duration-300">
                    <div className="flex items-center relative overflow-hidden">
                      {/* Animated Placeholder wrapper to smooth out text changes */}
                      <div className="relative w-full">
                        <AnimatePresence mode="wait">
                          <motion.input
                            key={currentPlaceholder}
                            initial={{ opacity: 0.5, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 5 }}
                            transition={{ duration: 0.2 }}
                            type="text"
                            placeholder={showConsent ? "Please save the storage consent popup on the right to unlock searching..." : currentPlaceholder}
                            disabled={showConsent}
                            onClick={handleInputClick}
                            className={`w-full bg-transparent border-none outline-none text-black placeholder:text-gray-400 text-[10px] min-[360px]:text-xs min-[400px]:text-sm sm:text-lg md:text-2xl font-sans font-medium px-1 md:px-4 pt-1 md:pt-2 pb-3 md:pb-6 ${
                              showConsent ? 'cursor-not-allowed text-gray-400' : ''
                            }`}
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                if (showConsent) {
                                  handleInputClick();
                                } else {
                                  handleSearch();
                                }
                              }
                            }}
                          />
                        </AnimatePresence>
                      </div>
                    </div>

                    <div className="flex items-center justify-between px-1 md:px-2 pb-1 gap-2">
                      {/* Mobile Action Bar (plus icon + dropdown + selected pill) */}
                      <div className="flex md:hidden items-center gap-2 relative">
                        {/* Premium Plus Button */}
                        <button
                          onClick={() => setIsMobileDropdownOpen(!isMobileDropdownOpen)}
                          className="w-8 h-8 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-600 hover:bg-gray-50 active:scale-95 transition-all shrink-0 shadow-sm"
                        >
                          <span className="text-lg leading-none">+</span>
                        </button>
                        
                        {/* Current selected pill */}
                        <div className="bg-black text-white px-3.5 py-1.5 rounded-full text-xs font-semibold font-sans capitalize shadow-sm">
                          {activeTab}
                        </div>

                        {/* Mobile dropdown panel */}
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
                                { id: 'search', label: 'search', icon: <Search size={14} /> },
                                { id: 'analyze', label: 'analyze', icon: <BarChart3 size={14} /> },
                                { id: 'compare', label: 'compare', icon: <Shield size={14} /> },
                                { id: 'researchpreneurship', label: 'researchpreneurship', icon: <Lightbulb size={14} /> }
                              ].map((option) => (
                                <button
                                  key={option.id}
                                  onClick={() => {
                                    setActiveTab(option.id);
                                    setQuery(''); // Clear query to show new placeholder
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

                      {/* Desktop Action Bar (original horizontal list) */}
                      <div className="hidden md:flex gap-2 overflow-x-auto flex-nowrap [&::-webkit-scrollbar]:hidden pb-1 -mb-1 relative">
                        {tabs.map((tab) => (
                          <button
                            key={tab}
                            onClick={() => {
                              setActiveTab(tab);
                              setQuery(''); // Clear query to let placeholder rotate
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
                            <span className="relative z-10">{tab}</span>
                          </button>
                        ))}
                      </div>
                      <button
                        onClick={showConsent ? handleInputClick : handleSearch}
                        className={`w-8 h-8 md:w-12 md:h-12 bg-black hover:bg-gray-800 rounded-full flex items-center justify-center text-white active:scale-95 transition-all shrink-0 z-10 ${
                          showConsent ? 'opacity-40 cursor-not-allowed' : ''
                        }`}
                      >
                        <ArrowUp className="text-white w-4 h-4 md:w-[22px] md:h-[22px]" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Second Section: White Card Container (wrapping Stats Bar and onwards) */}
            <div className="w-full bg-white rounded-[40px] shadow-2xl border border-gray-100 p-6 md:p-12 flex flex-col gap-16 overflow-hidden">

              {/* 2. How Romi works - Animated 3-step visual */}
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

                      {/* Connectors for Step 1 and Step 2 */}
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

              {/* 3. Capabilities / Ecosystem Context (Animated Bento Grid) */}
              <div className="py-24 px-4 md:px-8 max-w-7xl mx-auto bg-white w-full flex flex-col items-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="text-center mb-16 w-full flex flex-col items-center justify-center"
                >
                 <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-helios text-gray-900 mb-4 text-center">
                    Engineered for Research & Scale
                  </h2>
                  <p className="text-gray-500 font-montserrat max-w-2xl mx-auto text-center">
                    Discover how ROMI AI converts raw scientific data and patent filings into structured, market-ready intelligence.
                  </p>
                </motion.div>

                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full"
                >
                  {/* Card 1: Synthesized IP Extraction (2/3 width) */}
                  <motion.div
                    variants={itemVariants}
                    className="md:col-span-2 bg-[#FAF9F5] border border-gray-100 rounded-3xl p-6 sm:p-8 flex flex-col justify-between overflow-hidden relative group hover:shadow-lg transition-shadow duration-300 w-full mx-auto"
                  >
                    <div className="max-w-md z-10">
                      <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center text-[#1b60bb] mb-6">
                        <Database size={24} />
                      </div>
                      <h3 className="font-bold font-helios text-2xl mb-2 text-gray-900">Synthesized IP Summarization</h3>
                      <p className="text-gray-500 text-sm font-montserrat leading-relaxed">
                        ROMI parses complex academic articles and 100+ page patent documents, instantly extracting key claims, Technology Readiness Levels (TRL), and concrete application fields.
                      </p>
                    </div>

                    <div className="mt-8 flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      <div className="flex-1 opacity-55 border-b sm:border-b-0 sm:border-r border-gray-100 pb-4 sm:pb-0 pr-0 sm:pr-4">
                        <span className="text-[10px] uppercase font-bold text-gray-400 block mb-2">Raw Patent PDF</span>
                        <div className="h-2 bg-gray-200 rounded w-3/4 mb-1"></div>
                        <div className="h-2 bg-gray-100 rounded w-full mb-1"></div>
                        <div className="h-2 bg-gray-200 rounded w-5/6 mb-1"></div>
                        <div className="h-2 bg-gray-100 rounded w-2/3"></div>
                      </div>
                      <div className="flex-1 pl-0 sm:pl-4 pt-4 sm:pt-0">
                        <span className="text-[10px] uppercase font-bold text-green-600 block mb-2">ROMI Commercial Summary</span>
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <span className="w-2 h-2 rounded-full bg-green-500"></span>
                          <span className="text-xs font-bold text-gray-800">TRL 6 Predictor</span>
                        </div>
                        <span className="text-xs text-gray-600 font-montserrat block">Agritech Drone Crop Analysis</span>
                      </div>
                    </div>
                  </motion.div>

                  {/* Card 2: Localized Context Matching (1/3 width) */}
                  <motion.div
                    variants={itemVariants}
                    className="bg-[#FAF9F5] border border-gray-100 rounded-3xl p-6 sm:p-8 flex flex-col justify-between overflow-hidden relative group hover:shadow-lg transition-shadow duration-300 w-full mx-auto"
                  >
                    <div>
                      <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center text-green-600 mb-6">
                        <Filter size={24} />
                      </div>
                      <h3 className="font-bold font-helios text-2xl mb-2 text-gray-900">Ecosystem Context</h3>
                      <p className="text-gray-500 text-sm font-montserrat leading-relaxed">
                        Pre-aligned with the Kerala Startup Mission (KSUM) ecosystem, native institutions, and local sector growth patterns.
                      </p>
                    </div>

                    <div className="mt-8 flex flex-wrap gap-2">
                      {['Agriculture', 'Biotechnology', 'KAU', 'CUSAT', 'KSUM'].map((label, idx) => (
                        <span key={idx} className="px-3.5 py-1.5 bg-white border border-gray-100 rounded-full text-xs font-semibold text-gray-700 shadow-sm">{label}</span>
                      ))}
                    </div>
                  </motion.div>

                  {/* Card 3: Real-Time TAM/SAM/SOM Calculation (1/3 width) */}
                  <motion.div
                    variants={itemVariants}
                    className="bg-[#FAF9F5] border border-gray-100 rounded-3xl p-6 sm:p-8 flex flex-col justify-between overflow-hidden relative group hover:shadow-lg transition-shadow duration-300 w-full mx-auto"
                  >
                    <div>
                      <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center text-amber-500 mb-6">
                        <TrendingUp size={24} />
                      </div>
                      <h3 className="font-bold font-helios text-2xl mb-2 text-gray-900">Market Potential Mapping</h3>
                      <p className="text-gray-500 text-sm font-montserrat leading-relaxed">
                        Automatically queries industry sector forecasts to model addressable and target market volumes instantly.
                      </p>
                    </div>

                    <div className="mt-8 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-gray-700">Agritech Market (2026)</span>
                        <span className="text-green-600 font-bold">$43.37B</span>
                      </div>
                      <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: "70%" }}
                          transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                          viewport={{ once: true }}
                          className="bg-[#1b60bb] h-full"
                        />
                      </div>
                    </div>
                  </motion.div>

                  {/* Card 4: Developer & Partner API (2/3 width) */}
                  <motion.div
                    variants={itemVariants}
                    className="md:col-span-2 bg-[#FAF9F5] border border-gray-100 rounded-3xl p-6 sm:p-8 flex flex-col justify-between overflow-hidden relative group hover:shadow-lg transition-shadow duration-300 w-full mx-auto"
                  >
                    <div className="max-w-md">
                      <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center text-indigo-600 mb-6">
                        <Zap size={24} />
                      </div>
                      <h3 className="font-bold font-helios text-2xl mb-2 text-gray-900">Developer & Institution API</h3>
                      <p className="text-gray-500 text-sm font-montserrat leading-relaxed">
                        Integrate ROMI's backend directly into institution libraries, databases, and investor search workflows with standardized JSON payloads.
                      </p>
                    </div>

                    <div className="mt-8 bg-gray-900 rounded-2xl p-4 font-mono text-[11px] text-gray-300 border border-gray-800 shadow-inner overflow-x-auto whitespace-pre">
                      <div className="flex items-center gap-1.5 mb-2.5 pb-2 border-b border-gray-800">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                        <span className="text-[10px] text-gray-500 ml-1">rink-romi-query.js</span>
                      </div>
                      <span className="text-indigo-400">const</span> romi = <span className="text-indigo-400">new</span> <span className="text-green-400">RomiAI</span>(&#123; apiKey: <span className="text-amber-300">'rink_key...'</span> &#125;);<br />
                      <span className="text-indigo-400">const</span> result = <span className="text-indigo-400">await</span> romi.analyze(<span className="text-amber-300">'Agritech'</span>);<br />
                      console.log(result.market.tam); <span className="text-gray-500">// "$43.37B"</span>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
              {/*ROMI Synthesized IP Query Pipeline (Animated Grid) */}
              <div className="w-full bg-[#FCFAF8] py-20 rounded-[40px] shadow-sm my-4 flex items-center justify-center relative overflow-hidden">
                <style>{`
                  @keyframes flowParticles {
                    from { stroke-dashoffset: 40; }
                    to { stroke-dashoffset: 0; }
                  }
                  .animate-particle-flow {
                    stroke-dasharray: 8, 12;
                    animation: flowParticles 2s linear infinite;
                  }
                  .active-node-glow {
                    box-shadow: 0 0 25px rgba(27, 96, 187, 0.35);
                    border-color: rgba(27, 96, 187, 0.4);
                  }
                `}</style>

                <div className="max-w-6xl mx-auto w-full px-4 md:px-8 flex flex-col items-center justify-center">

                  {/* Header Section */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12 relative z-10 w-full flex flex-col items-center"
                  >
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-helios text-gray-900 mb-4 text-center">
                      Romi AI Architecture: Deep-Tech Data Flow
                    </h2>
                    <p className="text-gray-500 font-montserrat max-w-2xl mx-auto text-center">
                      A privacy-first, agentic AI ecosystem powered by a decentralized network, a localized LLM reasoning engine, and a 1024-dimensional semantic search pipeline.
                    </p>
                  </motion.div>

                  {/* Animated Responsive 3x2 Grid layout showing the 6 Phases */}
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="w-full grid grid-cols-1 md:grid-cols-3 gap-y-16 gap-x-6 md:gap-x-12 md:gap-y-16 relative z-10 font-sans"
                  >
                    {[
                      {
                        phase: 'Phase 1',
                        title: 'Decentralized Interception',
                        desc: 'Injected via @ksum/romi-chat npm widget. Zero-Trust LocalStorage memory safeguards IP ideas in browser, using Agentic Routing to intercept target triggers.',
                        sub: 'Data Sovereignty & Client Intercept'
                      },
                      {
                        phase: 'Phase 2',
                        title: 'Gateway & Sanitization',
                        desc: 'FastAPI Railway backend. Python heuristics scrub prompts to prevent loop hallucinations while extracting exact parameters (TRL levels, Institutions, sectors) in ms.',
                        sub: 'Structured JSON Context Assembly'
                      },
                      {
                        phase: 'Phase 3',
                        title: 'Semantic Brain (RAG)',
                        desc: 'Translates query into 1024-D mixedbread-ai vectors. Blasts ChromaDB similarity query (threshold >= 0.45), syncing live sheets in shadow databases for 100% uptime.',
                        sub: '1024-D mixedbread-ai & ChromaDB'
                      },
                      {
                        phase: 'Phase 4',
                        title: 'Live OSINT Validation',
                        desc: 'Connected to live web. Automated scrapers gather real-time Indian market competitors, and calculate TAM/SAM/SOM statistics stamped with verification references.',
                        sub: 'Live Web Scraping & Citations'
                      },
                      {
                        phase: 'Phase 5',
                        title: 'Local Inference (Llama 3.1)',
                        desc: 'Feeds structured context to localized Llama 3.1 70B (startup ideas are kept 100% locally secure, never sent to OpenAI/Google). Synthesizes mentor-like responses.',
                        sub: 'On-Premise Privacy Inference'
                      },
                      {
                        phase: 'Phase 6',
                        title: 'KSUM Deliverables Export',
                        desc: 'Server compiles the 8-stage Diagnostic Report into a highly formatted, KSUM-branded Word .docx file streamed directly to browser for one-click incubation applications.',
                        sub: 'Python-Docx Document Stream'
                      }
                    ].map((item, idx) => {
                      const desktopOrders = [
                        'md:order-1', // Phase 1
                        'md:order-2', // Phase 2
                        'md:order-3', // Phase 3
                        'md:order-6', // Phase 4
                        'md:order-5', // Phase 5
                        'md:order-4', // Phase 6
                      ];

                      return (
                        <motion.div
                          key={idx}
                          variants={itemVariants}
                          onClick={() => setActivePipelineStep(idx)}
                          // Changed: Base z-10, hover z-30, and dynamic active z-20 so cards ALWAYS overlay the lines
                          className={`bg-white border border-gray-150 rounded-2xl p-6 shadow-md shadow-gray-200/50 hover:shadow-xl hover:-translate-y-1 hover:z-30 transition-all duration-300 cursor-pointer relative flex flex-col justify-between w-full mx-auto min-h-[220px] ${desktopOrders[idx]} ${activePipelineStep === idx ? 'ring-2 ring-[#1b60bb]/40 bg-blue-50/10 z-20' : 'z-10'}`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-4">
                              <span className={`text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full ${activePipelineStep === idx ? 'bg-blue-50 text-[#1b60bb]' : 'bg-gray-50 text-gray-400'}`}>
                                {item.phase}
                              </span>
                              <span className="text-[10px] font-semibold text-gray-400 font-montserrat">{item.sub}</span>
                            </div>
                            <h3 className="font-bold font-helios text-lg text-gray-900 mb-2 leading-snug">{item.title}</h3>
                            <p className="text-gray-500 text-xs font-montserrat leading-relaxed mb-4">{item.desc}</p>
                          </div>

                          <div className="flex items-center gap-2 mt-auto pt-2">
                            <span className={`w-2 h-2 rounded-full ${activePipelineStep === idx ? 'bg-green-500 animate-ping' : 'bg-gray-200'}`} />
                            <span className={`text-[10px] font-bold ${activePipelineStep === idx ? 'text-green-600' : 'text-gray-400'}`}>
                              {activePipelineStep === idx ? 'Pulsing Data Package' : 'Standby Node'}
                            </span>
                          </div>

                          {/* Changed: Applied -z-10 to all connector wrappers so they tuck beneath the card backgrounds */}
                          {idx < 5 && (
                            <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 md:hidden w-6 h-16 overflow-visible -z-10">
                              <svg className="w-6 h-16 overflow-visible" viewBox="0 0 24 64">
                                <path d="M 12 0 L 12 64" stroke="#cbd5e1" strokeWidth="2.5" strokeDasharray="4 4" />
                                <path d="M 8 28 L 12 32 L 16 28" stroke="#cbd5e1" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                                <circle r="3.5" fill="#ff7a00">
                                  <animateMotion dur="1.5s" repeatCount="indefinite" path="M 12 0 L 12 64" />
                                </circle>
                              </svg>
                            </div>
                          )}

                          {(idx === 0 || idx === 1) && (
                            <div className="hidden md:block absolute top-1/2 -right-10 lg:-right-14 transform -translate-y-1/2 w-10 lg:w-14 h-4 overflow-visible -z-10">
                              <svg className="w-full h-4 overflow-visible" viewBox="0 0 64 16" preserveAspectRatio="none">
                                <path d="M 0 8 L 64 8" stroke="#cbd5e1" strokeWidth="2.5" strokeDasharray="4 4" />
                                <path d="M 28 4 L 34 8 L 28 12" stroke="#cbd5e1" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                                <circle r="3.5" fill="#ff7a00">
                                  <animateMotion dur="1.5s" repeatCount="indefinite" path="M 0 8 L 64 8" />
                                </circle>
                              </svg>
                            </div>
                          )}

                          {idx === 2 && (
                            <div className="hidden md:block absolute -bottom-16 left-1/2 transform -translate-x-1/2 w-4 h-16 overflow-visible -z-10">
                              <svg className="w-4 h-16 overflow-visible" viewBox="0 0 16 64">
                                <path d="M 8 0 L 8 64" stroke="#cbd5e1" strokeWidth="2.5" strokeDasharray="4 4" />
                                <path d="M 4 28 L 8 32 L 12 28" stroke="#cbd5e1" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                                <circle r="3.5" fill="#ff7a00">
                                  <animateMotion dur="1.5s" repeatCount="indefinite" path="M 8 0 L 8 64" />
                                </circle>
                              </svg>
                            </div>
                          )}

                          {(idx === 3 || idx === 4) && (
                            <div className="hidden md:block absolute top-1/2 -left-10 lg:-left-14 transform -translate-y-1/2 w-10 lg:w-14 h-4 overflow-visible -z-10">
                              <svg className="w-full h-4 overflow-visible" viewBox="0 0 64 16" preserveAspectRatio="none">
                                <path d="M 64 8 L 0 8" stroke="#cbd5e1" strokeWidth="2.5" strokeDasharray="4 4" />
                                <path d="M 36 4 L 30 8 L 36 12" stroke="#cbd5e1" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                                <circle r="3.5" fill="#ff7a00">
                                  <animateMotion dur="1.5s" repeatCount="indefinite" path="M 64 8 L 0 8" />
                                </circle>
                              </svg>
                            </div>
                          )}
                        </motion.div>
                      );
                    })}
                  </motion.div>
                </div>
              </div>

              {/* 4. Comparative Advantage Section */}
              <div className="py-20 px-4 md:px-8 max-w-7xl mx-auto w-full flex flex-col items-center">
                <div className="text-center mb-16 w-full flex flex-col items-center">
                  
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-helios text-gray-900 mb-4 text-center">
                    Why ROMI AI Stands Alone
                  </h2>
                  <p className="text-gray-500 font-montserrat max-w-2xl mx-auto text-center">
                    Purpose-built for deep-tech incubators. Compare how ROMI AI outperforms public AI models across every critical workflow.
                  </p>
                </div>

                {/* 3-Column Comparative Table */}
                <div className="w-[calc(100%+1rem)] -mx-2 md:w-full md:mx-auto max-w-4xl overflow-x-auto md:overflow-hidden rounded-3xl border border-gray-150 bg-white shadow-[0_20px_45px_-15px_rgba(27,96,187,0.12)]">
                  <table className="w-full text-left border-collapse font-sans text-xs md:text-sm table-fixed min-w-[500px] md:min-w-0">
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50/50">
                        <th className="w-[30%] md:w-[22%] p-2.5 md:p-5 font-helios font-bold text-gray-500 text-xs md:text-sm">
                          Features
                        </th>
                        <th className="w-[35%] md:w-[39%] p-2.5 md:p-5 text-center font-helios font-bold text-[#219653] text-xs md:text-sm border-r border-l border-gray-100 bg-green-50/5">
                          ROMI AI
                        </th>
                        <th className="w-[35%] md:w-[39%] p-2.5 md:p-5 text-center font-helios font-bold text-gray-500 text-xs md:text-sm bg-red-50/5">
                          Other AI
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100/80">
                      {comparisonRows.map((row, idx) => (
                        <tr key={idx} className="hover:bg-gray-50/10 transition-colors">
                          {/* Feature Name */}
                          <td className="px-2.5 py-3 md:p-5 font-helios font-bold text-gray-800 text-[11px] md:text-sm align-top leading-tight break-normal">
                            {row.feature}
                          </td>
                          {/* ROMI AI */}
                          <td className="px-2.5 py-3 md:p-5 bg-green-50/5 border-r border-l border-gray-100 align-top">
                            <div className="flex items-start gap-1.5 md:gap-2">
                              <Check size={14} className="text-green-600 shrink-0 mt-0.5" strokeWidth={3.5} />
                              <span className="text-gray-700 text-[10px] md:text-sm font-medium leading-relaxed font-montserrat">
                                {row.romi}
                              </span>
                            </div>
                          </td>
                          {/* Other AI */}
                          <td className="px-2.5 py-3 md:p-5 align-top bg-red-50/5">
                            <div className="flex items-start gap-1.5 md:gap-2">
                              <CloseIcon size={14} className="text-red-500 shrink-0 mt-0.5" strokeWidth={3.5} />
                              <span className="text-gray-500 text-[10px] md:text-sm font-medium leading-relaxed font-montserrat">
                                {row.other}
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Target Use Case Grid */}
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
                    { title: 'For Founders & Entrepreneurs', desc: 'Discover ready-to-license technologies from Kerala universities, analyze IP validation, and calculate TAM/SAM/SOM to write pitch decks.', icon: <Users size={22} />, color: 'text-blue-600 bg-blue-50' },
                    { title: 'For Researchers & Academics', desc: 'Assess research commercial potential, screen against conflicting patents, and identify industry alignment opportunities for tech transfer.', icon: <Lightbulb size={22} />, color: 'text-amber-600 bg-amber-50' },
                    { title: 'For Universities & Incubators', desc: 'Index institution IP libraries, monitor startup pipelines, and showcase market-ready assets directly to KSUM networks.', icon: <Scale size={22} />, color: 'text-green-600 bg-green-50' }
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

              {/* 5. Sample Conversation & Market Intelligence Preview */}
              <div className="py-20 bg-[#FCFAF8] relative overflow-hidden w-full flex items-center justify-center rounded-[40px] shadow-sm my-4">
                <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center w-full relative z-10">

                  {/* Left Column Text Content */}
                  <div className="w-full flex flex-col justify-center">
                    <h2 className="text-4xl md:text-5xl font-bold font-helios text-gray-900 mb-4 text-left">
                      See Romi in action
                    </h2>
                    <p className="text-gray-500 font-montserrat mb-8 max-w-xl">
                      Instantly generate market intelligence reports, compare technologies, and evaluate startup potential with premium visualizations.
                    </p>

                    {/* 6. ResearchPreneurship CTA Box */}
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

                  {/* Right Column: Premium Interactive Mock Preview Card */}
                  <div className="w-full max-w-xl mx-auto md:ml-auto md:mr-0">
                    <div className="bg-white p-5 sm:p-7 rounded-[32px] shadow-2xl shadow-blue-900/10 border border-gray-100 relative transform sm:rotate-1 hover:rotate-0 transition-all duration-500 overflow-hidden">

                      {/* User Query Layer */}
                      <div className="flex gap-3 items-center mb-6 border-b border-gray-100 pb-4">
                        <div className="w-8 h-8 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center shrink-0 shadow-sm">
                          <User size={16} className="text-gray-500" />
                        </div>
                        <div className="bg-gray-50 p-3 rounded-2xl rounded-tl-sm text-sm font-montserrat text-gray-700 w-full border border-gray-100">
                          Give Market Value of Agritech in 2026?
                        </div>
                      </div>

                      {/* AI System Stream */}
                      <div className="flex gap-3 items-start relative z-10">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1b60bb] to-indigo-700 shadow-md overflow-hidden shrink-0 p-1.5 flex items-center justify-center">
                          <img src="/images/rink-logo.svg" alt="Romi" className="invert brightness-0 w-full h-full object-contain" />
                        </div>

                        <div className="flex flex-col gap-4 w-full">
                          {/* Answer Display Bubble */}
                          <div className="bg-blue-50/50 p-4 rounded-2xl rounded-tr-sm border border-blue-100/50 text-sm font-montserrat text-gray-800 shadow-sm leading-relaxed">
                            The global Agritech market is projected to reach <strong className="text-[#1b60bb]">$43.37 Billion</strong> by 2030, growing at a CAGR of 10.2%.
                          </div>

                          {/* Visual Analytics Matrix Card Component */}
                          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 flex flex-col items-center justify-center gap-5 shadow-inner">
                            <h4 className="font-helios font-bold text-xs text-gray-400 uppercase tracking-widest w-full text-left">
                              TAM / SAM / SOM Breakdown
                            </h4>

                            {/* Stacked Proportional Chart Blocks */}
                            <div className="relative w-full max-w-[200px] flex flex-col items-center justify-end group cursor-pointer">
                              {/* SOM */}
                              <div className="w-1/2 h-10 bg-[#1b60bb] rounded-t-xl border-b border-white/20 flex items-center justify-center text-white font-bold text-[11px] tracking-wide transition-all group-hover:bg-indigo-700 shadow-sm z-30 relative">
                                SOM $2B
                              </div>

                              {/* SAM */}
                              <div className="w-3/4 h-10 bg-blue-300 rounded-t-lg border-b border-white/40 flex items-center justify-center text-blue-900 font-bold text-[11px] tracking-wide transition-all group-hover:bg-blue-400 shadow-sm z-20 relative">
                                SAM $15B
                              </div>

                              {/* TAM */}
                              <div className="w-full h-10 bg-blue-100 rounded-b-xl border border-blue-200/40 flex items-center justify-center text-blue-800 font-bold text-[11px] tracking-wide transition-all group-hover:bg-blue-200 shadow-sm z-10 relative">
                                TAM $43B
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Soft UI Fade Layer */}
                      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white via-white/90 to-transparent rounded-b-[32px] pointer-events-none z-20"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Remaining Page State & Portals */}
            </div>
          </>
        ) : (
          <motion.div
            layoutId="main-container"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex-1 w-full bg-white rounded-[40px] overflow-hidden shadow-2xl border border-gray-100 flex flex-col mx-auto"
          >
            <RomiPortalLayout query={query} onReset={() => { setHasEntered(false); setQuery(''); }} />
          </motion.div>
        )}
      </div>
      {!hasEntered && <Footer />}
    </main>
  );
}