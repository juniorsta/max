'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { Card } from '@/components/Card';

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

  if (loading) return <div className="p-6 text-white">Carregando...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Logs de Auditoria</h1>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-400 border-b border-gray-800">
                <th className="pb-3 pr-4">Usuário</th>
                <th className="pb-3 pr-4">Ação</th>
                <th className="pb-3 pr-4">IP</th>
                <th className="pb-3">Data/Hora</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {logs.map(log => (
                <tr key={log.id} className="hover:bg-gray-800/50">
                  <td className="py-3 pr-4">
                    <div className="font-medium text-white">{log.usuario?.nome}</div>
                    <div className="text-xs text-gray-500">{log.usuario?.email}</div>
                  </td>
                  <td className="py-3 pr-4">
                    <span className="px-2 py-1 rounded bg-gray-700 text-xs">{log.acao}</span>
                  </td>
                  <td className="py-3 pr-4 text-gray-400 font-mono text-xs">{log.ip}</td>
                  <td className="py-3 text-gray-400">{new Date(log.timestamp).toLocaleString('pt-BR')}</td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-gray-500">Nenhum log encontrado</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
