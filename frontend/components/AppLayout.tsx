'use client';

import { ReactNode, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: '📊' },
  { name: 'Leads', href: '/leads', icon: '👥' },
  { name: 'Agendamentos', href: '/agendamentos', icon: '📅' },
];

const superadminNavigation = [
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

export function AppLayout({ children }: { children: ReactNode }) {
  const { token, user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!token) router.push('/login');
  }, [token, router]);

  if (!token) return null;

  const isSuperadmin = user?.role === 'superadmin';
  const nav = isSuperadmin ? superadminNavigation : navigation;

  return (
    <div className="min-h-screen bg-[#0F172A]">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#1E293B] border-r border-[#334155] transform transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center px-6 border-b border-[#334155]">
          <span className="text-xl font-bold text-white">K<span className="text-purple-500">ERA</span></span>
        </div>
        <nav className="p-4 space-y-1">
          {nav.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                pathname === item.href
                  ? 'bg-gradient-to-r from-purple-600/20 to-indigo-600/20 text-purple-300 border border-purple-500/30'
                  : 'text-slate-400 hover:bg-[#334155]/50 hover:text-white'
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#334155]">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-sm font-medium">
              {user?.nome?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.nome}</p>
              <p className="text-xs text-slate-400 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-slate-400 hover:text-white hover:bg-[#334155]/50 rounded-lg transition-colors"
          >
            <span>⏻</span> Sair
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 h-16 bg-[#1E293B]/80 backdrop-blur-md border-b border-[#334155] flex items-center justify-between px-6 lg:px-8">
          <button
            className="lg:hidden text-slate-400 hover:text-white"
            onClick={() => setSidebarOpen(true)}
          >
            ☰
          </button>
          <div className="flex-1 lg:hidden" />
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-400 hidden sm:block">{user?.empresa?.nome || 'Superadmin'}</span>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}