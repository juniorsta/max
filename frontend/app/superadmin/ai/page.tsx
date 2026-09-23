'use client';

import { Card } from '@/components/Card';

const modelos = [
  { nome: 'gemini-1.5-flash', provedor: 'Google', latencia: 120, custo: 'R$ 0.0003/1K tokens', status: 'online' },
  { nome: 'claude-3-haiku', provedor: 'Anthropic', latencia: 200, custo: 'R$ 0.0004/1K tokens', status: 'online' },
  { nome: 'gpt-4o-mini', provedor: 'OpenAI', latencia: 150, custo: 'R$ 0.0005/1K tokens', status: 'online' },
  { nome: 'llama-3.1', provedor: 'Meta', latencia: 180, custo: 'R$ 0.0001/1K tokens', status: 'online' },
  { nome: 'mistral-medium', provedor: 'Mistral', latencia: 220, custo: 'R$ 0.0003/1K tokens', status: 'degraded' },
  { nome: 'qwen-2.5', provedor: 'Alibaba', latencia: 190, custo: 'R$ 0.0002/1K tokens', status: 'offline' },
];

export default function AIPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[32px] font-bold text-[#F3F4F6]">IA & Modelos</h1>
        <p className="text-[#9CA3AF] mt-1">Gerencie os provedores e modelos de IA</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Provedores Conectados', value: '4', icon: '🔌', color: 'text-[#8B5CF6]' },
          { label: 'Modelos Disponíveis', value: '12', icon: '🤖', color: 'text-[#2563EB]' },
          { label: 'Taxa de Sucesso', value: '89%', icon: '✅', color: 'text-[#10B981]' },
          { label: 'Requisições/min', value: '156', icon: '⚡', color: 'text-[#F59E0B]' },
        ].map((item, idx) => (
          <Card key={idx} className="p-6 bg-[#1E293B] border-[#1E293B] rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#9CA3AF]">{item.label}</p>
                <p className={`text-[32px] font-bold mt-2 ${item.color}`}>{item.value}</p>
              </div>
              <span className="text-3xl">{item.icon}</span>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-6 bg-[#1E293B] border-[#1E293B] rounded-xl">
        <h2 className="text-[20px] font-semibold text-[#F3F4F6] mb-4">Modelos de IA</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1E293B]">
                {['Modelo', 'Provedor', 'Latência', 'Custo por 1K tokens', 'Status'].map(h => (
                  <th key={h} className="text-left text-sm font-medium text-[#9CA3AF] pb-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E293B]">
              {modelos.map((m, idx) => (
                <tr key={idx} className="hover:bg-[#111827]/50">
                  <td className="py-4 font-mono text-sm text-[#F3F4F6]">{m.nome}</td>
                  <td className="py-4 text-[#9CA3AF]">{m.provedor}</td>
                  <td className="py-4 text-[#9CA3AF]">{m.latencia}ms</td>
                  <td className="py-4 text-[#9CA3AF] text-sm">{m.custo}</td>
                  <td className="py-4">
                    <span className={`px-3 py-1 rounded-full text-xs ${
                      m.status === 'online' ? 'bg-[#10B981]/20 text-[#10B981]' :
                      m.status === 'degraded' ? 'bg-[#F59E0B]/20 text-[#F59E0B]' :
                      'bg-[#EF4444]/20 text-[#EF4444]'
                    }`}>
                      {m.status === 'online' ? '🟢 Online' : m.status === 'degraded' ? '🟡 Degradado' : '🔴 Offline'}
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
