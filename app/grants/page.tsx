// C:\Users\Akash Krishna\Downloads\RINK KSUM Website\app\grants\page.tsx

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ExternalLink, Image as ImageIcon, X, ChevronDown, Loader2, ArrowUpRight } from 'lucide-react';
import Navbar from '@/HomePage/Navbar';
import Footer from '@/HomePage/Footer';
import { getProxiedImageUrl } from '@/lib/utils';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface SheetGrant {
  id: string;
  title: string;
  last_date: string;
  description: string;
  poster_link: string;
  registration_link: string;
}

type FilterStatus = 'all' | 'open' | 'closed';

function parseDateSafe(dateStr: string): number {
  if (!dateStr) return 0;
  // Handle DD/MM/YYYY or DD-MM-YYYY format
  const dmyMatch = dateStr.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/);
  if (dmyMatch) {
    const day = parseInt(dmyMatch[1], 10);
    const month = parseInt(dmyMatch[2], 10) - 1; // 0-indexed month
    const year = parseInt(dmyMatch[3], 10);
    const parsedDate = new Date(year, month, day);
    if (!isNaN(parsedDate.getTime())) {
      return parsedDate.getTime();
    }
  }

  // Handle standard Date.parse (e.g. YYYY-MM-DD)
  const t = Date.parse(dateStr);
  if (!isNaN(t)) return t;

  return 0;
}

