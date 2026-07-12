// C:\Users\Akash Krishna\Downloads\RINK KSUM Website\packages\romi-chat-core\src\RomiWidget.tsx
'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, ArrowUpRight, Plus } from 'lucide-react';
import { useRomi } from './useRomi';
import { WidgetMarkdown } from './WidgetMarkdown';
import { DEFAULT_PORTAL_URL } from './types';
function WidgetBubble({ sender, text, isNew, onComplete, accentColor }) {
    const [displayed, setDisplayed] = useState(sender === 'bot' && isNew ? '' : text);
    const hasHeavyMarkdown = /\n\s*\|/.test(text) || /\n\s*[-*] /.test(text) || text.length > 500;
    useEffect(() => {
        if (sender === 'bot' && isNew && !hasHeavyMarkdown) {
            setDisplayed('');
            let i = 0;
            const timer = setInterval(() => {
                i += 4;
                setDisplayed(text.slice(0, i));
                if (i >= text.length) {
                    clearInterval(timer);
                    onComplete?.();
                }
            }, 16);
            return () => clearInterval(timer);
        }
        setDisplayed(text);
        if (sender === 'bot' && isNew)
            onComplete?.();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [text, sender, isNew, hasHeavyMarkdown]);
    if (sender === 'user') {
        return (_jsx("div", { className: "p-3.5 rounded-2xl shadow-sm leading-relaxed text-[13px] whitespace-pre-line break-words bg-gradient-to-r from-[#1b60bb] to-[#1872dd] text-white self-end rounded-tr-none w-fit max-w-full", children: text }));
    }
    return (_jsx("div", { className: "p-3.5 rounded-2xl shadow-sm bg-[#f4f7fb] self-start rounded-tl-none border border-[#e1eaf4] w-full max-w-[90%] min-w-0", children: _jsx(WidgetMarkdown, { text: displayed, accentColor: accentColor }) }));
}
function WidgetCard({ tech, href, accent }) {
    // THE FIX: Grab the description and strip out any ugly Vector DB artifacts
    let cleanDesc = tech.brief_description_abstract || tech.description || tech.problem_solved || '';
    // This removes the "Technology: Name. Sector: Food. Description: " string if it exists
    cleanDesc = cleanDesc.replace(/^Technology:.*?Sector:.*?Description:\s*/i, '').trim();
    return (_jsx("a", { href: href, className: "block w-full no-underline", children: _jsxs("div", { className: "bg-white border border-gray-200 rounded-xl p-3 shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-3 group", children: [_jsx("div", { className: "flex-shrink-0 w-14 h-14 bg-gray-50 rounded-lg overflow-hidden border border-gray-100", children: tech.image_url ? (_jsx("img", { src: tech.image_url, alt: "", className: "w-full h-full object-cover" })) : (_jsx("div", { className: "w-full h-full flex items-center justify-center font-bold text-lg", style: { background: `${accent}0d`, color: accent }, children: tech.technology_name?.charAt(0) || 'T' })) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex justify-between items-start gap-2", children: [_jsx("h4", { className: "font-bold text-xs text-gray-900 leading-snug truncate", children: tech.technology_name }), _jsx(ArrowUpRight, { size: 13, className: "text-gray-400 flex-shrink-0 mt-0.5" })] }), _jsx("p", { className: "text-[10px] text-gray-500 font-medium truncate", children: tech.institution }), cleanDesc && (_jsx("p", { className: "text-[10.5px] text-gray-600 mt-1 mb-1.5 leading-snug line-clamp-2", children: cleanDesc })), _jsxs("div", { className: "flex gap-1.5 mt-1 flex-wrap", children: [tech.technology_id && (_jsx("span", { className: "text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-blue-50 text-[#1b60bb] border border-blue-100", children: tech.technology_id })), tech.trl && (_jsxs("span", { className: "text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-600", children: ["TRL ", String(tech.trl).replace(/^TRL\s*/i, '')] })), tech.patent_status && (_jsx("span", { className: "text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-100", children: tech.patent_status.length > 25 ? tech.patent_status.substring(0, 25) + '...' : tech.patent_status }))] })] })] }) }));
}
export function RomiWidget(props) {
    const { apiUrl, siteContext, welcomeMessage, starterChips, subtitle = 'Research Assistant', accentColor = '#1b60bb', portalUrl = DEFAULT_PORTAL_URL, onRedirectToPortal, technologyHref = (t) => `/technologies/${t.technology_id}`, avatarSrc, renderTechnologyCard, } = props;
    const [isOpen, setIsOpen] = useState(false);
    const [showTooltip, setShowTooltip] = useState(true);
    const [isMinimized, setIsMinimized] = useState(false);
    const [inputText, setInputText] = useState('');
    const [showThinkingPulse, setShowThinkingPulse] = useState(false);
    const messagesEndRef = useRef(null);
    const pulseTimer = useRef(null);
    const { messages, isTyping, sendMessage, clearChat } = useRomi({ apiUrl, siteContext, welcomeMessage });
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);
    useEffect(() => {
        if (isTyping) {
            pulseTimer.current = setTimeout(() => setShowThinkingPulse(true), 2000);
        }
        else {
            if (pulseTimer.current)
                clearTimeout(pulseTimer.current);
            setShowThinkingPulse(false);
        }
        return () => { if (pulseTimer.current)
            clearTimeout(pulseTimer.current); };
    }, [isTyping]);
    const handleRedirect = (url) => {
        const target = url || portalUrl;
        if (onRedirectToPortal)
            onRedirectToPortal(target);
        else if (typeof window !== 'undefined')
            window.open(target, '_blank', 'noopener');
    };
    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!inputText.trim() || isTyping)
            return;
        sendMessage(inputText.trim());
        setInputText('');
    };
    const Avatar = ({ className }) => avatarSrc ? (_jsx("img", { src: avatarSrc, alt: "Romi", className: className })) : (_jsx("div", { className: "w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-sm flex-shrink-0", style: { background: accentColor }, children: "R" }));
    // Do not render the floating widget if the user is on the RomiPortal page
    if (typeof window !== 'undefined' && window.location.pathname.includes('/RomiPortal')) {
        return null;
    }
    return (_jsxs("div", { className: "fixed bottom-6 left-4 right-4 md:left-auto md:right-8 md:bottom-8 z-[100] flex flex-col items-end", children: [_jsx(AnimatePresence, { children: isOpen && (_jsxs(motion.div, { initial: { opacity: 0, y: 20, scale: 0.95 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: 20, scale: 0.95 }, className: "mb-4 w-full sm:w-[500px] md:w-[600px] lg:w-[45vw] lg:max-w-[700px] h-[70vh] max-h-[70vh] sm:h-[650px] sm:max-h-[80vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-gray-200 origin-bottom-right z-20", children: [_jsxs("div", { className: "p-4 flex items-center justify-between shadow-sm z-10", style: { background: `linear-gradient(90deg, ${accentColor}, #1872dd)` }, children: [_jsxs("div", { className: "flex items-center gap-3", children: [avatarSrc && (_jsx("div", { className: "w-10 h-10 overflow-visible relative flex-shrink-0", children: _jsx("img", { src: avatarSrc, alt: "Romi", className: "w-full h-full object-contain object-bottom scale-125" }) })), _jsxs("div", { children: [_jsx("h3", { className: "text-white font-bold text-lg leading-tight tracking-wide", children: "Romi AI" }), _jsx("p", { className: "text-white/80 text-[11px] font-medium tracking-wider uppercase mt-0.5", children: subtitle })] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsxs("button", { type: "button", onClick: clearChat, className: "text-white/95 hover:text-white transition-all bg-white/10 hover:bg-white/20 px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer shadow-sm hover:scale-[1.02] active:scale-[0.98] border border-white/5", children: [_jsx(Plus, { size: 14, strokeWidth: 2.5 }), _jsx("span", { children: "New Chat" })] }), _jsx("button", { type: "button", onClick: () => setIsOpen(false), className: "text-white/80 hover:text-white transition-colors bg-white/10 hover:bg-white/20 p-1.5 rounded-full cursor-pointer", children: _jsx(X, { size: 18 }) })] })] }), _jsxs("div", { className: "flex-1 bg-[#f8fafd] p-4 flex flex-col overflow-y-auto relative", children: [_jsx("div", { className: "absolute inset-0 z-0 opacity-[0.03]", style: { backgroundImage: `radial-gradient(${accentColor} 1px, transparent 1px)`, backgroundSize: '24px 24px' } }), _jsxs("div", { className: "relative z-10 flex-1 flex flex-col justify-start space-y-4", children: [messages.map((msg, index) => {
                                            const isUserMsg = msg.sender === 'user';
                                            return (_jsxs("div", { className: `flex flex-col ${isUserMsg ? 'items-end self-end max-w-[85%]' : 'items-start self-start max-w-[90%] mt-2'}`, children: [_jsxs("div", { className: `flex items-start gap-2.5 ${isUserMsg ? 'flex-row-reverse w-fit' : 'w-full'}`, children: [msg.sender === 'bot' && (_jsx("div", { className: "w-8 h-8 overflow-visible flex-shrink-0 relative", children: _jsx(Avatar, { className: "w-full h-full object-contain object-top" }) })), _jsx(WidgetBubble, { sender: msg.sender, text: msg.text, accentColor: accentColor, isNew: msg.sender === 'bot' && index === messages.length - 1 && index > 0, onComplete: () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }) })] }), msg.sender === 'bot' && index === 0 && messages.length === 1 && (_jsx("div", { className: "grid grid-cols-2 gap-2 mt-4 ml-10 w-[calc(100%-40px)]", children: starterChips.map((card, cIdx) => (_jsxs("button", { onClick: () => sendMessage(card.query), className: "p-2.5 bg-white hover:bg-[#e1eaf4] border border-gray-200 text-left rounded-xl transition-all shadow-sm cursor-pointer", children: [_jsx("p", { className: "font-medium text-[11px] leading-tight", style: { color: accentColor }, children: card.label }), _jsx("span", { className: "text-[9px] text-gray-400 block mt-1", children: "Tap to ask" })] }, cIdx))) })), msg.technologies && msg.technologies.length > 0 && (_jsx("div", { className: "flex flex-col gap-3 mt-2 ml-10 w-[calc(100%-40px)]", children: msg.technologies.slice(0, 5).map((tech) => (_jsx(React.Fragment, { children: renderTechnologyCard
                                                                ? renderTechnologyCard(tech)
                                                                : _jsx(WidgetCard, { tech: tech, href: technologyHref(tech), accent: accentColor }) }, tech.technology_id))) })), msg.redirectUrl && (_jsx("button", { onClick: () => handleRedirect(msg.redirectUrl), className: "mt-3 ml-10 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-sm transition-transform hover:scale-[1.02]", style: { background: accentColor }, children: "Continue in Romi Portal \u2192" })), msg.sender === 'bot' && index === messages.length - 1 && (msg.suggestions?.length ?? 0) > 0 && (_jsx("div", { className: "flex flex-wrap gap-2 mt-3 ml-10 w-[calc(100%-40px)]", children: msg.suggestions.map((s, si) => (_jsxs("button", { onClick: () => sendMessage(s), className: "bg-white border border-gray-200 hover:bg-[#e1eaf4] rounded-full px-3 py-1.5 text-[11px] font-semibold shadow-sm transition-colors", style: { color: accentColor }, children: ["\u2192 ", s] }, si))) }))] }, index));
                                        }), isTyping && (_jsxs("div", { className: "flex items-start gap-2.5 max-w-[85%] self-start mt-2", children: [_jsx("div", { className: "w-8 h-8 overflow-visible flex-shrink-0 relative", children: _jsx(Avatar, { className: "w-full h-full object-contain object-top" }) }), _jsx("div", { className: "bg-white p-3.5 rounded-2xl rounded-tl-sm shadow-sm border border-[#e1eaf4] flex items-center gap-2", children: showThinkingPulse ? (_jsxs("div", { className: "flex items-center gap-2 animate-pulse text-xs font-semibold", style: { color: accentColor }, children: [_jsx("span", { className: "w-2 h-2 rounded-full animate-ping", style: { background: accentColor } }), "Thinking..."] })) : (_jsx("div", { className: "flex gap-1.5", children: [0, 150, 300].map((d) => (_jsx("span", { className: "w-1.5 h-1.5 rounded-full animate-bounce", style: { background: accentColor, animationDelay: `${d}ms` } }, d))) })) })] })), _jsx("div", { ref: messagesEndRef })] })] }), _jsxs("form", { onSubmit: handleSendMessage, className: "p-3 sm:p-4 bg-white border-t border-gray-100 z-10", children: [_jsxs("div", { className: "bg-gray-50 border border-gray-200 rounded-full pl-3 pr-1 py-1 sm:pl-4 sm:pr-1.5 sm:py-1.5 flex items-center gap-2", children: [_jsx("input", { type: "text", value: inputText, onChange: (e) => setInputText(e.target.value), placeholder: "Ask me anything...", className: "flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder:text-gray-400" }), _jsx("button", { type: "submit", disabled: !inputText.trim() || isTyping, className: "flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 text-white rounded-full transition-colors disabled:opacity-50 flex items-center justify-center", style: { background: accentColor }, children: _jsx(Send, { size: 16, className: "w-3.5 h-3.5 sm:w-4 sm:h-4 translate-x-[0.5px]" }) })] }), _jsx("p", { className: "text-[9px] text-center text-gray-400 mt-2", children: "AI guidance only. KSUM is not liable for financial decisions \u2014 verify with institutions." })] })] })) }), _jsxs("div", { className: "relative flex flex-col items-end z-10", children: [_jsx(AnimatePresence, { children: showTooltip && !isOpen && (_jsxs(motion.div, { initial: { opacity: 0, y: 10, scale: 0.9 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: 10, scale: 0.9 }, className: "bg-white font-bold text-[10px] md:text-[11px] px-3.5 py-1.5 rounded-t-xl rounded-bl-xl rounded-br-sm shadow-md mb-2 relative mr-3", style: { color: accentColor }, children: ["Don't know where to start?", _jsx("button", { onClick: (e) => { e.stopPropagation(); setShowTooltip(false); }, className: "absolute -top-2 -right-2 text-white rounded-full p-0.5 shadow-md", style: { background: accentColor }, children: _jsx(X, { size: 8, strokeWidth: 3 }) })] })) }), _jsxs(motion.button, { drag: "x", dragConstraints: { left: 0, right: 0 }, dragElastic: 0.1, onDragEnd: (_e, info) => {
                            if (info.offset.x > 30) {
                                setIsMinimized(true);
                                setIsOpen(false);
                                setShowTooltip(false);
                            }
                            else if (info.offset.x < -30)
                                setIsMinimized(false);
                        }, animate: { x: isMinimized ? 'calc(100% - 28px)' : 0, scale: 1 }, whileHover: { scale: 1.02 }, whileTap: { scale: 0.98 }, onClick: () => {
                            if (isMinimized) {
                                setIsMinimized(false);
                                setIsOpen(true);
                            }
                            else
                                setIsOpen(!isOpen);
                            setShowTooltip(false);
                        }, className: `relative bg-white text-[#2c3e50] rounded-full ${avatarSrc ? 'pl-[58px] md:pl-[68px]' : 'pl-6'} pr-6 py-2.5 md:py-3 shadow-xl hover:shadow-2xl transition-all border border-gray-100 flex items-center h-[52px] md:h-[58px]`, children: [avatarSrc && (_jsx("div", { className: "absolute -left-6 md:-left-7 bottom-0 w-[82px] h-[105px] md:w-[100px] md:h-[125px] pointer-events-none", children: _jsx("img", { src: avatarSrc, alt: "Romi AI Avatar", className: "w-full h-full object-contain object-bottom drop-shadow-md" }) })), _jsxs("span", { className: "text-[18px] md:text-[20px] font-medium tracking-wide whitespace-nowrap ml-2", children: ["Try our ", _jsx("span", { className: "font-bold", style: { color: accentColor }, children: "Romi" })] })] })] })] }));
}
