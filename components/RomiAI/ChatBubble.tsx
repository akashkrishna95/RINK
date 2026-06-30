//C:\Users\Akash Krishna\Downloads\RINK KSUM Website\components\RomiAI\ChatBubble.tsx

'use client';

import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import ComparisonTable, { TableHead, TableRow, TableHeaderCell, TableCell } from './ComparisonTable';

interface ChatBubbleProps {
  sender: 'bot' | 'user';
  text: string;
  isNew?: boolean;
  onComplete?: () => void;
}

export default function ChatBubble({ sender, text, isNew = false, onComplete }: ChatBubbleProps) {
  const [displayedText, setDisplayedText] = useState(sender === 'bot' && isNew ? '' : text);

  useEffect(() => {
    if (sender === 'bot' && isNew) {
      setDisplayedText('');
      let currentText = '';
      let index = 0;
      const timer = setInterval(() => {
        currentText += text.charAt(index);
        setDisplayedText(currentText);
        index++;
        if (index >= text.length) {
          clearInterval(timer);
          onComplete?.();
        }
      }, 8);
      return () => clearInterval(timer);
    } else {
      setDisplayedText(text);
    }
  }, [text, sender, isNew]);

  const isUser = sender === 'user';

  return (
    <div
      className={`p-3.5 rounded-2xl shadow-sm leading-relaxed max-w-[85%] font-poppins text-[13px] ${
        isUser
          ? 'bg-gradient-to-r from-[#1b60bb] to-[#1872dd] text-white self-end rounded-tr-none'
          : 'bg-[#f4f7fb] text-gray-800 self-start rounded-tl-none border border-[#e1eaf4]'
      }`}
    >
      {isUser ? (
        <span className="whitespace-pre-line">{displayedText}</span>
      ) : (
        <div className="prose prose-sm max-w-none prose-slate text-gray-800 text-[13px] leading-relaxed">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              table: ({ children }) => <ComparisonTable>{children}</ComparisonTable>,
              thead: ({ children }) => <TableHead>{children}</TableHead>,
              tr: ({ children }) => <TableRow>{children}</TableRow>,
              th: ({ children }) => <TableHeaderCell>{children}</TableHeaderCell>,
              td: ({ children }) => <TableCell>{children}</TableCell>,
              ul: ({ children }) => <ul className="list-disc pl-5 my-2 space-y-1">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal pl-5 my-2 space-y-1">{children}</ol>,
              li: ({ children }) => <li className="my-0.5">{children}</li>,
              p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
              strong: ({ children }) => <strong className="font-bold text-[#1b60bb]">{children}</strong>,
            }}
          >
            {displayedText}
          </ReactMarkdown>
        </div>
      )}
    </div>
  );
}
