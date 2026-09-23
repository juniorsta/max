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
    <aside className="fixed left-0 top-0 h-screen w-[240px] bg-[#111827] border-r border-[#1E293B] flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-[#1E293B]">
        <span className="text-xl font-bold">K<span className="text-[#8B5CF6]">ERA</span></span>
      </div>
      
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map(item => (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
              pathname === item.href
                ? 'bg-[#8B5CF6]/10 text-[#8B5CF6] border border-[#8B5CF6]/20'
                : 'text-[#9CA3AF] hover:bg-[#1E293B] hover:text-[#F3F4F6]'
            }`}
          >
            <span className="text-base">{item.icon}</span>
            {item.name}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-[#1E293B]">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-[#8B5CF6] flex items-center justify-center text-white text-sm font-medium">
            {user?.nome?.[0]?.toUpperCase() || 'S'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[#F3F4F6] truncate">{user?.nome}</p>
            <p className="text-xs text-[#9CA3AF] truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-2 text-sm text-[#9CA3AF] hover:text-[#F3F4F6] hover:bg-[#1E293B] rounded-lg transition-colors"
        >
          <span>⏻</span> Sair
        </button>
      </div>
    </aside>
  );
}
