//C:\Users\Akash Krishna\Downloads\RINK KSUM Website\app\RomiPortal\RomiPortalFeatures\RomiPortalLayout.tsx

'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Settings, Download, Share2, ThumbsUp, ThumbsDown, User, Bot, AlertCircle, ArrowUp } from 'lucide-react';
import DataVisualizationPanel from './DataVisualizationPanel';
import RomiThinkingIndicator from './RomiThinkingIndicator';
import IPProtectionNotice from './IPProtectionNotice';
import StorageConsentPopup from './StorageConsentPopup';

import RomiBarChart from './RomiBarChart';
import RomiLineChart from './RomiLineChart';
import RomiPieChart from './RomiPieChart';
import RomiProgressBar from './RomiProgressBar';
import RomiTreeMap from './RomiTreeMap';
import RomiFeatures from './RomiFeatures';

interface RomiPortalLayoutProps {
  query: string;
  onReset: () => void;
}

export default function RomiPortalLayout({ query, onReset }: RomiPortalLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dataPanelOpen, setDataPanelOpen] = useState(true);
  const [showIPNotice, setShowIPNotice] = useState(false);
  const [showConsent, setShowConsent] = useState(false);
  const [isConsentHighlighted, setIsConsentHighlighted] = useState(false);
  
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string | React.ReactNode }[]>([]);
  const [isThinking, setIsThinking] = useState(true);
  const [inputVal, setInputVal] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Read local storage settings safely on mount
  const [consentStatus, setConsentStatus] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const consent = localStorage.getItem('romi-consent');
      const dismissed = sessionStorage.getItem('romi-consent-dismissed');
      
      const hasConsent = consent === 'true';
      setConsentStatus(hasConsent);
      
      // Show consent popup if not consented and not dismissed yet
      if (!consent && !dismissed) {
        setShowConsent(true);
      }
      
      // Auto-collapse sidebars on small screen sizes
      const isMobile = window.innerWidth < 768;
      setSidebarOpen(!isMobile && hasConsent);
      setDataPanelOpen(!isMobile);
    }
  }, []);

  // Scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  // Initial user query response simulation
  useEffect(() => {
    if (query) {
      setMessages([{ role: 'user', content: query }]);
      
      setTimeout(() => {
        setIsThinking(false);
        setMessages(prev => [
          ...prev, 
          { 
            role: 'assistant', 
            content: (
              <div className="flex flex-col gap-6 w-full">
                <div>
                  <p className="mb-4">Here is the market analysis for your query based on our advanced AI estimation model. The global market size is projected to reach <strong className="text-[#1b60bb]">$500B by 2030</strong>.</p>
                  <p>Top competitors currently dominate 60% of the market share, leaving significant room for disruption by emerging technologies.</p>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
                  <RomiLineChart />
                  <RomiPieChart />
                </div>

                <RomiProgressBar overallProgressPercent={65} />
              </div>
            ) 
          }
        ]);
        
        // Show IP Notice after first response if not dismissed
        const dismissedIP = localStorage.getItem('romi-ipr-dismissed') === 'true';
        if (!dismissedIP) {
          setTimeout(() => setShowIPNotice(true), 2000);
        }
      }, 3000);
    }
  }, [query]);

  // Handle Input Lock Clicks
  const handleInputClick = () => {
    if (showConsent) {
      setIsConsentHighlighted(true);
      setTimeout(() => setIsConsentHighlighted(false), 500);
    }
  };

  // Send Message Logic
  // BACKEND API INTEGRATION HINT:
  // To connect the chat UI directly to your AI backend (e.g. FastAPI, Node, or Python frameworks):
  // You would replace the local setTimeout block inside handleSendMessage with an async API fetch call:
  // 
  //   const res = await fetch('/api/chat', { 
  //     method: 'POST', 
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({ message: userMessage }) 
  //   });
  //   const data = await res.json();
  //   setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
  //
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (showConsent || !inputVal.trim()) return;

    const userMessage = inputVal;
    setInputVal('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsThinking(true);

    // Simulate AI thinking and rendering premium charts dynamically
    setTimeout(() => {
      setIsThinking(false);
      const lower = userMessage.toLowerCase();
      let response: React.ReactNode;

      if (lower.includes('bar') || lower.includes('growth') || lower.includes('estimate')) {
        response = (
          <div className="flex flex-col gap-4 w-full">
            <p>Based on our AI estimation index, here is the YoY growth breakdown for the requested technology segment.</p>
            <RomiBarChart />
          </div>
        );
      } else if (lower.includes('line') || lower.includes('projection') || lower.includes('revenue')) {
        response = (
          <div className="flex flex-col gap-4 w-full">
            <p>Here is the 5-year revenue and expansion projection chart derived from active Kerala university research licenses.</p>
            <RomiLineChart />
          </div>
        );
      } else if (lower.includes('pie') || lower.includes('share') || lower.includes('donut')) {
        response = (
          <div className="flex flex-col gap-4 w-full">
            <p>This donut visualization details the market share distribution among key competitors and emerging RINK ecosystem startups.</p>
            <RomiPieChart />
          </div>
        );
      } else if (lower.includes('progress') || lower.includes('stage') || lower.includes('check')) {
        response = (
          <div className="flex flex-col gap-4 w-full">
            <p>Here is your current stage mapping and checklist progress for the ResearchPreneurship workflow validation.</p>
            <RomiProgressBar overallProgressPercent={80} />
          </div>
        );
      } else if (lower.includes('treemap') || lower.includes('sector') || lower.includes('distribution')) {
        response = (
          <div className="flex flex-col gap-4 w-full">
            <p>Our semantic indexing model has mapped technology patent distributions across major commercial sectors:</p>
            <RomiTreeMap />
          </div>
        );
      } else {
        response = (
          <div className="flex flex-col gap-4 w-full">
            <p>I have processed your search query against the RINK database. Please let me know if you would like me to render a <strong>bar chart</strong>, <strong>line chart</strong>, <strong>pie chart</strong>, <strong>progress checklist</strong>, or <strong>sector treemap</strong> for this analysis.</p>
          </div>
        );
      }

      setMessages(prev => [...prev, { role: 'assistant', content: response }]);

      // Prompt IP notice if not dismissed
      const dismissedIP = localStorage.getItem('romi-ipr-dismissed') === 'true';
      if (!dismissedIP) {
        setTimeout(() => setShowIPNotice(true), 1500);
      }
    }, 2000);
  };

  const handleConsentClose = () => {
    setShowConsent(false);
    const consent = localStorage.getItem('romi-consent') === 'true';
    setConsentStatus(consent);
    if (consent) {
      setSidebarOpen(true);
    }
    // Set dismiss flag for session if skipped
    if (!consent) {
      sessionStorage.setItem('romi-consent-dismissed', 'true');
    }
  };

  return (
    <div className="flex w-full h-full bg-[#FDFDF9] overflow-hidden relative">
      
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full relative overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-gray-100 bg-white/80 backdrop-blur-md flex items-center justify-between px-6 z-10">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#1b60bb] rounded-lg flex items-center justify-center text-white font-bold font-helios text-sm">
                R
              </div>
              <span className="font-helios font-bold text-[#333] hidden sm:inline">Romi AI</span>
            </div>
            <h2 className="font-helios font-semibold text-gray-800 text-sm border-l border-gray-200 pl-4">Research Analysis</h2>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors" title="Export as PDF">
              <Download size={18} />
            </button>
            <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors" title="Share Link">
              <Share2 size={18} />
            </button>
            
            {/* Collapsible history trigger */}
            {consentStatus && (
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className={`p-2 rounded-lg transition-colors ${sidebarOpen ? 'bg-blue-50 text-[#1b60bb]' : 'text-gray-500 hover:bg-gray-100'}`}
                title="Toggle Saved Chats"
              >
                <MessageSquare size={18} />
              </button>
            )}

            {/* Collapsible data panel trigger */}
            <button 
              onClick={() => setDataPanelOpen(!dataPanelOpen)}
              className={`p-2 rounded-lg transition-colors ${dataPanelOpen ? 'bg-blue-50 text-[#1b60bb]' : 'text-gray-500 hover:bg-gray-100'}`}
              title="Toggle Market Visualizations"
            >
              <Settings size={18} />
            </button>

            <button onClick={onReset} className="px-3.5 py-1.5 bg-gray-150 text-gray-700 text-xs font-bold rounded-xl hover:bg-gray-200 transition-colors shadow-sm ml-2">
              New Search
            </button>
          </div>
        </header>

        {/* Chat Content Feed */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth flex flex-col gap-8 pb-32">
          {messages.map((msg, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-4 max-w-4xl w-full ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
            >
              {msg.role === 'user' ? (
                <div className="w-9 h-9 rounded-xl bg-gray-200 flex items-center justify-center shrink-0 shadow-sm">
                  <User size={18} className="text-gray-600" />
                </div>
              ) : (
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#1b60bb] to-indigo-500 relative flex items-center justify-center shrink-0 shadow-md overflow-visible border border-white/20">
                  <div className="absolute -top-2 w-10 h-10 flex items-center justify-center overflow-visible">
                    <Bot size={22} className="text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.25)] transform -translate-y-0.5 scale-110" />
                  </div>
                </div>
              )}
              <div className={`p-5 rounded-2xl ${msg.role === 'user' ? 'bg-gray-100 rounded-tr-sm' : 'bg-white border border-gray-100 shadow-sm rounded-tl-sm'} font-montserrat text-xs sm:text-sm text-gray-800 leading-relaxed max-w-3xl w-full`}>
                {msg.content}
                
                {msg.role === 'assistant' && (
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-50 text-gray-400">
                    <button className="p-1 hover:text-[#1b60bb] hover:bg-blue-50 rounded transition-colors"><ThumbsUp size={14} /></button>
                    <button className="p-1 hover:text-red-500 hover:bg-red-50 rounded transition-colors"><ThumbsDown size={14} /></button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
          
          {isThinking && (
            <div className="mr-auto">
              <RomiThinkingIndicator />
            </div>
          )}

          {/* KSUM Eligibility and stats wrapper */}
          {!isThinking && messages.length > 1 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mr-auto w-full max-w-4xl"
            >
              <RomiFeatures />
            </motion.div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Dynamic Chat Messaging Input Form */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#FDFDF9] via-[#FDFDF9]/95 to-transparent p-5 z-20">
          <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto relative flex items-center">
            <input 
              type="text"
              placeholder={showConsent ? "Please accept or skip storage consent to unlock chatting..." : "Ask Romi (e.g. show me a line chart, pie chart, progress bar, treemap)..."}
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              disabled={showConsent}
              onClick={handleInputClick}
              className={`w-full bg-white border rounded-2xl py-3.5 pl-5 pr-14 shadow-lg text-xs sm:text-sm font-montserrat focus:outline-none focus:ring-2 focus:ring-[#1b60bb]/20 transition-all ${
                showConsent 
                  ? 'border-amber-200 cursor-not-allowed bg-amber-50/10 placeholder-amber-400/70' 
                  : 'border-gray-150 focus:border-[#1b60bb]'
              }`}
            />
            <button 
              type="submit"
              disabled={showConsent || !inputVal.trim()}
              className="absolute right-2 p-2.5 bg-[#1b60bb] hover:bg-[#154d96] text-white rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-md"
            >
              <ArrowUp size={16} />
            </button>
          </form>
          <p className="text-[9px] text-center text-gray-400 mt-2 font-montserrat">
            ROMI AI is powered by KSUM's University patent registries. Verify core inventions before sharing technical disclosures.
          </p>
        </div>
      </div>

      {/* Session Sidebar (Right side, collapsible, active only if consentStatus is true) */}
      <AnimatePresence>
        {consentStatus && sidebarOpen && (
          <motion.div 
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="h-full bg-white border-l border-gray-100 flex flex-col overflow-hidden shrink-0"
          >
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <span className="font-helios font-bold text-xs text-gray-700 uppercase tracking-wider">Chat History</span>
              <span className="text-[8px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">Saved Local</span>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
              <div className="p-3 bg-blue-50/50 text-[#1b60bb] rounded-xl cursor-pointer hover:bg-blue-50 transition-colors flex items-center gap-3 border border-blue-100">
                <MessageSquare size={14} className="opacity-70 shrink-0" />
                <span className="text-xs font-montserrat font-bold truncate">Nvidia Market Analysis</span>
              </div>
              <div className="p-3 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors flex items-center gap-3 text-gray-600">
                <MessageSquare size={14} className="opacity-50 shrink-0" />
                <span className="text-xs font-montserrat truncate">Kerala Agri-Tech Scope</span>
              </div>
            </div>
            
            <div className="p-4 border-t border-gray-100 bg-gray-50/30">
              <button 
                onClick={() => {
                  localStorage.removeItem('romi-consent');
                  localStorage.removeItem('romi-ipr-dismissed');
                  setConsentStatus(false);
                  setSidebarOpen(false);
                }}
                className="flex items-center justify-center gap-2 text-[10px] font-bold text-red-500 hover:text-red-700 transition-colors w-full p-2 border border-dashed border-red-200 rounded-xl"
              >
                Clear History & Revoke Consent
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Market Data Panel (Far Right, collapsible) */}
      <AnimatePresence>
        {dataPanelOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 340, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="h-full shrink-0"
          >
            <DataVisualizationPanel />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Storage Consent Popup (Bottom-Right, locks input when active) */}
      {showConsent && (
        <StorageConsentPopup 
          onClose={handleConsentClose} 
          isHighlighted={isConsentHighlighted} 
        />
      )}

      {/* IP Protection Notice advisory toast drawer (Bottom-Right, stays in session state) */}
      {showIPNotice && (
        <IPProtectionNotice onClose={() => setShowIPNotice(false)} />
      )}
      
    </div>
  );
}

