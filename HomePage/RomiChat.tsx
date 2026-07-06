// C:\Users\Akash Krishna\Downloads\RINK KSUM Website\components\RomiChat.tsx

'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ChatBubble from './RomiAI/ChatBubble';
import MiniCard from '@/app/RomiPortal/RomiPortalFeatures/MiniCard';

interface Technology {
  technology_id: string;
  technology_name: string;
  institution: string;
  primary_sector: string;
  secondary_sector?: string;
  technology_type?: string;
  problem_solved?: string;
  brief_description_abstract: string; // Filled with normalized full description text
  applications?: string;
  trl: string;
  startup_potential: string;
  patent_status: string;
  contact_person?: string;
  email?: string;
  source_pdf?: string;
  page_no?: string;
  keywords?: string;
  image_url?: string;
}

interface Message {
  sender: 'bot' | 'user';
  text: string;
  technologies?: Technology[]; // Holds vector database results for this specific reply
}

export default function RomiChat() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'bot',
      text: "Hello! I'm Romi. I can help you discover technologies, understand IP status, and connect with institutions. How can I help you today?"
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showThinkingPulse, setShowThinkingPulse] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Suggested prompts for the initial empty chat state
  const microCards = [
    { label: "What's new technology?", query: "latest technology releases and innovations" },
    { label: "Patented technologies?", query: "show me patented technologies" },
    { label: "Compare agritech robotics", query: "autonomous robots for agriculture and farming" },
    { label: "High startup potential", query: "technologies with high startup potential" }
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Unified function to transmit search queries to your FastAPI server
  const executeSearch = async (queryText: string) => {
    setMessages((prev) => [...prev, { sender: 'user', text: queryText }]);
    setIsTyping(true);
    setShowThinkingPulse(false);

    // Set timeout to show thinking pulse if it takes over 2 seconds
    const thinkingTimer = setTimeout(() => {
      setShowThinkingPulse(true);
    }, 2000);

    try {
      const response = await fetch("http://localhost:8000/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: queryText,
          limit: 20,
          // THIS IS THE NEW PART: Passing conversation history for context!
          history: messages.slice(-6).map(m => ({
            role: m.sender === 'user' ? 'user' : 'assistant',
            content: m.text
          }))
        }),
      }).catch(() => null);

      if (!response) {
        throw new Error("Backend not running");
      }

      if (!response.ok) throw new Error("API Connection Failed");

      const resData = await response.json();

      if (resData.status === "success" || resData.ai_answer) {
        setMessages((prev) => [
          ...prev,
          {
            sender: 'bot',
            text: resData.ai_answer || `I found ${resData.match_count || 0} market-ready asset match(es) in the RINK database corresponding to your request:`,
            technologies: resData.data || []
          }
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            sender: 'bot',
            text: "I couldn't find any technologies matching that specific description above our verification threshold. Try modifying your terms or sector tags!"
          }
        ]);
      }
    } catch (error) {
      console.warn("ROMI API connection issue: Backend may not be running.");
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: "Oops! I'm having trouble accessing my central database brain right now. Make sure your local FastAPI backend server is up and running!"
        }
      ]);
    } finally {
      clearTimeout(thinkingTimer);
      setShowThinkingPulse(false);
      setIsTyping(false);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMessage = inputText.trim();
    setInputText('');
    executeSearch(userMessage);
  };

  if (pathname?.startsWith('/RomiPortal')) {
    return null;
  }

  return (
    <div className="fixed bottom-6 left-4 right-4 md:left-auto md:right-8 md:bottom-8 z-[100] flex flex-col items-end">
      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4 w-full sm:w-[500px] md:w-[600px] lg:w-[45vw] lg:max-w-[700px] h-[70vh] max-h-[70vh] sm:h-[650px] sm:max-h-[80vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-gray-200 origin-bottom-right z-20"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#1b60bb] to-[#1872dd] p-4 flex items-center justify-between shadow-sm z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 overflow-visible relative flex-shrink-0">
                  <img src="/images/romi-avatar.png" alt="Romi" className="w-full h-full object-contain object-bottom scale-125" />
                </div>
                <div>
                  <h3 className="text-white font-helios font-bold text-lg leading-tight tracking-wide">Romi AI</h3>
                  <p className="text-white/80 font-poppins text-[11px] font-medium tracking-wider uppercase mt-0.5">Research Assistant</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white transition-colors bg-white/10 hover:bg-white/20 p-1.5 rounded-full"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 bg-[#f8fafd] p-4 flex flex-col overflow-y-auto relative [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#1b60bb]/10 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-[#1b60bb]/20">
              <div className="absolute inset-0 z-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#1b60bb 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

              <div className="relative z-10 flex-1 flex flex-col justify-start space-y-4">
                {messages.map((msg, index) => {
                  const isUserMsg = msg.sender === 'user';
                  const hasTable = msg.sender === 'bot' && msg.text.includes('|');
                  return (
                    <div
                      key={index}
                      className={`flex flex-col ${
                        isUserMsg
                          ? 'items-end self-end max-w-[85%]'
                          : `items-start self-start ${hasTable ? 'w-full md:max-w-[98%] max-w-[92%]' : 'max-w-[90%]'} mt-2`
                      }`}
                    >
                      <div className={`flex items-start gap-2.5 w-full ${isUserMsg ? 'flex-row-reverse' : ''}`}>
                        {msg.sender === 'bot' && (
                          <div className="w-8 h-8 overflow-visible flex-shrink-0 relative">
                            <img src="/images/romi-avatar.png" alt="Romi" className="w-full h-full object-contain object-top" />
                          </div>
                        )}
                        <ChatBubble
                          sender={msg.sender}
                          text={msg.text}
                          isNew={msg.sender === 'bot' && index === messages.length - 1 && index > 0}
                          onComplete={() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })}
                        />
                      </div>

                      {/* RENDER THE RELEVANT MICRO-CARDS (Only under the very first welcome message) */}
                      {msg.sender === 'bot' && index === 0 && messages.length === 1 && (
                        <div className="grid grid-cols-2 gap-2 mt-4 ml-10 w-[calc(100%-40px)]">
                          {microCards.map((card, cIdx) => (
                            <button
                              key={cIdx}
                              onClick={() => executeSearch(card.query)}
                              className="p-2.5 bg-white hover:bg-[#e1eaf4] border border-gray-200 text-left rounded-xl transition-all shadow-sm hover:border-[#1b60bb] cursor-pointer"
                            >
                              <p className="font-poppins font-medium text-[11px] text-[#1b60bb] leading-tight">{card.label}</p>
                              <span className="text-[9px] text-gray-400 block mt-1 font-poppins">Tap to ask</span>
                            </button>
                          ))}
                        </div>
                      )}

                      {/* RENDER DYNAMIC MINI-CARDS FROM THE VECTOR RETRIEVAL STACK */}
                      {msg.technologies && msg.technologies.length > 0 && (
                        <div className="flex flex-col gap-3 mt-2 ml-10 w-[calc(100%-40px)]">
                          {msg.technologies.map((tech) => (
                            <MiniCard key={tech.technology_id} technology={tech} />
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}

                {isTyping && (
                  <div className="flex items-start gap-2.5 max-w-[85%] self-start mt-2">
                    <div className="w-8 h-8 overflow-visible flex-shrink-0 relative">
                      <img src="/images/romi-avatar.png" alt="Romi" className="w-full h-full object-contain object-top" />
                    </div>
                    <div className="bg-white p-3.5 rounded-2xl rounded-tl-sm shadow-sm border border-[#e1eaf4] flex items-center gap-2">
                      {showThinkingPulse ? (
                        <div className="flex items-center gap-2 animate-pulse text-[#1b60bb] font-poppins text-xs font-semibold">
                          <span className="w-2 h-2 rounded-full bg-[#1b60bb] animate-ping" />
                          Thinking...
                        </div>
                      ) : (
                        <div className="flex gap-1.5">
                          <span className="w-1.5 h-1.5 bg-[#1b60bb] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-1.5 h-1.5 bg-[#1b60bb] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-1.5 h-1.5 bg-[#1b60bb] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="p-3 sm:p-4 bg-white border-t border-gray-100 z-10">
              <div className="bg-gray-50 border border-gray-200 rounded-full pl-3 pr-1 py-1 sm:pl-4 sm:pr-1.5 sm:py-1.5 flex items-center gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Ask me anything..."
                  className="flex-1 bg-transparent outline-none font-poppins text-sm text-gray-700 placeholder:text-gray-400"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim() || isTyping}
                  className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 bg-[#1b60bb] hover:bg-[#154b94] text-white rounded-full transition-colors disabled:opacity-50 disabled:hover:bg-[#1b60bb] flex items-center justify-center"
                >
                  <Send size={16} className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white translate-x-[0.5px]" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button & Tooltip Container */}
      <div className="relative flex flex-col items-end z-10">
        {/* Tooltip */}
        <AnimatePresence>
          {showTooltip && !isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              className="bg-white text-[#1b60bb] font-poppins text-[10px] md:text-[11px] font-bold px-3.5 py-1.5 rounded-t-xl rounded-bl-xl rounded-br-sm shadow-md mb-2 relative mr-3"
            >
              Don't know where to start?
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowTooltip(false);
                }}
                className="absolute -top-2 -right-2 bg-[#1b60bb] hover:bg-[#113a70] text-white rounded-full p-0.5 transition-colors shadow-md"
              >
                <X size={8} strokeWidth={3} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Romi Avatar Floating Button */}
        <motion.button
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.1}
          onDragEnd={(e, info) => {
            if (info.offset.x > 30) {
              setIsMinimized(true);
              setIsOpen(false);
              setShowTooltip(false);
            } else if (info.offset.x < -30) {
              setIsMinimized(false);
            }
          }}
          animate={{
            x: isMinimized ? 'calc(100% - 28px)' : 0,
            scale: 1
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            if (isMinimized) {
              setIsMinimized(false);
              setIsOpen(true);
            } else {
              setIsOpen(!isOpen);
            }
            setShowTooltip(false);
          }}
          className="relative bg-white text-[#2c3e50] rounded-full pl-[58px] md:pl-[68px] pr-6 py-2.5 md:py-3 shadow-xl hover:shadow-2xl transition-all border border-gray-100 flex items-center h-[52px] md:h-[58px]"
        >
          {/* Overhanging 3D Avatar */}
          <div className="absolute -left-6 md:-left-7 bottom-0 w-[82px] h-[105px] md:w-[100px] md:h-[125px] pointer-events-none">
            <img
              src="/images/romi-avatar.png"
              alt="Romi AI Avatar"
              className="w-full h-full object-contain object-bottom drop-shadow-md"
            />
          </div>
          <span className="font-helios text-[18px] md:text-[20px] font-medium tracking-wide whitespace-nowrap ml-2">Try our <span className="font-bold text-[#1b60bb]">Romi</span></span>
        </motion.button>
      </div>
    </div>
  );
}