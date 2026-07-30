'use client';

import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, FileBadge, Search, Users, Lightbulb } from 'lucide-react';
import Navbar from '@/HomePage/Navbar';
import Footer from '@/HomePage/Footer';

export default function IPRSupport() {
  return (
    <main className="min-h-screen bg-[#F4F7FB] overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative w-full h-[450px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200&q=75')" }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#010101]/95 via-[#011a38]/85 to-[#1b60bb]/70"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-helios text-[38px] xs:text-[44px] sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              IPR <span className="text-[#5cc4fe]">Support</span>
            </h1>
            <p className="text-sm xs:text-base md:text-lg lg:text-lg text-white/85 font-poppins mb-10 max-w-2xl mx-auto leading-relaxed text-center px-2">
              Protect, manage, and commercialize your intellectual property with expert guidance and support from RINK partner institutions.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="py-20 px-4 md:px-8 max-w-[1200px] mx-auto">
        <div className="bg-white rounded-[2rem] p-5 md:p-12 shadow-xl border border-blue-50 relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-50 to-transparent rounded-bl-full opacity-50 -z-0"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 relative z-10 items-center">
            
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-helios text-2xl sm:text-3xl md:text-4xl font-bold text-slate-800 mb-6">Safeguarding Your Innovations</h2>
              <p className="text-slate-600 font-poppins text-xs sm:text-sm md:text-base leading-relaxed mb-8">
                RINK, through its partner institutions, offers comprehensive IPR-related support for innovators. We help you navigate the complexities of intellectual property to ensure your breakthrough ideas are protected and ready for commercialization.
              </p>
              
              <div className="space-y-6 mb-10">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100">
                    <FileBadge className="text-[#1b60bb]" size={24} />
                  </div>
                  <div>
                    <h3 className="font-helios font-bold text-slate-800 text-lg sm:text-xl mb-1">IP Patent Support</h3>
                    <p className="text-slate-500 font-poppins text-xs sm:text-sm md:text-base">Support for provisional/complete patent filing for research ideas.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100">
                    <Search className="text-[#1b60bb]" size={24} />
                  </div>
                  <div>
                    <h3 className="font-helios font-bold text-slate-800 text-lg sm:text-xl mb-1">Free Searches</h3>
                    <p className="text-slate-500 font-poppins text-xs sm:text-sm md:text-base">Comprehensive patent and trademark searches to validate your ideas.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100">
                    <Users className="text-[#1b60bb]" size={24} />
                  </div>
                  <div>
                    <h3 className="font-helios font-bold text-slate-800 text-lg sm:text-xl mb-1">Expert Interaction</h3>
                    <p className="text-slate-500 font-poppins text-xs sm:text-sm md:text-base">One-on-one sessions with empanelled IPR experts and attorneys.</p>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100">
                <h3 className="font-helios font-semibold text-slate-700 text-base sm:text-lg mb-4">Who Can Apply?</h3>
                <div className="flex flex-wrap gap-3 mb-8">
                  {['Startups', 'Student Innovators', 'Research Scholars', 'Faculty & Scientists'].map((tag, i) => (
                    <span key={i} className="bg-slate-100 text-slate-600 px-4 py-2 rounded-lg text-xs sm:text-sm font-medium font-poppins">
                      {tag}
                    </span>
                  ))}
                </div>
                
                <a href="https://forms.gle/LkgvgzVRTj6WhQPu9" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-[#1b60bb] text-white px-8 py-4 rounded-xl font-semibold hover:bg-[#154a93] transition-all shadow-md hover:shadow-lg group text-xs sm:text-sm md:text-base">
                  Book Your Slot <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                </a>
              </div>
            </motion.div>

            {/* Right Image/Graphic */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="relative aspect-[4/3] md:aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                <img 
                  src="https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=800&q=75"
                  alt="IPR Support"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#011a38]/90 via-[#011a38]/20 to-transparent flex flex-col justify-end p-8">
                  <Lightbulb size={40} className="text-[#5cc4fe] mb-4" />
                  <h3 className="font-helios text-xl sm:text-2xl font-bold text-white mb-2">Secure Your Future</h3>
                  <p className="text-white/80 font-poppins text-xs sm:text-sm">Don't let your research go unprotected. Register your IP today.</p>
                </div>
              </div>
              
              {/* Floating Badge */}
              <div className="absolute -top-6 right-2 sm:-right-6 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-4 animate-bounce" style={{ animationDuration: '3s' }}>
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="text-green-600" size={20} />
                </div>
                <div>
                  <p className="font-helios font-bold text-slate-800">100% Free</p>
                  <p className="text-xs text-slate-500 font-poppins">Initial Search</p>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
