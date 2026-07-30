'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, ExternalLink, Image as ImageIcon, X, Clock, ChevronDown, Loader2, ArrowUpRight } from 'lucide-react';
import Navbar from '@/HomePage/Navbar';
import Footer from '@/HomePage/Footer';
import { getProxiedImageUrl } from '@/lib/utils';
import Image from 'next/image';

interface SheetProgram {
  id: string;
  title: string;
  date: string;
  time: string;
  description: string;
  poster_link: string;
  registration_link: string;
  location: string;
  status: 'upcoming' | 'current' | 'past';
  event_gallery: string; // matches backend property parsed from Sheet
}

type FilterStatus = 'all' | 'current' | 'upcoming' | 'past';

function formatDate(dateStr: string) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function formatDateLong(dateStr: string) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

function ProgramCard({ program, idx, onClick }: { program: SheetProgram; idx: number; onClick: (p: SheetProgram) => void }) {
  const isPast = program.status === 'past';
  const badgeColor = 'text-[#1b60bb] font-bold';
  const [imgError, setImgError] = useState(false);
  const [useDirectUrl, setUseDirectUrl] = useState(false);

  const hasDate = !!program.date;
  const hasTime = !isPast && !!program.time;
  const hasLocation = !!program.location;
  const metaCount = [hasDate, hasTime, hasLocation].filter(Boolean).length;

  let clampClass = 'line-clamp-2 sm:line-clamp-3';
  if (metaCount === 2) {
    clampClass = 'line-clamp-3 sm:line-clamp-4';
  } else if (metaCount === 1) {
    clampClass = 'line-clamp-5 sm:line-clamp-6';
  } else if (metaCount === 0) {
    clampClass = 'line-clamp-8 sm:line-clamp-9';
  }

  const proxiedUrl = getProxiedImageUrl(program.poster_link);
  const driveMatch = program.poster_link ? (
    program.poster_link.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || 
    program.poster_link.match(/\/d\/([a-zA-Z0-9_-]+)/) ||
    program.poster_link.match(/[?&]id=([a-zA-Z0-9_-]+)/) ||
    program.poster_link.match(/[?&]docid=([a-zA-Z0-9_-]+)/)
  ) : null;
  const directUrl = driveMatch && driveMatch[1]
    ? `https://lh3.googleusercontent.com/d/${driveMatch[1]}=s600`
    : (program.poster_link && program.poster_link.includes('googleusercontent.com') && !program.poster_link.includes('=s')
        ? `${program.poster_link}=s600`
        : program.poster_link);

  const handleImageError = () => {
    if (!useDirectUrl) {
      setUseDirectUrl(true);
    } else {
      setImgError(true);
    }
  };

  return (
    <motion.div
      key={program.id}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.05 }}
      transition={{ duration: 0.5, delay: Math.min(idx * 0.08, 0.4) }}
      onClick={() => onClick(program)}
      className="group bg-white rounded-3xl overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_24px_-4px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-200 flex flex-col cursor-pointer w-[240px] xs:w-[260px] sm:w-[280px] md:w-[300px] shrink-0 snap-start h-auto border border-slate-100/80"
      style={{
        contentVisibility: 'auto',
        containIntrinsicSize: '300px 500px',
      }}
    >
      <div className="relative w-full aspect-[4/5] overflow-hidden bg-slate-100 flex-shrink-0">
        {program.poster_link && !imgError ? (
          <Image
            src={useDirectUrl ? directUrl : proxiedUrl}
            alt={program.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-w-768px) 100vw, 300px"
            onError={handleImageError}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#011a38] via-[#00050e] to-[#1b60bb] p-6 text-center">
            <ImageIcon size={44} className="text-white/40 mb-3" />
            <span className="font-helios text-base font-bold text-white/90 line-clamp-3 leading-snug">{program.title}</span>
          </div>
        )}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-sm z-10">
          <span className={`font-helios font-bold text-xs sm:text-sm tracking-wide uppercase ${badgeColor}`}>{program.status}</span>
        </div>
      </div>
      <div className="p-4 sm:p-5 flex flex-col flex-grow">
        <h3 className="font-helios text-base sm:text-lg font-bold mb-1.5 sm:mb-2 line-clamp-2 transition-colors text-slate-800 group-hover:text-[#1b60bb] flex items-center justify-between gap-2">
          <span className="line-clamp-1">{program.title}</span>
          <ArrowUpRight size={16} className="shrink-0 text-slate-400 group-hover:text-[#1b60bb] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
        </h3>
        {!isPast && program.description && (
          <p className={`text-slate-600 font-poppins text-[11px] sm:text-xs leading-relaxed mb-3 sm:mb-4 ${clampClass}`}>{program.description}</p>
        )}
        {metaCount > 0 && (
          <div className="bg-gradient-to-b from-[#f0f4f9]/90 to-[#e8eef6]/80 rounded-2xl p-3.5 sm:p-4 shadow-[inset_0_2px_4px_rgba(0,0,0,0.06),inset_0_-1px_2px_rgba(255,255,255,0.8)] border border-slate-200/60 space-y-2.5 sm:space-y-3 mt-auto">
            {program.date && (
              <div className="flex items-center gap-2.5 sm:gap-3 text-slate-700 font-poppins text-xs sm:text-sm font-medium">
                <div className="w-7 h-7 rounded-full bg-white/90 shadow-[0_1px_3px_rgba(0,0,0,0.08)] flex items-center justify-center shrink-0">
                  <Calendar size={14} className="text-[#1b60bb]" />
                </div>
                <span>{formatDate(program.date)}</span>
              </div>
            )}
            {!isPast && program.time && (
              <div className="flex items-center gap-2.5 sm:gap-3 text-slate-700 font-poppins text-xs sm:text-sm font-medium">
                <div className="w-7 h-7 rounded-full bg-white/90 shadow-[0_1px_3px_rgba(0,0,0,0.08)] flex items-center justify-center shrink-0">
                  <Clock size={14} className="text-[#1b60bb]" />
                </div>
                <span>{program.time}</span>
              </div>
            )}
            {program.location && (
              <div className="flex items-center gap-2.5 sm:gap-3 text-slate-700 font-poppins text-xs sm:text-sm font-medium">
                <div className="w-7 h-7 rounded-full bg-white/90 shadow-[0_1px_3px_rgba(0,0,0,0.08)] flex items-center justify-center shrink-0">
                  <MapPin size={14} className="text-[#1b60bb]" />
                </div>
                <span className="line-clamp-1">{program.location}</span>
              </div>
            )}
          </div>
        )}
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

