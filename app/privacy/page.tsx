'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/HomePage/Navbar';
import Footer from '@/HomePage/Footer';
import { ShieldCheck, FileText, Cookie, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function PolicyContent() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms' | 'cookies'>('privacy');

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'privacy' || tab === 'terms' || tab === 'cookies') {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const tabs = [
    { id: 'privacy', label: 'Privacy Policy', icon: ShieldCheck },
    { id: 'terms', label: 'Terms & Conditions', icon: FileText },
    { id: 'cookies', label: 'Cookie Policy', icon: Cookie },
  ] as const;

  return (
    <div className="w-full flex flex-col gap-10">
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
            Legal Policies & Terms
          </h1>
          <p className="text-slate-500 font-poppins text-xs sm:text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            Official guidelines, terms of service, and user privacy guarantees for RINK, an initiative of Kerala Startup Mission (KSUM), Government of Kerala.
          </p>
        </div>
      </motion.div>

      {/* Skeuomorphic Interactive Tab Bar */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-6 max-w-3xl mx-auto w-full">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col sm:flex-row items-center justify-center gap-2 py-3 px-2 sm:px-6 rounded-2xl border transition-all duration-300 font-helios text-xs sm:text-sm font-semibold cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-br from-white to-[#eef2f9] border-white/80 text-[#1b60bb] shadow-[4px_4px_10px_#c8d0e7,_-4px_-4px_10px_#ffffff] scale-[1.03]'
                  : 'bg-transparent border-transparent text-slate-500 hover:text-[#1b60bb] shadow-[inset_2px_2px_5px_transparent]'
              }`}
            >
              <Icon size={18} className={isActive ? 'text-[#1b60bb]' : 'text-slate-400'} />
              <span className="text-center sm:text-left">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Policy Sheet Container */}
      <motion.div
        layout
        className="bg-white p-6 sm:p-10 md:p-12 rounded-[2.5rem] border border-slate-100 shadow-[10px_10px_30px_rgba(163,177,198,0.2)] min-h-[400px] flex flex-col justify-between"
      >
        <AnimatePresence mode="wait">
          {activeTab === 'privacy' && (
            <motion.div
              key="privacy"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-8 font-poppins text-slate-600 leading-relaxed text-sm sm:text-base"
            >
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
            </motion.div>
          )}

          {activeTab === 'terms' && (
            <motion.div
              key="terms"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-8 font-poppins text-slate-600 leading-relaxed text-sm sm:text-base"
            >
              <div>
                <h2 className="font-helios text-2xl font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">
                  1. Terms of Use
                </h2>
                <p>
                  By accessing and browsing the RINK portal, you accept these Terms and Conditions in full. These terms are governed by the Information Technology Act, 2000 of India, and other state regulations of the Government of Kerala.
                </p>
              </div>

              <div>
                <h2 className="font-helios text-2xl font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">
                  2. Intellectual Property & Listings Disclaimer
                </h2>
                <p className="mb-3">
                  RINK hosts listings for research advancements, technology licensing opportunities, and instrumentation services provided by research institutions, colleges, and startups.
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong>Information Integrity:</strong> While we list audited profiles, RINK and KSUM do not warrant the commercial viability, patent status, correctness, or scientific completeness of listed technologies.</li>
                  <li><strong>Independent Verification:</strong> Stakeholders and entrepreneurs must carry out their own technical and legal due diligence before initiating technology transfers.</li>
                </ul>
              </div>

              <div>
                <h2 className="font-helios text-2xl font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">
                  3. Limitation of Liability & Government Protection
                </h2>
                <p className="mb-3">
                  RINK acts solely as an enabler and facilitator connecting the academic space to the entrepreneurship ecosystem.
                </p>
                <div className="bg-red-50/50 p-4 rounded-xl border border-red-100 text-slate-700 flex gap-3 items-start">
                  <AlertTriangle className="text-red-500 shrink-0 mt-0.5" size={20} />
                  <p className="text-xs sm:text-sm">
                    <strong>Legal Indemnity:</strong> Under no circumstances shall RINK, Kerala Startup Mission (KSUM), the Department of Electronics & IT, or the Government of Kerala be held liable for any commercial negotiations, patent disputes, contract breaches, or losses arising from subsequent licensing or incubation agreements between users.
                  </p>
                </div>
              </div>

              <div>
                <h2 className="font-helios text-2xl font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">
                  4. Governing Law & Jurisdiction
                </h2>
                <p>
                  Any legal actions, suits, or proceedings relating to this portal shall be governed by Indian laws and fall under the exclusive jurisdiction of the competent courts of Thiruvananthapuram, Kerala, India.
                </p>
              </div>
            </motion.div>
          )}

          {activeTab === 'cookies' && (
            <motion.div
              key="cookies"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-8 font-poppins text-slate-600 leading-relaxed text-sm sm:text-base"
            >
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
                  As described in the Privacy Policy, the RINK portal uses your browser's local cache (LocalStorage) strictly for operational features:
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
            </motion.div>
          )}
        </AnimatePresence>

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
    </div>
  );
}

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#F4F7FB] relative overflow-hidden flex flex-col justify-between">
      <section className="pt-16 pb-24 px-4 md:px-8 max-w-[1400px] mx-auto w-full flex-grow">
        <Suspense fallback={<div className="text-center py-20 text-slate-500 font-poppins">Loading policies...</div>}>
          <PolicyContent />
        </Suspense>
      </section>

      <Footer />
    </main>
  );
}
