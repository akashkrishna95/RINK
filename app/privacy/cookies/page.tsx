'use client';

import Image from 'next/image';
import Link from 'next/link';
import Footer from '@/HomePage/Footer';
import { Cookie } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CookiesPage() {
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
            className="flex items-center gap-4 sm:gap-6 md:gap-8 justify-center bg-white/40 py-4 px-8 rounded-2xl border border-white/50 shadow-[inset_2px_2px_5px_#c8d0e7,_inset_-2px_-2px_5px_#ffffff] hover:bg-white/60 transition-all duration-300 cursor-pointer"
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
              Cookie Policy
            </h1>
            <p className="text-slate-500 font-poppins text-xs sm:text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
              Official data storage disclosures for RINK, an initiative of Kerala Startup Mission (KSUM), Government of Kerala.
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
                1. Zero Third-Party Advertising Cookies
              </h2>
              <p>
                We are dedicated to user privacy. We do not place marketing, advertisement, or behavioral profiling cookies on your computer.
              </p>
            </div>

            <div>
              <h2 className="font-helios text-2xl font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">
                2. Local Browser Storage
              </h2>
              <p className="mb-3">
                The RINK portal uses your browser's local cache (LocalStorage) strictly for functional operations:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>ROMI AI Assistant:</strong> To preserve your offline-friendly conversation history so you can retrieve your chatbot dialogues upon subsequent visits.</li>
                <li><strong>UI Preferences:</strong> To store minimal display settings (like theme/state consents).</li>
              </ul>
            </div>

            <div>
              <h2 className="font-helios text-2xl font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">
                3. Managing Storage
              </h2>
              <p>
                You can purge your cookies and local storage items at any time through your browser settings (e.g. by clearing browsing data). Disabling LocalStorage will only restrict ROMI AI from retrieving your past chat history, while the rest of the site remains fully browsable.
              </p>
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
