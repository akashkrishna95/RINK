//C:\Users\Akash Krishna\Downloads\RINK KSUM Website\app\RomiPortal\RomiPortalLayout.tsx

'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Settings, Download, Share2, User, Bot, ArrowUp, Trash2, ChevronLeft, ChevronRight, Plus, Sun, Moon, Search, Cpu, Wrench, Lightbulb } from 'lucide-react';

import DataVisualizationPanel from './RomiPortalFeatures/DataVisualizationPanel';
import RomiThinkingIndicator from './RomiPortalFeatures/RomiThinkingIndicator';
import IPProtectionNotice from './RomiPortalFeatures/IPProtectionNotice';
import StorageConsentPopup from './RomiPortalFeatures/StorageConsentPopup';
import RomiProgressBar from './RomiPortalFeatures/RomiProgressBar';
import RomiFeatures from './RomiPortalFeatures/RomiFeatures';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import ComparisonTable, { TableHead, TableRow, TableHeaderCell, TableCell } from '@/HomePage/RomiAI/ComparisonTable';
import MiniCard from './RomiPortalFeatures/MiniCard';
import { useRomiStorage } from './useRomiStorage';

import { parseRomiVisuals, renderSourceLinks, SourceAnchor, VizGrid } from './RomiPortalFeatures/VizRenderer';

interface RomiPortalLayoutProps {
  query: string;
  onReset: () => void;
  activeMode?: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  technologies?: any[];
  actionTrigger?: { label: string; url: string; };
}

