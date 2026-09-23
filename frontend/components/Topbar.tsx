'use client';

import { useAuth } from '@/lib/auth';
import { Input } from '@/components/Input';

export function Topbar() {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#111827]/80 backdrop-blur-md border-b border-[#1E293B] flex items-center justify-between px-6 lg:px-8 ml-[240px]">
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Buscar..."
            className="w-full pl-10 pr-4 py-2 bg-[#1E293B] border border-[#1E293B] rounded-lg text-[#F3F4F6] placeholder-[#9CA3AF] text-sm focus:outline-none focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6]"
          />
          <span className="absolute left-3 top-2.5 text-[#9CA3AF]">🔍</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 text-[#9CA3AF] hover:text-[#F3F4F6] transition-colors">
          <span>🔔</span>
          <span className="absolute top-1 right-1 w-2 h-2 bg-[#EF4444] rounded-full"></span>
        </button>
        
        <div className="w-px h-6 bg-[#1E293B]"></div>
        
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-[#F3F4F6]">Super Admin</p>
            <p className="text-xs text-[#9CA3AF]">{user?.email}</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-[#8B5CF6] flex items-center justify-center text-white text-sm font-medium">
            {user?.nome?.[0]?.toUpperCase() || 'S'}
          </div>
        </div>
      </div>
    </header>
  );
}
