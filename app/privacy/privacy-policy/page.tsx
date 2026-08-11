'use client';

import Image from 'next/image';
import Link from 'next/link';
import Footer from '@/HomePage/Footer';
import { ShieldCheck, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-[#F4F7FB] relative overflow-hidden flex flex-col justify-between">
      <section className="pt-16 pb-24 px-4 md:px-8 max-w-[1400px] mx-auto w-full flex-grow flex flex-col gap-10">
        {/* Logos and Page Header Card */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-br from-[#fbfcfe] to-[#eaeff7] p-8 rounded-[2rem] border border-white/60 shadow-[8px_8px_20px_#c8d0e7,_-8px_-8px_20px_#ffffff] text-center flex flex-col items-center gap-6"
        >
          {/* KSUM and RINK logos side-by-side - Clickable to Home Hero */}
          <Link 
            href="/" 
            className="flex items-center gap-4 sm:gap-6 md:gap-8 justify-center bg-white/40 py-4 px-8 rounded-2xl border border-white/50 shadow-[inset_2px_2px_5px_#c8d0e7,_inset_-2px_-2px_5px_#ffffff] hover:scale-[1.01] hover:bg-white/60 active:scale-[0.98] transition-all duration-300 cursor-pointer"
            title="Go to Home"
          >
            {/* KSUM Logo */}
            <div className="relative h-8 sm:h-10 md:h-12 w-28 sm:w-36 md:w-40 flex items-center justify-center">
              <Image
                src="/images/ksum-logo.svg"
                alt="Kerala Startup Mission"
                fill
                className="object-contain"
                priority
              />
            </div>
            {/* Vertical Divider */}
            <div className="w-px h-8 sm:h-10 bg-[#1b60bb]/25" />
            {/* RINK Logo */}
            <div className="relative h-8 sm:h-10 md:h-12 w-36 sm:w-44 md:w-48 flex items-center justify-center">
              <Image
                src="/images/rink-logo.svg"
                alt="Research Innovation Network Kerala"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>

          <div>
            <h1 className="font-helios text-3xl sm:text-4xl md:text-5xl font-bold text-[#1b60bb] mb-3">
              Privacy Policy
            </h1>
            <p className="text-slate-500 font-poppins text-xs sm:text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
              Official data protection and privacy guarantees for RINK, an initiative of Kerala Startup Mission (KSUM), Government of Kerala.
            </p>
          </div>
        </motion.div>

        {/* Policy Sheet Container */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-white p-6 sm:p-10 md:p-12 rounded-[2.5rem] border border-slate-100 shadow-[10px_10px_30px_rgba(163,177,198,0.2)] min-h-[400px] flex flex-col justify-between"
        >
          <div className="space-y-8 font-poppins text-slate-600 leading-relaxed text-sm sm:text-base">
            <div>
              <h2 className="font-helios text-2xl font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">
                1. Introduction & Overview
              </h2>
              <p>
                Research Innovation Network Kerala (RINK), an initiative of Kerala Startup Mission (KSUM), Government of Kerala, is committed to maintaining high standards of data protection and user privacy. This Privacy Policy details how we govern information displayed, referenced, or utilized on this website.
              </p>
            </div>

            <div>
              <h2 className="font-helios text-2xl font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">
                2. No Direct Personal Data Collection
              </h2>
              <p className="mb-3">
                This website functions primarily as a static directory and discovery portal to connect stakeholders with technologies, research projects, and instrumentation facilities. 
              </p>
              <div className="flex gap-3 bg-blue-50/50 p-4 rounded-xl border border-blue-100 text-slate-600 items-start">
                <AlertTriangle className="text-[#1b60bb] shrink-0 mt-0.5" size={20} />
                <p className="text-xs sm:text-sm">
                  <strong>Zero Database Storage:</strong> We do not ask for, create, or maintain user accounts, passwords, or personal logs on our server. Users may browse all directories and listings with complete anonymity.
                </p>
              </div>
            </div>

            <div>
              <h2 className="font-helios text-2xl font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">
                3. Inquiries & Google Forms Policy
              </h2>
              <p className="mb-3">
                To connect researchers with entrepreneurs (researchpreneurship) and facilitate technology translation, we display forms or links leading to secure <strong>Google Forms</strong> and official email channels.
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Any information you input via these external forms is processed strictly to match research innovations with potential incubators and startup programs.</li>
                <li>No submission data is stored on this website's local server environment.</li>
                <li>Users are advised to share only non-confidential pitch/inquiry details initially.</li>
              </ul>
            </div>

            <div>
              <h2 className="font-helios text-2xl font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">
                4. ROMI AI Local Privacy & Zero Server Logging
              </h2>
              <p className="mb-4">
                We are proud to state that our digital assistant, <strong className="font-bold text-slate-800">ROMI AI</strong>, operates with a privacy-first model:
              </p>
              <div className="bg-[#F4F7FB] p-5 rounded-2xl border border-slate-200/50 space-y-3">
                <div className="flex items-center gap-2 text-[#1b60bb] font-bold text-sm sm:text-base font-helios">
                  <ShieldCheck size={20} />
                  Local Browser Cache Only
                </div>
                <p className="text-xs sm:text-sm text-slate-600">
                  All chat conversations, parameters, and historical questions submitted to ROMI AI are saved <strong className="font-bold text-[#1b60bb]">exclusively in your own local device storage (browser cache / local storage)</strong>. RINK and KSUM servers do not log, upload, inspect, compile, or transmit any chat records. Users are in full control and can wipe their conversation history locally at any time.
                </p>
              </div>
            </div>
          </div>

          {/* Back Link */}
          <div className="mt-12 pt-6 border-t border-slate-100 flex justify-end">
            <Link 
              href="/"
              className="font-helios text-sm font-bold text-[#1b60bb] hover:underline flex items-center gap-1"
            >
              ← Back to Home
            </Link>
          </div>
        </motion.div>
      </section>

      <Footer />
    </main>
  );
}
