'use client';

import { Card } from '@/components/Card';

const transacoes = [
  { data: '15/09/2025', descricao: 'Premium Clean - Mensalidade', tipo: 'receita', valor: 197.00, saldo: 148500 },
  { data: '14/09/2025', descricao: 'AutoBike Estética - Mensalidade', tipo: 'receita', valor: 197.00, saldo: 148303 },
  { data: '13/09/2025', descricao: 'Serviço Evolution API', tipo: 'despesa', valor: -45.50, saldo: 148106 },
  { data: '12/09/2025', descricao: 'DataGarage LTDA - Mensalidade', tipo: 'receita', valor: 397.00, saldo: 148151.50 },
];

export default function FinanceiroPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[32px] font-bold text-[#F8FAFC]">Financeiro</h1>
        <p className="text-[#94A3B8] mt-1">Acompanhe receitas, despesas e lucros</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Receita Total', value: 'R$ 148.500', icon: '💰' },
          { label: 'Receitas', value: 'R$ 142.300', icon: '📈', color: 'text-[#10B981]' },
          { label: 'Despesas', value: 'R$ 18.200', icon: '📉', color: 'text-[#EF4444]' },
          { label: 'Lucro', value: 'R$ 124.100', icon: '💎' },
        ].map((item, idx) => (
          <Card key={idx} className="p-6 bg-[#1E293B] border-[#1E293B] rounded-xl">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-[#94A3B8]">{item.label}</p>
                <p className={`text-[32px] font-bold mt-2 ${item.color || 'text-[#F8FAFC]'}`}>{item.value}</p>
              </div>
              <span className="text-2xl">{item.icon}</span>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-6 bg-[#1E293B] border-[#1E293B] rounded-xl">
        <h2 className="text-[20px] font-semibold text-[#F8FAFC] mb-4">Histórico de Transações</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1E293B]">
                {['Data', 'Descrição', 'Tipo', 'Valor', 'Saldo'].map(h => (
                  <th key={h} className="text-left text-sm font-medium text-[#94A3B8] pb-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E293B]">
              {transacoes.map((t, idx) => (
                <tr key={idx} className="hover:bg-[#0F172A]/50">
                  <td className="py-3 text-[#94A3B8]">{t.data}</td>
                  <td className="py-3 text-[#F8FAFC]">{t.descricao}</td>
                  <td className="py-3">
                    <span className={`px-3 py-1 rounded-full text-xs ${t.tipo === 'receita' ? 'bg-[#10B981]/20 text-[#10B981]' : 'bg-[#EF4444]/20 text-[#EF4444]'}`}>
                      {t.tipo === 'receita' ? 'Receita' : 'Despesa'}
                    </span>
                  </td>
                  <td className={`py-3 font-medium ${t.valor >= 0 ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
                    {t.valor >= 0 ? '+' : ''}R$ {t.valor.toFixed(2)}
                  </td>
                  <td className="py-3 text-[#94A3B8]">R$ {t.saldo.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
