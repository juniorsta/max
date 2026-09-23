'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export default function SuperadminLayout({ children }: { children: React.ReactNode }) {
  const { user, token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) return;
    if (user.role !== 'superadmin') {
      router.push('/dashboard');
    }
  }, [user, router]);

  if (!user || user.role !== 'superadmin') {
    return <div className="p-6 text-white">Carregando...</div>;
  }

  return <>{children}</>;
}