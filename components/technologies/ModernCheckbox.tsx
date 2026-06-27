'use client';

import { Check } from 'lucide-react';

interface ModernCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
}

export default function ModernCheckbox({ checked, onChange, label }: ModernCheckboxProps) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group">
      <div
        onClick={() => onChange(!checked)}
        className={`relative w-5 h-5 border-2 transition-all duration-300 flex items-center justify-center ${
          checked
            ? 'bg-[#1b60bb] border-[#1b60bb] shadow-md shadow-[#1b60bb]/30'
            : 'border-[#999] hover:border-[#1b60bb] hover:shadow-sm hover:shadow-[#1b60bb]/20'
        }`}
      >
        {checked && <Check size={16} className="text-white" strokeWidth={3} />}
      </div>
      {label && (
        <span className="font-poppins text-sm text-gray-700 group-hover:text-[#1b60bb] transition-colors">
          {label}
        </span>
      )}
    </label>
  );
}
