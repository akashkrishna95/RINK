//C:\Users\Akash Krishna\Downloads\RINK KSUM Website\HomePage\AboutRink\DemoDayExposureVisits.tsx

'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play, CheckCircle2, Users, Lightbulb, TrendingUp } from 'lucide-react';
import Navbar from '@/HomePage/Navbar';
import Footer from '@/HomePage/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import PastVisitedInstitutions from '../PastVisitedInstitutions';
import { useRealTimeSync } from '@/hooks/useRealTimeSync';
import { pb, mapPbDemoDay, DemoDayVideo, PastVisitedInstitution } from '@/lib/pocketbase';

export default function DemoDayExposureVisits({
  initialVideos,
  initialPastVisitedInstitutions
}: {
  initialVideos: DemoDayVideo[];
  initialPastVisitedInstitutions: PastVisitedInstitution[];
}) {
  const videos = useRealTimeSync<DemoDayVideo>(
    'demo_days',
    initialVideos,
    (record) => mapPbDemoDay(record)
  );

  const [activeVideo, setActiveVideo] = useState<DemoDayVideo | null>(initialVideos[0] || null);
  const [hasScrolledIntoView, setHasScrolledIntoView] = useState(false);
  const playerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (videos.length > 0 && (!activeVideo || !videos.some(v => v.id === activeVideo.id))) {
      setActiveVideo(videos[0]);
    }
  }, [videos, activeVideo]);



  return (
    <main className="min-h-screen bg-[#F4F7FB] overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative w-full h-[500px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/demoday/hero.png')" }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#010101]/95 via-[#011a38]/80 to-[#1b60bb]/35"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-helios text-[38px] xs:text-[44px] sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Demo Day & <br className="hidden md:block" />
              <span className="text-[#5cc4fe]">Exposure Visits</span>
            </h1>
            <p className="text-xs xs:text-sm md:text-base text-white/85 font-poppins mb-10 max-w-2xl mx-auto leading-relaxed text-center px-4">
              Bridging the gap between groundbreaking research and commercial success by connecting innovators directly with industry and investors.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mini Breadcrumb Navigation */}
      <div className="pt-4 pb-0">
        <Breadcrumbs />
      </div>

      {/* What is Demo Day Section */}
      <section className="py-20 px-4 md:px-8 max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-helios text-2xl sm:text-3xl md:text-4xl font-bold text-[#1b60bb] mb-6">Connecting Research & Industry</h2>
            <p className="text-slate-600 font-poppins text-xs sm:text-sm md:text-base leading-relaxed mb-6">
              Events to connect startups to R&D institutions. Research institutions showcase commercial ready technologies, while startups and entrepreneurs get the chance to interact with scientists, explore advanced labs, and identify opportunities for collaboration, co development, or technology transfer
            </p>

            <a href="/programs" className="inline-flex items-center gap-2 bg-[#1b60bb] text-white px-8 py-4 rounded-xl font-semibold hover:bg-[#154a93] transition-colors shadow-md hover:shadow-lg group text-xs sm:text-sm md:text-base">
              Join the Next Demo Day <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 gap-4"
          >
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col items-center text-center">
              <Users size={32} className="text-[#5cc4fe] mb-3" />
              <h3 className="font-helios font-bold text-[#1b60bb] text-xl mb-2">Networking</h3>
              <p className="text-slate-500 text-sm font-poppins">Connect directly with top scientists and industry leaders.</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col items-center text-center translate-y-8">
              <Lightbulb size={32} className="text-[#5cc4fe] mb-3" />
              <h3 className="font-helios font-bold text-[#1b60bb] text-xl mb-2">Innovation</h3>
              <p className="text-slate-500 text-sm font-poppins">Discover deep-tech solutions ready for commercialization.</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col items-center text-center">
              <TrendingUp size={32} className="text-[#5cc4fe] mb-3" />
              <h3 className="font-helios font-bold text-[#1b60bb] text-xl mb-2">Growth</h3>
              <p className="text-slate-500 text-sm font-poppins">Find opportunities to scale cutting-edge technologies.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Video Grid Section */}
      <section className="py-20 bg-[#011a38] text-white">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <h2 className="font-helios text-2xl sm:text-3xl md:text-4xl font-bold text-[#5cc4fe] mb-4">Past Demo Days</h2>
            <p className="text-white/80 font-poppins max-w-2xl mx-auto text-xs sm:text-sm md:text-base">Watch highlights and pitches from our previous Demo Days.</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Player */}
            <div ref={playerRef} className="lg:w-2/3 w-full">
              {activeVideo ? (
                <>
                  <motion.div
                    key={activeVideo.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-full aspect-video rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 bg-black relative"
                  >
                    {hasScrolledIntoView ? (
                      <iframe
                        width="100%"
                        height="100%"
                        src={`https://www.youtube.com/embed/${activeVideo.youtubeId}?autoplay=1&rel=0`}
                        title={activeVideo.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full border-none"
                      ></iframe>
                    ) : (
                      <div
                        className="w-full h-full relative flex items-center justify-center bg-black/60 group cursor-pointer"
                        onClick={() => setHasScrolledIntoView(true)}
                      >
                        <img
                          src={`https://img.youtube.com/vi/${activeVideo.youtubeId}/mqdefault.jpg`}
                          alt={activeVideo.title}
                          loading="lazy"
                          className="absolute inset-0 w-full h-full object-cover opacity-50"
                        />
                        <div className="z-10 w-16 h-16 rounded-full bg-[#1b60bb] hover:bg-[#154a93] text-white flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 active:scale-95 duration-300">
                          <Play fill="white" size={24} className="ml-1" />
                        </div>
                      </div>
                    )}
                  </motion.div>
                  <h3 className="font-helios text-xl sm:text-2xl md:text-3xl font-bold mt-6 text-white">{activeVideo.title}</h3>
                </>
              ) : (
                <div className="w-full aspect-video rounded-3xl bg-slate-900/60 flex items-center justify-center text-white/50 font-poppins">
                  No video selected.
                </div>
              )}
            </div>

            {/* Playlist Grid */}
            <div className="lg:w-1/3 w-full max-h-[600px] overflow-y-auto pr-2 space-y-4 custom-scrollbar">
              {videos.map((video) => (
                <button
                  key={video.id}
                  onClick={() => {
                    setActiveVideo(video);
                    setHasScrolledIntoView(true);
                  }}
                  className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-300 text-left ${activeVideo?.id === video.id ? 'bg-[#1b60bb]/40 border border-[#5cc4fe]/50' : 'bg-white/5 border border-transparent hover:bg-white/10 hover:border-white/20'}`}
                >
                  <div className="relative w-32 aspect-video shrink-0 rounded-lg overflow-hidden bg-black/50">
                    <img
                      src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
                      alt={video.title}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                    {activeVideo?.id === video.id && (
                      <div className="absolute inset-0 bg-[#1b60bb]/50 flex items-center justify-center">
                        <Play fill="white" size={20} className="text-white drop-shadow-md" />
                      </div>
                    )}
                  </div>
                  <h4 className="font-helios text-sm md:text-base font-medium line-clamp-2 text-white/90">
                    {video.title}
                  </h4>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Exposure Visits */}
      <section className="py-20 px-4 md:px-8 max-w-[1200px] mx-auto">
        <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-xl border border-blue-50">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-lg"
            >
              <img
                src="/images/Exposure Visit.svg"
                alt="Exposure Visit"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <span className="text-[#1b60bb] font-helios font-bold tracking-wider uppercase text-xs sm:text-sm mb-2 block">Exposure Visits</span>
              <h2 className="font-helios text-2xl sm:text-3xl md:text-4xl font-bold text-slate-800 mb-6">Bringing Entrepreneurs Closer to Research</h2>
              <p className="text-slate-600 font-poppins text-xs sm:text-sm md:text-base leading-relaxed mb-8">
                Curated visits for entrepreneurs, startups, and innovators to leading research institutions and scientific facilities in Kerala.
              </p>

              <ul className="space-y-4">
                {[
                  "Interact directly with scientists and researchers",
                  "Explore advanced laboratories and incubation facilities",
                  "Understand the research ecosystem and identify collaboration opportunities"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="text-[#5cc4fe] mt-1 shrink-0" size={20} />
                    <span className="font-poppins text-slate-700 text-xs sm:text-sm md:text-base">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      <PastVisitedInstitutions initialInstitutions={initialPastVisitedInstitutions} />

      <Footer />

      {/* Custom Scrollbar for playlist */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(92, 196, 254, 0.5);
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(92, 196, 254, 0.8);
        }
      `}} />
    </main>
  );
}
