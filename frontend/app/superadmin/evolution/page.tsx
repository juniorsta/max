'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';

interface Instancia {
  id: string;
  nome: string;
  status: string;
  whatsappNumber: string;
  lastActivity: string;
}

export default function EvolutionPage() {
  const { token } = useAuth();
  const [instancias, setInstancias] = useState<Instancia[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInstancias();
  }, [token]);

  const fetchInstancias = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/superadmin/evolution/instances`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setInstancias(data || []);
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
          <h1 className="text-2xl font-bold text-white">Evolution API</h1>
          <p className="text-slate-400 mt-1">Gerencie as instâncias WhatsApp</p>
        </div>
        <Button>+ Nova Instância</Button>
      </div>

      <Card>
        <div className="text-center py-12">
          <div className="w-48 h-48 mx-auto bg-white p-4 rounded-lg">
            <div className="w-full h-full bg-gradient-to-br from-green-400 to-green-600 rounded flex items-center justify-center">
              <span className="text-white text-4xl">QR</span>
            </div>
          </div>
          <p className="text-slate-400 mt-4">Escaneie o QR Code para conectar</p>
          <Button className="mt-4">Atualizar QR Code</Button>
        </div>
      </Card>

      <div className="grid gap-4">
        {instancias.map(inst => (
          <Card key={inst.id}>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${inst.status === 'connected' ? 'bg-green-500' : 'bg-red-500'}`} />
                <div>
                  <h3 className="font-semibold text-white">{inst.nome}</h3>
                  <p className="text-sm text-slate-400">{inst.whatsappNumber}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-400">Última atividade</p>
                <p className="text-xs text-slate-500">{inst.lastActivity}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
