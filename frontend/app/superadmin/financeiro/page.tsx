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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Financeiro</h1>
          <p className="text-slate-400 mt-1">Acompanhe receitas, despesas e lucros</p>
        </div>
        <div className="flex gap-2">
          <select className="bg-[#0F172A] border border-[#334155] rounded-lg px-3 py-2 text-white text-sm">
            <option>Este mês</option>
            <option>Mês anterior</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <p className="text-sm text-slate-400">Receita Total</p>
          <p className="text-3xl font-bold text-white mt-1">R$ 148.500</p>
        </Card>
        <Card>
          <p className="text-sm text-slate-400">Receitas</p>
          <p className="text-3xl font-bold text-green-400 mt-1">R$ 142.300</p>
        </Card>
        <Card>
          <p className="text-sm text-slate-400">Despesas</p>
          <p className="text-3xl font-bold text-red-400 mt-1">R$ 18.200</p>
        </Card>
        <Card>
          <p className="text-sm text-slate-400">Lucro</p>
          <p className="text-3xl font-bold text-white mt-1">R$ 124.100</p>
        </Card>
      </div>

      <Card>
        <h2 className="text-lg font-semibold text-white mb-4">Últimas Transações</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 border-b border-[#334155]">
                <th className="pb-3 pr-4">Data</th>
                <th className="pb-3 pr-4">Descrição</th>
                <th className="pb-3 pr-4">Tipo</th>
                <th className="pb-3 pr-4">Valor</th>
                <th className="pb-3">Saldo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#334155]">
              {transacoes.map((t, idx) => (
                <tr key={idx} className="hover:bg-[#0F172A]/50">
                  <td className="py-3 pr-4 text-slate-400">{t.data}</td>
                  <td className="py-3 pr-4 text-white">{t.descricao}</td>
                  <td className="py-3 pr-4">
                    <span className={`px-2 py-0.5 rounded text-xs ${
                      t.tipo === 'receita' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {t.tipo === 'receita' ? 'Receita' : 'Despesa'}
                    </span>
                  </td>
                  <td className={`py-3 pr-4 font-medium ${t.valor >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {t.valor >= 0 ? '+' : ''}R$ {t.valor.toFixed(2)}
                  </td>
                  <td className="py-3 text-slate-400">R$ {t.saldo.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
