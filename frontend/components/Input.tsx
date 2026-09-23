'use client';

import { InputHTMLAttributes, forwardRef } from 'react';

type InputLabel = string | React.ReactNode;

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: InputLabel;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-[#94A3B8] mb-1">{label}</label>
        )}
        <input
          ref={ref}
          className={`w-full px-4 py-2.5 bg-[#111827] border border-[#334155] rounded-lg text-[#F8FAFC] placeholder-[#64748B] text-sm focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-transparent disabled:bg-[#0F172A] disabled:cursor-not-allowed ${error ? 'border-[#EF4444] focus:ring-[#EF4444]' : ''} ${className}`}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-[#EF4444]">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