export default function RomiPortalLayout({ query, onReset, activeMode = "whole website" }: RomiPortalLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dataPanelOpen, setDataPanelOpen] = useState(false); 
  const [activeMarketQuery, setActiveMarketQuery] = useState<string>(''); 
  const [showIPNotice, setShowIPNotice] = useState(false);
  const [showConsent, setShowConsent] = useState(false);
  const [isConsentHighlighted, setIsConsentHighlighted] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);
  const [isBackNavigationPending, setIsBackNavigationPending] = useState(false);
  const ignorePopStateRef = useRef(false);
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [inputVal, setInputVal] = useState('');
  
  const [assessmentState, setAssessmentState] = useState<{progress: number, stages: any[]}>({ progress: 0, stages: [] });

  const chatEndRef = useRef<HTMLDivElement>(null);
  const hasFiredInitial = useRef<boolean>(false); 
  const textareaRef = useRef<HTMLTextAreaElement>(null); // NEW: Ref for the expanding textarea
  const [darkMode, setDarkMode] = useState(false);
  const [mode, setMode] = useState<string>(activeMode);
  const [showModeDropdown, setShowModeDropdown] = useState(false);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });

  const sessionRef = useRef<string>(`romi-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`);

  const [consentStatus, setConsentStatus] = useState<boolean>(false);
  const { sessions, currentSessionId, setCurrentSessionId, createNewSession, updateCurrentSession, loadSession, deleteSession, clearAllHistory } = useRomiStorage(consentStatus);
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const consent = localStorage.getItem('romi-consent');
      const hasConsent = consent === 'true';
      setConsentStatus(hasConsent);
      
      const handleResize = () => {
        setIsMobileView(window.innerWidth < 768);
      };
      
      handleResize();
      const isMobile = window.innerWidth < 768;
      setSidebarOpen(!isMobile && hasConsent);
      
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (localStorage.getItem('romi-consent') === 'true') return;
      e.preventDefault();
      e.returnValue = '';
      return '';
    };

    const handleVisibilityChange = () => {
      if (localStorage.getItem('romi-consent') === 'true') return;
      if (document.visibilityState === 'hidden') {
        setShowConsent(true);
      }
    };

    const handleGlobalClick = (e: MouseEvent) => {
      if (localStorage.getItem('romi-consent') === 'true') return;

      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (!href) return;

      const isHash = href.startsWith('#') || href.startsWith('javascript:');
      const isBlobOrDownload = href.startsWith('blob:') || anchor.hasAttribute('download');
      
      if (!isHash && !isBlobOrDownload) {
        e.preventDefault();
        e.stopPropagation();
        setPendingNavigation(href);
        setShowConsent(true);
      }
    };

    const handlePopState = (event: PopStateEvent) => {
      if (ignorePopStateRef.current) {
        ignorePopStateRef.current = false;
        return;
      }

      if (localStorage.getItem('romi-consent') === 'true') return;

      // User pressed back button:
      // Show warning consent popup, mark back navigation as pending
      setIsBackNavigationPending(true);
      setShowConsent(true);
      // Re-push state to keep the back prevention block active
      window.history.pushState({ romiPreventBack: true }, '');
    };

    // If consent has not been granted, push dummy state to prevent back navigation
    if (typeof window !== 'undefined' && localStorage.getItem('romi-consent') !== 'true') {
      window.history.pushState({ romiPreventBack: true }, '');
    }

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('click', handleGlobalClick, true);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('click', handleGlobalClick, true);
      window.removeEventListener('popstate', handlePopState);

      // Clean up the dummy state on unmount if it's still present in the history state
      if (
        typeof window !== 'undefined' &&
        window.history.state?.romiPreventBack &&
        localStorage.getItem('romi-consent') !== 'true'
      ) {
        ignorePopStateRef.current = true;
        window.history.back();
      }
    };
  }, []);

  const handleConsentPopupClose = () => {
    const hasConsent = localStorage.getItem('romi-consent') === 'true';
    setConsentStatus(hasConsent);
    setShowConsent(false);

    if (!hasConsent) {
      // If the user skipped/declined consent, delete the active temporary chat session from device storage
      if (sessionRef.current) {
        deleteSession(sessionRef.current);
      }
    }

    if (isBackNavigationPending) {
      setIsBackNavigationPending(false);
      // We need to navigate back past the pushed states. Since we pushed states twice
      // (one on mount/reset and one when popstate fired), we need to go back 2 steps in history.
      ignorePopStateRef.current = true;
      window.history.go(-2);
      return;
    }

    if (pendingNavigation) {
      const destination = pendingNavigation;
      setPendingNavigation(null);
      window.location.href = destination;
    }
  };

  const handleClearHistory = () => {
    setConfirmModal({
      isOpen: true,
      title: "Delete all chats?",
      message: "Are you sure you want to delete all conversations? This will erase your local chat history and reset storage settings.",
      onConfirm: () => {
        setMessages([]);
        clearAllHistory();
        localStorage.removeItem('romi-consent');
        setConsentStatus(false);
        hasFiredInitial.current = false;
        onReset();
      }
    });
  };

  const handleNewChat = () => {
    setMessages([]);
    setCurrentSessionId(null);
    hasFiredInitial.current = false;
    sessionRef.current = `romi-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  };

  const handleSelectSession = (id: string) => {
    const loadedMessages = loadSession(id);
    if (loadedMessages) {
      setMessages(loadedMessages);
      sessionRef.current = id;
    }
  };

  const handleDeleteSession = (id: string) => {
    setConfirmModal({
      isOpen: true,
      title: "Delete chat session?",
      message: "Are you sure you want to delete this chat session?",
      onConfirm: () => {
        deleteSession(id);
        if (currentSessionId === id) {
          setMessages([]);
          hasFiredInitial.current = false;
          sessionRef.current = `romi-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        }
      }
    });
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  const executeSearch = async (queryText: string, currentMessages: Message[]) => {
    setIsThinking(true);
    const history = currentMessages.map(m => ({ role: m.role, content: m.content }));
    
    const apiUrl = 'http://127.0.0.1:8000';

    try {
      const response = await fetch(`${apiUrl}/api/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: queryText,
          limit: 5,
          history: history.slice(-8),
          
          // CRITICAL FIX: Dynamically send the current mode to the backend router!
          current_package: mode || "search",          
          
          session_id: sessionRef.current,       
        }),
      });

      if (!response.ok) throw new Error("API Connection Failed");
      const resData = await response.json();

      if (resData.assessment) {
        setAssessmentState({ progress: resData.assessment.progress, stages: resData.assessment.stages });
      }

      if (resData.show_visuals) {
        setActiveMarketQuery(queryText);
        setDataPanelOpen(true);
      }

      if (resData.report_ready) {
        const download = async (format: 'docx' | 'pdf') => {
          const res = await fetch(`${apiUrl}/api/generate-report`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ session_id: sessionRef.current, format }),
          });
          if (!res.ok) return alert((await res.json()).detail);
          const blob = await res.blob();
          const a = Object.assign(document.createElement('a'), {
            href: URL.createObjectURL(blob),
            download: `KSUM_ConceptNote.${format}`,
          });
          a.click(); URL.revokeObjectURL(a.href);
        };

        setMessages(prev => [...prev, {
          role: 'assistant',
          content: resData.ai_answer,
          actionTrigger: { label: "Download DOCX Concept Note ↓", url: "#" }, 
        }]);
        return;
      }

      if (resData.status === "redirect") {
        const urlMatch = resData.ai_answer.match(/\[REDIRECT:(.*?)\]/);
        const botMsg: Message = {
          role: 'assistant',
          content: resData.ai_answer.replace(/\[REDIRECT:.*?\]/, ''),
          actionTrigger: { label: "Open in Romi Portal →", url: urlMatch ? urlMatch[1] : 'http://localhost:3000/RomiPortal' }
        };
        setMessages(prev => { const updated = [...prev, botMsg]; updateCurrentSession(updated); return updated; });
        return;
      }

      const botMsg: Message = {
        role: 'assistant',
        content: resData.ai_answer || `I found ${resData.match_count || 0} match(es).`,
        technologies: resData.data || []
      };
      
      setMessages(prev => { const updated = [...prev, botMsg]; updateCurrentSession(updated); return updated; });
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: "I'm having trouble connecting to the backend. Please check if your local FastAPI server is running on port 8000." }]);
    } finally {
      setIsThinking(false);
    }
  };

  useEffect(() => {
    if (query && !hasFiredInitial.current) {
      hasFiredInitial.current = true;
      const initialMsg: Message = { role: 'user', content: query };
      setMessages([initialMsg]);
      if (typeof window !== 'undefined') {
        const newId = createNewSession(initialMsg);
        if (newId) sessionRef.current = newId;
      }
      executeSearch(query, [initialMsg]);
    }
  }, [query]);

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (showConsent || !inputVal.trim()) return;
    const userMessage = inputVal.trim();
    setInputVal('');
    
    // Reset textarea height after sending
    if (textareaRef.current) {
      textareaRef.current.style.height = '52px';
    }

    const newMsg: Message = { role: 'user', content: userMessage };
    const updatedMessages = [...messages, newMsg];
    setMessages(updatedMessages);
    if (!currentSessionId) {
      const newId = createNewSession(newMsg);
      if (newId) sessionRef.current = newId;
    } else {
      updateCurrentSession(updatedMessages);
    }
    executeSearch(userMessage, updatedMessages);
  };

  // NEW: Dynamic Textarea Auto-Resize Logic
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setInputVal(val);
    if (val.length <= 200) {
      e.target.style.height = 'auto'; // Reset height briefly to recalculate
      e.target.style.height = `${e.target.scrollHeight}px`;
    } else {
      e.target.style.height = '120px'; // Cap height
    }
  };

  // NEW: Submit on 'Enter', New Line on 'Shift + Enter'
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className={`flex flex-1 min-h-0 w-full h-full bg-[#FDFDF9] overflow-hidden relative ${darkMode ? 'dark' : ''}`}>
      {/* Sidebar - ChatGPT/Gemini Style */}
      <AnimatePresence>
        {sidebarOpen && consentStatus && (
          <>
            {/* Backdrop overlay for mobile */}
            {isMobileView && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                exit={{ opacity: 0 }}
                onClick={() => setSidebarOpen(false)}
                className="absolute inset-0 bg-black z-35 cursor-pointer"
              />
            )}

            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: isMobileView ? 280 : 260, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="absolute md:relative top-0 left-0 h-full bg-gradient-to-b from-[#EAE8E2] via-[#E2E0D8] to-[#D9D7CE] dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-900 border-r border-gray-300 dark:border-zinc-800 flex flex-col shrink-0 overflow-hidden z-40 shadow-[4px_0_24px_rgba(0,0,0,0.04)] dark:shadow-none"
            >
              <div className="w-[280px] md:w-[260px] flex flex-col h-full p-4 gap-4">
                {/* New Chat Button */}
                <button
                  onClick={handleNewChat}
                  type="button"
                  className="w-full flex items-center gap-2.5 px-4 py-3 rounded-2xl border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-700 text-gray-800 dark:text-gray-200 text-sm font-bold transition-all shadow-md active:scale-98 cursor-pointer font-helios"
                >
                  <Plus size={16} className="text-[#1b60bb] dark:text-blue-400" />
                  New Chat
                </button>

                {/* Scrollable list of recent sessions */}
                <div className="flex-1 overflow-y-auto flex flex-col gap-1.5 pr-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500 dark:text-zinc-500 px-2 block mb-1">Recent Chats</span>
                  {sessions.length === 0 ? (
                    <p className="text-xs text-gray-400 italic px-2">No recent chats</p>
                  ) : (
                    sessions.map(session => (
                      <div
                        key={session.id}
                        className={`group flex items-center justify-between rounded-xl px-3 py-2.5 transition-all cursor-pointer ${
                          currentSessionId === session.id 
                            ? 'bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 text-black dark:text-white font-bold shadow-md shadow-black/5' 
                            : 'hover:bg-[#d5d2c6]/60 dark:hover:bg-zinc-800/45 text-gray-700 dark:text-zinc-300'
                        }`}
                        onClick={() => handleSelectSession(session.id)}
                      >
                        <div className="flex items-center gap-2 overflow-hidden flex-1">
                          <MessageSquare size={14} className={currentSessionId === session.id ? 'text-[#1b60bb] dark:text-blue-400' : 'text-gray-500 dark:text-zinc-400'} />
                          <span className="text-xs truncate">{session.title}</span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteSession(session.id);
                          }}
                          type="button"
                          className="opacity-100 md:opacity-0 md:group-hover:opacity-100 p-1 hover:bg-[#d5d2c6]/60 dark:hover:bg-zinc-800/60 rounded-lg text-gray-500 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-400 transition-all cursor-pointer shrink-0"
                          title="Delete Chat"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))
                  )}
                </div>

                {/* Bottom Section */}
                <div className="border-t border-gray-200 dark:border-zinc-800 pt-4 mt-auto">
                  <button
                    onClick={handleClearHistory}
                    type="button"
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-red-200/80 dark:border-red-950/35 bg-red-50 dark:bg-red-950/10 hover:bg-red-100 dark:hover:bg-red-950/20 text-red-600 dark:text-red-400 text-xs font-bold transition-all shadow-[0_2px_8px_rgba(239,68,68,0.02)] cursor-pointer active:scale-98 font-helios"
                  >
                    <Trash2 size={14} />
                    Delete all chats
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div 
        className="flex-1 flex flex-col h-full relative overflow-hidden"
        style={{
          backgroundImage: "url('/images/ROMI-PORTAL-BG.webp')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Blurred backdrop layer */}
        <div className="absolute inset-0 bg-[#eae7dc]/90 dark:bg-zinc-950/93 backdrop-blur-[1px] pointer-events-none" />

        <header className="h-16 border-b border-gray-100 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md flex items-center justify-between px-6 z-10 relative shadow-[0_2px_12px_rgba(0,0,0,0.015)]">
          <div className="flex items-center gap-2.5">
            {consentStatus && (
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                type="button"
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-zinc-850 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors flex items-center justify-center cursor-pointer border border-gray-200 dark:border-zinc-700 shadow-sm bg-white dark:bg-zinc-800"
                title={sidebarOpen ? "Hide chat history" : "Show chat history"}
              >
                {sidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
              </button>
            )}
            <span className="font-helios font-bold text-gray-900 dark:text-zinc-100 text-base sm:text-lg tracking-tight uppercase">ROMI AI</span>
            
            <div className="px-3 py-1.5 rounded-full bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-800 dark:text-zinc-200 text-[10px] font-bold shadow-[0_4px_12px_rgba(0,0,0,0.06)] uppercase tracking-wider flex items-center gap-1.5 font-sans leading-none z-10 relative">
              {mode === 'search' && <Search size={12} className="text-[#1b60bb] dark:text-blue-400" />}
              {mode === 'technologies' && <Cpu size={12} className="text-[#219653] dark:text-green-400" />}
              {mode === 'instrumentation' && <Wrench size={12} className="text-amber-500 dark:text-amber-400" />}
              {mode === 'researchpreneurship' && <Lightbulb size={12} className="text-indigo-500 dark:text-indigo-400" />}
              <span className="translate-y-[0.5px]">{mode}</span>
            </div>
          </div>

          <button
            onClick={() => setDarkMode(!darkMode)}
            type="button"
            className="w-10 h-10 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-gray-50 dark:hover:bg-zinc-800 text-amber-500 dark:text-yellow-400 transition-all shadow-sm flex items-center justify-center cursor-pointer active:scale-95 overflow-hidden relative"
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={darkMode ? "dark" : "light"}
                initial={{ y: 25, rotate: -90, opacity: 0 }}
                animate={{ y: 0, rotate: 0, opacity: 1 }}
                exit={{ y: 25, rotate: 90, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="absolute flex items-center justify-center"
              >
                {darkMode ? <Moon size={18} className="text-indigo-400" /> : <Sun size={18} className="text-amber-500" />}
              </motion.div>
            </AnimatePresence>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth flex flex-col gap-8 pb-32 relative z-10">
          {assessmentState.progress > 0 && (
             <RomiProgressBar overallProgressPercent={assessmentState.progress} stages={assessmentState.stages} />
          )}

          {messages.map((msg, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex gap-3 max-w-4xl w-full ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}>
              
              {/* Avatar Icon */}
              <div className="shrink-0 flex items-start justify-center">
                {msg.role === 'user' ? (
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm border ${
                    msg.role === 'user' 
                      ? 'bg-gray-200 dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 text-gray-600 dark:text-gray-300' 
                      : 'bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 overflow-hidden'
                  }`}>
                    <User size={16} />
                  </div>
                ) : (
                  <img src="/romi-avatar.png" alt="Romi" className="w-12 h-12 object-contain" />
                )}
              </div>

              {/* Message Bubble */}
              {msg.role === 'user' ? (
                <div className="p-4 rounded-2xl rounded-tr-sm bg-gray-200 dark:bg-zinc-800 shadow-md border border-gray-300/30 dark:border-zinc-700/30 text-sm text-gray-900 dark:text-white max-w-[80%] whitespace-pre-line relative z-10">
                  {msg.content}
                </div>
              ) : (
                <div className="text-sm text-gray-800 dark:text-zinc-200 w-full py-1">
                  <div className="prose prose-sm max-w-none prose-slate dark:prose-invert">
                    {(() => {
                      const { cleanText, charts } = parseRomiVisuals(msg.content);
                      return (
                        <>
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                               table: ({ children }) => <ComparisonTable>{children}</ComparisonTable>,
                               thead: ({ children }) => <TableHead>{children}</TableHead>,
                               tr: ({ children }) => <TableRow>{children}</TableRow>,
                               th: ({ children }) => <TableHeaderCell>{children}</TableHeaderCell>,
                               td: ({ children }) => <TableCell>{children}</TableCell>,
                               a: SourceAnchor 
                            }}
                          >
                            {renderSourceLinks(cleanText)}
                          </ReactMarkdown>
                          
                          <VizGrid charts={charts} />

                          {msg.technologies && msg.technologies.length > 0 && (
                            <div className="flex flex-col gap-3 mt-5">
                              {msg.technologies.map((tech, tIdx) => (
                                <MiniCard key={tIdx} technology={tech} />
                              ))}
                            </div>
                          )}

                          {msg.actionTrigger && (
                            <div className="mt-4">
                              <a 
                                href={msg.actionTrigger.url}
                                className="inline-flex px-5 py-2.5 bg-[#1b60bb] hover:bg-[#155099] text-white text-xs font-bold rounded-xl shadow-sm transition-colors no-underline"
                              >
                                {msg.actionTrigger.label}
                              </a>
                            </div>
                          )}
                        </>
                      );
                    })()}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
          {isThinking && (
            <div className="flex gap-3 max-w-4xl w-full mr-auto items-center">
              <div className="shrink-0 flex items-center justify-center">
                <img src="/romi-avatar.png" alt="Romi" className="w-12 h-12 object-contain" />
              </div>
              <div className="mr-auto pl-1">
                <RomiThinkingIndicator />
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <div className="absolute bottom-0 inset-x-0 p-5 z-20 bg-gradient-to-t from-[#FDFDF9] dark:from-zinc-950 to-transparent pointer-events-none">
          <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto relative flex items-end pointer-events-auto">
            
            {/* Input Box Wrapper */}
            <div className="relative flex-1 flex items-end">
              
              {/* Mode Switcher Popover Panel Container - positioned absolutely inside the textarea wrapper on the left */}
              <div className="absolute left-2 bottom-[8px] z-30">
                <button
                  type="button"
                  onClick={() => setShowModeDropdown(!showModeDropdown)}
                  className="w-9 h-9 border border-gray-250 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-gray-50 dark:hover:bg-zinc-800 text-gray-500 dark:text-gray-400 rounded-full flex items-center justify-center shrink-0 shadow-[0_4px_12px_rgba(0,0,0,0.05)] active:scale-95 transition-all cursor-pointer"
                  title="Switch mode"
                >
                  <Plus size={16} className={`transition-transform duration-200 ${showModeDropdown ? 'rotate-45 text-red-500' : 'text-[#1b60bb] dark:text-blue-400'}`} />
                </button>

                <AnimatePresence>
                  {showModeDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute bottom-11 left-0 mb-2 bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 rounded-2xl shadow-[0_10px_35px_rgba(0,0,0,0.12)] p-2 z-30 w-48 flex flex-col gap-1"
                    >
                      {[
                        { id: 'search', label: 'Search', icon: <Search size={14} /> },
                        { id: 'technologies', label: 'Technologies', icon: <Cpu size={14} /> },
                        { id: 'instrumentation', label: 'Instrumentation', icon: <Wrench size={14} /> },
                        { id: 'researchpreneurship', label: 'Researchpreneurship', icon: <Lightbulb size={14} /> }
                      ].map((option) => (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => {
                            setMode(option.id);
                            setShowModeDropdown(false);
                          }}
                          className={`w-full text-left px-3 py-2.5 text-xs rounded-xl transition-all font-medium font-sans flex items-center gap-2.5 ${
                            mode === option.id 
                              ? 'bg-black dark:bg-white text-white dark:text-black font-semibold shadow-sm' 
                              : 'text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800/60'
                          }`}
                        >
                          <span className={mode === option.id ? 'text-white dark:text-black' : 'text-gray-400 dark:text-zinc-500'}>
                            {option.icon}
                          </span>
                          <span className="capitalize">{option.label}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <textarea
                ref={textareaRef}
                rows={1}
                value={inputVal}
                onChange={handleInput}
                onKeyDown={handleKeyDown}
                disabled={showConsent}
                placeholder={`Ask Romi (${mode})...`}
                className={`w-full bg-white dark:bg-zinc-900 text-gray-900 dark:text-zinc-100 placeholder:text-gray-400 dark:placeholder:text-zinc-500 border border-gray-250 dark:border-zinc-800 rounded-2xl py-3.5 pl-14 pr-14 shadow-[0_15px_40px_rgba(0,0,0,0.14)] dark:shadow-none focus:outline-none focus:ring-2 focus:ring-[#1b60bb]/20 resize-none font-sans font-medium ${
                  inputVal.length > 200 ? 'overflow-y-auto textarea-micro-scrollbar' : 'overflow-hidden scrollbar-hide'
                }`}
                style={{ minHeight: '52px', maxHeight: '200px' }}
              />
              <button 
                type="submit" 
                disabled={showConsent || !inputVal.trim()} 
                className="absolute right-2 bottom-[8px] w-9 h-9 bg-black dark:bg-zinc-800 text-white dark:text-zinc-300 rounded-full flex items-center justify-center disabled:opacity-50 transition-opacity"
              >
                <ArrowUp size={16} />
              </button>
            </div>
          </form>
        </div>
      </div>

      <AnimatePresence>
        {dataPanelOpen && (
          <motion.div initial={{ width: 0, opacity: 0 }} animate={{ width: 340, opacity: 1 }} exit={{ width: 0, opacity: 0 }} className="h-full shrink-0">
            <DataVisualizationPanel latestUserQuery={activeMarketQuery || query || ""} onClose={() => setDataPanelOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {showConsent && (
        <StorageConsentPopup
          onClose={handleConsentPopupClose}
          isHighlighted={isConsentHighlighted}
          isCentered={true}
        />
      )}

      {/* Premium Custom Confirmation Card Modal */}
      <AnimatePresence>
        {confirmModal.isOpen && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[1px]">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl p-6 shadow-2xl max-w-sm w-full mx-4 flex flex-col gap-4 relative z-50"
            >
              <h3 className="font-helios font-bold text-gray-900 dark:text-zinc-100 text-lg leading-tight">{confirmModal.title}</h3>
              <p className="font-montserrat text-sm text-gray-500 dark:text-zinc-400 leading-relaxed">{confirmModal.message}</p>
              <div className="flex gap-3 justify-end mt-2">
                <button
                  type="button"
                  onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                  className="px-4 py-2.5 text-xs font-semibold text-gray-500 hover:text-gray-700 dark:text-zinc-400 dark:hover:text-zinc-200 border border-gray-250 dark:border-zinc-700 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    confirmModal.onConfirm();
                    setConfirmModal(prev => ({ ...prev, isOpen: false }));
                  }}
                  className="px-5 py-2.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors cursor-pointer shadow-sm shadow-red-500/10"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}