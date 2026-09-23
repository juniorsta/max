'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { Card } from '@/components/Card';

interface Stats {
  totalEmpresas: number;
  empresasAtivas: number;
  usuariosTotais: number;
  leadsTotais: number;
  conversasHoje: number;
}

export default function RelatoriosPage() {
  const { user, token } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    fetchStats();
  }, [token]);

  const fetchStats = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/superadmin/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.kpis) {
        setStats({
          totalEmpresas: data.kpis.empresasAtivas + data.kpis.empresasBloqueadas + data.kpis.empresasTeste,
          empresasAtivas: data.kpis.empresasAtivas,
          usuariosTotais: data.kpis.usuariosTotais,
          leadsTotais: data.kpis.totalLeads,
          conversasHoje: data.kpis.conversasHoje
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6 text-white">Carregando...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Relatórios</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <p className="text-sm text-gray-400">Total de Empresas</p>
          <p className="text-3xl font-bold text-white mt-2">{stats?.totalEmpresas || 0}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-400">Empresas Ativas</p>
          <p className="text-3xl font-bold text-green-400 mt-2">{stats?.empresasAtivas || 0}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-400">Usuários Totais</p>
          <p className="text-3xl font-bold text-white mt-2">{stats?.usuariosTotais || 0}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-400">Total de Leads</p>
          <p className="text-3xl font-bold text-blue-400 mt-2">{stats?.leadsTotais || 0}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-400">Conversas Hoje</p>
          <p className="text-3xl font-bold text-purple-400 mt-2">{stats?.conversasHoje || 0}</p>
        </Card>
      </div>
    </div>
  );
}
