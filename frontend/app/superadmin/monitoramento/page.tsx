'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { Card } from '@/components/Card';

interface MonitoringData {
  cpu: { usage: number; cores: number };
  memory: { used: number; total: number; percent: number };
  disk: { used: number; total: number; percent: number };
  network: { upload: number; download: number };
  containers: Record<string, { status: string; cpu: number; memory: number }>;
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
      const monitoring = await res.json();
      setData(monitoring);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="text-purple-400">Carregando...</div></div>;
  }

  if (!data) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Monitoramento do Sistema</h1>
        <p className="text-slate-400 mt-1">Status em tempo real dos recursos e containers</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">CPU</p>
              <p className="text-3xl font-bold text-white mt-1">{data.cpu.usage}%</p>
              <p className="text-xs text-slate-500 mt-1">{data.cpu.cores} cores</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
              <div className="w-8 h-8 rounded-full border-4 border-green-400 border-t-transparent animate-spin" />
            </div>
          </div>
          <div className="mt-3 h-2 bg-[#0F172A] rounded-full overflow-hidden">
            <div 
              className="h-full bg-green-500 rounded-full transition-all duration-500"
              style={{ width: `${data.cpu.usage}%` }}
            />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Memória</p>
              <p className="text-3xl font-bold text-white mt-1">{data.memory.percent}%</p>
              <p className="text-xs text-slate-500 mt-1">{data.memory.used}/{data.memory.total} GB</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400">
              🧠
            </div>
          </div>
          <div className="mt-3 h-2 bg-[#0F172A] rounded-full overflow-hidden">
            <div 
              className="h-full bg-cyan-500 rounded-full transition-all duration-500"
              style={{ width: `${data.memory.percent}%` }}
            />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Disco</p>
              <p className="text-3xl font-bold text-white mt-1">{data.disk.percent}%</p>
              <p className="text-xs text-slate-500 mt-1">{data.disk.used}/{data.disk.total} GB</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-yellow-500/20 flex items-center justify-center text-yellow-400">
              💾
            </div>
          </div>
          <div className="mt-3 h-2 bg-[#0F172A] rounded-full overflow-hidden">
            <div 
              className="h-full bg-yellow-500 rounded-full transition-all duration-500"
              style={{ width: `${data.disk.percent}%` }}
            />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Rede</p>
              <p className="text-3xl font-bold text-white mt-1">{data.network.upload.toFixed(1)} GB/s</p>
              <p className="text-xs text-slate-500 mt-1">Upload</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
              📡
            </div>
          </div>
          <div className="mt-3 flex gap-1">
            <div className="h-2 flex-1 bg-blue-500 rounded-full" style={{ width: '60%' }} />
            <div className="h-2 flex-1 bg-blue-300 rounded-full" style={{ width: '40%' }} />
          </div>
        </Card>
      </div>

      <Card>
        <h2 className="text-lg font-semibold text-white mb-4">Containers</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 border-b border-[#334155]">
                <th className="pb-3 pr-4">Container</th>
                <th className="pb-3 pr-4">Status</th>
                <th className="pb-3 pr-4">CPU</th>
                <th className="pb-3 pr-4">Memória</th>
                <th className="pb-3">Uptime</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#334155]">
              {Object.entries(data.containers).map(([name, info]) => (
                <tr key={name} className="hover:bg-[#0F172A]/50">
                  <td className="py-3 pr-4 font-mono text-white capitalize">{name}</td>
                  <td className="py-3 pr-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      info.status === 'healthy' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {info.status === 'healthy' ? '🟢 Up' : '🔴 Down'}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-slate-400">{info.cpu}%</td>
                  <td className="py-3 pr-4 text-slate-400">{info.memory} MB</td>
                  <td className="py-3 text-slate-400">23h 45m</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 mt-4 text-right">Atualizado: {new Date().toLocaleTimeString('pt-BR')}</p>
      </Card>
    </div>
  );
}
