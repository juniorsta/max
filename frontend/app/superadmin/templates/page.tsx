'use client';

import { Card } from '@/components/Card';
import { Button } from '@/components/Button';

const templates = [
  { nome: 'Dashboard', desc: 'Layout principal com gráficos e métricas', popular: true },
  { nome: 'Formulário', desc: 'Formulário de cadastro com validação', popular: false, novo: true },
  { nome: 'Tabela', desc: 'Tabela avançada com filtros e paginação', popular: false },
  { nome: 'Kanban', desc: 'Quadro kanban para gestão de projetos', popular: true },
  { nome: 'Chat', desc: 'Interface de chat em tempo real', popular: false },
  { nome: 'Relatório', desc: 'Relatório com exportação PDF/Excel', popular: false },
];

export default function TemplatesPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-[32px] font-bold text-[#F3F4F6]">Templates</h1>
          <p className="text-[#9CA3AF] mt-1">Templates prontos para uso rápido</p>
        </div>
        <Button className="bg-[#8B5CF6] hover:bg-[#7C3AED]">+ Novo Template</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((t, idx) => (
          <Card key={idx} className="p-6 bg-[#1E293B] border-[#1E293B] rounded-xl hover:border-[#8B5CF6]/50 transition-colors cursor-pointer">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#8B5CF6]/20 to-[#2563EB]/20 flex items-center justify-center">
                <span className="text-2xl">📋</span>
              </div>
              <div className="flex gap-1">
                {t.popular && <span className="px-2 py-1 rounded-full text-xs bg-[#10B981]/20 text-[#10B981]">Popular</span>}
                {t.novo && <span className="px-2 py-1 rounded-full text-xs bg-[#2563EB]/20 text-[#2563EB]">Novo</span>}
              </div>
            </div>
            <h3 className="font-semibold text-[#F3F4F6]">{t.nome}</h3>
            <p className="text-sm text-[#9CA3AF] mt-1">{t.desc}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
