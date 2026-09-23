'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../lib/auth';

export default function Home() {
  const router = useRouter();
  const { token, user } = useAuth();

  useEffect(() => {
    if (token) {
      if (user?.role === 'superadmin') {
        router.push('/superadmin/dashboard');
      } else {
        router.push('/dashboard');
      }
    }
  }, [token, user, router]);

  if (token) return null;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gray-950">
      <div className="text-center space-y-6 max-w-2xl">
        <div className="space-y-2">
          <h1 className="text-5xl font-bold text-purple-400">Kera</h1>
          <p className="text-xl text-gray-300 max-w-md mx-auto">
            SaaS premium para estética automotiva — WhatsApp como vendedor inteligente 24h.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/login"
            className="inline-block rounded bg-purple-600 px-8 py-4 text-lg font-medium hover:bg-purple-700 transition"
          >
            Entrar
          </Link>
          <Link
            href="/register"
            className="inline-block rounded bg-gray-800 border border-gray-700 px-8 py-4 text-lg font-medium hover:bg-gray-700 transition"
          >
            Criar conta
          </Link>
        </div>

        <div className="pt-8 border-t border-gray-800 w-full max-w-3xl mx-auto space-y-4 text-left">
          <h3 className="text-lg font-semibold text-white">O que o Kera faz por você:</h3>
          <ul className="space-y-2 text-gray-400">
            <li className="flex items-center gap-2">✅ Responde clientes no WhatsApp 24/7</li>
            <li className="flex items-center gap-2">✅ Qualifica leads e agenda serviços</li>
            <li className="flex items-center gap-2">✅ Organiza pipeline de vendas (Kanban)</li>
            <li className="flex items-center gap-2">✅ Dashboard com métricas em tempo real</li>
            <li className="flex items-center gap-2">✅ Multi-tenant: dados isolados por empresa</li>
          </ul>
        </div>
      </div>
    </main>
  );
}