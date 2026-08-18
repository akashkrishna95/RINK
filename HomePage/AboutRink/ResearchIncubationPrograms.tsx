//C:\Users\Akash Krishna\Downloads\RINK KSUM Website\HomePage\AboutRink\ResearchIncubationPrograms.tsx

'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, CheckCircle2, UserCheck, Search, Lightbulb, FileText, TrendingUp, MapPin, Award, BookOpen, Rocket, Users } from 'lucide-react';
import Navbar from '@/HomePage/Navbar';
import Footer from '@/HomePage/Footer';
import { getProxiedImageUrl } from '@/lib/utils';
import { useRealTimeSync } from '@/hooks/useRealTimeSync';
import { pb, mapPbStartup, Startup } from '@/lib/pocketbase';

function AnimatedCounter({ end, suffix = "+" }: { end: number, suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const duration = 2000;
      const stepTime = 33; // ~30fps for CPU efficiency on mobile
      const increment = end / (duration / stepTime);

      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.ceil(start));
        }
      }, stepTime);
      return () => clearInterval(timer);
    }
  }, [isInView, end]);

  return <span ref={ref}>{count}{suffix}</span>;
}

// Startup interface imported from '@/lib/pocketbase'

function StartupCard({ startup, idx }: { startup: Startup; idx: number }) {
  const [imgError, setImgError] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: idx * 0.05 }}
      className="flex flex-col items-center group cursor-pointer"
    >
      <div className="bg-white p-2 sm:p-4 rounded-2xl shadow-sm border border-slate-200 w-full aspect-square flex items-center justify-center mb-2 sm:mb-4 group-hover:shadow-md group-hover:-translate-y-1 transition-all overflow-hidden select-none">
        {startup.logoUrl && !imgError ? (
          <img
            src={getProxiedImageUrl(startup.logoUrl)}
            alt={startup.name}
            loading="lazy"
            decoding="async"
            className="max-w-full max-h-full object-contain"
            onError={() => setImgError(true)}
          />
        ) : (
          <span className="font-poppins font-bold text-[#1b60bb] text-center text-[10px] sm:text-sm px-1 leading-snug break-words">
            {startup.name}
          </span>
        )}
      </div>
      <div className="font-poppins font-medium text-slate-700 text-[10px] sm:text-sm md:text-base leading-tight text-center">
        {startup.name}
      </div>
    </motion.div>
  );
}

