'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Home, ArrowRight } from 'lucide-react';
import Navbar from '@/HomePage/Navbar';
import Footer from '@/HomePage/Footer';

export default function NotFound() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(6);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  return (
    <main className="min-h-screen bg-[#F4F7FB] flex flex-col justify-between overflow-x-hidden text-slate-800">
      <Navbar />

      <section className="flex-grow flex items-center justify-center pt-32 pb-20 px-4 md:px-8">
        <div className="max-w-xl w-full mx-auto text-center flex flex-col items-center">
          
          {/* 404 Heading & Clean Text */}
          <div className="relative mb-4">
            <p className="text-[#1b60bb] text-xs sm:text-sm font-semibold tracking-widest uppercase mb-2">
              404 - Page Not Found
            </p>
            
            <h1 className="font-helios text-7xl sm:text-8xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-br from-[#1b60bb] via-[#153156] to-[#0099ff] tracking-tight drop-shadow-sm select-none leading-none">
              404
            </h1>
          </div>

          <h2 className="font-helios text-2xl sm:text-3xl md:text-4xl font-bold text-slate-800 mb-3 leading-snug">
            Lost in the Ecosystem?
          </h2>

          <p className="text-slate-500 font-poppins text-xs sm:text-sm md:text-base max-w-md mx-auto mb-8 leading-relaxed">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-md justify-center mb-6">
            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full bg-[#1b60bb] hover:bg-[#153156] text-white text-xs sm:text-sm font-semibold shadow-[0_4px_14px_rgba(27,96,187,0.3)] hover:shadow-[0_6px_20px_rgba(27,96,187,0.4)] transition-all duration-200 active:scale-95"
            >
              <Home size={16} />
              <span>Return to Homepage</span>
            </Link>

            <Link
              href="/programs"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white hover:bg-slate-50 text-slate-700 hover:text-[#1b60bb] border border-slate-200 text-xs sm:text-sm font-medium shadow-xs transition-all duration-200 active:scale-95"
            >
              <span>Explore Programs</span>
              <ArrowRight size={15} />
            </Link>
          </div>

          {/* Clean Countdown Text */}
          <p className="text-xs sm:text-sm text-slate-400 font-poppins">
            Auto-redirecting to homepage in <strong className="text-[#1b60bb] font-semibold">{countdown}s</strong>...
          </p>

        </div>
      </section>

      <Footer />
    </main>
  );
}
