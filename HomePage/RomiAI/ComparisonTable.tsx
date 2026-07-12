// C:\Users\Akash Krishna\Downloads\RINK KSUM Website\HomePage\RomiAI\ComparisonTable.tsx

'use client';

import { ReactNode } from 'react';

export default function ComparisonTable({ children }: { children: ReactNode }) {
  return (
    <div className="w-full my-4 overflow-x-auto border border-gray-200 rounded-xl shadow-sm bg-white [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-slate-50 [&::-webkit-scrollbar-track]:rounded-b-xl [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-slate-300 [scrollbar-width:thin] [scrollbar-color:#cbd5e1_#f8fafc]">
      <table className="w-full text-left border-collapse font-poppins text-xs text-gray-700 table-auto">
        {children}
      </table>
    </div>
  );
}

export function TableHead({ children }: { children: ReactNode }) {
  return <thead className="bg-gradient-to-r from-gray-50 to-slate-100 text-gray-900 border-b border-gray-200 font-semibold">{children}</thead>;
}

export function TableRow({ children }: { children: ReactNode }) {
  return <tr className="border-b border-gray-100 last:border-b-0 hover:bg-slate-50/50 transition-colors">{children}</tr>;
}

export function TableHeaderCell({ children }: { children: ReactNode }) {
  return <th className="px-4 py-3 font-semibold text-[#1b60bb] border-r border-gray-200/60 last:border-r-0 whitespace-nowrap min-w-[120px] first:min-w-[200px]">{children}</th>;
}

export function TableCell({ children }: { children: ReactNode }) {
  return <td className="px-4 py-3 border-r border-gray-100 last:border-r-0 min-w-[120px] first:min-w-[200px] max-w-[300px] leading-relaxed align-top whitespace-normal break-words">{children}</td>;
}