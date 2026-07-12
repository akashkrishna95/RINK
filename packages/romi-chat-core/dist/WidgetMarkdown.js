// @ksum/romi-chat-core — in-package markdown renderer with the SAME comparison
// table styling as the host sites' components/RomiAI/ComparisonTable.tsx.
// Ported into the package because packages cannot import from host-app paths;
// visual result is identical, so tables look the same in widgets and portal.
'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
// ---- Comparison table (1:1 port of the site component) ---------------------
function WTable({ children }) {
    return (_jsx("div", { className: "w-full my-4 overflow-x-auto border border-gray-200 rounded-xl shadow-sm bg-white [scrollbar-width:thin] [scrollbar-color:#cbd5e1_#f8fafc]", children: _jsx("table", { className: "w-full text-left border-collapse text-xs text-gray-700 table-auto", children: children }) }));
}
const WThead = ({ children }) => (_jsx("thead", { className: "bg-gradient-to-r from-gray-50 to-slate-100 text-gray-900 border-b border-gray-200 font-semibold", children: children }));
const WTr = ({ children }) => (_jsx("tr", { className: "border-b border-gray-100 last:border-b-0 hover:bg-slate-50/50 transition-colors", children: children }));
const WTh = ({ children }) => (_jsx("th", { className: "px-4 py-3 font-semibold text-[#1b60bb] border-r border-gray-200/60 last:border-r-0 whitespace-normal min-w-[130px] md:min-w-[160px]", children: children }));
const WTd = ({ children }) => (_jsx("td", { className: "px-4 py-3 border-r border-gray-100 last:border-r-0 min-w-[130px] md:min-w-[160px] max-w-[400px] leading-relaxed align-top whitespace-normal break-words", children: children }));
// ---- Full markdown for bot bubbles ------------------------------------------
export function WidgetMarkdown({ text, accentColor = '#1b60bb' }) {
    return (_jsx("div", { className: "text-[13px] leading-relaxed text-gray-800 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0", children: _jsx(ReactMarkdown, { remarkPlugins: [remarkGfm], components: {
                table: ({ children }) => _jsx(WTable, { children: children }),
                thead: ({ children }) => _jsx(WThead, { children: children }),
                tr: ({ children }) => _jsx(WTr, { children: children }),
                th: ({ children }) => _jsx(WTh, { children: children }),
                td: ({ children }) => _jsx(WTd, { children: children }),
                ul: ({ children }) => _jsx("ul", { className: "list-disc pl-5 my-2 space-y-1", children: children }),
                ol: ({ children }) => _jsx("ol", { className: "list-decimal pl-5 my-2 space-y-1", children: children }),
                li: ({ children }) => _jsx("li", { className: "my-0.5", children: children }),
                p: ({ children }) => _jsx("p", { className: "mb-2 last:mb-0 leading-relaxed", children: children }),
                strong: ({ children }) => _jsx("strong", { className: "font-bold", style: { color: accentColor }, children: children }),
                a: ({ href, children }) => (_jsx("a", { href: href, target: "_blank", rel: "noopener noreferrer", className: "font-semibold underline underline-offset-2", style: { color: accentColor }, children: children })),
            }, children: text }) }));
}
