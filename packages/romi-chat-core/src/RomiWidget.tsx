// C:\Users\Akash Krishna\Downloads\RINK KSUM Website\packages\romi-chat-core\src\RomiWidget.tsx
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, ArrowUpRight, Plus } from 'lucide-react';
import { useRomi } from './useRomi';
import { WidgetMarkdown } from './WidgetMarkdown';
import type { RomiWidgetConfig, Technology } from './types';
import { DEFAULT_PORTAL_URL } from './types';

export interface RomiWidgetProps extends RomiWidgetConfig {
  avatarSrc?: string;
  renderTechnologyCard?: (tech: Technology) => React.ReactNode;
}

function WidgetBubble({ sender, text, isNew, onComplete, accentColor }: {
  sender: 'bot' | 'user'; text: string; isNew?: boolean; onComplete?: () => void; accentColor?: string;
}) {
  const [displayed, setDisplayed] = useState(sender === 'bot' && isNew ? '' : text);
  const hasHeavyMarkdown = /\n\s*\|/.test(text) || /\n\s*[-*] /.test(text) || text.length > 500;

  useEffect(() => {
    if (sender === 'bot' && isNew && !hasHeavyMarkdown) {
      setDisplayed('');
      let i = 0;
      const timer = setInterval(() => {
        i += 4;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) { clearInterval(timer); onComplete?.(); }
      }, 16);
      return () => clearInterval(timer);
    }
    setDisplayed(text);
    if (sender === 'bot' && isNew) onComplete?.();
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, sender, isNew, hasHeavyMarkdown]); 

  if (sender === 'user') {
    return (
      <div className="p-3.5 rounded-2xl shadow-sm leading-relaxed text-[13px] whitespace-pre-line break-words bg-gradient-to-r from-[#1b60bb] to-[#1872dd] text-white self-end rounded-tr-none w-fit max-w-full">
        {text}
      </div>
    );
  }
  return (
    <div className="p-3.5 rounded-2xl shadow-sm bg-[#f4f7fb] self-start rounded-tl-none border border-[#e1eaf4] w-full max-w-[90%] min-w-0">
      <WidgetMarkdown text={displayed} accentColor={accentColor} />
    </div>
  );
}

