'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ExternalLink, Image as ImageIcon, X, ChevronDown, Send, ArrowUpRight, ArrowRight } from 'lucide-react';
import Navbar from '@/HomePage/Navbar';
import Footer from '@/HomePage/Footer';
import { getProxiedImageUrl } from '@/lib/utils';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useRealTimeSync } from '@/hooks/useRealTimeSync';
import { pb, mapPbFund, Fund } from '@/lib/pocketbase';

type FilterStatus = 'all' | 'open' | 'closed';

function parseDateSafe(dateStr: string): number {
  if (!dateStr) return 0;
  // Handle DD/MM/YYYY or DD-MM-YYYY format
  const dmyMatch = dateStr.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/);
  if (dmyMatch) {
    const day = parseInt(dmyMatch[1], 10);
    const month = parseInt(dmyMatch[2], 10) - 1; // 0-indexed month
    const year = parseInt(dmyMatch[3], 10);
    const parsedDate = new Date(Date.UTC(year, month, day));
    if (!isNaN(parsedDate.getTime())) {
      return parsedDate.getTime();
    }
  }

  // Handle standard Date.parse
  const t = Date.parse(dateStr);
  if (!isNaN(t)) return t;

  return 0;
}

function formatDisplayDate(dateStr: string) {
  if (!dateStr) return 'No Deadline';
  const t = parseDateSafe(dateStr);
  if (t === 0) return dateStr;
  const d = new Date(t);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
}

function formatDisplayDateLong(dateStr: string) {
  if (!dateStr) return 'No Deadline';
  const t = parseDateSafe(dateStr);
  if (t === 0) return dateStr;
  const d = new Date(t);
  return d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
}

function stripMarkdownLinks(text: string): string {
  if (!text) return '';
  return text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
}

