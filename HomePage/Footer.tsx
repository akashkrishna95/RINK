'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowUp, Phone } from 'lucide-react';
import Link from 'next/link';

// Custom premium easing curve matching the reference design
const easePremium = [0.16, 1, 0.3, 1] as [number, number, number, number];

export default function Footer() {
  const footerRef = useRef(null);
  const isInView = useInView(footerRef, { once: true, amount: 0.1 });

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      ref={footerRef}
      className="relative bg-[#1b4f8d] text-[#eff9ff] overflow-hidden"
    >
      {/* Optical Color Bleed from light section above */}
      <div className="absolute top-0 left-0 right-0 h-[200px] bg-gradient-to-b from-[#eff9ff]/10 via-transparent to-transparent blur-[80px] pointer-events-none z-0" />

      {/* Main Footer Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-8 py-20 lg:py-28 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Column 1: NAVIGATE */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: easePremium }}
          >
            <h4 className="font-helios text-sm font-bold text-[#eff9ff] uppercase tracking-wider mb-4">
              Navigate
            </h4>
            <ul className="space-y-3">
              {[
                { label: 'About', href: '/about' },
                { label: 'Technologies', href: 'https://rink-ksum.vercel.app/' },
                { label: 'Instrumentation', href: 'https://instruments.startupmission.in/' },
                { label: 'Researchpreneurship', href: '/about/researchpreneurship' },
                { label: 'Grants', href: '/grants' },
                { label: 'Programs', href: '/programs' },
                { label: 'Contact', href: '/about#contact' }
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    target={link.href.startsWith('http') ? '_blank' : undefined}
                    rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="font-avenir text-[#eff9ff]/70 hover:text-[#eff9ff] transition-colors text-sm lg:text-base block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Column 2: CONNECT */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: easePremium, delay: 0.1 }}
          >
            <h4 className="font-helios text-sm font-bold text-[#eff9ff] uppercase tracking-wider mb-4">
              Connect
            </h4>
            <ul className="space-y-3">
              {[
                { label: 'LinkedIn', href: 'https://in.linkedin.com/company/research-innovation-network-kerala/' },
                ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    target={link.href.startsWith('http') ? '_blank' : undefined}
                    rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="font-avenir text-[#eff9ff]/70 hover:text-[#eff9ff] transition-colors text-sm lg:text-base block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Column 3: CONTACT */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: easePremium, delay: 0.2 }}
            className="col-span-2 md:col-span-1"
          >
            <h4 className="font-helios text-sm font-bold text-[#eff9ff] uppercase tracking-wider mb-4">
              Contact
            </h4>
            <div className="space-y-4">
              <a
                href="mailto:rink@startupmission.in"
                className="group block w-fit"
              >
                <span className="font-avenir text-base lg:text-lg text-[#eff9ff] relative">
                  rink@startupmission.in
                  <span className="absolute bottom-0 left-0 w-0 h-px bg-[#eff9ff] group-hover:w-full transition-all duration-300" />
                </span>
              </a>
              <p className="font-avenir text-[#eff9ff]/70 text-sm leading-relaxed w-full max-w-sm pr-4">
                G3B, Thejaswini, Technopark Campus Kariyavattom, Trivandrum, Kerala 695581
              </p>
              <div className="space-y-2">
                <a href="tel:08047180470" className="flex items-center gap-2 font-avenir text-[#eff9ff]/70 hover:text-[#eff9ff] transition-colors text-sm lg:text-base w-fit">
                  <Phone className="w-4 h-4" />
                  <span>08047180470</span>
                </a>
                <a href="tel:04712700270" className="flex items-center gap-2 font-avenir text-[#eff9ff]/70 hover:text-[#eff9ff] transition-colors text-sm lg:text-base w-fit">
                  <Phone className="w-4 h-4" />
                  <span>0471-2700270</span>
                </a>
              </div>
            </div>
          </motion.div>

          {/* Column 4: Back to Top Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: easePremium, delay: 0.3 }}
            className="col-span-2 md:col-span-1 flex justify-start md:justify-end md:items-start"
          >
            <button
              onClick={scrollToTop}
              className="group w-12 h-12 bg-[#eff9ff] text-[#1b4f8d] rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg"
            >
              <ArrowUp className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </motion.div>
        </div>

        {/* Divider */}
        <motion.div 
          className="my-12 lg:my-16 h-px bg-[#eff9ff]/20" 
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
        />

        {/* Legal Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: easePremium, delay: 0.4 }}
          className="flex flex-col md:flex-row items-center justify-between gap-4 font-avenir"
        >
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 lg:gap-4 text-xs text-[#eff9ff]/60">
            <span>© 2025 Kerala Startup Mission</span>
            <span className="hidden sm:inline text-[#eff9ff]/30">•</span>
            <Link href="/privacy?tab=privacy" className="hover:text-[#eff9ff] transition-colors">
              Privacy Policy
            </Link>
            <span className="hidden sm:inline text-[#eff9ff]/30">•</span>
            <Link href="/privacy?tab=terms" className="hover:text-[#eff9ff] transition-colors">
              Terms & Conditions
            </Link>
            <span className="hidden sm:inline text-[#eff9ff]/30">•</span>
            <Link href="/privacy?tab=cookies" className="hover:text-[#eff9ff] transition-colors">
              Cookies
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Massive Brand Anchor - Fixed to prevent 'K' from clipping */}
      <div className="relative w-full flex items-end justify-center pointer-events-none select-none z-50 -mt-[3vw]">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: easePremium, delay: 0.5 }}
          className="w-full flex items-end justify-center px-0"
        >
          <span 
            className="font-helios font-black text-[#eff9ff] text-center w-full block whitespace-nowrap tracking-tighter"
            style={{
              fontSize: '13.2vw', 
              lineHeight: '0.75', 
              marginBottom: '-0.5vw' // Sits perfectly on the floor
            }}
          >
            KSUM ✦ RINK
          </span>
        </motion.div>
      </div>
    </footer>
  );
}