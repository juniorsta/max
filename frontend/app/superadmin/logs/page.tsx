'use client';

import { Card } from '@/components/Card';

const logs = [
  { data: '05/09/2025 14:32', usuario: 'João Silva', acao: 'Login', recurso: 'System', ip: '192.168.1.1', status: 'success' },
  { data: '05/09/2025 14:30', usuario: 'Maria Santos', acao: 'Create User', recurso: 'Users', ip: '192.168.1.5', status: 'success' },
  { data: '05/09/2025 14:28', usuario: 'Carlos Oliveira', acao: 'Update Plan', recurso: 'Billing', ip: '10.0.0.12', status: 'warning' },
  { data: '05/09/2025 14:25', usuario: 'Ana Costa', acao: 'Delete Company', recurso: 'Tenants', ip: '172.16.0.8', status: 'error' },
  { data: '05/09/2025 14:20', usuario: 'System', acao: 'Backup', recurso: 'Database', ip: 'Local', status: 'success' },
];

export default function LogsPage() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-[#10B981]';
      case 'warning': return 'text-[#F59E0B]';
      case 'error': return 'text-[#EF4444]';
      default: return 'text-[#9CA3AF]';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[32px] font-bold text-[#F3F4F6]">Logs e Auditoria</h1>
        <p className="text-[#9CA3AF] mt-1">Histórico completo de ações na plataforma</p>
      </div>

      <Card className="p-6 bg-[#1E293B] border-[#1E293B] rounded-xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1E293B]">
                {['Data/Hora', 'Usuário', 'Ação', 'Recurso', 'IP', 'Status'].map(h => (
                  <th key={h} className="text-left text-sm font-medium text-[#9CA3AF] pb-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E293B]">
              {logs.map((log, idx) => (
                <tr key={idx} className="hover:bg-[#111827]/50">
                  <td className="py-4 text-sm text-[#9CA3AF] whitespace-nowrap">{log.data}</td>
                  <td className="py-4 text-sm text-[#F3F4F6]">{log.usuario}</td>
                  <td className="py-4">
                    <span className="px-3 py-1 rounded-full text-xs bg-[#111827] text-[#F3F4F6]">{log.acao}</span>
                  </td>
                  <td className="py-4 text-sm text-[#9CA3AF]">{log.recurso}</td>
                  <td className="py-4 text-sm text-[#9CA3AF] font-mono">{log.ip}</td>
                  <td className={`py-4 text-sm font-medium ${getStatusColor(log.status)}`}>
                    {log.status === 'success' ? '✅ Success' : log.status === 'warning' ? '⚠️ Warning' : '❌ Failed'}
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
