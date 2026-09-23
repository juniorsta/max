'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { Card } from '@/components/Card';

interface KPIs {
  empresasAtivas: number;
  usuariosTotais: number;
  receitaMensal: number;
  receitaAcumulada?: number;
}

export default function DashboardPage() {
  const { token } = useAuth();
  const [kpis, setKpis] = useState<KPIs>({
    empresasAtivas: 48,
    usuariosTotais: 324,
    receitaMensal: 12853,
    receitaAcumulada: 48920
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/superadmin/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(r => r.json())
        .then(data => {
          if (data.kpis) setKpis({ ...kpis, ...data.kpis });
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [token]);

  const receitaAcumulada = kpis.receitaAcumulada || (kpis.empresasAtivas * 497 * 6);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0F172A]">
        <div className="text-[#818CF8] animate-pulse text-lg">Carregando dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-[32px] font-bold text-[#F8FAFC] tracking-tight">Dashboard Global</h1>
        <p className="text-[#94A3B8] mt-1">Interface completa do painel de Superadmin</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Empresas Ativas', value: kpis.empresasAtivas, change: '+10%', color: 'text-[#10B981]', bg: 'from-[#6366F1]/20 to-[#8B5CF6]/20' },
          { label: 'Usuários Totais', value: kpis.usuariosTotais, change: '+23', color: 'text-[#10B981]', bg: 'from-[#06B6D4]/20 to-[#2563EB]/20' },
          { label: 'Receita Mensal', value: `R$ ${kpis.receitaMensal.toLocaleString('pt-BR')}`, change: '+8%', color: 'text-[#10B981]', bg: 'from-[#10B981]/20 to-[#059669]/20' },
          { label: 'Receita Acumulada', value: `R$ ${receitaAcumulada.toLocaleString('pt-BR')}`, change: '', color: 'text-[#94A3B8]', bg: 'from-[#F59E0B]/20 to-[#EF4444]/20' },
        ].map((kpi, idx) => (
          <Card key={idx} className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-[#94A3B8]">{kpi.label}</p>
                <p className="text-[32px] font-bold text-[#F8FAFC] mt-2 leading-tight">{kpi.value}</p>
                {kpi.change && <p className={`text-sm mt-2 flex items-center gap-1 ${kpi.color}`}>↑ {kpi.change} vs mês anterior</p>}
                {!kpi.change && <p className="text-sm text-[#94A3B8] mt-2">Total acumulado</p>}
              </div>
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${kpi.bg} flex items-center justify-center`}></div>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-[20px] font-semibold text-[#F8FAFC] mb-6">Conversas nos últimos 7 dias</h2>
          <div className="h-64 flex items-end gap-3 px-2">
            {[45, 52, 48, 61, 55, 67, 72].map((h, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 group relative">
                <div 
                  className="w-full bg-gradient-to-t from-[#6366F1] to-[#818CF8] rounded-t-lg transition-all duration-300 hover:from-[#4F46E5] hover:to-[#6366F1]"
                  style={{ height: `${h}%` }}
                />
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-[#0F172A] px-2 py-1 rounded text-xs text-[#F8FAFC] border border-[#334155]">
                  {h * 12}
                </div>
                <span className="text-xs text-[#94A3B8] font-medium">D{idx+1}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-[20px] font-semibold text-[#F8FAFC] mb-6">Distribuição de Planos</h2>
          <div className="flex items-center justify-center h-64">
            <div className="relative w-48 h-48">
              <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#1E293B" strokeWidth="3" />
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#6366F1" strokeWidth="3" strokeDasharray={`${24} ${76}`} strokeDashoffset="0" />
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#06B6D4" strokeWidth="3" strokeDasharray={`${42} ${58}`} strokeDashoffset={`${-24}`} />
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#10B981" strokeWidth="3" strokeDasharray={`${34} ${66}`} strokeDashoffset={`${-66}`} />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-[32px] font-bold text-[#F8FAFC]">100%</span>
                <span className="text-xs text-[#94A3B8] mt-1">Distribuição</span>
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-6 mt-6">
            {[
              { label: 'Starter 24%', color: '#6366F1' },
              { label: 'Profissional 42%', color: '#06B6D4' },
              { label: 'Enterprise 34%', color: '#10B981' },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-sm text-[#94A3B8]">{item.label}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Companies Table */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[20px] font-semibold text-[#F8FAFC]">Empresas mais ativas</h2>
          <button className="text-sm text-[#818CF8] hover:text-[#6366F1] transition-colors">Ver todas →</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#334155]">
                <th className="text-left text-sm font-medium text-[#94A3B8] pb-3">Empresa</th>
                <th className="text-left text-sm font-medium text-[#94A3B8] pb-3">Leads</th>
                <th className="text-left text-sm font-medium text-[#94A3B8] pb-3">Conversas</th>
                <th className="text-left text-sm font-medium text-[#94A3B8] pb-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#334155]">
              {[
                { nome: 'AutoBike Estética', leads: 1234, conversas: 456, status: 'Ativo' },
                { nome: 'Detal Garage LTDA', leads: 987, conversas: 321, status: 'Ativo' },
                { nome: 'Prime Clean', leads: 876, conversas: 234, status: 'Ativo' },
                { nome: '22 Motors', leads: 654, conversas: 123, status: 'Pendente' },
              ].map((emp, idx) => (
                <tr key={idx} className="hover:bg-[#0F172A]/50 transition-colors">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center text-white font-bold">
                        {emp.nome[0]}
                      </div>
                      <span className="font-medium text-[#F8FAFC]">{emp.nome}</span>
                    </div>
                  </td>
                  <td className="py-4 text-[#94A3B8]">{emp.leads}</td>
                  <td className="py-4 text-[#94A3B8]">{emp.conversas}</td>
                  <td className="py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      emp.status === 'Ativo' ? 'bg-[#10B981]/20 text-[#10B981]' : 'bg-[#F59E0B]/20 text-[#F59E0B]'
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
