'use client';

import { Card } from '@/components/Card';

export default function MonitoramentoPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-[32px] font-bold text-[#F3F4F6]">Monitoramento</h1>
          <p className="text-[#9CA3AF] mt-1">Status em tempo real dos recursos e containers</p>
        </div>
        <span className="text-sm text-[#9CA3AF]">Atualizado: {new Date().toLocaleTimeString('pt-BR')}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'CPU', value: '12%', unit: '', max: 100, color: 'from-[#10B981] to-[#059669]', width: '12%' },
          { label: 'Memória', value: '42%', unit: '/ 16 GB', max: 100, color: 'from-[#2563EB] to-[#1D4ED8]', width: '42%' },
          { label: 'Disco', value: '68%', unit: '/ 500 GB', max: 100, color: 'from-[#F59E0B] to-[#D97706]', width: '68%' },
          { label: 'Rede', value: '2.4', unit: ' GB/s', max: 10, color: 'from-[#8B5CF6] to-[#7C3AED]', width: '24%' },
        ].map((item, idx) => (
          <Card key={idx} className="p-6 bg-[#1E293B] border-[#1E293B] rounded-xl">
            <p className="text-sm text-[#9CA3AF]">{item.label}</p>
            <div className="flex items-end gap-2 mt-2">
              <span className="text-[32px] font-bold text-[#F3F4F6]">{item.value}</span>
              <span className="text-sm text-[#9CA3AF] mb-1">{item.unit}</span>
            </div>
            <div className="h-2 bg-[#111827] rounded-full mt-4 overflow-hidden">
              <div className={`h-full bg-gradient-to-r ${item.color} rounded-full`} style={{ width: item.width }} />
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-6 bg-[#1E293B] border-[#1E293B] rounded-xl">
        <h2 className="text-[20px] font-semibold text-[#F3F4F6] mb-4">Containers Docker</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1E293B]">
                {['Container', 'Status', 'CPU', 'Memória', 'Uptime'].map(h => (
                  <th key={h} className="text-left text-sm font-medium text-[#9CA3AF] pb-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E293B]">
              {[
                { name: 'kera-postgres', status: 'Up', cpu: '8.3%', mem: '1024 MB', uptime: '23h 45m' },
                { name: 'kera-redis', status: 'Up', cpu: '0.5%', mem: '64 MB', uptime: '23h 45m' },
                { name: 'kera-evolution', status: 'Up', cpu: '2.1%', mem: '256 MB', uptime: '23h 45m' },
                { name: 'kera-backend', status: 'Up', cpu: '4.5%', mem: '512 MB', uptime: '23h 45m' },
                { name: 'kera-frontend', status: 'Up', cpu: '1.2%', mem: '128 MB', uptime: '23h 45m' },
                { name: 'kera-n8n', status: 'Up', cpu: '3.8%', mem: '384 MB', uptime: '23h 45m' },
              ].map((container, idx) => (
                <tr key={idx} className="hover:bg-[#111827]/50">
                  <td className="py-4 font-mono text-sm text-[#F3F4F6]">{container.name}</td>
                  <td className="py-4"><span className="text-[#10B981]">🟢 {container.status}</span></td>
                  <td className="py-4 text-[#9CA3AF]">{container.cpu}</td>
                  <td className="py-4 text-[#9CA3AF]">{container.mem}</td>
                  <td className="py-4 text-[#9CA3AF]">{container.uptime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
