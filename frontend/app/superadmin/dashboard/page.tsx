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

  useEffect(() => {
    if (token) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/superadmin/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(r => r.json()).then(data => {
        if (data.kpis) setKpis({ ...kpis, ...data.kpis });
      }).catch(() => {});
    }
  }, [token]);

  const receitaAcumulada = kpis.receitaAcumulada || (kpis.empresasAtivas * 497 * 6);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[32px] font-bold text-[#F3F4F6]">Dashboard Global</h1>
        <p className="text-[#9CA3AF] mt-1">Interface completa do painel de Superadmin</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Empresas Ativas', value: kpis.empresasAtivas, change: '+10%', color: 'text-[#10B981]', bg: 'from-purple-600/20 to-indigo-600/20' },
          { label: 'Usuários Totais', value: kpis.usuariosTotais, change: '+23', color: 'text-[#10B981]', bg: 'from-cyan-600/20 to-blue-600/20' },
          { label: 'Receita Mensal', value: `R$ ${kpis.receitaMensal.toLocaleString('pt-BR')}`, change: '+8%', color: 'text-[#10B981]', bg: 'from-green-600/20 to-emerald-600/20' },
          { label: 'Receita Acumulada', value: `R$ ${receitaAcumulada.toLocaleString('pt-BR')}`, change: '', color: 'text-[#9CA3AF]', bg: 'from-yellow-600/20 to-orange-600/20' },
        ].map((kpi, idx) => (
          <Card key={idx} className="p-6 bg-[#1E293B] border-[#1E293B] rounded-xl">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-[#9CA3AF]">{kpi.label}</p>
                <p className="text-[32px] font-bold text-[#F3F4F6] mt-2">{kpi.value}</p>
                {kpi.change && <p className={`text-sm mt-2 flex items-center gap-1 ${kpi.color}`}>↑ {kpi.change} vs mês anterior</p>}
              </div>
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${kpi.bg} flex items-center justify-center`}></div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 bg-[#1E293B] border-[#1E293B] rounded-xl">
          <h2 className="text-[20px] font-semibold text-[#F3F4F6] mb-6">Conversas nos últimos 7 dias</h2>
          <div className="h-64 flex items-end gap-3">
            {[45, 52, 48, 61, 55, 67, 72].map((h, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full bg-gradient-to-t from-[#8B5CF6] to-[#2563EB] rounded-t-lg" style={{ height: `${h}%` }} />
                <span className="text-xs text-[#9CA3AF]">D{idx+1}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 bg-[#1E293B] border-[#1E293B] rounded-xl">
          <h2 className="text-[20px] font-semibold text-[#F3F4F6] mb-6">Distribuição de Planos</h2>
          <div className="flex items-center justify-center h-64">
            <div className="relative w-48 h-48">
              <svg viewBox="0 0 36 36" className="w-full h-full">
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#1E293B" strokeWidth="3" />
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#8B5CF6" strokeWidth="3" strokeDasharray={`${24} ${76}`} strokeDashoffset="0" />
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#2563EB" strokeWidth="3" strokeDasharray={`${42} ${58}`} strokeDashoffset={`${-24}`} />
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#10B981" strokeWidth="3" strokeDasharray={`${34} ${66}`} strokeDashoffset={`${-66}`} />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-[32px] font-bold text-[#F3F4F6]">100%</span>
                <span className="text-xs text-[#9CA3AF] mt-1">Distribuição</span>
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-6 mt-6">
            {[
              { label: 'Starter 24%', color: '#8B5CF6' },
              { label: 'Profissional 42%', color: '#2563EB' },
              { label: 'Enterprise 34%', color: '#10B981' },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-sm text-[#9CA3AF]">{item.label}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