export default function ResearchIncubationPrograms({ initialStartups }: { initialStartups: Startup[] }) {
  const startups = useRealTimeSync<Startup>(
    'startups',
    initialStartups || [],
    mapPbStartup
  );
  const loading = false;

  return (
    <main className="min-h-screen bg-[#F4F7FB] overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative w-full h-[400px] sm:h-[450px] md:h-[500px] flex items-center justify-center overflow-hidden">
        {/* Background Image & Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/researchpreneurship/hero.png')" }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#010101]/95 via-[#011a38]/80 to-[#1b60bb]/35"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto mt-12 sm:mt-16">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-helios font-black text-[36px] xs:text-[42px] sm:text-4xl md:text-5xl lg:text-6xl text-white mb-4 sm:mb-6 leading-tight"
          >
            <span className="block sm:inline whitespace-nowrap">Research <span className="text-[#5cc4fe]">Incubation</span></span>{' '}
            <span className="block sm:inline">Programs</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xs xs:text-sm md:text-base text-white/90 font-poppins leading-relaxed max-w-3xl mx-auto text-center px-4"
          >
            Structured incubation and funding programs to guide researchers from breakthrough ideas to scalable commercial ventures.
          </motion.p>
        </div>
      </section>

      {/* Researchpreneurship Validation Program */}
      <section className="py-12 sm:py-20 px-4 md:px-8 max-w-[1400px] mx-auto">
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-12 items-center bg-white rounded-3xl p-4 sm:p-8 md:p-12 shadow-sm border border-slate-100">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative w-full h-[220px] sm:h-[300px] md:h-[400px] rounded-2xl overflow-hidden shadow-lg"
          >
            <div
              className="absolute inset-0 bg-cover bg-center hover:scale-105 transition-transform duration-700"
              style={{ backgroundImage: "url('/images/researchpreneurship/72.jpg')" }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col justify-center"
          >
            <h2 className="font-helios text-2xl sm:text-3xl md:text-4xl font-bold text-[#1b60bb] mb-2 sm:mb-3">
              Researchpreneurship
            </h2>
            <h3 className="text-base sm:text-lg md:text-xl font-semibold text-slate-800 mb-4 sm:mb-6 font-poppins">
              A Virtual Research Idea Validation Programme
            </h3>

            <p className="text-slate-600 leading-relaxed mb-4 text-xs sm:text-sm md:text-base">
              A virtual one-on-one programme designed to help researchers validate their ideas and explore their commercial potential. Through personalized sessions, participants receive expert guidance to validate their innovation and understand the next steps towards entrepreneurship.
            </p>
            <p className="text-slate-600 leading-relaxed mb-6 sm:mb-8 text-xs sm:text-sm md:text-base">
              This programme also introduces researchers to the support ecosystem of Kerala Startup Mission (KSUM), including funding, incubation, and startup services.
            </p>

            <a
              href="https://ksum.in/rinkregistration"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-[#1b60bb] text-white px-5 py-3 sm:px-8 sm:py-4 rounded-xl font-semibold hover:bg-[#154a93] transition-colors w-fit shadow-md hover:shadow-lg text-xs sm:text-sm md:text-base"
            >
              Book Your Slots <ArrowRight size={18} />
            </a>
          </motion.div>
        </div>
      </section>

      {/* Grid Features: Who Can Apply & What You'll Gain */}
      <section className="py-12 sm:py-20 px-4 md:px-8 max-w-[1400px] mx-auto">
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">

          {/* What You'll Gain */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl p-6 sm:p-8 md:p-12 shadow-md border border-slate-100"
          >
            <h2 className="font-helios text-2xl sm:text-3xl md:text-4xl font-bold text-[#1b60bb] mb-6 sm:mb-10 flex items-center gap-3 sm:gap-4">
              <TrendingUp className="text-[#1b60bb] w-7 h-7 sm:w-9 sm:h-9" />
              What You’ll Gain?
            </h2>

            <div className="space-y-4 sm:space-y-6">
              {[
                { icon: <Lightbulb className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />, text: "Personalized feedback on your research idea." },
                { icon: <Search className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />, text: "Clarity on commercialization and market fit." },
                { icon: <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />, text: "Awareness of KSUM support schemes (Funds, incubation, IP support, etc.)." },
                { icon: <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />, text: "A structured roadmap for your startup journey." }
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-3 sm:gap-4 group">
                  <div className="mt-1 bg-blue-50 p-2 sm:p-2.5 rounded-xl group-hover:bg-blue-100 transition-colors flex-shrink-0">
                    {item.icon}
                  </div>
                  <p className="text-xs sm:text-sm md:text-base lg:text-lg text-slate-700 leading-relaxed pt-1 sm:pt-1.5">{item.text}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Who Can Apply */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-[#011a38] text-white rounded-3xl p-6 sm:p-8 md:p-12 shadow-xl relative overflow-hidden"
          >
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-[#1b60bb]/20 rounded-full blur-3xl"></div>

            <h2 className="font-helios text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-10 relative z-10 flex items-center gap-3 sm:gap-4 text-[#5cc4fe]">
              <UserCheck className="text-[#5cc4fe] w-7 h-7 sm:w-9 sm:h-9" />
              Who Can Apply?
            </h2>

            <div className="space-y-4 sm:space-y-6 relative z-10">
              {[
                "Research scholars, faculty & Scientists",
                "Individuals from an academic or research institution",
                "R&D based startups seeking academic partnerships or technology transfers."
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-3 sm:gap-4">
                  <div className="mt-1 flex-shrink-0 bg-white/10 p-1 sm:p-1.5 rounded-full">
                    <CheckCircle2 size={16} className="text-[#5cc4fe] sm:w-[20px] sm:h-[20px]" />
                  </div>
                  <p className="text-xs sm:text-sm md:text-base lg:text-lg text-white/90 leading-relaxed">{item}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 sm:mt-12 relative z-10">
              <a
                href="https://ksum.in/rinkregistration"
                target="_blank"
                rel="noreferrer"
                className="inline-block bg-white text-[#011a38] px-6 py-3 sm:px-8 sm:py-4 rounded-xl font-bold hover:bg-[#eff9ff] transition-colors shadow-lg text-xs sm:text-sm md:text-base"
              >
                Apply Now
              </a>
            </div>
          </motion.div>

        </div>
      </section>

      {/* Impact Metrics Wrapper */}
      <div className="bg-[#011a38]">
        {/* Impact Metrics Heading Area */}
        <section className="bg-[#F4F7FB] pt-12 sm:pt-16 md:pt-20 pb-16 sm:pb-20 md:pb-24 text-center rounded-b-[3rem] md:rounded-b-[4rem] px-4 md:px-8">
          <div className="max-w-[1200px] mx-auto">
            <h2 className="font-helios text-3xl sm:text-4xl md:text-5xl font-bold text-[#1b60bb] mb-3 sm:mb-4">Impact Metrics</h2>
            <p className="text-slate-600 font-poppins max-w-2xl mx-auto text-xs sm:text-sm md:text-base">
              Driving real-world innovation through structured support and dedicated mentorship.
            </p>
          </div>
        </section>

        {/* Impact Metrics Cards Area */}
        <section className="relative w-full bg-[#011a38] text-white pt-12 sm:pt-16 pb-12 sm:pb-16 md:pb-24 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('/images/researchpreneurship/pattern.jpg')] opacity-5 bg-cover bg-center"></div>
          <div className="max-w-[1200px] mx-auto px-4 relative z-20">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {[
                { target: 30, label: 'Research Ideas Onboarded', icon: <Lightbulb className="w-8 h-8 sm:w-10 sm:h-10 text-[#5cc4fe] mb-2 sm:mb-4" /> },
                { target: 15, label: 'Patents Filing Supported', icon: <Award className="w-8 h-8 sm:w-10 sm:h-10 text-[#5cc4fe] mb-2 sm:mb-4" /> },
                { target: 10, label: 'Startups Created', icon: <Rocket className="w-8 h-8 sm:w-10 sm:h-10 text-[#5cc4fe] mb-2 sm:mb-4" /> }
              ].map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className={`bg-white/10 backdrop-blur-md rounded-3xl p-4 sm:p-6 md:p-8 flex flex-col items-center justify-center text-center border border-white/10 hover:bg-white/15 transition-colors
                    ${idx === 2 ? 'col-span-2 md:col-span-1' : 'col-span-1'}
                  `}
                >
                  {stat.icon}
                  <div className="font-helios text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-2">
                    <AnimatedCounter end={stat.target} />
                  </div>
                  <div className="text-xs sm:text-sm md:text-base lg:text-lg text-white/90 font-poppins font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Past Cohorts */}
      <section className="py-12 sm:py-20 px-4 md:px-8 max-w-[1400px] mx-auto">
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="font-helios text-3xl sm:text-4xl md:text-5xl font-bold text-[#1b60bb] mb-3 sm:mb-4">Completed Cohorts</h2>
          <p className="text-slate-600 font-poppins max-w-2xl mx-auto text-xs sm:text-sm md:text-base">Partnering with leading institutions to nurture deep-tech entrepreneurship.</p>
        </div>

        <div className="space-y-12 sm:space-y-16">
          {/* MG University Cohort */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid lg:grid-cols-2 gap-6 sm:gap-10 items-center bg-white rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm border border-slate-100 hover:shadow-lg transition-shadow"
          >
           <div className="relative h-[200px] sm:h-[300px] md:h-[400px] w-full rounded-2xl overflow-hidden group">
              <img
                src="/images/researchpreneurship/mg_uni.jpg"
                alt="Research Incubation Programme"
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div>
              <div className="bg-blue-50 w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-4 sm:mb-6">
                <BookOpen size={20} className="text-[#1b60bb] sm:w-[24px] sm:h-[24px]" />
              </div>
              <h3 className="font-helios text-xl sm:text-2xl md:text-3xl font-bold text-slate-800 mb-2 sm:mb-4">Research Incubation Programme</h3>
              <p className="text-[#1b60bb] font-semibold mb-3 sm:mb-4 text-xs sm:text-sm bg-blue-50 px-3 py-1 rounded-full inline-block">Partner: Mahatma Gandhi University</p>
              <p className="text-slate-600 leading-relaxed text-xs sm:text-sm md:text-base">
                Kerala Startup Mission, in partnership with Mahatma Gandhi University, Kottayam, has successfully completed a Research Incubation Programme Cohort from July 2022 to September 2023. The program aimed at fostering entrepreneurship among researchers and supporting the conversion of innovative research outcomes into commercial products, technologies, or services. Through this cohort, twenty-four researchers received startup grant support, mentorship, incubation, and business development support.
              </p>
            </div>
          </motion.div>

          {/* Sahrdaya College Cohort */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid lg:grid-cols-2 gap-6 sm:gap-10 items-center bg-white rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm border border-slate-100 hover:shadow-lg transition-shadow"
          >
            <div className="order-2 lg:order-1">
              <div className="bg-purple-50 w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-4 sm:mb-6">
                <Users size={20} className="text-purple-600 sm:w-[24px] sm:h-[24px]" />
              </div>
              <h3 className="font-helios text-xl sm:text-2xl md:text-3xl font-bold text-slate-800 mb-2 sm:mb-4">Research Innovation Programme for Women Startups</h3>
              <p className="text-purple-600 font-semibold mb-3 sm:mb-4 text-xs sm:text-sm bg-purple-50 px-3 py-1 rounded-full inline-block">Partner: Sahrdaya College of Engineering and Technology</p>
              <p className="text-slate-600 leading-relaxed text-xs sm:text-sm md:text-base">
                Kerala Startup Mission, in partnership with Sahrdaya College of Engineering and Technology, has successfully completed the 'Research Innovation Programme for Women Startups'. This sector-specific cohort was aimed at fostering research-driven entrepreneurship among women innovators. The program supported seven selected women researchers from the Biotechnology and Biomedical Engineering sectors who are solving real-world problems through cutting-edge research and technology.
              </p>
            </div>
            <div className="relative h-[200px] sm:h-[300px] md:h-[400px] w-full rounded-2xl overflow-hidden group">
              <img
                src="/images/researchpreneurship/sahrdaya.jpg"
                alt="Research Incubation Programme"
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Startups Created */}
      {!loading && startups.length > 0 && (
        <section className="py-12 sm:py-20 bg-slate-50 border-y border-slate-200">
          <div className="max-w-[1200px] mx-auto px-4 md:px-8 text-center">
            <h2 className="font-helios text-2xl sm:text-3xl md:text-4xl font-bold text-slate-800 mb-3 sm:mb-4">
              Startups created from<br />Research Innovation and Incubation Program
            </h2>
            <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-6 mt-6 sm:mt-12">
              {startups.map((startup, idx) => (
                <StartupCard key={idx} startup={startup} idx={idx} />
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
}
