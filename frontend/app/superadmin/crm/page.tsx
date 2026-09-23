'use client';

import { Card } from '@/components/Card';

const colunas = [
  { nome: 'Novo Lead', cor: 'border-[#10B981]', cards: [
    { empresa: 'AutoCenter Estrela', contato: 'João Silva', valor: 'R$ 15.000', prioridade: 'Alta' },
    { empresa: 'Prime Clean', contato: 'Ana Costa', valor: 'R$ 8.500', prioridade: 'Média' },
  ]},
  { nome: 'Qualificação', cor: 'border-[#F59E0B]', cards: [
    { empresa: 'DataGarage LTDA', contato: 'Maria Santos', valor: 'R$ 12.000', prioridade: 'Média' },
  ]},
  { nome: 'Proposta', cor: 'border-[#F59E0B]', cards: [
    { empresa: '22 Motors', contato: 'Carlos Oliveira', valor: 'R$ 9.800', prioridade: 'Alta' },
  ]},
  { nome: 'Negociação', cor: 'border-[#EF4444]', cards: [
    { empresa: 'Detal Garage', contato: 'Lucas Ferreira', valor: 'R$ 18.000', prioridade: 'Alta' },
  ]},
  { nome: 'Fechamento', cor: 'border-[#8B5CF6]', cards: [
    { empresa: 'AutoBike Estética', contato: 'Pedro Alves', valor: 'R$ 25.000', prioridade: 'Alta' },
  ]},
];

export default function CRMPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[32px] font-bold text-[#F3F4F6]">CRM Kanban</h1>
        <p className="text-[#9CA3AF] mt-1">Gerencie o funil de vendas</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 overflow-x-auto">
        {colunas.map((col, colIdx) => (
          <div key={colIdx} className="min-w-[280px]">
            <div className={`border-t-4 ${col.cor} bg-[#1E293B] rounded-lg p-4 border border-[#1E293B]`}>
              <h3 className="font-semibold text-[#F3F4F6] mb-3">{col.nome}</h3>
              <div className="space-y-3">
                {col.cards.map((card, cardIdx) => (
                  <Card key={cardIdx} className="p-4 bg-[#111827] border-[#1E293B] rounded-lg hover:border-[#8B5CF6]/50 transition-colors cursor-move">
                    <p className="font-medium text-[#F3F4F6] text-sm">{card.empresa}</p>
                    <p className="text-xs text-[#9CA3AF] mt-1">{card.contato}</p>
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-sm font-semibold text-[#10B981]">{card.valor}</span>
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        card.prioridade === 'Alta' ? 'bg-[#EF4444]/20 text-[#EF4444]' :
                        'bg-[#F59E0B]/20 text-[#F59E0B]'
                      }`}>{card.prioridade}</span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
