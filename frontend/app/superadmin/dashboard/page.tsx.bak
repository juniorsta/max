'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { Card } from '@/components/Card';

interface KPIs {
  empresasAtivas: number;
  empresasBloqueadas: number;
  empresasTeste: number;
  usuariosTotais: number;
  leadsHoje: number;
  conversasHoje: number;
  mensagensEnviadas: number;
  mensagensRecebidas: number;
  agendamentosHoje: number;
  receitaMensal: number;
  churn: number;
  usoIA: number;
  custosIA: number;
}

interface Graficos {
  conversasPorDia: { date: string; count: number }[];
  crescimentoClientes: { month: string; count: number }[];
  usoIADiario: { date: string; requests: number }[];
  novosLeads: { date: string; count: number }[];
  agendamentosSemanal: { week: string; count: number }[];
  errosSistema: number;
}

export default function SuperadminDashboard() {
  const { user, token } = useAuth();
  const [kpis, setKpis] = useState<KPIs | null>(null);
  const [graficos, setGraficos] = useState<Graficos | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetchDashboard();
  }, [user]);

  const fetchDashboard = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/superadmin/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setKpis(data.kpis);
      setGraficos(data.graficos);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6 text-white">Carregando...</div>;

  const renderChart = (data: any[], label: string) => {
    const max = Math.max(...data.map(d => d.count || d.requests));
    return (
      <div className="h-48 flex items-end gap-1">
        {data.slice(0, 30).map((item, i) => {
          const value = item.count || item.requests;
          const height = max > 0 ? (value / max) * 100 : 0;
          return (
            <div key={i} className="flex-1 flex flex-col items-center">
              <div 
                className="w-full bg-gradient-to-t from-purple-600 to-purple-400 rounded-t"
                style={{ height: `${height}%`, minHeight: '4px' }}
                title={`${label}: ${value}`}
              />
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Dashboard Global</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <p className="text-sm text-gray-400">Empresas Ativas</p>
          <p className="text-3xl font-bold text-green-400 mt-2">{kpis?.empresasAtivas || 0}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-400">Empresas Bloqueadas</p>
          <p className="text-3xl font-bold text-red-400 mt-2">{kpis?.empresasBloqueadas || 0}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-400">Empresas Teste</p>
          <p className="text-3xl font-bold text-yellow-400 mt-2">{kpis?.empresasTeste || 0}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-400">Usuários Totais</p>
          <p className="text-3xl font-bold text-white mt-2">{kpis?.usuariosTotais || 0}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-400">Leads Hoje</p>
          <p className="text-3xl font-bold text-blue-400 mt-2">{kpis?.leadsHoje || 0}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-400">Conversas Hoje</p>
          <p className="text-3xl font-bold text-purple-400 mt-2">{kpis?.conversasHoje || 0}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-400">Mensagens Enviadas</p>
          <p className="text-3xl font-bold text-green-400 mt-2">{kpis?.mensagensEnviadas || 0}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-400">Mensagens Recebidas</p>
          <p className="text-3xl font-bold text-blue-400 mt-2">{kpis?.mensagensRecebidas || 0}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-400">Agendamentos Hoje</p>
          <p className="text-3xl font-bold text-white mt-2">{kpis?.agendamentosHoje || 0}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-400">MRR</p>
          <p className="text-3xl font-bold text-green-400 mt-2">R$ {(kpis?.receitaMensal || 0).toLocaleString('pt-BR')}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-400">Churn</p>
          <p className="text-3xl font-bold text-red-400 mt-2">{kpis?.churn || 0}%</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-400">Uso IA</p>
          <p className="text-3xl font-bold text-purple-400 mt-2">{kpis?.usoIA || 0}</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-lg font-semibold text-white mb-4">Conversas por Dia</h2>
          {graficos?.conversasPorDia && renderChart(graficos.conversasPorDia, 'Conversas')}
        </Card>
        <Card>
          <h2 className="text-lg font-semibold text-white mb-4">Crescimento de Clientes</h2>
          {graficos?.crescimentoClientes && renderChart(graficos.crescimentoClientes, 'Clientes')}
        </Card>
        <Card>
          <h2 className="text-lg font-semibold text-white mb-4">Uso de IA</h2>
          {graficos?.usoIADiario && renderChart(graficos.usoIADiario, 'IA')}
        </Card>
        <Card>
          <h2 className="text-lg font-semibold text-white mb-4">Novos Leads</h2>
          {graficos?.novosLeads && renderChart(graficos.novosLeads, 'Leads')}
        </Card>
      </div>
    </div>
  );
}