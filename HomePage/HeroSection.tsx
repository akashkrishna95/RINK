'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

export default function HeroSection() {

  return (
    <div id="hero" className="w-full max-w-[1400px] mx-auto px-4 md:px-8 py-6 font-sans relative scroll-mt-20">

      {/* Hero Banner */}
      <motion.div layoutId="romi-hero-container" className="relative w-full h-[520px] sm:h-[500px] md:h-[500px] rounded-[20px] overflow-hidden mb-4 group shadow-lg md:mt-4">
        {/* Background Image with Gradient Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/images/home-hero-bg.webp')",
          }}
        >
          {/* Gradient overlay to match the deep blue/cyan design */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#010101]/90 via-[#011a38]/60 to-[#1b60bb]/60"></div>
        </div>


        {/* Hero Content */}
        <div className="relative h-full flex flex-col justify-center px-6 sm:px-8 md:px-12 z-10 max-w-3xl">
          <h1 className="font-helios font-black text-3xl sm:text-4xl md:text-5xl lg:text-[54px] text-white leading-[1.15] md:leading-[1.1] mb-3 md:mb-4 tracking-wide">
            Connecting Innovation to <span className="text-[#51B3F9]">Impact.</span>
          </h1>
          <p className="text-white/95 text-base sm:text-lg md:text-xl leading-relaxed max-w-xl">
            Aligning{' '}
            <span style={{ color: '#51B3F9', fontWeight: '600' }}>Kerala&apos;s top</span> research institutions, market-ready IP, and Researchpreneurship.
          </p>
        </div>
      </motion.div>

      {/* Bottom Action Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mt-4 md:mt-6">

        {/* Card 1: Technologies */}
        <Link href="https://rink-ksum.vercel.app/" target="_blank" rel="noopener noreferrer" className="col-span-1">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
            whileHover={{ y: -5, scale: 1.01 }}
            className="bg-[#cee3ef] rounded-2xl p-4 md:p-6 relative group cursor-pointer shadow-sm hover:shadow-md transition-shadow flex flex-col items-center justify-center text-center h-full overflow-hidden"
          >
            <ArrowUpRight className="absolute top-3 right-3 md:top-4 md:right-4 text-[#1b60bb] w-4 h-4 md:w-6 md:h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            <h3 className="font-helios text-[15px] sm:text-lg md:text-xl lg:text-[26px] font-bold text-[#1b60bb] mb-1 md:mb-2 w-full truncate mt-2 md:mt-0 text-center">
              Technologies
            </h3>
            <p className="text-[#1b60bb] text-[10px] sm:text-xs md:text-sm w-full text-center leading-tight whitespace-normal">
              License breakthrough IP
            </p>
          </motion.div>
        </Link>

        {/* Card 2: Instrumentation */}
        <Link href="https://rink-ui.vercel.app/" target="_blank" rel="noopener noreferrer" className="col-span-1">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            whileHover={{ y: -5, scale: 1.01 }}
            className="bg-[#cee3ef] rounded-2xl p-4 md:p-6 relative group cursor-pointer shadow-sm hover:shadow-md transition-shadow flex flex-col items-center justify-center text-center h-full overflow-hidden"
          >
            <ArrowUpRight className="absolute top-3 right-3 md:top-4 md:right-4 text-[#1b60bb] w-4 h-4 md:w-6 md:h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            <h3 className="font-helios text-[15px] sm:text-lg md:text-xl lg:text-[26px] font-bold text-[#1b60bb] mb-1 md:mb-2 w-full truncate mt-2 md:mt-0 text-center">
              Instrumentation
            </h3>
            <p className="text-[#1b60bb] text-[10px] sm:text-xs md:text-sm w-full text-center leading-tight whitespace-normal">
              Access advanced core labs
            </p>
          </motion.div>
        </Link>

        {/* Card 3: Researchpreneurship */}
        <Link href="/about/researchpreneurship" className="col-span-2 md:col-span-1">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
            whileHover={{ y: -5, scale: 1.01 }}
            className="bg-[#1b60bb] rounded-2xl p-4 md:p-6 relative group cursor-pointer shadow-sm hover:shadow-md transition-shadow flex flex-col items-center justify-center text-center h-full overflow-hidden"
          >
            <ArrowUpRight className="absolute top-3 right-3 md:top-4 md:right-4 text-white w-4 h-4 md:w-6 md:h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            <h3 className="font-helios text-[15px] sm:text-lg md:text-xl lg:text-[26px] font-bold text-white mb-1 md:mb-2 w-full truncate mt-1 md:mt-0 text-center">
              Researchpreneurship
            </h3>
            <p className="text-white/90 text-[10px] sm:text-xs md:text-sm w-full text-center leading-tight whitespace-normal">
              Turn your research into startups
            </p>
          </motion.div>
        </Link>

      </div>
    </div>
  );
}
