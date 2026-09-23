'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';

interface Log {
  id: string;
  userId: string;
  usuario: { nome: string; email: string };
  acao: string;
  ip: string;
  timestamp: string;
}

export default function LogsPage() {
  const { token } = useAuth();
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, [token]);

  const fetchLogs = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/superadmin/audit-logs?page=1&limit=50`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setLogs(data.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="text-purple-400">Carregando...</div></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Logs e Auditoria</h1>
          <p className="text-slate-400 mt-1">Histórico completo de ações na plataforma</p>
        </div>
        <Button variant="outline" onClick={fetchLogs}>Atualizar</Button>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 border-b border-[#334155]">
                <th className="pb-3 pr-4">Data/Hora</th>
                <th className="pb-3 pr-4">Usuário</th>
                <th className="pb-3 pr-4">Ação</th>
                <th className="pb-3 pr-4">IP</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#334155]">
              {logs.map(log => (
                <tr key={log.id} className="hover:bg-[#0F172A]/50">
                  <td className="py-3 pr-4 text-slate-400 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString('pt-BR')}
                  </td>
                  <td className="py-3 pr-4">
                    <div>
                      <p className="font-medium text-white">{log.usuario?.nome}</p>
                      <p className="text-xs text-slate-500">{log.usuario?.email}</p>
                    </div>
                  </td>
                  <td className="py-3 pr-4">
                    <span className="px-2 py-1 rounded bg-[#334155] text-xs text-white">{log.acao}</span>
                  </td>
                  <td className="py-3 pr-4 text-slate-400 font-mono text-xs">{log.ip}</td>
                  <td className="py-3 text-green-400">✅ Success</td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500">Nenhum log encontrado</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
