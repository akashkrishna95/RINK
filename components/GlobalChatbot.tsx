'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send } from 'lucide-react';

interface Message {
  sender: 'bot' | 'user';
  text: string;
}

export default function GlobalChatbot() {
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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMessage = inputText.trim();
    setMessages((prev) => [...prev, { sender: 'user', text: userMessage }]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      let replyText = "I'm here to help you connect with Kerala's research institutions and find market-ready intellectual property. Feel free to search our browse page for specific listings!";
      const query = userMessage.toLowerCase();

      if (query.includes('agri') || query.includes('agriculture') || query.includes('farming') || query.includes('crop') || query.includes('pollen')) {
        replyText = "We have several agricultural technologies like Coconut Pollen Cryopreservation. You can search for them in the Browse Technologies section!";
      } else if (query.includes('patent') || query.includes('ip') || query.includes('license') || query.includes('status')) {
        replyText = "Many of our technologies are Patented or Patent Filed. You can filter by IP Status on the Browse page!";
      } else if (query.includes('hello') || query.includes('hi') || query.includes('hey') || query.includes('greetings')) {
        replyText = "Hello! How can I help you navigate KSUM RINK today?";
      } else if (query.includes('clear') || query.includes('reset')) {
        setMessages([
          {
            sender: 'bot',
            text: "Hello! I'm Romi. I can help you discover technologies, understand IP status, and connect with institutions. How can I help you today?"
          }
        ]);
        setIsTyping(false);
        return;
      }

      setMessages((prev) => [...prev, { sender: 'bot', text: replyText }]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-[100] flex flex-col items-end">
      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4 w-[calc(100vw-32px)] sm:w-[380px] h-[500px] max-h-[75vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-gray-200 origin-bottom-right z-20"
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
                {messages.map((msg, index) => (
                  <div key={index} className={`flex items-start gap-2.5 max-w-[85%] ${msg.sender === 'user' ? 'self-end flex-row-reverse' : 'self-start mt-2'}`}>
                    {msg.sender === 'bot' && (
                      <div className="w-8 h-8 overflow-visible flex-shrink-0 relative">
                        <img src="/images/romi-avatar.png" alt="Romi" className="w-full h-full object-contain object-top" />
                      </div>
                    )}
                    <div className={`p-3.5 rounded-2xl shadow-sm border ${msg.sender === 'user' ? 'bg-[#1b60bb] text-white border-[#1b60bb] rounded-tr-sm' : 'bg-white text-gray-700 border-[#e1eaf4] rounded-tl-sm'}`}>
                      {msg.sender === 'bot' && <h4 className="font-helios text-[#1b60bb] font-bold text-[11px] mb-1">Romi AI</h4>}
                      <p className="font-poppins text-xs leading-relaxed">
                        {msg.text}
                      </p>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex items-start gap-2.5 max-w-[85%] self-start mt-2">
                    <div className="w-8 h-8 overflow-visible flex-shrink-0 relative">
                      <img src="/images/romi-avatar.png" alt="Romi" className="w-full h-full object-contain object-top" />
                    </div>
                    <div className="bg-white p-3.5 rounded-2xl rounded-tl-sm shadow-sm border border-[#e1eaf4] flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-[#1b60bb] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 bg-[#1b60bb] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 bg-[#1b60bb] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </div>
            
            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-100 z-10">
              <div className="bg-gray-50 border border-gray-200 rounded-full px-4 py-2 flex sm:py-2.5 items-center gap-2">
                <input 
                  type="text" 
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Ask me anything..." 
                  className="flex-1 bg-transparent outline-none font-poppins text-base sm:text-sm text-gray-700 placeholder:text-gray-400"
                />
                <button 
                  type="submit"
                  disabled={!inputText.trim()}
                  className="flex-shrink-0 bg-[#1b60bb] hover:bg-[#154b94] text-white p-1.5 md:p-2 rounded-full transition-colors disabled:opacity-50 disabled:hover:bg-[#1b60bb]"
                >
                  <Send size={16} className="w-3.5 h-3.5 md:w-4 md:h-4" />
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
