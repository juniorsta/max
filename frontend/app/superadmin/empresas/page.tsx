'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Card } from '@/components/Card';

interface Empresa {
  id: string;
  nome: string;
  status: string;
  createdAt: string;
  usuarios: { id: string; nome: string; email: string }[];
}

export default function SuperadminEmpresas() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ empresaNome: '', nome: '', email: '', senha: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;
    if (user.role !== 'superadmin') {
      router.push('/dashboard');
      return;
    }
    fetchEmpresas();
  }, [user]);

  const fetchEmpresas = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/companies`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Falha ao carregar');
      const data = await res.json();
      setEmpresas(data);
    } catch (e) {
      setError('Erro ao carregar empresas');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/companies`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error('Falha ao criar');
      setShowForm(false);
      setForm({ empresaNome: '', nome: '', email: '', senha: '' });
      fetchEmpresas();
    } catch (e) {
      setError('Erro ao criar empresa');
    }
  };

  if (loading) return <div className="p-6 text-white">Carregando...</div>;
  if (!user || user.role !== 'superadmin') return null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Gestão de Empresas</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancelar' : 'Nova Empresa'}
        </Button>
      </div>

      {error && <div className="text-red-400">{error}</div>}

      {showForm && (
        <Card>
          <form onSubmit={handleCreate} className="space-y-4">
            <Input label="Nome da Empresa" value={form.empresaNome} onChange={e => setForm({ ...form, empresaNome: e.target.value })} required />
            <Input label="Nome do Admin" value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} required />
            <Input label="Email do Admin" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            <Input label="Senha do Admin" type="password" value={form.senha} onChange={e => setForm({ ...form, senha: e.target.value })} required />
            <Button type="submit">Criar Empresa</Button>
          </form>
        </Card>
      )}

      <div className="grid gap-4">
        {empresas.map(emp => (
          <Card key={emp.id}>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-white">{emp.nome}</h3>
                <p className="text-sm text-gray-400">Status: {emp.status}</p>
                <p className="text-sm text-gray-500">Criado em: {new Date(emp.createdAt).toLocaleDateString('pt-BR')}</p>
                <p className="text-sm text-gray-400 mt-2">Admin: {emp.usuarios?.[0]?.nome} ({emp.usuarios?.[0]?.email})</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}