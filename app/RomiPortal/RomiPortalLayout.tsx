//C:\Users\Akash Krishna\Downloads\RINK KSUM Website\app\RomiPortal\RomiPortalLayout.tsx — v3
//
// CHANGES vs v2:
//  1. limit: 10 in the /api/search body (backend MAX_SEARCH_RESULTS is now 10).
//  2. "See more" button: shows the first 5 technology cards, expands to 10
//     per-message via the expandedTechs state.
//  3. MODE AUTO-SWITCH: the mode pill follows the backend's
//     intent_route_logged — technologies/comparison -> 'technologies',
//     instrumentation -> 'instrumentation', researchpreneurship ->
//     'researchpreneurship' (backend only routes there on EXPLICIT intent
//     after the intent_router fix, so this is safe), and greeting/FAQ/menu
//     resets return the pill to 'search'. "About RINK" stays in search.

'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Settings, Download, Share2, User, Bot, ArrowUp, Trash2, ChevronLeft, ChevronRight, Plus, Sun, Moon, Search, Cpu, Wrench, Lightbulb, CornerDownRight, X, BookOpen, Edit2, MapPin, ArrowUpRight, Sparkles, Hand, Heart, ArrowRight, Database, Activity, Copy, Check } from 'lucide-react';

import RomiThinkingIndicator from './RomiPortalFeatures/RomiThinkingIndicator';
import InstrumentMapPanel, { InstLocation } from './instrumentation/InstrumentMapPanel';
import IPProtectionNotice from './RomiPortalFeatures/IPProtectionNotice';
import StorageConsentPopup from './RomiPortalFeatures/StorageConsentPopup';
import RomiProgressBar from './researchpreneurship/RomiProgressBar';
import AssessmentMiniCard from './RomiPortalFeatures/AssessmentMiniCard';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import ComparisonTable, { TableHead, TableRow, TableHeaderCell, TableCell } from '@/HomePage/RomiAI/ComparisonTable';
import MiniCard from './RomiPortalFeatures/MiniCard';
import { useRomiStorage, ChatSession, db } from './useRomiStorage';

import { parseRomiVisuals, renderSourceLinks, SourceAnchor, VizGrid, MarketPyramid, extractSourcesFromText, RomiBarChart } from './RomiPortalFeatures/VizRenderer';

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
  sources?: any[];
  follow_ups?: string[];
  marketData?: { query: string; };
  market?: any;
  instrumentation?: any; // guided instrumentation payload (map_locations, stage...)
  queries_used?: string[]; // Captures the query planner strings
  assessmentCard?: {
    section_key: string;
    section_title: string;
    section_number: string;
    questions: string[];
    raw_answer: string;
    refined_answer: string;
    word_count: number;
  };
  assessmentFinalReview?: Message['assessmentCard'][];
  reportReadyForSession?: string;
}

function parseCSV(text: string) {
  const lines = text.split(/\r?\n/);
  if (lines.length < 2) return [];

  const headers = parseCSVLine(lines[0]);
  const rows: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    const values = parseCSVLine(lines[i]);
    const row: Record<string, string> = {};
    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });
    rows.push(row);
  }
  return rows;
}

function parseCSVLine(line: string) {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());

  return result.map(val => val.replace(/^"|"$/g, '').replace(/""/g, '"'));
}

function getDirectDriveUrl(url: string): string {
  if (!url) return '';
  const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (match && match[1]) {
    return `https://drive.google.com/uc?export=view&id=${match[1]}`;
  }
  const queryMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (queryMatch && queryMatch[1]) {
    return `https://drive.google.com/uc?export=view&id=${queryMatch[1]}`;
  }
  return url;
}

