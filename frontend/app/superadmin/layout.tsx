'use client';

import { useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/Sidebar';
import { Topbar } from '@/components/Topbar';

export default function SuperadminLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) return;
    if (user.role !== 'superadmin') {
      router.push('/dashboard');
    }
  }, [user, router]);

  if (!user || user.role !== 'superadmin') {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
        <div className="text-[#F8FAFC]">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F172A] text-[#F8FAFC]">
      <Sidebar />
      <div className="ml-[240px]">
        <Topbar />
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}
