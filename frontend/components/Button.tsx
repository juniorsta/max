'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', children, ...props }, ref) => {
    const base = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0F172A] disabled:opacity-50 disabled:cursor-not-allowed';
    const variants = {
      primary: 'bg-[#6366F1] text-white hover:bg-[#4F46E5] focus:ring-[#6366F1]',
      secondary: 'bg-[#1E293B] text-white hover:bg-[#334155] border border-[#334155] focus:ring-[#6366F1]',
      outline: 'border border-[#334155] bg-transparent hover:bg-[#1E293B] text-[#F8FAFC] focus:ring-[#6366F1]',
      danger: 'bg-[#EF4444] text-white hover:bg-[#DC2626] focus:ring-[#EF4444]',
      ghost: 'bg-transparent hover:bg-[#1E293B] text-[#94A3B8] hover:text-[#F8FAFC] focus:ring-[#6366F1]',
    };
    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
    };

    return (
      <button
        ref={ref}
        className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
