'use client';

import { Card } from '@/components/Card';

const modelos = [
  { nome: 'gemini-1.5-flash', provedor: 'Google', latencia: 120, status: 'online' },
  { nome: 'claude-3-haiku', provedor: 'Anthropic', latencia: 200, status: 'online' },
  { nome: 'gpt-4o-mini', provedor: 'OpenAI', latencia: 150, status: 'online' },
  { nome: 'llama-3.1', provedor: 'Meta', latencia: 180, status: 'online' },
  { nome: 'mistral-medium', provedor: 'Mistral', latencia: 220, status: 'degraded' },
  { nome: 'qwen-2.5', provedor: 'Alibaba', latencia: 190, status: 'offline' },
];

export default function AIPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">IA & Modelos</h1>
        <p className="text-slate-400 mt-1">Gerencie os provedores e modelos de IA</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <p className="text-sm text-slate-400">Provedores Conectados</p>
          <p className="text-3xl font-bold text-white mt-1">4</p>
        </Card>
        <Card>
          <p className="text-sm text-slate-400">Modelos Disponíveis</p>
          <p className="text-3xl font-bold text-white mt-1">12</p>
        </Card>
        <Card>
          <p className="text-sm text-slate-400">Taxa de Sucesso</p>
          <p className="text-3xl font-bold text-green-400 mt-1">89%</p>
        </Card>
        <Card>
          <p className="text-sm text-slate-400">Requisições/min</p>
          <p className="text-3xl font-bold text-white mt-1">156</p>
        </Card>
      </div>

      <Card>
        <h2 className="text-lg font-semibold text-white mb-4">Modelos de IA</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 border-b border-[#334155]">
                <th className="pb-3 pr-4">Modelo</th>
                <th className="pb-3 pr-4">Provedor</th>
                <th className="pb-3 pr-4">Latência</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#334155]">
              {modelos.map((m, idx) => (
                <tr key={idx} className="hover:bg-[#0F172A]/50">
                  <td className="py-3 pr-4 font-medium text-white">{m.nome}</td>
                  <td className="py-3 pr-4 text-slate-400">{m.provedor}</td>
                  <td className="py-3 pr-4 text-slate-400">{m.latencia}ms</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      m.status === 'online' ? 'bg-green-500/20 text-green-400' :
                      m.status === 'degraded' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {m.status === 'online' ? '🟢 Online' :
                       m.status === 'degraded' ? '🟡 Degradado' : '🔴 Offline'}
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
