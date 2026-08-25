'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowUp, Phone } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

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
      className="relative bg-white text-slate-600 overflow-hidden"
    >
      {/* Main Footer Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-8 pt-12 lg:pt-16 pb-8">
        <div className="grid grid-cols-12 gap-8 lg:gap-12">

          {/* Column 1: LOGOS & CONTACT */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: easePremium }}
            className="col-span-12 md:col-span-4 flex flex-col gap-6"
          >
            {/* Logos */}
            <div className="flex items-center gap-3">
              <Image
                src="/images/ksum-logo.svg"
                alt="Kerala Startup Mission Logo"
                width={140}
                height={40}
                className="h-9 md:h-11 w-auto object-contain"
              />
              <div className="w-px h-9 md:h-11 bg-slate-200"></div>
              <Image
                src="/images/rink-logo.svg"
                alt="Research Innovation Network Kerala Logo"
                width={160}
                height={40}
                className="h-9 md:h-11 w-auto object-contain"
              />
            </div>

            {/* Address & Contact Info below logos */}
            <div className="space-y-4">
              <p className="font-avenir text-slate-600 text-sm leading-relaxed max-w-sm">
                <span className="font-bold text-slate-800 block">G3B, Thejaswini, Technopark Campus</span>
                Kariyavattom, Trivandrum, Kerala 695581
              </p>

              <div className="space-y-2">
                <div className="font-helios text-sm font-bold text-slate-800 mb-1 select-none">
                  For more details
                </div>
                <a href="tel:08047180470" className="group flex items-center gap-2 font-avenir text-slate-600 hover:text-[#1b60bb] transition-colors text-sm lg:text-base w-fit gpu">
                  <Phone className="w-4 h-4 shrink-0 text-slate-400 group-hover:text-[#1b60bb] transition-colors" />
                  <span className="relative">
                    08047180470
                    <span className="absolute bottom-0 left-0 w-full h-px bg-[#1b60bb] scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-300" />
                  </span>
                </a>
                <a href="tel:04712700270" className="group flex items-center gap-2 font-avenir text-slate-600 hover:text-[#1b60bb] transition-colors text-sm lg:text-base w-fit gpu">
                  <Phone className="w-4 h-4 shrink-0 text-slate-400 group-hover:text-[#1b60bb] transition-colors" />
                  <span className="relative">
                    0471-2700270
                    <span className="absolute bottom-0 left-0 w-full h-px bg-[#1b60bb] scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-300" />
                  </span>
                </a>
                <a
                  href="mailto:rink@startupmission.in"
                  className="group flex items-center gap-2 font-avenir text-slate-600 hover:text-[#1b60bb] transition-colors text-sm lg:text-base w-fit gpu"
                >
                  <svg className="w-4 h-4 shrink-0 text-slate-400 group-hover:text-[#1b60bb] transition-colors" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="relative">
                    rink@startupmission.in
                    <span className="absolute bottom-0 left-0 w-full h-px bg-[#1b60bb] scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-300" />
                  </span>
                </a>
              </div>
            </div>
          </motion.div>

          {/* Column 2: NAVIGATE */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: easePremium, delay: 0.1 }}
            className="col-span-5 sm:col-span-5 md:col-span-3"
          >
            <h4 className="font-helios text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">
              Navigate
            </h4>
            <ul className="space-y-3">
              {[
                { label: 'Home', href: '/' },
                { label: 'Technologies', href: 'https://rink-ksum.vercel.app/' },
                { label: 'Instrumentation', href: 'https://instruments.startupmission.in/' },
                { label: 'Researchpreneurship', href: '/about/researchpreneurship' },
                { label: 'Funds', href: '/funds' },
                { label: 'Programs', href: '/programs' },
                { label: 'Contact', href: '/about#contact' }
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    target={link.href.startsWith('http') ? '_blank' : undefined}
                    rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="group font-avenir text-slate-600 hover:text-[#1b60bb] transition-colors text-sm lg:text-base inline-block w-fit gpu"
                  >
                    <span className="relative">
                      {link.label}
                      <span className="absolute bottom-0 left-0 w-full h-px bg-[#1b60bb] scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-300" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Column 3: CONNECT */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: easePremium, delay: 0.2 }}
            className="col-span-5 sm:col-span-4 md:col-span-3"
          >
            <h4 className="font-helios text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">
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
                    className="group font-avenir text-slate-600 hover:text-[#1b60bb] transition-colors text-sm lg:text-base flex items-center gap-2 w-fit gpu"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-slate-400 group-hover:text-[#1b60bb] transition-colors shrink-0">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                    <span className="relative">
                      {link.label}
                      <span className="absolute bottom-0 left-0 w-full h-px bg-[#1b60bb] scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-300" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Column 4: Back to Top Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: easePremium, delay: 0.3 }}
            className="col-span-2 sm:col-span-3 md:col-span-2 flex justify-end items-start"
          >
            <button
              onClick={scrollToTop}
              className="group w-12 h-12 bg-[#eff9ff] text-[#1b60bb] rounded-full flex items-center justify-center hover:bg-[#1b60bb] hover:text-white transition-all duration-300 shadow-md cursor-pointer shrink-0"
            >
              <ArrowUp className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </motion.div>
        </div>

        {/* Divider */}
        <motion.div
          className="my-8 lg:my-10 h-px bg-slate-200"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
        />

        {/* Legal Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: easePremium, delay: 0.4 }}
          className="flex flex-col md:flex-row items-center justify-between gap-4 font-avenir text-center md:text-left text-slate-500"
        >
          <div className="text-sm sm:text-base">
            © 2025 Kerala Startup Mission
          </div>
          <div className="flex items-center justify-center gap-2.5 sm:gap-4 text-[11px] xs:text-xs sm:text-sm md:text-base whitespace-nowrap">
            <Link href="/privacy/privacy-policy" className="group font-avenir text-slate-600 hover:text-[#1b60bb] transition-colors inline-block w-fit gpu">
              <span className="relative">
                Privacy Policy
                <span className="absolute bottom-0 left-0 w-full h-px bg-[#1b60bb] scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-300" />
              </span>
            </Link>
            <span className="text-slate-300">•</span>
            <Link href="/privacy/terms" className="group font-avenir text-slate-600 hover:text-[#1b60bb] transition-colors inline-block w-fit gpu">
              <span className="relative">
                Terms & Conditions
                <span className="absolute bottom-0 left-0 w-full h-px bg-[#1b60bb] scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-300" />
              </span>
            </Link>
            <span className="text-slate-300">•</span>
            <Link href="/privacy/cookies" className="group font-avenir text-slate-600 hover:text-[#1b60bb] transition-colors inline-block w-fit gpu">
              <span className="relative">
                Cookies
                <span className="absolute bottom-0 left-0 w-full h-px bg-[#1b60bb] scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-300" />
              </span>
            </Link>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}