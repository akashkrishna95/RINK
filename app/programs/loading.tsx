// app/programs/loading.tsx
'use client';

import Navbar from '@/HomePage/Navbar';
import Footer from '@/HomePage/Footer';

export default function ProgramsLoading() {
  return (
    <div className="min-h-screen bg-[#F4F7FB] relative w-full overflow-x-hidden">
      <Navbar />

      {/* Banner Skeleton */}
      <section className="relative w-full h-[400px] flex items-center justify-center overflow-hidden bg-slate-800 animate-pulse">
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-16 w-full flex flex-col items-center">
          <div className="h-16 w-64 bg-slate-700 rounded-2xl mb-6"></div>
          <div className="h-4 w-96 max-w-full bg-slate-700/80 rounded-xl mb-3"></div>
          <div className="h-4 w-80 max-w-full bg-slate-700/80 rounded-xl"></div>
        </div>
      </section>

      {/* Filter and Content Header Skeleton */}
      <section className="pt-12 pb-2 px-4 md:px-8 max-w-[1400px] mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="h-12 w-64 bg-slate-200 rounded-2xl animate-pulse"></div>
          <div className="h-12 w-48 bg-slate-200 rounded-xl animate-pulse"></div>
        </div>
      </section>

      {/* Carousels */}
      <div className="w-full pb-10">
        {/* Upcoming Programs Section */}
        <section className="py-8 px-4 md:px-8 max-w-[1400px] mx-auto">
          <div className="flex items-center gap-4 mb-8 sm:mb-10 animate-pulse">
            <div className="h-8 w-48 bg-slate-200 rounded-xl"></div>
            <div className="h-px bg-slate-200 flex-grow rounded-full"></div>
            <div className="h-8 w-16 bg-slate-200 rounded-full"></div>
          </div>
          <div className="flex gap-5 md:gap-8 overflow-x-hidden pb-6 pt-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100/80 flex flex-col w-[240px] xs:w-[260px] sm:w-[280px] md:w-[300px] shrink-0 h-[480px] animate-pulse"
              >
                <div className="relative w-full aspect-[4/5] bg-slate-200"></div>
                <div className="p-4 sm:p-5 flex flex-col flex-grow space-y-3">
                  <div className="h-6 w-3/4 bg-slate-200 rounded-lg"></div>
                  <div className="space-y-1.5 flex-grow">
                    <div className="h-3 w-full bg-slate-200 rounded"></div>
                    <div className="h-3 w-full bg-slate-200 rounded"></div>
                  </div>
                  <div className="bg-slate-100 rounded-2xl p-4 space-y-2 mt-auto">
                    <div className="h-4 w-full bg-slate-200 rounded-md"></div>
                    <div className="h-4 w-5/6 bg-slate-200 rounded-md"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Current Programs Section */}
        <section className="py-8 px-4 md:px-8 max-w-[1400px] mx-auto">
          <div className="flex items-center gap-4 mb-8 sm:mb-10 animate-pulse">
            <div className="h-8 w-48 bg-slate-200 rounded-xl"></div>
            <div className="h-px bg-slate-200 flex-grow rounded-full"></div>
            <div className="h-8 w-16 bg-slate-200 rounded-full"></div>
          </div>
          <div className="flex gap-5 md:gap-8 overflow-x-hidden pb-6 pt-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100/80 flex flex-col w-[240px] xs:w-[260px] sm:w-[280px] md:w-[300px] shrink-0 h-[480px] animate-pulse"
              >
                <div className="relative w-full aspect-[4/5] bg-slate-200"></div>
                <div className="p-4 sm:p-5 flex flex-col flex-grow space-y-3">
                  <div className="h-6 w-3/4 bg-slate-200 rounded-lg"></div>
                  <div className="space-y-1.5 flex-grow">
                    <div className="h-3 w-full bg-slate-200 rounded"></div>
                    <div className="h-3 w-full bg-slate-200 rounded"></div>
                  </div>
                  <div className="bg-slate-100 rounded-2xl p-4 space-y-2 mt-auto">
                    <div className="h-4 w-full bg-slate-200 rounded-md"></div>
                    <div className="h-4 w-5/6 bg-slate-200 rounded-md"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