function formatDisplayDate(dateStr: string) {
  if (!dateStr) return 'No Deadline';
  const t = parseDateSafe(dateStr);
  if (t === 0) return dateStr;
  const d = new Date(t);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function formatDisplayDateLong(dateStr: string) {
  if (!dateStr) return 'No Deadline';
  const t = parseDateSafe(dateStr);
  if (t === 0) return dateStr;
  const d = new Date(t);
  return d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

function stripMarkdownLinks(text: string): string {
  if (!text) return '';
  return text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
}

function GrantCard({ grant, isOpen, idx, onClick }: { grant: SheetGrant; isOpen: boolean; idx: number; onClick: (g: SheetGrant) => void }) {
  const statusText = isOpen ? 'Open' : 'Closed';
  const [imgError, setImgError] = useState(false);
  const [useDirectUrl, setUseDirectUrl] = useState(false);

  const proxiedUrl = getProxiedImageUrl(grant.poster_link);
  const driveMatch = grant.poster_link ? (
    grant.poster_link.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || 
    grant.poster_link.match(/\/d\/([a-zA-Z0-9_-]+)/) ||
    grant.poster_link.match(/[?&]id=([a-zA-Z0-9_-]+)/) ||
    grant.poster_link.match(/[?&]docid=([a-zA-Z0-9_-]+)/)
  ) : null;
  const directUrl = driveMatch && driveMatch[1]
    ? `https://lh3.googleusercontent.com/d/${driveMatch[1]}=s600`
    : (grant.poster_link && grant.poster_link.includes('googleusercontent.com') && !grant.poster_link.includes('=s')
        ? `${grant.poster_link}=s600`
        : grant.poster_link);

  const handleImageError = () => {
    if (!useDirectUrl) {
      setUseDirectUrl(true);
    } else {
      setImgError(true);
    }
  };

  return (
    <motion.div
      key={grant.id}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.05 }}
      transition={{ duration: 0.5, delay: Math.min(idx * 0.08, 0.4) }}
      onClick={() => onClick(grant)}
      className="group bg-white rounded-3xl overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_24px_-4px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-200 flex flex-col cursor-pointer w-[240px] xs:w-[260px] sm:w-[280px] md:w-[300px] shrink-0 snap-start h-auto border border-slate-100/80 gpu"
      style={{
        contentVisibility: 'auto',
        containIntrinsicSize: '300px 500px',
      }}
    >
      <div className="relative w-full aspect-[4/5] overflow-hidden bg-slate-100 flex-shrink-0">
        {grant.poster_link && !imgError ? (
          <Image
            src={useDirectUrl ? directUrl : proxiedUrl}
            alt={grant.title}
            fill
            unoptimized={true}
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-w-768px) 100vw, 300px"
            onError={handleImageError}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#011a38] via-[#00050e] to-[#1b60bb] p-6 text-center">
            <ImageIcon size={44} className="text-white/40 mb-3" />
            <span className="font-helios text-base font-bold text-white/90 line-clamp-3 leading-snug">{grant.title}</span>
          </div>
        )}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-sm z-10">
          <span className={`font-helios font-bold text-xs sm:text-sm tracking-wide uppercase ${isOpen ? 'text-[#1b60bb]' : 'text-slate-500'}`}>{statusText}</span>
        </div>
      </div>
      <div className="p-4 sm:p-5 flex flex-col flex-grow">
        <h3 className="font-helios text-base sm:text-lg font-bold mb-1.5 sm:mb-2 line-clamp-2 transition-colors text-slate-800 group-hover:text-[#1b60bb] flex items-center justify-between gap-2">
          <span className="line-clamp-1">{grant.title}</span>
          <ArrowUpRight size={16} className="shrink-0 text-slate-400 group-hover:text-[#1b60bb] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
        </h3>
        {grant.description && (
          <p className="text-slate-600 font-poppins text-[11px] sm:text-xs leading-relaxed mb-3 sm:mb-4 line-clamp-3 sm:line-clamp-4 whitespace-pre-line">{stripMarkdownLinks(grant.description)}</p>
        )}
        <div className="bg-gradient-to-b from-[#f0f4f9]/90 to-[#e8eef6]/80 rounded-2xl p-3.5 sm:p-4 shadow-[inset_0_2px_4px_rgba(0,0,0,0.06),inset_0_-1px_2px_rgba(255,255,255,0.8)] border border-slate-200/60 space-y-2.5 sm:space-y-3 mt-auto">
          <div className="flex items-center gap-2.5 sm:gap-3 text-slate-700 font-poppins text-xs sm:text-sm font-medium">
            <div className="w-7 h-7 rounded-full bg-white/90 shadow-[0_1px_3px_rgba(0,0,0,0.08)] flex items-center justify-center shrink-0">
              <Calendar size={14} className="text-[#1b60bb]" />
            </div>
            <span>{isOpen ? 'Deadline: ' : 'Closed: '}{formatDisplayDate(grant.last_date)}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function SectionHeader({
  title,
  currentIndex = 1,
  totalCount = 0,
  color = 'text-[#1b60bb]',
  dividerColor = 'bg-blue-200'
}: {
  title: string;
  currentIndex?: number;
  totalCount?: number;
  color?: string;
  dividerColor?: string;
}) {
  return (
    <div className="flex items-center gap-4 mb-8 sm:mb-10">
      <h2 className={`font-helios text-2xl sm:text-3xl md:text-4xl font-bold ${color} whitespace-nowrap`}>{title}</h2>
      <div className={`h-px ${dividerColor} flex-grow rounded-full`} />
      {totalCount > 0 && (
        <div className="flex items-center gap-1 bg-white border border-blue-100 px-3.5 py-1.5 rounded-full shadow-sm text-xs sm:text-sm font-helios font-bold text-[#1b60bb] shrink-0">
          <span>{currentIndex}</span>
          <span className="text-blue-300 font-light">/</span>
          <span className="text-slate-400 font-normal">{totalCount}</span>
        </div>
      )}
    </div>
  );
}

function GrantCarouselSection({
  title,
  grants,
  isOpen,
  onCardClick,
  emptyLabel
}: {
  title: string;
  grants: SheetGrant[];
  isOpen: boolean;
  onCardClick: (grant: SheetGrant) => void;
  emptyLabel: string;
}) {
  const [currentIndex, setCurrentIndex] = useState(1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const cardWidthRef = useRef<number | null>(null);

  useEffect(() => {
    cardWidthRef.current = null;
    const handleResize = () => {
      cardWidthRef.current = null;
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [grants]);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const el = scrollRef.current;
    const scrollLeft = el.scrollLeft;

    let cardWidth = cardWidthRef.current;
    if (cardWidth === null) {
      const firstCard = el.firstElementChild as HTMLElement;
      cardWidth = firstCard ? firstCard.offsetWidth + 20 : 320;
      cardWidthRef.current = cardWidth;
    }

    const idx = Math.round(scrollLeft / cardWidth) + 1;
    const targetIdx = Math.min(Math.max(idx, 1), grants.length);
    setCurrentIndex(prev => prev !== targetIdx ? targetIdx : prev);
  };

  return (
    <section className="py-12 px-4 md:px-8 max-w-[1400px] mx-auto">
      <SectionHeader
        title={title}
        currentIndex={currentIndex}
        totalCount={grants.length}
        color={isOpen ? 'text-[#1b60bb]' : 'text-slate-600'}
        dividerColor={isOpen ? 'bg-blue-200' : 'bg-slate-200'}
      />
      {grants.length > 0 ? (
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-5 md:gap-8 overflow-x-auto pb-6 pt-2 -mx-4 pl-5 pr-5 sm:mx-0 sm:px-0 snap-x snap-mandatory scrollbar-none"
        >
          {grants.map((grant, idx) => (
            <GrantCard key={grant.id} grant={grant} isOpen={isOpen} idx={idx} onClick={onCardClick} />
          ))}
        </div>
      ) : (
        <EmptyState label={emptyLabel} />
      )}
    </section>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="bg-[#1b60bb]/5 rounded-3xl p-10 text-center border border-[#1b60bb]/10 shadow-sm">
      <p className="font-helios text-xl text-[#1b60bb]/60">{label}</p>
    </div>
  );
}

export default function GrantsPage() {
  const [openGrants, setOpenGrants] = useState<SheetGrant[]>([]);
  const [closedGrants, setClosedGrants] = useState<SheetGrant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedGrant, setSelectedGrant] = useState<SheetGrant | null>(null);
  const [selectedGrantImgError, setSelectedGrantImgError] = useState(false);
  const [selectedGrantUseDirect, setSelectedGrantUseDirect] = useState(false);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [filterOpen, setFilterOpen] = useState(false);
  const [imageAspectRatio, setImageAspectRatio] = useState<number | null>(null);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    setIsDesktop(window.innerWidth >= 768);
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (selectedGrant) {
      setSelectedGrantImgError(false);
      setSelectedGrantUseDirect(false);
      setImageAspectRatio(null);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedGrant]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/grants', { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to load');
        const data = await res.json();
        
        const allGrants: SheetGrant[] = data.grants ?? [];
        
        // Split using current date/time
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
        
        const openList: SheetGrant[] = [];
        const closedList: SheetGrant[] = [];
        
        allGrants.forEach(g => {
          const deadline = parseDateSafe(g.last_date);
          const isOpen = deadline === 0 || deadline >= todayStart;
          if (isOpen) {
            openList.push(g);
          } else {
            closedList.push(g);
          }
        });
        
        // Sort Open Grants: Closest deadline first (Date ascending). No deadline goes to the end.
        openList.sort((a, b) => {
          const tA = parseDateSafe(a.last_date);
          const tB = parseDateSafe(b.last_date);
          if (tA === 0 && tB !== 0) return 1;
          if (tA !== 0 && tB === 0) return -1;
          return tA - tB;
        });
        
        // Sort Closed Grants: Most recently closed first (Date descending)
        closedList.sort((a, b) => {
          const tA = parseDateSafe(a.last_date);
          const tB = parseDateSafe(b.last_date);
          return tB - tA;
        });

        setOpenGrants(openList);
        setClosedGrants(closedList);
      } catch {
        setError('Could not load grants. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filterLabels: Record<FilterStatus, string> = {
    all: 'All Grants', open: 'Open Grants', closed: 'Closed Grants',
  };

  const showOpen = filterStatus === 'all' || filterStatus === 'open';
  const showClosed = filterStatus === 'all' || filterStatus === 'closed';

  const handleCardClick = useCallback((g: SheetGrant) => {
    setSelectedGrant(g);
    setSelectedGrantImgError(false);
  }, []);

  // Check if selected grant is currently open
  const isSelectedGrantOpen = selectedGrant ? (() => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const deadline = parseDateSafe(selectedGrant.last_date);
    return deadline === 0 || deadline >= todayStart;
  })() : false;

  return (
    <main className="min-h-screen bg-[#F4F7FB] relative w-full overflow-x-hidden">
      <Navbar />

      <section className="relative w-full h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80')" }}>
          <div className="absolute inset-0 bg-gradient-to-r from-[#010101]/95 via-[#011a38]/85 to-[#1b60bb]/80" />
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="font-helios text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              RINK <span className="text-[#5cc4fe]">Grants</span>
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-white/80 font-poppins max-w-2xl mx-auto leading-relaxed text-center px-4">
              Explore open and upcoming grant opportunities from all around India to fund your research, deep-tech innovation, and startup journey.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 pt-10 pb-0 flex justify-end">
        <div className="relative">
          <button
            onClick={() => setFilterOpen(p => !p)}
            className="flex items-center gap-2 bg-white border border-blue-100 hover:border-[#1b60bb] rounded-xl px-5 py-3 font-helios font-semibold text-slate-700 text-sm shadow-sm transition-all"
          >
            {filterLabels[filterStatus]}
            <ChevronDown size={16} className={`transition-transform ${filterOpen ? 'rotate-180' : ''}`} />
          </button>
          <AnimatePresence>
            {filterOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 1 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 bg-white border border-blue-100 rounded-2xl shadow-xl z-50 overflow-hidden min-w-[180px]"
              >
                {(Object.entries(filterLabels) as [FilterStatus, string][]).map(([val, label]) => (
                  <button
                    key={val}
                    onClick={() => { setFilterStatus(val); setFilterOpen(false); }}
                    className={`w-full text-left px-5 py-3 font-poppins text-sm transition-colors ${filterStatus === val ? 'bg-blue-50 text-[#1b60bb] font-semibold' : 'text-slate-700 hover:bg-slate-50'}`}
                  >
                    {label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-32">
          <Loader2 size={40} className="text-[#1b60bb] animate-spin" />
          <span className="ml-3 font-poppins text-slate-500">Loading grants...</span>
        </div>
      )}

      {error && !loading && (
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-16 text-center">
          <p className="font-poppins text-red-400 text-lg">{error}</p>
        </div>
      )}

      {!loading && !error && (
        <>
          {showOpen && (
            <GrantCarouselSection
              title="Open Grants"
              grants={openGrants}
              isOpen={true}
              onCardClick={handleCardClick}
              emptyLabel="No open grants at the moment. Check back soon!"
            />
          )}
          {showClosed && (
            <GrantCarouselSection
              title="Closed Grants"
              grants={closedGrants}
              isOpen={false}
              onCardClick={handleCardClick}
              emptyLabel="No closed grants found."
            />
          )}
        </>
      )}

      <AnimatePresence>
        {selectedGrant && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedGrant(null)} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]" />
             <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] xs:w-[85%] max-w-[340px] md:max-w-4xl h-[78vh] md:h-[504px] bg-white rounded-3xl shadow-2xl z-[101] overflow-hidden flex flex-col md:flex-row md:items-stretch"
            >
              <button onClick={() => setSelectedGrant(null)} className="absolute top-3 right-3 p-2 bg-white/80 hover:bg-white backdrop-blur-md rounded-full shadow-md transition-colors z-20">
                <X size={18} className="text-slate-700" />
              </button>
              <div 
                className="relative w-full h-[42%] md:h-full bg-slate-100 overflow-hidden shrink-0"
                style={{ 
                  width: isDesktop && imageAspectRatio ? `${Math.min(Math.max(504 * imageAspectRatio, 250), 504)}px` : undefined 
                }}
              >
                {selectedGrant.poster_link && !selectedGrantImgError ? (
                  (() => {
                    const posterSrc = selectedGrantUseDirect 
                      ? (() => {
                          const driveMatch = selectedGrant.poster_link.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || 
                                             selectedGrant.poster_link.match(/\/d\/([a-zA-Z0-9_-]+)/) ||
                                             selectedGrant.poster_link.match(/[?&]id=([a-zA-Z0-9_-]+)/) ||
                                             selectedGrant.poster_link.match(/[?&]docid=([a-zA-Z0-9_-]+)/);
                          if (driveMatch && driveMatch[1]) {
                            return `https://lh3.googleusercontent.com/d/${driveMatch[1]}=s800`;
                          }
                          return selectedGrant.poster_link.includes('googleusercontent.com') && !selectedGrant.poster_link.includes('=s')
                            ? `${selectedGrant.poster_link}=s800`
                            : selectedGrant.poster_link;
                        })()
                      : getProxiedImageUrl(selectedGrant.poster_link);
                    return (
                      <>
                        {/* Blurred ambient background */}
                        <Image
                          src={posterSrc}
                          alt=""
                          fill
                          unoptimized={true}
                          className="object-cover filter blur-md opacity-25 scale-110 pointer-events-none"
                        />
                        {/* Sharp foreground containing the full poster */}
                        <Image
                          src={posterSrc}
                          alt={selectedGrant.title}
                          fill
                          unoptimized={true}
                          className="object-contain z-10"
                          sizes="(max-w-768px) 300px, 45vw"
                          onLoad={(e) => {
                            const { naturalWidth, naturalHeight } = e.currentTarget;
                            if (naturalWidth && naturalHeight) {
                              setImageAspectRatio(naturalWidth / naturalHeight);
                            }
                          }}
                          onError={() => {
                            if (!selectedGrantUseDirect) {
                              setSelectedGrantUseDirect(true);
                            } else {
                              setSelectedGrantImgError(true);
                            }
                          }}
                        />
                      </>
                    );
                  })()
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#011a38] via-[#00050e] to-[#1b60bb] p-6 text-center">
                    <ImageIcon size={48} className="text-white/40 mb-3" />
                    <span className="font-helios text-lg font-bold text-white/90 leading-snug">{selectedGrant.title}</span>
                  </div>
                )}
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-sm z-10">
                  <span className={`font-helios font-bold text-xs tracking-wide uppercase ${isSelectedGrantOpen ? 'text-[#1b60bb]' : 'text-slate-500'}`}>
                    {isSelectedGrantOpen ? 'Open' : 'Closed'}
                  </span>
                </div>
              </div>
              <div className="relative w-full md:w-[55%] h-[58%] md:h-full p-4 sm:p-5 flex flex-col overflow-hidden bg-white min-h-0 shrink md:shrink">
                <div className="flex-shrink-0">
                  <h2 className="font-helios text-lg sm:text-xl font-bold text-slate-800 mb-2 leading-tight">{selectedGrant.title}</h2>
                </div>

                <div className="flex-grow overflow-y-auto overflow-x-hidden custom-scrollbar pr-2 mb-3 min-h-0 space-y-3">
                  <div className="space-y-2.5 p-3 md:p-4 bg-gradient-to-b from-[#f0f4f9]/90 to-[#e8eef6]/80 rounded-2xl border border-slate-200/60">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 md:w-9 md:h-9 rounded-full bg-white shadow-[0_2px_6px_rgba(0,0,0,0.08)] flex items-center justify-center shrink-0">
                        <Calendar className="w-3.5 h-3.5 md:w-[17px] md:h-[17px] text-[#1b60bb]" />
                      </div>
                      <div>
                        <p className="font-helios font-semibold text-slate-800 text-[10px] md:text-xs">Application Deadline</p>
                        <p className="text-slate-600 font-poppins text-[10px] md:text-[13px]">{formatDisplayDateLong(selectedGrant.last_date)}</p>
                      </div>
                    </div>
                  </div>

                  {selectedGrant.description && (
                    <div className="text-slate-600 font-poppins text-[11px] sm:text-xs md:text-[13px] leading-relaxed whitespace-pre-wrap break-words markdown-content">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          a: ({ node, ...props }) => (
                            <a
                              {...props}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#1b60bb] hover:underline font-semibold"
                            />
                          )
                        }}
                      >
                        {selectedGrant.description}
                      </ReactMarkdown>
                    </div>
                  )}
                </div>

                <div className="flex-shrink-0 pt-2 md:pt-3 border-t border-slate-100 flex flex-col gap-2">
                  {selectedGrant.registration_link && isSelectedGrantOpen ? (
                    <a href={selectedGrant.registration_link} target="_blank" rel="noreferrer" className="w-full py-2 md:py-3.5 bg-[#1b60bb] hover:bg-[#154a93] text-white rounded-xl font-helios font-bold text-xs md:text-sm text-center transition-colors flex items-center justify-center gap-2 group/btn">
                      Apply for Grant
                      <ExternalLink className="w-3.5 h-3.5 md:w-4 md:h-4 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5 transition-transform" />
                    </a>
                  ) : (
                    <button disabled className="w-full py-2 md:py-3.5 bg-slate-100 text-slate-400 rounded-xl font-helios font-bold text-xs md:text-sm text-center cursor-not-allowed flex items-center justify-center gap-2">
                      Applications Closed
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <Footer />
      <style dangerouslySetInnerHTML={{ __html: `.custom-scrollbar{scrollbar-width:thin;scrollbar-color:#1b60bb rgba(0,0,0,0.02)}.custom-scrollbar::-webkit-scrollbar{width:4px}.custom-scrollbar::-webkit-scrollbar-track{background:rgba(0,0,0,0.02);border-radius:4px}.custom-scrollbar::-webkit-scrollbar-thumb{background:#1b60bb;border-radius:4px}.custom-scrollbar::-webkit-scrollbar-thumb:hover{background:#154a93}.scrollbar-none::-webkit-scrollbar{display:none}.scrollbar-none{-ms-overflow-style:none;scrollbar-width:none}` }} />
    </main>
  );
}
