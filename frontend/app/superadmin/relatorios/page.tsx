'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';

interface Stats {
  totalEmpresas: number;
  empresasAtivas: number;
  totalLeads: number;
  totalUsuarios: number;
}

export default function SuperadminRelatorios() {
  const { user, token } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetchStats();
  }, [user]);

  const fetchStats = async () => {
    try {
      // Simulated - in real app seria endpoint /api/v1/superadmin/stats
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/companies`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const empresas = await res.json();
      setStats({
        totalEmpresas: empresas.length,
        empresasAtivas: empresas.filter((e: any) => e.status === 'active').length,
        totalLeads: 0,
        totalUsuarios: empresas.reduce((acc: number, e: any) => acc + (e.usuarios?.length || 0), 0),
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6 text-white">Carregando...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Relatórios da Plataforma</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <p className="text-sm text-gray-400">Total de Empresas</p>
          <p className="text-3xl font-bold text-white mt-2">{stats?.totalEmpresas || 0}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-400">Empresas Ativas</p>
          <p className="text-3xl font-bold text-green-400 mt-2">{stats?.empresasAtivas || 0}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-400">Total de Usuários</p>
          <p className="text-3xl font-bold text-white mt-2">{stats?.totalUsuarios || 0}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-400">Total de Leads</p>
          <p className="text-3xl font-bold text-purple-400 mt-2">{stats?.totalLeads || 0}</p>
        </Card>
      </div>

      <Card>
        <h2 className="text-lg font-semibold text-white mb-4">Empresas que vencem em breve</h2>
        <p className="text-gray-400">Funcionalidade em desenvolvimento</p>
      </Card>
    </div>
  );
}