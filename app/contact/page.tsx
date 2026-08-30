//C:\Users\Akash Krishna\Downloads\RINK KSUM Website\app\contact\page.tsx
'use client';

import { motion } from 'framer-motion';
import { MapPin, Phone, Mail } from 'lucide-react';
import Navbar from '@/HomePage/Navbar';
import Footer from '@/HomePage/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#F4F7FB] relative overflow-hidden flex flex-col justify-between">
      <Navbar />

      <div className="pt-24 pb-0">
        <Breadcrumbs />
      </div>

      <section className="pt-8 pb-24 px-4 md:px-8 max-w-[1400px] mx-auto w-full flex-grow">
        <div className="mb-16 text-center max-w-2xl mx-auto">
          <h1
            className="font-helios text-5xl md:text-6xl lg:text-7xl font-bold text-[#1b60bb] mb-6"
            style={{ fontFamily: "var(--font-helios), sans-serif" }}
          >
            Get in Touch
          </h1>
          <p className="text-slate-500 font-poppins text-sm md:text-base leading-relaxed">
            We are always open to discussing new research collaborations, investment opportunities, and partnerships.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          {/* Google Maps Embed - Order 1 on Mobile, Order 2 on Desktop */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 order-1 lg:order-2 bg-[#F4F7FB] p-4 rounded-[2rem] border border-white/60 shadow-[8px_8px_20px_#c8d0e7,_-8px_-8px_20px_#ffffff] flex"
          >
            <div className="w-full h-[350px] lg:h-[100%] min-h-[350px] lg:min-h-[450px] rounded-2xl overflow-hidden shadow-[inset_4px_4px_10px_#c8d0e7,_inset_-4px_-4px_10px_#ffffff] border border-slate-200/30 flex-grow">
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

          {/* Contact Information Cards - Order 2 on Mobile, Order 1 on Desktop */}
          <div className="lg:col-span-5 order-2 lg:order-1 flex flex-col gap-6 justify-between">
            {/* Call Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-br from-[#fbfcfe] to-[#eaeff7] p-5 sm:p-6 rounded-[2rem] border border-white/60 shadow-[6px_6px_12px_#c8d0e7,_-6px_-6px_12px_#ffffff] flex items-center gap-4 hover:shadow-[3px_3px_6px_#c8d0e7,_-3px_-3px_6px_#ffffff] hover:scale-[1.01] transition-all duration-300 will-change-transform transform-gpu [backface-visibility:hidden]"
            >
              <div className="w-12 h-12 rounded-full bg-[#F4F7FB] flex items-center justify-center shrink-0 border border-white/40 shadow-[inset_2px_2px_5px_#c8d0e7,_inset_-2px_-2px_5px_#ffffff]">
                <Phone size={20} className="text-[#1b60bb]" />
              </div>
              <div className="min-w-0 flex-1">
                <h4
                  className="font-helios text-sm sm:text-base font-bold text-slate-800 mb-0.5"
                  style={{ fontFamily: "var(--font-helios), sans-serif" }}
                >
                  Call Us
                </h4>
                <div className="text-[#1b60bb] font-poppins text-xs xs:text-sm sm:text-base font-medium whitespace-nowrap flex items-center gap-1.5 overflow-hidden">
                  <a href="tel:+914712700270" className="underline decoration-[#1b60bb]/45 underline-offset-4 hover:decoration-[#1b60bb] hover:text-[#1872dd] transition-[color,text-decoration-color] duration-200 truncate">
                    +91 471 2700 270
                  </a>
                  <span className="text-slate-300 shrink-0">|</span>
                  <a href="tel:+914712700271" className="underline decoration-[#1b60bb]/45 underline-offset-4 hover:decoration-[#1b60bb] hover:text-[#1872dd] transition-[color,text-decoration-color] duration-200 truncate">
                    +91 471 2700 271
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Visit Us and Email Grid (2 in a row) */}
            <div className="grid grid-cols-2 gap-4 lg:gap-6 flex-grow">
              {/* Visit Us Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-gradient-to-br from-[#fbfcfe] to-[#eaeff7] p-4 sm:p-6 rounded-[2rem] border border-white/60 shadow-[6px_6px_12px_#c8d0e7,_-6px_-6px_12px_#ffffff] flex flex-col items-center text-center hover:shadow-[3px_3px_6px_#c8d0e7,_-3px_-3px_6px_#ffffff] hover:scale-[1.02] transition-all duration-300 justify-center will-change-transform transform-gpu [backface-visibility:hidden]"
              >
                <div className="w-12 h-12 rounded-full bg-[#F4F7FB] flex items-center justify-center shrink-0 border border-white/40 shadow-[inset_2px_2px_5px_#c8d0e7,_inset_-2px_-2px_5px_#ffffff] mb-3">
                  <MapPin size={20} className="text-[#1b60bb]" />
                </div>
                <h4
                  className="font-helios text-sm sm:text-base font-bold text-slate-800 mb-1.5"
                  style={{ fontFamily: "var(--font-helios), sans-serif" }}
                >
                  Visit Us
                </h4>
                <a
                  href="https://maps.google.com/?q=Kerala+Startup+Mission+Technopark+Campus+Trivandrum"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#1b60bb] hover:underline transition-colors text-[10px] xs:text-xs sm:text-sm font-medium text-slate-600 space-y-0.5 w-full overflow-hidden"
                >
                  <span className="block truncate">Kerala Startup Mission</span>
                  <span className="block truncate">Technopark Campus</span>
                  <span className="block truncate">Trivandrum, Kerala</span>
                </a>
              </motion.div>

              {/* Email Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-gradient-to-br from-[#fbfcfe] to-[#eaeff7] p-4 sm:p-6 rounded-[2rem] border border-white/60 shadow-[6px_6px_12px_#c8d0e7,_-6px_-6px_12px_#ffffff] flex flex-col items-center text-center hover:shadow-[3px_3px_6px_#c8d0e7,_-3px_-3px_6px_#ffffff] hover:scale-[1.02] transition-all duration-300 justify-center will-change-transform transform-gpu [backface-visibility:hidden]"
              >
                <div className="w-12 h-12 rounded-full bg-[#F4F7FB] flex items-center justify-center shrink-0 border border-white/40 shadow-[inset_2px_2px_5px_#c8d0e7,_inset_-2px_-2px_5px_#ffffff] mb-3">
                  <Mail size={20} className="text-[#1b60bb]" />
                </div>
                <h4
                  className="font-helios text-sm sm:text-base font-bold text-slate-800 mb-1.5"
                  style={{ fontFamily: "var(--font-helios), sans-serif" }}
                >
                  Email
                </h4>
                <div className="flex flex-col gap-1 w-full text-[10px] xs:text-xs sm:text-sm font-medium text-[#1b60bb] overflow-hidden">
                  <a href="mailto:rink@startupmission.in" className="underline decoration-[#1b60bb]/45 underline-offset-4 hover:decoration-[#1b60bb] hover:text-[#1872dd] transition-[color,text-decoration-color] duration-200 truncate block">
                    rink@startupmission.in
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
