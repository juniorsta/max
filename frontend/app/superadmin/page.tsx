'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/lib/auth';

export default function SuperadminIndex() {
  const router = useRouter();
  const { user } = useAuth();
  
  useEffect(() => {
    if (user?.role === 'superadmin') {
      router.push('/superadmin/empresas');
    } else {
      router.push('/dashboard');
    }
  }, [user, router]);

  return null;
}