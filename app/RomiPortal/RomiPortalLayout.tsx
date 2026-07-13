//C:\Users\Akash Krishna\Downloads\RINK KSUM Website\app\RomiPortal\RomiPortalLayout.tsx

'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Settings, Download, Share2, User, Bot, ArrowUp, Trash2 } from 'lucide-react';

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
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [inputVal, setInputVal] = useState('');
  
  const [assessmentState, setAssessmentState] = useState<{progress: number, stages: any[]}>({ progress: 0, stages: [] });

  const chatEndRef = useRef<HTMLDivElement>(null);
  const hasFiredInitial = useRef<boolean>(false); 
  const textareaRef = useRef<HTMLTextAreaElement>(null); // NEW: Ref for the expanding textarea

  const sessionRef = useRef<string>(`romi-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`);

  const [consentStatus, setConsentStatus] = useState<boolean>(false);
  const { sessions, currentSessionId, createNewSession, updateCurrentSession, loadSession, clearAllHistory } = useRomiStorage(consentStatus);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const consent = localStorage.getItem('romi-consent');
      const hasConsent = consent === 'true';
      setConsentStatus(hasConsent);
      
      const isMobile = window.innerWidth < 768;
      setSidebarOpen(!isMobile && hasConsent);
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

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('click', handleGlobalClick, true);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('click', handleGlobalClick, true);
    };
  }, []);

  const handleConsentPopupClose = () => {
    const hasConsent = localStorage.getItem('romi-consent') === 'true';
    setConsentStatus(hasConsent);
    setShowConsent(false);

    if (pendingNavigation) {
      const destination = pendingNavigation;
      setPendingNavigation(null);
      window.location.href = destination;
    }
  };

  const handleClearHistory = () => {
    if (window.confirm("Are you sure you want to delete all conversations? This will erase your local chat history and reset storage settings.")) {
      setMessages([]);
      clearAllHistory();
      localStorage.removeItem('romi-consent');
      setConsentStatus(false);
      hasFiredInitial.current = false;
      onReset();
    }
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
          history: history.slice(-6),
          current_package: activeMode,          
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
        setMessages(prev => { const updated = [...prev, botMsg]; if (consentStatus) updateCurrentSession(updated); return updated; });
        return;
      }

      const botMsg: Message = {
        role: 'assistant',
        content: resData.ai_answer || `I found ${resData.match_count || 0} match(es).`,
        technologies: resData.data || []
      };
      
      setMessages(prev => { const updated = [...prev, botMsg]; if (consentStatus) updateCurrentSession(updated); return updated; });
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
      if (typeof window !== 'undefined' && localStorage.getItem('romi-consent') === 'true') createNewSession(initialMsg);
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
    if (consentStatus) {
      if (!currentSessionId) createNewSession(newMsg);
      else updateCurrentSession(updatedMessages);
    }
    executeSearch(userMessage, updatedMessages);
  };

  // NEW: Dynamic Textarea Auto-Resize Logic
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputVal(e.target.value);
    e.target.style.height = 'auto'; // Reset height briefly to recalculate
    e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`; // Expand up to 200px, then scroll
  };

  // NEW: Submit on 'Enter', New Line on 'Shift + Enter'
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex w-full h-full bg-[#FDFDF9] overflow-hidden relative">
      <div className="flex-1 flex flex-col h-full relative overflow-hidden">
        <header className="h-16 border-b border-gray-100 bg-white/80 backdrop-blur-md flex items-center justify-between px-6 z-10">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#1b60bb] rounded-lg flex items-center justify-center text-white font-bold text-sm">R</div>
              <span className="font-bold text-[#333] hidden sm:inline">Romi AI</span>
            </div>
            <h2 className="font-semibold text-gray-800 text-sm border-l border-gray-200 pl-4">Research Analysis</h2>
          </div>
          {messages.length > 0 && (
            <button
              onClick={handleClearHistory}
              type="button"
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-red-200 text-red-600 bg-red-50 hover:bg-red-150 hover:text-red-700 active:scale-95 transition-all font-montserrat text-xs font-semibold cursor-pointer shadow-sm"
              title="Delete all conversations"
            >
              <Trash2 size={14} />
              <span className="hidden sm:inline">Clear Chat</span>
            </button>
          )}
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth flex flex-col gap-8 pb-32">
          {assessmentState.progress > 0 && (
             <RomiProgressBar overallProgressPercent={assessmentState.progress} stages={assessmentState.stages} />
          )}

          {messages.map((msg, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex gap-4 max-w-4xl w-full ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}>
              <div className={`p-5 rounded-2xl ${msg.role === 'user' ? 'bg-gray-100 rounded-tr-sm' : 'bg-white border border-gray-100 shadow-sm rounded-tl-sm'} text-sm text-gray-800 w-full`}>
                
                {msg.role === 'user' ? (
                  <span className="whitespace-pre-line">{msg.content}</span>
                ) : (
                  <div className="prose prose-sm max-w-none prose-slate">
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
                )}
              </div>
            </motion.div>
          ))}
          {isThinking && <div className="mr-auto"><RomiThinkingIndicator /></div>}
          <div ref={chatEndRef} />
        </div>

        <div className="absolute bottom-0 inset-x-0 p-5 z-20 bg-gradient-to-t from-white to-transparent">
          <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto relative flex items-end">
            <textarea
              ref={textareaRef}
              rows={1}
              value={inputVal}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              disabled={showConsent}
              placeholder="Ask Romi..."
              className="w-full bg-white text-gray-900 placeholder:text-gray-400 border rounded-2xl py-3.5 pl-5 pr-14 shadow-lg focus:outline-none focus:ring-2 focus:ring-[#1b60bb]/20 resize-none overflow-y-auto"
              style={{ minHeight: '52px', maxHeight: '200px' }}
            />
            <button 
              type="submit" 
              disabled={showConsent || !inputVal.trim()} 
              className="absolute right-2 bottom-[8px] w-9 h-9 bg-black text-white rounded-full flex items-center justify-center disabled:opacity-50 transition-opacity"
            >
              <ArrowUp size={16} />
            </button>
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
    </div>
  );
}