//C:\Users\Akash Krishna\Downloads\RINK KSUM Website\app\RomiPortal\RomiPortalFeatures\RomiFeatures.tsx

'use client';

import { CheckCircle2, TrendingUp, Award, ArrowRight } from 'lucide-react';

export default function RomiFeatures() {
  return (
    <div className="flex flex-col gap-6 w-full">
      
      {/* Top Row: Tech Match & Progress Tracker */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Technology Match Score */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col items-center justify-center">
          <h4 className="font-helios font-bold text-gray-800 mb-4 w-full text-left">Technology Match Score</h4>
          
          <div className="relative w-32 h-32 flex items-center justify-center">
            {/* Simple SVG Gauge */}
            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
              <circle 
                cx="50" cy="50" r="40" 
                fill="transparent" 
                stroke="#f3f4f6" 
                strokeWidth="12"   
                strokeDasharray="251.2" 
                strokeDashoffset="0"
              />
              <circle 
                cx="50" cy="50" r="40" 
                fill="transparent" 
                stroke="#10b981" 
                strokeWidth="12" 
                strokeDasharray="251.2" 
                strokeDashoffset={251.2 * (1 - 0.78)} 
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="font-helios font-bold text-3xl text-gray-800">78%</span>
            </div>
          </div>
          
          <p className="font-montserrat text-sm text-gray-600 mt-4 text-center">
            This technology is <strong className="text-green-600">78% aligned</strong> with current market demand.
          </p>
        </div>

        {/* Progress Tracker */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col justify-center">
          <h4 className="font-helios font-bold text-gray-800 mb-6">ResearchPreneurship Flow</h4>
          
          <div className="flex items-center justify-between mb-4">
            <span className="font-montserrat text-sm font-semibold text-[#1b60bb]">Stage 3 of 8</span>
            <span className="text-xs text-gray-400 font-montserrat">Market Analysis</span>
          </div>
          
          <div className="flex items-center gap-1 mb-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((step) => (
              <div 
                key={step} 
                className={`h-2 flex-1 rounded-full ${
                  step < 3 ? 'bg-green-500' : 
                  step === 3 ? 'bg-[#1b60bb] animate-pulse' : 
                  'bg-gray-100'
                }`}
              />
            ))}
          </div>
          
          <div className="flex items-center gap-3 text-sm text-gray-600 font-montserrat">
            <CheckCircle2 size={16} className="text-green-500" /> Ideation
            <div className="w-4 border-t border-gray-300"></div>
            <CheckCircle2 size={16} className="text-green-500" /> IP Check
            <div className="w-4 border-t border-gray-300"></div>
            <span className="font-semibold text-[#1b60bb]">Market Analysis</span>
          </div>
        </div>

      </div>

      {/* KSUM Program Matcher */}
      <div className="bg-gradient-to-br from-blue-50 to-[#FDFDF9] rounded-2xl border border-blue-100 p-6 shadow-sm">
        <h4 className="font-helios font-bold text-[#1b60bb] mb-2 flex items-center gap-2">
          <Award size={20} />
          KSUM Program Eligibility
        </h4>
        <p className="font-montserrat text-sm text-gray-600 mb-6">
          Based on your assessment, your research qualifies for the following Kerala Startup Mission programs:
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 border border-green-100 shadow-sm relative overflow-hidden group hover:border-green-300 transition-colors">
            <div className="absolute top-0 right-0 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg">High Match</div>
            <h5 className="font-helios font-bold text-gray-800 mb-1">ResearchPreneurship</h5>
            <p className="text-xs text-gray-500 font-montserrat mb-3">Turn your lab research into a viable startup.</p>
            <a href="#" className="text-[#1b60bb] text-xs font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">Apply Now <ArrowRight size={12}/></a>
          </div>
          
          <div className="bg-white rounded-xl p-4 border border-blue-100 shadow-sm relative overflow-hidden group hover:border-blue-300 transition-colors">
            <div className="absolute top-0 right-0 bg-blue-400 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg">Match</div>
            <h5 className="font-helios font-bold text-gray-800 mb-1">YIP</h5>
            <p className="text-xs text-gray-500 font-montserrat mb-3">Young Innovators Program funding.</p>
            <a href="#" className="text-[#1b60bb] text-xs font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">Learn More <ArrowRight size={12}/></a>
          </div>

          <div className="bg-white rounded-xl p-4 border border-yellow-100 shadow-sm relative overflow-hidden group hover:border-yellow-300 transition-colors">
            <div className="absolute top-0 right-0 bg-yellow-400 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg">Partial Match</div>
            <h5 className="font-helios font-bold text-gray-800 mb-1">IdeaBox</h5>
            <p className="text-xs text-gray-500 font-montserrat mb-3">Early stage idea validation program.</p>
            <a href="#" className="text-[#1b60bb] text-xs font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">Explore <ArrowRight size={12}/></a>
          </div>
        </div>
      </div>
      
    </div>
  );
}
