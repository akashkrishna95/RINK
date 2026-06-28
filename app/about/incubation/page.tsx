'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, CheckCircle2, UserCheck, Search, Lightbulb, FileText, TrendingUp, MapPin, Award, BookOpen, Rocket, Users } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

function AnimatedCounter({ end, suffix = "+" }: { end: number, suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const duration = 2000;
      const increment = end / (duration / 16);
      
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.ceil(start));
        }
      }, 16);
      return () => clearInterval(timer);
    }
  }, [isInView, end]);

  return <span ref={ref}>{count}{suffix}</span>;
}

export default function IncubationPage() {
  return (
    <main className="min-h-screen bg-[#F4F7FB] overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative w-full h-[500px] flex items-center justify-center overflow-hidden">
        {/* Background Image & Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80')" }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#010101]/95 via-[#011a38]/80 to-[#1b60bb]/70"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-helios font-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white mb-6 leading-tight"
          >
            Research Incubation Programs
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-white/90 font-poppins leading-relaxed max-w-3xl mx-auto"
          >
            Structured incubation programs to support researchers, faculty, and scientists in transforming breakthrough ideas into scalable ventures. These programs offer a guided pathway from research validation to commercialization, backed by funding and expert mentorship.
          </motion.p>
        </div>
      </section>

      {/* Researchpreneurship Validation Program */}
      <section className="py-20 px-4 md:px-8 max-w-[1400px] mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center bg-white rounded-3xl p-5 md:p-12 shadow-sm border border-slate-100">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative h-[400px] rounded-2xl overflow-hidden shadow-lg"
          >
            <div 
              className="absolute inset-0 bg-cover bg-center hover:scale-105 transition-transform duration-700"
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80')" }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col justify-center"
          >
            <h2 className="font-helios text-3xl md:text-4xl font-bold text-[#1b60bb] mb-3">
              Researchpreneurship
            </h2>
            <h3 className="text-xl font-semibold text-slate-800 mb-6 font-poppins">
              A Virtual Research Idea Validation Programme
            </h3>
            
            <p className="text-slate-600 leading-relaxed mb-4 text-[17px]">
              A virtual one-on-one programme designed to help researchers validate their ideas and explore their commercial potential. Through personalized sessions, participants receive expert guidance to validate their innovation and understand the next steps towards entrepreneurship.
            </p>
            <p className="text-slate-600 leading-relaxed mb-8 text-[17px]">
              This programme also introduces researchers to the support ecosystem of Kerala Startup Mission (KSUM), including funding, incubation, and startup services.
            </p>

            <a 
              href="https://ksum.in/rinkregistration" 
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-[#1b60bb] text-white px-8 py-4 rounded-xl font-semibold hover:bg-[#154a93] transition-colors w-fit shadow-md hover:shadow-lg"
            >
              Book Your Slots <ArrowRight size={20} />
            </a>
          </motion.div>
        </div>
      </section>

      {/* Impact Metrics */}
      <section className="py-16 md:py-24 bg-[#011a38] text-white overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&q=80')] opacity-5 bg-cover bg-center"></div>
        <div className="max-w-[1200px] mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className="font-helios text-3xl md:text-4xl font-bold text-[#5cc4fe] mb-4">Impact Metrics</h2>
            <p className="text-white/80 font-poppins max-w-2xl mx-auto">Driving real-world innovation through structured support and dedicated mentorship.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { target: 30, label: 'Research Ideas Onboarded', icon: <Lightbulb size={40} className="text-[#5cc4fe] mb-4" /> },
              { target: 15, label: 'Patents Filing Supported', icon: <Award size={40} className="text-[#5cc4fe] mb-4" /> },
              { target: 10, label: 'Startups Created', icon: <Rocket size={40} className="text-[#5cc4fe] mb-4" /> }
            ].map((stat, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white/10 backdrop-blur-md rounded-3xl p-8 flex flex-col items-center justify-center text-center border border-white/10 hover:bg-white/15 transition-colors"
              >
                {stat.icon}
                <div className="font-helios text-5xl md:text-6xl font-black text-white mb-2">
                  <AnimatedCounter end={stat.target} />
                </div>
                <div className="text-lg text-white/90 font-poppins font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Past Cohorts */}
      <section className="py-20 px-4 md:px-8 max-w-[1400px] mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-helios text-3xl md:text-4xl font-bold text-[#1b60bb] mb-4">Completed Cohorts</h2>
          <p className="text-slate-600 font-poppins max-w-2xl mx-auto text-lg">Partnering with leading institutions to nurture deep-tech entrepreneurship.</p>
        </div>
        
        <div className="space-y-16">
          {/* MG University Cohort */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid lg:grid-cols-2 gap-10 items-center bg-white rounded-3xl p-5 md:p-8 shadow-sm border border-slate-100 hover:shadow-lg transition-shadow"
          >
            <div className="relative h-[300px] md:h-[400px] w-full rounded-2xl overflow-hidden group">
              <img 
                src="https://rink.startupmission.in/img/0.jpg" 
                alt="Research Incubation Programme"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
              />
            </div>
            <div>
              <div className="bg-blue-50 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                <BookOpen size={24} className="text-[#1b60bb]" />
              </div>
              <h3 className="font-helios text-2xl md:text-3xl font-bold text-slate-800 mb-4">Research Incubation Programme</h3>
              <p className="text-[#1b60bb] font-semibold mb-4 text-sm bg-blue-50 px-3 py-1 rounded-full inline-block">Partner: Mahatma Gandhi University</p>
              <p className="text-slate-600 leading-relaxed text-lg">
                Kerala Startup Mission, in partnership with Mahatma Gandhi University, Kottayam, has successfully completed a Research Incubation Programme Cohort from July 2022 to September 2023. The program aimed at fostering entrepreneurship among researchers and supporting the conversion of innovative research outcomes into commercial products, technologies, or services. Through this cohort, twenty-four researchers received startup grant support, mentorship, incubation, and business development support.
              </p>
            </div>
          </motion.div>

          {/* Sahrdaya College Cohort */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid lg:grid-cols-2 gap-10 items-center bg-white rounded-3xl p-5 md:p-8 shadow-sm border border-slate-100 hover:shadow-lg transition-shadow"
          >
            <div className="order-2 lg:order-1">
              <div className="bg-purple-50 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                <Users size={24} className="text-purple-600" />
              </div>
              <h3 className="font-helios text-2xl md:text-3xl font-bold text-slate-800 mb-4">Research Innovation Programme for Women Startups</h3>
              <p className="text-purple-600 font-semibold mb-4 text-sm bg-purple-50 px-3 py-1 rounded-full inline-block">Partner: Sahrdaya College of Engineering and Technology</p>
              <p className="text-slate-600 leading-relaxed text-lg">
                Kerala Startup Mission, in partnership with Sahrdaya College of Engineering and Technology, has successfully completed the 'Research Innovation Programme for Women Startups'. This sector-specific cohort was aimed at fostering research-driven entrepreneurship among women innovators. The program supported seven selected women researchers from the Biotechnology and Biomedical Engineering sectors who are solving real-world problems through cutting-edge research and technology.
              </p>
            </div>
            <div className="relative h-[300px] md:h-[400px] w-full rounded-2xl overflow-hidden group order-1 lg:order-2">
              <img 
                src="https://rink.startupmission.in/img/IMG-20241202-WA0011.jpg" 
                alt="Women Startups Programme"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Startups Created */}
      <section className="py-20 bg-slate-50 border-y border-slate-200">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 text-center">
          <h2 className="font-helios text-3xl md:text-4xl font-bold text-slate-800 mb-4">
            Startups created from<br/>Research Innovation and Incubation Program
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 mt-12">
            {[
              { name: "BMS Cloud Campus LLP", img: "https://rink.startupmission.in/img/2025-07-21%2015_46_46" },
              { name: "Levare Biosolutions", img: "https://rink.startupmission.in/img/2025-07-21%2015_52_15" },
              { name: "Statoberry LLP", img: "https://rink.startupmission.in/img/2025-07-21%2015_53_17" },
              { name: "Uniwo Naturals Pvt. Ltd.", img: "https://rink.startupmission.in/img/UniwoNaturals" },
              { name: "YGENR Tech Solutions Pvt. Ltd", img: "https://rink.startupmission.in/img/YGENR" },
              { name: "Shelt Innovation Pvt. Ltd.", img: "https://rink.startupmission.in/img/Group%20189.png" }
            ].map((startup, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="flex flex-col items-center group cursor-pointer"
              >
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 w-full aspect-square flex items-center justify-center mb-4 group-hover:shadow-md group-hover:-translate-y-1 transition-all overflow-hidden">
                  <img src={startup.img} alt={startup.name} className="max-w-full max-h-full object-contain" />
                </div>
                <div className="font-poppins font-medium text-slate-700 text-sm md:text-base leading-tight">
                  {startup.name}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Grid Features: Who Can Apply & What You'll Gain */}
      <section className="py-24 px-4 md:px-8 max-w-[1400px] mx-auto">
        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* Who Can Apply */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#011a38] text-white rounded-3xl p-8 md:p-12 shadow-xl relative overflow-hidden"
          >
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-[#1b60bb]/20 rounded-full blur-3xl"></div>
            
            <h2 className="font-helios text-3xl md:text-4xl font-bold mb-10 relative z-10 flex items-center gap-4">
              <UserCheck className="text-[#5cc4fe]" size={36} />
              Who Can Apply?
            </h2>
            
            <div className="space-y-6 relative z-10">
              {[
                "Research scholars, faculty & Scientists",
                "Individuals from an academic or research institution",
                "R&D based startups seeking academic partnerships or technology transfers."
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="mt-1 flex-shrink-0 bg-white/10 p-1.5 rounded-full">
                    <CheckCircle2 size={20} className="text-[#5cc4fe]" />
                  </div>
                  <p className="text-lg text-white/90 leading-relaxed">{item}</p>
                </div>
              ))}
            </div>

            <div className="mt-12 relative z-10">
              <a 
                href="https://ksum.in/rinkregistration" 
                target="_blank"
                rel="noreferrer"
                className="inline-block bg-white text-[#011a38] px-8 py-4 rounded-xl font-bold hover:bg-[#eff9ff] transition-colors shadow-lg"
              >
                Apply Now
              </a>
            </div>
          </motion.div>

          {/* What You'll Gain */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, delay: 0.1 }}
            className="bg-white rounded-3xl p-8 md:p-12 shadow-md border border-slate-100"
          >
            <h2 className="font-helios text-3xl md:text-4xl font-bold text-[#1b60bb] mb-10 flex items-center gap-4">
              <TrendingUp className="text-[#1b60bb]" size={36} />
              What You’ll Gain?
            </h2>
            
            <div className="space-y-6">
              {[
                { icon: <Lightbulb size={24} className="text-blue-500"/>, text: "Personalized feedback on your research idea." },
                { icon: <Search size={24} className="text-blue-500"/>, text: "Clarity on commercialization and market fit." },
                { icon: <FileText size={24} className="text-blue-500"/>, text: "Awareness of KSUM support schemes (grants, incubation, IP support, etc.)." },
                { icon: <MapPin size={24} className="text-blue-500"/>, text: "A structured roadmap for your startup journey." }
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-4 group">
                  <div className="mt-1 bg-blue-50 p-2.5 rounded-xl group-hover:bg-blue-100 transition-colors flex-shrink-0">
                    {item.icon}
                  </div>
                  <p className="text-lg text-slate-700 leading-relaxed pt-1.5">{item.text}</p>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </section>

      <Footer />
    </main>
  );
}
