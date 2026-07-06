'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Coins, Settings, Microscope, Rocket } from 'lucide-react';
import Navbar from '@/HomePage/Navbar';
import Footer from '@/HomePage/Footer';

export default function RandDGrantPage() {
  return (
    <main className="min-h-screen bg-[#F4F7FB] overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative w-full h-[450px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=75')" }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#010101]/95 via-[#011a38]/85 to-[#1b60bb]/70"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >

            <h1 className="font-helios text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Research & Development <span className="text-[#5cc4fe]">Grant</span>
            </h1>
            <p className="text-lg md:text-xl text-white/80 font-poppins mb-10 max-w-2xl mx-auto leading-relaxed">
              Catalyzing hardware innovation by supporting startups to develop breakthrough products and technologies.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Details Section */}
      <section className="py-20 px-4 md:px-8 max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            {/* Main Image Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4 translate-y-4 sm:translate-y-8">
                <img src="https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=600&q=75" alt="Lab" className="w-full h-32 sm:h-48 object-cover rounded-2xl shadow-lg" />
                <img src="https://images.unsplash.com/photo-1581092335397-9583eb92d232?auto=format&fit=crop&w=600&q=75" alt="Hardware" className="w-full h-44 sm:h-64 object-cover rounded-2xl shadow-lg" />
              </div>
              <div className="space-y-4">
                <img src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=75" alt="Circuit" className="w-full h-44 sm:h-64 object-cover rounded-2xl shadow-lg" />
                <div className="bg-[#1b60bb] p-4 sm:p-6 rounded-2xl shadow-lg h-32 sm:h-48 flex flex-col justify-center items-center text-center text-white">
                  <Rocket className="mb-2 sm:mb-3 text-[#5cc4fe] w-8 h-8 sm:w-10 sm:h-10" />
                  <h3 className="font-helios font-bold text-base sm:text-xl">Scale Faster</h3>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-helios text-3xl md:text-4xl font-bold text-[#1b60bb] mb-6">Empowering Hardware Startups</h2>
            <p className="text-slate-600 font-poppins text-lg leading-relaxed mb-6">
              Designed to support startups in developing innovative products, technologies, or solutions through rigorous research and development.
            </p>
            <p className="text-slate-600 font-poppins text-lg leading-relaxed mb-8">
              This grant specifically targets hardware startups with a strong R&D focus, encouraging deep-tech innovation and product development. Funding is directed primarily toward hardware development, prioritizing startups that have secured patents or are in the process of scaling.
            </p>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-blue-50 mb-8">
              <h3 className="font-helios font-bold text-slate-800 text-lg mb-4">Key Eligibility Criteria</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Settings className="text-[#5cc4fe] mt-0.5 shrink-0" size={20} />
                  <span className="font-poppins text-slate-700">Hardware startups with a strong R&D focus</span>
                </li>
                <li className="flex items-start gap-3">
                  <Microscope className="text-[#5cc4fe] mt-0.5 shrink-0" size={20} />
                  <span className="font-poppins text-slate-700">Must have a working prototype</span>
                </li>
                <li className="flex items-start gap-3">
                  <Coins className="text-[#5cc4fe] mt-0.5 shrink-0" size={20} />
                  <span className="font-poppins text-slate-700">Associated with an approved incubator in Kerala</span>
                </li>
              </ul>
            </div>
            
            <a href="https://startupmission.kerala.gov.in/schemes/rd-grant" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-[#1b60bb] text-white px-8 py-4 rounded-xl font-semibold hover:bg-[#154a93] transition-colors shadow-md hover:shadow-lg group">
              Know More <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
            </a>
          </motion.div>

        </div>
      </section>

      <Footer />
    </main>
  );
}
