// C:\Users\Akash Krishna\Downloads\RINK KSUM Website\packages\romi-chat-core\src\RomiWidget.tsx
'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
export function RomiWidget(props) {
    const { accentColor = '#1b60bb', avatarSrc, } = props;
    const [showTooltip, setShowTooltip] = useState(true);
    const [isMinimized, setIsMinimized] = useState(false);
    // Do not render the floating widget if the user is on the RomiPortal page
    if (typeof window !== 'undefined' && window.location.pathname.includes('/RomiPortal')) {
        return null;
    }
    return (_jsx("div", { className: "fixed bottom-20 left-4 right-4 md:left-auto md:right-8 md:bottom-24 z-[100] flex flex-col items-end", children: _jsxs("div", { className: "relative flex flex-col items-end z-10", children: [_jsx(AnimatePresence, { children: showTooltip && !isMinimized && (_jsxs(motion.div, { initial: { opacity: 0, y: 10, scale: 0.9 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: 10, scale: 0.9 }, className: "bg-white font-bold text-[10px] md:text-[11px] px-3.5 py-1.5 rounded-t-xl rounded-bl-xl rounded-br-sm shadow-md mb-2 relative mr-3", style: { color: accentColor }, children: ["Don't know where to start?", _jsx("button", { onClick: (e) => {
                                    e.stopPropagation();
                                    setShowTooltip(false);
                                }, className: "absolute -top-2 -right-2 text-white rounded-full p-0.5 shadow-md cursor-pointer flex items-center justify-center", style: { background: accentColor, width: '14px', height: '14px' }, children: _jsxs("svg", { viewBox: "0 0 24 24", width: "8", height: "8", stroke: "currentColor", strokeWidth: "3", fill: "none", strokeLinecap: "round", strokeLinejoin: "round", children: [_jsx("line", { x1: "18", y1: "6", x2: "6", y2: "18" }), _jsx("line", { x1: "6", y1: "6", x2: "18", y2: "18" })] }) })] })) }), _jsxs(motion.button, { drag: "x", dragConstraints: { left: 0, right: 0 }, dragElastic: 0.1, onDragEnd: (_e, info) => {
                        if (info.offset.x > 30) {
                            setIsMinimized(true);
                            setShowTooltip(false);
                        }
                        else if (info.offset.x < -30) {
                            setIsMinimized(false);
                        }
                    }, animate: { x: isMinimized ? 'calc(100% - 28px)' : 0, scale: 1 }, whileHover: { scale: 1.02 }, whileTap: { scale: 0.98 }, onClick: () => {
                        if (isMinimized) {
                            setIsMinimized(false);
                        }
                        else {
                            if (typeof window !== 'undefined') {
                                window.location.href = '/RomiPortal';
                            }
                        }
                    }, className: `relative bg-white text-[#2c3e50] rounded-full ${avatarSrc ? 'pl-[58px] md:pl-[68px]' : 'pl-6'} pr-6 py-2.5 md:py-3 shadow-xl hover:shadow-2xl transition-all border border-gray-100 flex items-center h-[52px] md:h-[58px]`, children: [avatarSrc && (_jsx("div", { className: "absolute -left-6 md:-left-7 bottom-0 w-[82px] h-[105px] md:w-[100px] md:h-[125px] pointer-events-none", children: _jsx("img", { src: avatarSrc, alt: "Romi AI Avatar", className: "w-full h-full object-contain object-bottom drop-shadow-md" }) })), _jsxs("span", { className: "text-[18px] md:text-[20px] font-medium tracking-wide whitespace-nowrap ml-2", children: ["Try our ", _jsx("span", { className: "font-bold", style: { color: accentColor }, children: "Romi" })] })] })] }) }));
}
