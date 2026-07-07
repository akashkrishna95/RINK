'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Settings, Download, Share2, ThumbsUp, ThumbsDown, User, Bot, ArrowUp, X } from 'lucide-react';
import DataVisualizationPanel from './RomiPortalFeatures/DataVisualizationPanel';
import RomiThinkingIndicator from './RomiPortalFeatures/RomiThinkingIndicator';
import IPProtectionNotice from './RomiPortalFeatures/IPProtectionNotice';
import StorageConsentPopup from './RomiPortalFeatures/StorageConsentPopup';

import RomiBarChart from './RomiPortalFeatures/RomiBarChart';
import RomiLineChart from './RomiPortalFeatures/RomiLineChart';
import RomiPieChart from './RomiPortalFeatures/RomiPieChart';
import RomiProgressBar from './RomiPortalFeatures/RomiProgressBar';
import RomiTreeMap from './RomiPortalFeatures/RomiTreeMap';
import RomiFeatures from './RomiPortalFeatures/RomiFeatures';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import ComparisonTable, { TableHead, TableRow, TableHeaderCell, TableCell } from '../../HomePage/RomiAI/ComparisonTable';
import MiniCard from './RomiPortalFeatures/MiniCard';
import { useRomiStorage } from './useRomiStorage';

interface RomiPortalLayoutProps {
  query: string;
  onReset: () => void;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  technologies?: any[];
  actionTrigger?: {
    label: string;
    url: string;
  };
}

