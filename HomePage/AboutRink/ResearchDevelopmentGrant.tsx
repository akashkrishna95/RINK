//C:\Users\Akash Krishna\Downloads\RINK KSUM Website\HomePage\AboutRink\ResearchDevelopmentGrant.tsx

'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Coins, Settings, Microscope, Rocket } from 'lucide-react';
import Navbar from '@/HomePage/Navbar';
import Footer from '@/HomePage/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';

export default function ResearchDevelopmentGrant() {
  return (
    <main className="min-h-screen bg-[#F4F7FB] overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative w-full h-[450px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/randd/hero.png')" }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#010101]/95 via-[#011a38]/85 to-[#1b60bb]/35"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-helios text-[38px] xs:text-[44px] sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Research & Development <span className="text-[#5cc4fe]">Grant</span>
            </h1>
            <p className="text-xs xs:text-sm md:text-base text-white/85 font-poppins mb-10 max-w-2xl mx-auto leading-relaxed text-center px-4">
              Catalyzing hardware innovation by supporting startups to develop breakthrough products and technologies.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mini Breadcrumb Navigation */}
      <div className="pt-4 pb-0">
        <Breadcrumbs />
      </div>

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
                <img src="/images/funds/randd_grant.png" alt="Lab" loading="lazy" decoding="async" className="w-full h-32 sm:h-48 object-cover rounded-2xl shadow-lg" />
                <img src="/images/randd/chemicals.jpg" alt="Hardware" loading="lazy" decoding="async" className="w-full h-44 sm:h-64 object-cover rounded-2xl shadow-lg" />
              </div>
              <div className="space-y-4">
                <img src="/images/randd/chips.jpg" alt="Circuit" loading="lazy" decoding="async" className="w-full h-44 sm:h-64 object-cover rounded-2xl shadow-lg" />
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
            <h2 className="font-helios text-2xl sm:text-3xl md:text-4xl font-bold text-[#1b60bb] mb-6">Empowering Hardware Startups</h2>
            <p className="text-slate-600 font-poppins text-xs sm:text-sm md:text-base leading-relaxed mb-6">
              Designed to support startups in developing innovative products, technologies, or solutions through rigorous research and development.
            </p>
            <p className="text-slate-600 font-poppins text-xs sm:text-sm md:text-base leading-relaxed mb-8">
              This grant specifically targets hardware startups with a strong R&D focus, encouraging deep-tech innovation and product development. Funding is directed primarily toward hardware development, prioritizing startups that have secured patents or are in the process of scaling.
            </p>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-blue-50 mb-8">
              <h3 className="font-helios font-bold text-slate-800 text-base sm:text-lg mb-4">Key Eligibility Criteria</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Settings className="text-[#5cc4fe] mt-0.5 shrink-0" size={20} />
                  <span className="font-poppins text-slate-700 text-xs sm:text-sm md:text-base">Hardware startups with a strong R&D focus</span>
                </li>
                <li className="flex items-start gap-3">
                  <Microscope className="text-[#5cc4fe] mt-0.5 shrink-0" size={20} />
                  <span className="font-poppins text-slate-700 text-xs sm:text-sm md:text-base">Must have a working prototype</span>
                </li>
                <li className="flex items-start gap-3">
                  <Coins className="text-[#5cc4fe] mt-0.5 shrink-0" size={20} />
                  <span className="font-poppins text-slate-700 text-xs sm:text-sm md:text-base">Associated with an approved incubator in Kerala</span>
                </li>
              </ul>
            </div>
          </motion.div>

        </div>
      </section>

      <Footer />
    </main>
  );
}