function FundCard({
  fund,
  isOpen,
  idx,
  onClick,
  onShare
}: {
  fund: Fund;
  isOpen: boolean;
  idx: number;
  onClick: (f: Fund) => void;
  onShare: (f: Fund) => void;
}) {
  const statusText = isOpen ? 'Open' : 'Closed';
  const [imgError, setImgError] = useState(false);
  const [useDirectUrl, setUseDirectUrl] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const proxiedUrl = getProxiedImageUrl(fund.posterLink);
  const driveMatch = fund.posterLink ? (
    fund.posterLink.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) ||
    fund.posterLink.match(/\/d\/([a-zA-Z0-9_-]+)/) ||
    fund.posterLink.match(/[?&]id=([a-zA-Z0-9_-]+)/) ||
    fund.posterLink.match(/[?&]docid=([a-zA-Z0-9_-]+)/)
  ) : null;
  const directUrl = driveMatch && driveMatch[1]
    ? `https://lh3.googleusercontent.com/d/${driveMatch[1]}=s600`
    : (fund.posterLink && fund.posterLink.includes('googleusercontent.com') && !fund.posterLink.includes('=s')
      ? `${fund.posterLink}=s600`
      : fund.posterLink);

  const handleImageError = () => {
    if (!useDirectUrl) {
      setUseDirectUrl(true);
    } else {
      setImgError(true);
    }
  };

  const handleShareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onShare(fund);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <motion.div
      key={fund.id}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.05 }}
      transition={{ duration: 0.5, delay: Math.min(idx * 0.08, 0.4) }}
      onClick={() => onClick(fund)}
      className="group bg-white rounded-3xl overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_24px_-4px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-200 flex flex-col cursor-pointer w-[240px] xs:w-[260px] sm:w-[280px] md:w-[300px] shrink-0 snap-start h-auto border border-slate-100/80 gpu"
      style={{
        contentVisibility: 'auto',
        containIntrinsicSize: '300px 500px',
      }}
    >
      <div className="relative w-full aspect-[4/5] overflow-hidden bg-slate-100 flex-shrink-0">
        <div className="absolute bottom-3 right-3 z-20 flex flex-col items-center">
          <button
            onClick={handleShareClick}
            className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-sm hover:scale-105 active:scale-95 transition-all flex items-center justify-center border border-slate-100/50 cursor-pointer gap-1.5 text-[#1b60bb] hover:text-[#154a93] font-helios font-bold text-xs"
            title="Copy share link"
          >
            <Send size={11} className="text-[#1b60bb] rotate-[15deg]" />
            <span>Share</span>
          </button>
          <AnimatePresence>
            {isCopied && (
              <motion.div
                initial={{ opacity: 0, y: 4, scale: 0.9 }}
                animate={{ opacity: 1, y: -4, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.9 }}
                className="absolute bottom-full mb-1.5 bg-slate-800 text-white text-[9px] font-medium font-poppins px-2 py-1 rounded shadow-md pointer-events-none whitespace-nowrap z-30"
              >
                copied
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {fund.posterLink && !imgError ? (
          <Image
            src={useDirectUrl ? directUrl : proxiedUrl}
            alt={fund.title}
            fill
            unoptimized={true}
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-w-768px) 100vw, 300px"
            onError={handleImageError}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#011a38] via-[#00050e] to-[#1b60bb] p-6 text-center">
            <ImageIcon size={44} className="text-white/40 mb-3" />
            <span className="font-helios text-base font-bold text-white/90 line-clamp-3 leading-snug">{fund.title}</span>
          </div>
        )}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-sm z-10 flex items-center justify-center h-7 sm:h-8">
          <span className={`font-helios font-bold text-xs sm:text-sm tracking-wide uppercase ${isOpen ? 'text-[#1b60bb]' : 'text-slate-500'} leading-none`}>{statusText}</span>
        </div>
      </div>
      <div className="p-4 sm:p-5 flex flex-col flex-grow">
        <h3 className="font-helios text-base sm:text-lg font-bold mb-1.5 sm:mb-2 line-clamp-2 transition-colors text-slate-800 group-hover:text-[#1b60bb] flex items-center justify-between gap-2">
          <span className="line-clamp-1">{fund.title}</span>
          <ArrowUpRight size={16} className="shrink-0 text-slate-400 group-hover:text-[#1b60bb] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
        </h3>
        {fund.description && (
          <p className="text-slate-600 font-poppins text-[11px] sm:text-xs leading-relaxed mb-3 sm:mb-4 line-clamp-3 sm:line-clamp-4 whitespace-pre-line">{stripMarkdownLinks(fund.description)}</p>
        )}
        <div className="bg-gradient-to-b from-[#f0f4f9]/90 to-[#e8eef6]/80 rounded-2xl p-3.5 sm:p-4 shadow-[inset_0_2px_4px_rgba(0,0,0,0.06),inset_0_-1px_2px_rgba(255,255,255,0.8)] border border-slate-200/60 mt-auto">
          <div className="flex items-center gap-2.5 sm:gap-3 text-slate-700 font-poppins text-xs sm:text-sm font-medium">
            <div className="w-7 h-7 rounded-full bg-white/90 shadow-[0_1px_3px_rgba(0,0,0,0.08)] flex items-center justify-center shrink-0">
              <Calendar size={14} className="text-[#1b60bb]" />
            </div>
            <span>{isOpen ? 'Deadline: ' : 'Closed: '}{formatDisplayDate(fund.lastDate)}</span>
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
  dividerColor = 'bg-blue-200',
  hideLine = false,
  rightElement
}: {
  title: string;
  currentIndex?: number;
  totalCount?: number;
  color?: string;
  dividerColor?: string;
  hideLine?: boolean;
  rightElement?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-4 mb-8 sm:mb-10">
      <h2 className={`font-helios text-2xl sm:text-3xl md:text-4xl font-bold ${color} whitespace-nowrap`}>{title}</h2>
      
      {!hideLine ? (
        <div className={`h-px ${dividerColor} flex-grow rounded-full`} />
      ) : (
        <div className="flex-grow" />
      )}

      {totalCount > 0 && (
        <div className="flex items-center gap-1 bg-white border border-blue-100 px-3.5 py-1.5 rounded-full shadow-sm text-xs sm:text-sm font-helios font-bold text-[#1b60bb] shrink-0">
          <span>{currentIndex}</span>
          <span className="text-blue-300 font-light">/</span>
          <span className="text-slate-400 font-normal">{totalCount}</span>
        </div>
      )}

      {rightElement}
    </div>
  );
}

