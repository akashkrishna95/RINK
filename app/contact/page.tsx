'use client';

import { motion } from 'framer-motion';
import { MapPin, Phone, Mail } from 'lucide-react';
import Navbar from '@/HomePage/Navbar';
import Footer from '@/HomePage/Footer';

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#F4F7FB] relative overflow-hidden flex flex-col justify-between">
      <Navbar />

      <section className="pt-32 pb-24 px-4 md:px-8 max-w-[1400px] mx-auto w-full flex-grow">
        <div className="mb-16 text-center max-w-2xl mx-auto">
          <h1 
            className="font-helios text-4xl md:text-5xl lg:text-6xl font-bold text-[#1b60bb] mb-6"
            style={{ fontFamily: "var(--font-helios), sans-serif" }}
          >
            Get in Touch
          </h1>
          <p className="text-slate-600 font-poppins text-base md:text-lg">
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
                <h4 
                  className="font-helios text-xl font-bold text-slate-800 mb-2"
                  style={{ fontFamily: "var(--font-helios), sans-serif" }}
                >
                  Visit Us
                </h4>
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
                <h4 
                  className="font-helios text-xl font-bold text-slate-800 mb-2"
                  style={{ fontFamily: "var(--font-helios), sans-serif" }}
                >
                  Email
                </h4>
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
                <h4 
                  className="font-helios text-xl font-bold text-slate-800 mb-2"
                  style={{ fontFamily: "var(--font-helios), sans-serif" }}
                >
                  Call
                </h4>
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
