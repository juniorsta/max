'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { Card } from '@/components/Card';

interface KPIs {
  empresasAtivas: number;
  usuariosTotais: number;
  receitaMensal: number;
  receitaAcumulada?: number;
  leadsHoje: number;
  conversasHoje: number;
}

interface Graficos {
  conversasPorDia: { date: string; count: number }[];
}

export default function DashboardPage() {
  const { token } = useAuth();
  const [data, setData] = useState<{ kpis: KPIs, graficos: Graficos } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) fetchDashboard();
  }, [token]);

  const fetchDashboard = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/superadmin/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const result = await res.json();
      setData(result);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0F172A]">
        <div className="text-purple-400 animate-pulse">Carregando dashboard...</div>
      </div>
    );
  }

  if (!data) return null;

  const { kpis, graficos } = data;
  const receitaAcumulada = kpis.receitaAcumulada || (kpis.empresasAtivas * 497 * 6);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard Global</h1>
          <p className="text-slate-400 mt-1">Interface completa do painel de Superadmin</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400">Empresas Ativas</p>
              <p className="text-4xl font-bold text-white mt-2">{kpis.empresasAtivas || 0}</p>
              <p className="text-sm text-green-400 mt-2">↑ +10% vs mês anterior</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600/20 to-indigo-600/20 flex items-center justify-center">
              <span className="text-2xl">🏢</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400">Usuários Totais</p>
              <p className="text-4xl font-bold text-white mt-2">{kpis.usuariosTotais || 0}</p>
              <p className="text-sm text-green-400 mt-2">↑ +23 vs mês anterior</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-600/20 to-blue-600/20 flex items-center justify-center">
              <span className="text-2xl">👥</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400">Receita Mensal</p>
              <p className="text-4xl font-bold text-white mt-2">R$ {(kpis.receitaMensal || 0).toLocaleString('pt-BR')}</p>
              <p className="text-sm text-green-400 mt-2">↑ +8% vs mês anterior</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-600/20 to-emerald-600/20 flex items-center justify-center">
              <span className="text-2xl">💰</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400">Receita Acumulada</p>
              <p className="text-4xl font-bold text-white mt-2">R$ {receitaAcumulada.toLocaleString('pt-BR')}</p>
              <p className="text-sm text-slate-400 mt-2">Total acumulado</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-600/20 to-orange-600/20 flex items-center justify-center">
              <span className="text-2xl">📊</span>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-white mb-6">Conversas nos últimos 7 dias</h2>
          <div className="h-64 flex items-end justify-between gap-3 px-2">
            {graficos.conversasPorDia?.slice(-7).map((item, idx) => {
              const max = Math.max(...(graficos.conversasPorDia?.map(d => d.count) || [1]));
              const height = max > 0 ? (item.count / max) * 100 : 0;
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                  <div 
                    className="w-full bg-gradient-to-t from-purple-600 to-cyan-400 rounded-t-lg transition-all duration-500 hover:from-purple-500 hover:to-cyan-300 group relative"
                    style={{ height: `${height}%`, minHeight: '8px' }}
                  />
                  <span className="text-xs text-slate-500 font-medium">
                    {new Date(item.date).toLocaleDateString('pt-BR', { weekday: 'short' })}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold text-white mb-6">Distribuição de Planos</h2>
          <div className="flex items-center justify-center h-64">
            <div className="relative">
              <svg viewBox="0 0 36 36" className="w-48 h-48">
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#6366F1" strokeWidth="3" strokeDasharray="42, 100"/>
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#06B6D4" strokeWidth="3" strokeDasharray="34, 100" strokeDashoffset="-42"/>
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#10B981" strokeWidth="3" strokeDasharray="24, 100" strokeDashoffset="-76"/>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-4xl font-bold text-white">100%</p>
                  <p className="text-xs text-slate-400 mt-1">Distribuição</p>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
              <span className="text-sm text-slate-400">Starter 24%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-cyan-500"></div>
              <span className="text-sm text-slate-400">Pro 42%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              <span className="text-sm text-slate-400">Enterprise 34%</span>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-white">Empresas mais ativas</h2>
          <button className="text-sm text-purple-400 hover:text-purple-300">Ver todas →</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="text-left text-sm font-medium text-slate-400 pb-3">Empresa</th>
                <th className="text-left text-sm font-medium text-slate-400 pb-3">Leads</th>
                <th className="text-left text-sm font-medium text-slate-400 pb-3">Conversas</th>
                <th className="text-left text-sm font-medium text-slate-400 pb-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {[
                { nome: 'AutoBike Estética', leads: 1234, conversas: 456, status: 'Ativo' },
                { nome: 'Detal Garage LTDA', leads: 987, conversas: 321, status: 'Ativo' },
                { nome: 'Prime Clean', leads: 876, conversas: 234, status: 'Ativo' },
                { nome: '22 Motors', leads: 654, conversas: 123, status: 'Pendente' },
              ].map((emp, idx) => (
                <tr key={idx} className="hover:bg-slate-800/50 transition-colors">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                        {emp.nome[0]}
                      </div>
                      <span className="text-white font-medium">{emp.nome}</span>
                    </div>
                  </td>
                  <td className="py-4 text-slate-300">{emp.leads}</td>
                  <td className="py-4 text-slate-300">{emp.conversas}</td>
                  <td className="py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      emp.status === 'Ativo' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {emp.status === 'Ativo' ? '🟢 ' : '🟡 '}{emp.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