export default function RomiPortalLayout({ query, onReset }: RomiPortalLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Data panel defaults to false so it doesn't show up until a market query triggers it
  const [dataPanelOpen, setDataPanelOpen] = useState(false); 
  const [activeMarketQuery, setActiveMarketQuery] = useState<string>(''); // Holds the exact text to feed to the scraper
  
  const [showIPNotice, setShowIPNotice] = useState(false);
  const [showConsent, setShowConsent] = useState(false);
  const [isConsentHighlighted, setIsConsentHighlighted] = useState(false);
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);
  const hasFiredInitial = useRef<boolean>(false); 

  const [consentStatus, setConsentStatus] = useState<boolean>(false);
  const { sessions, currentSessionId, createNewSession, updateCurrentSession, loadSession, clearAllHistory } = useRomiStorage(consentStatus);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const consent = localStorage.getItem('romi-consent');
      const hasConsent = consent === 'true';
      setConsentStatus(hasConsent);
      
      if (!consent) {
        setShowConsent(true);
      }
      
      const isMobile = window.innerWidth < 768;
      setSidebarOpen(!isMobile && hasConsent);
      // Ensure panel starts closed
      setDataPanelOpen(false); 
    }
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  const executeSearch = async (queryText: string, currentMessages: Message[]) => {
    setIsThinking(true);
    
    const history = currentMessages.map(m => ({
      role: m.role,
      content: m.content
    }));

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/api/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: queryText,
          limit: 20,
          history: history.slice(-6),
          current_package: "researchpreneurship"
        }),
      });

      if (!response.ok) throw new Error("API Connection Failed");

      const resData = await response.json();

      // Trigger the visualization panel if the backend flagged this as a market intent question
      if (resData.show_visuals) {
        setActiveMarketQuery(queryText);
        setDataPanelOpen(true);
      }

      if (resData.status === "redirect") {
        const urlMatch = resData.ai_answer.match(/\[REDIRECT:(.*?)\]/);
        const redirectUrl = urlMatch ? urlMatch[1] : 'https://ksum-rink.vercel.app/RomiPortal';
        
        const botMsg: Message = {
          role: 'assistant',
          content: resData.ai_answer.replace(/\[REDIRECT:.*?\]/, ''),
          actionTrigger: {
            label: "Open in Romi Portal →",
            url: redirectUrl
          }
        };

        setMessages(prev => {
          const updated = [...prev, botMsg];
          if (consentStatus) updateCurrentSession(updated);
          return updated;
        });
        return;
      }

      if (resData.status === "success" || resData.ai_answer) {
        const botMsg: Message = {
          role: 'assistant',
          content: resData.ai_answer || `I found ${resData.match_count || 0} market-ready asset match(es) in the RINK database corresponding to your request.`,
          technologies: resData.data || []
        };
        setMessages(prev => {
          const updated = [...prev, botMsg];
          if (consentStatus) updateCurrentSession(updated);
          return updated;
        });
      } else {
        const botMsg: Message = {
          role: 'assistant',
          content: "I couldn't find any technologies matching that specific description. Try modifying your terms or sector tags."
        };
        setMessages(prev => {
          const updated = [...prev, botMsg];
          if (consentStatus) updateCurrentSession(updated);
          return updated;
        });
      }
    } catch (error) {
      console.warn("ROMI API connection issue.");
      const botMsg: Message = {
        role: 'assistant',
        content: "Oops! I'm having trouble accessing my central database brain right now. Make sure your local FastAPI backend server is up and running!"
      };
      setMessages(prev => {
        const updated = [...prev, botMsg];
        if (consentStatus) updateCurrentSession(updated);
        return updated;
      });
    } finally {
      setIsThinking(false);
    }
  };

  useEffect(() => {
    if (query && !hasFiredInitial.current) {
      hasFiredInitial.current = true;
      const initialMsg: Message = { role: 'user', content: query };
      setMessages([initialMsg]);
      
      const directConsent = typeof window !== 'undefined' && localStorage.getItem('romi-consent') === 'true';
      if (directConsent) {
        createNewSession(initialMsg);
      }
      
      executeSearch(query, [initialMsg]);
      
      const dismissedIP = localStorage.getItem('romi-ipr-dismissed') === 'true';
      if (!dismissedIP) {
        setTimeout(() => setShowIPNotice(true), 4000);
      }
    }
  }, [query]);

  const renderInlineVisuals = (text: string) => {
    const lower = text.toLowerCase();
    const charts: React.ReactNode[] = [];
    
    if (lower.includes('bar chart') || lower.includes('growth breakdown') || lower.includes('yo-yo growth') || lower.includes('growth projection')) {
      charts.push(<RomiBarChart key="bar" />);
    }
    if (lower.includes('line chart') || lower.includes('projection chart') || lower.includes('revenue projection')) {
      charts.push(<RomiLineChart key="line" />);
    }
    if (lower.includes('pie chart') || lower.includes('donut chart') || lower.includes('market share') || lower.includes('share distribution')) {
      charts.push(<RomiPieChart key="pie" />);
    }
    if (lower.includes('progress bar') || lower.includes('checklist') || lower.includes('stage mapping') || lower.includes('progress checklist') || lower.includes('researchpreneurship flow')) {
      charts.push(<RomiProgressBar key="progress" overallProgressPercent={80} />);
    }
    if (lower.includes('treemap') || lower.includes('sector distribution') || lower.includes('patent distribution')) {
      charts.push(<RomiTreeMap key="treemap" />);
    }
    
    if (charts.length === 0) return null;
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full mt-6">
        {charts}
      </div>
    );
  };

  const handleInputClick = () => {
    if (showConsent) {
      setIsConsentHighlighted(true);
      setTimeout(() => setIsConsentHighlighted(false), 500);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (showConsent || !inputVal.trim()) return;

    const userMessage = inputVal.trim();
    setInputVal('');
    const newMsg: Message = { role: 'user', content: userMessage };
    const updatedMessages = [...messages, newMsg];
    
    setMessages(updatedMessages);
    
    if (consentStatus) {
      if (!currentSessionId) createNewSession(newMsg);
      else updateCurrentSession(updatedMessages);
    }
    
    executeSearch(userMessage, updatedMessages);
  };

  const handleConsentClose = () => {
    setShowConsent(false);
    const consent = localStorage.getItem('romi-consent') === 'true';
    setConsentStatus(consent);
    if (consent) {
      setSidebarOpen(true);
    }
  };

  return (
    <div className="flex w-full h-full bg-[#FDFDF9] overflow-hidden relative">
      <div className="flex-1 flex flex-col h-full relative overflow-hidden">
        <header className="h-16 border-b border-gray-100 bg-white/80 backdrop-blur-md flex items-center justify-between px-6 z-10">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#1b60bb] rounded-lg flex items-center justify-center text-white font-bold font-helios text-sm">R</div>
              <span className="font-helios font-bold text-[#333] hidden sm:inline">Romi AI</span>
            </div>
            <h2 className="font-helios font-semibold text-gray-800 text-sm border-l border-gray-200 pl-4 hidden sm:inline-block">Research Analysis</h2>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors" title="Export as PDF"><Download size={18} /></button>
            <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors" title="Share Link"><Share2 size={18} /></button>
            
            {consentStatus && (
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className={`p-2 rounded-lg transition-colors ${sidebarOpen ? 'bg-blue-50 text-[#1b60bb]' : 'text-gray-500 hover:bg-gray-100'}`}
                title="Toggle Saved Chats"
              >
                <MessageSquare size={18} />
              </button>
            )}

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
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#1b60bb] to-indigo-500 relative flex items-center justify-center shrink-0 shadow-md border border-white/20">
                  <div className="absolute -top-2 w-10 h-10 flex items-center justify-center">
                    <Bot size={22} className="text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.25)] transform -translate-y-0.5 scale-110" />
                  </div>
                </div>
              )}
              <div className={`p-5 rounded-2xl ${msg.role === 'user' ? 'bg-gray-100 rounded-tr-sm' : 'bg-white border border-gray-100 shadow-sm rounded-tl-sm'} font-montserrat text-xs sm:text-sm text-gray-800 leading-relaxed max-w-3xl w-full`}>
                {msg.role === 'user' ? (
                  <span className="whitespace-pre-line">{msg.content}</span>
                ) : (
                  <div className="prose prose-sm max-w-none prose-slate text-gray-800 text-[13px] leading-relaxed">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        table: ({ children }) => <ComparisonTable>{children}</ComparisonTable>,
                        thead: ({ children }) => <TableHead>{children}</TableHead>,
                        tr: ({ children }) => <TableRow>{children}</TableRow>,
                        th: ({ children }) => <TableHeaderCell>{children}</TableHeaderCell>,
                        td: ({ children }) => <TableCell>{children}</TableCell>,
                        ul: ({ children }) => <ul className="list-disc pl-5 my-2 space-y-1">{children}</ul>,
                        ol: ({ children }) => <ol className="list-decimal pl-5 my-2 space-y-1">{children}</ol>,
                        li: ({ children }) => <li className="my-0.5">{children}</li>,
                        p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
                        strong: ({ children }) => <strong className="font-bold text-[#1b60bb]">{children}</strong>,
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>

                    {msg.technologies && msg.technologies.length > 0 && (
                      <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-gray-100">
                        <p className="font-semibold text-gray-700 mb-1">Matching Technologies:</p>
                        {msg.technologies.map((tech) => (
                          <MiniCard key={tech.technology_id} technology={tech} />
                        ))}
                      </div>
                    )}

                    {renderInlineVisuals(msg.content)}

                    {msg.actionTrigger && (
                      <div className="mt-4">
                        <a 
                          href={msg.actionTrigger.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block bg-[#1b60bb] hover:bg-[#154d96] text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-colors shadow-sm"
                        >
                          {msg.actionTrigger.label}
                        </a>
                      </div>
                    )}
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

          {!isThinking && (() => {
            const lastMsg = [...messages].reverse().find(m => m.role === 'assistant');
            if (!lastMsg) return null;
            
            const isDefaultGreeting = lastMsg.content.includes("I'm RINK Assistant, your guide to Kerala's research technology ecosystem");
            if (isDefaultGreeting) return null;

            const showRomiFeatures = 
              lastMsg.content.toLowerCase().includes('eligibility') || 
              lastMsg.content.toLowerCase().includes('ksum program') || 
              lastMsg.content.toLowerCase().includes('startup mission') ||
              lastMsg.content.toLowerCase().includes('funding program') ||
              lastMsg.content.toLowerCase().includes('assessment');
              
            if (!showRomiFeatures) return null;
            return (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mr-auto w-full max-w-4xl"
              >
                <RomiFeatures />
              </motion.div>
            );
          })()}

          <div ref={chatEndRef} />
        </div>

        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#FDFDF9] via-[#FDFDF9]/95 to-transparent p-5 z-20">
          <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto relative flex items-center">
            <input 
              type="text"
              placeholder={showConsent ? "Please accept or skip storage consent to unlock chatting..." : "Ask Romi..."}
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              disabled={showConsent}
              onClick={handleInputClick}
              className={`w-full bg-white border rounded-2xl py-3.5 pl-5 pr-14 shadow-lg text-xs sm:text-sm font-montserrat text-black focus:outline-none focus:ring-2 focus:ring-[#1b60bb]/20 transition-all ${
                showConsent ? 'border-amber-200 cursor-not-allowed bg-amber-50/10 placeholder-amber-400/70' : 'border-gray-150 focus:border-[#1b60bb]'
              }`}
            />
            <button 
              type="submit"
              disabled={showConsent || !inputVal.trim()}
              className="absolute right-2 w-9 h-9 bg-black hover:bg-gray-800 text-white rounded-full flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-md"
            >
              <ArrowUp size={16} className="text-white" />
            </button>
          </form>
          <p className="text-[9px] text-center text-gray-400 mt-2 font-montserrat">
            ROMI AI is powered by KSUM's University patent registries. Verify core inventions before sharing technical disclosures.
          </p>
        </div>
      </div>

      <AnimatePresence>
        {consentStatus && sidebarOpen && (
          <motion.div 
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="h-full bg-white border-l border-gray-100 flex flex-col overflow-hidden shrink-0 absolute lg:relative right-0 top-0 z-30 shadow-2xl lg:shadow-none"
          >
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <span className="font-helios font-bold text-xs text-gray-700 uppercase tracking-wider">Chat History</span>
              <div className="flex items-center gap-2">
                <span className="text-[8px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">Saved Local</span>
                <button 
                  onClick={() => setSidebarOpen(false)}
                  className="lg:hidden p-1 text-gray-500 hover:bg-gray-200 rounded-lg transition-colors"
                  title="Close sidebar"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
              {sessions.length === 0 ? (
                <p className="text-xs text-gray-400 text-center mt-4 font-montserrat">No saved chats yet.</p>
              ) : (
                sessions.map((session) => (
                  <div 
                    key={session.id}
                    onClick={() => {
                      const loadedMsgs = loadSession(session.id);
                      if (loadedMsgs) setMessages(loadedMsgs);
                    }}
                    className={`p-3 rounded-xl cursor-pointer transition-colors flex items-center gap-3 border ${currentSessionId === session.id ? 'bg-blue-50/50 text-[#1b60bb] border-blue-100' : 'hover:bg-gray-50 text-gray-600 border-transparent'}`}
                  >
                    <MessageSquare size={14} className="opacity-70 shrink-0" />
                    <span className="text-xs font-montserrat font-bold truncate">{session.title}</span>
                  </div>
                ))
              )}
            </div>
            
            <div className="p-4 border-t border-gray-100 bg-gray-50/30">
              <button 
                onClick={() => {
                  clearAllHistory();
                  localStorage.removeItem('romi-consent');
                  localStorage.removeItem('romi-ipr-dismissed');
                  setConsentStatus(false);
                  setSidebarOpen(false);
                  setMessages([]);
                }}
                className="flex items-center justify-center gap-2 text-[10px] font-bold text-red-500 hover:text-red-700 transition-colors w-full p-2 border border-dashed border-red-200 rounded-xl"
              >
                Clear History & Revoke Consent
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {dataPanelOpen && (
          <motion.div 
            initial={{ width: 0, opacity: 0 }} 
            animate={{ width: 340, opacity: 1 }} 
            exit={{ width: 0, opacity: 0 }} 
            className="h-full shrink-0 absolute lg:relative right-0 top-0 z-30 shadow-2xl lg:shadow-none bg-white"
          >
            {/* Injecting the dynamic query prop here */}
            <DataVisualizationPanel latestUserQuery={activeMarketQuery || query || ""} onClose={() => setDataPanelOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {showConsent && <StorageConsentPopup onClose={handleConsentClose} isHighlighted={isConsentHighlighted} />}
      {showIPNotice && <IPProtectionNotice onClose={() => setShowIPNotice(false)} />}
    </div>
  );
}