function cleanMarkdownForParsing(text: string): string {
  if (!text) return '';
  return text.replace(/[\*\_~#`]/g, '');
}

function parseMarketDataFromText(text: string) {
  if (!text) return null;
  const clean = cleanMarkdownForParsing(text);
  const tamMatch = clean.match(/(?:Total\s+Addressable\s+Market\s+)?(?:\bTAM\b|\(TAM\))\s*(?:[:\-–—]|is|of|valued\s+at)?\s*(\$?\d+(?:\.\d+)?\s*(?:M|B|T|Million|Billion|Trillion|Million\s+USD|M\s+USD|USD)?\b)/i);
  const samMatch = clean.match(/(?:Serviceable\s+Available\s+Market|Serviceable\s+Addressable\s+Market)?\s*(?:\bSAM\b|\(SAM\))\s*(?:[:\-–—]|is|of|valued\s+at)?\s*(\$?\d+(?:\.\d+)?\s*(?:M|B|T|Million|Billion|Trillion|Million\s+USD|M\s+USD|USD)?\b)/i);
  const somMatch = clean.match(/(?:Serviceable\s+Obtainable\s+Market)?\s*(?:\bSOM\b|\(SOM\))\s*(?:[:\-–—]|is|of|valued\s+at)?\s*(\$?\d+(?:\.\d+)?\s*(?:M|B|T|Million|Billion|Trillion|Million\s+USD|M\s+USD|USD)?\b)/i);

  if (tamMatch && samMatch && somMatch) {
    return {
      tam: tamMatch[1].trim(),
      sam: samMatch[1].trim(),
      som: somMatch[1].trim()
    };
  }
  return null;
}

function parseYearSeriesFromText(text: string) {
  if (!text) return null;
  const clean = cleanMarkdownForParsing(text);
  const seriesMap = new Map<number, { label: string; value: number; displayValue: string }>();

  // Pattern 1: Year followed by Value (e.g., "2024: $10M" or "2024 is $10M")
  const regex1 = /\b(20\d{2})\b\s*(?:[:\-–—]|is|of|valued\s+at|to\s+reach)?\s*(\$?\d+(?:\.\d+)?\s*(?:M|B|T|Million|Billion|Trillion|Million\s+USD|M\s+USD|USD)?\b)/gi;
  let match;
  while ((match = regex1.exec(clean)) !== null) {
    const year = parseInt(match[1], 10);
    const displayVal = match[2].trim();
    const numericVal = parseNumericValue(displayVal);
    if (numericVal > 0) {
      seriesMap.set(year, { label: String(year), value: numericVal, displayValue: displayVal });
    }
  }

  // Pattern 2: Value followed by Year (e.g., "$10M by 2024" or "$10M in 2024")
  const regex2 = /(\$?\d+(?:\.\d+)?\s*(?:M|B|T|Million|Billion|Trillion|Million\s+USD|M\s+USD|USD)?\b)\s*(?:by|in|for|expected\s+by)\s*\b(20\d{2})\b/gi;
  while ((match = regex2.exec(clean)) !== null) {
    const displayVal = match[1].trim();
    const year = parseInt(match[2], 10);
    const numericVal = parseNumericValue(displayVal);
    if (numericVal > 0 && !seriesMap.has(year)) {
      seriesMap.set(year, { label: String(year), value: numericVal, displayValue: displayVal });
    }
  }

  if (seriesMap.size >= 2) {
    return Array.from(seriesMap.entries())
      .sort((a, b) => a[0] - b[0])
      .map(entry => entry[1]);
  }
  return null;
}

function parseNumericValue(valStr: string): number {
  const clean = valStr.replace(/[\$,]/g, '').trim();
  const numMatch = clean.match(/^(\d+(?:\.\d+)?)/);
  if (!numMatch) return 0;
  const num = parseFloat(numMatch[1]);

  const lower = clean.toLowerCase();
  if (lower.includes('b') || lower.includes('billion')) {
    return num * 1000;
  }
  if (lower.includes('t') || lower.includes('trillion')) {
    return num * 1000000;
  }
  return num;
}

export default function RomiPortalLayout({ query, onReset, activeMode = "whole website" }: RomiPortalLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
  const [activeSources, setActiveSources] = useState<any[]>([]);
  const [showIPNotice, setShowIPNotice] = useState(false);
  const [showConsent, setShowConsent] = useState(false);
  const [isConsentHighlighted, setIsConsentHighlighted] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);
  const [isBackNavigationPending, setIsBackNavigationPending] = useState(false);
  const ignorePopStateRef = useRef(false);

  const [messages, setMessages] = useState<Message[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [thinkingSessionId, setThinkingSessionId] = useState<string | null>(null);
  const [inputVal, setInputVal] = useState('');

  // NEW: per-message "See more" expansion state (message index -> expanded?)
  const [expandedTechs, setExpandedTechs] = useState<Record<number, boolean>>({});

  // User message inline editing & copy state
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editText, setEditText] = useState<string>('');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopyMessage = async (idx: number, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(idx);
      setTimeout(() => setCopiedIndex(null), 1800);
    } catch (e) {
      console.error("Copy failed:", e);
    }
  };

  const handleSaveEdit = async (idx: number) => {
    const trimmed = editText.trim();
    if (!trimmed || isThinking) return;

    setEditingIndex(null);

    // Truncate conversation history up to index `idx` and append edited user message
    const historyUpToIdx = messages.slice(0, idx);
    const updatedUserMsg: Message = { role: 'user', content: trimmed };
    const updatedMessages = [...historyUpToIdx, updatedUserMsg];
    setMessages(updatedMessages);

    const targetSid = currentSessionId || sessionRef.current;

    // Clean up & update Dexie storage if consent is granted
    const hasConsent = consentStatus || (typeof window !== 'undefined' && localStorage.getItem('romi-consent') === 'true');
    if (hasConsent && targetSid) {
      try {
        const existingInDb = await db.messages.where('sessionId').equals(targetSid).sortBy('timestamp');
        if (existingInDb.length > idx) {
          const toDeleteIds = existingInDb.slice(idx).map((m: any) => m.id).filter(Boolean);
          if (toDeleteIds.length > 0) {
            await db.messages.bulkDelete(toDeleteIds);
          }
        }
        await db.messages.add({
          role: 'user',
          content: trimmed,
          sessionId: targetSid,
          timestamp: Date.now()
        });
        await db.sessions.update(targetSid, { updatedAt: Date.now() });
      } catch (err) {
        console.error("Failed to update edited message in Dexie:", err);
      }
    }

    // Re-run AI search with edited message
    executeSearch(trimmed, updatedMessages, false, updatedUserMsg, targetSid);
  };

  // NEW: floating instrumentation map state
  const [instMapLocations, setInstMapLocations] = useState<InstLocation[]>([]);
  const [instMapOpen, setInstMapOpen] = useState(false);
  const [instSelectedId, setInstSelectedId] = useState<string | null>(null);

  // NEW: rolling session summary ("story memory") persisted to IndexedDB/localStorage
  const sessionSummaryRef = useRef<string>('');

  const [assessmentState, setAssessmentState] = useState<{ progress: number, stages: any[] }>({ progress: 0, stages: [] });
  const [downloadingFormat, setDownloadingFormat] = useState<'docx' | 'pdf' | 'pptx' | null>(null);

  const handleDownloadReport = async (format: 'docx' | 'pdf' | 'pptx', sid: string) => {
    setDownloadingFormat(format);
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/generate-report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sid, format }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        alert(err.detail || 'Could not generate the report. Please try again.');
        return;
      }
      const blob = await res.blob();
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `KSUM_ConceptNote.${format}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(a.href);
    } catch (e) {
      alert('Download failed — please check your connection and try again.');
    } finally {
      setDownloadingFormat(null);
    }
  };

  const [instrumentSheetData, setInstrumentSheetData] = useState<Record<string, any>>({});

  useEffect(() => {
    const fetchInstruments = async () => {
      try {
        const url = process.env.NEXT_PUBLIC_INSTRUMENTS_SPREADSHEET_URL;
        if (!url) return;
        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch spreadsheet");
        const csvText = await res.text();
        const rows = parseCSV(csvText);
        const map: Record<string, any> = {};
        rows.forEach(row => {
          const id = row.id?.trim();
          if (id) {
            map[id] = {
              id: id,
              name: row.instruments1 || row.instruments || '',
              acronym: row.acronym || '',
              image_url: getDirectDriveUrl(row.image_link || ''),
              district: row.district || '',
              facility: row.name_of_facility || '',
              institution: row.institution_name || '',
              address: row.address || '',
              contact: row.enquiry_contact_number || '',
              email: row.enquiry_mail || '',
              url: row.website_booking_link || row.website_booking_link_fallback || ''
            };
          }
        });
        setInstrumentSheetData(map);
      } catch (err) {
        console.error("Error loading instrumentation spreadsheet:", err);
      }
    };
    fetchInstruments();
  }, []);

  const enrichLocations = (locs: InstLocation[]) => {
    if (!locs) return [];
    return locs.map(loc => {
      const sheetItem = instrumentSheetData[loc.id];
      if (!sheetItem) return loc;
      return {
        ...loc,
        name: sheetItem.name || loc.name,
        facility: sheetItem.facility || loc.facility,
        url: sheetItem.url || loc.url,
        email: sheetItem.email || loc.email,
        phone: sheetItem.contact || loc.phone,
        address: sheetItem.address || loc.address,
      };
    });
  };

  const chatEndRef = useRef<HTMLDivElement>(null);
  const hasFiredInitial = useRef<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
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
    onConfirm: () => { }
  });

  const sessionRef = useRef<string>(`romi-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`);

  const [consentStatus, setConsentStatus] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('romi-consent') === 'true';
    }
    return false;
  });
  const _storage: any = useRomiStorage(consentStatus);
  const {
    sessions,
    currentSessionId,
    setCurrentSessionId,
    createNewSession,
    saveExchange,
    loadSession,
    deleteSession,
    clearAllHistory,
    renameSession,
    updateMessage
  } = _storage;
  const saveSummary = _storage.saveSummary as undefined | ((id: string, s: string) => Promise<void>);

  const [sessionSizes, setSessionSizes] = useState<Record<string, number>>({});
  const [deviceType, setDeviceType] = useState<string>('Desktop');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const ua = navigator.userAgent.toLowerCase();
      if (ua.includes('mobi') || ua.includes('android') || ua.includes('iphone')) {
        setDeviceType('Mobile');
      } else if (ua.includes('tablet') || ua.includes('ipad')) {
        setDeviceType('Tablet');
      } else {
        setDeviceType('Desktop');
      }
    }
  }, []);

  useEffect(() => {
    if (!consentStatus || !sessions || sessions.length === 0) {
      setSessionSizes({});
      return;
    }

    let active = true;
    const calculateSizes = async () => {
      const newSizes: Record<string, number> = {};
      for (const s of sessions) {
        try {
          let msgsToEstimate: any[] = [];
          if ((s.id === currentSessionId || s.id === sessionRef.current) && messages && messages.length > 0) {
            msgsToEstimate = messages;
          } else {
            msgsToEstimate = await db.messages.where('sessionId').equals(s.id).toArray();
          }
          const msgsStr = JSON.stringify(msgsToEstimate);
          const sessionStr = JSON.stringify(s);
          newSizes[s.id] = (msgsStr.length + sessionStr.length) * 2;
        } catch (err) {
          console.error("Error calculating size for session", s.id, err);
          newSizes[s.id] = 0;
        }
      }
      if (active) {
        setSessionSizes(newSizes);
      }
    };

    calculateSizes();
    return () => {
      active = false;
    };
  }, [sessions, consentStatus, messages, currentSessionId]);

  const totalSize = Object.values(sessionSizes).reduce((a, b) => a + b, 0);
  const maxSessionId = Object.keys(sessionSizes).length > 0
    ? Object.keys(sessionSizes).reduce((a, b) => sessionSizes[a] > sessionSizes[b] ? a : b)
    : '';

  const formatSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const decimals = i >= 1 ? 2 : 1;
    return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
  };

  const formatPercent = (bytes: number, total: number): string => {
    if (total === 0) return '0%';
    return ((bytes / total) * 100).toFixed(1) + '%';
  };


  // Build a compact "story" of the conversation the AI can carry across turns
  // and across page reloads (IndexedDB when the hook supports it, localStorage otherwise).
  const buildSessionSummary = (msgs: Message[]): string => {
    const topics = msgs.filter(m => m.role === 'user').slice(-4).map(m => m.content.slice(0, 90));
    const lastTechMsg = [...msgs].reverse().find(m => m.role === 'assistant' && m.technologies && m.technologies.length > 0);
    const techNames = (lastTechMsg?.technologies || []).slice(0, 5)
      .map((t: any, i: number) => `${i + 1}. ${t.technology_name} [${t.technology_id}]`);
    const parts: string[] = [];
    if (topics.length) parts.push(`Topics the user asked about: ${topics.join(' | ')}`);
    if (techNames.length) parts.push(`Items shown in the LAST list (ordinals like "first" refer to these): ${techNames.join('; ')}`);
    return parts.join('. ').slice(0, 700);
  };

  const persistSummary = (summary: string, sid?: string | null) => {
    const targetSid = sid || sessionRef.current;
    if (targetSid === sessionRef.current) {
      sessionSummaryRef.current = summary;
    }
    if (!targetSid) return;
    if (saveSummary) { saveSummary(targetSid, summary).catch(() => { }); }
    try { localStorage.setItem('romi-summary-' + targetSid, summary); } catch { /* noop */ }
  };

  const restoreSummary = (sid: string, fromHook?: string) => {
    let sum = fromHook || '';
    if (!sum) { try { sum = localStorage.getItem('romi-summary-' + sid) || ''; } catch { sum = ''; } }
    sessionSummaryRef.current = sum;
  };
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [renameTitle, setRenameTitle] = useState<string>('');
  const [isMobileView, setIsMobileView] = useState(false);
  const hasSources = messages.length > 0 && !!messages[messages.length - 1]?.sources?.length;

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
    if (currentSessionId && consentStatus && mode) {
      db.sessions.update(currentSessionId, { mode }).catch(() => { });
    }
  }, [mode, currentSessionId, consentStatus]);

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

      if (localStorage.getItem('romi-consent') === 'true') {
        onReset();
        return;
      }

      // User pressed back button:
      // Show warning consent popup, mark back navigation as pending
      setIsBackNavigationPending(true);
      setShowConsent(true);
      // Re-push state to keep the back prevention block active
      window.history.pushState({ romiPreventBack: true }, '');
    };

    // Push history state to intercept the back button gesture
    if (typeof window !== 'undefined') {
      if (localStorage.getItem('romi-consent') === 'true') {
        window.history.pushState({ romiChatActive: true }, '');
      } else {
        window.history.pushState({ romiPreventBack: true }, '');
      }
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
      if (typeof window !== 'undefined') {
        if (window.history.state?.romiPreventBack && localStorage.getItem('romi-consent') !== 'true') {
          ignorePopStateRef.current = true;
          window.history.back();
        } else if (window.history.state?.romiChatActive && localStorage.getItem('romi-consent') === 'true') {
          ignorePopStateRef.current = true;
          window.history.back();
        }
      }
    };
  }, [onReset]);

  const handleConsentPopupClose = async () => {
    const hasConsent = localStorage.getItem('romi-consent') === 'true';
    setConsentStatus(hasConsent);
    setShowConsent(false);

    if (hasConsent) {
      setSidebarOpen(true);
      // Auto-save active conversation to sidebar if memory is turned on
      if (messages.length > 0) {
        const firstUserMsg = messages.find(m => m.role === 'user');
        if (firstUserMsg) {
          const newId = await createNewSession(firstUserMsg, mode);
          if (newId) {
            sessionRef.current = newId;
            setCurrentSessionId(newId);
          }
          for (let i = 0; i < messages.length; i++) {
            if (messages[i].role === 'assistant') {
              const userMsg = i > 0 && messages[i - 1].role === 'user' ? messages[i - 1] : null;
              await saveExchange(newId, userMsg, messages[i]);
            }
          }
        }
      }
    } else {
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

  const handleConsentPopupCancel = () => {
    setShowConsent(false);
    setPendingNavigation(null);
    setIsBackNavigationPending(false);
  };

  const handleClearHistory = () => {
    setConfirmModal({
      isOpen: true,
      title: "Delete all chats?",
      message: "Are you sure you want to delete all conversations? This will erase your local chat history and reset storage settings.",
      onConfirm: async () => {
        setMessages([]);
        await clearAllHistory();
        localStorage.removeItem('romi-consent');
        setConsentStatus(false);
        setMode('search');
        hasFiredInitial.current = false;
        onReset();
      }
    });
  };

  const handleNewChat = () => {
    setMessages([]);
    setCurrentSessionId(null);
    setMode('search');
    hasFiredInitial.current = false;
    sessionRef.current = `romi-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setActiveSources([]);
    setRightSidebarOpen(false);
    setExpandedTechs({});
    sessionSummaryRef.current = '';
    setInstMapOpen(false);
    setInstMapLocations([]);
    setInstSelectedId(null);
    setAssessmentState({ progress: 0, stages: [] });
  };

  const handleSelectSession = async (id: string) => {
    setCurrentSessionId(id);
    sessionRef.current = id;
    // Close facility map when switching to another chat session
    setInstMapOpen(false);
    setInstMapLocations([]);
    setInstSelectedId(null);

    const loadRes: any = await loadSession(id);
    if (loadRes?.assessment) {
      setAssessmentState(loadRes.assessment);
    } else {
      setAssessmentState({ progress: 0, stages: [] });
    }

    const loadedMessages = loadRes?.messages;
    if (loadedMessages && loadedMessages.length > 0) {
      // Cast it back to the UI's expected Message format
      setMessages(loadedMessages as Message[]);
      setExpandedTechs({});
      restoreSummary(id, loadRes?.summary);
      if (!sessionSummaryRef.current) persistSummary(buildSessionSummary(loadedMessages as Message[]));

      if (loadRes?.mode) {
        setMode(loadRes.mode);
      } else {
        setMode('search');
      }

      // Load last assistant message's sources to state but close the right sidebar when switching chats
      const lastAssistantMessage = [...loadedMessages].reverse().find(m => m.role === 'assistant');
      if (lastAssistantMessage && lastAssistantMessage.sources && lastAssistantMessage.sources.length > 0) {
        setActiveSources(lastAssistantMessage.sources);
      } else {
        setActiveSources([]);
      }
      setRightSidebarOpen(false);
    }
  };

  const handleDeleteSession = (id: string) => {
    setConfirmModal({
      isOpen: true,
      title: "Delete chat session?",
      message: "Are you sure you want to delete this chat session?",
      onConfirm: async () => {
        await deleteSession(id);
        if (currentSessionId === id) {
          setMessages([]);
          setCurrentSessionId(null);
          setMode('search');
          hasFiredInitial.current = false;
          sessionRef.current = `romi-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
          setActiveSources([]);
          setRightSidebarOpen(false);
        }
      }
    });
  };

  const handleStartRename = (sessionId: string, currentTitle: string) => {
    setEditingSessionId(sessionId);
    setRenameTitle(currentTitle);
  };

  const handleSaveRename = async (sessionId: string) => {
    if (renameTitle.trim()) {
      await renameSession(sessionId, renameTitle.trim());
    }
    setEditingSessionId(null);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  useEffect(() => {
    if (mode === 'researchpreneurship') {
      const isDismissed = typeof window !== 'undefined' && localStorage.getItem('romi-ipr-dismissed') === 'true';
      if (!isDismissed) {
        const timer = setTimeout(() => {
          setShowIPNotice(true);
        }, 4000);
        return () => clearTimeout(timer);
      }
    } else {
      setShowIPNotice(false);
    }
  }, [mode]);

  // NEW: mode pill follows the backend's routing decision.
  // Backend only routes to researchpreneurship on EXPLICIT intent (post
  // intent_router fix), so trusting it here is safe. Greeting / FAQ / menu
  // resets return the pill to 'search'; anything else keeps the current pill.
  const syncModeWithRoute = (routeLogged?: string) => {
    if (!routeLogged) return;
    const r = routeLogged.toLowerCase();
    if (r.includes('technolog') || r.includes('comparison')) setMode('technologies');
    else if (r.includes('instrument')) setMode('instrumentation');
    else if (r.includes('researchpreneur')) setMode('researchpreneurship');
    else if (r.includes('greeting') || r.includes('faq') || r.includes('main menu') || r.includes('guide')) setMode('search');
    // market analysis keeps whichever pill is active
  };

  const executeSearch = async (
    queryText: string,
    currentMessages: Message[],
    isFirstMessage: boolean = false,
    userMsgObj?: Message,
    sid?: string | null
  ) => {
    const targetSid = sid || sessionRef.current;
    setIsThinking(true);
    setThinkingSessionId(targetSid);

    // INSTANT EXACT-MATCH UI SWITCHER: if the user explicitly clicked one of the
    // main menu guided buttons, flip the pill immediately (before the API returns).
    // syncModeWithRoute() below then keeps it aligned with the backend's routing.
    const exactQ = queryText.toLowerCase().trim();
    if (exactQ === "i want to explore rink technologies") {
      setMode('technologies');
    } else if (exactQ === "i need to search for lab instrumentation") {
      setMode('instrumentation');
    } else if (exactQ === "i want to evaluate my research (researchpreneurship)") {
      setMode('researchpreneurship');
    } else if (exactQ === "back to main menu" || exactQ === "start over" || exactQ === "main menu") {
      setMode('search');
    }

    const history = currentMessages.map(m => ({ role: m.role, content: m.content }));
    const apiUrl = 'http://127.0.0.1:8000';

    try {
      const response = await fetch(`${apiUrl}/api/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: queryText,
          limit: 10, // CHANGED: was 5 — See-more shows 5 first, expands to 10
          history: [
            ...(sessionSummaryRef.current
              ? [{ role: 'user' as const, content: `[SESSION MEMORY — earlier context, do not repeat verbatim]: ${sessionSummaryRef.current}` }]
              : []),
            ...history.slice(-8),
          ],
          current_package: mode || "search",
          session_id: targetSid,
        }),
      });

      if (!response.ok) throw new Error("API Connection Failed");
      const resData = await response.json();

      const isCurrent = sessionRef.current === targetSid || currentSessionId === targetSid;

      // NEW: auto-switch the mode pill based on the routed intent
      if (isCurrent) {
        syncModeWithRoute(resData.intent_route_logged);
      }

      if (resData.assessment) {
        if (isCurrent) {
          setAssessmentState({ progress: resData.assessment.progress, stages: resData.assessment.stages });
        }
        if (consentStatus && targetSid) {
          db.sessions.update(targetSid, { assessment: resData.assessment }).catch((err) => {
            console.error("Failed to update session assessment in Dexie:", err);
          });
        }
      }

      if (resData.sources && resData.sources.length > 0) {
        if (isCurrent) {
          setActiveSources(resData.sources);
          setRightSidebarOpen(true);
        }
      } else {
        if (isCurrent) {
          setRightSidebarOpen(false);
        }
      }

      if (resData.report_ready) {
        const botMsg: Message = {
          role: 'assistant',
          content: resData.ai_answer,
          assessmentCard: resData.assessment_card,
          assessmentFinalReview: resData.assessment_final_review,
          reportReadyForSession: targetSid,
        };
        const updated = [...currentMessages, botMsg];

        if (isCurrent) {
          setMessages(updated);
        }

        // Save safely to storage - user message was already saved immediately, only save assistant!
        if (targetSid) {
          await saveExchange(targetSid, null, botMsg);
        }
        return;
      }

      if (resData.status === "redirect") {
        const urlMatch = resData.ai_answer.match(/\[REDIRECT:(.*?)\]/);
        const redirectUrl = urlMatch ? urlMatch[1] : 'http://localhost:3000/RomiPortal';
        const isRomiPortal = redirectUrl.toLowerCase().includes('/romiportal');

        const botMsg: Message = {
          role: 'assistant',
          content: resData.ai_answer.replace(/\[REDIRECT:.*?\]/, ''),
          actionTrigger: isRomiPortal ? undefined : { label: "Open Link →", url: redirectUrl }
        };
        const updated = [...currentMessages, botMsg];

        if (isCurrent) {
          setMessages(updated);
        }

        // Save safely to storage - only save assistant
        if (targetSid) {
          await saveExchange(targetSid, null, botMsg);
        }
        return;
      }

      // Handle normal response
      const botMsg: Message = {
        role: 'assistant',
        content: resData.ai_answer || `I found ${resData.match_count || 0} match(es).`,
        technologies: resData.data || [],
        sources: resData.sources || [],
        follow_ups: resData.follow_ups || [],
        marketData: resData.show_visuals ? { query: queryText } : undefined,
        market: resData.market,
        instrumentation: resData.instrumentation,
        queries_used: resData.queries_used,
        assessmentCard: resData.assessment_card,
        assessmentFinalReview: resData.assessment_final_review,
        reportReadyForSession: resData.report_ready ? targetSid : undefined,
      };

      const updated = [...currentMessages, botMsg];
      if (isCurrent) {
        setMessages(updated);
      }

      // Floating map: every instrumentation reply refreshes the pins automatically
      if (resData.instrumentation?.map_locations?.length) {
        if (isCurrent) {
          setInstMapLocations(resData.instrumentation.map_locations);
          setInstMapOpen(true);
          setInstSelectedId(null);
        }
      }

      // Persist the rolling session story (IndexedDB / localStorage)
      persistSummary(buildSessionSummary(updated), targetSid);

      // Save safely to storage - only save assistant since user message is saved immediately
      if (targetSid) {
        await saveExchange(targetSid, null, botMsg);
      }

    } catch (error) {
      const isCurrent = sessionRef.current === targetSid || currentSessionId === targetSid;
      if (isCurrent) {
        setMessages(prev => [...prev, { role: 'assistant', content: "I'm having trouble connecting to the backend. Please check your connection." }]);
      }
    } finally {
      setThinkingSessionId(prev => {
        if (prev === targetSid) {
          setIsThinking(false);
          return null;
        }
        return prev;
      });
    }
  };

  useEffect(() => {
    const trimmed = query.trim();
    // DIRECT-ENTRY: landing on the Instrumentation tab with no specific query
    // (or just a greeting) should jump straight into the guided instrumentation
    // flow — never show the generic "Hi, I'm Romi..." main-menu greeting first.
    const isGreetingish = /^(hi+|hello+|hey+|hlo+)[.! ]*$/i.test(trimmed);
    const effectiveQuery = (activeMode === 'instrumentation' && (!trimmed || isGreetingish))
      ? 'I need to search for Lab Instrumentation'
      : trimmed;
    if (effectiveQuery && !hasFiredInitial.current) {
      hasFiredInitial.current = true;
      const initialMsg: Message = { role: 'user', content: effectiveQuery };
      setMessages([initialMsg]);
      if (typeof window !== 'undefined') {
        (async () => {
          if (localStorage.getItem('romi-consent') !== 'skipped') {
            localStorage.setItem('romi-consent', 'true');
            setConsentStatus(true);
          }
          const newId = await createNewSession(initialMsg, activeMode);
          if (newId) {
            sessionRef.current = newId;
            setCurrentSessionId(newId);
          }
          executeSearch(effectiveQuery, [initialMsg], true, initialMsg, newId);
        })();
      } else {
        executeSearch(effectiveQuery, [initialMsg], true, initialMsg, sessionRef.current);
      }
    }
  }, [query, activeMode]);

  const handleSendMessage = async (e?: React.FormEvent, forcedText?: string) => {
    if (e) e.preventDefault();
    const queryText = forcedText || inputVal;
    const isCurrentSessionThinking = isThinking && (thinkingSessionId === currentSessionId || thinkingSessionId === sessionRef.current);
    if (showConsent || isCurrentSessionThinking || !queryText.trim()) return;
    const userMessage = queryText.trim();
    if (!forcedText) setInputVal('');

    if (textareaRef.current) {
      textareaRef.current.style.height = '52px';
    }

    const newMsg: Message = { role: 'user', content: userMessage };
    const updatedMessages = [...messages, newMsg];
    setMessages(updatedMessages);

    let isFirst = false;
    let sid = currentSessionId;
    if (!sid) {
      if (typeof window !== 'undefined' && localStorage.getItem('romi-consent') !== 'skipped') {
        localStorage.setItem('romi-consent', 'true');
        setConsentStatus(true);
      }
      const newId = await createNewSession(newMsg, mode);
      if (newId) {
        sessionRef.current = newId;
        setCurrentSessionId(newId);
        sid = newId;
      }
      isFirst = true;
    } else {
      const hasConsent = consentStatus || (typeof window !== 'undefined' && localStorage.getItem('romi-consent') === 'true');
      if (hasConsent) {
        await db.messages.add({
          role: 'user',
          content: userMessage,
          sessionId: sid,
          timestamp: Date.now()
        });
        await db.sessions.update(sid, { updatedAt: Date.now() });
      }
    }

    executeSearch(userMessage, updatedMessages, isFirst, newMsg, sid);
  };

  // Dynamic Textarea Auto-Resize Logic
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

  // Submit on 'Enter', New Line on 'Shift + Enter'
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
                  {(sessions || []).length === 0 ? (
                    <p className="text-xs text-gray-400 italic px-2">No recent chats</p>
                  ) : (
                    (sessions || []).map((session: ChatSession) => {
                      const isEditing = editingSessionId === session.id;
                      const isActive = currentSessionId === session.id || sessionRef.current === session.id;
                      return (
                        <div
                          key={session.id}
                          className={`group flex items-center justify-between rounded-2xl px-3 py-2.5 transition-all cursor-pointer ${isActive
                              ? 'bg-[#D6D3C8] dark:bg-[#161618] border border-[#c4c1b5]/70 dark:border-black/50 shadow-[inset_2.5px_2.5px_5px_rgba(0,0,0,0.18),inset_-2.5px_-2.5px_5px_rgba(255,255,255,0.7)] dark:shadow-[inset_2.5px_2.5px_6px_rgba(0,0,0,0.85),inset_-1.5px_-1.5px_4px_rgba(255,255,255,0.06)] text-gray-900 dark:text-white font-normal'
                              : 'hover:bg-[#d8d5cb]/50 dark:hover:bg-zinc-800/40 text-gray-700 dark:text-zinc-300 font-normal hover:shadow-[inset_1px_1px_3px_rgba(0,0,0,0.08),inset_-1px_-1px_3px_rgba(255,255,255,0.4)] dark:hover:shadow-[inset_1px_1px_3px_rgba(0,0,0,0.5)]'
                            }`}
                          onClick={() => {
                            if (!isEditing) handleSelectSession(session.id);
                          }}
                        >
                          <div className="flex items-center gap-2 overflow-hidden flex-1 mr-2">
                            <MessageSquare size={14} className={isActive ? 'text-[#1b60bb] dark:text-[#7dd3fc] shrink-0' : 'text-gray-500 dark:text-zinc-400 shrink-0'} />
                            {isEditing ? (
                              <input
                                type="text"
                                value={renameTitle}
                                onChange={(e) => setRenameTitle(e.target.value.slice(0, 30))}
                                maxLength={30}
                                onBlur={() => handleSaveRename(session.id)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') handleSaveRename(session.id);
                                  if (e.key === 'Escape') setEditingSessionId(null);
                                }}
                                autoFocus
                                onClick={(e) => e.stopPropagation()}
                                className="bg-transparent border-b border-[#1b60bb] dark:border-blue-400 text-xs text-gray-900 dark:text-white focus:outline-none w-full font-normal py-0.5"
                              />
                            ) : (
                              <span className={`text-xs truncate font-normal ${isActive ? 'text-gray-900 dark:text-white' : 'text-gray-800 dark:text-zinc-200'}`}>
                                {session.title}
                              </span>
                            )}
                          </div>

                          {/* Right Side Stats & Actions */}
                          <div className="flex items-center gap-1.5 shrink-0">
                            {/* Memory Stats - Hidden on Desktop Hover */}
                            <div className="flex items-center gap-1 text-xs font-bold text-gray-600 dark:text-zinc-300 font-sans md:group-hover:hidden select-none">
                              <span>{formatPercent(sessionSizes[session.id] || 0, totalSize)}</span>
                              {session.id === maxSessionId && (sessions || []).length > 1 && (
                                <span className="w-1.5 h-1.5 bg-red-500 rounded-full shrink-0 animate-pulse ml-0.5" title="Most Used" />
                              )}
                            </div>

                            {/* Actions - Shown on Desktop Hover */}
                            <div className="hidden md:group-hover:flex items-center gap-1 animate-in fade-in duration-200">
                              {!isEditing && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleStartRename(session.id, session.title);
                                  }}
                                  type="button"
                                  className="p-1 hover:bg-[#c8c5ba]/60 dark:hover:bg-zinc-800 rounded-lg text-gray-500 dark:text-zinc-400 hover:text-[#1b60bb] dark:hover:text-blue-400 transition-all cursor-pointer"
                                  title="Rename Chat"
                                >
                                  <Edit2 size={12} />
                                </button>
                              )}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteSession(session.id);
                                }}
                                type="button"
                                className="p-1 hover:bg-[#c8c5ba]/60 dark:hover:bg-zinc-800 rounded-lg text-gray-500 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-400 transition-all cursor-pointer"
                                title="Delete Chat"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>

                            {/* Actions - Always Shown on Mobile */}
                            <div className="flex md:hidden items-center gap-1">
                              {!isEditing && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleStartRename(session.id, session.title);
                                  }}
                                  type="button"
                                  className="p-1 hover:bg-[#c8c5ba]/60 dark:hover:bg-zinc-800 rounded-lg text-gray-500 dark:text-zinc-400 hover:text-[#1b60bb] dark:hover:text-blue-400 transition-all cursor-pointer"
                                  title="Rename Chat"
                                >
                                  <Edit2 size={12} />
                                </button>
                              )}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteSession(session.id);
                                }}
                                type="button"
                                className="p-1 hover:bg-[#c8c5ba]/60 dark:hover:bg-zinc-800 rounded-lg text-gray-500 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-400 transition-all cursor-pointer"
                                title="Delete Chat"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Bottom Section */}
                <div className="border-t border-gray-200 dark:border-zinc-800 pt-4 mt-auto">
                  {/* Browser Cache Monitor Widget */}
                  <div className="bg-white/40 dark:bg-zinc-950/40 backdrop-blur-xs border border-gray-300/40 dark:border-zinc-800/80 rounded-2xl p-3 mb-4 flex flex-col gap-2.5 shadow-xs select-none">
                    {/* Header */}
                    <div className="flex items-center justify-between text-[11px] font-bold text-gray-700 dark:text-zinc-300 font-helios tracking-tight">
                      <div className="flex items-center gap-1.5">
                        <Database size={13} className="text-[#1b60bb] dark:text-blue-400 shrink-0" />
                        <span>CACHE MONITOR</span>
                      </div>
                      <span className="px-1.5 py-0.5 bg-gray-200/80 dark:bg-zinc-805 text-gray-750 dark:text-zinc-300 rounded font-helios font-bold text-[9px] uppercase tracking-wider scale-95">
                        {deviceType}
                      </span>
                    </div>

                    {/* Progress Bar (Limit: 5MB) */}
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between text-[11px] font-bold text-gray-800 dark:text-zinc-200 font-helios">
                        <span>Used Memory</span>
                        <span className="text-gray-900 dark:text-white font-bold">{formatSize(totalSize)} / 5.00 MB</span>
                      </div>
                      <div className="w-full h-2.5 bg-gray-200 dark:bg-zinc-800 rounded-full overflow-hidden flex shadow-[inset_1px_1px_2px_rgba(0,0,0,0.06)] dark:shadow-[inset_1px_1px_3px_rgba(0,0,0,0.5)] border border-gray-300/10 dark:border-zinc-800/30">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-blue-500 via-[#1b60bb] to-indigo-600 transition-all duration-500 shadow-sm"
                          style={{ width: `${Math.min((totalSize / (5 * 1024 * 1024)) * 100, 100)}%` }}
                        />
                      </div>
                    </div>

                    {/* Sparkline growth trend chart */}
                    <div className="flex flex-col gap-1.5 border-t border-gray-200/50 dark:border-zinc-800/60 pt-2">
                      <div className="flex items-center justify-between text-[11px] font-bold text-gray-800 dark:text-zinc-200 font-helios">
                        <div className="flex items-center gap-1">
                          <Activity size={12} className="text-emerald-500 shrink-0" />
                          <span>Memory Growth Trend</span>
                        </div>
                        <span className="text-[10px] text-gray-450 dark:text-zinc-400 font-bold">({(sessions || []).length} chats)</span>
                      </div>

                      {/* Real Interactive Sparkline SVG */}
                      <div className="bg-gray-100/50 dark:bg-zinc-900/40 rounded-xl p-1.5 flex items-center justify-center border border-gray-200/30 dark:border-zinc-800/30 h-10 w-full">
                        {(sessions || []).length < 2 ? (
                          <span className="text-[9px] text-gray-450 dark:text-zinc-400 italic font-bold font-helios">
                            Trend will appear as you chat
                          </span>
                        ) : (
                          (() => {
                            const data = [...(sessions || [])].reverse().map(s => sessionSizes[s.id] || 0);
                            const width = 200;
                            const height = 28;
                            const padding = 2;
                            const max = Math.max(...data, 1024); // scale to at least 1KB
                            const min = Math.min(...data);
                            const range = max - min || 1;

                            const points = data.map((val, idx) => {
                              const x = (idx / (data.length - 1)) * (width - 2 * padding) + padding;
                              const y = height - ((val - min) / range) * (height - 2 * padding) - padding;
                              return `${x.toFixed(1)},${y.toFixed(1)}`;
                            });

                            const path = `M ${points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.replace(',', ' ')}`).join(' ')}`;
                            const area = `M ${padding} ${height} L ${points.map(p => p.replace(',', ' ')).join(' L ')} L ${width - padding} ${height} Z`;

                            return (
                              <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="overflow-visible">
                                <defs>
                                  <linearGradient id="sparklineGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.45" />
                                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                                  </linearGradient>
                                </defs>
                                {/* Area Fill */}
                                <path d={area} fill="url(#sparklineGrad)" />
                                {/* Line */}
                                <path d={path} fill="none" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                {/* Hotspots */}
                                {data.map((val, idx) => {
                                  const x = (idx / (data.length - 1)) * (width - 2 * padding) + padding;
                                  const y = height - ((val - min) / range) * (height - 2 * padding) - padding;
                                  return (
                                    <circle
                                      key={idx}
                                      cx={x}
                                      cy={y}
                                      r="2"
                                      fill={idx === data.length - 1 ? '#ef4444' : '#3b82f6'}
                                      className="hover:r-3 transition-all"
                                    />
                                  );
                                })}
                              </svg>
                            );
                          })()
                        )}
                      </div>
                    </div>

                    {/* Device limit comparison footnotes */}
                    <div className="flex justify-between text-[9px] text-gray-500 dark:text-zinc-450 font-bold uppercase tracking-wider font-helios border-t border-gray-200/50 dark:border-zinc-800/60 pt-1.5">
                      <span className={deviceType === 'Mobile' ? 'text-[#1b60bb] dark:text-blue-400 font-extrabold' : ''}>Mobile: 5MB</span>
                      <span className={deviceType === 'Tablet' ? 'text-[#1b60bb] dark:text-blue-400 font-extrabold' : ''}>Tablet: 5MB</span>
                      <span className={deviceType === 'Desktop' ? 'text-[#1b60bb] dark:text-blue-400 font-extrabold' : ''}>Desktop: 5MB</span>
                    </div>
                  </div>

                  <button
                    onClick={handleClearHistory}
                    type="button"
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-white/40 dark:border-zinc-800/40 bg-gradient-to-br from-[#ebe9e1] to-[#d5d3ca] dark:from-zinc-800 dark:to-zinc-950 hover:from-[#f0eee6] hover:to-[#dad8cf] dark:hover:from-zinc-750 dark:hover:to-zinc-900 text-red-600 dark:text-red-400 text-xs font-bold transition-all shadow-[4px_4px_8px_rgba(0,0,0,0.08),-4px_-4px_8px_rgba(255,255,255,0.7)] dark:shadow-[4px_4px_8px_rgba(0,0,0,0.5),-4px_-4px_8px_rgba(255,255,255,0.02)] active:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.1),inset_-3px_-3px_6px_rgba(255,255,255,0.7)] dark:active:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.6),inset_-3px_-3px_6px_rgba(255,255,255,0.02)] active:translate-y-[1px] cursor-pointer font-helios"
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
          backgroundImage: "url('/images/ROMI-PORTAL-BG.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Blurred backdrop layer */}
        <div className="absolute inset-0 bg-[#eae7dc]/90 dark:bg-zinc-950/93 backdrop-blur-[1px] pointer-events-none" />

        <header className="h-16 border-b border-gray-100 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md flex items-center justify-between px-3 sm:px-6 z-10 relative shadow-[0_2px_12px_rgba(0,0,0,0.015)]">
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
              <span className="translate-y-[0.5px]">{mode === 'search' ? 'explore' : mode}</span>
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

        {/* Main layout container with optional right sources panel */}
        <div className="flex-1 flex flex-row overflow-hidden relative z-10">
          <div className="flex-1 flex flex-col h-full overflow-hidden relative">
            {/* Scrollable messages container */}
            <div
              className={`flex-1 overflow-y-auto px-2 sm:px-4 pb-6 scroll-smooth flex flex-col gap-6 sm:gap-8 py-4 md:pb-8 ${mode === 'researchpreneurship' ? 'md:px-8' : 'md:p-8'}`}
              style={{
                overscrollBehaviorY: 'contain',
                WebkitOverflowScrolling: 'touch',
                transform: 'translateZ(0)',
              }}
            >
              {/* Sticky Progress Bar on Top */}
              {mode === 'researchpreneurship' && (
                <div className="w-full pt-2.5 pb-4 z-30 shrink-0 sticky top-0 bg-gradient-to-b from-[#FDFDF9] to-[#FDFDF9]/0 dark:from-zinc-950 dark:to-transparent -mx-2 sm:-mx-4 md:-mx-8 px-2 sm:px-4 md:px-8 pointer-events-none">
                  <div className="max-w-4xl mx-auto pointer-events-auto">
                    <RomiProgressBar
                      overallProgressPercent={assessmentState.progress ?? 0}
                      stages={assessmentState.stages && assessmentState.stages.length > 0 ? assessmentState.stages : undefined}
                    />
                  </div>
                </div>
              )}

              {messages.length === 0 && (
                <div className="flex-1 flex flex-col items-center justify-center min-h-[380px] my-auto py-8 px-4 text-center">
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="flex flex-col items-center max-w-xl mx-auto w-full"
                  >
                    <div className="w-16 h-16 sm:w-20 sm:h-20 mb-4 rounded-3xl bg-white/80 dark:bg-zinc-900/80 border border-gray-200/80 dark:border-zinc-700/80 p-3 shadow-md flex items-center justify-center backdrop-blur-md">
                      <img src="/romi-avatar.png" alt="Romi AI" className="w-full h-full object-contain" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold font-helios text-gray-900 dark:text-white mb-2 tracking-tight">
                      Welcome to ROMI AI
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-zinc-400 mb-8 max-w-md font-sans">
                      Your intelligent assistant for exploring RINK, innovation technologies, lab instrumentation, and researchpreneurship.
                    </p>

                    {/* Predefined Suggestion Cards */}
                    <div className="grid grid-cols-2 gap-2.5 sm:gap-6 w-full max-w-2xl">
                      {[
                        {
                          title: "Say Hi to explore RINK",
                          query: "Hi",
                          desc: "Get started with an overview of RINK portal & features",
                          icon: <Heart className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 text-rose-500 dark:text-rose-400" />
                        },
                        {
                          title: "Bring me a technology",
                          query: "I want to explore RINK Technologies",
                          desc: "Discover cutting-edge R&D innovations",
                          icon: <Cpu className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 text-emerald-600 dark:text-emerald-400" />
                        },
                        {
                          title: "Instrumentation & Labs",
                          query: "What instrumentation and lab facilities are available?",
                          desc: "I need to search for Lab Instrumentation",
                          icon: <Wrench className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 text-amber-500 dark:text-amber-400" />
                        },
                        {
                          title: "Researchpreneurship",
                          query: "I want to evaluate my research (ResearchPreneurship)",
                          desc: "Assess market readiness & commercial potential",
                          icon: <Lightbulb className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 text-indigo-500 dark:text-indigo-400" />
                        }
                      ].map((item, i) => (
                        <button
                          key={i}
                          type="button"
                          disabled={isThinking}
                          onClick={() => !isThinking && handleSendMessage(undefined, item.query)}
                          className="flex flex-col text-left p-3.5 sm:p-6 rounded-2xl sm:rounded-3xl border border-white/50 dark:border-zinc-800/40 bg-[#eae7dc] dark:bg-zinc-900 shadow-[-5px_-5px_12px_rgba(255,255,255,0.85),5px_5px_12px_rgba(165,160,135,0.55)] dark:shadow-[-4px_-4px_10px_rgba(255,255,255,0.03),4px_4px_10px_rgba(0,0,0,0.65)] hover:-translate-y-0.5 hover:shadow-[-7px_-7px_15px_rgba(255,255,255,0.9),7px_7px_15px_rgba(165,160,135,0.65)] dark:hover:shadow-[-6px_-6px_14px_rgba(255,255,255,0.04),6px_6px_14px_rgba(0,0,0,0.75)] active:translate-y-0.5 active:shadow-[inset_4px_4px_8px_rgba(165,160,135,0.5),inset_-4px_-4px_8px_rgba(255,255,255,0.8)] dark:active:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.8),inset_-3px_-3px_8px_rgba(255,255,255,0.03)] transition-all duration-200 cursor-pointer group disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
                        >
                          <div className="flex items-center justify-between mb-2.5 sm:mb-3.5 w-full gap-1.5">
                            <span className="text-[10px] sm:text-sm font-bold font-helios text-gray-900 dark:text-zinc-100 group-hover:text-[#1b60bb] dark:group-hover:text-[#7dd3fc] transition-colors leading-snug line-clamp-2">
                              {item.title}
                            </span>
                            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full flex items-center justify-center bg-[#eae7dc] dark:bg-zinc-900 border border-white/20 dark:border-zinc-800 shadow-[-2.5px_-2.5px_6px_rgba(255,255,255,0.8),2.5px_2.5px_6px_rgba(165,160,135,0.45)] dark:shadow-[-2px_-2px_6px_rgba(255,255,255,0.02),2px_2px_6px_rgba(0,0,0,0.5)] group-hover:shadow-[inset_1px_1px_3px_rgba(0,0,0,0.08)] transition-all shrink-0">
                              {item.icon}
                            </div>
                          </div>
                          <span className="text-[9px] sm:text-xs text-gray-600 dark:text-zinc-400 leading-normal sm:leading-relaxed line-clamp-2 font-sans font-medium mb-3 sm:mb-4">
                            {item.desc}
                          </span>
                          <div className="mt-auto w-full flex justify-end">
                            <div className="px-2 py-0.5 sm:px-2.5 sm:py-1 text-[8px] sm:text-[9px] font-bold text-[#1b60bb] dark:text-[#7dd3fc] uppercase tracking-wider bg-[#eae7dc] dark:bg-zinc-900 border border-white/30 dark:border-zinc-800 shadow-[inset_1px_1px_2.5px_rgba(165,160,135,0.45),inset_-1.5px_-1.5px_2.5px_rgba(255,255,255,0.8)] dark:shadow-[inset_1.5px_1.5px_3px_rgba(0,0,0,0.6)] rounded-lg flex items-center gap-1 shrink-0 group-hover:bg-[#1b60bb]/5 dark:group-hover:bg-blue-400/5 transition-all duration-200">
                              <span>Ask Romi</span>
                              <ArrowRight size={10} className="text-[#1b60bb] dark:text-[#7dd3fc] transition-transform duration-200 group-hover:translate-x-0.5" />
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                </div>
              )}

              {messages.map((msg, idx) => (
                <motion.div key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex gap-2 sm:gap-3 max-w-4xl w-full group ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}>

                  {/* Avatar Icon */}
                  <div className="shrink-0 flex items-start justify-center">
                    {msg.role === 'user' ? (
                      <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm border ${msg.role === 'user'
                          ? 'bg-gray-200 dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 text-gray-600 dark:text-gray-300'
                          : 'bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 overflow-hidden'
                        }`}>
                        <User size={14} />
                      </div>
                    ) : (
                      <img src="/romi-avatar.png" alt="Romi" className="w-7 h-7 sm:w-12 sm:h-12 object-contain" />
                    )}
                  </div>

                  {/* Message Bubble */}
                  {msg.role === 'user' ? (
                    editingIndex === idx ? (
                      <div className="flex flex-col gap-2 w-full max-w-[85%] sm:max-w-[80%]">
                        <textarea
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          maxLength={mode === 'researchpreneurship' ? 2000 : undefined}
                          className="w-full bg-white dark:bg-zinc-800 text-gray-900 dark:text-zinc-100 border border-[#1b60bb] dark:border-blue-500 rounded-2xl p-3 sm:p-3.5 text-xs sm:text-[13px] focus:outline-none focus:ring-2 focus:ring-[#1b60bb]/30 resize-none font-sans font-medium shadow-md"
                          rows={Math.max(2, editText.split('\n').length)}
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleSaveEdit(idx);
                            }
                            if (e.key === 'Escape') {
                              setEditingIndex(null);
                            }
                          }}
                        />
                        <div className="flex items-center gap-2 justify-end">
                          <button
                            type="button"
                            onClick={() => setEditingIndex(null)}
                            className="px-3 py-1.5 rounded-xl border border-gray-300 dark:border-zinc-700 text-gray-600 dark:text-zinc-400 text-xs font-semibold hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSaveEdit(idx)}
                            disabled={!editText.trim() || isThinking}
                            className="px-3.5 py-1.5 rounded-xl bg-[#1b60bb] hover:bg-[#155099] text-white text-xs font-bold transition-all shadow-sm disabled:opacity-50 cursor-pointer"
                          >
                            Save & Submit
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-end max-w-[85%] sm:max-w-[80%]">
                        <div className="p-3.5 sm:p-4 rounded-2xl rounded-tr-xs bg-[#1b60bb] text-white dark:bg-[#272727] dark:border dark:border-white/[0.12] dark:text-gray-100 shadow-md text-xs sm:text-[13px] whitespace-pre-line relative z-10 leading-relaxed font-sans w-full">
                          {/* Top glass shine */}
                          <div className="absolute inset-0 rounded-2xl rounded-tr-xs overflow-hidden pointer-events-none">
                            <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/[0.12] via-transparent to-transparent" />
                          </div>
                          <span className="relative z-10">{msg.content}</span>
                        </div>

                        {/* Action controls below user bubble - visible on hover on desktop, always visible on mobile */}
                        <div className="flex items-center gap-1.5 mt-1.5 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200">
                          <button
                            type="button"
                            onClick={() => handleCopyMessage(idx, msg.content)}
                            className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-semibold text-gray-600 dark:text-zinc-300 hover:text-[#1b60bb] dark:hover:text-blue-400 bg-white/80 dark:bg-zinc-800/80 hover:bg-white dark:hover:bg-zinc-800 border border-gray-200 dark:border-zinc-700/80 rounded-full shadow-2xs transition-all cursor-pointer"
                            title="Copy text"
                          >
                            {copiedIndex === idx ? <Check size={11} className="text-emerald-500" /> : <Copy size={11} />}
                            <span>{copiedIndex === idx ? 'Copied!' : 'Copy'}</span>
                          </button>
                          <button
                            type="button"
                            disabled={isThinking}
                            onClick={() => {
                              setEditingIndex(idx);
                              setEditText(msg.content);
                            }}
                            className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-semibold text-gray-600 dark:text-zinc-300 hover:text-[#1b60bb] dark:hover:text-blue-400 bg-white/80 dark:bg-zinc-800/80 hover:bg-white dark:hover:bg-zinc-800 border border-gray-200 dark:border-zinc-700/80 rounded-full shadow-2xs transition-all cursor-pointer disabled:opacity-50"
                            title="Edit message & resubmit"
                          >
                            <Edit2 size={11} />
                            <span>Edit</span>
                          </button>
                        </div>
                      </div>
                    )
                  ) : (
                    <div className="text-xs sm:text-sm text-gray-800 dark:text-zinc-200 flex-1 min-w-0 py-1">
                      <div className="prose prose-xs sm:prose-sm max-w-none prose-slate dark:prose-invert [&_strong]:!text-[#1b60bb] dark:[&_strong]:!text-[#7dd3fc] [&_table]:!w-full [&_table]:!table-auto [&_table]:!border-collapse [&_th]:!border [&_th]:!border-gray-200 dark:[&_th]:!border-white/[0.1] [&_td]:!border [&_td]:!border-gray-200 dark:[&_td]:!border-white/[0.1] [&_th]:!p-2 [&_th]:!sm:p-2.5 [&_td]:!p-2 [&_td]:!sm:p-2.5 [&_th]:!bg-[#f5f5f5] dark:[&_th]:!bg-[#1a1a1a] dark:[&_th]:!text-[#7dd3fc] [&_th]:!text-left [&_table]:!text-[11px] [&_table]:!sm:text-xs [&_table]:!overflow-x-auto [&_table]:!max-w-full">
                        {(() => {
                          const { cleanText, charts } = parseRomiVisuals(msg.content);
                          const pillOptions: { label: string; query: string }[] = [];
                          const cleanTextWithNoPills = cleanText
                            .replace(/\[\*(.*?)(?:\|(.*?))?\]/g, (_, label, query) => {
                              const lbl = label.trim();
                              pillOptions.push({
                                label: lbl,
                                query: query ? query.trim() : lbl
                              });
                              return '';
                            })
                            .replace(/[ \t]+/g, ' ')
                            .replace(/\n\s*\n/g, '\n\n')
                            .trim();

                          // Parse inline sources from content and merge with backend sources
                          const parsedSources = extractSourcesFromText(msg.content);
                          const allSources = [...(msg.sources || [])];
                          parsedSources.forEach(ps => {
                            if (!allSources.some(s => s.url === ps.url || s.url?.replace(/https?:\/\/(www\.)?/, '') === ps.url?.replace(/https?:\/\/(www\.)?/, ''))) {
                              allSources.push(ps);
                            }
                          });

                          return (
                            <>
                              {/* --- 0. SHOW ON MAP pill (instrumentation messages) --- */}
                              {msg.instrumentation?.map_locations?.length > 0 && (
                                <div className="mb-3 not-prose">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setInstMapLocations(msg.instrumentation.map_locations);
                                      setInstMapOpen(!instMapOpen || instMapLocations !== msg.instrumentation.map_locations);
                                      setInstSelectedId(null);
                                    }}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#1b60bb] hover:bg-[#14498f] text-white dark:bg-[#272727] dark:hover:bg-[#404040] dark:text-[#7dd3fc] border border-[#1b60bb]/40 dark:border-white/[0.12] rounded-full text-xs font-semibold shadow-sm hover:shadow-md transition-all cursor-pointer active:scale-95 group"
                                  >
                                    <MapPin size={14} className="shrink-0 text-white dark:text-[#7dd3fc]" />
                                    <span>View Facility Map ({msg.instrumentation.map_locations.length} pins)</span>
                                    <ArrowUpRight size={14} className="shrink-0 text-white/80 dark:text-[#7dd3fc] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                  </button>

                                  {/* On mobile / tablet (< lg), when button is clicked, map appears inline JUST BELOW the button */}
                                  {instMapOpen && instMapLocations === msg.instrumentation.map_locations && (
                                    <div className="lg:hidden mt-3 w-full not-prose">
                                      <InstrumentMapPanel
                                        locations={enrichLocations(msg.instrumentation.map_locations)}
                                        selectedId={instSelectedId}
                                        onClose={() => setInstMapOpen(false)}
                                        onSelect={(id) => setInstSelectedId(id)}
                                        isInline={true}
                                      />
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* --- 1. SOURCES PANEL (Rendered ABOVE the text) --- */}
                              {allSources.length > 0 && (
                                <div className="mb-4 flex flex-col gap-2 not-prose">
                                  {msg.queries_used && msg.queries_used.length > 0 && (
                                    <div className="text-[10px] text-gray-500 font-mono font-medium flex items-center gap-1.5 px-1">
                                      <Search size={10} />
                                      <span>Results for: "{msg.queries_used.join(', ')}"</span>
                                    </div>
                                  )}
                                  <div className="flex flex-wrap items-center gap-2">
                                    {allSources.slice(0, 3).map((src: any, sIdx: number) => (
                                      <a
                                        key={sIdx}
                                        href={src.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-750 rounded-xl px-3 py-1.5 shadow-sm transition-all no-underline"
                                        title={src.snippet}
                                      >
                                        {/* Free favicon fetcher */}
                                        <img
                                          src={`https://www.google.com/s2/favicons?domain=${src.domain}&sz=32`}
                                          alt={src.domain}
                                          className="w-4 h-4 rounded-sm"
                                        />
                                        <span className="text-xs font-semibold text-gray-700 dark:text-zinc-200 max-w-[120px] truncate">
                                          {src.domain}
                                        </span>
                                      </a>
                                    ))}

                                    <button
                                      onClick={() => {
                                        setActiveSources(allSources);
                                        setRightSidebarOpen(!rightSidebarOpen);
                                      }}
                                      type="button"
                                      className="flex items-center gap-1.5 bg-gray-150/70 hover:bg-[#eff9ff] dark:bg-zinc-800 dark:hover:bg-blue-950/20 text-[#1b60bb] dark:text-blue-400 border border-gray-200 dark:border-zinc-700 rounded-xl px-3 py-1.5 shadow-sm transition-all cursor-pointer font-semibold text-xs active:scale-95 no-underline"
                                      title="Open sources sidebar"
                                    >
                                      <BookOpen size={12} />
                                      <span>View all ({allSources.length})</span>
                                    </button>
                                  </div>
                                </div>
                              )}

                              {/* --- 2. EXISTING MARKDOWN RENDERER --- */}
                              <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={{
                                  table: ({ children }) => <ComparisonTable>{children}</ComparisonTable>,
                                  thead: ({ children }) => <TableHead>{children}</TableHead>,
                                  tr: ({ children }) => <TableRow>{children}</TableRow>,
                                  th: ({ children }) => <TableHeaderCell>{children}</TableHeaderCell>,
                                  td: ({ children }) => <TableCell>{children}</TableCell>,
                                  a: (props) => <SourceAnchor {...props} sources={allSources} />,
                                  p: ({ children }) => <p className="font-sans font-normal text-gray-800 dark:text-gray-200 text-xs sm:text-[13px] leading-relaxed mb-3 last:mb-0">{children}</p>,
                                  strong: ({ children }) => <strong className="font-sans font-bold text-[#1b60bb] dark:text-[#7dd3fc]">{children}</strong>,
                                  em: ({ children }) => <em className="font-sans italic text-gray-800 dark:text-gray-200">{children}</em>,
                                  ul: ({ children }) => <ul className="list-disc pl-5 mb-3 flex flex-col gap-1 font-sans">{children}</ul>,
                                  ol: ({ children }) => <ol className="list-decimal pl-5 mb-3 flex flex-col gap-1 font-sans">{children}</ol>,
                                  li: ({ children }) => <li className="font-sans font-normal text-gray-800 dark:text-gray-200 text-xs sm:text-[13px] leading-relaxed">{children}</li>,
                                  h1: ({ children }) => <h1 className="font-helios font-bold text-[#1b60bb] dark:text-[#7dd3fc] text-sm sm:text-base mt-3.5 mb-1.5">{children}</h1>,
                                  h2: ({ children }) => <h2 className="font-helios font-bold text-[#1b60bb] dark:text-[#7dd3fc] text-xs sm:text-sm mt-3 mb-1.5">{children}</h2>,
                                  h3: ({ children }) => <h3 className="font-helios font-bold text-[#1b60bb] dark:text-[#7dd3fc] text-xs sm:text-[13px] mt-2.5 mb-1">{children}</h3>,
                                }}
                              >
                                {renderSourceLinks(cleanTextWithNoPills)}
                              </ReactMarkdown>

                              {/* --- 2b. INTERACTIVE PILL BUTTONS (Rendered BELOW the text) --- */}
                              {pillOptions.length > 0 && (
                                <div className="flex flex-col sm:flex-row sm:flex-wrap gap-1.5 sm:gap-2 mt-2.5 mb-2">
                                  {pillOptions.map((pill, pIdx) => (
                                    <button
                                      key={pIdx}
                                      type="button"
                                      disabled={isThinking}
                                      onClick={() => !isThinking && handleSendMessage(undefined, pill.query)}
                                      className="text-left flex items-start gap-1 px-2.5 sm:px-3 py-1 bg-white/80 dark:bg-[#272727]/80 border border-gray-200/80 dark:border-white/[0.1] hover:bg-[#eff9ff] dark:hover:bg-sky-950/40 text-[#1b60bb] dark:text-[#7dd3fc] hover:text-[#14498f] dark:hover:text-sky-200 rounded-xl sm:rounded-full text-[10px] sm:text-xs font-semibold shadow-xs transition-all cursor-pointer active:scale-95 leading-snug disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                      <span className="text-gray-400 shrink-0 text-[10px] mt-0.5">↳</span>
                                      <span>{pill.label}</span>
                                    </button>
                                  ))}
                                </div>
                              )}

                              {/* --- 2c. DYNAMIC MARKET VISUALS (Pyramid + Chart + Badge) --- */}
                              {(() => {
                                const showMarketVisuals = msg.market && msg.market.tam_display;
                                const parsedMarket = !showMarketVisuals ? parseMarketDataFromText(msg.content) : null;
                                const parsedYearSeries = !showMarketVisuals ? parseYearSeriesFromText(msg.content) : null;

                                if (!showMarketVisuals && !parsedMarket && !parsedYearSeries) return null;

                                const tamVal = showMarketVisuals ? (msg.market.tam_display || "$0M") : (parsedMarket?.tam || "$0M");
                                const samVal = showMarketVisuals ? (msg.market.sam_display || "$0M") : (parsedMarket?.sam || "$0M");
                                const somVal = showMarketVisuals ? (msg.market.som_display || "$0M") : (parsedMarket?.som || "$0M");
                                const isLLM = showMarketVisuals ? (msg.market.extraction_method === 'llm') : true;
                                const pagesRead = showMarketVisuals ? (msg.market.pages_read || 0) : 0;

                                const showPyramid = showMarketVisuals || parsedMarket;
                                const series = showMarketVisuals ? (msg.market.year_series || []) : (parsedYearSeries || []);
                                const filteredSeries = series.filter((r: any) => Number(r.value) > 0);
                                const showChart = filteredSeries.length >= 2;

                                return (
                                  <div className="mt-5 mb-3 flex flex-col gap-4 bg-white/80 dark:bg-[#1a1a1a]/80 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-gray-200/80 dark:border-white/[0.1] shadow-xs">
                                    {/* Transparency Badge & Mini KSUM Disclaimer */}
                                    <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] tracking-wider font-bold text-gray-500 dark:text-gray-400">
                                      <div className="flex items-center gap-1.5">
                                        <span className="flex items-center gap-1 bg-blue-50/80 dark:bg-blue-900/40 border border-blue-100/50 dark:border-blue-700/40 px-2 py-1 rounded-md text-[#1b60bb] dark:text-[#7dd3fc]">
                                          {isLLM ? 'ROMI AI Analysis' : "ROMI's Analysis"}
                                        </span>
                                        {pagesRead > 0 && (
                                          <span className="text-gray-600 dark:text-gray-300">Analyzed {pagesRead} Full Pages</span>
                                        )}
                                      </div>
                                      <span className="text-[10px] text-gray-400 dark:text-gray-400 font-montserrat tracking-normal">
                                        KSUM is not liable for your decisions based on AI responses.
                                      </span>
                                    </div>

                                    {/* The Market Funnel Pyramid */}
                                    {showPyramid && (
                                      <MarketPyramid
                                        tam={tamVal}
                                        sam={samVal}
                                        som={somVal}
                                      />
                                    )}

                                    {/* Growth chart — self-contained SVG so it ALWAYS renders */}
                                    {showChart && (() => {
                                      const maxV = Math.max(...filteredSeries.map((r: any) => Number(r.value)));
                                      const W = 520, H = 190, PAD = 34;
                                      const bw = Math.min(64, (W - PAD * 2) / filteredSeries.length - 18);
                                      return (
                                        <div className="mt-4 pt-5 border-t border-gray-100 dark:border-white/[0.08]">
                                          <h4 className="text-[11px] font-bold text-gray-500 dark:text-gray-400 mb-3 uppercase text-center tracking-widest">Market Growth Projection</h4>
                                          <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
                                            {filteredSeries.map((r: any, i: number) => {
                                              const v = Number(r.value);
                                              const h = Math.max(6, (v / maxV) * (H - PAD * 2));
                                              const x = PAD + i * ((W - PAD * 2) / filteredSeries.length) + ((W - PAD * 2) / filteredSeries.length - bw) / 2;
                                              const y = H - PAD - h;
                                              return (
                                                <g key={i}>
                                                  <rect x={x} y={y} width={bw} height={h} rx={7} fill="#1b60bb" className="dark:fill-blue-500" opacity={0.6 + 0.4 * (i / Math.max(1, filteredSeries.length - 1))} />
                                                  <text x={x + bw / 2} y={y - 7} textAnchor="middle" fontSize="11" fontWeight="700" className="fill-[#1b60bb] dark:fill-[#7dd3fc]">{r.displayValue}</text>
                                                  <text x={x + bw / 2} y={H - PAD + 16} textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-gray-400">{r.label}</text>
                                                </g>
                                              );
                                            })}
                                            <line x1={PAD - 6} y1={H - PAD} x2={W - PAD + 6} y2={H - PAD} className="stroke-gray-300 dark:stroke-white/[0.12]" strokeWidth="1.5" />
                                          </svg>
                                        </div>
                                      );
                                    })()}
                                  </div>
                                );
                              })()}

                              <VizGrid charts={charts} />

                              {/* --- 2e. TECHNOLOGY CARDS with "See more" (5 -> 10) --- */}
                              {msg.technologies && msg.technologies.length > 0 && (
                                <div className="flex flex-col gap-3 mt-5">
                                  {((expandedTechs[idx] || msg.instrumentation) ? msg.technologies : msg.technologies.slice(0, 5)).map((tech, tIdx) => {
                                    const isHighRelevance = (tech.relevance_score || 0) >= 85;
                                    const instLoc = msg.instrumentation?.map_locations?.find((l: any) => l.id === tech.technology_id);
                                    const sheetItem = instLoc ? instrumentSheetData[tech.technology_id] : null;

                                    const updatedTech = sheetItem
                                      ? {
                                        ...tech,
                                        technology_name: sheetItem.name || tech.technology_name,
                                        institution: sheetItem.facility && sheetItem.institution
                                          ? `${sheetItem.facility}, ${sheetItem.institution}`
                                          : sheetItem.institution || sheetItem.facility || tech.institution,
                                        image_url: sheetItem.image_url || tech.image_url,
                                      }
                                      : tech;

                                    const isInst = !!instLoc || !!msg.instrumentation;
                                    const websiteUrl = sheetItem?.url || instLoc?.url;
                                    const customHref = isInst
                                      ? `https://rink-ui.vercel.app/instrument/${tech.technology_id}`
                                      : websiteUrl
                                        ? (websiteUrl.startsWith('http') ? websiteUrl : `https://${websiteUrl}`)
                                        : undefined;

                                    const card = (
                                      <MiniCard
                                        key={tIdx}
                                        technology={updatedTech}
                                        customHref={customHref}
                                        isInstrumentation={isInst}
                                        contactNumber={sheetItem?.contact}
                                        email={sheetItem?.email}
                                        className={
                                          (instLoc && instSelectedId === tech.technology_id)
                                            ? 'border border-[#1b60bb] dark:border-sky-400 bg-blue-50/20 dark:bg-blue-950/20 shadow-sm'
                                            : isHighRelevance
                                              ? 'border border-emerald-500/70 dark:border-emerald-400/60 bg-emerald-50/10 dark:bg-emerald-950/20 shadow-xs'
                                              : 'border border-gray-200/80 dark:border-white/[0.08] bg-white/95 dark:bg-[#1a1a1a]/95'
                                        }
                                      />
                                    );
                                    if (!instLoc) return card;
                                    return (
                                      <div
                                        key={tIdx}
                                        className="cursor-pointer select-none"
                                        title="Click: visit website & show on map"
                                        onClick={() => {
                                          setInstMapLocations(msg.instrumentation.map_locations);
                                          setInstMapOpen(true);
                                          setInstSelectedId(tech.technology_id);
                                        }}
                                      >
                                        {card}
                                      </div>
                                    );
                                  })}
                                  {msg.technologies.length > 5 && !expandedTechs[idx] && !msg.instrumentation && (
                                    <button
                                      onClick={() => setExpandedTechs(p => ({ ...p, [idx]: true }))}
                                      type="button"
                                      className="self-center px-5 py-2 text-xs font-bold text-[#1b60bb] dark:text-blue-400 border border-gray-200 dark:border-zinc-700 rounded-full hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-all cursor-pointer active:scale-95 shadow-sm"
                                    >
                                      See more ({msg.technologies.length - 5} more)
                                    </button>
                                  )}
                                </div>
                              )}

                              {/* --- 3. FOLLOW-UP BUTTONS (Rendered BELOW the text ONLY on latest message) --- */}
                              {idx === messages.length - 1 && msg.follow_ups && msg.follow_ups.length > 0 && (() => {
                                const instStage = msg.instrumentation?.stage;
                                const isPillGrid = instStage === 'ask_kind' || instStage === 'ask_district';
                                if (isPillGrid) {
                                  return (
                                    <div className="mt-6 border-t border-gray-150 dark:border-zinc-800 pt-4">
                                      <div className="grid grid-cols-2 gap-2.5">
                                        {msg.follow_ups.map((followUpText: string, fIdx: number) => (
                                          <button
                                            key={fIdx}
                                            type="button"
                                            disabled={isThinking}
                                            onClick={() => !isThinking && handleSendMessage(undefined, followUpText)}
                                            className="flex items-center justify-between gap-2 px-4 py-2.5 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 hover:bg-[#eff9ff] dark:hover:bg-blue-950/20 hover:border-blue-200 dark:hover:border-blue-900/50 text-[#1b60bb] dark:text-blue-400 rounded-full text-sm font-semibold shadow-sm transition-all cursor-pointer active:scale-95 text-left disabled:opacity-50 disabled:cursor-not-allowed"
                                          >
                                            <span className="truncate">{followUpText}</span>
                                            <CornerDownRight size={14} className="text-gray-400 dark:text-zinc-500 shrink-0" />
                                          </button>
                                        ))}
                                      </div>
                                    </div>
                                  );
                                }
                                return (
                                  <div className="mt-6 flex flex-col border-t border-gray-150 dark:border-zinc-800 pt-4">
                                    <div className="flex flex-col">
                                      {msg.follow_ups.map((followUpText: string, fIdx: number) => (
                                        <button
                                          key={fIdx}
                                          type="button"
                                          disabled={isThinking}
                                          onClick={() => !isThinking && handleSendMessage(undefined, followUpText)}
                                          className="w-full text-left py-2.5 px-2 flex items-start gap-2.5 text-[#1b60bb] hover:text-[#14498f] dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium transition-all group cursor-pointer border-b border-gray-100 dark:border-zinc-850/60 last:border-b-0 hover:bg-gray-50/50 dark:hover:bg-zinc-800/30 rounded-lg active:scale-[0.995] disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                          <CornerDownRight size={16} className="text-gray-400 dark:text-zinc-500 mt-0.5 shrink-0 transition-colors group-hover:text-[#1b60bb] dark:group-hover:text-blue-400" />
                                          <span className="flex-1 leading-snug">{followUpText}</span>
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                );
                              })()}

                              {/* --- 4. RESEARCHPRENEURSHIP ASSESSMENT CARDS & REVIEWS --- */}
                              {msg.assessmentFinalReview && msg.assessmentFinalReview.length > 0 ? (
                                <div className="mt-4 mb-2 bg-gradient-to-b from-white to-gray-50/50 dark:from-zinc-900 dark:to-zinc-900/60 border border-gray-200 dark:border-zinc-800 rounded-3xl p-4 sm:p-5 shadow-md">
                                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100 dark:border-zinc-800">
                                    <h3 className="font-helios font-bold text-sm text-gray-900 dark:text-zinc-100">
                                      📋 Your Complete Concept Note
                                    </h3>
                                    <span className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">
                                      {msg.assessmentFinalReview.length} sections
                                    </span>
                                  </div>
                                  <div className="max-h-[420px] overflow-y-auto pr-1 flex flex-col gap-2.5 scrollbar-thin">
                                    {msg.assessmentFinalReview.map((card, i) => card && (
                                      <AssessmentMiniCard
                                        key={i}
                                        sectionNumber={card.section_number}
                                        sectionTitle={card.section_title}
                                        questions={card.questions}
                                        refinedAnswer={card.refined_answer}
                                        wordCount={card.word_count}
                                      />
                                    ))}
                                  </div>
                                </div>
                              ) : msg.assessmentCard && (
                                <AssessmentMiniCard
                                  sectionNumber={msg.assessmentCard.section_number}
                                  sectionTitle={msg.assessmentCard.section_title}
                                  questions={msg.assessmentCard.questions}
                                  refinedAnswer={msg.assessmentCard.refined_answer}
                                  wordCount={msg.assessmentCard.word_count}
                                />
                              )}

                              {/* --- 5. REPORT READY DOWNLOAD BUTTONS --- */}
                              {msg.reportReadyForSession && (
                                <div className="mt-4 flex flex-wrap gap-2.5">
                                  <button
                                    onClick={() => handleDownloadReport('docx', msg.reportReadyForSession!)}
                                    disabled={downloadingFormat !== null}
                                    type="button"
                                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1b60bb] hover:bg-[#155099] text-white text-xs font-bold rounded-xl shadow-sm transition-colors disabled:opacity-60 cursor-pointer"
                                  >
                                    {downloadingFormat === 'docx' ? 'Generating…' : 'Download DOCX ↓'}
                                  </button>
                                  <button
                                    onClick={() => handleDownloadReport('pdf', msg.reportReadyForSession!)}
                                    disabled={downloadingFormat !== null}
                                    type="button"
                                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-700 text-gray-800 dark:text-zinc-200 text-xs font-bold rounded-xl shadow-sm transition-colors disabled:opacity-60 cursor-pointer"
                                  >
                                    {downloadingFormat === 'pdf' ? 'Generating…' : 'Download PDF ↓'}
                                  </button>
                                  <button
                                    onClick={() => handleDownloadReport('pptx', msg.reportReadyForSession!)}
                                    disabled={downloadingFormat !== null}
                                    type="button"
                                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#f0f9ff] dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/40 hover:bg-[#e0f2fe] dark:hover:bg-blue-900/40 text-[#1b60bb] dark:text-blue-400 text-xs font-bold rounded-xl shadow-sm transition-colors disabled:opacity-60 cursor-pointer"
                                  >
                                    {downloadingFormat === 'pptx' ? 'Generating…' : 'Download Presentation ↓'}
                                  </button>
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

                              {/* Copy assistant response button - visible on hover on desktop, always visible on mobile */}
                              <div className="mt-3 flex items-center gap-2 not-prose opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200">
                                <button
                                  type="button"
                                  onClick={() => handleCopyMessage(idx, msg.content)}
                                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-gray-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 hover:bg-white dark:hover:bg-zinc-800 text-[10px] font-semibold text-gray-600 dark:text-zinc-300 hover:text-[#1b60bb] dark:hover:text-blue-400 transition-all cursor-pointer shadow-2xs"
                                  title="Copy answer"
                                >
                                  {copiedIndex === idx ? <Check size={11} className="text-emerald-500" /> : <Copy size={11} />}
                                  <span>{copiedIndex === idx ? 'Copied!' : 'Copy'}</span>
                                </button>
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
              {isThinking && (thinkingSessionId === currentSessionId || thinkingSessionId === sessionRef.current) && (
                <div className="flex gap-3 max-w-4xl w-full mr-auto items-center">
                  <div className="shrink-0 flex items-center justify-center">
                    <img src="/romi-avatar.png" alt="Romi" className="w-8 h-8 sm:w-12 sm:h-12 object-contain" />
                  </div>
                  <div className="mr-auto pl-1">
                    <RomiThinkingIndicator query={messages[messages.length - 1]?.content || ''} />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <div className="w-full px-4 md:px-8 pt-4 pb-3 z-20 bg-transparent shrink-0 flex flex-col gap-2">
              <form onSubmit={handleSendMessage} className="max-w-4xl w-full mx-auto relative flex items-end">

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
                            { id: 'search', label: 'Explore', icon: <Search size={14} /> },
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
                              className={`w-full text-left px-3 py-2.5 text-xs rounded-xl transition-all font-medium font-sans flex items-center gap-2.5 ${mode === option.id
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
                    disabled={showConsent || isThinking}
                    maxLength={mode === 'researchpreneurship' ? 2000 : undefined}
                    placeholder={isThinking ? "Romi is thinking... Please wait" : `Ask Romi (${mode === 'search' ? 'explore' : mode === 'researchpreneurship' ? 'research' : mode === 'instrumentation' ? 'instruments' : mode})...`}
                    className={`w-full bg-white dark:bg-zinc-900 text-gray-900 dark:text-zinc-100 placeholder:text-gray-400 dark:placeholder:text-zinc-500 border border-gray-250 dark:border-zinc-800 rounded-2xl py-3.5 pl-14 pr-14 shadow-[0_15px_40px_rgba(0,0,0,0.14)] dark:shadow-none focus:outline-none focus:ring-2 focus:ring-[#1b60bb]/20 resize-none font-sans font-medium disabled:opacity-60 disabled:cursor-not-allowed ${inputVal.length > 200 ? 'overflow-y-auto textarea-micro-scrollbar' : 'overflow-hidden scrollbar-hide'
                      }`}
                    style={{ minHeight: '52px', maxHeight: '200px' }}
                  />
                  {mode === 'researchpreneurship' && (
                    <div className={`absolute bottom-[-18px] right-2 text-[10px] font-mono font-semibold select-none ${
                      inputVal.length >= 2000 ? 'text-red-500' :
                      inputVal.length >= 1800 ? 'text-amber-500' :
                      'text-gray-400 dark:text-zinc-500'
                    }`}>
                      {inputVal.length}/2000
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={showConsent || isThinking || !inputVal.trim()}
                    className="absolute right-2 bottom-[8px] w-9 h-9 bg-black dark:bg-zinc-800 text-white dark:text-zinc-300 rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                  >
                    <ArrowUp size={16} />
                  </button>
                </div>
              </form>

              {/* Disclaimer Text */}
              <p className="text-[10px] text-gray-400/90 dark:text-zinc-500/90 text-center font-sans font-medium select-none pointer-events-none">
                ROMI AI can make mistakes. KSUM is not liable for your financial decisions.
              </p>
            </div>
          </div>

          {/* Sources Sidebar */}
          {rightSidebarOpen && activeSources.length > 0 && (
            <>
              {/* Backdrop for mobile / tablet screens (< md): NO BLUR, light dark tint over chat */}
              <div
                className="md:hidden absolute inset-0 bg-black/20 z-30 transition-opacity"
                onClick={() => setRightSidebarOpen(false)}
              />

              {/* Sidebar / Right Panel (Half screen on mobile, same height as conversational area) */}
              <div className="absolute md:relative top-0 right-0 bottom-0 z-40 md:z-auto w-1/2 min-w-[210px] sm:w-[320px] md:w-[360px] xl:w-80 border-l border-gray-200 dark:border-zinc-800 bg-[#FAF9F5]/95 dark:bg-[#121212]/95 backdrop-blur-xl p-3 sm:p-5 overflow-y-auto shrink-0 flex flex-col gap-3 sm:gap-3.5 shadow-xl md:shadow-none h-full rounded-l-2xl md:rounded-none">
                <div className="flex items-center justify-between pb-2.5 shrink-0 border-b border-gray-200/60 dark:border-zinc-800">
                  <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                    <h3 className="text-[10px] sm:text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-widest font-montserrat truncate">SOURCES</h3>
                    <span className="text-[9px] sm:text-[11px] bg-gray-200/70 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 px-2 py-0.5 rounded-full font-mono font-bold shrink-0">
                      {activeSources.length} Links
                    </span>
                  </div>
                  <button
                    onClick={() => setRightSidebarOpen(false)}
                    type="button"
                    className="p-1 hover:bg-gray-200 dark:hover:bg-zinc-800 text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-200 rounded-lg transition-colors cursor-pointer shrink-0 ml-1"
                    title="Close panel"
                  >
                    <X size={15} />
                  </button>
                </div>

                <div className="flex flex-col gap-2.5 sm:gap-3.5 overflow-y-auto">
                  {activeSources.map((src: any, idx: number) => {
                    const cleanTitle = String(src.title || src.domain || 'Source').replace(/^SRC_CHIP:/, '').trim();
                    const cleanDomain = String(src.domain || 'source').replace(/^SRC_CHIP:/, '').trim();
                    return (
                      <a
                        key={idx}
                        href={src.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col gap-1 sm:gap-1.5 p-2.5 sm:p-4 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm border border-gray-200/50 dark:border-zinc-800 rounded-xl sm:rounded-2xl hover:border-blue-300 dark:hover:border-blue-700 transition-all group shadow-xs hover:shadow-md"
                      >
                        <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-bold text-gray-800 dark:text-zinc-200">
                          <img
                            src={`https://www.google.com/s2/favicons?domain=${cleanDomain}&sz=32`}
                            alt=""
                            className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-xs shrink-0 object-contain"
                            onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                          />
                          <span className="truncate group-hover:text-[#1b60bb] dark:group-hover:text-blue-400 font-bold">{cleanDomain}</span>
                        </div>
                        <span className="text-[11px] sm:text-sm font-bold text-gray-900 dark:text-zinc-100 leading-snug line-clamp-2">
                          {cleanTitle}
                        </span>
                        {src.snippet && (
                          <p className="text-[9px] sm:text-[11px] text-gray-500 dark:text-zinc-400 leading-relaxed line-clamp-2 mt-0.5">
                            {src.snippet}
                          </p>
                        )}
                      </a>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {instMapOpen && instMapLocations.length > 0 && (
            <div className="hidden lg:flex h-full py-2 pl-2 shrink-0">
              <InstrumentMapPanel
                locations={enrichLocations(instMapLocations)}
                selectedId={instSelectedId}
                onClose={() => setInstMapOpen(false)}
                onSelect={(id) => setInstSelectedId(id)}
                isInline={false}
              />
            </div>
          )}
        </div>
      </div>

      {showConsent && (
        <StorageConsentPopup
          onClose={handleConsentPopupClose}
          onCancel={handleConsentPopupCancel}
          isHighlighted={isConsentHighlighted}
          isCentered={true}
        />
      )}

      {showIPNotice && (
        <IPProtectionNotice onClose={() => setShowIPNotice(false)} />
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
