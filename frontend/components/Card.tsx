'use client';

import { ReactNode } from 'react';

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`bg-[#1E293B] backdrop-blur-sm border border-[#334155] rounded-xl p-6 hover:border-[#6366F1]/30 transition-all duration-300 shadow-sm ${className}`}>
      {children}
    </div>
  );
}
