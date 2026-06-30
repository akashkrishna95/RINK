//C:\Users\Akash Krishna\Downloads\RINK KSUM Website\components\RomiAI\ComparisonTable.tsx

'use client';

import { ReactNode } from 'react';

export default function ComparisonTable({ children }: { children: ReactNode }) {
  return (
    <div className="w-full my-4 overflow-x-auto border border-gray-200 rounded-xl shadow-sm bg-white">
      <table className="w-full text-left border-collapse font-poppins text-xs text-gray-700 min-w-[500px]">
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
  return <th className="p-3 font-semibold text-[#1b60bb] border-r border-gray-200/60 last:border-r-0">{children}</th>;
}

export function TableCell({ children }: { children: ReactNode }) {
  return <td className="p-3 border-r border-gray-100 last:border-r-0 max-w-[200px] leading-relaxed vertical-top">{children}</td>;
}
