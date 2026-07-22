// C:\Users\Akash Krishna\Downloads\RINK KSUM Website\HomePage\RomiAI\ComparisonTable.tsx

'use client';

import React, { ReactNode } from 'react';

export default function ComparisonTable({ children }: { children: ReactNode }) {
  return (
    <div className="w-full my-4 overflow-x-auto border border-gray-200/80 dark:border-white/[0.1] rounded-2xl shadow-lg bg-white/80 dark:bg-[#1a1a1a]/80 backdrop-blur-2xl relative group overflow-hidden">
      {/* Top glass shine */}
      <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/[0.08] via-white/[0.02] to-transparent pointer-events-none" />
      <table className="w-full text-left border-collapse font-sans text-xs text-gray-800 dark:text-gray-200 relative z-10">
        {children}
      </table>
    </div>
  );
}

export function TableHead({ children }: { children: ReactNode }) {
  return <thead className="bg-gray-100/90 dark:bg-[#1a1a1a]/95 text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-white/[0.1] font-semibold">{children}</thead>;
}

export function TableRow({ children }: { children: ReactNode }) {
  return <tr className="border-b border-gray-100 dark:border-white/[0.06] last:border-b-0 hover:bg-slate-50/60 dark:hover:bg-white/[0.04] transition-colors">{children}</tr>;
}

export function TableHeaderCell({ children }: { children: ReactNode }) {
  return <th className="px-3 sm:px-4 py-3 font-semibold text-[#1b60bb] dark:text-[#7dd3fc] border-r border-gray-200/60 dark:border-white/[0.08] last:border-r-0 bg-gray-100/90 dark:bg-[#1a1a1a]/95">{children}</th>;
}

export function TableCell({ children }: { children: ReactNode }) {
  return <td className="px-3 sm:px-4 py-3 border-r border-gray-100 dark:border-white/[0.06] last:border-r-0 leading-relaxed align-top whitespace-normal break-words">{children}</td>;
}