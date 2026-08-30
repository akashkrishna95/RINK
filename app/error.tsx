'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { RefreshCw, Home, ServerCrash } from 'lucide-react';
import Navbar from '@/HomePage/Navbar';
import Footer from '@/HomePage/Footer';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to console or error reporting service
    console.error('Database/Server Error:', error);
  }, [error]);

  return (
    <main className="min-h-screen bg-[#F4F7FB] flex flex-col justify-between overflow-x-hidden text-slate-800">
      <Navbar />

      <section className="flex-grow flex items-center justify-center pt-32 pb-20 px-4 md:px-8">
        <div className="max-w-xl w-full mx-auto text-center flex flex-col items-center">
          
          {/* Status Label & Code */}
          <div className="relative mb-4">
            <p className="text-[#1b60bb] text-xs sm:text-sm font-semibold tracking-widest uppercase mb-2">
              500 - Server / Database Error
            </p>
            
            <h1 className="font-helios text-7xl sm:text-8xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-br from-[#1b60bb] via-[#153156] to-[#0099ff] tracking-tight drop-shadow-sm select-none leading-none">
              500
            </h1>
          </div>

          <h2 className="font-helios text-2xl sm:text-3xl md:text-4xl font-bold text-slate-800 mb-3 leading-snug">
            Database Connection Error
          </h2>

          <p className="text-slate-500 font-poppins text-xs sm:text-sm md:text-base max-w-md mx-auto mb-8 leading-relaxed">
            We encountered an unexpected issue while fetching records from the database or server. Please try again.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-md justify-center mb-6">
            <button
              onClick={() => reset()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full bg-[#1b60bb] hover:bg-[#153156] text-white text-xs sm:text-sm font-semibold shadow-[0_4px_14px_rgba(27,96,187,0.3)] hover:shadow-[0_6px_20px_rgba(27,96,187,0.4)] transition-all duration-200 active:scale-95 cursor-pointer"
            >
              <RefreshCw size={15} />
              <span>Retry Request</span>
            </button>

            <button
              onClick={() => {
                window.location.href = '/';
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white hover:bg-slate-50 text-slate-700 hover:text-[#1b60bb] border border-slate-200 text-xs sm:text-sm font-medium shadow-xs transition-all duration-200 active:scale-95 cursor-pointer"
            >
              <Home size={15} />
              <span>Return to Homepage</span>
            </button>
          </div>

          {error?.digest && (
            <p className="text-[11px] text-slate-400 font-mono">
              Error Digest: {error.digest}
            </p>
          )}

        </div>
      </section>

      <Footer />
    </main>
  );
}
