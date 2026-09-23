'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { Card } from '@/components/Card';

export default function SuperadminDashboard() {
  const { user, token } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    fetchDashboard();
  }, [user]);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/superadmin/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch');
      const result = await res.json();
      setData(result);
    } catch (e) {
      console.error(e);
      setError('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6 text-white">Carregando...</div>;
  if (error) return <div className="p-6 text-red-400">{error}</div>;
  if (!data) return null;

  const { kpis, graficos } = data;

  const renderBarChart = (items: any[], labelFn: (item: any) => string, valueFn: (item: any) => number, height = 80) => {
    const max = Math.max(...items.map(valueFn));
    return (
      <div className="h-[80px] flex items-end gap-1 px-2">
        {items.map((item, idx) => {
          const value = valueFn(item);
          const percent = max > 0 ? (value / max) * 100 : 0;
          return (
            <div key={idx} className="flex-1 flex flex-col items-center relative">
              <div 
                className="w-full bg-gradient-to-t from-purple-600 to-purple-400 rounded-t"
                style={{ height: `${percent}%` }}
                title={`${labelFn(item)}: ${valueFn(item)}`}
              />
              <div className="text-xs text-gray-400 mt-1">{labelFn(item)}</div>
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
          <p className="text-3xl font-bold text-green-400 mt-2">{kpis.empresasAtivas}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-400">Empresas Bloqueadas</p>
          <p className="text-3xl font-bold text-red-400 mt-2">{kpis.empresasBloqueadas}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-400">Empresas Teste</p>
          <p className="text-3xl font-bold text-yellow-400 mt-2">{kpis.empresasTeste}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-400">Empresas Canceladas</p>
          <p className="text-3xl font-bold text-red-600 mt-2">{kpis.empresasCanceladas}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-400">Usuários Totais</p>
          <p className="text-3xl font-bold text-white mt-2">{kpis.usuariosTotais}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-400">Leads Hoje</p>
          <p className="text-3xl font-bold text-blue-400 mt-2">{kpis.leadsHoje}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-400">Conversas Hoje</p>
          <p className="text-3xl font-bold text-purple-400 mt-2">{kpis.conversasHoje}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-400">Mensagens Enviadas</p>
          <p className="text-3xl font-bold text-green-400 mt-2">{kpis.mensagensEnviadas}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-400">Mensagens Recebidas</p>
          <p className="text-3xl font-bold text-blue-400 mt-2">{kpis.mensagensRecebidas}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-400">Agendamentos Hoje</p>
          <p className="text-3xl font-bold text-white mt-2">{kpis.agendamentosHoje}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-400">MRR</p>
          <p className="text-3xl font-bold text-green-400 mt-2">R$ {kpis.receitaMensal.toLocaleString('pt-BR')}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-400">Churn</p>
          <p className="text-3xl font-bold text-red-400 mt-2">{kpis.churn}%</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-400">Uso IA</p>
          <p className="text-3xl font-bold text-purple-400 mt-2">{kpis.usoIA}</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-lg font-semibold text-white mb-4">Conversas por Dia (últimos 30 dias)</h2>
          {graficos.conversasPorDia && renderBarChart(
            graficos.conversasPorDia,
            (d) => d.date,
            (d) => d.count
          )}
        </Card>
        <Card>
          <h2 className="text-lg font-semibold text-white mb-4">Crescimento de Clientes (últimos 12 meses)</h2>
          {graficos.crescimentoClientes && renderBarChart(
            graficos.crescimentoClientes,
            (d) => d.month,
            (d) => d.count
          )}
        </Card>
        <Card>
          <h2 className="text-lg font-semibold text-white mb-4">Novos Leads por Dia (últimos 30 dias)</h2>
          {graficos.novosLeadsPorDia && renderBarChart(
            graficos.novosLeadsPorDia,
            (d) => d.date,
            (d) => d.count
          )}
        </Card>
        <Card>
          <h2 className="text-lg font-semibold text-white mb-4">Agendamentos por Semana (últimas 12 semanas)</h2>
          {graficos.agendamentosPorSemana && renderBarChart(
            graficos.agendamentosPorSemana,
            (d) => d.week,
            (d) => d.count
          )}
        </Card>
      </div>

      <Card>
        <h2 className="text-lg font-semibold text-white mb-4">Erros do Sistema (hoje)</h2>
        <p className="text-2xl font-bold text-red-400">{graficos.errosSistema}</p>
        <p className="text-sm text-gray-400">Mensagens de erro detectadas hoje</p>
      </Card>
    </div>
  );
}
