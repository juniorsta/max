'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { Card } from '@/components/Card';

interface MonitoringData {
  cpu: { usage: number; cores: number };
  memory: { used: number; total: number; percent: number };
  disk: { used: number; total: number; percent: number };
  containers: Record<string, string>;
}

export default function MonitoramentoPage() {
  const { token } = useAuth();
  const [data, setData] = useState<MonitoringData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMonitoring();
    const interval = setInterval(fetchMonitoring, 30000);
    return () => clearInterval(interval);
  }, [token]);

  const fetchMonitoring = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/superadmin/monitoring`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setData(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6 text-white">Carregando...</div>;
  if (!data) return null;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Monitoramento do Sistema</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <h3 className="text-sm text-gray-400 mb-2">CPU</h3>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-bold text-white">{data.cpu.usage}%</span>
            <span className="text-gray-400 mb-1">{data.cpu.cores} cores</span>
          </div>
          <div className="mt-3 h-2 bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${data.cpu.usage}%` }} />
          </div>
        </Card>

        <Card>
          <h3 className="text-sm text-gray-400 mb-2">Memória</h3>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-bold text-white">{data.memory.percent}%</span>
            <span className="text-gray-400 mb-1">{data.memory.used}/{data.memory.total} GB</span>
          </div>
          <div className="mt-3 h-2 bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-purple-500 rounded-full" style={{ width: `${data.memory.percent}%` }} />
          </div>
        </Card>

        <Card>
          <h3 className="text-sm text-gray-400 mb-2">Disco</h3>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-bold text-white">{data.disk.percent}%</span>
            <span className="text-gray-400 mb-1">{data.disk.used}/{data.disk.total} GB</span>
          </div>
          <div className="mt-3 h-2 bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-yellow-500 rounded-full" style={{ width: `${data.disk.percent}%` }} />
          </div>
        </Card>
      </div>

      <Card>
        <h3 className="text-lg font-semibold text-white mb-4">Containers</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {Object.entries(data.containers).map(([name, status]) => (
            <div key={name} className={`p-4 rounded-lg text-center ${status === 'healthy' ? 'bg-green-500/20 border border-green-500/30' : 'bg-red-500/20 border border-red-500/30'}`}>
              <p className="text-sm text-gray-400 capitalize">{name}</p>
              <p className={`font-semibold ${status === 'healthy' ? 'text-green-400' : 'text-red-400'}`}>{status}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
