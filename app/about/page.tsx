// C:\Users\Akash Krishna\Downloads\RINK KSUM Website\app\about\page.tsx

'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, FlaskConical, Presentation, FileBadge, Coins, MapPin, Phone, Mail, Building2, Users, Network, Target } from 'lucide-react';
import Navbar from '@/HomePage/Navbar';
import Footer from '@/HomePage/Footer';

export default function AboutRinkPage() {
  const initiatives = [
    {
      id: 'researchpreneurship',
      title: 'Research Incubation Programs',
      description: 'Fostering entrepreneurship among researchers by providing grants, mentorship, and business development support to convert innovative outcomes into commercial products.',
      icon: <FlaskConical size={32} className="text-[#5cc4fe]" />,
      link: '/about/researchpreneurship',
    },
    {
      id: 'demoday',
      title: 'Demo Day & Exposure Visits',
      description: 'Bridging the gap between groundbreaking research and commercial success by connecting innovators directly with industry leaders and deep-tech investors.',
      icon: <Presentation size={32} className="text-[#5cc4fe]" />,
      link: '/about/demoday',
    },
    {
      id: 'iprsupport',
      title: 'IPR Support',
      description: 'Protect, manage, and commercialize your intellectual property with expert guidance, patent filing assistance, and support from RINK partner institutions.',
      icon: <FileBadge size={32} className="text-[#5cc4fe]" />,
      link: '/about/iprsupport',
    },
    {
      id: 'randd',
      title: 'Research & Development Grant',
      description: 'Catalyzing hardware innovation by financially supporting early-stage startups to develop breakthrough, market-ready products and technologies.',
      icon: <Coins size={32} className="text-[#5cc4fe]" />,
      link: '/about/RandD',
    }
  ];

  const features = [
    {
      icon: <Network size={24} className="text-[#1b60bb]" />,
      title: 'Ecosystem Connectivity',
      desc: 'Seamlessly connecting academic researchers with industry stalwarts.'
    },
    {
      icon: <Building2 size={24} className="text-[#1b60bb]" />,
      title: 'Infrastructure Access',
      desc: 'Providing state-of-the-art incubation facilities for deep-tech startups.'
    },
    {
      icon: <Users size={24} className="text-[#1b60bb]" />,
      title: 'Expert Mentorship',
      desc: 'Guidance from seasoned entrepreneurs and scientific experts.'
    },
    {
      icon: <Target size={24} className="text-[#1b60bb]" />,
      title: 'Commercialization',
      desc: 'Transforming patented research into scalable, market-ready products.'
    }
  ];

  return (
    <main className="min-h-screen bg-[#F4F7FB] relative overflow-hidden">
      <Navbar />

      {/* Hero Section with Sarvam.ai-style Indian Pattern Background */}
      <section className="relative pt-32 pb-20 px-4 md:px-8 w-full min-h-[500px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#F4F7FB] via-[#e5eef9] to-[#F4F7FB]">
        {/* Abstract Indian Line Art / Mandala Pattern */}
        <div
          className="absolute inset-0 opacity-[0.08] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M60 0L64.3 22.3C65.5 28.5 70.3 33.3 76.5 34.5L98.8 38.8L76.5 43C70.3 44.2 65.5 49 64.3 55.2L60 77.5L55.7 55.2C54.5 49 49.7 44.2 43.5 43L21.2 38.8L43.5 34.5C49.7 33.3 54.5 28.5 55.7 22.3L60 0Z' fill='%231b60bb' fill-rule='evenodd'/%3E%3C/svg%3E")`,
            backgroundSize: '120px 120px',
            backgroundPosition: 'center'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#F4F7FB] pointer-events-none z-0"></div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 max-w-4xl mx-auto text-center"
        >
          <h1 className="font-helios text-5xl md:text-6xl lg:text-7xl font-bold text-slate-800 mb-8 leading-[1.1]">
            Empowering <span className="text-[#1b60bb]">Research</span>,<br />
            Driving <span className="text-[#5cc4fe]">Innovation</span>.
          </h1>
          <p className="text-lg md:text-xl text-slate-600 font-poppins leading-relaxed max-w-3xl mx-auto">
            Research Innovation Network Kerala (RINK) is a pioneering initiative that transforms breakthrough laboratory research into scalable commercial enterprises.
          </p>
        </motion.div>
      </section>

      {/* Mission Split Section */}
      <section className="py-20 px-4 md:px-8 max-w-[1400px] mx-auto">
        <div className="bg-white rounded-[2.5rem] p-5 md:p-16 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100 flex flex-col lg:flex-row items-center gap-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:w-1/2 space-y-8"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-[2px] bg-[#1b60bb]"></div>
              <span className="text-[#1b60bb] font-helios text-sm font-bold tracking-widest uppercase">Our Mission</span>
            </div>
            <h2 className="font-helios text-3xl md:text-4xl lg:text-5xl font-bold text-slate-800 leading-tight">
              Bridging the gap between <span className="text-[#1b60bb]">academia</span> and <span className="text-[#1b60bb]">industry</span>.
            </h2>
            <p className="text-slate-600 font-poppins text-lg leading-relaxed">
              We empower the research fraternity by providing the necessary resources, mentorship, and funding required to build and scale deep-tech ventures. By cultivating a collaborative ecosystem, we aim to position Kerala as a global hub for research-driven entrepreneurship.
            </p>

            <div className="grid grid-cols-2 gap-6 pt-4">
              <div className="space-y-2">
                <h3 className="font-helios text-4xl font-bold text-[#5cc4fe]">50+</h3>
                <p className="font-poppins text-slate-500 text-sm">Partner Institutions</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-helios text-4xl font-bold text-[#5cc4fe]">100+</h3>
                <p className="font-poppins text-slate-500 text-sm">Patents Commercialized</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:w-1/2 w-full"
          >
            <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80"
                alt="Research Laboratory"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-[#1b60bb]/10 mix-blend-multiply"></div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Core Ecosystem Pillars */}
      <section className="py-20 px-4 md:px-8 max-w-[1400px] mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-helios text-4xl md:text-5xl font-bold text-slate-800 mb-6">The RINK Ecosystem</h2>
          <p className="text-slate-600 font-poppins max-w-2xl mx-auto text-sm sm:text-base">Comprehensive support structures designed to accelerate deep-tech innovation.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100 hover:shadow-lg transition-shadow"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="font-helios text-xl font-bold text-slate-800 mb-3">{feature.title}</h3>
              <p className="text-slate-500 font-poppins text-sm leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Initiatives Grid */}
      <section className="py-24 px-4 md:px-8 max-w-[1400px] mx-auto bg-slate-50 rounded-[3rem] my-20">
        <div className="text-center mb-16">
          <h2 className="font-helios text-4xl md:text-5xl font-bold text-slate-800 mb-6">Our Initiatives</h2>
          <p className="text-slate-600 font-poppins max-w-2xl mx-auto text-sm sm:text-base">Explore the specific programs and grants designed for researchers and startups.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {initiatives.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
            >
              <Link href={item.link} className="block group h-full">
                <div className="relative h-full bg-white rounded-[2rem] p-8 md:p-10 shadow-sm border border-slate-100 hover:border-[#5cc4fe]/50 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-start justify-between mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:bg-blue-50 transition-colors">
                      {item.icon}
                    </div>
                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-[#1b60bb] transition-colors">
                      <ArrowRight size={20} className="text-slate-400 group-hover:text-white transition-colors" />
                    </div>
                  </div>

                  <h3 className="font-helios text-2xl md:text-3xl font-bold text-slate-800 mb-4 group-hover:text-[#1b60bb] transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-slate-600 font-poppins text-base leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Clean Premium Contact Section with Map */}
      <section id="contact" className="py-24 px-4 md:px-8 max-w-[1400px] mx-auto border-t border-slate-200">
        <div className="mb-16">
          <h2 className="font-helios text-4xl md:text-5xl font-bold text-slate-800 mb-6">Get in Touch</h2>
          <p className="text-slate-600 font-poppins text-lg max-w-2xl">
            We are always open to discussing new research collaborations, investment opportunities, and partnerships.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Contact Information Cards */}
          <div className="lg:col-span-5 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex items-start gap-6 hover:shadow-md transition-shadow"
            >
              <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                <MapPin size={24} className="text-[#1b60bb]" />
              </div>
              <div>
                <h4 className="font-helios text-xl font-bold text-slate-800 mb-2">Visit Us</h4>
                <p className="text-slate-600 font-poppins leading-relaxed">
                  Kerala Startup Mission<br />
                  Technopark Campus, Karyavattom,<br />
                  Trivandrum, Kerala 695581
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex items-start gap-6 hover:shadow-md transition-shadow"
            >
              <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                <Mail size={24} className="text-[#1b60bb]" />
              </div>
              <div>
                <h4 className="font-helios text-xl font-bold text-slate-800 mb-2">Email</h4>
                <p className="text-slate-600 font-poppins leading-relaxed">
                  rink@startupmission.in<br />
                  info@startupmission.in
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex items-start gap-6 hover:shadow-md transition-shadow"
            >
              <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                <Phone size={24} className="text-[#1b60bb]" />
              </div>
              <div>
                <h4 className="font-helios text-xl font-bold text-slate-800 mb-2">Call</h4>
                <p className="text-slate-600 font-poppins leading-relaxed">
                  +91 471 2700 270<br />
                  Mon - Fri, 9:00 AM - 6:00 PM
                </p>
              </div>
            </motion.div>
          </div>

          {/* Google Maps Embed */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-7 bg-white p-4 rounded-3xl shadow-sm border border-slate-100"
          >
            <div className="w-full h-[400px] lg:h-[100%] min-h-[400px] rounded-2xl overflow-hidden bg-slate-100">
              <iframe
                src="https://maps.google.com/maps?q=Kerala+Startup+Mission+(KSUM),+Thiruvananthapuram&t=&z=16&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
