'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { Card } from '@/components/Card';

interface EmpresaUsuario {
  empresaId: string;
  empresaNome: string;
  usuarios: { id: string; nome: string; email: string; role: string; createdAt: string }[];
}

export default function SuperadminUsuarios() {
  const { user, token } = useAuth();
  const [dados, setDados] = useState<EmpresaUsuario[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetchUsuarios();
  }, [user]);

  const fetchUsuarios = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/companies`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const empresas = await res.json();
      setDados(empresas.map((e: any) => ({
        empresaId: e.id,
        empresaNome: e.nome,
        usuarios: e.usuarios || []
      })));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6 text-white">Carregando...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Usuários da Plataforma</h1>
      
      {dados.map(emp => (
        <Card key={emp.empresaId}>
          <h2 className="text-lg font-semibold text-white mb-4">{emp.empresaNome}</h2>
          <div className="space-y-2">
            {emp.usuarios.map(u => (
              <div key={u.id} className="flex justify-between items-center py-2 border-b border-gray-800 last:border-0">
                <div>
                  <p className="text-white">{u.nome}</p>
                  <p className="text-sm text-gray-400">{u.email} • {u.role}</p>
                </div>
                <span className="text-xs text-gray-500">{new Date(u.createdAt).toLocaleDateString('pt-BR')}</span>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}