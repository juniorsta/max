'use client';

import { useEffect, useState } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { Card } from '@/components/Card';
import { api } from '@/lib/api';

interface Metrics {
  leads: { total: number; hoje: number; semana: number; mes: number; porEtapa: { etapa: string; count: number }[] };
  agendamentos: { pendentes: number };
  conversas: { hoje: number };
  conversao: string;
}

interface Activity {
  leads: any[];
  conversas: any[];
  agendamentos: any[];
}

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [activity, setActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get<Metrics>('/api/v1/dashboard/metrics'),
      api.get<Activity>('/api/v1/dashboard/activity'),
    ])
      .then(([m, a]) => { setMetrics(m); setActivity(a); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64">Carregando...</div>;

  const etapaColors: Record<string, string> = {
    novo: 'bg-blue-500',
    contato: 'bg-yellow-500',
    proposta: 'bg-purple-500',
    agendado: 'bg-green-500',
    fechado: 'bg-gray-500',
    perdido: 'bg-red-500',
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Dashboard</h1>
            <p className="text-gray-400">Visão geral da sua estética</p>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total de Leads</p>
                <p className="text-3xl font-bold text-white">{metrics?.leads.total || 0}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <span className="text-2xl">👥</span>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Leads Hoje</p>
                <p className="text-3xl font-bold text-white">{metrics?.leads.hoje || 0}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                <span className="text-2xl">📈</span>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Agendamentos Pendentes</p>
                <p className="text-3xl font-bold text-white">{metrics?.agendamentos.pendentes || 0}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                <span className="text-2xl">📅</span>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Conversão</p>
                <p className="text-3xl font-bold text-white">{metrics?.conversao || '0%'}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <span className="text-2xl">🎯</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Leads por Etapa + Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Kanban Summary */}
          <Card className="lg:col-span-2">
            <h3 className="text-lg font-semibold mb-4">Leads por Etapa</h3>
            <div className="flex flex-wrap gap-3">
              {metrics?.leads.porEtapa.map((e) => (
                <div
                  key={e.etapa}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${etapaColors[e.etapa] || 'bg-gray-600'} text-white`}
                >
                  {e.etapa.charAt(0).toUpperCase() + e.etapa.slice(1)}: {e.count}
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Stats */}
          <Card>
            <h3 className="text-lg font-semibold mb-4">Resumo do Mês</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Esta Semana</span>
                <span className="font-medium">{metrics?.leads.semana}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Este Mês</span>
                <span className="font-medium">{metrics?.leads.mes}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Conversas Hoje</span>
                <span className="font-medium">{metrics?.conversas.hoje}</span>
              </div>
              <div className="pt-2 border-t border-gray-800 flex justify-between text-sm">
                <span className="text-gray-400">Taxa Conversão</span>
                <span className="font-medium text-purple-400">{metrics?.conversao}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <h3 className="text-lg font-semibold mb-4">Atividade Recente</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-400 border-b border-gray-800">
                  <th className="pb-2">Tipo</th>
                  <th className="pb-2">Descrição</th>
                  <th className="pb-2">Lead</th>
                  <th className="pb-2">Data</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {[
                  ...(activity?.leads.slice(0, 5).map(l => ({
                    tipo: 'Novo Lead',
                    desc: `${l.etapa}`,
                    lead: l.nome || l.telefone,
                    data: new Date(l.createdAt).toLocaleString('pt-BR'),
                  })) || []),
                  ...(activity?.conversas.slice(0, 3).map(c => ({
                    tipo: c.direction === 'incoming' ? 'Msg Recebida' : 'Msg Enviada',
                    desc: c.mensagem.slice(0, 50) + '...',
                    lead: c.lead?.nome || c.leadId,
                    data: new Date(c.timestamp).toLocaleString('pt-BR'),
                  })) || []),
                  ...(activity?.agendamentos.slice(0, 3).map(a => ({
                    tipo: 'Agendamento',
                    desc: `${a.status}`,
                    lead: a.lead?.nome || a.leadId,
                    data: new Date(a.data).toLocaleString('pt-BR'),
                  })) || []),
                ].sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()).slice(0, 10).map((row, i) => (
                  <tr key={i} className="hover:bg-gray-800/50">
                    <td className="py-2"><span className="px-2 py-0.5 text-xs rounded bg-gray-800">{row.tipo}</span></td>
                    <td className="py-2 text-gray-300 max-w-xs truncate">{row.desc}</td>
                    <td className="py-2 font-medium">{row.lead}</td>
                    <td className="py-2 text-gray-500">{row.data}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}