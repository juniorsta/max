'use client';

import { useAuth } from '@/lib/auth';

export function Topbar() {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#1E293B]/90 backdrop-blur-md border-b border-[#334155] flex items-center justify-between px-6 lg:px-8 ml-[240px]">
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Buscar..."
            className="w-full pl-10 pr-4 py-2 bg-[#0F172A] border border-[#334155] rounded-lg text-[#F8FAFC] placeholder-[#64748B] text-sm focus:outline-none focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1]/50"
          />
          <span className="absolute left-3 top-2.5 text-[#64748B]">🔍</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 text-[#94A3B8] hover:text-[#F8FAFC] transition-colors">
          <span>🔔</span>
          <span className="absolute top-1 right-1 w-2 h-2 bg-[#EF4444] rounded-full"></span>
        </button>
        
        <div className="w-px h-6 bg-[#334155]"></div>
        
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-[#F8FAFC]">Super Admin</p>
            <p className="text-xs text-[#94A3B8]">{user?.email}</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center text-white text-sm font-medium">
            {user?.nome?.[0]?.toUpperCase() || 'S'}
          </div>
        </div>
      </div>
    </header>
  );
}