function FundCarouselSection({
  title,
  Funds,
  isOpen,
  onCardClick,
  emptyLabel,
  onShare
}: {
  title: string;
  Funds: Fund[];
  isOpen: boolean;
  onCardClick: (fund: Fund) => void;
  emptyLabel: string;
  onShare: (fund: Fund) => void;
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
  }, [Funds]);

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
    const targetIdx = Math.min(Math.max(idx, 1), Funds.length);
    setCurrentIndex(prev => prev !== targetIdx ? targetIdx : prev);
  };

  return (
    <section className="py-4 px-4 md:px-8 max-w-[1400px] mx-auto">
      <SectionHeader
        title={title}
        currentIndex={currentIndex}
        totalCount={Funds.length}
        color={isOpen ? 'text-[#1b60bb]' : 'text-slate-600'}
        dividerColor={isOpen ? 'bg-blue-200' : 'bg-slate-200'}
      />
      {Funds.length > 0 ? (
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-5 md:gap-8 overflow-x-auto pb-6 pt-2 -mx-4 pl-5 pr-5 sm:mx-0 sm:px-0 snap-x snap-mandatory scrollbar-none"
        >
          {Funds.map((fund, idx) => (
            <FundCard key={fund.id} fund={fund} isOpen={isOpen} idx={idx} onClick={onCardClick} onShare={onShare} />
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

export default function FundsClient({ initialFunds }: { initialFunds: Fund[] }) {
  const Funds = useRealTimeSync<Fund>(
    'funds', 
    initialFunds,
    mapPbFund
  );

  const [selectedFund, setSelectedFund] = useState<Fund | null>(null);
  const [selectedFundImgError, setSelectedFundImgError] = useState(false);
  const [selectedFundUseDirect, setSelectedFundUseDirect] = useState(false);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [filterOpen, setFilterOpen] = useState(false);
  const [imageAspectRatio, setImageAspectRatio] = useState<number | null>(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const [modalCopied, setModalCopied] = useState(false);

  useEffect(() => {
    setIsDesktop(window.innerWidth >= 768);
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (selectedFund) {
      setSelectedFundImgError(false);
      setSelectedFundUseDirect(false);
      setImageAspectRatio(null);
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [selectedFund]);

  // Split using current date/time
  const now = new Date();
  const todayStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())).getTime();

  const openFunds: Fund[] = [];
  const closedFunds: Fund[] = [];

  Funds.forEach(f => {
    const deadline = parseDateSafe(f.lastDate);
    const isOpen = deadline === 0 || deadline >= todayStart;
    if (isOpen) {
      openFunds.push(f);
    } else {
      closedFunds.push(f);
    }
  });

  // Sort Open Funds: Closest deadline first (Date ascending). No deadline goes to the end.
  openFunds.sort((a, b) => {
    const tA = parseDateSafe(a.lastDate);
    const tB = parseDateSafe(b.lastDate);
    if (tA === 0 && tB !== 0) return 1;
    if (tA !== 0 && tB === 0) return -1;
    return tA - tB;
  });

  // Sort Closed Funds: Most recently closed first (Date descending)
  closedFunds.sort((a, b) => {
    const tA = parseDateSafe(a.lastDate);
    const tB = parseDateSafe(b.lastDate);
    return tB - tA;
  });

  // Auto-open modal if ?id=... is present in search parameters on load
  useEffect(() => {
    if (Funds.length > 0) {
      const searchParams = new URLSearchParams(window.location.search);
      const urlId = searchParams.get('id');
      if (urlId) {
        const found = Funds.find(f => f.id === urlId);
        if (found) {
          setSelectedFund(found);
        }
      }
    }
  }, [Funds]);

  const handleShare = useCallback((f: Fund) => {
    const shareUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + `?id=${f.id}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setModalCopied(true);
      setTimeout(() => setModalCopied(false), 2000);
    });
  }, []);

  // Triggered when opening a details card
  const handleCardClick = useCallback((f: Fund) => {
    setSelectedFund(f);
    setSelectedFundImgError(false);

    // Update URL query parameters without reloading the page
    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + `?id=${f.id}`;
    window.history.pushState({ path: newUrl }, '', newUrl);
  }, []);

  // Triggered when closing details modal
  const handleCloseModal = useCallback(() => {
    setSelectedFund(null);
    // Remove query parameter from URL without reloading the page
    const cleanUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
    window.history.pushState({ path: cleanUrl }, '', cleanUrl);
  }, []);

  const filterLabels: Record<FilterStatus, string> = {
    all: 'All Funds', open: 'Open Funds', closed: 'Closed Funds',
  };

  const showOpen = filterStatus === 'all' || filterStatus === 'open';
  const showClosed = filterStatus === 'all' || filterStatus === 'closed';

  const isSelectedFundOpen = selectedFund ? (() => {
    const deadline = parseDateSafe(selectedFund.lastDate);
    return deadline === 0 || deadline >= todayStart;
  })() : false;

  return (
    <main className="min-h-screen bg-[#F4F7FB] relative w-full overflow-x-hidden">
      <Navbar />

      <section className="relative w-full h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/images/funds/funds_banner.png')" }}>
          <div className="absolute inset-0 bg-gradient-to-r from-[#010101]/95 via-[#011a38]/85 to-[#1b60bb]/40" />
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="font-helios text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Funds
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-white/80 font-poppins max-w-2xl mx-auto leading-relaxed text-center px-4">
              Explore open and upcoming fund opportunities from all around India to support your research, deep-tech innovation, and startup journey.
            </p>
          </motion.div>
        </div>
      </section>

      {/* KSUM FUNDS Section */}
      <section className="pt-12 pb-6 sm:pt-20 px-4 md:px-8 max-w-[1400px] mx-auto">
        <SectionHeader title="KSUM Funds" color="text-[#1b60bb] !text-3xl sm:!text-4xl md:!text-5xl" hideLine={true} />
        
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-12 items-center bg-white rounded-3xl p-4 sm:p-8 md:p-12 shadow-sm border border-slate-100 mt-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative w-full h-[220px] sm:h-[300px] md:h-[400px] rounded-2xl overflow-hidden shadow-lg"
          >
            <div
              className="absolute inset-0 bg-cover bg-center hover:scale-105 transition-transform duration-700"
              style={{ backgroundImage: "url('/images/funds/randd_grant.png')" }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col justify-center"
          >
            <h2 className="font-helios text-2xl sm:text-3xl md:text-4xl font-bold text-[#1b60bb] mb-2 sm:mb-3">
              Research & Development Grant
            </h2>

            <p className="text-slate-600 leading-relaxed mb-4 text-xs sm:text-sm md:text-base">
              Designed to support startups in developing innovative products, technologies, or solutions through research and development.
            </p>
            <p className="text-slate-600 leading-relaxed mb-6 sm:mb-8 text-xs sm:text-sm md:text-base">
              This grant supports hardware startups with a strong R&D focus, encouraging innovation and product development. To be eligible, startups must have a working prototype and be associated with an approved incubator in the state. The grant prioritizes startups that have secured patents or are in the process of scaling their products. Funding must be directed primarily toward hardware development, with limited allocation for marketing and no provision for manpower expenses.
            </p>

            <a
              href="#"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-[#1b60bb] text-white px-5 py-3 sm:px-8 sm:py-4 rounded-xl font-semibold hover:bg-[#154a93] transition-colors w-fit shadow-md hover:shadow-lg text-xs sm:text-sm md:text-base"
            >
              Application Closed <ArrowRight size={18} />
            </a>
          </motion.div>
        </div>
      </section>

      {/* EXTERNAL FUNDS Section with integrated toggle */}
      <section className="pt-12 pb-2 px-4 md:px-8 max-w-[1400px] mx-auto">
        <SectionHeader 
          title="External Funds" 
          color="text-[#1b60bb] !text-3xl sm:!text-4xl md:!text-5xl" 
          hideLine={true}
          rightElement={
            <div className="relative shrink-0">
              <button
                onClick={() => setFilterOpen(p => !p)}
                className="flex items-center justify-between gap-2 bg-white border border-blue-100 hover:border-[#1b60bb] rounded-xl px-4 py-2.5 sm:px-5 sm:py-3 font-helios font-semibold text-slate-700 text-xs sm:text-sm shadow-sm transition-all whitespace-nowrap min-w-[130px] sm:min-w-[150px]"
              >
                {filterLabels[filterStatus]}
                <ChevronDown size={16} className={`transition-transform shrink-0 ${filterOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {filterOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 1 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 bg-white border border-blue-100 rounded-2xl shadow-xl z-50 overflow-hidden min-w-[130px] sm:min-w-[150px]"
                  >
                    {(Object.entries(filterLabels) as [FilterStatus, string][]).map(([val, label]) => (
                      <button
                        key={val}
                        onClick={() => { setFilterStatus(val as FilterStatus); setFilterOpen(false); }}
                        className={`w-full text-left px-4 py-2.5 sm:px-5 sm:py-3 font-poppins text-xs sm:text-sm transition-colors ${filterStatus === val ? 'bg-blue-50 text-[#1b60bb] font-semibold' : 'text-slate-700 hover:bg-slate-50'}`}
                      >
                        {label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          }
        />
      </section>

      <div className="w-full pb-10">
        {showOpen && (
          <FundCarouselSection
            title="Open Funds"
            Funds={openFunds}
            isOpen={true}
            onCardClick={handleCardClick}
            emptyLabel="No open Funds at the moment. Check back soon!"
            onShare={handleShare}
          />
        )}
        {showClosed && (
          <FundCarouselSection
            title="Closed Funds"
            Funds={closedFunds}
            isOpen={false}
            onCardClick={handleCardClick}
            emptyLabel="No closed Funds found."
            onShare={handleShare}
          />
        )}
      </div>

      <AnimatePresence>
        {selectedFund && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={handleCloseModal} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] xs:w-[85%] max-w-[340px] md:max-w-4xl h-[78vh] md:h-[504px] bg-white rounded-3xl shadow-2xl z-[101] overflow-hidden flex flex-col md:flex-row md:items-stretch"
            >
              <button onClick={handleCloseModal} className="absolute top-3 right-3 p-2 bg-white/80 hover:bg-white backdrop-blur-md rounded-full shadow-md transition-colors z-20 cursor-pointer flex items-center justify-center">
                <X size={18} className="text-slate-700" />
              </button>
              <div
                className="relative w-full h-[42%] md:h-full bg-slate-100 overflow-hidden shrink-0"
                style={{
                  width: isDesktop && imageAspectRatio ? `${Math.min(Math.max(504 * imageAspectRatio, 250), 504)}px` : undefined
                }}
              >
                {selectedFund.posterLink && !selectedFundImgError ? (
                  (() => {
                    const posterSrc = selectedFundUseDirect
                      ? (() => {
                        const driveMatch = selectedFund.posterLink.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) ||
                          selectedFund.posterLink.match(/\/d\/([a-zA-Z0-9_-]+)/) ||
                          selectedFund.posterLink.match(/[?&]id=([a-zA-Z0-9_-]+)/) ||
                          selectedFund.posterLink.match(/[?&]docid=([a-zA-Z0-9_-]+)/);
                        if (driveMatch && driveMatch[1]) {
                          return `https://lh3.googleusercontent.com/d/${driveMatch[1]}=s800`;
                        }
                        return selectedFund.posterLink.includes('googleusercontent.com') && !selectedFund.posterLink.includes('=s')
                          ? `${selectedFund.posterLink}=s800`
                          : selectedFund.posterLink;
                      })()
                      : getProxiedImageUrl(selectedFund.posterLink);
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
                          alt={selectedFund.title}
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
                            if (!selectedFundUseDirect) {
                              setSelectedFundUseDirect(true);
                            } else {
                              setSelectedFundImgError(true);
                            }
                          }}
                        />
                      </>
                    );
                  })()
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#011a38] via-[#00050e] to-[#1b60bb] p-6 text-center">
                    <ImageIcon size={48} className="text-white/40 mb-3" />
                    <span className="font-helios text-lg font-bold text-white/90 leading-snug">{selectedFund.title}</span>
                  </div>
                )}
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-sm z-10 flex items-center justify-center h-7 sm:h-8">
                  <span className={`font-helios font-bold text-xs tracking-wide uppercase ${isSelectedFundOpen ? 'text-[#1b60bb]' : 'text-slate-500'} leading-none`}>
                    {isSelectedFundOpen ? 'Open' : 'Closed'}
                  </span>
                </div>
              </div>
              <div className="relative w-full md:w-[55%] h-[58%] md:h-full p-4 sm:p-5 flex flex-col overflow-hidden bg-white min-h-0 shrink md:shrink">
                <div className="flex-shrink-0">
                  <h2 className="font-helios text-lg sm:text-xl font-bold text-slate-800 mb-2 leading-tight">{selectedFund.title}</h2>
                </div>

                <div className="flex-grow overflow-y-auto overflow-x-hidden custom-scrollbar pr-2 mb-3 min-h-0 space-y-3">
                  <div className="space-y-2.5 p-3 md:p-4 bg-gradient-to-b from-[#f0f4f9]/90 to-[#e8eef6]/80 rounded-2xl border border-slate-200/60">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 md:w-9 md:h-9 rounded-full bg-white shadow-[0_2px_6px_rgba(0,0,0,0.08)] flex items-center justify-center shrink-0">
                        <Calendar className="w-3.5 h-3.5 md:w-[17px] md:h-[17px] text-[#1b60bb]" />
                      </div>
                      <div>
                        <p className="font-helios font-semibold text-slate-800 text-[10px] md:text-xs">Application Deadline</p>
                        <p className="text-slate-600 font-poppins text-[10px] md:text-[13px]">{formatDisplayDateLong(selectedFund.lastDate)}</p>
                      </div>
                    </div>
                  </div>

                  {selectedFund.description && (
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
                        {selectedFund.description}
                      </ReactMarkdown>
                    </div>
                  )}
                </div>

                <div className="flex-shrink-0 pt-2 md:pt-3 border-t border-slate-100 flex items-center gap-2.5">
                  <div className="relative shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShare(selectedFund);
                      }}
                      className="py-2.5 md:py-3.5 px-4 bg-white border border-[#1b60bb]/20 hover:border-[#1b60bb] text-[#1b60bb] rounded-xl font-helios font-bold text-xs md:text-sm text-center transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                      title="Copy share link"
                    >
                      <Send size={14} className="text-[#1b60bb] rotate-[15deg]" />
                      <span>Share</span>
                    </button>
                    <AnimatePresence>
                      {modalCopied && (
                        <motion.div
                          initial={{ opacity: 0, y: 4, scale: 0.9 }}
                          animate={{ opacity: 1, y: -4, scale: 1 }}
                          exit={{ opacity: 0, y: 4, scale: 0.9 }}
                          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 bg-slate-800 text-white text-[10px] font-medium font-poppins px-2.5 py-1 rounded shadow-md pointer-events-none whitespace-nowrap z-30"
                        >
                          copied
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  {selectedFund.registrationLink && isSelectedFundOpen ? (
                    <a href={selectedFund.registrationLink} target="_blank" rel="noreferrer" className="flex-grow py-2.5 md:py-3.5 bg-[#1b60bb] hover:bg-[#154a93] text-white rounded-xl font-helios font-bold text-xs md:text-sm text-center transition-colors flex items-center justify-center gap-2 group/btn">
                      Apply for Fund
                      <ExternalLink className="w-3.5 h-3.5 md:w-4 md:h-4 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5 transition-transform" />
                    </a>
                  ) : (
                    <button disabled className="flex-grow py-2.5 md:py-3.5 bg-slate-100 text-slate-400 rounded-xl font-helios font-bold text-xs md:text-sm text-center cursor-not-allowed flex items-center justify-center gap-2">
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