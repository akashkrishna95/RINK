'use client';

import React from 'react';

export function TableHead({ children }: { children: React.ReactNode }) {
  return <thead className="bg-[#f8fafc] text-gray-700 font-helios font-bold border-b border-gray-200">{children}</thead>;
}

export function TableRow({ children }: { children: React.ReactNode }) {
  return <tr className="border-b border-gray-100 hover:bg-slate-50/50 transition-colors last:border-0">{children}</tr>;
}

export function TableHeaderCell({ children }: { children: React.ReactNode }) {
  return <th className="px-3 py-2.5 text-[11px] font-bold text-gray-600 uppercase tracking-wider text-left">{children}</th>;
}

export function TableCell({ children }: { children: React.ReactNode }) {
  return <td className="px-3 py-2.5 text-[11px] text-gray-600 leading-normal font-poppins align-top">{children}</td>;
}

export default function ComparisonTable({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full overflow-x-auto my-3 border border-gray-200 rounded-xl bg-white shadow-sm scrollbar-thin">
      <table className="w-full text-left border-collapse text-[11px]">
        {children}
      </table>
    </div>
  );
}
