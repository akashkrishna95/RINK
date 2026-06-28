'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play, CheckCircle2, Users, Lightbulb, TrendingUp } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function DemoDayPage() {
  const videos = [
    { id: '4_4w6dkO1ik', title: 'ICAR-SUGARCANE BREEDING INSTITUTE KANNUR' },
    { id: 'bY5FVptw0uI', title: 'MG UNIVERSITY' },
    { id: 'uJnU7nZgzs8', title: 'Centre for Materials for Electronics Technology, CMET' },
    { id: 'U0kmZCbR3nA', title: 'National Institute For Interdisciplinary Science and Technology, NIIST' },
    { id: 'a3hbMuF5zl4', title: 'Central Plantation Crops Research Institute (CPCRI)' },
    { id: '5jrxaZ5w7e0', title: 'CENTRAL TUBER CROPS RESEARCH INSTITUTE (CTCRI)' },
    { id: 'NojFCP84yls', title: 'KERALA UNIVERSITY OF FISHERIES & OCEAN STUDIES (KUFOS)' },
    { id: 'IF-XZPllRFU', title: 'Centre for Development of Advanced Computing (C-DAC)' },
    { id: '8LDcim7TwwI', title: 'National Technology Day Special Demo Day' }
  ];

  const [activeVideo, setActiveVideo] = useState(videos[0]);

  return (
    <main className="min-h-screen bg-[#F4F7FB] overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative w-full h-[500px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=75')" }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#010101]/95 via-[#011a38]/80 to-[#1b60bb]/70"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >

            <h1 className="font-helios text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Demo Day & <br className="hidden md:block" />
              <span className="text-[#5cc4fe]">Exposure Visits</span>
            </h1>
            <p className="text-lg md:text-xl text-white/80 font-poppins mb-10 max-w-2xl mx-auto leading-relaxed">
              Bridging the gap between groundbreaking research and commercial success by connecting innovators directly with industry and investors.
            </p>
          </motion.div>
        </div>
      </section>

      {/* What is Demo Day Section */}
      <section className="py-20 px-4 md:px-8 max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-helios text-3xl md:text-4xl font-bold text-[#1b60bb] mb-6">Connecting Research & Industry</h2>
            <p className="text-slate-600 font-poppins text-lg leading-relaxed mb-6">
              RINK Demo Day acts as a vital bridge between leading research institutions and the startup ecosystem. We provide a platform for researchers and innovators to showcase their groundbreaking technologies, patents, and products.
            </p>
            <p className="text-slate-600 font-poppins text-lg leading-relaxed mb-8">
              Entrepreneurs, investors, and industry leaders get exclusive access to explore the commercial potential of these innovations, fostering collaborations that translate lab research into market-ready solutions.
            </p>
            
            <a href="/events" className="inline-flex items-center gap-2 bg-[#1b60bb] text-white px-8 py-4 rounded-xl font-semibold hover:bg-[#154a93] transition-colors shadow-md hover:shadow-lg group">
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
            <h2 className="font-helios text-3xl md:text-4xl font-bold text-[#5cc4fe] mb-4">Past Demo Day Pitches</h2>
            <p className="text-white/80 font-poppins max-w-2xl mx-auto text-lg">Watch highlights and pitches from our previous Demo Days.</p>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Player */}
            <div className="lg:w-2/3 w-full">
              <motion.div 
                key={activeVideo.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full aspect-video rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 bg-black"
              >
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${activeVideo.id}?autoplay=1&rel=0`}
                  title={activeVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-none"
                ></iframe>
              </motion.div>
              <h3 className="font-helios text-2xl md:text-3xl font-bold mt-6 text-white">{activeVideo.title}</h3>
            </div>

            {/* Playlist Grid */}
            <div className="lg:w-1/3 w-full max-h-[600px] overflow-y-auto pr-2 space-y-4 custom-scrollbar">
              {videos.map((video) => (
                <button
                  key={video.id}
                  onClick={() => setActiveVideo(video)}
                  className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-300 text-left ${activeVideo.id === video.id ? 'bg-[#1b60bb]/40 border border-[#5cc4fe]/50' : 'bg-white/5 border border-transparent hover:bg-white/10 hover:border-white/20'}`}
                >
                  <div className="relative w-32 aspect-video shrink-0 rounded-lg overflow-hidden bg-black/50">
                    <img 
                      src={`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`} 
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                    {activeVideo.id === video.id && (
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
                src="https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&w=800&q=75" 
                alt="Exposure Visit"
                className="w-full h-full object-cover"
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <span className="text-[#1b60bb] font-helios font-bold tracking-wider uppercase text-sm mb-2 block">Exposure Visits</span>
              <h2 className="font-helios text-3xl md:text-4xl font-bold text-slate-800 mb-6">Bringing Entrepreneurs Closer to Research</h2>
              <p className="text-slate-600 font-poppins text-lg leading-relaxed mb-8">
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
                    <span className="font-poppins text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
      
      {/* Custom Scrollbar for playlist */}
      <style dangerouslySetInnerHTML={{__html: `
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