function WidgetCard({ tech, href, accent }: { tech: Technology; href: string; accent: string }) {
  // THE FIX: Grab the description and strip out any ugly Vector DB artifacts
  let cleanDesc = (tech as any).brief_description_abstract || (tech as any).description || (tech as any).problem_solved || '';
  
  // This removes the "Technology: Name. Sector: Food. Description: " string if it exists
  cleanDesc = cleanDesc.replace(/^Technology:.*?Sector:.*?Description:\s*/i, '').trim();

  return (
    <a href={href} className="block w-full no-underline">
      <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-3 group">
        <div className="flex-shrink-0 w-14 h-14 bg-gray-50 rounded-lg overflow-hidden border border-gray-100">
          {tech.image_url ? (
            <img src={tech.image_url} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center font-bold text-lg"
              style={{ background: `${accent}0d`, color: accent }}>
              {tech.technology_name?.charAt(0) || 'T'}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start gap-2">
            <h4 className="font-bold text-xs text-gray-900 leading-snug truncate">{tech.technology_name}</h4>
            {/* @ts-ignore */}
            <ArrowUpRight size={13} className="text-gray-400 flex-shrink-0 mt-0.5" />
          </div>
          <p className="text-[10px] text-gray-500 font-medium truncate">{tech.institution}</p>
          
          {/* THE FIX: Pure description rendered with CSS Line Clamp (no JS slicing) */}
          {cleanDesc && (
            <p className="text-[10.5px] text-gray-600 mt-1 mb-1.5 leading-snug line-clamp-2">
              {cleanDesc}
            </p>
          )}

          <div className="flex gap-1.5 mt-1 flex-wrap">
            {tech.technology_id && (
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-blue-50 text-[#1b60bb] border border-blue-100">
                {tech.technology_id}
              </span>
            )}
            {tech.trl && (
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-600">
                TRL {String(tech.trl).replace(/^TRL\s*/i, '')}
              </span>
            )}
            {tech.patent_status && (
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-100">
                {tech.patent_status.length > 25 ? tech.patent_status.substring(0, 25) + '...' : tech.patent_status}
              </span>
            )}
          </div>
        </div>
      </div>
    </a>
  );
}

export function RomiWidget(props: RomiWidgetProps) {
  const {
    apiUrl, siteContext, welcomeMessage, starterChips,
    subtitle = 'Research Assistant',
    accentColor = '#1b60bb',
    portalUrl = DEFAULT_PORTAL_URL,
    onRedirectToPortal,
    technologyHref = (t: Technology) => `/technologies/${t.technology_id}`,
    avatarSrc,
    renderTechnologyCard,
  } = props;

  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputText, setInputText] = useState('');
  const [showThinkingPulse, setShowThinkingPulse] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pulseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { messages, isTyping, sendMessage, clearChat } = useRomi({ apiUrl, siteContext, welcomeMessage });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    if (isTyping) {
      pulseTimer.current = setTimeout(() => setShowThinkingPulse(true), 2000);
    } else {
      if (pulseTimer.current) clearTimeout(pulseTimer.current);
      setShowThinkingPulse(false);
    }
    return () => { if (pulseTimer.current) clearTimeout(pulseTimer.current); };
  }, [isTyping]);

  const handleRedirect = (url?: string) => {
    const target = url || portalUrl;
    if (onRedirectToPortal) onRedirectToPortal(target);
    else if (typeof window !== 'undefined') window.open(target, '_blank', 'noopener');
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isTyping) return;
    sendMessage(inputText.trim());
    setInputText('');
  };

  const Avatar = ({ className }: { className: string }) =>
    avatarSrc ? (
      <img src={avatarSrc} alt="Romi" className={className} />
    ) : (
      <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-sm flex-shrink-0"
        style={{ background: accentColor }}>R</div>
    );

  // Do not render the floating widget if the user is on the RomiPortal page
  if (typeof window !== 'undefined' && window.location.pathname.includes('/RomiPortal')) {
    return null;
  }

  return (
    <div className="fixed bottom-6 left-4 right-4 md:left-auto md:right-8 md:bottom-8 z-[100] flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4 w-full sm:w-[500px] md:w-[600px] lg:w-[45vw] lg:max-w-[700px] h-[70vh] max-h-[70vh] sm:h-[650px] sm:max-h-[80vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-gray-200 origin-bottom-right z-20"
          >
            <div className="p-4 flex items-center justify-between shadow-sm z-10"
              style={{ background: `linear-gradient(90deg, ${accentColor}, #1872dd)` }}>
              <div className="flex items-center gap-3">
                {avatarSrc && (
                  <div className="w-10 h-10 overflow-visible relative flex-shrink-0">
                    <img src={avatarSrc} alt="Romi" className="w-full h-full object-contain object-bottom scale-125" />
                  </div>
                )}
                <div>
                  <h3 className="text-white font-bold text-lg leading-tight tracking-wide">Romi AI</h3>
                  <p className="text-white/80 text-[11px] font-medium tracking-wider uppercase mt-0.5">{subtitle}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={clearChat}
                  className="text-white/95 hover:text-white transition-all bg-white/10 hover:bg-white/20 px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer shadow-sm hover:scale-[1.02] active:scale-[0.98] border border-white/5"
                >
                  {/* @ts-ignore */}
                  <Plus size={14} strokeWidth={2.5} />
                  <span>New Chat</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="text-white/80 hover:text-white transition-colors bg-white/10 hover:bg-white/20 p-1.5 rounded-full cursor-pointer"
                >
                  {/* @ts-ignore */}
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="flex-1 bg-[#f8fafd] p-4 flex flex-col overflow-y-auto relative">
              <div className="absolute inset-0 z-0 opacity-[0.03]"
                style={{ backgroundImage: `radial-gradient(${accentColor} 1px, transparent 1px)`, backgroundSize: '24px 24px' }} />

              <div className="relative z-10 flex-1 flex flex-col justify-start space-y-4">
                {messages.map((msg, index) => {
                  const isUserMsg = msg.sender === 'user';
                  return (
                    <div key={index}
                      className={`flex flex-col ${isUserMsg ? 'items-end self-end max-w-[85%]' : 'items-start self-start max-w-[90%] mt-2'}`}>
                      <div className={`flex items-start gap-2.5 ${isUserMsg ? 'flex-row-reverse w-fit' : 'w-full'}`}>
                        {msg.sender === 'bot' && (
                          <div className="w-8 h-8 overflow-visible flex-shrink-0 relative">
                            <Avatar className="w-full h-full object-contain object-top" />
                          </div>
                        )}
                        <WidgetBubble
                          sender={msg.sender}
                          text={msg.text}
                          accentColor={accentColor}
                          isNew={msg.sender === 'bot' && index === messages.length - 1 && index > 0}
                          onComplete={() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })}
                        />
                      </div>

                      {msg.sender === 'bot' && index === 0 && messages.length === 1 && (
                        <div className="grid grid-cols-2 gap-2 mt-4 ml-10 w-[calc(100%-40px)]">
                          {starterChips.map((card, cIdx) => (
                            <button key={cIdx} onClick={() => sendMessage(card.query)}
                              className="p-2.5 bg-white hover:bg-[#e1eaf4] border border-gray-200 text-left rounded-xl transition-all shadow-sm cursor-pointer">
                              <p className="font-medium text-[11px] leading-tight" style={{ color: accentColor }}>{card.label}</p>
                              <span className="text-[9px] text-gray-400 block mt-1">Tap to ask</span>
                            </button>
                          ))}
                        </div>
                      )}

                      {msg.technologies && msg.technologies.length > 0 && (
                        <div className="flex flex-col gap-3 mt-2 ml-10 w-[calc(100%-40px)]">
                          {msg.technologies.slice(0, 5).map((tech) => (
                            <React.Fragment key={tech.technology_id}>
                              {renderTechnologyCard
                                ? renderTechnologyCard(tech)
                                : <WidgetCard tech={tech} href={technologyHref(tech)} accent={accentColor} />}
                            </React.Fragment>
                          ))}
                        </div>
                      )}

                      {msg.redirectUrl && (
                        <button onClick={() => handleRedirect(msg.redirectUrl)}
                          className="mt-3 ml-10 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-sm transition-transform hover:scale-[1.02]"
                          style={{ background: accentColor }}>
                          Continue in Romi Portal →
                        </button>
                      )}

                      {msg.sender === 'bot' && index === messages.length - 1 && (msg.suggestions?.length ?? 0) > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3 ml-10 w-[calc(100%-40px)]">
                          {msg.suggestions!.map((s, si) => (
                            <button key={si} onClick={() => sendMessage(s)}
                              className="bg-white border border-gray-200 hover:bg-[#e1eaf4] rounded-full px-3 py-1.5 text-[11px] font-semibold shadow-sm transition-colors"
                              style={{ color: accentColor }}>
                              → {s}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}

                {isTyping && (
                  <div className="flex items-start gap-2.5 max-w-[85%] self-start mt-2">
                    <div className="w-8 h-8 overflow-visible flex-shrink-0 relative">
                      <Avatar className="w-full h-full object-contain object-top" />
                    </div>
                    <div className="bg-white p-3.5 rounded-2xl rounded-tl-sm shadow-sm border border-[#e1eaf4] flex items-center gap-2">
                      {showThinkingPulse ? (
                        <div className="flex items-center gap-2 animate-pulse text-xs font-semibold" style={{ color: accentColor }}>
                          <span className="w-2 h-2 rounded-full animate-ping" style={{ background: accentColor }} />
                          Thinking...
                        </div>
                      ) : (
                        <div className="flex gap-1.5">
                          {[0, 150, 300].map((d) => (
                            <span key={d} className="w-1.5 h-1.5 rounded-full animate-bounce"
                              style={{ background: accentColor, animationDelay: `${d}ms` }} />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            <form onSubmit={handleSendMessage} className="p-3 sm:p-4 bg-white border-t border-gray-100 z-10">
              <div className="bg-gray-50 border border-gray-200 rounded-full pl-3 pr-1 py-1 sm:pl-4 sm:pr-1.5 sm:py-1.5 flex items-center gap-2">
                <input type="text" value={inputText} onChange={(e) => setInputText(e.target.value)}
                  placeholder="Ask me anything..."
                  className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder:text-gray-400" />
                <button type="submit" disabled={!inputText.trim() || isTyping}
                  className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 text-white rounded-full transition-colors disabled:opacity-50 flex items-center justify-center"
                  style={{ background: accentColor }}>
                  {/* @ts-ignore */}
                  <Send size={16} className="w-3.5 h-3.5 sm:w-4 sm:h-4 translate-x-[0.5px]" />
                </button>
              </div>
              <p className="text-[9px] text-center text-gray-400 mt-2">
                AI guidance only. KSUM is not liable for financial decisions — verify with institutions.
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative flex flex-col items-end z-10">
        <AnimatePresence>
          {showTooltip && !isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              className="bg-white font-bold text-[10px] md:text-[11px] px-3.5 py-1.5 rounded-t-xl rounded-bl-xl rounded-br-sm shadow-md mb-2 relative mr-3"
              style={{ color: accentColor }}
            >
              Don't know where to start?
              <button
                onClick={(e) => { e.stopPropagation(); setShowTooltip(false); }}
                className="absolute -top-2 -right-2 text-white rounded-full p-0.5 shadow-md"
                style={{ background: accentColor }}>
                {/* @ts-ignore */}
                <X size={8} strokeWidth={3} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.1}
          onDragEnd={(_e, info) => {
            if (info.offset.x > 30) { setIsMinimized(true); setIsOpen(false); setShowTooltip(false); }
            else if (info.offset.x < -30) setIsMinimized(false);
          }}
          animate={{ x: isMinimized ? 'calc(100% - 28px)' : 0, scale: 1 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            if (isMinimized) { setIsMinimized(false); setIsOpen(true); }
            else setIsOpen(!isOpen);
            setShowTooltip(false);
          }}
          className={`relative bg-white text-[#2c3e50] rounded-full ${avatarSrc ? 'pl-[58px] md:pl-[68px]' : 'pl-6'} pr-6 py-2.5 md:py-3 shadow-xl hover:shadow-2xl transition-all border border-gray-100 flex items-center h-[52px] md:h-[58px]`}
        >
          {avatarSrc && (
            <div className="absolute -left-6 md:-left-7 bottom-0 w-[82px] h-[105px] md:w-[100px] md:h-[125px] pointer-events-none">
              <img src={avatarSrc} alt="Romi AI Avatar" className="w-full h-full object-contain object-bottom drop-shadow-md" />
            </div>
          )}
          <span className="text-[18px] md:text-[20px] font-medium tracking-wide whitespace-nowrap ml-2">
            Try our <span className="font-bold" style={{ color: accentColor }}>Romi</span>
          </span>
        </motion.button>
      </div>
    </div>
  );
}