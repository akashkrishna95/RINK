'use client';
import { useState } from 'react';
import { Check, Copy, ChevronDown, ChevronUp } from 'lucide-react';

interface AssessmentMiniCardProps {
  sectionNumber: string;
  sectionTitle: string;
  questions: string[];
  refinedAnswer: string;
  wordCount: number;
}

export default function AssessmentMiniCard({
  sectionNumber,
  sectionTitle,
  questions = [],
  refinedAnswer,
  wordCount,
}: AssessmentMiniCardProps) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(refinedAnswer);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* fallback */
    }
  };

  const qCount = questions ? questions.length : 0;

  return (
    <div className="mt-3 mb-1 bg-white dark:bg-zinc-900 border border-green-100 dark:border-green-900/40 rounded-2xl p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="shrink-0 w-6 h-6 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 flex items-center justify-center">
            <Check size={13} strokeWidth={3} />
          </span>
          <div className="min-w-0">
            <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400 dark:text-zinc-500 block">
              Section {sectionNumber}
            </span>
            <h4 className="font-helios font-bold text-xs text-gray-800 dark:text-zinc-100 truncate">
              {sectionTitle}
            </h4>
          </div>
        </div>
        <button
          onClick={handleCopy}
          type="button"
          className="shrink-0 flex items-center gap-1 px-2.5 py-1 text-[10px] font-semibold rounded-lg border border-gray-200 dark:border-zinc-700 text-gray-500 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-800 hover:text-[#1b60bb] dark:hover:text-blue-400 transition-all cursor-pointer active:scale-95"
        >
          <Copy size={11} />
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      <p className="text-xs text-gray-700 dark:text-zinc-300 leading-relaxed font-sans whitespace-pre-wrap">
        {refinedAnswer}
      </p>

      <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-gray-100 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setExpanded(!expanded)}
            type="button"
            className="flex items-center gap-1 text-[10px] text-gray-400 dark:text-zinc-500 hover:text-[#1b60bb] dark:hover:text-blue-400 cursor-pointer"
          >
            {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            {qCount} question{qCount !== 1 ? 's' : ''} answered
          </button>
          <span className="text-gray-300 dark:text-zinc-600">&middot;</span>
          <span className="text-[10px] text-gray-400 dark:text-zinc-500 font-mono">{wordCount} words</span>
        </div>
      </div>

      {expanded && questions && questions.length > 0 && (
        <ul className="mt-2 pl-4 flex flex-col gap-1 list-disc">
          {questions.map((q, i) => (
            <li key={i} className="text-[10px] text-gray-500 dark:text-zinc-400 leading-snug">{q}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
