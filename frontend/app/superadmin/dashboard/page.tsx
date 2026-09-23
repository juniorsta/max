'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { Card } from '@/components/Card';
import { Input } from '@/components/Input';

interface KPIs {
  empresasAtivas: number;
  usuariosTotais: number;
  receitaMensal: number;
  receitaAcumulada?: number;
  churn: number;
  leadsHoje: number;
  conversasHoje: number;
}

interface Graficos {
  conversasPorDia: { date: string; count: number }[];
  crescimentoClientes: { month: string; count: number }[];
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
      <div className="flex items-center justify-center h-64">
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
          <h1 className="text-2xl font-bold text-white">Dashboard Global</h1>
          <p className="text-slate-400 mt-1">Visão geral completa da plataforma KERA</p>
        </div>
        <Input 
          placeholder="Buscar..." 
          className="max-w-xs bg-[#0F172A] border-[#334155] text-white"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:border-purple-500/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Empresas Ativas</p>
              <p className="text-3xl font-bold text-white mt-1">{kpis.empresasAtivas || 0}</p>
              <p className="text-xs text-green-400 mt-1">+10% vs mês anterior</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center text-2xl">🏢</div>
          </div>
        </Card>

        <Card className="hover:border-cyan-500/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Usuários Totais</p>
              <p className="text-3xl font-bold text-white mt-1">{kpis.usuariosTotais || 0}</p>
              <p className="text-xs text-green-400 mt-1">+23 vs mês anterior</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-cyan-500/20 flex items-center justify-center text-2xl">👥</div>
          </div>
        </Card>

        <Card className="hover:border-green-500/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Receita Mensal</p>
              <p className="text-3xl font-bold text-white mt-1">R$ {(kpis.receitaMensal || 0).toLocaleString('pt-BR')}</p>
              <p className="text-xs text-green-400 mt-1">+8% vs mês anterior</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center text-2xl">💰</div>
          </div>
        </Card>

        <Card className="hover:border-yellow-500/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Receita Acumulada</p>
              <p className="text-3xl font-bold text-white mt-1">R$ {receitaAcumulada.toLocaleString('pt-BR')}</p>
              <p className="text-xs text-slate-400 mt-1">Total acumulado</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-yellow-500/20 flex items-center justify-center text-2xl">📈</div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-lg font-semibold text-white mb-4">Conversas nos últimos 7 dias</h2>
          <div className="h-48 flex items-end gap-2 px-4">
            {graficos.conversasPorDia?.slice(-7).map((item, idx) => {
              const max = Math.max(...(graficos.conversasPorDia?.map(d => d.count) || [1]));
              const height = max > 0 ? (item.count / max) * 100 : 0;
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                  <div 
                    className="w-full bg-gradient-to-t from-purple-600 to-cyan-400 rounded-t transition-all duration-500"
                    style={{ height: `${height}%`, minHeight: '4px' }}
                  />
                  <span className="text-xs text-slate-500">{new Date(item.date).toLocaleDateString('pt-BR', { weekday: 'short' })}</span>
                </div>
              );
            })}
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-white mb-4">Distribuição de Planos</h2>
          <div className="flex items-center justify-center h-48">
            <div className="relative w-32 h-32">
              <svg viewBox="0 0 36 36" className="w-full h-full">
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#6366F1" strokeWidth="3" strokeDasharray="42, 100"/>
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#06B6D4" strokeWidth="3" strokeDasharray="34, 100" strokeDashoffset="-42"/>
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#10B981" strokeWidth="3" strokeDasharray="24, 100" strokeDashoffset="-76"/>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white font-bold text-lg">100%</span>
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-6 mt-4">
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

      <Card>
        <h2 className="text-lg font-semibold text-white mb-4">Empresas Mais Ativas</h2>
        <div className="space-y-3">
          {[
            { nome: 'AutoBike Estética', leads: 1234, conversas: 456 },
            { nome: 'Detal Garage LTDA', leads: 987, conversas: 321 },
            { nome: 'Prime Clean', leads: 876, conversas: 234 },
            { nome: '22 Motors', leads: 654, conversas: 123 },
          ].map((emp, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-[#0F172A] rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold">
                  {emp.nome[0]}
                </div>
                <span className="text-white font-medium">{emp.nome}</span>
              </div>
              <div className="flex gap-6 text-sm">
                <span className="text-slate-400">Leads: <span className="text-white">{emp.leads}</span></span>
                <span className="text-slate-400">Conversas: <span className="text-white">{emp.conversas}</span></span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
