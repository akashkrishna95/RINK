'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, ExternalLink, Image as ImageIcon, X } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { eventsData, RinkEvent } from '@/data/events';

export default function EventsPage() {
  const [selectedEvent, setSelectedEvent] = useState<RinkEvent | null>(null);
  const upcomingEvents = eventsData.filter(e => e.type === 'upcoming');
  const pastEvents = eventsData.filter(e => e.type === 'past');

  return (
    <main className="min-h-screen bg-[#F4F7FB] relative">
      <Navbar />

      {/* Hero Section */}
      <section className="relative w-full h-[400px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80')" }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#010101]/95 via-[#011a38]/85 to-[#1b60bb]/80"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-helios text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              RINK <span className="text-[#5cc4fe]">Events</span>
            </h1>
            <p className="text-lg md:text-xl text-white/80 font-poppins max-w-2xl mx-auto leading-relaxed">
              Discover workshops, demo days, and masterclasses designed to empower Kerala's research and startup ecosystem.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-20 px-4 md:px-8 max-w-[1400px] mx-auto">
        <div className="flex items-center gap-4 mb-12">
          <h2 className="font-helios text-3xl md:text-4xl font-bold text-[#1b60bb]">Upcoming Events</h2>
          <div className="h-px bg-blue-200 flex-grow rounded-full"></div>
        </div>

        {upcomingEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {upcomingEvents.map((event, idx) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                onClick={() => setSelectedEvent(event)}
                className="group bg-white rounded-3xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-blue-50 hover:shadow-[0_20px_40px_rgba(27,96,187,0.1)] transition-all duration-300 flex flex-col h-full cursor-pointer"
              >
                {/* 4:5 Aspect Ratio Poster */}
                <div className="relative w-full aspect-[4/5] overflow-hidden bg-slate-100">
                  <img 
                    src={event.imageUrl} 
                    alt={event.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-md border border-white/20">
                    <span className="font-helios font-bold text-[#1b60bb] text-sm tracking-wide uppercase">Upcoming</span>
                  </div>
                </div>
                
                <div className="p-8 flex flex-col flex-grow">
                  <h3 className="font-helios text-2xl font-bold text-slate-800 mb-4 line-clamp-2 group-hover:text-[#1b60bb] transition-colors">{event.title}</h3>
                  <p className="text-slate-600 font-poppins text-sm leading-relaxed mb-6 line-clamp-3">{event.description}</p>
                  
                  <div className="space-y-3 mt-auto">
                    <div className="flex items-center gap-3 text-slate-500 font-poppins text-sm">
                      <Calendar size={18} className="text-[#5cc4fe]" />
                      {new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                    <div className="flex items-center gap-3 text-slate-500 font-poppins text-sm">
                      <MapPin size={18} className="text-[#5cc4fe]" />
                      <span className="line-clamp-1">{event.location}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-blue-50 shadow-sm">
            <h3 className="font-helios text-2xl text-slate-500 mb-2">No upcoming events right now</h3>
            <p className="font-poppins text-slate-400">Check back later for new workshops and masterclasses.</p>
          </div>
        )}
      </section>

      {/* Past Events */}
      <section className="py-20 px-4 md:px-8 max-w-[1400px] mx-auto bg-slate-50/50">
        <div className="flex items-center gap-4 mb-12">
          <h2 className="font-helios text-3xl md:text-4xl font-bold text-slate-800">Past Events</h2>
          <div className="h-px bg-slate-200 flex-grow rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {pastEvents.map((event, idx) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              onClick={() => setSelectedEvent(event)}
              className="group bg-white rounded-3xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100 flex flex-col h-full cursor-pointer"
            >
              {/* 4:5 Aspect Ratio Poster with Grayscale Effect */}
              <div className="relative w-full aspect-[4/5] overflow-hidden bg-slate-100">
                <img 
                  src={event.imageUrl} 
                  alt={event.title}
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0 grayscale-[50%]"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-md border border-white/20 text-slate-500">
                  <span className="font-helios font-bold text-sm tracking-wide uppercase">Past</span>
                </div>
              </div>
              
              <div className="p-8 flex flex-col flex-grow">
                <h3 className="font-helios text-2xl font-bold text-slate-700 mb-4 line-clamp-2">{event.title}</h3>
                
                <div className="space-y-3 mt-auto">
                  <div className="flex items-center gap-3 text-slate-500 font-poppins text-sm">
                    <Calendar size={18} className="text-slate-400" />
                    {new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Modal for Event Details */}
      <AnimatePresence>
        {selectedEvent && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedEvent(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            />
            
            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-[2rem] shadow-2xl z-[101] custom-scrollbar"
            >
              <button 
                onClick={() => setSelectedEvent(null)}
                className="absolute top-6 right-6 p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors z-10"
              >
                <X size={24} className="text-slate-600" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="relative w-full aspect-square md:aspect-auto md:h-full bg-slate-100">
                  <img 
                    src={selectedEvent.imageUrl}
                    alt={selectedEvent.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-md border border-white/20">
                    <span className={`font-helios font-bold text-sm tracking-wide uppercase ${selectedEvent.type === 'upcoming' ? 'text-[#1b60bb]' : 'text-slate-500'}`}>
                      {selectedEvent.type}
                    </span>
                  </div>
                </div>
                
                <div className="p-8 md:p-12 flex flex-col justify-center">
                  <h2 className="font-helios text-3xl md:text-4xl font-bold text-slate-800 mb-6 leading-tight">
                    {selectedEvent.title}
                  </h2>
                  
                  <div className="space-y-4 mb-8 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                        <Calendar size={20} className="text-[#1b60bb]" />
                      </div>
                      <div>
                        <p className="font-helios font-semibold text-slate-800">Date</p>
                        <p className="text-slate-500 font-poppins text-sm">
                          {new Date(selectedEvent.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                        <MapPin size={20} className="text-[#1b60bb]" />
                      </div>
                      <div>
                        <p className="font-helios font-semibold text-slate-800">Location</p>
                        <p className="text-slate-500 font-poppins text-sm">{selectedEvent.location}</p>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-slate-600 font-poppins text-base md:text-lg leading-relaxed mb-10 whitespace-pre-line">
                    {selectedEvent.description}
                  </p>
                  
                  <div className="flex flex-col gap-4 mt-auto">
                    {selectedEvent.registrationLink && (
                      <a 
                        href={selectedEvent.registrationLink}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full py-4 bg-[#1b60bb] hover:bg-[#154a93] text-white rounded-xl font-helios font-bold text-center transition-colors flex items-center justify-center gap-2 group/btn"
                      >
                        Register for Event
                        <ExternalLink size={18} className="group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5 transition-transform" />
                      </a>
                    )}
                    
                    {selectedEvent.galleryUrl && (
                      <a 
                        href={selectedEvent.galleryUrl}
                        className="w-full py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-helios font-bold text-center transition-colors flex items-center justify-center gap-2 group/btn"
                      >
                        View Event Gallery
                        <ImageIcon size={18} className="group-hover/btn:scale-110 transition-transform" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <Footer />

      {/* Custom Scrollbar for Modal */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.05);
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(27, 96, 187, 0.3);
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(27, 96, 187, 0.6);
        }
      `}} />
    </main>
  );
}
