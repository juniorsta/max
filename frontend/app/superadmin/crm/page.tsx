'use client';

import { Card } from '@/components/Card';

const colunas = [
  { nome: 'Novo Lead', cor: 'bg-green-500/20 border-green-500/30', cards: 12 },
  { nome: 'Qualificação', cor: 'bg-yellow-500/20 border-yellow-500/30', cards: 8 },
  { nome: 'Proposta', cor: 'bg-orange-500/20 border-orange-500/30', cards: 6 },
  { nome: 'Negociação', cor: 'bg-red-500/20 border-red-500/30', cards: 4 },
  { nome: 'Fechamento', cor: 'bg-purple-500/20 border-purple-500/30', cards: 3 },
];

const leads = [
  { empresa: 'AutoCenter Estrela', contato: 'João Silva', valor: 'R$ 15.000', prioridade: 'Alta' },
  { empresa: 'DataGarage LTDA', contato: 'Maria Santos', valor: 'R$ 8.500', prioridade: 'Média' },
  { empresa: 'Prime Clean', contato: 'Carlos Oliveira', valor: 'R$ 12.000', prioridade: 'Baixa' },
];

export default function CRMPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">CRM Kanban</h1>
        <p className="text-slate-400 mt-1">Gerencie o funil de vendas</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {colunas.map((col, idx) => (
          <div key={idx} className={`rounded-xl border ${col.cor} p-4`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-white">{col.nome}</h2>
              <span className="text-xs text-slate-400">{col.cards}</span>
            </div>
            <div className="space-y-3">
              {leads.slice(0, idx + 1).map((lead, lidx) => (
                <Card key={lidx} className="cursor-move hover:border-purple-500/50">
                  <p className="font-medium text-white text-sm">{lead.empresa}</p>
                  <p className="text-xs text-slate-400 mt-1">{lead.contato}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-green-400 font-medium">{lead.valor}</span>
                    <span className={`px-2 py-0.5 rounded text-xs ${
                      lead.prioridade === 'Alta' ? 'bg-red-500/20 text-red-400' :
                      lead.prioridade === 'Média' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-green-500/20 text-green-400'
                    }`}>{lead.prioridade}</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
