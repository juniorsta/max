'use client';

import { useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { AppLayout } from '@/components/AppLayout';

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
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-white">Carregando...</div>
      </div>
    );
  }

  return (
    <AppLayout>
      {children}
    </AppLayout>
  );
}