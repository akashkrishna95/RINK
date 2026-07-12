// @ksum/romi-chat-core — in-package markdown renderer with the SAME comparison
// table styling as the host sites' components/RomiAI/ComparisonTable.tsx.
// Ported into the package because packages cannot import from host-app paths;
// visual result is identical, so tables look the same in widgets and portal.

'use client';

import React, { ReactNode } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// ---- Comparison table (1:1 port of the site component) ---------------------
function WTable({ children }: { children: ReactNode }) {
  return (
    <div className="w-full my-4 overflow-x-auto border border-gray-200 rounded-xl shadow-sm bg-white [scrollbar-width:thin] [scrollbar-color:#cbd5e1_#f8fafc]">
      <table className="w-full text-left border-collapse text-xs text-gray-700 table-auto">
        {children}
      </table>
    </div>
  );
}
const WThead = ({ children }: { children: ReactNode }) => (
  <thead className="bg-gradient-to-r from-gray-50 to-slate-100 text-gray-900 border-b border-gray-200 font-semibold">{children}</thead>
);
const WTr = ({ children }: { children: ReactNode }) => (
  <tr className="border-b border-gray-100 last:border-b-0 hover:bg-slate-50/50 transition-colors">{children}</tr>
);
const WTh = ({ children }: { children: ReactNode }) => (
  <th className="px-4 py-3 font-semibold text-[#1b60bb] border-r border-gray-200/60 last:border-r-0 whitespace-normal min-w-[130px] md:min-w-[160px]">{children}</th>
);
const WTd = ({ children }: { children: ReactNode }) => (
  <td className="px-4 py-3 border-r border-gray-100 last:border-r-0 min-w-[130px] md:min-w-[160px] max-w-[400px] leading-relaxed align-top whitespace-normal break-words">{children}</td>
);

// ---- Full markdown for bot bubbles ------------------------------------------
export function WidgetMarkdown({ text, accentColor = '#1b60bb' }: { text: string; accentColor?: string }) {
  return (
    <div className="text-[13px] leading-relaxed text-gray-800 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          table: ({ children }) => <WTable>{children}</WTable>,
          thead: ({ children }) => <WThead>{children}</WThead>,
          tr: ({ children }) => <WTr>{children}</WTr>,
          th: ({ children }) => <WTh>{children}</WTh>,
          td: ({ children }) => <WTd>{children}</WTd>,
          ul: ({ children }) => <ul className="list-disc pl-5 my-2 space-y-1">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal pl-5 my-2 space-y-1">{children}</ol>,
          li: ({ children }) => <li className="my-0.5">{children}</li>,
          p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
          strong: ({ children }) => <strong className="font-bold" style={{ color: accentColor }}>{children}</strong>,
          a: ({ href, children }) => (
            <a href={href} target="_blank" rel="noopener noreferrer"
              className="font-semibold underline underline-offset-2" style={{ color: accentColor }}>
              {children}
            </a>
          ),
        }}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
}
