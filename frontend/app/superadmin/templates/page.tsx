'use client';

import { Card } from '@/components/Card';

const templates = [
  { name: 'Dashboard', desc: 'Layout principal com gráficos e métricas', popular: true },
  { name: 'Formulário', desc: 'Formulário de cadastro com validação', popular: false, novo: true },
  { name: 'Tabela', desc: 'Tabela avançada com filtros e paginação', popular: false },
  { name: 'Kanban', desc: 'Quadro kanban para gestão de projetos', popular: false },
  { name: 'Chat', desc: 'Interface de chat em tempo real', popular: false },
  { name: 'Relatório', desc: 'Relatório com exportação PDF/Excel', popular: false },
];

export default function TemplatesPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Templates</h1>
          <p className="text-slate-400 mt-1">Templates prontos para uso rápido</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((t, idx) => (
          <Card key={idx} className="hover:border-purple-500/50 cursor-pointer">
            <div className="flex justify-between items-start mb-3">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500/20 to-indigo-500/20 flex items-center justify-center text-2xl">
                📋
              </div>
              <div className="flex gap-1">
                {t.popular && (
                  <span className="px-2 py-0.5 rounded-full text-xs bg-green-500/20 text-green-400">Popular</span>
                )}
                {t.novo && (
                  <span className="px-2 py-0.5 rounded-full text-xs bg-cyan-500/20 text-cyan-400">Novo</span>
                )}
              </div>
            </div>
            <h3 className="font-semibold text-white">{t.name}</h3>
            <p className="text-sm text-slate-400 mt-1">{t.desc}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
