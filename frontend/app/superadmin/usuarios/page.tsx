'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';

interface Usuario {
  id: string;
  nome: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
  empresa: { id: string; nome: string };
}

export default function UsuariosPage() {
  const { token } = useAuth();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!token) return;
    fetchUsuarios();
  }, [token, search]);

  const fetchUsuarios = async () => {
    try {
      const params = new URLSearchParams({ search, page: '1', limit: '50' });
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/superadmin/users?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setUsuarios(data.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (id: string) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/superadmin/users/${id}/reset-password`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ senha: '123456' })
      });
      alert('Senha resetada para: 123456');
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="text-purple-400">Carregando...</div></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Gestão de Usuários</h1>
          <p className="text-slate-400 mt-1">Gerencie todos os usuários da plataforma</p>
        </div>
      </div>

      <Input
        label="Buscar usuário"
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Nome ou email..."
      />

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 border-b border-[#334155]">
                <th className="pb-3 pr-4">Nome</th>
                <th className="pb-3 pr-4">Email</th>
                <th className="pb-3 pr-4">Empresa</th>
                <th className="pb-3 pr-4">Papel</th>
                <th className="pb-3 pr-4">Status</th>
                <th className="pb-3 pr-4">Criado em</th>
                <th className="pb-3">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#334155]">
              {usuarios.map(u => (
                <tr key={u.id} className="hover:bg-[#0F172A]/50">
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                        {u.nome[0]}
                      </div>
                      <span className="font-medium text-white">{u.nome}</span>
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-slate-400">{u.email}</td>
                  <td className="py-3 pr-4 text-slate-400">{u.empresa?.nome || 'Superadmin'}</td>
                  <td className="py-3 pr-4">
                    <span className="px-2 py-0.5 rounded bg-[#334155] text-xs text-white">{u.role}</span>
                  </td>
                  <td className="py-3 pr-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      u.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {u.status === 'active' ? '🟢 Ativo' : '🔴 Inativo'}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-slate-400">{new Date(u.createdAt).toLocaleDateString('pt-BR')}</td>
                  <td className="py-3">
                    <Button size="sm" variant="ghost" onClick={() => resetPassword(u.id)}>Resetar Senha</Button>
                  </td>
                </tr>
              ))}
              {usuarios.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">Nenhum usuário encontrado</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
