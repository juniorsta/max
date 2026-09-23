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
  createdAt: string;
  empresa: { id: string; nome: string };
}

export default function UsuariosPage() {
  const { user, token } = useAuth();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ nome: '', email: '', senha: '', role: 'user', empresaId: '' });

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

  if (loading) return <div className="p-6 text-white">Carregando...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Gestão de Usuários</h1>
      </div>

      <Input
        label="Buscar usuário"
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Nome ou email..."
      />

      <div className="grid gap-4">
        {usuarios.map(u => (
          <Card key={u.id}>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-white">{u.nome}</h3>
                <p className="text-sm text-gray-400">{u.email}</p>
                <p className="text-sm text-gray-500">Empresa: {u.empresa?.nome}</p>
                <p className="text-sm text-gray-500 mt-1">Papel: <span className="px-2 py-0.5 rounded bg-gray-700 text-xs">{u.role}</span></p>
              </div>
              <Button size="sm" variant="ghost" onClick={() => resetPassword(u.id)}>Resetar Senha</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