function ProgramCarouselSection({
  title,
  programs,
  onCardClick,
  emptyLabel
}: {
  title: string;
  programs: SheetProgram[];
  onCardClick: (program: SheetProgram) => void;
  emptyLabel: string;
}) {
  const [currentIndex, setCurrentIndex] = useState(1);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const el = scrollRef.current;
    const scrollLeft = el.scrollLeft;
    const firstCard = el.firstElementChild as HTMLElement;
    const cardWidth = firstCard ? firstCard.offsetWidth + 20 : 300;
    const idx = Math.round(scrollLeft / cardWidth) + 1;
    setCurrentIndex(Math.min(Math.max(idx, 1), programs.length));
  };

  return (
    <section className="py-12 px-4 md:px-8 max-w-[1400px] mx-auto">
      <SectionHeader
        title={title}
        currentIndex={currentIndex}
        totalCount={programs.length}
      />
      {programs.length > 0 ? (
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-5 md:gap-8 overflow-x-auto pb-6 pt-2 -mx-4 pl-5 pr-5 sm:mx-0 sm:px-0 snap-x snap-mandatory scrollbar-none"
        >
          {programs.map((program, idx) => (
            <ProgramCard key={program.id} program={program} idx={idx} onClick={onCardClick} />
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

export default function ProgramsPage() {
  const [currentPrograms, setCurrentPrograms] = useState<SheetProgram[]>([]);
  const [upcomingPrograms, setUpcomingPrograms] = useState<SheetProgram[]>([]);
  const [pastPrograms, setPastPrograms] = useState<SheetProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProgram, setSelectedProgram] = useState<SheetProgram | null>(null);
  const [selectedProgramImgError, setSelectedProgramImgError] = useState(false);
  const [selectedProgramUseDirect, setSelectedProgramUseDirect] = useState(false);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [galleryLoading, setGalleryLoading] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryProgramTitle, setGalleryProgramTitle] = useState('');
  const [galleryError, setGalleryError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);

  // Keyboard navigation for image lightbox
  useEffect(() => {
    if (activeImageIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveImageIndex(null);
      } else if (e.key === 'ArrowRight') {
        setActiveImageIndex((prev) => (prev !== null ? (prev + 1) % galleryImages.length : 0));
      } else if (e.key === 'ArrowLeft') {
        setActiveImageIndex((prev) => (prev !== null ? (prev - 1 + galleryImages.length) % galleryImages.length : 0));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeImageIndex, galleryImages.length]);

  useEffect(() => {
    if (selectedProgram) {
      setSelectedProgramImgError(false);
      setSelectedProgramUseDirect(false);
    }
  }, [selectedProgram?.id]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/programs', { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to load');
        const data = await res.json();
        setCurrentPrograms(data.current ?? []);
        setUpcomingPrograms(data.upcoming ?? []);
        setPastPrograms(data.past ?? []);
      } catch {
        setError('Could not load programs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const openGallery = useCallback(async (program: SheetProgram) => {
    setGalleryProgramTitle(program.title);
    setGalleryOpen(true);
    setGalleryImages([]);
    setGalleryError(null);
    setActiveImageIndex(null);
    if (!program.event_gallery) return;
    setGalleryLoading(true);
    try {
      const res = await fetch(`/api/programs/gallery?folderUrl=${encodeURIComponent(program.event_gallery)}`);
      const data = await res.json();
      setGalleryImages(data.images ?? []);
      if (data.error) {
        setGalleryError(data.error);
      }
    } catch {
      setGalleryImages([]);
      setGalleryError('Could not load gallery photos.');
    }
    finally { setGalleryLoading(false); }
  }, []);

  const filterLabels: Record<FilterStatus, string> = {
    all: 'All Programs', current: 'Current Programs', upcoming: 'Upcoming Programs', past: 'Past Programs',
  };

  const showCurrent = filterStatus === 'all' || filterStatus === 'current';
  const showUpcoming = filterStatus === 'all' || filterStatus === 'upcoming';
  const showPast = filterStatus === 'all' || filterStatus === 'past';

  const handleCardClick = useCallback((p: SheetProgram) => {
    setSelectedProgram(p);
    setSelectedProgramImgError(false);
  }, []);

  return (
    <main className="min-h-screen bg-[#F4F7FB] relative">
      <Navbar />

      <section className="relative w-full h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80')" }}>
          <div className="absolute inset-0 bg-gradient-to-r from-[#010101]/95 via-[#011a38]/85 to-[#1b60bb]/80" />
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="font-helios text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              RINK <span className="text-[#5cc4fe]">Programs</span>
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-white/80 font-poppins max-w-2xl mx-auto leading-relaxed text-center px-4">
              Discover programs, workshops, demo days, and masterclasses designed to empower Kerala's research and startup ecosystem.
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
          <span className="ml-3 font-poppins text-slate-500">Loading programs...</span>
        </div>
      )}

      {error && !loading && (
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-16 text-center">
          <p className="font-poppins text-red-400 text-lg">{error}</p>
        </div>
      )}

      {!loading && !error && (
        <>
          {showCurrent && (
            <ProgramCarouselSection
              title="Current Programs"
              programs={currentPrograms}
              onCardClick={handleCardClick}
              emptyLabel="No current programs at the moment."
            />
          )}
          {showUpcoming && (
            <ProgramCarouselSection
              title="Upcoming Programs"
              programs={upcomingPrograms}
              onCardClick={handleCardClick}
              emptyLabel="No upcoming programs right now. Check back soon!"
            />
          )}
          {showPast && (
            <ProgramCarouselSection
              title="Past Programs"
              programs={pastPrograms}
              onCardClick={handleCardClick}
              emptyLabel="No past programs yet."
            />
          )}
        </>
      )}

      <AnimatePresence>
        {selectedProgram && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedProgram(null)} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-[360px] sm:max-w-md md:max-w-4xl h-[90vh] md:h-[600px] bg-white rounded-3xl shadow-2xl z-[101] overflow-hidden flex flex-col md:grid md:grid-cols-2"
            >
              <button onClick={() => setSelectedProgram(null)} className="absolute top-3 right-3 p-2 bg-white/80 hover:bg-white backdrop-blur-md rounded-full shadow-md transition-colors z-20">
                <X size={18} className="text-slate-700" />
              </button>
              <div className="relative w-full aspect-[4/5] md:aspect-auto md:h-full bg-slate-100 overflow-hidden shrink-0">
                {selectedProgram.poster_link && !selectedProgramImgError ? (
                  <Image
                    src={selectedProgramUseDirect 
                      ? (() => {
                          const driveMatch = selectedProgram.poster_link.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || 
                                             selectedProgram.poster_link.match(/\/d\/([a-zA-Z0-9_-]+)/) ||
                                             selectedProgram.poster_link.match(/[?&]id=([a-zA-Z0-9_-]+)/) ||
                                             selectedProgram.poster_link.match(/[?&]docid=([a-zA-Z0-9_-]+)/);
                          if (driveMatch && driveMatch[1]) {
                            return `https://lh3.googleusercontent.com/d/${driveMatch[1]}=s1000`;
                          }
                          return selectedProgram.poster_link.includes('googleusercontent.com') && !selectedProgram.poster_link.includes('=s')
                            ? `${selectedProgram.poster_link}=s1000`
                            : selectedProgram.poster_link;
                        })()
                      : getProxiedImageUrl(selectedProgram.poster_link)
                    }
                    alt={selectedProgram.title}
                    fill
                    className="object-cover"
                    sizes="(max-w-768px) 100vw, 50vw"
                    onError={() => {
                      if (!selectedProgramUseDirect) {
                        setSelectedProgramUseDirect(true);
                      } else {
                        setSelectedProgramImgError(true);
                      }
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#011a38] via-[#00050e] to-[#1b60bb] p-6 text-center">
                    <ImageIcon size={48} className="text-white/40 mb-3" />
                    <span className="font-helios text-lg font-bold text-white/90 leading-snug">{selectedProgram.title}</span>
                  </div>
                )}
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full shadow-sm z-10">
                  <span className="font-helios font-bold text-xs tracking-wide uppercase text-[#1b60bb]">{selectedProgram.status}</span>
                </div>
              </div>
              <div className="p-4 sm:p-6 md:p-10 flex flex-col flex-grow h-0 md:h-full overflow-hidden">
                <div className="flex-shrink-0">
                  <h2 className="font-helios text-xl sm:text-2xl md:text-4xl font-bold text-slate-800 mb-2 sm:mb-4 leading-tight">{selectedProgram.title}</h2>
                </div>

                <div className="flex-grow overflow-y-auto overflow-x-hidden custom-scrollbar pr-2 mb-4 min-h-0 space-y-4">
                  <div className="space-y-2 sm:space-y-3 p-3 sm:p-4 bg-gradient-to-b from-[#f0f4f9]/90 to-[#e8eef6]/80 rounded-2xl shadow-[inset_0_2px_5px_rgba(0,0,0,0.06),inset_0_-1px_2px_rgba(255,255,255,0.8)] border border-slate-200/60">
                    {selectedProgram.date && (
                      <div className="flex items-center gap-2.5 sm:gap-3">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white shadow-[0_2px_6px_rgba(0,0,0,0.08)] flex items-center justify-center shrink-0">
                          <Calendar size={14} className="text-[#1b60bb]" />
                        </div>
                        <div>
                          <p className="font-helios font-semibold text-slate-800 text-[10px] sm:text-xs">Date</p>
                          <p className="text-slate-600 font-poppins text-[10px] sm:text-xs">{formatDateLong(selectedProgram.date)}</p>
                        </div>
                      </div>
                    )}
                    {selectedProgram.time && (
                      <div className="flex items-center gap-2.5 sm:gap-3">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white shadow-[0_2px_6px_rgba(0,0,0,0.08)] flex items-center justify-center shrink-0">
                          <Clock size={14} className="text-[#1b60bb]" />
                        </div>
                        <div>
                          <p className="font-helios font-semibold text-slate-800 text-[10px] sm:text-xs">Time</p>
                          <p className="text-slate-600 font-poppins text-[10px] sm:text-xs">{selectedProgram.time}</p>
                        </div>
                      </div>
                    )}
                    {selectedProgram.location && (
                      <div className="flex items-center gap-2.5 sm:gap-3">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white shadow-[0_2px_6px_rgba(0,0,0,0.08)] flex items-center justify-center shrink-0">
                          <MapPin size={14} className="text-[#1b60bb]" />
                        </div>
                        <div>
                          <p className="font-helios font-semibold text-slate-800 text-[10px] sm:text-xs">Location</p>
                          <p className="text-slate-600 font-poppins text-[10px] sm:text-xs">{selectedProgram.location}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {selectedProgram.description && (
                    <p className="text-slate-600 font-poppins text-[11px] sm:text-xs md:text-sm leading-relaxed whitespace-pre-line break-words">{selectedProgram.description}</p>
                  )}
                </div>

                <div className="flex-shrink-0 pt-2 border-t border-slate-100 flex flex-col gap-2 sm:gap-3">
                  {selectedProgram.registration_link && selectedProgram.status !== 'past' && (
                    <a href={selectedProgram.registration_link} target="_blank" rel="noreferrer" className="w-full py-2.5 sm:py-3.5 bg-[#1b60bb] hover:bg-[#154a93] text-white rounded-xl font-helios font-bold text-xs sm:text-base text-center transition-colors flex items-center justify-center gap-2 group/btn">
                      Register for Program
                      <ExternalLink size={16} className="group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5 transition-transform" />
                    </a>
                  )}
                  {selectedProgram.status === 'past' && selectedProgram.event_gallery && (
                    <button onClick={() => openGallery(selectedProgram)} className="w-full py-2.5 sm:py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-helios font-bold text-xs sm:text-base text-center transition-colors flex items-center justify-center gap-2 group/btn">
                      View Program Gallery
                      <ImageIcon size={16} className="group-hover/btn:scale-110 transition-transform" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {galleryOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-[#00050e] z-[110]" />
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="fixed inset-0 z-[111] overflow-y-auto custom-scrollbar flex flex-col">
              <div className="sticky top-0 bg-[#00050e]/80 backdrop-blur-xl p-4 md:p-6 flex items-center justify-between z-10 border-b border-white/10">
                <div>
                  <h2 className="text-white font-helios text-xl md:text-3xl font-bold">{galleryProgramTitle}</h2>
                  {!galleryLoading && <p className="text-white/60 font-poppins text-sm mt-1">{galleryImages.length} Photos</p>}
                </div>
                <button onClick={() => setGalleryOpen(false)} className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors backdrop-blur-md">
                  <X size={22} className="text-white" />
                </button>
              </div>
              <div className="p-4 md:p-8 max-w-[1600px] mx-auto w-full flex-grow flex items-center justify-center">
                {galleryLoading ? (
                  <div className="flex items-center justify-center py-32"><Loader2 size={40} className="text-white/60 animate-spin" /><span className="ml-3 text-white/60 font-poppins">Loading gallery...</span></div>
                ) : galleryImages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center max-w-lg mx-auto px-4 bg-white/5 rounded-3xl border border-white/10">
                    <p className="text-white/90 font-helios text-xl font-semibold mb-3">{galleryError || 'No photos available.'}</p>
                    <p className="text-white/60 text-sm font-poppins leading-relaxed">
                      If your Google Drive folder is set to private, please update its sharing permissions to <span className="text-[#5cc4fe] font-semibold">"Anyone with the link can view"</span> so images can display.
                    </p>
                  </div>
                ) : (
                  <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 md:gap-6 space-y-4 md:space-y-6 w-full">
                    {galleryImages.map((imgUrl, i) => (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }} 
                        animate={{ opacity: 1, scale: 1 }} 
                        transition={{ delay: Math.min(i * 0.04, 0.5) }} 
                        key={i} 
                        onClick={() => setActiveImageIndex(i)}
                        className="break-inside-avoid group relative rounded-2xl overflow-hidden bg-white/5 cursor-zoom-in"
                      >
                        <img src={getProxiedImageUrl(imgUrl)} alt={`${galleryProgramTitle} photo ${i + 1}`} loading="lazy" className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Fullscreen Photo Lightbox Modal */}
      <AnimatePresence>
        {activeImageIndex !== null && galleryImages.length > 0 && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.95 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveImageIndex(null)}
              className="fixed inset-0 bg-[#00050e]/95 backdrop-blur-md z-[200]"
            />
            <div className="fixed inset-0 z-[201] flex flex-col items-center justify-center p-4 md:p-8 select-none">
              
              {/* Close Button */}
              <button
                onClick={() => setActiveImageIndex(null)}
                className="absolute top-4 right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors backdrop-blur-md z-50 cursor-pointer border border-white/10"
                title="Close lightbox"
              >
                <X size={24} className="text-white" />
              </button>

              {/* Lightbox Wrapper */}
              <div className="relative w-full max-w-5xl h-[70vh] sm:h-[80vh] flex items-center justify-center">
                
                {/* Previous Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveImageIndex((prev) => (prev !== null ? (prev - 1 + galleryImages.length) % galleryImages.length : 0));
                  }}
                  className="absolute left-2 sm:left-4 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors backdrop-blur-md text-white border border-white/10 cursor-pointer shadow-lg hover:scale-105 active:scale-95 z-50"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </button>

                {/* Main Large Image */}
                <motion.div
                  key={activeImageIndex}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="relative w-full h-full flex items-center justify-center p-4"
                >
                  <img
                    src={getProxiedImageUrl(galleryImages[activeImageIndex])}
                    alt={`Enlarged photo ${activeImageIndex + 1}`}
                    className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl border border-white/5"
                  />
                </motion.div>

                {/* Next Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveImageIndex((prev) => (prev !== null ? (prev + 1) % galleryImages.length : 0));
                  }}
                  className="absolute right-2 sm:right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors backdrop-blur-md text-white border border-white/10 cursor-pointer shadow-lg hover:scale-105 active:scale-95 z-50"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </button>

              </div>

              {/* Photo Indicator */}
              <div className="mt-4 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-white/80 font-poppins text-xs font-semibold border border-white/10">
                {activeImageIndex + 1} / {galleryImages.length}
              </div>

            </div>
          </>
        )}
      </AnimatePresence>

      <Footer />
      <style dangerouslySetInnerHTML={{ __html: `.custom-scrollbar::-webkit-scrollbar{width:8px}.custom-scrollbar::-webkit-scrollbar-track{background:rgba(0,0,0,0.05);border-radius:8px}.custom-scrollbar::-webkit-scrollbar-thumb{background:rgba(27,96,187,0.3);border-radius:8px}.custom-scrollbar::-webkit-scrollbar-thumb:hover{background:rgba(27,96,187,0.6)}.scrollbar-none::-webkit-scrollbar{display:none}.scrollbar-none{-ms-overflow-style:none;scrollbar-width:none}` }} />
    </main>
  );
}
