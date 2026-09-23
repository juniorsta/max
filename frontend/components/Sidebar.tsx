'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth';

const navItems = [
  { name: 'Dashboard', href: '/superadmin/dashboard', icon: '📊' },
  { name: 'Empresas', href: '/superadmin/empresas', icon: '🏢' },
  { name: 'Usuários', href: '/superadmin/usuarios', icon: '👥' },
  { name: 'Evolution API', href: '/superadmin/evolution', icon: '📱' },
  { name: 'CRM', href: '/superadmin/crm', icon: '🎯' },
  { name: 'Financeiro', href: '/superadmin/financeiro', icon: '💰' },
  { name: 'IA & Modelos', href: '/superadmin/ai', icon: '🤖' },
  { name: 'Monitoramento', href: '/superadmin/monitoramento', icon: '📈' },
  { name: 'Logs', href: '/superadmin/logs', icon: '📝' },
  { name: 'Templates', href: '/superadmin/templates', icon: '📋' },
  { name: 'Componentes', href: '/superadmin/componentes', icon: '🧩' },
  { name: 'Configurações', href: '/superadmin/configuracoes', icon: '⚙️' },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className="fixed left-0 top-0 h-screen w-[240px] bg-[#1E293B] border-r border-[#334155] flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-[#334155]">
        <span className="text-xl font-bold text-[#F8FAFC]">K<span className="text-[#6366F1]">ERA</span></span>
      </div>
      
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map(item => (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              pathname === item.href
                ? 'bg-[#6366F1]/15 text-[#818CF8] border border-[#6366F1]/30 shadow-sm shadow-[#6366F1]/10'
                : 'text-[#94A3B8] hover:bg-[#334155]/60 hover:text-[#F8FAFC]'
            }`}
          >
            <span className="text-base">{item.icon}</span>
            {item.name}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-[#334155]">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center text-white text-sm font-medium">
            {user?.nome?.[0]?.toUpperCase() || 'S'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[#F8FAFC] truncate">{user?.nome}</p>
            <p className="text-xs text-[#94A3B8] truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#334155]/60 rounded-lg transition-colors"
        >
          <span>⏻</span> Sair
        </button>
      </div>
    </aside>
  );
}
