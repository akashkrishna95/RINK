'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { RefreshCw, Home } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Fatal Global Error:', error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-[#F4F7FB] flex items-center justify-center p-4 font-sans text-slate-800">
        <div className="max-w-md w-full text-center flex flex-col items-center bg-white p-8 sm:p-10 rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-slate-100">
          <p className="text-[#1b60bb] text-xs font-semibold tracking-widest uppercase mb-2">
            System Error
          </p>

          <h1 className="text-4xl font-bold text-slate-900 mb-3">
            Something Went Wrong
          </h1>

          <p className="text-slate-500 text-sm mb-8 leading-relaxed">
            A critical error occurred while loading the application. Please reload or retry the connection.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
            <button
              onClick={() => reset()}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#1b60bb] text-white text-sm font-semibold shadow-md hover:bg-[#153156] transition-colors cursor-pointer"
            >
              <RefreshCw size={14} />
              <span>Retry</span>
            </button>

            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-slate-100 text-slate-700 text-sm font-medium hover:bg-slate-200 transition-colors"
            >
              <Home size={14} />
              <span>Home</span>
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
